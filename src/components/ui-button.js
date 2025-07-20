import { UIComponent } from './base/ui-component.js';

/**
 * Professional BeerCSS Button Component
 * Uses native BeerCSS classes for proper Material Design 3 styling
 * 
 * @example
 * <ui-button variant="large">Large Button</ui-button>
 * <ui-button variant="outline" icon="add">Outlined with Icon</ui-button>
 * <ui-button round icon="favorite"></ui-button>
 */
export class UIButton extends UIComponent {
  static get observedAttributes() {
    return [
      'variant', 'icon', 'disabled', 'loading', 'round', 'circle',
      'href', 'target', 'type', 'form'
    ];
  }

  constructor() {
    super();
    this._originalContent = '';
    this._button = null;
  }

  _shouldBeFocusable() {
    return !this.getBooleanAttribute('disabled');
  }

  _getDefaultRole() {
    return this.getAttribute('href') ? 'link' : 'button';
  }

  init() {
    // Preserve original content
    this._originalContent = this.innerHTML.trim() || this.textContent.trim() || '';
    
    // Create button or link using BeerCSS approach
    const isLink = this.hasAttribute('href');
    this._button = this.createElement(isLink ? 'a' : 'button');
    
    // Clear and append
    this.innerHTML = '';
    this.appendChild(this._button);
  }

  render() {
    if (!this._button) return;
    
    this._updateButtonProperties();
    this._updateBeerCSSClasses();
    this._renderContent();
  }

  _bindEvents() {
    if (!this._button) return;

    this.addEventListener(this._button, 'click', (e) => {
      if (!this.getBooleanAttribute('disabled') && !this.getBooleanAttribute('loading')) {
        this.emit('click', { originalEvent: e, value: this._getButtonText() });
      }
    });

    this.addEventListener(this._button, 'focus', (e) => {
      this.emit('focus', { originalEvent: e });
    });

    this.addEventListener(this._button, 'blur', (e) => {
      this.emit('blur', { originalEvent: e });
    });
  }

  _updateButtonProperties() {
    const isLink = this._button.tagName === 'A';
    
    if (isLink) {
      const href = this.getAttribute('href');
      if (href) this._button.href = href;
      
      const target = this.getAttribute('target');
      if (target) this._button.target = target;
      
      if (this.getBooleanAttribute('disabled')) {
        this._button.removeAttribute('href');
        this._button.setAttribute('aria-disabled', 'true');
      }
    } else {
      this._button.type = this.getAttribute('type') || 'button';
      this._button.disabled = this.getBooleanAttribute('disabled') || this.getBooleanAttribute('loading');
      
      const form = this.getAttribute('form');
      if (form) this._button.form = form;
    }
  }

  _updateBeerCSSClasses() {
    const classes = [];
    
    // BeerCSS variant classes
    const variant = this.getAttribute('variant');
    if (variant) {
      // Map our variants to BeerCSS classes
      const variantMap = {
        'outline': 'border',
        'outlined': 'border', 
        'large': 'large',
        'small': 'small',
        'medium': '', // default
        'fill': '', // default filled button
        'filled': '' // default filled button
      };
      
      if (variantMap[variant] !== undefined) {
        if (variantMap[variant]) classes.push(variantMap[variant]);
      }
    }
    
    // BeerCSS modifiers
    if (this.getBooleanAttribute('round')) classes.push('round');
    if (this.getBooleanAttribute('circle')) classes.push('circle');
    
    // Icon-only button gets circle class automatically
    if (this._isIconOnly()) {
      classes.push('circle');
    }
    
    this._button.className = classes.join(' ').trim();
  }

  _renderContent() {
    const icon = this.getAttribute('icon');
    const loading = this.getBooleanAttribute('loading');
    const text = this._getButtonText();

    // Clear existing content
    this._button.innerHTML = '';

    if (loading) {
      // BeerCSS loading spinner
      const spinner = this.createElement('progress', 'circle small');
      this._button.appendChild(spinner);
      
      if (text) {
        const textSpan = document.createTextNode(' ' + text);
        this._button.appendChild(textSpan);
      }
    } else {
      // Render icon using BeerCSS Material Icons
      if (icon) {
        const iconEl = this.createElement('i');
        iconEl.textContent = icon;
        this._button.appendChild(iconEl);
      }

      // Render text
      if (text) {
        if (icon) {
          // Add space between icon and text
          this._button.appendChild(document.createTextNode(' ' + text));
        } else {
          this._button.appendChild(document.createTextNode(text));
        }
      }
    }
  }

  _getButtonText() {
    return this._originalContent.replace(/<[^>]*>/g, '').trim();
  }

  _isIconOnly() {
    return this.getAttribute('icon') && !this._getButtonText();
  }

  // Public API
  focus() {
    if (this._button && !this.getBooleanAttribute('disabled')) {
      this._button.focus();
    }
  }

  blur() {
    if (this._button) {
      this._button.blur();
    }
  }

  click() {
    if (this._button && !this.getBooleanAttribute('disabled') && !this.getBooleanAttribute('loading')) {
      this._button.click();
    }
  }

  get text() {
    return this._getButtonText();
  }

  set text(text) {
    this._originalContent = text;
    this._scheduleRender();
  }

  get disabled() {
    return this.getBooleanAttribute('disabled');
  }

  set disabled(value) {
    this.setBooleanAttribute('disabled', value);
  }

  get loading() {
    return this.getBooleanAttribute('loading');
  }

  set loading(value) {
    this.setBooleanAttribute('loading', value);
  }
}

customElements.define('ui-button', UIButton);