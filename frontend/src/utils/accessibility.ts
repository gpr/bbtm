// Accessibility utility functions

/**
 * Check if an element is focusable
 */
export function isFocusable(element: HTMLElement): boolean {
  const focusableElements = [
    'input',
    'button',
    'select',
    'textarea',
    'a[href]',
    'area[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ];

  return focusableElements.some(selector => element.matches(selector)) &&
    !element.hasAttribute('disabled') &&
    element.tabIndex !== -1;
}

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableQuery = [
    'input:not([disabled])',
    'button:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'a[href]',
    'area[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(',');

  return Array.from(container.querySelectorAll(focusableQuery));
}

/**
 * Trap focus within a container (useful for modals)
 */
export function trapFocus(container: HTMLElement): () => void {
  const focusableElements = getFocusableElements(container);
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  function handleTabKey(event: KeyboardEvent) {
    if (event.key !== 'Tab') return;

    if (event.shiftKey) {
      if (document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable?.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable?.focus();
      }
    }
  }

  container.addEventListener('keydown', handleTabKey);

  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleTabKey);
  };
}

/**
 * Announce text to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Generate a unique ID for accessibility attributes
 */
export function generateA11yId(prefix = 'a11y'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if reduced motion is preferred
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if high contrast is preferred
 */
export function prefersHighContrast(): boolean {
  return window.matchMedia('(prefers-contrast: high)').matches;
}

/**
 * Get ARIA label for tournament status
 */
export function getTournamentStatusAriaLabel(status: string, participantCount: number, maxParticipants?: number): string {
  const statusText = status.replace(/_/g, ' ');
  const countText = maxParticipants
    ? `${participantCount} of ${maxParticipants} participants registered`
    : `${participantCount} participants registered`;

  return `Tournament status: ${statusText}. ${countText}.`;
}

/**
 * Get ARIA label for date and time
 */
export function getDateTimeAriaLabel(date: string | Date, label: string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return `${label}: ${formattedDate}`;
}

/**
 * Validate color contrast ratio (basic implementation)
 */
export function hasGoodContrast(foreground: string, background: string): boolean {
  // This is a simplified check - in production you'd want a proper contrast ratio calculation
  // For now, just check if colors are sufficiently different
  const fg = foreground.toLowerCase();
  const bg = background.toLowerCase();

  // Basic heuristic - check for light on dark or dark on light
  const lightColors = ['white', '#ffffff', '#fff', 'lightgray', 'silver'];
  const darkColors = ['black', '#000000', '#000', 'darkgray', 'gray'];

  const fgIsLight = lightColors.some(color => fg.includes(color));
  const fgIsDark = darkColors.some(color => fg.includes(color));
  const bgIsLight = lightColors.some(color => bg.includes(color));
  const bgIsDark = darkColors.some(color => bg.includes(color));

  return (fgIsLight && bgIsDark) || (fgIsDark && bgIsLight);
}