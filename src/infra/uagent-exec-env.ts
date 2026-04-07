export const UAGENT_CLI_ENV_VAR = "UAGENT_CLI";
export const UAGENT_CLI_ENV_VALUE = "1";

export function markUAGENTExecEnv<T extends Record<string, string | undefined>>(env: T): T {
  return {
    ...env,
    [UAGENT_CLI_ENV_VAR]: UAGENT_CLI_ENV_VALUE,
  };
}

export function ensureUAGENTExecMarkerOnProcess(
  env: NodeJS.ProcessEnv = process.env,
): NodeJS.ProcessEnv {
  env[UAGENT_CLI_ENV_VAR] = UAGENT_CLI_ENV_VALUE;
  return env;
}
