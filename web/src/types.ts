export interface Player {
    puuid: string;
    game_name: string;
    tag_line: string;
}

export interface Summary {
    games: number;
    wins: number | null;
    win_rate: number | null;
    kda: number | null;
}