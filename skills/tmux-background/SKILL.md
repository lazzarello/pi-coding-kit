---
name: tmux-background
description: Run background tasks and async jobs using tmux sessions. Use when the user asks to run something in the background, fork a process, run async, start a long-running task, or needs to detach from a process while keeping it alive.
---

# Tmux Background Tasks

Execute long-running commands in detached tmux sessions, allowing the agent to continue working while tasks run asynchronously.

## When to use

Load this skill when the user needs to:
- Run background tasks or processes
- Fork/detach a long-running command
- Start async jobs (builds, tests, servers, monitors)
- Keep a process alive while continuing other work
- Run multiple concurrent tasks
- Avoid blocking the current context window

## Workflow

### 1. Create a named tmux session

```bash
tmux new-session -d -s SESSION_NAME 'COMMAND'
```

- Use descriptive session names: `build`, `test-suite`, `dev-server`, `watch`, etc.
- Single quotes around the command prevent premature shell expansion
- The `-d` flag detaches immediately (runs in background)

### 2. Check running sessions

```bash
tmux ls
```

Lists all active tmux sessions with their names and status.

### 3. Monitor task output

```bash
tmux capture-pane -t SESSION_NAME -p
```

Captures the current scrollback buffer from the session without attaching.
Use this to check progress or completion status.

```bash
tmux capture-pane -t SESSION_NAME -p -S -50
```

The `-S -50` flag captures the last 50 lines (adjust as needed).

### 4. Attach to a session

If the user wants to interact with the running process:

```bash
tmux attach-session -t SESSION_NAME
```

**Note:** Don't attach from within the agent—it blocks. Tell the user to run this command themselves.

### 5. Kill a session

When the task is complete or needs to be stopped:

```bash
tmux kill-session -t SESSION_NAME
```

## Patterns

### Simple background task
```bash
# Start
tmux new-session -d -s build 'npm run build'

# Check status
tmux capture-pane -t build -p -S -20

# Clean up when done
tmux kill-session -t build
```

### Long-running server
```bash
# Start dev server
tmux new-session -d -s dev-server 'npm run dev'

# Check if it's running
tmux capture-pane -t dev-server -p -S -10

# Stop when needed
tmux kill-session -t dev-server
```

### Multiple concurrent tasks
```bash
# Start multiple builds
tmux new-session -d -s frontend 'cd frontend && npm run build'
tmux new-session -d -s backend 'cd backend && cargo build --release'
tmux new-session -d -s docs 'cd docs && hugo'

# Check all
tmux ls

# Monitor each
tmux capture-pane -t frontend -p -S -10
tmux capture-pane -t backend -p -S -10
tmux capture-pane -t docs -p -S -10
```

### Run command, wait a bit, then check
```bash
# Start the task
tmux new-session -d -s tests 'pytest tests/ -v'

# Wait for it to make progress
sleep 5

# Check output
tmux capture-pane -t tests -p -S -30
```

## Error handling

- If `tmux new-session` fails with "duplicate session", either:
  - Kill the existing session first: `tmux kill-session -t SESSION_NAME`
  - Choose a different session name
  
- If `tmux capture-pane` shows no output, the command may have:
  - Completed very quickly
  - Failed immediately (check exit status)
  - Not produced any output yet (wait and check again)

- Check if a session is still running:
  ```bash
  tmux has-session -t SESSION_NAME 2>/dev/null && echo "Running" || echo "Finished or not found"
  ```

## Best practices

1. **Use descriptive session names** that indicate the task purpose
2. **Clean up sessions** when tasks complete—don't leave zombie sessions
3. **Check status periodically** for long-running tasks
4. **Capture sufficient output** (use `-S` flag to get more history)
5. **Don't attach interactively** from the agent—it blocks the workflow
6. **Verify the session started** with `tmux ls` immediately after creation
7. **Quote commands properly** to handle spaces and special characters

## Alternatives

- For truly fire-and-forget tasks that don't need monitoring: `nohup COMMAND &`
- For simple background processes: `COMMAND &` (loses output unless redirected)
- For scheduled tasks: `at` or `cron`

Tmux is preferred when you need:
- Scrollback buffer access
- Easy monitoring of output
- Ability to reattach later
- Multiple simultaneous tasks with separate contexts
