---
name: Premium Creative Orchestration
colors:
  surface: '#f8f9ff'
  surface-dim: '#ccdbf3'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d5e3fc'
  on-surface: '#0d1c2e'
  on-surface-variant: '#444650'
  inverse-surface: '#233144'
  inverse-on-surface: '#eaf1ff'
  outline: '#747781'
  outline-variant: '#c4c6d2'
  surface-tint: '#415c9e'
  primary: '#001948'
  on-primary: '#ffffff'
  primary-container: '#0a2d6d'
  on-primary-container: '#7d97dd'
  inverse-primary: '#b2c5ff'
  secondary: '#0060a8'
  on-secondary: '#ffffff'
  secondary-container: '#47a1ff'
  on-secondary-container: '#003663'
  tertiary: '#191c1e'
  on-tertiary: '#ffffff'
  tertiary-container: '#2e3133'
  on-tertiary-container: '#96999b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2ff'
  primary-fixed-dim: '#b2c5ff'
  on-primary-fixed: '#001847'
  on-primary-fixed-variant: '#284484'
  secondary-fixed: '#d3e4ff'
  secondary-fixed-dim: '#a2c9ff'
  on-secondary-fixed: '#001c38'
  on-secondary-fixed-variant: '#004881'
  tertiary-fixed: '#e0e3e5'
  tertiary-fixed-dim: '#c4c7c9'
  on-tertiary-fixed: '#191c1e'
  on-tertiary-fixed-variant: '#444749'
  background: '#f8f9ff'
  on-background: '#0d1c2e'
  surface-variant: '#d5e3fc'
typography:
  display-lg:
    fontFamily: Outfit
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  section-gap: 120px
---

## Brand & Style

The visual identity of this design system is built upon the pillars of **trust, creativity, and elite reliability**. It is designed for a dual audience: the professional event planner who requires precision, and the celebratory host who seeks creative excellence. 

The style is **Corporate / Modern** with a strong leaning toward **Minimalism**. It prioritizes high-end professional aesthetics through the use of generous whitespace, allowing high-quality event photography to act as the primary visual anchor. The interface serves as a sophisticated frame for content, utilizing "Quiet Luxury" design principles—where quality is communicated through perfect alignment, refined typography, and subtle tactile feedback rather than loud ornamentation. 

Expect a UI that feels architectural and intentional, evoking an emotional response of organized calm and premium service.

## Colors

The palette is anchored by **Deep Navy Blue**, a color that commands authority and establishes immediate trust. This is balanced by **Bright Professional Blue**, used for interactive elements and highlights to maintain a modern, tech-forward energy.

- **Primary (#0A2D6D):** Used for global navigation, primary headings, and high-emphasis buttons. It represents the "Standard of Excellence."
- **Secondary (#1E88E5):** Used for action-oriented UI elements, links, and progress indicators. It provides a vibrant, approachable contrast to the deep navy.
- **Accent/Surface (#FFFFFF):** The canvas of the application. White is used aggressively to create "breathing room" and highlight the premium nature of the photography.
- **Neutrals:** A scale of cool slates is used for secondary text and borders to maintain a professional, monochromatic depth without appearing muddy.

## Typography

This design system utilizes a tiered typographic approach to balance geometric modernity with functional readability.

**Outfit** is used for all headlines and display text. Its geometric construction feels modern and clean, while its bold weights provide the "elegant" and "authoritative" presence required for a premium booking platform.

**Inter** is the workhorse for all UI and body text. Chosen for its exceptional legibility and neutral tone, it ensures that complex booking data and logistical information are easy to digest. 

**Hierarchy Rules:**
- Use `display-lg` exclusively for hero sections with high-quality photography overlays.
- Maintain tight letter-spacing on larger headlines to enhance the "premium" editorial feel.
- Body text should always utilize the neutral slate color (not pure black) to reduce eye strain and maintain the sophisticated palette.

## Layout & Spacing

The layout philosophy follows a **12-column Fluid Grid** system with a focus on "Editorial Proportion." 

- **Desktop:** 12 columns with 24px gutters. Page margins are generous (64px) to drive focus toward the center content.
- **Sectioning:** Vertical rhythm is defined by large gaps (up to 120px) between major content sections to prevent the UI from feeling crowded.
- **Alignment:** Content should predominantly be left-aligned for readability, with center-alignment reserved for hero sections and high-level marketing calls-to-action.
- **Reflow:** On mobile, the 12-column grid collapses to a single column with 20px margins, but maintains the 8px base spacing unit for consistency in component padding.

## Elevation & Depth

To achieve a modern, high-end feel, this design system avoids heavy shadows and instead uses **Ambient Depth** and **Tonal Layering**.

- **Surface Levels:** The primary background is pure white. Secondary containers (like cards or sidebars) use a very light gray (#F8FAFC) to create subtle separation.
- **Soft Shadows:** When elevation is required (e.g., for hovering over a card or a floating booking bar), use extra-diffused, low-opacity shadows. The shadow color should be tinted with the Primary Navy (#0A2D6D at 4-8% opacity) rather than pure black to maintain color harmony.
- **Glassmorphism:** Use subtle backdrop blurs (10px - 15px) for sticky navigation bars to give a sense of depth and luxury as the user scrolls over photography.

## Shapes

The shape language is defined by **Controlled Softness**. 

By utilizing a `roundedness` level of **2**, standard UI elements like input fields and small buttons feature an 8px (0.5rem) radius. Larger components, such as cards and containers, scale up to 16px (1rem) or 24px (1.5rem).

This balance ensures the UI feels modern and friendly while remaining professional and structured. Avoid pill-shaped buttons for primary actions; instead, use the defined 8px radius to maintain a more "architectural" look.

## Components

### Buttons
- **Primary:** Subtle linear gradient from `#0A2D6D` to `#1E88E5` (top-to-bottom or 45 degrees). This creates a "premium" metallic sheen. Text is white, weight is semi-bold.
- **Secondary:** Outlined with a 1px border of `#0A2D6D`. On hover, a light `#F8FAFC` background tint appears.

### Cards
- Cards must have a white background, an 8px border radius, and a very light 1px border (`#E2E8F0`). 
- **Shadow:** Use a "soft-lift" shadow (Y: 4px, Blur: 20px, Color: Primary 8%).
- Photography within cards should occupy the top half, with a 1:1 or 4:3 aspect ratio.

### Input Fields
- Inputs are outlined, not filled. Use a 1px border of `#CBD5E1`. On focus, the border transitions to the Secondary Blue (`#1E88E5`) with a 2px outer glow.

### Chips & Tags
- Used for event categories or availability status. These should use a light tint of the secondary color (10% opacity) with dark blue text for high legibility.

### Icons
- Icons are 24px, using a "Linear" style with a 1.5px stroke weight. Avoid solid "blob" icons to maintain the clean, sophisticated aesthetic.

### Lists
- Use generous vertical padding (16px) between list items. Use thin horizontal separators (`#F1F5F9`) rather than alternating row colors to keep the layout clean.