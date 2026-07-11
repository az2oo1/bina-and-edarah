## 2024-05-24 - Navigation Accessibility Pattern
**Learning:** The mobile navigation menu toggle (hamburger menu) was missing basic accessibility states (`aria-label` and `aria-expanded`), which is a critical pattern for screen readers navigating the main UI layout.
**Action:** When auditing global navigation components, ensure `aria-expanded` is dynamically linked to the menu's state (`isOpen`) and localized `aria-label` is used for icon-only toggles.
