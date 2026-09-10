---
description: Create a Merge Request (MR) from the current branch
---

Commit and push all changes from this branch to origin and create a MR using the `glab` utility.

Summarize:

- The referenced issue goal into a title
- key technical details into a description
- acceptance criteria appended into a description

Run:
`glab mr create -t {{title}} -d {{description}}`
where title and description are generated from the summary above
