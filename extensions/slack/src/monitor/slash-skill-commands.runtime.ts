import { listSkillCommandsForAgents as listSkillCommandsForAgentsImpl } from "uagent/plugin-sdk/command-auth";

type ListSkillCommandsForAgents =
  typeof import("uagent/plugin-sdk/command-auth").listSkillCommandsForAgents;

export function listSkillCommandsForAgents(
  ...args: Parameters<ListSkillCommandsForAgents>
): ReturnType<ListSkillCommandsForAgents> {
  return listSkillCommandsForAgentsImpl(...args);
}
