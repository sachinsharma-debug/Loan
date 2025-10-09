// Global form keyboard navigation helpers
// Usage: add onKeyDown={createFormKeyDownHandler()} to any <form> to enable:
// - Enter moves to next field
// - Shift+Enter in textarea adds a newline
// - For selects (native or Radix SelectTrigger with role="combobox"),
//   Enter selects/toggles when open; pressing Enter again (when closed) moves to next field

type HandlerOptions = {
  submitOnLast?: boolean; // if true, submit form when Enter on last field
};

const FOCUSABLE_SELECTOR = [
  'input:not([type="hidden"]):not([disabled])',
  "textarea:not([disabled])",
  "select:not([disabled])",
  // Radix SelectTrigger renders a button with role="combobox"
  '[role="combobox"]:not([aria-disabled="true"])',
  // contenteditable fallbacks
  '[contenteditable="true"]',
].join(",");

export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const nodes = Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
  );
  // Filter out elements not visible or with zero dimensions
  return nodes.filter((el) => {
    const style = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return (
      style.visibility !== "hidden" &&
      style.display !== "none" &&
      !(rect.width === 0 && rect.height === 0)
    );
  });
}

export function focusNextElement(
  current: HTMLElement,
  container: HTMLElement
): boolean {
  const elements = getFocusableElements(container);
  const idx = elements.findIndex(
    (el) => el === current || el.contains(current)
  );
  if (idx === -1) return false;
  for (let i = idx + 1; i < elements.length; i++) {
    const next = elements[i];
    if (!next) continue;
    // Special case: ignore buttons (common as SelectTrigger fallback submit buttons)
    const tag = next.tagName.toLowerCase();
    if (tag === "button") continue;
    next.focus();
    return true;
  }
  return false;
}

export function isRadixSelectOpen(target: HTMLElement): boolean {
  // Radix sets data-state="open" and aria-expanded="true" on the trigger when open
  const ds = target.getAttribute("data-state");
  const expanded = target.getAttribute("aria-expanded");
  return ds === "open" || expanded === "true";
}

export function createFormKeyDownHandler(options: HandlerOptions = {}) {
  const { submitOnLast = true } = options;
  return function onKeyDown(e: React.KeyboardEvent<HTMLFormElement>) {
    if (e.key !== "Enter") return;

    const target = e.target as HTMLElement;
    const form = e.currentTarget as unknown as HTMLElement; // form element
    if (!form) return;

    const tag = (target.tagName || "").toLowerCase();
    const role = target.getAttribute("role");

    // Textarea behavior: Shift+Enter => newline, Enter => next field
    if (tag === "textarea") {
      if (e.shiftKey) {
        return; // allow newline
      }
      e.preventDefault();
      const moved = focusNextElement(target, form);
      if (!moved && submitOnLast) {
        // submit if last
        (form as any).requestSubmit?.();
      }
      return;
    }

    // Radix SelectTrigger or native select
    const isCombo = role === "combobox" || tag === "select";
    if (isCombo) {
      // If open, let Enter select/toggle; moving will happen on next Enter when closed
      if (isRadixSelectOpen(target)) {
        return; // don't prevent default
      }
      e.preventDefault();
      const moved = focusNextElement(target, form);
      if (!moved && submitOnLast) {
        (form as any).requestSubmit?.();
      }
      return;
    }

    // Default: Enter moves to next field
    e.preventDefault();
    const moved = focusNextElement(target, form);
    if (!moved && submitOnLast) {
      (form as any).requestSubmit?.();
    }
  };
}

// Optional helper to move to next from arbitrary element (e.g., after custom events)
export function moveFocusToNextFrom(element: HTMLElement) {
  const form = element.closest("form") as HTMLElement | null;
  if (!form) return;
  focusNextElement(element, form);
}
