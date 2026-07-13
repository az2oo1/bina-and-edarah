## 2024-05-18 - Avoid filtering on every render\n**Learning:** Filtering a large list of properties on every render can cause performance issues.\n**Action:** Use `useMemo` to memoize the filtered list of properties to prevent unnecessary recalculations on re-renders where dependencies haven't changed.
## 2024-06-29 - O(N^2) JSON Parsing in React Renders
**Learning:** Calling `JSON.parse` inside a list map during render can cause severe bottlenecks if any element in the list triggers a global re-render on load (e.g., `imageLoading` state). Because every image triggers an `onLoad` state update, an N-element list re-renders N times, leading to N^2 `JSON.parse` operations that block the main thread.
**Action:** Always pre-parse expensive stringified JSON fields (like `imageUrls`) once during data fetching or wrap them in an isolated component, rather than calculating them inline inside a mapped array where state updates occur.
## 2023-10-14 - Scroll Event Layout Thrashing
**Learning:** Reading layout properties (`offsetTop`, `offsetHeight`) inside unthrottled `scroll` event listeners causes severe layout thrashing and blocks the main thread, resulting in a janky scrolling experience.
**Action:** Always wrap `scroll` event handlers that perform DOM layout reads with `requestAnimationFrame` (and a `ticking` guard) or use `IntersectionObserver` for scroll-based section tracking.
