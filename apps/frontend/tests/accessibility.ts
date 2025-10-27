import { axe, toHaveNoViolations } from 'jest-axe';
import { render, RenderResult } from '@testing-library/react';
import { ReactElement } from 'react';

// Extend Vitest matchers with jest-axe
expect.extend(toHaveNoViolations);

/**
 * Run axe accessibility tests on a component
 * @param ui - The React component to test
 * @param options - Additional options for rendering
 * @returns Axe test results
 */
export async function testA11y(
  ui: ReactElement,
  options?: Parameters<typeof render>[1]
): Promise<void> {
  const { container } = render(ui, options);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
}

/**
 * Check if an element is keyboard accessible
 * @param element - The element to check
 * @returns boolean indicating if element is keyboard accessible
 */
export function isKeyboardAccessible(element: Element): boolean {
  const tabindex = element.getAttribute('tabindex');
  const role = element.getAttribute('role');

  // Check if element is focusable
  const focusableElements = [
    'a', 'button', 'input', 'textarea', 'select',
    '[tabindex]:not([tabindex="-1"])'
  ];

  const tagName = element.tagName.toLowerCase();
  const isFocusable = focusableElements.some(selector => {
    if (selector.startsWith('[')) {
      return element.matches(selector);
    }
    return tagName === selector;
  });

  // Check for interactive roles
  const interactiveRoles = [
    'button', 'link', 'textbox', 'checkbox', 'radio',
    'combobox', 'listbox', 'menuitem', 'tab', 'switch'
  ];

  return isFocusable || (!!role && interactiveRoles.includes(role)) || tabindex === '0';
}

/**
 * Get all focusable elements within a container
 * @param container - The container element
 * @returns Array of focusable elements
 */
export function getFocusableElements(container: Element): Element[] {
  const selectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]'
  ].join(',');

  return Array.from(container.querySelectorAll(selectors));
}

/**
 * Check if element has sufficient color contrast
 * Note: This is a simplified check. Use axe-core for comprehensive testing
 * @param foreground - Foreground color (e.g., "#000000")
 * @param background - Background color (e.g., "#ffffff")
 * @param largeText - Whether text is large (18pt+ or 14pt+ bold)
 * @returns boolean indicating if contrast is sufficient
 */
export function hasGoodContrast(
  foreground: string,
  background: string,
  largeText: boolean = false
): boolean {
  const ratio = calculateContrastRatio(foreground, background);
  const minRatio = largeText ? 3 : 4.5; // WCAG AA standards
  return ratio >= minRatio;
}

/**
 * Calculate contrast ratio between two colors
 * @param color1 - First color
 * @param color2 - Second color
 * @returns Contrast ratio
 */
function calculateContrastRatio(color1: string, color2: string): number {
  const lum1 = getRelativeLuminance(color1);
  const lum2 = getRelativeLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Calculate relative luminance of a color
 * @param color - Color string (hex format)
 * @returns Relative luminance value
 */
function getRelativeLuminance(color: string): number {
  // Remove # if present
  color = color.replace('#', '');

  // Convert to RGB
  const r = parseInt(color.substr(0, 2), 16) / 255;
  const g = parseInt(color.substr(2, 2), 16) / 255;
  const b = parseInt(color.substr(4, 2), 16) / 255;

  // Apply gamma correction
  const [rs, gs, bs] = [r, g, b].map(c => {
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  // Calculate luminance
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Check if an element has proper ARIA labels
 * @param element - The element to check
 * @returns boolean indicating if element has accessible name
 */
export function hasAccessibleName(element: Element): boolean {
  const ariaLabel = element.getAttribute('aria-label');
  const ariaLabelledBy = element.getAttribute('aria-labelledby');
  const title = element.getAttribute('title');
  const alt = element.getAttribute('alt');

  // Check for text content
  const textContent = element.textContent?.trim();

  return !!(ariaLabel || ariaLabelledBy || title || alt || textContent);
}

/**
 * Accessibility test helper for common checks
 */
export const a11yHelpers = {
  /**
   * Check if interactive element has keyboard handler
   */
  hasKeyboardHandler: (element: Element): boolean => {
    const onClick = element.getAttribute('onclick');
    const onKeyDown = element.getAttribute('onkeydown');
    const onKeyPress = element.getAttribute('onkeypress');
    const onKeyUp = element.getAttribute('onkeyup');

    return !!(onClick && (onKeyDown || onKeyPress || onKeyUp));
  },

  /**
   * Check if form input has associated label
   */
  hasLabel: (input: Element): boolean => {
    const ariaLabel = input.getAttribute('aria-label');
    const ariaLabelledBy = input.getAttribute('aria-labelledby');

    // Check for aria-label or aria-labelledby first (work without id)
    if (ariaLabel || ariaLabelledBy) return true;

    // Check for associated label element (requires id)
    const id = input.getAttribute('id');
    if (!id) return false;

    const label = document.querySelector(`label[for="${id}"]`);
    return !!label;
  },

  /**
   * Check if image has alt text
   */
  hasAltText: (img: Element): boolean => {
    const alt = img.getAttribute('alt');
    return alt !== null; // Empty string is valid for decorative images
  },

  /**
   * Check if heading hierarchy is correct
   */
  checkHeadingHierarchy: (container: Element): boolean => {
    const headings = Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    if (headings.length === 0) return true;

    let prevLevel = 0;
    for (const heading of headings) {
      const level = parseInt(heading.tagName[1]);
      if (prevLevel > 0 && level > prevLevel + 1) {
        return false; // Skipped heading level
      }
      prevLevel = level;
    }
    return true;
  }
};

export default {
  testA11y,
  isKeyboardAccessible,
  getFocusableElements,
  hasGoodContrast,
  hasAccessibleName,
  a11yHelpers,
};
