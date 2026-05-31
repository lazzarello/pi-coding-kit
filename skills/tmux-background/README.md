# Tmux Background Tasks Skill

A Pi coding agent skill for managing long-running tasks and async jobs using tmux.

## Purpose

This skill provides instructions and patterns for running background processes without blocking the agent's context window. It's triggered when users ask to:

- Run something in the background
- Fork or detach a process
- Start async/concurrent tasks
- Keep long-running jobs alive

## Files

- `SKILL.md` - Main skill definition with triggers, patterns, and best practices
- `examples.md` - Common usage patterns and real-world examples

## Key Concepts

- **Detached sessions**: Start tasks with `tmux new-session -d`
- **Non-blocking monitoring**: Check output with `tmux capture-pane`
- **Clean lifecycle**: Create, monitor, and kill sessions explicitly
- **Multiple concurrent tasks**: Run several background jobs simultaneously

## Quick Reference

```bash
# Start background task (append ; read to preserve output after completion)
tmux new-session -d -s task-name 'command; read'

# Check status
tmux capture-pane -t task-name -p -S -20

# Clean up
tmux kill-session -t task-name
```

### Critical: Use `; read` for completing commands

Always append `; read` to commands that finish (builds, tests, scripts). This keeps the session alive after completion and preserves output. Without it, the session terminates immediately and you'll get "can't find session" errors.

Skip `; read` only for processes that run indefinitely (servers, watch modes).

## Integration

When Pi detects keywords like "background", "async", "fork", "detach", or "long-running", this skill is loaded to provide appropriate tmux-based solutions instead of blocking bash commands.
