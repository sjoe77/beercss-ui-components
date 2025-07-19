import { UIComponent } from './base/ui-component.js';

/**
 * BeerCSS Input Component
 * Material Design input field with validation and features
 * 
 * Usage:
 * <ui-input label="Email" type="email" required></ui-input>
 * <ui-input label="Password" type="password" helper="Min 8 characters"></ui-input>
 */
export class UIInput extends UIComponent {
  static get observedAttributes() {
    return [
      'label', 'type', 'placeholder', 'value', 'required', 'disabled', 
      'readonly', 'min', 'max', 'step', 'pattern', 'maxlength', 'minlength',
      'helper', 'error', 'icon', 'icon-position', 'autocomplete'
    ];
  }

  init() {
    this.fieldContainer = this.createElement('div', 'field');
    this.inputElement = this.createElement('input');
    this.labelElement = this.createElement('label');
    this.helperElement = this.createElement('div', 'helper');
    
    this.appendChild(this.fieldContainer);
    this.fieldContainer.appendChild(this.inputElement);
    this.fieldContainer.appendChild(this.labelElement);
    this.fieldContainer.appendChild(this.helperElement);

    // Bind to state if field-id is present
    this.bindToState();
    this.updateInput();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this._initialized && oldValue !== newValue) {
      this.updateInput();
    }
  }

  bindEvents() {
    this.inputElement.addEventListener('input', (e) => {
      this.emit('input', { 
        value: e.target.value, 
        originalEvent: e 
      });
      this.validate();
    });

    this.inputElement.addEventListener('change', (e) => {
      this.emit('change', { 
        value: e.target.value, 
        originalEvent: e 
      });
    });

    this.inputElement.addEventListener('focus', (e) => {
      this.fieldContainer.classList.add('focused');
      this.emit('focus', { originalEvent: e });
    });

    this.inputElement.addEventListener('blur', (e) => {
      this.fieldContainer.classList.remove('focused');
      this.emit('blur', { originalEvent: e });
      this.validate();
    });

    this.inputElement.addEventListener('keydown', (e) => {
      this.emit('keydown', { 
        key: e.key, 
        value: e.target.value, 
        originalEvent: e 
      });
    });
  }

  updateInput() {
    // Update input attributes
    const type = this.getAttribute('type') || 'text';
    this.inputElement.type = type;

    const placeholder = this.getAttribute('placeholder');
    if (placeholder) {
      this.inputElement.placeholder = placeholder;
    }

    const value = this.getAttribute('value');
    if (value !== null) {
      this.inputElement.value = value;
    }

    // Boolean attributes
    this.inputElement.required = this.getBooleanAttribute('required');
    this.inputElement.disabled = this.getBooleanAttribute('disabled');
    this.inputElement.readOnly = this.getBooleanAttribute('readonly');

    // Numeric attributes
    ['min', 'max', 'step', 'maxlength', 'minlength'].forEach(attr => {
      const val = this.getAttribute(attr);
      if (val !== null) {
        this.inputElement.setAttribute(attr, val);
      }
    });

    // Pattern validation
    const pattern = this.getAttribute('pattern');
    if (pattern) {
      this.inputElement.pattern = pattern;
    }

    // Autocomplete
    const autocomplete = this.getAttribute('autocomplete');
    if (autocomplete) {
      this.inputElement.autocomplete = autocomplete;
    }

    // Update label
    const label = this.getAttribute('label');
    if (label) {
      this.labelElement.textContent = label;
    }

    // Update helper text
    this.updateHelper();

    // Handle icons
    this.updateIcon();
  }

  updateHelper() {
    const helper = this.getAttribute('helper');
    const error = this.getAttribute('error');
    
    if (error) {
      this.helperElement.textContent = error;
      this.helperElement.className = 'helper error';
      this.fieldContainer.classList.add('invalid');
    } else if (helper) {
      this.helperElement.textContent = helper;
      this.helperElement.className = 'helper';
      this.fieldContainer.classList.remove('invalid');
    } else {
      this.helperElement.textContent = '';
      this.fieldContainer.classList.remove('invalid');
    }
  }

  updateIcon() {
    // Remove existing icon
    const existingIcon = this.fieldContainer.querySelector('.input-icon');
    if (existingIcon) {
      existingIcon.remove();
    }

    const icon = this.getAttribute('icon');
    const iconPosition = this.getAttribute('icon-position') || 'left';
    
    if (icon) {
      const iconEl = this.createElement('i', 'material-icons input-icon');
      iconEl.textContent = icon;
      
      if (iconPosition === 'right') {
        iconEl.classList.add('right');
        this.fieldContainer.appendChild(iconEl);
      } else {
        iconEl.classList.add('left');
        this.fieldContainer.insertBefore(iconEl, this.inputElement);
      }
    }
  }

  validate() {
    if (this.inputElement.checkValidity()) {
      this.removeAttribute('error');
      return true;
    } else {
      const errorMessage = this.getValidationMessage();
      this.setAttribute('error', errorMessage);
      return false;
    }
  }

  getValidationMessage() {
    if (this.inputElement.validity.valueMissing) {
      return `${this.getAttribute('label') || 'This field'} is required`;
    }
    if (this.inputElement.validity.typeMismatch) {
      return 'Please enter a valid value';
    }
    if (this.inputElement.validity.patternMismatch) {
      return 'Please match the required format';
    }
    if (this.inputElement.validity.tooShort) {
      return `Minimum length is ${this.getAttribute('minlength')} characters`;
    }
    if (this.inputElement.validity.tooLong) {
      return `Maximum length is ${this.getAttribute('maxlength')} characters`;
    }
    if (this.inputElement.validity.rangeUnderflow) {
      return `Minimum value is ${this.getAttribute('min')}`;
    }
    if (this.inputElement.validity.rangeOverflow) {
      return `Maximum value is ${this.getAttribute('max')}`;
    }
    return this.inputElement.validationMessage;
  }

  // Public methods
  get value() {
    return this.inputElement.value;
  }

  set value(val) {
    this.inputElement.value = val;
    this.setAttribute('value', val);
  }

  focus() {
    this.inputElement.focus();
  }

  blur() {
    this.inputElement.blur();
  }

  select() {
    this.inputElement.select();
  }

  checkValidity() {
    return this.validate();
  }

  // State management methods
  setValue(value) {
    this.value = value;
  }
}

// Register component
customElements.define('ui-input', UIInput);