import { Client } from "@modelcontextprotocol/sdk/client";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp";


const SERVER_URL = "https://mcp-api.op.gg/mcp";
const ROLES = ["top", "jungle", "mid", "adc", "support"];

const FIELDS = ROLES.map(
    r =>
        `data.positions.${r}[].{ban_rate,champion,is_rip,kda,kill,pick_rate,play,rank,rank_prev,rank_prev_patch,role_rate,tier,win,win_rate}`
).concat(["lang", "position_filter"]);

export const fetchLaneMetaText = async (): Promise<string> => {
    const client = new Client({ name: "lol-stats", version: "0.1.0"});
    await client.connect(new StreamableHTTPClientTransport(new URL(SERVER_URL)));
    try {
        const result = await client.callTool({
           name: "lol_list_lane_meta_champions",
           arguments: { position: "all", desired_output_fields: FIELDS}, 
        });
        if (result.isError) throw new Error(`OP.GG tool error: ${JSON.stringify(result.content)}`);

        const blocks = (result.content ?? []) as { type: string; text?: string }[];
        const text = blocks.find(b => b.type === "text" && b.text)?.text;
        if (!text) throw new Error("OP.GG returned no text content");
        return text
    } finally {
        await client.close();
    }
}