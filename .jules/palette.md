## 2024-05-24 - Navigation Accessibility Pattern
**Learning:** The mobile navigation menu toggle (hamburger menu) was missing basic accessibility states (`aria-label` and `aria-expanded`), which is a critical pattern for screen readers navigating the main UI layout.
**Action:** When auditing global navigation components, ensure `aria-expanded` is dynamically linked to the menu's state (`isOpen`) and localized `aria-label` is used for icon-only toggles.
## 2026-07-25 - Adding Accessible Names to Icon-only Buttons
**Learning:** Icon-only action buttons (like WhatsApp launch buttons) lacked `aria-label` attributes, impacting screen reader users. The application natively supports both Arabic and English through a `language` context variable, meaning ARIA attributes must dynamically support both via conditionals.
**Action:** Always verify if an icon-only button uses `aria-label` or `title`. In localized apps, use the localization context (e.g. `language === 'ar' ? 'عربي' : 'English'`) when adding ARIA attributes to ensure the accessible name matches the interface language.
## 2026-07-28 - Focus Visible Outlines in Tailwind
**Learning:** Keyboard navigation for circular icon buttons lacks distinct visual indicators. Using `focus-visible` utilities is required to show focus specifically for keyboard users without disrupting mouse/touch interactions.
**Action:** Use `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2` (and optionally `focus-visible:ring-offset-background` if on varied backgrounds) on interactive icon buttons.
