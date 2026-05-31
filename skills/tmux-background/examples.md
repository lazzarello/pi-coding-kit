# Tmux Background Task Examples

## Example 1: Running a long build in the background

```bash
# Start the build
tmux new-session -d -s mybuild 'npm run build'

# Verify it started
tmux ls

# Check progress after a few seconds
sleep 3
tmux capture-pane -t mybuild -p -S -20

# When done, clean up
tmux kill-session -t mybuild
```

## Example 2: Multiple concurrent test suites

```bash
# Start all test suites
tmux new-session -d -s unit-tests 'npm run test:unit'
tmux new-session -d -s integration-tests 'npm run test:integration'
tmux new-session -d -s e2e-tests 'npm run test:e2e'

# Check all sessions
tmux ls

# Monitor each one
tmux capture-pane -t unit-tests -p -S -15
tmux capture-pane -t integration-tests -p -S -15
tmux capture-pane -t e2e-tests -p -S -15

# Clean up all
tmux kill-session -t unit-tests
tmux kill-session -t integration-tests
tmux kill-session -t e2e-tests
```

## Example 3: Development server with monitoring

```bash
# Start dev server
tmux new-session -d -s dev-server 'npm run dev -- --port 3000'

# Wait for it to start
sleep 5

# Check if it's running
tmux capture-pane -t dev-server -p -S -20

# Keep working on other tasks...

# Later, check if still running
tmux has-session -t dev-server && echo "Server is up"

# Stop when done
tmux kill-session -t dev-server
```

## Example 4: Watch mode for continuous testing

```bash
# Start test watcher
tmux new-session -d -s test-watch 'npm run test -- --watch'

# Check initial output
sleep 2
tmux capture-pane -t test-watch -p -S -30

# Continue working, tests run in background
# User can attach later if they want: tmux attach -t test-watch

# Stop watch mode
tmux kill-session -t test-watch
```
