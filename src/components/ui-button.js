import { UIComponent } from './base/ui-component.js';

/**
 * BeerCSS Button Component
 * Material Design button with various styles and features
 * 
 * Usage:
 * <ui-button variant="filled" icon="add">Add Item</ui-button>
 * <ui-button variant="outlined" disabled>Disabled</ui-button>
 */
export class UIButton extends UIComponent {
  static get observedAttributes() {
    return ['variant', 'icon', 'icon-position', 'disabled', 'loading', 'size', 'round'];
  }

  init() {
    // Store the original content
    this.originalContent = this.innerHTML || this.textContent;
    
    this.button = this.createElement('button');
    
    // Clear the custom element and add the button
    this.innerHTML = '';
    this.appendChild(this.button);
    
    // Update button with content and styling
    this.updateButton();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this._initialized && oldValue !== newValue) {
      this.updateButton();
    }
  }

  bindEvents() {
    // Forward button events
    this.button.addEventListener('click', (e) => {
      if (!this.getBooleanAttribute('disabled') && !this.getBooleanAttribute('loading')) {
        this.emit('click', { originalEvent: e });
      }
    });

    this.button.addEventListener('focus', (e) => {
      this.emit('focus', { originalEvent: e });
    });

    this.button.addEventListener('blur', (e) => {
      this.emit('blur', { originalEvent: e });
    });
  }

  getButtonText() {
    // Get text content from original content, excluding any HTML tags
    return this.originalContent ? this.originalContent.replace(/<[^>]*>/g, '').trim() : '';
  }

  updateButton() {
    let classes = [];
    
    // Handle variant
    const variant = this.getAttribute('variant') || 'filled';
    if (variant !== 'text') {
      classes.push(variant); // filled, outlined, tonal
    }

    // Handle size
    const size = this.getAttribute('size');
    if (size && size !== 'medium') {
      classes.push(size); // small, large
    }

    // Handle round
    if (this.getBooleanAttribute('round')) {
      classes.push('round');
    }

    // Apply classes
    this.applyClasses(this.button, classes.join(' '));

    // Handle disabled state
    this.button.disabled = this.getBooleanAttribute('disabled');

    // Handle loading state
    const loading = this.getBooleanAttribute('loading');
    if (loading) {
      this.button.disabled = true;
    }

    // Update button content
    this.renderButtonContent();
  }

  renderButtonContent() {
    const icon = this.getAttribute('icon');
    const iconPosition = this.getAttribute('icon-position') || 'left';
    const loading = this.getBooleanAttribute('loading');
    const text = this.getButtonText();

    // Clear button content
    this.button.innerHTML = '';

    if (loading) {
      // Show loading spinner
      const spinner = this.createElement('i', 'material-icons', { 
        style: 'animation: spin 1s linear infinite;' 
      });
      spinner.textContent = 'refresh';
      this.button.appendChild(spinner);
      
      if (text) {
        const textSpan = this.createElement('span');
        textSpan.textContent = text;
        this.button.appendChild(textSpan);
      }
    } else {
      // Handle icon and text
      if (icon && iconPosition === 'left') {
        const iconEl = this.createElement('i', 'material-icons');
        iconEl.textContent = icon;
        this.button.appendChild(iconEl);
      }

      if (text) {
        const textSpan = this.createElement('span');
        textSpan.textContent = text;
        this.button.appendChild(textSpan);
      }

      if (icon && iconPosition === 'right') {
        const iconEl = this.createElement('i', 'material-icons');
        iconEl.textContent = icon;
        this.button.appendChild(iconEl);
      }

      // Icon-only button
      if (icon && !text) {
        const iconEl = this.createElement('i', 'material-icons');
        iconEl.textContent = icon;
        this.button.appendChild(iconEl);
        this.button.classList.add('circle');
      }
    }
  }

  // Public methods
  focus() {
    this.button.focus();
  }

  blur() {
    this.button.blur();
  }

  click() {
    if (!this.getBooleanAttribute('disabled') && !this.getBooleanAttribute('loading')) {
      this.button.click();
    }
  }
}

// Register component
customElements.define('ui-button', UIButton);