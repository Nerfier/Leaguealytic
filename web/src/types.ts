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