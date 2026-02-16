/**
 * Agent Invocation Helpers
 * 
 * This file provides helper functions for delegating tasks to specialized agents.
 * In this project, the Supervisor (opencode) handles agent delegation directly.
 * 
 * Usage: These functions serve as documentation for the workflow pattern.
 * The actual invocation is handled through the Task tool with agent prompts.
 */

export interface AgentTask {
  command: string;
  description: string;
  prompt: string;
  subagent_type: 'general' | 'explore';
}

export async function invokeCodeAgent(taskDescription: string): Promise<AgentTask> {
  return {
    command: '/code',
    description: 'Code implementation',
    prompt: `You are the Code Agent. ${taskDescription}

Follow the project conventions:
- Use TypeScript
- Follow existing patterns in the codebase
- Run lint/typecheck after implementation
- Report completion with changes made.`,
    subagent_type: 'general'
  };
}

export async function invokeResearchAgent(taskDescription: string): Promise<AgentTask> {
  return {
    command: '/research',
    description: 'Code research',
    prompt: `You are the Research Agent. ${taskDescription}

Search thoroughly:
- Use Glob to find relevant files
- Use Grep to search for patterns
- Report file paths with line numbers`,
    subagent_type: 'explore'
  };
}

export async function invokeDocsAgent(taskDescription: string): Promise<AgentTask> {
  return {
    command: '/docs',
    description: 'Documentation',
    prompt: `You are the Docs Agent. ${taskDescription}

Follow documentation conventions:
- Use clear headings
- Keep consistent formatting
- Update table of contents if needed`,
    subagent_type: 'general'
  };
}
