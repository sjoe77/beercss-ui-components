import { UIComponent } from './base/ui-component.js';

/**
 * BeerCSS Select Component
 * Material Design select dropdown
 * 
 * Usage:
 * <ui-select label="Country" value="us">
 *   <option value="us">United States</option>
 *   <option value="ca">Canada</option>
 *   <option value="mx">Mexico</option>
 * </ui-select>
 */
export class UISelect extends UIComponent {
  static get observedAttributes() {
    return ['label', 'value', 'required', 'disabled', 'multiple', 'helper', 'error'];
  }

  init() {
    // Store original options
    this.originalOptions = Array.from(this.children);
    
    this.fieldContainer = this.createElement('div', 'field');
    this.selectElement = this.createElement('select');
    this.labelElement = this.createElement('label');
    this.helperElement = this.createElement('div', 'helper');
    
    this.appendChild(this.fieldContainer);
    this.fieldContainer.appendChild(this.selectElement);
    this.fieldContainer.appendChild(this.labelElement);
    this.fieldContainer.appendChild(this.helperElement);

    // Move options to select element
    this.originalOptions.forEach(option => {
      this.selectElement.appendChild(option.cloneNode(true));
    });

    // Bind to state if field-id is present
    this.bindToState();
    this.updateSelect();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this._initialized && oldValue !== newValue) {
      this.updateSelect();
    }
  }

  bindEvents() {
    this.selectElement.addEventListener('change', (e) => {
      const value = this.multiple ? 
        Array.from(e.target.selectedOptions).map(option => option.value) :
        e.target.value;
        
      this.emit('change', { 
        value, 
        selectedOptions: Array.from(e.target.selectedOptions),
        originalEvent: e 
      });
      this.validate();
    });

    this.selectElement.addEventListener('focus', (e) => {
      this.fieldContainer.classList.add('focused');
      this.emit('focus', { originalEvent: e });
    });

    this.selectElement.addEventListener('blur', (e) => {
      this.fieldContainer.classList.remove('focused');
      this.emit('blur', { originalEvent: e });
      this.validate();
    });
  }

  updateSelect() {
    // Update select attributes
    this.selectElement.required = this.getBooleanAttribute('required');
    this.selectElement.disabled = this.getBooleanAttribute('disabled');
    this.selectElement.multiple = this.getBooleanAttribute('multiple');

    // Update value
    const value = this.getAttribute('value');
    if (value !== null) {
      if (this.multiple) {
        const values = value.split(',');
        Array.from(this.selectElement.options).forEach(option => {
          option.selected = values.includes(option.value);
        });
      } else {
        this.selectElement.value = value;
      }
    }

    // Update label
    const label = this.getAttribute('label');
    if (label) {
      this.labelElement.textContent = label;
    }

    // Update helper text
    this.updateHelper();
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

  validate() {
    if (this.selectElement.checkValidity()) {
      this.removeAttribute('error');
      return true;
    } else {
      const errorMessage = this.getValidationMessage();
      this.setAttribute('error', errorMessage);
      return false;
    }
  }

  getValidationMessage() {
    if (this.selectElement.validity.valueMissing) {
      return `${this.getAttribute('label') || 'Selection'} is required`;
    }
    return this.selectElement.validationMessage;
  }

  // Handle dynamic option changes
  addOption(value, text, selected = false) {
    const option = this.createElement('option', '', { value });
    option.textContent = text;
    option.selected = selected;
    this.selectElement.appendChild(option);
  }

  removeOption(value) {
    const option = this.selectElement.querySelector(`option[value="${value}"]`);
    if (option) {
      option.remove();
    }
  }

  clearOptions() {
    this.selectElement.innerHTML = '';
  }

  // Public methods
  get value() {
    if (this.multiple) {
      return Array.from(this.selectElement.selectedOptions).map(option => option.value);
    }
    return this.selectElement.value;
  }

  set value(val) {
    if (this.multiple && Array.isArray(val)) {
      Array.from(this.selectElement.options).forEach(option => {
        option.selected = val.includes(option.value);
      });
      this.setAttribute('value', val.join(','));
    } else {
      this.selectElement.value = val;
      this.setAttribute('value', val);
    }
  }

  get multiple() {
    return this.getBooleanAttribute('multiple');
  }

  focus() {
    this.selectElement.focus();
  }

  blur() {
    this.selectElement.blur();
  }

  checkValidity() {
    return this.validate();
  }

  // State management methods
  setOptions(options) {
    this.clearOptions();
    options.forEach(option => {
      this.addOption(option.value, option.label);
    });
  }

  setValue(value) {
    this.value = value;
  }
}

// Register component
customElements.define('ui-select', UISelect);