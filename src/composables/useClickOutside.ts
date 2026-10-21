import { onMounted, onUnmounted, type Ref } from 'vue';

/**
 * Registers global click-outside and Escape key listeners to close popups, dropdowns, or drawers.
 *
 * @param {Ref<HTMLElement | null> | null} targetRef - Optional reference to the container element to ignore inside clicks.
 * @param {() => void} onTrigger - Callback invoked when an outside click or Escape key press occurs.
 * @returns {void}
 * @example
 * useClickOutside(dropdownRef, () => closeDropdown());
 */
export function useClickOutside(
  targetRef: Ref<HTMLElement | null> | null,
  onTrigger: () => void
): void {
  /**
   * Handles document click events and triggers callback if click occurred outside targetRef.
   *
   * @param {MouseEvent} event - DOM mouse event.
   */
  function handleClick(event: MouseEvent): void {
    if (!targetRef) return;
    const el = targetRef.value;
    const target = event.target as Node | null;
    if (el && target && !el.contains(target)) {
      onTrigger();
    }
  }

  /**
   * Handles Escape key press events.
   *
   * @param {KeyboardEvent} event - DOM keyboard event.
   */
  function handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      onTrigger();
    }
  }

  onMounted(() => {
    if (targetRef) {
      document.addEventListener('click', handleClick);
    }
    document.addEventListener('keydown', handleKeydown);
  });

  onUnmounted(() => {
    if (targetRef) {
      document.removeEventListener('click', handleClick);
    }
    document.removeEventListener('keydown', handleKeydown);
  });
}
