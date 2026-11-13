import { Client } from "@modelcontextprotocol/sdk/client";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp";
import { writeFileSync, mkdirSync } from "node:fs";

const SERVER_URL = "https://mcp-api.op.gg/mcp";

const TOOL = "lol_list_lane_meta_champions";
const ARGS: Record<string, unknown> = {
    position: "all",
    desired_output_fields: [
        "data.positions.top[].{ban_rate,champion,is_rip,kda,kill,pick_rate,play,rank,rank_prev,rank_prev_patch,role_rate,tier,win,win_rate}",
        "data.positions.jungle[].{ban_rate,champion,is_rip,kda,kill,pick_rate,play,rank,rank_prev,rank_prev_patch,role_rate,tier,win,win_rate}",
        "data.positions.mid[].{ban_rate,champion,is_rip,kda,kill,pick_rate,play,rank,rank_prev,rank_prev_patch,role_rate,tier,win,win_rate}",
        "data.positions.adc[].{ban_rate,champion,is_rip,kda,kill,pick_rate,play,rank,rank_prev,rank_prev_patch,role_rate,tier,win,win_rate}",
        "data.positions.support[].{ban_rate,champion,is_rip,kda,kill,pick_rate,play,rank,rank_prev,rank_prev_patch,role_rate,tier,win,win_rate}",
        "lang",
        "position_filter",
    ],
};

const client = new Client({ name: "lol-stats-prove", version: "0.1.0" });
await client.connect(new StreamableHTTPClientTransport(new URL(SERVER_URL)));

try {
    if (!TOOL) {
        const { tools } = await client.listTools();
        for (const t of tools) {
            console.log(`\n=== ${t.name} ===`);
            console.log(t.description);
            console.log(JSON.stringify(t.inputSchema, null, 2));
        }
    } else {
        const result = await client.callTool({ name: TOOL, arguments: ARGS });
        mkdirSync("scratch", { recursive: true });
        writeFileSync("scratch/opgg-output.json", JSON.stringify(result, null, 2));

        const blocks = (result.content ?? []) as { type: string, text?: string }[];
        for (const b of blocks) {
            if (b.type !== "text" || !b.text) continue;
            writeFileSync("scratch/opgg-text.txt", b.text);
            console.log("length:", b.text.length);
            console.log("ends with:", b.text.slice(-200));
            console.log(b.text.slice(0, 3000));
            
            const lists = b.text.split("],[");
            console.log("lists:", lists.length);
            for (const l of lists) {
                const records = l.match(/Top\("[^"]*"/g) ?? [];
                console.log(records.length, "records:", records.slice(0, 2).join(" | "), "...", records.at(-1));
            }
            try {
                JSON.parse(b.text);
                console.log("\n>>> This block is valid JSON");
            } catch {
                console.log("\n>>> This block is NOT JSON (text format, needs a custom parser)");
            }
        }
    }
} finally {
    await client.close();
}