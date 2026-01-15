# Design System

Single source of truth for ResuMe's visual design language and UI principles.

## Design Goals

- **Clarity**: Information hierarchy is immediately clear
- **Efficiency**: Users complete tasks with minimal friction
- **Consistency**: Predictable patterns across all screens
- **Accessibility**: WCAG 2.1 AA compliance minimum
- **Professional**: Suitable for career-focused context

## Product Tone

- Professional but approachable
- Clean and uncluttered
- Trustworthy and reliable
- Action-oriented

## Visual Principles

### What We Optimize For

1. **Readability**: Text is always legible with sufficient contrast
2. **Scanability**: Users can quickly find what they need
3. **Focus**: One primary action per screen
4. **Feedback**: Clear states for all interactions
5. **Progressive Disclosure**: Show only what's needed when it's needed

## Color System

### Base Colors

- **Background**: Neutral base (white/very dark gray)
- **Foreground**: High contrast text (near black/white)
- **Border**: Subtle separation (light gray/dark gray)

### Semantic Colors

- **Primary**: Main actions and brand elements
  - Light: `hsl(0 0% 9%)` (near black)
  - Dark: `hsl(0 0% 98%)` (near white)
- **Secondary**: Secondary actions and backgrounds
  - Light: `hsl(0 0% 96.1%)` (very light gray)
  - Dark: `hsl(0 0% 14.9%)` (dark gray)
- **Muted**: De-emphasized content
  - Light: `hsl(0 0% 96.1%)` background, `hsl(0 0% 45.1%)` text
  - Dark: `hsl(0 0% 14.9%)` background, `hsl(0 0% 63.9%)` text
- **Destructive**: Delete, remove, error actions
  - Light: `hsl(0 84.2% 60.2%)` (red)
  - Dark: `hsl(0 62.8% 30.6%)` (darker red)
- **Accent**: Hover states and subtle highlights
  - Light: `hsl(0 0% 96.1%)`
  - Dark: `hsl(0 0% 14.9%)`

### Accent Usage Rules

- **Blue accent** (`text-blue-500`): Used only for brand name "Me" in "ResuMe"
- **Primary color**: Use for main CTAs and important actions
- **Muted colors**: Use for secondary information, placeholders, disabled states
- **Destructive**: Use sparingly for destructive actions only

### Color Usage Guidelines

- Maximum 2 accent colors per screen (excluding brand blue)
- Use semantic colors (primary, secondary, muted) over arbitrary colors
- Maintain 4.5:1 contrast ratio minimum for text
- Test in both light and dark modes

## Typography

### Font Family

- **Primary**: Geist Sans (system font fallback)
- **Monospace**: System monospace (for code/data)

### Scale

- **Display**: `text-5xl` to `text-6xl` (48px-60px) - Hero headings only
- **H1**: `text-3xl` (30px) - Page titles
- **H2**: `text-2xl` (24px) - Section headings
- **H3**: `text-xl` (20px) - Subsection headings
- **Body**: `text-base` (16px) - Default text
- **Small**: `text-sm` (14px) - Secondary text, descriptions
- **XS**: `text-xs` (12px) - Labels, metadata

### Usage

- **Headings**: `font-bold` or `font-semibold`
- **Body**: `font-normal` (default)
- **Labels**: `font-medium`
- **Line height**: Default (1.5 for body, tighter for headings)
- **Letter spacing**: `tracking-tight` for large headings only

### Text Colors

- **Primary text**: `text-foreground`
- **Secondary text**: `text-muted-foreground`
- **Disabled text**: `text-muted-foreground` with `opacity-50`

## Spacing

### Scale

- Base unit: 4px (0.25rem)
- Scale: 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32

### Common Patterns

- **Container padding**: `px-5` (20px horizontal)
- **Section spacing**: `py-16` to `py-20` (64px-80px vertical)
- **Card padding**: `p-6` (24px)
- **Form spacing**: `space-y-6` (24px between fields)
- **Button padding**: `px-4 py-2` (16px horizontal, 8px vertical)
- **Gap between items**: `gap-3` to `gap-6` (12px-24px)

### Layout Rules

- **Max content width**: `max-w-5xl` (1024px) for main content
- **Container**: `mx-auto` for centering
- **Full-width sections**: Break out of container with negative margins when needed
- **Responsive padding**: `px-4 sm:px-6 lg:px-8` for mobile-first

## Border Radius

- **Default**: `0.5rem` (8px) - `rounded-md`
- **Cards**: `rounded-xl` (12px)
- **Buttons**: `rounded-md` (8px)
- **Inputs**: `rounded-md` (8px)
- **Small elements**: `rounded-sm` (4px)

## Component Guidelines

### Buttons

**Variants:**
- `default`: Primary actions, solid background
- `secondary`: Secondary actions, lighter background
- `outline`: Tertiary actions, border only
- `ghost`: Subtle actions, no border
- `destructive`: Delete/remove actions
- `link`: Text link style

**Sizes:**
- `sm`: `h-8 px-3 text-xs`
- `default`: `h-9 px-4`
- `lg`: `h-10 px-8`
- `icon`: `h-9 w-9` square

**Rules:**
- One primary button per screen
- Use `default` variant for main CTA
- Use `outline` or `ghost` for secondary actions
- Disabled state: `opacity-50` + `disabled:pointer-events-none`
- Always include focus-visible ring

### Forms

**Inputs:**
- Height: `h-9` (36px)
- Padding: `px-3 py-1`
- Border: `border border-input`
- Focus: `focus-visible:ring-1 focus-visible:ring-ring`
- Disabled: `opacity-50`

**Labels:**
- Size: `text-sm font-medium`
- Spacing: `mb-2` below label
- Required: Use asterisk or "required" text

**Error States:**
- Border: `border-destructive`
- Message: `text-destructive text-sm` below field
- Icon: Optional destructive icon

**Layout:**
- Form items: `space-y-6` between fields
- Form groups: `space-y-4` within groups
- Submit buttons: `mt-6` spacing

### Cards

**Structure:**
- Container: `rounded-xl border bg-card shadow`
- Header: `p-6` with `space-y-1.5` for title/description
- Content: `p-6 pt-0` (no top padding when header exists)
- Footer: `p-6 pt-0` for actions

**Usage:**
- Group related content
- One primary card per section
- Use shadows for depth
- Maintain consistent padding

### Tables

**Structure:**
- Header: `font-semibold` with `text-muted-foreground`
- Rows: Alternating background optional
- Cells: `px-4 py-3` padding
- Borders: `border-b` between rows

**Rules:**
- Use for tabular data only
- Include sortable headers when applicable
- Responsive: Scroll horizontally on mobile

### Navigation

**Navbar:**
- Height: `h-16` (64px)
- Border: `border-b` bottom border
- Container: `max-w-5xl mx-auto px-5`
- Links: Use button variants for consistency

**Links:**
- Default: `text-primary` with `hover:underline`
- Active: Distinct styling (underline or background)
- Visited: Same as default (no special styling)

## Shadows

- **Cards**: `shadow` (default)
- **Buttons**: `shadow-sm` (small)
- **Elevated**: `shadow-md` (modals, dropdowns)
- **No shadow**: Ghost buttons, subtle elements

## Transitions

- **Duration**: Default (150ms-200ms)
- **Properties**: `transition-colors` for color changes
- **Easing**: Default (ease-in-out)
- **Hover**: Immediate feedback, no delay

## Do's and Don'ts

### Do's

- ✅ Use semantic color tokens (primary, secondary, muted)
- ✅ Maintain consistent spacing scale
- ✅ Use component variants instead of custom styles
- ✅ Test in both light and dark modes
- ✅ Ensure sufficient color contrast
- ✅ Use consistent border radius
- ✅ Group related actions together
- ✅ Provide clear feedback for all interactions

### Don'ts

- ❌ Use arbitrary colors (use semantic tokens)
- ❌ Mix spacing units (stick to scale)
- ❌ Create custom button styles (use variants)
- ❌ Use more than 2 accent colors per screen
- ❌ Skip focus states
- ❌ Use shadows for everything (reserve for elevation)
- ❌ Break the max-width container unnecessarily
- ❌ Use inline styles (use Tailwind classes)

## Dark Mode

- All components support dark mode via CSS variables
- Test all screens in both modes
- Maintain contrast ratios in both modes
- Use semantic colors that adapt automatically

## Accessibility

- **Focus indicators**: Always visible, `ring-1 ring-ring`
- **Color contrast**: Minimum 4.5:1 for text
- **Keyboard navigation**: All interactive elements accessible
- **Screen readers**: Proper ARIA labels and semantic HTML
- **Touch targets**: Minimum 44x44px for mobile

## Responsive Design

- **Mobile-first**: Design for mobile, enhance for desktop
- **Breakpoints**: 
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px
- **Container**: Max-width constraints on larger screens
- **Navigation**: Collapsible on mobile if needed
- **Forms**: Full-width inputs on mobile

## Implementation Notes

### Current Stack

- **Framework**: Next.js with React
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Theme**: next-themes for dark mode
- **Font**: Geist Sans

### CSS Variables

All colors defined as HSL CSS variables in `globals.css`:
- Enables theme switching
- Supports dark mode
- Centralized color management

### Component Library

Using shadcn/ui components as base:
- Customizable via Tailwind
- Accessible by default
- Consistent API

## Implementation Mismatches

### Resolved Issues

All previously documented mismatches have been resolved:
- ✅ Icon colors now use semantic `text-primary` token
- ✅ Icons use consistent styling with `bg-primary/10` background
- ✅ Blue accent (`text-blue-500`) only used for brand name "Me" in "ResuMe"
- ✅ Error messages use semantic `text-destructive` instead of `text-red-500`
- ✅ All form error states aligned with design system

### Current Status

- All components align with the design system
- No known violations of color usage rules
- Blue accent correctly restricted to brand name only
- Semantic color tokens used throughout

### Notes

- Future changes should follow the guidelines in this document
- Any new components should use semantic tokens, not arbitrary colors

## Future Considerations

- Document any new component patterns
- Update color system if brand colors change
- Expand spacing scale if needed
- Add animation guidelines if motion is introduced
- Document any design tokens added to Tailwind config
- Resolve implementation mismatches listed above
