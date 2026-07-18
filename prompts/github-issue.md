---
description: Read a GitHub issue by number from the current project
argument-hint: "<issue number>"
---
Read issue #$1 from the current GitHub repository.

- Use the `gh` CLI to fetch the issue
- First check auth with `gh auth status`; if not authenticated, run `gh auth login`
- Fetch the issue details with: `gh issue view $1 --json title,body,state,author,comments,url`
- Display the issue title, state, author, body, and a summary of comments
- If issue #$1 not found, report the error
