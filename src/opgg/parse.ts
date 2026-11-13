const EXPECTED_FIELDS =
    "champion,is_rip,play,win,kill,win_rate,pick_rate,role_rate,ban_rate,kda,tier,rank,rank_prev,rank_prev_patch";

const POSITION_MAP: Record<string, string> = {
    top: "TOP", jungle: "JUNGLE", mid: "MIDDLE", adc: "BOTTOM", support: "UTILITY",
};

// Names that the generic rule below gets wrong
const NAME_OVERRIDES: Record<string, string> = {
    "Wukong": "MonkeyKing",
    "Nunu & Willump": "Nunu",
    "Renata Glasc": "Renata",
    "Kog'Maw": "KogMaw",
    "Rek'Sai": "RekSai",
    "K'Sante": "KSante",
    "LeBlanc": "Leblanc",
};

export function normalizeName(name: string): string {
    const override = NAME_OVERRIDES[name]; 
    if (override) return override;
    return name
        .replace(/'(\w)/g, (_, c: string) => c.toLowerCase()) // Kai'Sa -> Kaisa
        .replace(/[^A-Za-z0-9]/g, "");                         // Dr. Mundo -> DrMundo
}

export interface MetaRow {
    championName: string;
    position: string;
    games: number;
    wins: number;
    kills: number;
    winRate: number;
    pickRate: number;
    banRate: number;
    roleRate: number;
    kda: number;
    metaTier: number;
    metaRank: number;
    rankPrev: number | null;
    isRip: number;
}

function classFields(text: string, className: string): string[] {
    const line = text.match(new RegExp(`^class ${className}: (.+)$`, "m"));
    if (!line || !line?.[1]) throw new Error(`OP.GG format changed: no "class ${className}" line`);
    return line[1].split(",").map((s) => s.trim());
}

export function parseLaneMeta(text: string): MetaRow[] {
    const fields = classFields(text, "Top");
    if (fields.join(",") !== EXPECTED_FIELDS) {
        throw new Error(`OP.GG field order changed: ${fields.join(",")}`);
    }
    const positions = classFields(text, "Positions");

    const marker = "Positions([";
    const start = text.indexOf(marker);
    if (start === -1) throw new Error("OP.GG format changed: no data section");
    const lists = text.slice(start + marker.length).split("],[");
    if (lists.length !== positions.length) {
        throw new Error(`Expected ${positions.length} lists, got ${lists.length}`);
    }

    // Quoted name, boolean, then only numbers up to the closing parenthesis
    const record = /Top\("((?:[^"\\]|\\.)*)",(true|false),([^)]*)\)/g;
    const rows: MetaRow[] = [];

    lists.forEach((chunk, i) => {
        const positionName = positions[i];
        const position = positionName ? POSITION_MAP[positionName] : undefined;
        if (!position) throw new Error(`Unknown position "${positionName}"`);

        for (const m of chunk.matchAll(record)) {
            if (m[1] === undefined || m[3] === undefined) continue;
            const raw = m[3].split(",").map(s => s.trim());
            if (raw.length !== fields.length - 2) {
                throw new Error(`Bad record for ${m[1]}: ${m[3]}`);
            }

            const n = raw.map(s => (s === "null" ? null : Number(s)));
            if (n.some(v => v !== null && Number.isNaN(v))) {
                throw new Error(`Bad record for ${m[1]}: ${m[3]}`);
            }

            const at = (idx: number): number => {
                const v = n[idx];
                if (v === undefined || v === null) throw new Error(`Missing value ${idx} for ${m[1]}`);
                return v;
            };
            const atOrNull = (idx: number): number | null => n[idx] ?? null;

            const games = at(0);
            const wins = at(1);

            rows.push({
                championName: normalizeName(m[1]),
                position,
                games,
                wins,
                kills: at(2),
                winRate: games > 0 ? (wins / games) : 0,
                pickRate: at(4),
                roleRate: at(5),
                banRate: at(6),
                kda: at(7),
                metaTier: at(8),
                metaRank: at(9),
                rankPrev: atOrNull(10),
                isRip: m[2] === "true" ? 1 : 0,
            });
        }
    });

    if (rows.length < 100) throw new Error(`Only ${rows.length} rows parsed, refusing to save`);
    return rows;
}