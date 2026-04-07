export function resolveDaemonContainerContext(
  env: Record<string, string | undefined> = process.env,
): string | null {
  return env.UAGENT_CONTAINER_HINT?.trim() || env.UAGENT_CONTAINER?.trim() || null;
}
