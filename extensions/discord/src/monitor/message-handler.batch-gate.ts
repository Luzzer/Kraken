import type { ReplyToMode } from "uagent/plugin-sdk/config-runtime";
import type { ReplyThreadingPolicy } from "uagent/plugin-sdk/reply-reference";
import { resolveBatchedReplyThreadingPolicy } from "uagent/plugin-sdk/reply-reference";

type ReplyThreadingContext = {
  ReplyThreading?: ReplyThreadingPolicy;
};

export function applyImplicitReplyBatchGate<T extends object>(
  ctx: T,
  replyToMode: ReplyToMode,
  isBatched: boolean,
) {
  const replyThreading = resolveBatchedReplyThreadingPolicy(replyToMode, isBatched);
  if (!replyThreading) {
    return;
  }
  (ctx as T & ReplyThreadingContext).ReplyThreading = replyThreading;
}
