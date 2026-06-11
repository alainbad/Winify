# UI/UX Pro Max - Design Intelligence Overview

This is a comprehensive design system guide spanning **50+ styles, 161 color palettes, 57 font pairings, and 99 UX guidelines** for web and mobile development across 10 technology stacks.

## Core Purpose

The skill addresses UI structure, visual design decisions, interaction patterns, and user experience quality. It's invoked when tasks involve how features "look, feel, move, or are interacted with."

## Ten Priority Rule Categories

The framework organizes guidance by impact level:

1. **Accessibility (CRITICAL)** — Contrast ratios, focus states, alt text, keyboard navigation
2. **Touch & Interaction (CRITICAL)** — Target sizing (44×44pt minimum), spacing, feedback
3. **Performance (HIGH)** — Image optimization, lazy loading, CLS prevention
4. **Style Selection (HIGH)** — Consistency, SVG icons, platform adaptation
5. **Layout & Responsive (HIGH)** — Mobile-first, breakpoints, viewport configuration
6. **Typography & Color (MEDIUM)** — Line height, semantic tokens, accessible pairings
7. **Animation (MEDIUM)** — Timing (150–300ms), transform-only performance, motion meaning
8. **Forms & Feedback (MEDIUM)** — Visible labels, error placement, progressive disclosure
9. **Navigation Patterns (HIGH)** — Bottom nav limits, deep linking, back behavior
10. **Charts & Data (LOW)** — Legend visibility, tooltips, colorblind accessibility

## Key Workflow

**Always start with** `--design-system` to generate complete recommendations:

```
python3 skills/ui-ux-pro-max/scripts/search.py "<product> <keywords>" --design-system -p "Project"
```

Then supplement with domain-specific searches (`--domain style`, `--domain ux`, etc.) as needed.

## Pre-Delivery Standards

Critical items before shipping:
- No emoji icons (use SVG)
- Touch feedback within 80–150ms
- Text contrast ≥4.5:1 both themes
- Safe-area compliance
- 8dp spacing rhythm
- Reduced-motion support
