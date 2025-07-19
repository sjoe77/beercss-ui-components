import { UIComponent } from './base/ui-component.js';

/**
 * BeerCSS Card Component
 * Material Design card container
 * 
 * Usage:
 * <ui-card>
 *   <ui-card-header title="Card Title" subtitle="Subtitle"></ui-card-header>
 *   <ui-card-content>Card content goes here</ui-card-content>
 *   <ui-card-actions>
 *     <ui-button>Action 1</ui-button>
 *     <ui-button>Action 2</ui-button>
 *   </ui-card-actions>
 * </ui-card>
 */
export class UICard extends UIComponent {
  static get observedAttributes() {
    return ['variant', 'clickable', 'loading'];
  }

  init() {
    this.updateCard();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this._initialized && oldValue !== newValue) {
      this.updateCard();
    }
  }

  bindEvents() {
    if (this.getBooleanAttribute('clickable')) {
      this.addEventListener('click', (e) => {
        this.emit('card-click', { originalEvent: e });
      });
      
      this.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.emit('card-click', { originalEvent: e });
        }
      });
    }
  }

  updateCard() {
    let classes = ['card'];
    
    // Handle variant
    const variant = this.getAttribute('variant');
    if (variant && variant !== 'elevated') {
      classes.push(variant); // outlined, filled
    }
    
    // Handle clickable
    if (this.getBooleanAttribute('clickable')) {
      classes.push('clickable');
      this.setAttribute('tabindex', '0');
      this.setAttribute('role', 'button');
    } else {
      this.removeAttribute('tabindex');
      this.removeAttribute('role');
    }
    
    // Handle loading state
    if (this.getBooleanAttribute('loading')) {
      classes.push('loading');
    }
    
    this.applyClasses(this, classes.join(' '));
  }
}

/**
 * Card Header Component
 */
export class UICardHeader extends UIComponent {
  static get observedAttributes() {
    return ['title', 'subtitle', 'avatar', 'action'];
  }

  init() {
    this.applyClasses(this, 'card-header');
    this.updateHeader();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this._initialized && oldValue !== newValue) {
      this.updateHeader();
    }
  }

  updateHeader() {
    const title = this.getAttribute('title');
    const subtitle = this.getAttribute('subtitle');
    const avatar = this.getAttribute('avatar');
    const action = this.getAttribute('action');
    
    let headerHTML = '';
    
    // Avatar
    if (avatar) {
      headerHTML += `<img src="${avatar}" alt="Avatar" class="circle small">`;
    }
    
    // Title and subtitle container
    if (title || subtitle) {
      headerHTML += '<div class="header-content">';
      if (title) {
        headerHTML += `<h6 class="card-title">${title}</h6>`;
      }
      if (subtitle) {
        headerHTML += `<p class="card-subtitle">${subtitle}</p>`;
      }
      headerHTML += '</div>';
    }
    
    // Action button
    if (action) {
      headerHTML += `<button class="circle transparent small">${action}</button>`;
    }
    
    // If no attributes provided, use slotted content
    if (!title && !subtitle && !avatar && !action && this.innerHTML.trim()) {
      return; // Keep existing content
    }
    
    this.innerHTML = headerHTML;
  }
}

/**
 * Card Content Component
 */
export class UICardContent extends UIComponent {
  init() {
    this.applyClasses(this, 'card-content');
  }
}

/**
 * Card Actions Component
 */
export class UICardActions extends UIComponent {
  static get observedAttributes() {
    return ['align'];
  }

  init() {
    this.updateActions();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this._initialized && oldValue !== newValue) {
      this.updateActions();
    }
  }

  updateActions() {
    let classes = ['card-actions'];
    
    const align = this.getAttribute('align');
    if (align) {
      classes.push(`${align}-align`); // left-align, right-align, center-align
    }
    
    this.applyClasses(this, classes.join(' '));
  }
}

/**
 * Card Media Component (for images/videos)
 */
export class UICardMedia extends UIComponent {
  static get observedAttributes() {
    return ['src', 'alt', 'aspect-ratio'];
  }

  init() {
    this.applyClasses(this, 'card-media');
    this.updateMedia();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this._initialized && oldValue !== newValue) {
      this.updateMedia();
    }
  }

  updateMedia() {
    const src = this.getAttribute('src');
    const alt = this.getAttribute('alt') || '';
    const aspectRatio = this.getAttribute('aspect-ratio');
    
    if (src) {
      // Create image element
      const img = this.createElement('img', 'responsive', {
        src: src,
        alt: alt
      });
      
      if (aspectRatio) {
        img.style.aspectRatio = aspectRatio;
        img.style.objectFit = 'cover';
      }
      
      this.innerHTML = '';
      this.appendChild(img);
    }
  }
}

// Register components
customElements.define('ui-card', UICard);
customElements.define('ui-card-header', UICardHeader);
customElements.define('ui-card-content', UICardContent);
customElements.define('ui-card-actions', UICardActions);
customElements.define('ui-card-media', UICardMedia);