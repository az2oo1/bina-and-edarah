## 2024-05-18 - Avoid filtering on every render\n**Learning:** Filtering a large list of properties on every render can cause performance issues.\n**Action:** Use `useMemo` to memoize the filtered list of properties to prevent unnecessary recalculations on re-renders where dependencies haven't changed.
## 2024-06-29 - O(N^2) JSON Parsing in React Renders
**Learning:** Calling `JSON.parse` inside a list map during render can cause severe bottlenecks if any element in the list triggers a global re-render on load (e.g., `imageLoading` state). Because every image triggers an `onLoad` state update, an N-element list re-renders N times, leading to N^2 `JSON.parse` operations that block the main thread.
**Action:** Always pre-parse expensive stringified JSON fields (like `imageUrls`) once during data fetching or wrap them in an isolated component, rather than calculating them inline inside a mapped array where state updates occur.

## 2024-07-21 - O(N^2) JSON Parsing in Map Loops
**Learning:** Calling `JSON.parse` inside a `.map` function during rendering, especially for nested JSON fields like `unit.imageUrls` or `unit.details`, triggers a severe O(N^2) bottleneck. Every time a unit's state updates or the component re-renders, the entire array is mapped, and JSON strings are re-parsed.
**Action:** Use `React.useMemo` to extract the mapping and parsing logic outside of the direct render path. Parse the JSON strings once and return a shallow copy of the unit object containing the `_parsed` fields. The JSX loop can then safely consume the pre-computed properties.
