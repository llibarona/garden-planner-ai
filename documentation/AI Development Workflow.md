# AI Development Workflow

## Overview

For an AI-led development approach with a small team using opencode, this document defines a **Supervisor-Worker pattern** where the main agent acts as orchestrator, delegating to specialized sub-agents for specific tasks.

---

## Agent Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Human Developer                        │
│              (Reviews, Approves, Decisions)              │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│              Supervisor Agent (opencode)                  │
│  - Understands requirements                              │
│  - Plans tasks & delegates to specialists                │
│  - Coordinates execution                                  │
│  - Validates results                                     │
└─────────────────────┬───────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
┌───────────────┐ ┌─────────┐ ┌──────────────┐
│  Code Agent   │ │Research │ │  Docs Agent  │
│  (Implement)  │ │ Agent   │ │  (Writing)   │
└───────────────┘ └─────────┘ └──────────────┘
```

---

## Agent Definitions

### 1. Supervisor Agent (Primary)

| Attribute | Description |
|-----------|-------------|
| **Role** | Project orchestrator, requirement analyzer |
| **When invoked** | Every session start, major decision points |
| **Tasks** | Understand user request → Plan → Delegate → Validate |
| **Subroutines** | Break down features into atomic tasks, assign to specialists |

**Responsibilities:**
- Analyze incoming requirements from human developer
- Research existing codebase before planning
- Create task breakdowns with clear steps
- Delegate to appropriate sub-agents
- Validate implementation against requirements
- Run lint/typecheck before reporting completion
- Coordinate documentation updates

---

### 2. Code Agent (Sub-agent)

| Attribute | Description |
|-----------|-------------|
| **Role** | Implementation specialist |
| **When invoked** | For building features, bug fixes, refactoring |
| **Tasks** | Write code, run linters, basic testing |
| **Tools** | Read, Edit, Write, Glob, Grep, Bash |

**Responsibilities:**
- Implement features according to task breakdown
- Follow code conventions (existing patterns, libraries)
- Run lint/typecheck after implementation
- Fix simple issues without escalation
- Report completion with summary of changes

---

### 3. Research Agent (Sub-agent)

| Attribute | Description |
|-----------|-------------|
| **Role** | Codebase exploration, pattern analysis |
| **When invoked** | When investigating bugs, understanding existing code |
| **Tasks** | Find files, trace logic, analyze patterns |
| **Tools** | Glob, Grep, Read, Task (explore) |

**Responsibilities:**
- Search for relevant code files
- Trace bug-related code paths
- Analyze existing patterns and conventions
- Report findings with file locations and line numbers

---

### 4. Docs Agent (Sub-agent)

| Attribute | Description |
|-----------|-------------|
| **Role** | Documentation specialist |
| **When invoked** | For writing/modifying docs, README updates |
| **Tasks** | Draft docs, format, maintain consistency |

**Responsibilities:**
- Write and update documentation
- Maintain consistency with existing docs
- Format content appropriately

---

## Workflow Patterns

### Pattern A: Feature Implementation

```
1. User describes feature
2. Supervisor: Analyzes requirements
3. Supervisor: Uses Research Agent to understand existing code structure
4. Supervisor: Plans implementation steps
5. Supervisor: Delegates to Code Agent (iterates)
6. Code Agent: Implements, runs lint/typecheck
7. Supervisor: Validates against requirements
8. Supervisor: Delegates to Docs Agent if needed
9. Supervisor: Reports completion
```

### Pattern B: Bug Investigation

```
1. User reports bug
2. Supervisor: Uses Research Agent to find relevant code
3. Supervisor: Analyzes root cause
4. Supervisor: Plans fix
5. Supervisor: Delegates to Code Agent
6. Code Agent: Implements fix
7. Supervisor: Validates fix works
```

### Pattern C: Code Review

```
1. User requests review
2. Supervisor: Reads changed files
3. Supervisor: Analyzes for issues
4. Supervisor: Reports findings with severity
5. User decides action
```

---

## Decision Points & Handoffs

| Trigger | Agent | Next Action |
|---------|-------|-------------|
| New feature request | Supervisor | Research → Plan → Code Agent |
| Bug report | Supervisor | Research → Code Agent |
| Documentation need | Supervisor | Docs Agent |
| Unclear requirements | Supervisor | Ask user clarification |
| Code implementation complete | Code Agent | Report to Supervisor |
| Research complete | Research Agent | Report to Supervisor |
| Implementation blocked | Code Agent | Request Supervisor help |

---

## Interaction Rules

1. **Always start with Supervisor** - User messages come to the main agent first
2. **Sub-agents are invisible** - Delegation is handled internally
3. **Atomic commits** - Each feature/bug = separate logical change
4. **Validation before reporting** - Always run lint/typecheck before completion
5. **Human in loop** - Major decisions, final approval = human developer

---

## Session Workflow Example

```
User: "Add plant dragging to canvas"

Supervisor:
├─ [Research] Finding canvas components...
├─ [Plan] Task breakdown:
│   1. Add drag handlers to PlantObject
│   2. Update gardenStore for placement
│   3. Add validation on drop
├─ [Delegate] Code Agent: Implement drag-drop
├─ [Validate] Run lint → Passed
└─ [Report] Feature implemented ✓
```

---

## Team Context

- **Team size:** Small (2-5 people)
- **Primary AI tool:** opencode
- **Workflow style:** Flexible (TDD + BDD mix)
- **Development approach:** AI-led (AI implements, human reviews)

---

## Agent Invocation

Agents are defined in `agents/` directory and can be invoked using the Task tool:

### Code Agent
```
Task description: "Implement feature"
prompt: "/code Add drag-drop to canvas"
subagent_type: "general"
```

### Research Agent
```
Task description: "Find relevant code"
prompt: "/research Find plant database files"
subagent_type: "general"
```

### Docs Agent
```
Task description: "Update documentation"
prompt: "/docs Update API docs"
subagent_type: "general"
```

Helper functions are available in `agents/invoke.ts` for cleaner delegation.
