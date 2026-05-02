# Question Extension

Interactive tool that lets Pi ask users questions with multiple choice options or custom text input.

## Features

- Present multiple choice options to users
- Allow custom text input via "Type something..." option
- Full TUI interface with keyboard navigation
- Clean display with option descriptions
- Escape to cancel or go back

## Usage

When Pi needs user input to make a decision, it can use the `question` tool:

```typescript
// Pi will automatically use this tool when needed
question({
  question: "Which environment should I deploy to?",
  options: [
    { label: "Development", description: "Local testing environment" },
    { label: "Staging", description: "Pre-production testing" },
    { label: "Production", description: "Live environment" }
  ]
})
```

## User Experience

Users navigate with:
- **↑/↓** - Navigate between options
- **Enter** - Select current option
- **Esc** - Cancel or go back
- If "Type something..." is selected, they can enter custom text

## See Also

Full documentation: [docs/extensions/question.md](../../docs/extensions/question.md)
