import { describe, it, expect } from 'vitest';
import {
  isKeyboardAccessible,
  getFocusableElements,
  hasGoodContrast,
  hasAccessibleName,
  a11yHelpers,
} from '@/tests/accessibility';

describe('Accessibility Test Utilities', () => {
  describe('isKeyboardAccessible', () => {
    it('should identify buttons as keyboard accessible', () => {
      const button = document.createElement('button');
      expect(isKeyboardAccessible(button)).toBe(true);
    });

    it('should identify links as keyboard accessible', () => {
      const link = document.createElement('a');
      link.setAttribute('href', '#');
      expect(isKeyboardAccessible(link)).toBe(true);
    });

    it('should identify elements with tabindex="0" as keyboard accessible', () => {
      const div = document.createElement('div');
      div.setAttribute('tabindex', '0');
      expect(isKeyboardAccessible(div)).toBe(true);
    });

    it('should identify elements with interactive roles as keyboard accessible', () => {
      const div = document.createElement('div');
      div.setAttribute('role', 'button');
      expect(isKeyboardAccessible(div)).toBe(true);
    });

    it('should not identify regular divs as keyboard accessible', () => {
      const div = document.createElement('div');
      expect(isKeyboardAccessible(div)).toBe(false);
    });
  });

  describe('getFocusableElements', () => {
    it('should find all focusable elements in a container', () => {
      const container = document.createElement('div');
      container.innerHTML = `
        <button>Button 1</button>
        <a href="#">Link</a>
        <input type="text" />
        <button>Button 2</button>
        <div>Not focusable</div>
      `;

      const focusable = getFocusableElements(container);
      expect(focusable).toHaveLength(4);
    });

    it('should not include disabled elements', () => {
      const container = document.createElement('div');
      container.innerHTML = `
        <button>Enabled</button>
        <button disabled>Disabled</button>
        <input type="text" />
        <input type="text" disabled />
      `;

      const focusable = getFocusableElements(container);
      expect(focusable).toHaveLength(2);
    });

    it('should include elements with tabindex', () => {
      const container = document.createElement('div');
      container.innerHTML = `
        <div tabindex="0">Focusable div</div>
        <span tabindex="0">Focusable span</span>
      `;

      const focusable = getFocusableElements(container);
      expect(focusable).toHaveLength(2);
    });
  });

  describe('hasGoodContrast', () => {
    it('should pass for black text on white background', () => {
      expect(hasGoodContrast('#000000', '#ffffff')).toBe(true);
    });

    it('should pass for dark gray on white (4.5:1 ratio)', () => {
      expect(hasGoodContrast('#595959', '#ffffff')).toBe(true);
    });

    it('should fail for light gray on white', () => {
      expect(hasGoodContrast('#cccccc', '#ffffff')).toBe(false);
    });

    it('should use lower threshold for large text', () => {
      // #888888 has 3.54:1 ratio - passes for large text (3:1) but fails for normal text (4.5:1)
      expect(hasGoodContrast('#888888', '#ffffff', true)).toBe(true);
      expect(hasGoodContrast('#888888', '#ffffff', false)).toBe(false);
    });

    it('should pass for Norwegian blue on white', () => {
      expect(hasGoodContrast('#003366', '#ffffff')).toBe(true);
    });
  });

  describe('hasAccessibleName', () => {
    it('should detect aria-label', () => {
      const button = document.createElement('button');
      button.setAttribute('aria-label', 'Close dialog');
      expect(hasAccessibleName(button)).toBe(true);
    });

    it('should detect text content', () => {
      const button = document.createElement('button');
      button.textContent = 'Click me';
      expect(hasAccessibleName(button)).toBe(true);
    });

    it('should detect title attribute', () => {
      const button = document.createElement('button');
      button.setAttribute('title', 'Tooltip text');
      expect(hasAccessibleName(button)).toBe(true);
    });

    it('should detect alt attribute on images', () => {
      const img = document.createElement('img');
      img.setAttribute('alt', 'Logo');
      expect(hasAccessibleName(img)).toBe(true);
    });

    it('should return false for elements without accessible name', () => {
      const div = document.createElement('div');
      expect(hasAccessibleName(div)).toBe(false);
    });
  });

  describe('a11yHelpers', () => {
    describe('hasLabel', () => {
      it('should detect associated label', () => {
        const container = document.createElement('div');
        container.innerHTML = `
          <label for="test-input">Name</label>
          <input id="test-input" type="text" />
        `;
        document.body.appendChild(container);

        const input = container.querySelector('input');
        expect(a11yHelpers.hasLabel(input!)).toBe(true);

        document.body.removeChild(container);
      });

      it('should detect aria-label', () => {
        const input = document.createElement('input');
        input.setAttribute('aria-label', 'Email address');
        expect(a11yHelpers.hasLabel(input)).toBe(true);
      });

      it('should return false for input without label', () => {
        const input = document.createElement('input');
        expect(a11yHelpers.hasLabel(input)).toBe(false);
      });
    });

    describe('hasAltText', () => {
      it('should detect alt attribute', () => {
        const img = document.createElement('img');
        img.setAttribute('alt', 'Company logo');
        expect(a11yHelpers.hasAltText(img)).toBe(true);
      });

      it('should accept empty alt for decorative images', () => {
        const img = document.createElement('img');
        img.setAttribute('alt', '');
        expect(a11yHelpers.hasAltText(img)).toBe(true);
      });

      it('should return false for missing alt', () => {
        const img = document.createElement('img');
        expect(a11yHelpers.hasAltText(img)).toBe(false);
      });
    });

    describe('checkHeadingHierarchy', () => {
      it('should pass for correct hierarchy', () => {
        const container = document.createElement('div');
        container.innerHTML = `
          <h1>Title</h1>
          <h2>Section</h2>
          <h3>Subsection</h3>
        `;
        expect(a11yHelpers.checkHeadingHierarchy(container)).toBe(true);
      });

      it('should fail for skipped heading levels', () => {
        const container = document.createElement('div');
        container.innerHTML = `
          <h1>Title</h1>
          <h3>Skipped h2</h3>
        `;
        expect(a11yHelpers.checkHeadingHierarchy(container)).toBe(false);
      });

      it('should pass with no headings', () => {
        const container = document.createElement('div');
        container.innerHTML = '<p>No headings here</p>';
        expect(a11yHelpers.checkHeadingHierarchy(container)).toBe(true);
      });

      it('should allow going back to lower levels', () => {
        const container = document.createElement('div');
        container.innerHTML = `
          <h1>Title</h1>
          <h2>Section 1</h2>
          <h3>Subsection</h3>
          <h2>Section 2</h2>
        `;
        expect(a11yHelpers.checkHeadingHierarchy(container)).toBe(true);
      });
    });
  });
});
