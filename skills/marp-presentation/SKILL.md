---
name: marp-presentation
description: Create slide deck presentations as Markdown using the Marp framework, then render them to HTML, PDF, or PPTX. Use when the user asks for slides, a deck, a presentation, or asks to convert content into PowerPoint or PDF slides.
---

# Marp Presentation

Generate slide decks as Marp-flavored Markdown, then render with the `marp` CLI.

## Authoring rules

1. Write the deck to a `.md` file (default: `deck.md` in the current directory).
2. Start every deck with this YAML front-matter:
```yaml
   ---
   marp: true
   theme: default
   paginate: true
   ---
```
3. Separate slides with `---` on its own line (blank line above and below).
4. Keep each slide to ~5 bullets or ~40 words. Prefer short titles.
5. Use `<!-- _class: lead -->` inside a slide for title/section dividers.
6. Per-slide directives use a leading underscore (`_class`, `_backgroundColor`).
   Without the underscore, the directive applies to all following slides.

## Rendering

Pick the format the user asked for. Default to PDF if unspecified.

```bash
marp deck.md                 # → deck.html
marp deck.md --pdf           # → deck.pdf
marp deck.md --pptx          # → deck.pptx (editable in PowerPoint)
marp deck.md --html --allow-local-files   # if the deck embeds local images
```

For iterative authoring, the user can run `marp -w deck.md` themselves to get a
hot-reloading browser preview. Don't start watch mode from inside the agent —
it blocks.

## Workflow

1. Confirm or infer the output format (html / pdf / pptx).
2. Write `deck.md` using the authoring rules above.
3. Run the appropriate `marp` command via bash.
4. Report the output filename and slide count to the user.

## Verification

After rendering, run `ls -la deck.*` to confirm the output exists and report
its size. If `marp` exits non-zero, surface stderr verbatim — don't summarize.
