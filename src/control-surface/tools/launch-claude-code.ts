import { launchClaudeSession } from "../../claude-sessions/launch-session.ts";
import type { AutonomaConfig } from "../../config/load-config.ts";

type LaunchClaudeCodeToolInput = {
  cwd: string;
  prompt: string;
  session_name?: string;
  task_description?: string;
  todoist_task_id?: string;
};

export async function launchClaudeCodeTool(input: LaunchClaudeCodeToolInput, config?: AutonomaConfig) {
  const result = await launchClaudeSession({
    cwd: input.cwd,
    prompt: input.prompt,
    sessionName: input.session_name,
    taskDescription: input.task_description,
    todoistTaskId: input.todoist_task_id,
    claudeCommand: config?.claudeCliCommand,
  });

  return {
    ok: true,
    launch_id: result.launchId,
    tmux_session: result.tmuxSession,
    delivery: result.delivery,
  };
}
