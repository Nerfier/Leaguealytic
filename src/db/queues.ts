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
