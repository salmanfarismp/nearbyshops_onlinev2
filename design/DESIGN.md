---
name: Local Harmony
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#574336'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#8a7264'
  outline-variant: '#dec1b0'
  surface-tint: '#974800'
  primary: '#974800'
  on-primary: '#ffffff'
  primary-container: '#ec7813'
  on-primary-container: '#512400'
  inverse-primary: '#ffb688'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#5c5f61'
  on-tertiary: '#ffffff'
  tertiary-container: '#95989a'
  on-tertiary-container: '#2d3032'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbc7'
  primary-fixed-dim: '#ffb688'
  on-primary-fixed: '#311300'
  on-primary-fixed-variant: '#733600'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#e0e3e5'
  tertiary-fixed-dim: '#c4c7c9'
  on-tertiary-fixed: '#191c1e'
  on-tertiary-fixed-variant: '#444749'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.03em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  sidebar-width: 280px
  margin-desktop: 48px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

This design system is built to bridge the gap between digital convenience and the warmth of a local neighborhood. The personality is inherently **friendly, community-focused, and optimistic**. It avoids the sterile coldness of traditional e-commerce by utilizing soft geometry and a sun-drenched primary palette.

The visual style leans into **Modern Minimalism with Tactile elements**. It prioritizes extreme clarity and breathing room to lower the cognitive load during discovery. By combining high-quality typography with "squishy" pill-shaped components and soft, diffused shadows, the interface feels approachable—like a digital extension of a physical community bulletin board or a boutique shop window.

## Colors

The palette is anchored by "Neighborhood Orange" (#ec7813), a high-energy, warm hue reserved strictly for primary actions, notifications, and brand highlights. This is balanced against "Midnight Navy" (#0f172a), which provides the structural weight for typography and navigation, ensuring high accessibility and a sense of professional reliability.

*   **Primary (#ec7813):** Used for CTAs, price highlights, and active states.
*   **Secondary (#0f172a):** Used for headings and primary navigation backgrounds to create grounding.
*   **Surface / Background:** Primarily pure white (#ffffff) to maximize "airy" space, with ultra-light navy tints (#f8fafc) used for subtle section differentiation.
*   **Accents:** Soft amber and teal-tinted grays are used for secondary status indicators (e.g., "Open Now" or "In Stock").

## Typography

The choice of **Plus Jakarta Sans** is central to the design system's friendly ethos. Its wide apertures and modern geometric curves make it exceptionally legible at small sizes while appearing charismatic and "bubbly" in large display formats.

Headlines should utilize the Bold and ExtraBold weights to create a strong visual hierarchy against the spacious layout. Body text is set with generous line heights to facilitate easy scanning of product descriptions. Label styles use slightly increased letter spacing and semi-bold weights to ensure that metadata—like distance, ratings, and categories—is instantly digestible.

## Layout & Spacing

The layout philosophy is based on a **Spacious Fixed Grid**. For discovery pages, a 12-column grid is used with wide 24px gutters to allow product photography to breathe. Management screens (like merchant dashboards or user profiles) transition to a hybrid layout featuring a fixed 280px left sidebar for navigation and a fluid content area.

Vertical rhythm follows a strict 8px baseline. Large gaps (32px+) are encouraged between unrelated sections to reinforce the feeling of a "clean" and "uncluttered" marketplace. Content should be centered within the maximum container width to maintain focus on larger displays.

## Elevation & Depth

Depth is achieved through **Ambient Shadows** rather than harsh lines. Surfaces should feel like they are floating slightly above the background.

*   **Low Elevation:** Used for product cards and search bars. A soft, wide-spread shadow with 4% opacity of the Navy primary color, slightly offset on the Y-axis.
*   **High Elevation:** Used for modals, dropdowns, and floating action buttons. These use a multi-layered shadow with a subtle Orange tint (#ec7813 at 5% opacity) to create a "warm glow" effect that draws the eye.
*   **Interaction:** Upon hover, cards should subtly lift (increased shadow spread) and scale (1.02x) to provide tactile feedback during exploration.

## Shapes

The design system utilizes **Pill-shaped (ROUND_FULL)** geometry as its signature visual trait. This extreme roundedness removes any visual "sharpness," contributing to the friendly and safe neighborhood feel.

*   **Primary CTAs and Inputs:** Always fully rounded (pill-shaped).
*   **Product Cards:** Use `rounded-xl` (1.5rem / 24px) to balance the content density while maintaining the soft aesthetic.
*   **Selection Indicators:** Active states in sidebars or navbars should use pill-shaped "capsule" backgrounds to highlight the current location.

## Components

### Buttons & Inputs
Buttons are strictly pill-shaped. The primary button uses the brand Orange with white text. Secondary buttons should use a ghost style (transparent background with a subtle navy border) or a soft navy tint. Inputs should have a generous 16px horizontal padding to complement the rounded ends.

### Cards
Discovery cards are the workhorse of the system. They feature a top-aligned image with a 1:1 or 4:3 aspect ratio, followed by a 16px padded content area. The card container has a white background, a very thin 1px border (#f1f5f9), and a soft ambient shadow.

### Chips & Tags
Used for categories (e.g., "Bakery," "Pet Supplies"). These are small, pill-shaped elements with a light navy-tinted background (#f1f5f9) and Navy text. When selected, they transition to the brand Orange.

### Sidebars
Management sidebars should be clean with no borders; instead, use a subtle background color shift (#f8fafc) to separate the navigation from the main workspace. Icons in the sidebar should be "duotone" or "rounded-outline" styles to match the typography.

### Discovery Grids
Use a "Masonry" or "Tight-Grid" approach for local shop highlights, ensuring that images are the hero. Each grid item should have ample white space around its text labels to prevent the marketplace from feeling "busy."