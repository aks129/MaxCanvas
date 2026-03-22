import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

let mcpClient: Client | null = null;
let connectionPromise: Promise<Client> | null = null;

function getMcpUrl(): string {
  const host = process.env.MCP_HTTP_HOST || "127.0.0.1";
  const port = process.env.MCP_HTTP_PORT || "3001";
  const path = process.env.MCP_HTTP_PATH || "/mcp";
  return `http://${host}:${port}${path}`;
}

async function createClient(): Promise<Client> {
  const client = new Client(
    { name: "maxcanvas", version: "1.0.0" },
    { capabilities: {} }
  );

  const transport = new StreamableHTTPClientTransport(new URL(getMcpUrl()));
  await client.connect(transport);

  return client;
}

async function getClient(): Promise<Client> {
  if (mcpClient) return mcpClient;

  if (!connectionPromise) {
    connectionPromise = createClient()
      .then((client) => {
        mcpClient = client;
        connectionPromise = null;
        return client;
      })
      .catch((err) => {
        connectionPromise = null;
        throw err;
      });
  }

  return connectionPromise;
}

export async function callTool(
  toolName: string,
  args: Record<string, unknown> = {}
): Promise<unknown> {
  const client = await getClient();
  const result = await client.callTool({ name: toolName, arguments: args });

  if (result.isError) {
    throw new Error(
      `MCP tool error (${toolName}): ${JSON.stringify(result.content)}`
    );
  }

  // MCP tools return content as an array of content blocks
  const content = result.content as Array<{ type: string; text?: string }>;
  const textContent = content?.find((c) => c.type === "text");

  if (textContent?.text) {
    try {
      return JSON.parse(textContent.text);
    } catch {
      return textContent.text;
    }
  }

  return result.content;
}

export async function healthCheck(): Promise<boolean> {
  try {
    await callTool("canvas_health_check");
    return true;
  } catch {
    return false;
  }
}
