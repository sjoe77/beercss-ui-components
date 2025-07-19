import { UIComponent } from '../base/ui-component.js';

/**
 * BeerCSS Grid Component
 * Provides responsive grid layout using BeerCSS grid system
 * 
 * Usage:
 * <ui-grid>
 *   <ui-grid-item cols="s12 m6 l3">Content</ui-grid-item>
 *   <ui-grid-item cols="s12 m6 l9">Content</ui-grid-item>
 * </ui-grid>
 */
export class UIGrid extends UIComponent {
  static get observedAttributes() {
    return ['gap', 'align', 'justify'];
  }

  init() {
    // Apply grid class and ensure display is set correctly
    this.className = 'grid';
    this.style.display = 'grid';
    this.updateStyles();
  }

  render() {
    // Apply additional styling based on attributes
    this.updateStyles();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this._initialized && oldValue !== newValue) {
      this.updateStyles();
    }
  }

  updateStyles() {
    // Handle gap
    const gap = this.getAttribute('gap');
    if (gap) {
      this.style.gap = gap;
    }

    // Handle alignment
    const align = this.getAttribute('align');
    if (align) {
      this.style.alignItems = align;
    }

    const justify = this.getAttribute('justify');
    if (justify) {
      this.style.justifyContent = justify;
    }
  }
}

/**
 * Grid Item Component
 * Represents a column in the grid with responsive breakpoints
 */
export class UIGridItem extends UIComponent {
  static get observedAttributes() {
    return ['cols', 'offset', 'order'];
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

    // Handle responsive columns (e.g., "s12 m6 l3")
    const cols = this.getAttribute('cols');
    if (cols) {
      classes.push(...cols.split(/\s+/));
    }

    // Handle offset
    const offset = this.getAttribute('offset');
    if (offset) {
      classes.push(...offset.split(/\s+/).map(o => `offset-${o}`));
    }

    // Handle order
    const order = this.getAttribute('order');
    if (order) {
      this.style.order = order;
    }

    // Apply classes directly to className
    this.className = classes.join(' ');
  }
}

// Register components
customElements.define('ui-grid', UIGrid);
customElements.define('ui-grid-item', UIGridItem);