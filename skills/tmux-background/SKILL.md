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
tmux new-session -d -s SESSION_NAME 'COMMAND; read'
```

- Use descriptive session names: `build`, `test-suite`, `dev-server`, `watch`, etc.
- Single quotes around the command prevent premature shell expansion
- The `-d` flag detaches immediately (runs in background)
- **Always append `; read`** to keep the session alive after command completion
  - Without this, sessions terminate immediately when the command finishes
  - This prevents "can't find session" errors and preserves output history
  - The `read` command waits for input, keeping the pane open until explicitly killed

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
# Start (note the ; read to keep session alive)
tmux new-session -d -s build 'npm run build; read'

# Check status
tmux capture-pane -t build -p -S -20

# Clean up when done
tmux kill-session -t build
```

### Long-running server
```bash
# Start dev server (long-running, won't exit on its own)
tmux new-session -d -s dev-server 'npm run dev'

# Check if it's running
tmux capture-pane -t dev-server -p -S -10

# Stop when needed
tmux kill-session -t dev-server
```

**Note:** For truly long-running processes (servers, watch modes) that don't exit on their own, you can omit `; read`. Use it for tasks that complete and whose output you want to preserve.

### Multiple concurrent tasks
```bash
# Start multiple builds (with ; read to preserve output)
tmux new-session -d -s frontend 'cd frontend && npm run build; read'
tmux new-session -d -s backend 'cd backend && cargo build --release; read'
tmux new-session -d -s docs 'cd docs && hugo; read'

# Check all
tmux ls

# Monitor each
tmux capture-pane -t frontend -p -S -10
tmux capture-pane -t backend -p -S -10
tmux capture-pane -t docs -p -S -10
```

### Run command, wait a bit, then check
```bash
# Start the task (with ; read to keep session alive after completion)
tmux new-session -d -s tests 'pytest tests/ -v; read'

# Wait for it to make progress
sleep 5

# Check output
tmux capture-pane -t tests -p -S -30

# Even if tests finish quickly, session stays alive and output is preserved
```

## Error handling

- If `tmux new-session` fails with "duplicate session", either:
  - Kill the existing session first: `tmux kill-session -t SESSION_NAME`
  - Choose a different session name
  
- **If `tmux capture-pane` fails with "can't find session":**
  - The command finished and the session auto-terminated (forgot `; read`)
  - Always append `; read` to commands that complete to preserve output
  - Once the session is gone, the output history is lost

- If `tmux capture-pane` shows no output, the command may have:
  - Not produced any output yet (wait and check again)
  - Failed to start (check for errors in the first few lines)
  - Written output that has scrolled away (increase `-S` value)

- Check if a session is still running:
  ```bash
  tmux has-session -t SESSION_NAME 2>/dev/null && echo "Running" || echo "Finished or not found"
  ```

## Best practices

1. **Always append `; read`** to commands that complete (builds, tests, scripts) to preserve output
2. **Use descriptive session names** that indicate the task purpose
3. **Clean up sessions** when tasks complete—don't leave zombie sessions
4. **Check status periodically** for long-running tasks
5. **Capture sufficient output** (use `-S` flag to get more history)
6. **Don't attach interactively** from the agent—it blocks the workflow
7. **Verify the session started** with `tmux ls` immediately after creation
8. **Quote commands properly** to handle spaces and special characters

### When to use `; read`

✅ **Use `; read` for:**
- Build commands (npm, cargo, make, etc.)
- Test suites that complete
- One-shot scripts or data processing
- Any command that finishes and whose output you need

❌ **Skip `; read` for:**
- Web servers or dev servers (they don't exit)
- Watch modes (continuous running)
- Daemons or background services
- Any process that runs indefinitely

## Alternatives

- For truly fire-and-forget tasks that don't need monitoring: `nohup COMMAND &`
- For simple background processes: `COMMAND &` (loses output unless redirected)
- For scheduled tasks: `at` or `cron`

Tmux is preferred when you need:
- Scrollback buffer access
- Easy monitoring of output
- Ability to reattach later
- Multiple simultaneous tasks with separate contexts
