import type { ExecApprovalReplyDecision } from "uagent/plugin-sdk/approval-runtime";
import type { UAGENTConfig } from "uagent/plugin-sdk/config-runtime";
import { isApprovalNotFoundError } from "uagent/plugin-sdk/error-runtime";
import { withOperatorApprovalsGatewayClient } from "uagent/plugin-sdk/gateway-runtime";

export { isApprovalNotFoundError };

export async function resolveMatrixExecApproval(params: {
  cfg: UAGENTConfig;
  approvalId: string;
  decision: ExecApprovalReplyDecision;
  senderId?: string | null;
  gatewayUrl?: string;
}): Promise<void> {
  await withOperatorApprovalsGatewayClient(
    {
      config: params.cfg,
      gatewayUrl: params.gatewayUrl,
      clientDisplayName: `Matrix approval (${params.senderId?.trim() || "unknown"})`,
    },
    async (gatewayClient) => {
      await gatewayClient.request("exec.approval.resolve", {
        id: params.approvalId,
        decision: params.decision,
      });
    },
  );
}
