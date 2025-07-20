// Demo Application
// Shows all BeerCSS UI Components with examples

// Component list for navigation
const componentList = [
  { name: 'Accordion', id: 'accordion' },
  { name: 'Button', id: 'button' },
  { name: 'Card', id: 'card' },
  { name: 'Grid', id: 'grid' },
  { name: 'Input', id: 'input' },
  { name: 'Layout', id: 'layout' },
  { name: 'Select', id: 'select' },
  { name: 'Smart Table', id: 'smart-table' },
  { name: 'Tabs', id: 'tabs' }
];

// Sample data for demonstrations
const sampleUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', age: 30, salary: 50000, active: true, department: 'Engineering', joinDate: '2020-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 28, salary: 60000, active: true, department: 'Design', joinDate: '2019-03-22' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 35, salary: 55000, active: false, department: 'Marketing', joinDate: '2018-07-10' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', age: 32, salary: 65000, active: true, department: 'Engineering', joinDate: '2021-02-28' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', age: 29, salary: 58000, active: true, department: 'Sales', joinDate: '2020-11-05' }
];

// Initialize centralized state for Phase 3 demonstration
window.AppState = {
  data: {
    user: {
      name: 'John Doe',
      email: 'john@example.com',
      country: 'us',
      isActive: true
    },
    currentPage: 'button'
  },
  fields: {
    'user.name': {
      value: 'John Doe',
      disabled: false,
      required: true,
      label: 'Full Name'
    },
    'user.email': {
      value: 'john@example.com',
      disabled: false,
      required: true,
      type: 'email',
      label: 'Email Address'
    },
    'user.country': {
      value: 'us',
      disabled: false,
      options: [
        { value: 'us', label: 'United States' },
        { value: 'ca', label: 'Canada' },
        { value: 'mx', label: 'Mexico' },
        { value: 'uk', label: 'United Kingdom' },
        { value: 'de', label: 'Germany' }
      ]
    },
    'userTable': {
      data: sampleUsers,
      columns: [
        { key: 'name', type: 'text', label: 'Name', sortable: true },
        { key: 'email', type: 'text', label: 'Email', sortable: true },
        { key: 'age', type: 'number', label: 'Age', sortable: true },
        { key: 'salary', type: 'currency', label: 'Salary', currency: 'USD', sortable: true },
        { key: 'active', type: 'boolean', label: 'Active', sortable: true },
        { key: 'department', type: 'text', label: 'Department', sortable: true },
        { key: 'joinDate', type: 'date', label: 'Join Date', sortable: true }
      ],
      rowsPerPage: 5,
      searchable: true,
      selectable: true
    }
  }
};

class DemoApp {
  constructor() {
    this.currentComponent = null;
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.setup();
      });
    } else {
      this.setup();
    }
  }

  setup() {
    this.createNavigation();
    this.bindEvents();
    this.showComponent('button'); // Default component
  }

  createNavigation() {
    const navContainer = document.getElementById('nav-links');
    if (!navContainer) {
      console.error('Navigation container not found');
      return;
    }
    
    let navHTML = '';
    componentList.forEach(component => {
      navHTML += `
        <a href="#${component.id}" data-component="${component.id}">
          <i class="material-icons">widgets</i>
          <div>${component.name}</div>
        </a>
      `;
    });
    
    navContainer.innerHTML = navHTML;
  }

  bindEvents() {
    // Navigation clicks
    document.getElementById('nav-links').addEventListener('click', (e) => {
      const link = e.target.closest('a[data-component]');
      if (link) {
        e.preventDefault();
        const componentId = link.dataset.component;
        this.showComponent(componentId);
        
        // Close drawer on mobile
        if (window.innerWidth < 1024) {
          if (window.ui) {
            ui('nav-drawer');
          } else {
            const drawer = document.getElementById('nav-drawer');
            if (drawer) drawer.classList.remove('active');
          }
        }
      }
    });

    // Handle hash changes
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.slice(1);
      if (hash && componentList.find(c => c.id === hash)) {
        this.showComponent(hash);
      }
    });
  }

  showComponent(componentId) {
    this.currentComponent = componentId;
    window.location.hash = componentId;
    
    // Update active navigation
    document.querySelectorAll('#nav-links a').forEach(link => {
      link.classList.toggle('active', link.dataset.component === componentId);
    });

    // Load component example
    this.loadComponentExample(componentId);
  }

  async loadComponentExample(componentId) {
    const contentDiv = document.getElementById('content');
    if (!contentDiv) {
      console.error('Content container not found');
      return;
    }
    
    try {
      // Show loading
      contentDiv.innerHTML = '<div class="center-align" style="padding: 2rem;"><p>Loading...</p></div>';
      
      // Generate component example content
      const exampleContent = this.generateExampleContent(componentId);
      contentDiv.innerHTML = `<div style="padding: 2rem;">${exampleContent}</div>`;
      
      // Bind component-specific events
      this.bindComponentEvents(componentId);
      
    } catch (error) {
      console.error('Error loading component example:', error);
      contentDiv.innerHTML = `
        <div class="center-align" style="padding: 2rem;">
          <h3>Error Loading Component</h3>
          <p>Could not load examples for ${componentId}</p>
          <p><small>${error.message}</small></p>
        </div>
      `;
    }
  }

  generateExampleContent(componentId) {
    switch (componentId) {
      case 'button':
        return this.generateButtonExamples();
      case 'input':
        return this.generateInputExamples();
      case 'select':
        return this.generateSelectExamples();
      case 'card':
        return this.generateCardExamples();
      case 'tabs':
        return this.generateTabsExamples();
      case 'accordion':
        return this.generateAccordionExamples();
      case 'grid':
        return this.generateGridExamples();
      case 'layout':
        return this.generateLayoutExamples();
      case 'smart-table':
        return this.generateSmartTableExamples();
      default:
        return `<h3>${componentId} Examples</h3><p>Examples coming soon...</p>`;
    }
  }

  generateButtonExamples() {
    return `
      <h3>Professional Button Examples - BeerCSS Native</h3>
      
      <div class="grid">
        <div class="s12 m6">
          <h5>Basic BeerCSS Buttons</h5>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem; padding: 1rem; background: rgba(255,255,255,0.02); border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
            <button>Default Button</button>
            <button class="border">Outlined Button</button>
            <button class="transparent">Text Button</button>
            <button class="small">Small Button</button>
          </div>
          
          <h5>BeerCSS Icons & Shapes</h5>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem; padding: 1rem; background: rgba(255,255,255,0.02); border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
            <button><i>add</i>Add Item</button>
            <button class="border"><i>delete</i>Delete</button>
            <button class="circle"><i>favorite</i></button>
          </div>
          
          <h5>BeerCSS Sizes & States</h5>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem; padding: 1rem; background: rgba(255,255,255,0.02); border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
            <button disabled>Disabled</button>
            <button class="border small">Small Border</button>
            <button class="large">Large Button</button>
            <button class="round">Round Button</button>
          </div>
        </div>
        
        <div class="s12 m6">
          <h5>BeerCSS Advanced Examples</h5>
          <p>Professional BeerCSS button patterns:</p>
          <button><i>save</i>Save Changes</button>
          
          <div style="margin-top: 1rem;">
            <button class="border" onclick="demo.showAlert('Professional BeerCSS!')">Test Click</button>
          </div>
          
          <h5>BeerCSS Navigation Patterns</h5>
          <button class="transparent circle"><i>notifications</i></button>
          <button class="transparent circle"><i>account_circle</i></button>
          <button class="border round">Learn More</button>
        </div>
      </div>
    `;
  }

  generateInputExamples() {
    return `
      <h3>Professional Input Examples - BeerCSS Native</h3>
      
      <div class="grid">
        <div class="s12 m6">
          <h5>BeerCSS Field Patterns</h5>
          
          <div class="field label border">
            <input type="text" placeholder=" ">
            <label>Full Name</label>
          </div>
          
          <div class="field label border round">
            <input type="email" placeholder=" ">
            <label>Email Address</label>
            <span class="helper">We'll never share your email</span>
          </div>
          
          <div class="field label border">
            <input type="password" placeholder=" ">
            <label>Password</label>
            <span class="helper">Min 8 characters required</span>
          </div>
        </div>
        
        <div class="s12 m6">
          <h5>BeerCSS Advanced Fields</h5>
          
          <div class="field label round prefix">
            <i>search</i>
            <input type="text" placeholder=" ">
            <label>Search</label>
          </div>
          
          <div class="field label suffix">
            <input type="tel" placeholder=" ">
            <label>Phone Number</label>
            <i>phone</i>
          </div>
          
          <div class="field label border fill invalid">
            <input type="text" placeholder=" ">
            <label>Required Field</label>
            <span class="error">This field is required</span>
          </div>
        </div>
      </div>
    `;
  }

  generateSelectExamples() {
    return `
      <h3>Professional Select Examples - BeerCSS Native</h3>
      
      <div class="grid">
        <div class="s12 m6">
          <h5>BeerCSS Select Fields</h5>
          
          <div class="field label border">
            <select>
              <option value="">Select a country</option>
              <option value="us">United States</option>
              <option value="ca">Canada</option>
              <option value="mx">Mexico</option>
              <option value="uk">United Kingdom</option>
              <option value="de">Germany</option>
            </select>
            <label>Country</label>
          </div>
          
          <div class="field label border round">
            <select>
              <option value="">Choose your role</option>
              <option value="developer">Developer</option>
              <option value="designer">Designer</option>
              <option value="manager">Manager</option>
              <option value="analyst">Analyst</option>
            </select>
            <label>Job Role</label>
            <span class="helper">Select your primary role</span>
          </div>
        </div>
        
        <div class="s12 m6">
          <h5>BeerCSS Advanced Selects</h5>
          
          <div class="field label prefix">
            <i>business</i>
            <select>
              <option value="">Select department</option>
              <option value="engineering">Engineering</option>
              <option value="design">Design</option>
              <option value="marketing">Marketing</option>
              <option value="sales">Sales</option>
              <option value="hr">Human Resources</option>
            </select>
            <label>Department</label>
          </div>
          
          <div class="field label border fill invalid">
            <select>
              <option value="">Select priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
            <label>Priority Level</label>
            <span class="error">Please select a priority level</span>
          </div>
        </div>
      </div>
    `;
  }

  generateCardExamples() {
    return `
      <h3>Card Component Examples</h3>
      
      <div class="grid">
        <div class="s12 m6 l4">
          <ui-card>
            <ui-card-header title="Simple Card" subtitle="Basic card example"></ui-card-header>
            <ui-card-content>
              This is the card content area. You can put any content here including text, images, or other components.
            </ui-card-content>
            <ui-card-actions>
              <ui-button variant="text">Action 1</ui-button>
              <ui-button variant="text">Action 2</ui-button>
            </ui-card-actions>
          </ui-card>
        </div>
        
        <div class="s12 m6 l4">
          <ui-card variant="outlined" clickable>
            <ui-card-header 
              title="Clickable Card" 
              subtitle="Click anywhere on this card"
              avatar="https://via.placeholder.com/40"
            ></ui-card-header>
            <ui-card-content>
              This card is clickable and has an outlined variant with an avatar image.
            </ui-card-content>
          </ui-card>
        </div>
        
        <div class="s12 m6 l4">
          <ui-card>
            <ui-card-media 
              src="https://via.placeholder.com/400x200" 
              alt="Placeholder image"
              aspect-ratio="2/1"
            ></ui-card-media>
            <ui-card-header title="Media Card" subtitle="With image"></ui-card-header>
            <ui-card-content>
              This card includes a media component with an image.
            </ui-card-content>
            <ui-card-actions align="right">
              <ui-button variant="text">Learn More</ui-button>
            </ui-card-actions>
          </ui-card>
        </div>
      </div>
    `;
  }

  generateTabsExamples() {
    return `
      <h3>Tabs Component Examples</h3>
      
      <h5>Basic Tabs</h5>
      <ui-tabs active="0" style="margin-bottom: 2rem;">
        <ui-tab label="Tab 1">
          <h6>First Tab Content</h6>
          <p>This is the content for the first tab. You can put any HTML content here.</p>
        </ui-tab>
        <ui-tab label="Tab 2">
          <h6>Second Tab Content</h6>
          <p>This is the content for the second tab. Each tab can have different content.</p>
        </ui-tab>
        <ui-tab label="Tab 3">
          <h6>Third Tab Content</h6>
          <p>This is the content for the third tab. Tabs are great for organizing content.</p>
        </ui-tab>
        <ui-tab label="Disabled" disabled>
          <p>This tab is disabled.</p>
        </ui-tab>
      </ui-tabs>
      
      <h5>Tabs with Components</h5>
      <ui-tabs active="0">
        <ui-tab label="Form">
          <ui-input label="Name" style="margin-bottom: 1rem;"></ui-input>
          <ui-input label="Email" type="email" style="margin-bottom: 1rem;"></ui-input>
          <ui-button variant="filled">Submit</ui-button>
        </ui-tab>
        <ui-tab label="Settings">
          <ui-select label="Theme" style="margin-bottom: 1rem;">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </ui-select>
          <ui-button variant="filled">Save Settings</ui-button>
        </ui-tab>
      </ui-tabs>
    `;
  }

  generateAccordionExamples() {
    return `
      <h3>Accordion Component Examples</h3>
      
      <h5>Basic Accordion</h5>
      <ui-accordion style="margin-bottom: 2rem;">
        <ui-accordion-item title="What is BeerCSS?" open>
          BeerCSS is a Material Design 3 CSS framework that helps you build beautiful interfaces quickly and easily.
        </ui-accordion-item>
        <ui-accordion-item title="How do I use these components?">
          Simply include the component library script and use the custom elements in your HTML. Each component supports various attributes for customization.
        </ui-accordion-item>
        <ui-accordion-item title="Are there any dependencies?">
          No! This is a zero-dependency component library. You only need BeerCSS for styling.
        </ui-accordion-item>
        <ui-accordion-item title="Disabled Item" disabled>
          This item is disabled and cannot be opened.
        </ui-accordion-item>
      </ui-accordion>
      
      <h5>Multiple Open Items</h5>
      <ui-accordion multiple>
        <ui-accordion-item title="First Item" open>
          This accordion allows multiple items to be open at the same time.
        </ui-accordion-item>
        <ui-accordion-item title="Second Item" open>
          Both of these items can be open simultaneously because the accordion has the 'multiple' attribute.
        </ui-accordion-item>
        <ui-accordion-item title="Third Item">
          You can open and close items independently.
        </ui-accordion-item>
      </ui-accordion>
    `;
  }

  generateGridExamples() {
    return `
      <h3>Grid Component Examples</h3>
      
      <h5>Responsive Grid</h5>
      <ui-grid style="margin-bottom: 2rem;">
        <ui-grid-item cols="s12 m6 l3">
          <div style="background: #e3f2fd; padding: 1rem; text-align: center;">
            s12 m6 l3
          </div>
        </ui-grid-item>
        <ui-grid-item cols="s12 m6 l3">
          <div style="background: #f3e5f5; padding: 1rem; text-align: center;">
            s12 m6 l3
          </div>
        </ui-grid-item>
        <ui-grid-item cols="s12 m6 l3">
          <div style="background: #e8f5e8; padding: 1rem; text-align: center;">
            s12 m6 l3
          </div>
        </ui-grid-item>
        <ui-grid-item cols="s12 m6 l3">
          <div style="background: #fff3e0; padding: 1rem; text-align: center;">
            s12 m6 l3
          </div>
        </ui-grid-item>
      </ui-grid>
      
      <h5>Grid with Gap</h5>
      <ui-grid gap="1rem" style="margin-bottom: 2rem;">
        <ui-grid-item cols="s12 m4">
          <div style="background: #ffebee; padding: 1rem; text-align: center;">
            s12 m4
          </div>
        </ui-grid-item>
        <ui-grid-item cols="s12 m8">
          <div style="background: #e1f5fe; padding: 1rem; text-align: center;">
            s12 m8
          </div>
        </ui-grid-item>
      </ui-grid>
      
      <h5>Nested Grid</h5>
      <ui-grid>
        <ui-grid-item cols="s12 m8">
          <div style="background: #f9fbe7; padding: 1rem;">
            <h6>Main Content</h6>
            <ui-grid gap="0.5rem">
              <ui-grid-item cols="s6">
                <div style="background: #fff; padding: 0.5rem; text-align: center;">
                  Nested 1
                </div>
              </ui-grid-item>
              <ui-grid-item cols="s6">
                <div style="background: #fff; padding: 0.5rem; text-align: center;">
                  Nested 2
                </div>
              </ui-grid-item>
            </ui-grid>
          </div>
        </ui-grid-item>
        <ui-grid-item cols="s12 m4">
          <div style="background: #fce4ec; padding: 1rem; text-align: center;">
            Sidebar
          </div>
        </ui-grid-item>
      </ui-grid>
    `;
  }

  generateLayoutExamples() {
    return `
      <h3>Professional Layout Examples - BeerCSS Native</h3>
      
      <div class="grid">
        <div class="s12">
          <h5>BeerCSS Grid System</h5>
          <div class="grid">
            <div class="s12 m6 l3">
              <article class="padding round border">
                <h6>Responsive Column</h6>
                <p>s12 m6 l3 - Adapts to screen size</p>
              </article>
            </div>
            <div class="s12 m6 l3">
              <article class="padding round border">
                <h6>Equal Width</h6>
                <p>Consistent spacing and alignment</p>
              </article>
            </div>
            <div class="s12 m6 l3">
              <article class="padding round border">
                <h6>Professional</h6>
                <p>Clean Material Design styling</p>
              </article>
            </div>
            <div class="s12 m6 l3">
              <article class="padding round border">
                <h6>BeerCSS Grid</h6>
                <p>Native responsive behavior</p>
              </article>
            </div>
          </div>
        </div>
        
        <div class="s12">
          <h5>BeerCSS Navigation Layout</h5>
          <nav class="padding round border">
            <button class="transparent"><i>home</i>Home</button>
            <button class="transparent"><i>search</i>Search</button>
            <button class="transparent"><i>settings</i>Settings</button>
            <button class="transparent"><i>account_circle</i>Profile</button>
          </nav>
        </div>
        
        <div class="s12">
          <h5>BeerCSS Card Layout</h5>
          <div class="grid">
            <div class="s12 m4">
              <article class="padding round border">
                <h6>Card Title</h6>
                <p>Professional card layout with proper spacing and typography.</p>
                <nav class="right-align">
                  <button class="border small">Action</button>
                </nav>
              </article>
            </div>
            <div class="s12 m4">
              <article class="padding round border">
                <h6>Another Card</h6>
                <p>Consistent spacing and styling across all cards.</p>
                <nav class="right-align">
                  <button class="border small">Action</button>
                </nav>
              </article>
            </div>
            <div class="s12 m4">
              <article class="padding round border">
                <h6>Third Card</h6>
                <p>Responsive grid system adapts to screen size.</p>
                <nav class="right-align">
                  <button class="border small">Action</button>
                </nav>
              </article>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  generateSmartTableExamples() {
    return `
      <h3>Smart Table Component Examples</h3>
      
      <h5>State-Driven Table (Phase 3 Preview)</h5>
      <p>This table is driven by centralized state with sorting, searching, and pagination:</p>
      
      <ui-smart-table 
        field-id="userTable"
        rows-per-page="5"
        searchable="true"
        sortable="true"
        selectable="true"
        style="margin-bottom: 2rem;">
      </ui-smart-table>
      
      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        <ui-button onclick="demo.addUser()" variant="filled" icon="add">Add User</ui-button>
        <ui-button onclick="demo.toggleTableLoading()" variant="outlined" icon="refresh">Toggle Loading</ui-button>
        <ui-button onclick="demo.exportTableData()" variant="outlined" icon="download">Export CSV</ui-button>
      </div>
      
      <h5>Features</h5>
      <ul>
        <li><strong>Metadata-driven:</strong> Columns defined in state with type information</li>
        <li><strong>Sorting:</strong> Click column headers to sort</li>
        <li><strong>Search:</strong> Global search across all columns</li>
        <li><strong>Pagination:</strong> Configurable rows per page</li>
        <li><strong>Selection:</strong> Row selection with select all</li>
        <li><strong>Formatting:</strong> Automatic formatting based on column type (currency, date, boolean)</li>
        <li><strong>Export:</strong> Export filtered data to JSON or CSV</li>
      </ul>
    `;
  }

  bindComponentEvents(componentId) {
    // Bind component-specific event handlers
    if (componentId === 'smart-table') {
      // Initialize smart table with state data
      const table = document.querySelector('ui-smart-table[field-id="userTable"]');
      if (table) {
        table.syncFromState();
      }
    }
  }

  // Demo utility methods
  showAlert(message) {
    alert(message);
  }

  toggleButtonState() {
    // This would be part of Phase 3 state management
    console.log('Button state toggled - Phase 3 feature');
  }

  addUser() {
    const newUser = {
      id: Date.now(),
      name: `User ${Math.floor(Math.random() * 1000)}`,
      email: `user${Math.floor(Math.random() * 1000)}@example.com`,
      age: Math.floor(Math.random() * 30) + 25,
      salary: Math.floor(Math.random() * 50000) + 40000,
      active: Math.random() > 0.3,
      department: ['Engineering', 'Design', 'Marketing', 'Sales'][Math.floor(Math.random() * 4)],
      joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    
    window.AppState.fields.userTable.data.push(newUser);
    const table = document.querySelector('ui-smart-table[field-id="userTable"]');
    if (table) {
      table.syncFromState();
    }
  }

  toggleTableLoading() {
    const currentLoading = window.AppState.fields.userTable.loading || false;
    window.AppState.fields.userTable.loading = !currentLoading;
    
    const table = document.querySelector('ui-smart-table[field-id="userTable"]');
    if (table) {
      table.setAttribute('loading', !currentLoading);
      
      // Auto-hide loading after 2 seconds
      if (!currentLoading) {
        setTimeout(() => {
          window.AppState.fields.userTable.loading = false;
          table.removeAttribute('loading');
        }, 2000);
      }
    }
  }

  exportTableData() {
    const table = document.querySelector('ui-smart-table[field-id="userTable"]');
    if (table) {
      const csvData = table.exportData('csv');
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'users.csv';
      a.click();
      URL.revokeObjectURL(url);
    }
  }
}

// Initialize demo app
const demo = new DemoApp();
window.demo = demo; // Make available globally for button clicks