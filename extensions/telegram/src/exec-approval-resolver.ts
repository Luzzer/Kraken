import type { UAGENTConfig } from "uagent/plugin-sdk/config-runtime";
import { isApprovalNotFoundError } from "uagent/plugin-sdk/error-runtime";
import { withOperatorApprovalsGatewayClient } from "uagent/plugin-sdk/gateway-runtime";
import type { ExecApprovalReplyDecision } from "uagent/plugin-sdk/infra-runtime";

export type ResolveTelegramExecApprovalParams = {
  cfg: UAGENTConfig;
  approvalId: string;
  decision: ExecApprovalReplyDecision;
  senderId?: string | null;
  allowPluginFallback?: boolean;
  gatewayUrl?: string;
};

export async function resolveTelegramExecApproval(
  params: ResolveTelegramExecApprovalParams,
): Promise<void> {
  await withOperatorApprovalsGatewayClient(
    {
      config: params.cfg,
      gatewayUrl: params.gatewayUrl,
      clientDisplayName: `Telegram approval (${params.senderId?.trim() || "unknown"})`,
    },
    async (gatewayClient) => {
      const requestApproval = async (
        method: "exec.approval.resolve" | "plugin.approval.resolve",
      ) => {
        await gatewayClient.request(method, {
          id: params.approvalId,
          decision: params.decision,
        });
      };
      if (params.approvalId.startsWith("plugin:")) {
        await requestApproval("plugin.approval.resolve");
      } else {
        try {
          await requestApproval("exec.approval.resolve");
        } catch (err) {
          if (!params.allowPluginFallback || !isApprovalNotFoundError(err)) {
            throw err;
          }
          await requestApproval("plugin.approval.resolve");
        }
      }
    },
  );
}
