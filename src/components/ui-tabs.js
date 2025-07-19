import { UIComponent } from './base/ui-component.js';

/**
 * BeerCSS Tabs Component
 * Material Design tabs for organizing content
 * 
 * Usage:
 * <ui-tabs active="0">
 *   <ui-tab label="Tab 1">Content 1</ui-tab>
 *   <ui-tab label="Tab 2">Content 2</ui-tab>
 *   <ui-tab label="Tab 3" disabled>Content 3</ui-tab>
 * </ui-tabs>
 */
export class UITabs extends UIComponent {
  static get observedAttributes() {
    return ['active', 'variant'];
  }

  init() {
    this.tabs = [];
    this.tabButtons = [];
    
    // Create tab header
    this.tabHeader = this.createElement('nav', 'tabs');
    this.appendChild(this.tabHeader);
    
    // Create tab content container
    this.tabContent = this.createElement('div', 'tab-content');
    this.appendChild(this.tabContent);
    
    // Process child tabs
    this.processTabs();
    this.updateTabs();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this._initialized && oldValue !== newValue) {
      if (name === 'active') {
        this.setActiveTab(parseInt(newValue) || 0);
      }
    }
  }

  bindEvents() {
    this.tabButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        if (!this.tabs[index].disabled) {
          this.setActiveTab(index);
        }
      });
    });
  }

  processTabs() {
    // Find all ui-tab children
    const tabElements = Array.from(this.children).filter(child => child.tagName.toLowerCase() === 'ui-tab');
    
    tabElements.forEach((tabEl, index) => {
      // Create tab button
      const button = this.createElement('button', '');
      button.textContent = tabEl.getAttribute('label') || `Tab ${index + 1}`;
      
      if (tabEl.hasAttribute('disabled')) {
        button.disabled = true;
        button.classList.add('disabled');
      }
      
      this.tabHeader.appendChild(button);
      this.tabButtons.push(button);
      
      // Move tab content
      const content = this.createElement('div', 'tab-panel');
      content.innerHTML = tabEl.innerHTML;
      content.setAttribute('role', 'tabpanel');
      content.setAttribute('aria-labelledby', `tab-${index}`);
      content.style.display = 'none'; // Hide by default
      
      this.tabContent.appendChild(content);
      
      // Store tab data
      this.tabs.push({
        element: tabEl,
        button: button,
        content: content,
        disabled: tabEl.hasAttribute('disabled')
      });
      
      // Remove original tab element
      tabEl.remove();
    });
  }

  updateTabs() {
    const activeIndex = parseInt(this.getAttribute('active')) || 0;
    this.setActiveTab(activeIndex);
  }

  setActiveTab(index) {
    if (index < 0 || index >= this.tabs.length || this.tabs[index].disabled) {
      return;
    }

    // Update active states
    this.tabs.forEach((tab, i) => {
      const isActive = i === index;
      
      // Update button state
      tab.button.classList.toggle('active', isActive);
      tab.button.setAttribute('aria-selected', isActive);
      
      // Update content visibility
      tab.content.style.display = isActive ? 'block' : 'none';
      tab.content.setAttribute('aria-hidden', !isActive);
    });

    // Update active attribute
    this.setAttribute('active', index);

    // Emit change event
    this.emit('tab-change', {
      activeIndex: index,
      activeTab: this.tabs[index]
    });
  }

  // Public methods
  getActiveTab() {
    const activeIndex = parseInt(this.getAttribute('active')) || 0;
    return this.tabs[activeIndex];
  }

  addTab(label, content, disabled = false) {
    const index = this.tabs.length;
    
    // Create button
    const button = this.createElement('button', '');
    button.textContent = label;
    if (disabled) {
      button.disabled = true;
      button.classList.add('disabled');
    }
    this.tabHeader.appendChild(button);
    
    // Create content
    const contentEl = this.createElement('div', 'tab-panel');
    contentEl.innerHTML = content;
    contentEl.setAttribute('role', 'tabpanel');
    contentEl.setAttribute('aria-labelledby', `tab-${index}`);
    this.tabContent.appendChild(contentEl);
    
    // Add to tabs array
    this.tabs.push({
      button: button,
      content: contentEl,
      disabled: disabled
    });
    
    // Bind event
    button.addEventListener('click', () => {
      if (!disabled) {
        this.setActiveTab(index);
      }
    });
    
    return index;
  }

  removeTab(index) {
    if (index < 0 || index >= this.tabs.length) return;
    
    const tab = this.tabs[index];
    tab.button.remove();
    tab.content.remove();
    this.tabs.splice(index, 1);
    
    // Adjust active tab if necessary
    const activeIndex = parseInt(this.getAttribute('active')) || 0;
    if (activeIndex >= index && activeIndex > 0) {
      this.setActiveTab(activeIndex - 1);
    } else if (this.tabs.length > 0) {
      this.setActiveTab(0);
    }
  }
}

/**
 * Individual Tab Component (used within ui-tabs)
 */
export class UITab extends UIComponent {
  static get observedAttributes() {
    return ['label', 'disabled'];
  }

  // This component is processed by UITabs and doesn't render independently
}

// Register components
customElements.define('ui-tabs', UITabs);
customElements.define('ui-tab', UITab);