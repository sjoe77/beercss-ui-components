import { UIComponent } from './base/ui-component.js';

/**
 * BeerCSS Accordion Component
 * Collapsible content sections
 * 
 * Usage:
 * <ui-accordion>
 *   <ui-accordion-item title="Section 1" open>Content 1</ui-accordion-item>
 *   <ui-accordion-item title="Section 2">Content 2</ui-accordion-item>
 * </ui-accordion>
 */
export class UIAccordion extends UIComponent {
  static get observedAttributes() {
    return ['multiple', 'variant'];
  }

  init() {
    this.items = [];
    this.processItems();
  }

  processItems() {
    // Find all ui-accordion-item children
    const itemElements = Array.from(this.children).filter(child => 
      child.tagName.toLowerCase() === 'ui-accordion-item'
    );
    
    itemElements.forEach((itemEl, index) => {
      this.items.push(itemEl);
      
      // Set up item reference to parent accordion
      itemEl.accordion = this;
      itemEl.index = index;
    });
  }

  toggleItem(item) {
    const isMultiple = this.getBooleanAttribute('multiple');
    
    if (!isMultiple && !item.getBooleanAttribute('open')) {
      // Close all other items if not multiple
      this.items.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.close();
        }
      });
    }
    
    item.toggle();
  }

  // Public methods
  openAll() {
    this.items.forEach(item => item.open());
  }

  closeAll() {
    this.items.forEach(item => item.close());
  }

  getOpenItems() {
    return this.items.filter(item => item.getBooleanAttribute('open'));
  }
}

/**
 * Accordion Item Component
 */
export class UIAccordionItem extends UIComponent {
  static get observedAttributes() {
    return ['title', 'open', 'disabled'];
  }

  init() {
    // Store original content
    this.originalContent = this.innerHTML;
    
    // Create structure
    this.header = this.createElement('div', 'accordion-header');
    this.content = this.createElement('div', 'accordion-content');
    
    // Clear and rebuild
    this.innerHTML = '';
    this.appendChild(this.header);
    this.appendChild(this.content);
    
    this.updateItem();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this._initialized && oldValue !== newValue) {
      this.updateItem();
    }
  }

  bindEvents() {
    this.header.addEventListener('click', () => {
      if (!this.getBooleanAttribute('disabled')) {
        if (this.accordion) {
          this.accordion.toggleItem(this);
        } else {
          this.toggle();
        }
      }
    });

    this.header.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && !this.getBooleanAttribute('disabled')) {
        e.preventDefault();
        if (this.accordion) {
          this.accordion.toggleItem(this);
        } else {
          this.toggle();
        }
      }
    });
  }

  updateItem() {
    // Update header
    const title = this.getAttribute('title') || 'Accordion Item';
    const disabled = this.getBooleanAttribute('disabled');
    const isOpen = this.getBooleanAttribute('open');
    
    this.header.innerHTML = `
      <span class="accordion-title">${title}</span>
      <i class="material-icons accordion-icon">${isOpen ? 'expand_less' : 'expand_more'}</i>
    `;
    
    // Set header attributes
    this.header.setAttribute('role', 'button');
    this.header.setAttribute('tabindex', disabled ? '-1' : '0');
    this.header.setAttribute('aria-expanded', isOpen);
    this.header.setAttribute('aria-disabled', disabled);
    
    if (disabled) {
      this.header.classList.add('disabled');
    } else {
      this.header.classList.remove('disabled');
    }
    
    // Update content
    this.content.innerHTML = this.originalContent;
    this.content.setAttribute('role', 'region');
    this.content.setAttribute('aria-hidden', !isOpen);
    
    // Handle open/close state
    if (isOpen) {
      this.content.style.display = 'block';
      this.classList.add('open');
    } else {
      this.content.style.display = 'none';
      this.classList.remove('open');
    }
  }

  toggle() {
    const isOpen = this.getBooleanAttribute('open');
    if (isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.setBooleanAttribute('open', true);
    this.updateItem();
    this.emit('accordion-open', { item: this });
  }

  close() {
    this.setBooleanAttribute('open', false);
    this.updateItem();
    this.emit('accordion-close', { item: this });
  }

  // Public methods
  get isOpen() {
    return this.getBooleanAttribute('open');
  }

  get title() {
    return this.getAttribute('title');
  }

  set title(value) {
    this.setAttribute('title', value);
  }
}

// Register components
customElements.define('ui-accordion', UIAccordion);
customElements.define('ui-accordion-item', UIAccordionItem);