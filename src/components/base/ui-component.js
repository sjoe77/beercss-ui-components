/**
 * Enhanced Base Component for BeerCSS UI Components
 * Production-ready foundation with proper error handling, accessibility, and performance
 */
export class UIComponent extends HTMLElement {
  constructor() {
    super();
    this._initialized = false;
    this._observers = [];
    this._eventListeners = [];
    this._state = new Map();
    this._renderScheduled = false;
    this._destroyed = false;
    
    // Bind methods to preserve context
    this._handleAttributeChange = this._handleAttributeChange.bind(this);
    this._scheduleRender = this._scheduleRender.bind(this);
  }

  connectedCallback() {
    if (this._destroyed) return;
    
    try {
      if (!this._initialized) {
        this._setupComponent();
        this._initialized = true;
      }
    } catch (error) {
      this._handleError('connectedCallback', error);
    }
  }

  disconnectedCallback() {
    this._cleanup();
  }

  /**
   * Setup component with proper error boundaries
   * @private
   */
  _setupComponent() {
    // Initialize in correct order
    this._setupAccessibility();
    this.init();
    this._scheduleRender();
    this._bindEvents();
    this._bindToState();
  }

  /**
   * Setup basic accessibility attributes
   * @private
   */
  _setupAccessibility() {
    // Ensure focusable elements have proper tabindex
    if (!this.hasAttribute('tabindex') && this._shouldBeFocusable()) {
      this.setAttribute('tabindex', '0');
    }
    
    // Add role if not present
    if (!this.hasAttribute('role') && this._getDefaultRole()) {
      this.setAttribute('role', this._getDefaultRole());
    }
  }

  /**
   * Determine if component should be focusable
   * @protected
   */
  _shouldBeFocusable() {
    return false; // Override in subclasses
  }

  /**
   * Get default ARIA role
   * @protected
   */
  _getDefaultRole() {
    return null; // Override in subclasses
  }

  /**
   * Initialize component - override in subclasses
   * @protected
   */
  init() {
    // Override in subclasses
  }

  /**
   * Render component with batching
   * @protected
   */
  render() {
    // Override in subclasses
  }

  /**
   * Bind event listeners - override in subclasses
   * @protected
   */
  _bindEvents() {
    // Override in subclasses - use addEventListener() method
  }

  /**
   * Schedule render using RAF for performance
   * @private
   */
  _scheduleRender() {
    if (this._renderScheduled || this._destroyed) return;
    
    this._renderScheduled = true;
    requestAnimationFrame(() => {
      if (!this._destroyed) {
        try {
          this.render();
        } catch (error) {
          this._handleError('render', error);
        } finally {
          this._renderScheduled = false;
        }
      }
    });
  }

  /**
   * Handle attribute changes with debouncing
   * @private
   */
  _handleAttributeChange(name, oldValue, newValue) {
    if (this._destroyed || oldValue === newValue) return;
    
    try {
      this.attributeChangedCallback(name, oldValue, newValue);
      this._scheduleRender();
    } catch (error) {
      this._handleError('attributeChange', error);
    }
  }

  /**
   * Default attribute change handler
   * @protected
   */
  attributeChangedCallback(name, oldValue, newValue) {
    // Override in subclasses
  }

  /**
   * Add event listener with cleanup tracking
   * @param {EventTarget} target 
   * @param {string} event 
   * @param {Function} handler 
   * @param {object|boolean} options 
   */
  addEventListener(target, event, handler, options = {}) {
    target.addEventListener(event, handler, options);
    this._eventListeners.push({
      target,
      event,
      handler,
      options
    });
  }

  /**
   * Create element with proper error handling
   * @param {string} tagName 
   * @param {string|Array<string>} classes 
   * @param {object} attributes 
   * @returns {HTMLElement}
   */
  createElement(tagName, classes = '', attributes = {}) {
    try {
      const element = document.createElement(tagName);
      
      if (classes) {
        this._applyClasses(element, classes);
      }
      
      this._applyAttributes(element, attributes);
      
      return element;
    } catch (error) {
      this._handleError('createElement', error);
      return document.createElement('div'); // Fallback
    }
  }

  /**
   * Apply classes safely
   * @private
   */
  _applyClasses(element, classes) {
    if (typeof classes === 'string' && classes.trim()) {
      element.className = classes.trim();
    } else if (Array.isArray(classes)) {
      element.className = classes.filter(Boolean).join(' ');
    }
  }

  /**
   * Apply attributes safely
   * @private
   */
  _applyAttributes(element, attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      try {
        if (value == null) return;
        
        if (key.startsWith('data-') || key.startsWith('aria-') || 
            ['id', 'role', 'tabindex', 'title'].includes(key)) {
          element.setAttribute(key, String(value));
        } else if (key === 'style' && typeof value === 'object') {
          Object.assign(element.style, value);
        } else {
          element[key] = value;
        }
      } catch (error) {
        console.warn(`Failed to set attribute ${key}:`, error);
      }
    });
  }

  /**
   * Emit custom events with proper error handling
   * @param {string} eventName 
   * @param {object} detail 
   * @param {object} options 
   */
  emit(eventName, detail = {}, options = {}) {
    try {
      const event = new CustomEvent(eventName, {
        detail,
        bubbles: options.bubbles !== false,
        cancelable: options.cancelable !== false,
        composed: options.composed === true
      });
      
      return this.dispatchEvent(event);
    } catch (error) {
      this._handleError('emit', error);
      return false;
    }
  }

  /**
   * Get boolean attribute with proper parsing
   * @param {string} name 
   * @returns {boolean}
   */
  getBooleanAttribute(name) {
    const value = this.getAttribute(name);
    return value !== null && value !== 'false';
  }

  /**
   * Set boolean attribute properly
   * @param {string} name 
   * @param {boolean} value 
   */
  setBooleanAttribute(name, value) {
    if (value) {
      this.setAttribute(name, '');
    } else {
      this.removeAttribute(name);
    }
  }

  /**
   * Get JSON attribute with validation
   * @param {string} name 
   * @param {*} defaultValue 
   * @returns {*}
   */
  getJSONAttribute(name, defaultValue = null) {
    try {
      const value = this.getAttribute(name);
      return value ? JSON.parse(value) : defaultValue;
    } catch (error) {
      console.warn(`Invalid JSON in attribute ${name}:`, error);
      return defaultValue;
    }
  }

  /**
   * Set JSON attribute safely
   * @param {string} name 
   * @param {*} value 
   */
  setJSONAttribute(name, value) {
    try {
      this.setAttribute(name, JSON.stringify(value));
    } catch (error) {
      console.warn(`Failed to set JSON attribute ${name}:`, error);
    }
  }

  /**
   * Bind to centralized state with error handling
   * @private
   */
  _bindToState() {
    const fieldId = this.getAttribute('field-id');
    if (!fieldId || !window.AppState?.fields) return;
    
    try {
      const fieldState = window.AppState.fields[fieldId];
      if (fieldState) {
        this._applyStateToComponent(fieldState);
      }
    } catch (error) {
      this._handleError('bindToState', error);
    }
  }

  /**
   * Apply state to component
   * @private
   */
  _applyStateToComponent(fieldState) {
    Object.entries(fieldState).forEach(([key, value]) => {
      try {
        if (key === 'value' && this.setValue) {
          this.setValue(value);
        } else if (key === 'options' && this.setOptions) {
          this.setOptions(value);
        } else if (typeof value === 'boolean') {
          this.setBooleanAttribute(key, value);
        } else if (value !== null && value !== undefined) {
          this.setAttribute(key, String(value));
        }
      } catch (error) {
        console.warn(`Failed to apply state property ${key}:`, error);
      }
    });
  }

  /**
   * Sync from state with error handling
   */
  syncFromState() {
    if (this._destroyed) return;
    
    try {
      this._bindToState();
      this._scheduleRender();
    } catch (error) {
      this._handleError('syncFromState', error);
    }
  }

  /**
   * Handle errors consistently
   * @private
   */
  _handleError(context, error) {
    console.error(`UIComponent Error in ${context}:`, error);
    
    // Emit error event for debugging
    if (!this._destroyed) {
      this.emit('component-error', {
        context,
        error: error.message,
        stack: error.stack
      }, { bubbles: false });
    }
  }

  /**
   * Cleanup resources properly
   * @private
   */
  _cleanup() {
    this._destroyed = true;
    
    // Remove event listeners
    this._eventListeners.forEach(({ target, event, handler, options }) => {
      try {
        target.removeEventListener(event, handler, options);
      } catch (error) {
        console.warn('Failed to remove event listener:', error);
      }
    });
    this._eventListeners = [];
    
    // Disconnect observers
    this._observers.forEach(observer => {
      try {
        observer.disconnect();
      } catch (error) {
        console.warn('Failed to disconnect observer:', error);
      }
    });
    this._observers = [];
    
    // Clear state
    this._state.clear();
    
    // Call subclass cleanup
    try {
      this.cleanup();
    } catch (error) {
      console.warn('Error in cleanup:', error);
    }
  }

  /**
   * Cleanup hook for subclasses
   * @protected
   */
  cleanup() {
    // Override in subclasses
  }

  /**
   * Component state management
   * @param {string} key 
   * @param {*} value 
   */
  setState(key, value) {
    const oldValue = this._state.get(key);
    if (oldValue !== value) {
      this._state.set(key, value);
      this.onStateChange?.(key, value, oldValue);
      this._scheduleRender();
    }
  }

  /**
   * Get state value
   * @param {string} key 
   * @param {*} defaultValue 
   * @returns {*}
   */
  getState(key, defaultValue = undefined) {
    return this._state.get(key) ?? defaultValue;
  }

  /**
   * Check if component is in error state
   * @returns {boolean}
   */
  get hasError() {
    return this.hasAttribute('error') || this.getState('hasError', false);
  }

  /**
   * Set error state
   * @param {string|null} error 
   */
  setError(error) {
    if (error) {
      this.setAttribute('error', error);
      this.setState('hasError', true);
    } else {
      this.removeAttribute('error');
      this.setState('hasError', false);
    }
  }
}