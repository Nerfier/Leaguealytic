export interface Player {
    puuid: string;
    game_name: string;
    tag_line: string;
}

export interface Summary {
    matchSummary: matchSummary;
    soloSummary: leagueSummary;
    flexSummary: leagueSummary;
}

export interface matchSummary {
    games: number;
    wins: number | null;
    win_rate: number | null;
    kda: number | null;
}

export interface leagueSummary {
    queue: string;
    tier: string;
    rank: string;
    lp: number;
    wins: number;
    losses: number;
    win_rate: number | null;
}

export interface Champion {
    champion: string;
    games: number;
    win_rate: number | null;
    kda: number | null;
}

export interface MatchRow {
    match_id: string;
    game_start: number;
    duration: number;
    queue_id: number;
    champion_id: string;
    champion_name: string
    position: string | null;
    win: number;
    kills: number;
    deaths: number;
    assists: number;
    cs: number;
    damage: number;
    vision_score: number;
}

export interface ComboRow {
    role: "ADC" | "Support";
    partner: string;
    combo_type: string;
    games?: number;
    win_rate?: number;
}

export const QUEUES: Record<string, [min: number, max: number, label: string]> = {
    normal_draft: [400, 400, "Normal Draft"],
    ranked_solo: [420, 420, "Ranked Solo"],
    ranked_flex: [440, 440, "Ranked Flex"],
    aram: [450, 450, "ARAM"],
    swiftplay: [480, 480, "Swiftplay"],
    arena: [1700, 1799, "Arena"],
};

export const getQueueLabel = ({ id, key }: { id?: number, key?: string }): string => {
    let group = null;
    if (id) group = Object.values(QUEUES).find(([min, max, ]) => (id >= min && id <= max));
    else if (key) group = QUEUES[key];
    return group ? group[2] : String(id) || key || "err";
}

export const getQueueRange = ({ name, key } : { name?: string, key?: string }): {min: number, max: number} | null => {
    let group = null;
    if (name) group = Object.values(QUEUES).find(([, , label]) => label === name)
    else if (key) group = QUEUES[key];
    return group ? { min: group[0], max: group[1]} : null;
};


