/**
 * Base class for all BeerCSS UI Components
 * Provides common functionality for custom elements
 */
export class UIComponent extends HTMLElement {
  constructor() {
    super();
    this._initialized = false;
    this._observers = [];
  }

  connectedCallback() {
    if (!this._initialized) {
      this.init();
      this.render();
      this.bindEvents();
      this._initialized = true;
    }
  }

  disconnectedCallback() {
    this.cleanup();
    this._observers.forEach(observer => observer.disconnect());
    this._observers = [];
  }

  /**
   * Initialize component - override in subclasses
   */
  init() {
    // Override in subclasses
  }

  /**
   * Render component - override in subclasses
   */
  render() {
    // Override in subclasses
  }

  /**
   * Bind event listeners - override in subclasses
   */
  bindEvents() {
    // Override in subclasses
  }

  /**
   * Cleanup resources - override in subclasses
   */
  cleanup() {
    // Override in subclasses
  }

  /**
   * Helper to apply BeerCSS classes
   */
  applyClasses(element, classes) {
    if (typeof classes === 'string') {
      element.className = classes;
    } else if (Array.isArray(classes)) {
      element.className = classes.join(' ');
    }
  }

  /**
   * Helper to create element with classes
   */
  createElement(tagName, classes = '', attributes = {}) {
    const element = document.createElement(tagName);
    if (classes) {
      this.applyClasses(element, classes);
    }
    Object.entries(attributes).forEach(([key, value]) => {
      if (key.startsWith('data-') || key === 'id' || key === 'role' || key === 'aria-label') {
        element.setAttribute(key, value);
      } else {
        element[key] = value;
      }
    });
    return element;
  }

  /**
   * Helper to emit custom events
   */
  emit(eventName, detail = {}) {
    const event = new CustomEvent(eventName, {
      detail,
      bubbles: true,
      cancelable: true
    });
    this.dispatchEvent(event);
  }

  /**
   * Helper to observe attribute changes
   */
  observeAttribute(attributeName, callback) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === attributeName) {
          callback(this.getAttribute(attributeName), mutation.oldValue);
        }
      });
    });
    
    observer.observe(this, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: [attributeName]
    });
    
    this._observers.push(observer);
    return observer;
  }

  /**
   * Bind component to centralized state (Phase 3 preview)
   */
  bindToState() {
    const fieldId = this.getAttribute('field-id');
    if (!fieldId || !window.AppState?.fields) return;
    
    const fieldState = window.AppState.fields[fieldId];
    if (fieldState) {
      // Apply state to component attributes
      Object.entries(fieldState).forEach(([key, value]) => {
        if (key === 'value' && this.setValue) {
          this.setValue(value);
        } else if (key === 'options' && this.setOptions) {
          this.setOptions(value);
        } else if (typeof value === 'boolean') {
          this.setBooleanAttribute(key, value);
        } else if (value !== null && value !== undefined) {
          this.setAttribute(key, value);
        }
      });
    }
  }

  /**
   * Sync component from state (Phase 3 preview)
   */
  syncFromState() {
    this.bindToState();
    if (this.updateComponent) {
      this.updateComponent();
    } else if (this.render) {
      this.render();
    }
  }

  /**
   * Helper to get boolean attribute
   */
  getBooleanAttribute(name) {
    return this.hasAttribute(name) && this.getAttribute(name) !== 'false';
  }

  /**
   * Helper to set boolean attribute
   */
  setBooleanAttribute(name, value) {
    if (value) {
      this.setAttribute(name, '');
    } else {
      this.removeAttribute(name);
    }
  }

  /**
   * Helper to get JSON attribute
   */
  getJSONAttribute(name, defaultValue = null) {
    try {
      const value = this.getAttribute(name);
      return value ? JSON.parse(value) : defaultValue;
    } catch (e) {
      console.warn(`Invalid JSON in attribute ${name}:`, e);
      return defaultValue;
    }
  }

  /**
   * Helper to set JSON attribute
   */
  setJSONAttribute(name, value) {
    this.setAttribute(name, JSON.stringify(value));
  }
}