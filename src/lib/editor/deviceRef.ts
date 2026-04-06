/**
 * Module-level ref to the device content scroll container.
 * Canvas.tsx assigns this; Sidebar.tsx reads it to scroll-to-section.
 * Using a module ref avoids React context ceremony for this simple use case.
 */
export const deviceContentRef: { current: HTMLDivElement | null } = { current: null };
