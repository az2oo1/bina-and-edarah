## 2024-05-24 - Navigation Accessibility Pattern
**Learning:** The mobile navigation menu toggle (hamburger menu) was missing basic accessibility states (`aria-label` and `aria-expanded`), which is a critical pattern for screen readers navigating the main UI layout.
**Action:** When auditing global navigation components, ensure `aria-expanded` is dynamically linked to the menu's state (`isOpen`) and localized `aria-label` is used for icon-only toggles.
## 2026-07-25 - Adding Accessible Names to Icon-only Buttons
**Learning:** Icon-only action buttons (like WhatsApp launch buttons) lacked `aria-label` attributes, impacting screen reader users. The application natively supports both Arabic and English through a `language` context variable, meaning ARIA attributes must dynamically support both via conditionals.
**Action:** Always verify if an icon-only button uses `aria-label` or `title`. In localized apps, use the localization context (e.g. `language === 'ar' ? 'عربي' : 'English'`) when adding ARIA attributes to ensure the accessible name matches the interface language.
## 2026-07-27 - Add ARIA Labels to Icon-Only Social Links
**Learning:** Found that social icon buttons implemented via mapping loops often omit `aria-label` attributes, relying instead on `title`, which assistive technologies don't consistently announce.
**Action:** Always verify that dynamically generated icon-only links (e.g. from a list of objects) include `aria-label` using the same data string used for the `title`.
