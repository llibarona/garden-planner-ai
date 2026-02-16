# Agents

This directory contains agent definitions for the Garden Planner AI project.

## Agent Types

| Agent | Description | Invoke |
|-------|-------------|--------|
| Supervisor | Project orchestrator | Default (me) |
| Code | Implementation specialist | `/code` or Task tool |
| Research | Codebase exploration | `/research` or Task tool |
| Docs | Documentation | `/docs` or Task tool |

## Usage

Agents are invoked through the Task tool with the appropriate subagent_type:

```typescript
// Code Agent - for implementation tasks
Task(description="Implement feature", prompt="/code Implement drag-drop for plants", subagent_type="general")

// Research Agent - for exploration tasks  
Task(description="Find relevant code", prompt="/research Find canvas components", subagent_type="general")

// Docs Agent - for documentation tasks
Task(description="Write docs", prompt="/docs Update README", subagent_type="general")
```

## Agent Prompts

The agent prompts are defined in `agents/index.ts` and can be loaded to customize behavior.
