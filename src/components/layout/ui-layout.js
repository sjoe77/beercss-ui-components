import { UIComponent } from '../base/ui-component.js';

/**
 * Layout Container Component
 * Provides layout utilities and positioning
 * 
 * Usage:
 * <ui-layout position="absolute" align="center middle">Content</ui-layout>
 * <ui-layout responsive margin="large">Content</ui-layout>
 */
export class UILayout extends UIComponent {
  static get observedAttributes() {
    return ['position', 'align', 'margin', 'padding', 'responsive', 'fill'];
  }

  init() {
    this.updateClasses();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this._initialized && oldValue !== newValue) {
      this.updateClasses();
    }
  }

  updateClasses() {
    let classes = [];

    // Handle position
    const position = this.getAttribute('position');
    if (position) {
      classes.push(position); // absolute, fixed, etc.
    }

    // Handle alignment
    const align = this.getAttribute('align');
    if (align) {
      classes.push(...align.split(/\s+/)); // center, middle, left-align, etc.
    }

    // Handle margin
    const margin = this.getAttribute('margin');
    if (margin) {
      if (margin === 'none') {
        classes.push('no-margin');
      } else {
        classes.push(`${margin}-margin`); // small-margin, medium-margin, etc.
      }
    }

    // Handle padding
    const padding = this.getAttribute('padding');
    if (padding) {
      if (padding === 'none') {
        classes.push('no-padding');
      } else {
        classes.push(`${padding}-padding`);
      }
    }

    // Handle responsive
    if (this.getBooleanAttribute('responsive')) {
      classes.push('responsive');
    }

    // Handle fill
    if (this.getBooleanAttribute('fill')) {
      classes.push('fill');
    }

    this.applyClasses(this, classes.join(' '));
  }
}

/**
 * Flexbox Container Component
 * Provides flexbox layout utilities
 */
export class UIFlex extends UIComponent {
  static get observedAttributes() {
    return ['direction', 'wrap', 'justify', 'align', 'gap'];
  }

  init() {
    this.style.display = 'flex';
    this.updateStyles();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this._initialized && oldValue !== newValue) {
      this.updateStyles();
    }
  }

  updateStyles() {
    // Handle flex direction
    const direction = this.getAttribute('direction');
    if (direction) {
      this.style.flexDirection = direction; // row, column, row-reverse, column-reverse
    }

    // Handle flex wrap
    const wrap = this.getAttribute('wrap');
    if (wrap) {
      this.style.flexWrap = wrap; // wrap, nowrap, wrap-reverse
    }

    // Handle justify content
    const justify = this.getAttribute('justify');
    if (justify) {
      this.style.justifyContent = justify; // flex-start, center, space-between, etc.
    }

    // Handle align items
    const align = this.getAttribute('align');
    if (align) {
      this.style.alignItems = align; // flex-start, center, stretch, etc.
    }

    // Handle gap
    const gap = this.getAttribute('gap');
    if (gap) {
      this.style.gap = gap;
    }
  }
}

/**
 * Flex Item Component
 * Represents an item in a flex container
 */
export class UIFlexItem extends UIComponent {
  static get observedAttributes() {
    return ['grow', 'shrink', 'basis', 'align'];
  }

  init() {
    this.updateStyles();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this._initialized && oldValue !== newValue) {
      this.updateStyles();
    }
  }

  updateStyles() {
    // Handle flex grow
    const grow = this.getAttribute('grow');
    if (grow !== null) {
      this.style.flexGrow = grow || '1';
    }

    // Handle flex shrink
    const shrink = this.getAttribute('shrink');
    if (shrink !== null) {
      this.style.flexShrink = shrink || '1';
    }

    // Handle flex basis
    const basis = this.getAttribute('basis');
    if (basis) {
      this.style.flexBasis = basis;
    }

    // Handle align self
    const align = this.getAttribute('align');
    if (align) {
      this.style.alignSelf = align;
    }
  }
}

// Register components
customElements.define('ui-layout', UILayout);
customElements.define('ui-flex', UIFlex);
customElements.define('ui-flex-item', UIFlexItem);