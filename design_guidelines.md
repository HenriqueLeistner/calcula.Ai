# Design Guidelines: Seu Finanças PWA

## Design Approach
**Selected Approach:** Design System-Based (Productivity/Finance-Focused)

**Justification:** Financial management tools require clarity, trust, and efficiency over visual flair. This is a utility-first application where data accuracy and quick task completion are paramount.

**Primary Inspiration:** Linear (clean interfaces, excellent hierarchy), Nubank (Brazilian fintech leader), Notion (efficient forms and data views)

**Design Principles:**
- Clarity over decoration
- Immediate data comprehension
- Touch-friendly mobile interactions
- Trust through consistency and precision

## Typography

**Font Family:**
- Primary: Inter (Google Fonts) - exceptional readability for numbers and data
- Monospace: JetBrains Mono (for currency values and numeric data)

**Hierarchy:**
- Page Headers: text-2xl (24px) / font-semibold
- Section Headers: text-lg (18px) / font-semibold  
- Card Titles: text-base (16px) / font-medium
- Body Text: text-sm (14px) / font-normal
- Labels: text-xs (12px) / font-medium / uppercase tracking
- Currency Values: text-xl to text-3xl / font-bold / tabular-nums (monospace variant)
- Table Data: text-sm / font-normal

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, and 8 for consistency
- Micro spacing (within components): p-2, gap-2
- Standard spacing (between elements): p-4, gap-4, my-6
- Section spacing: py-8, px-4 (mobile), px-6 (desktop)
- Container max-width: max-w-7xl mx-auto

**Grid System:**
- Mobile: Single column (grid-cols-1)
- Tablet: Two columns for cards (md:grid-cols-2)
- Desktop: Three columns for dashboard cards (lg:grid-cols-3)

## Component Library

### Navigation & Header
- Fixed top header with app name, current month indicator, and action buttons (Export/Import/Install)
- Height: h-16
- Shadow: shadow-sm for subtle separation
- Padding: px-4 py-2

### Dashboard Cards
- Revenue/Expense/Balance cards in grid layout
- Rounded corners: rounded-lg
- Border: border with subtle border color
- Padding: p-6
- Each card contains: Label (small caps), Large numeric value (with BRL formatting), Optional trend indicator

### Forms & Inputs
- Input fields: rounded-md, border, p-3, focus ring
- Labels: text-sm font-medium mb-2
- Toggle for Income/Expense: Segmented control style (pill-shaped buttons)
- Date picker: Native input with calendar icon
- Category dropdown: Full-width select with icons
- Amount input: Right-aligned, monospace font, BRL prefix (R$)
- Submit button: w-full, rounded-md, py-3, font-medium

### Transaction List/Table
- Mobile: Card-based list with stacked information
- Desktop: Table with columns (Date, Category, Description, Amount, Actions)
- Row height: py-4
- Alternating row treatment for scannability
- Icon indicators for income (↑) vs expense (↓)
- Action buttons: Icon-only (Edit/Delete) aligned right

### Budget Panel
- Progress bars showing budget consumption
- Bar height: h-2, rounded-full
- Color states via Tailwind utilities (no hardcoded colors):
  - Under 80%: Success variant
  - 80-99%: Warning variant  
  - 100%+: Danger variant
- Budget card layout: Category name, Limit, Spent, Remaining (grid layout)

### Charts (Recharts)
- Pie Chart: Expenses by category - default Recharts colors, responsive width, legend below
- Line Chart: Balance curve over month - default styling, grid lines, tooltips
- Container: aspect-video or h-80, rounded-lg border p-4

### Filters Bar
- Horizontal layout on desktop (flex gap-4)
- Stacked on mobile (flex-col gap-2)
- Filter inputs: Month selector, Type filter, Category filter, Search input
- Compact height: Each filter control h-10

### Modals/Dialogs
- Backdrop: Semi-transparent overlay
- Content: rounded-lg, max-w-md mx-auto, p-6
- Close button: Top-right corner with X icon

### Buttons
- Primary: py-2 px-4, rounded-md, font-medium
- Secondary: Similar sizing, outlined variant
- Icon buttons: p-2, rounded, hover state
- Install PWA button: Prominent placement in header, distinctive styling

### Offline Fallback Page
- Centered layout with icon, heading "Você está offline", message, and "Tentar novamente" button
- Simple, reassuring design
- No decorative elements - focus on clarity

## Images

**No hero images** - This is a utility app focused on data and functionality, not marketing. All visual space should be dedicated to functional content (dashboard, charts, forms, data).

## Animations

**Minimal and purposeful:**
- Page transitions: None (instant)
- Chart rendering: Recharts default animations on load
- Form validation: Subtle shake on error
- Button interactions: Default browser states only
- Loading states: Simple spinner (animate-spin)

**Explicitly avoid:**
- Scroll-triggered animations
- Decorative transitions
- Hover animations beyond standard states

## Accessibility

- Semantic HTML throughout
- Form labels properly associated with inputs
- Focus indicators on all interactive elements (ring-2 ring-offset-2)
- ARIA labels for icon-only buttons
- Color contrast meeting WCAG AA standards
- Keyboard navigation support for all features
- Screen reader announcements for dynamic content updates

## Mobile Optimization

- Touch targets: Minimum 44x44px (h-11, p-3)
- Bottom-sheet pattern for forms on mobile
- Sticky header for context retention
- Swipe actions for delete/edit on transaction cards
- Large, easy-to-tap buttons
- Generous spacing between interactive elements (gap-4 minimum)

## Data Visualization Standards

- Currency always formatted as R$ with two decimals
- Dates in dd/mm/yyyy format
- Negative values indicated with minus sign and contextual color treatment
- Large numbers with thousand separators (1.234,56)
- Percentage values for budget consumption prominently displayed