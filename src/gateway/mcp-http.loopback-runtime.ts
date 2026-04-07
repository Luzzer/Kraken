export type McpLoopbackRuntime = {
  port: number;
  token: string;
};

let activeRuntime: McpLoopbackRuntime | undefined;

export function getActiveMcpLoopbackRuntime(): McpLoopbackRuntime | undefined {
  return activeRuntime ? { ...activeRuntime } : undefined;
}

export function setActiveMcpLoopbackRuntime(runtime: McpLoopbackRuntime): void {
  activeRuntime = { ...runtime };
}

export function clearActiveMcpLoopbackRuntime(token: string): void {
  if (activeRuntime?.token === token) {
    activeRuntime = undefined;
  }
}

export function createMcpLoopbackServerConfig(port: number) {
  return {
    mcpServers: {
      uagent: {
        type: "http",
        url: `http://127.0.0.1:${port}/mcp`,
        headers: {
          Authorization: "Bearer ${UAGENT_MCP_TOKEN}",
          "x-session-key": "${UAGENT_MCP_SESSION_KEY}",
          "x-uagent-agent-id": "${UAGENT_MCP_AGENT_ID}",
          "x-uagent-account-id": "${UAGENT_MCP_ACCOUNT_ID}",
          "x-uagent-message-channel": "${UAGENT_MCP_MESSAGE_CHANNEL}",
        },
      },
    },
  };
}
