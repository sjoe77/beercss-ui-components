# BeerCSS UI Components

A zero-dependency UI component library built on BeerCSS with Material Design 3. Create beautiful, reactive applications with simple HTML syntax using Web Components.

## Features

- ✅ **Zero Dependencies**: Only requires BeerCSS for styling
- 🎨 **Material Design 3**: Built on the latest Material Design principles
- 🚀 **Web Components**: Native custom elements, works with any framework
- 📱 **Responsive**: Mobile-first, responsive design
- 🔧 **Metadata-Driven**: Smart components that understand data types
- 🎯 **State-Driven**: (Phase 3) Centralized state management
- 📝 **TypeScript Ready**: Full TypeScript definitions included

## Quick Start

### CDN Usage
```html
<!DOCTYPE html>
<html>
<head>
  <!-- BeerCSS -->
  <link href="https://cdn.jsdelivr.net/npm/beercss@3.11.33/dist/cdn/beer.min.css" rel="stylesheet" />
  <script type="module" src="https://cdn.jsdelivr.net/npm/beercss@3.11.33/dist/cdn/beer.min.js"></script>
  
  <!-- Material Icons -->
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  
  <!-- BeerCSS UI Components -->
  <script type="module" src="https://unpkg.com/@beercss/ui-components/dist/ui-components.esm.js"></script>
</head>
<body>
  <ui-button variant="filled" icon="add">Add Item</ui-button>
</body>
</html>
```

### NPM Installation
```bash
npm install @beercss/ui-components
```

```javascript
import '@beercss/ui-components';

// Or import specific components
import { UIButton, UIInput, UISmartTable } from '@beercss/ui-components';
```

## Components

### Form Components
- **ui-button**: Material Design buttons with variants, icons, and states
- **ui-input**: Input fields with validation, icons, and helper text
- **ui-select**: Dropdown selects with single/multiple selection

### Layout Components  
- **ui-grid**: Responsive grid system with BeerCSS breakpoints
- **ui-layout**: Layout utilities for positioning and spacing
- **ui-flex**: Flexbox container with alignment and gap controls

### Container Components
- **ui-card**: Material Design cards with header, content, and actions
- **ui-tabs**: Tab navigation with content panels
- **ui-accordion**: Collapsible content sections

### Advanced Components
- **ui-smart-table**: Metadata-driven table with sorting, search, pagination, and export

## Usage Examples

### Basic Button
```html
<ui-button variant="filled" icon="save">Save</ui-button>
<ui-button variant="outlined" disabled>Disabled</ui-button>
<ui-button variant="text" loading>Loading</ui-button>
```

### Form with Validation
```html
<ui-input 
  label="Email" 
  type="email" 
  required 
  helper="Enter a valid email address">
</ui-input>

<ui-select label="Country" required>
  <option value="us">United States</option>
  <option value="ca">Canada</option>
</ui-select>
```

### Responsive Grid
```html
<ui-grid gap="1rem">
  <ui-grid-item cols="s12 m6 l4">Column 1</ui-grid-item>
  <ui-grid-item cols="s12 m6 l4">Column 2</ui-grid-item>
  <ui-grid-item cols="s12 m12 l4">Column 3</ui-grid-item>
</ui-grid>
```

### Smart Table
```html
<ui-smart-table 
  rows-per-page="10"
  searchable="true"
  sortable="true"
  selectable="true"
  columns='[
    {"key": "name", "type": "text", "label": "Name", "sortable": true},
    {"key": "salary", "type": "currency", "label": "Salary", "currency": "USD"},
    {"key": "active", "type": "boolean", "label": "Active"}
  ]'>
</ui-smart-table>

<script>
// Set table data
const table = document.querySelector('ui-smart-table');
table.setData([
  { name: "John Doe", salary: 50000, active: true },
  { name: "Jane Smith", salary: 60000, active: false }
]);
</script>
```

### Card with Media
```html
<ui-card>
  <ui-card-media src="image.jpg" aspect-ratio="16/9"></ui-card-media>
  <ui-card-header title="Card Title" subtitle="Card subtitle"></ui-card-header>
  <ui-card-content>
    Card content goes here...
  </ui-card-content>
  <ui-card-actions>
    <ui-button variant="text">Action</ui-button>
  </ui-card-actions>
</ui-card>
```

## State-Driven Architecture (Phase 3 Preview)

Components can be driven by centralized state using field identifiers:

```html
<ui-input field-id="user.email" label="Email"></ui-input>
<ui-smart-table field-id="userTable"></ui-smart-table>
```

```javascript
// Centralized state
window.AppState = {
  fields: {
    'user.email': {
      value: 'john@example.com',
      disabled: false,
      required: true,
      error: null
    },
    'userTable': {
      data: users,
      columns: columns,
      rowsPerPage: 10,
      searchable: true
    }
  }
};

// Update state to trigger UI changes
function updateField(fieldId, updates) {
  Object.assign(AppState.fields[fieldId], updates);
  const component = document.querySelector(`[field-id="${fieldId}"]`);
  component?.syncFromState();
}
```

## Development

### Running the Demo
```bash
git clone https://github.com/beercss/ui-components.git
cd ui-components
npm install
npm run dev
```

### Building the Library
```bash
npm run build:lib
```

### Project Structure
```
src/
├── components/
│   ├── base/ui-component.js       # Base component class
│   ├── layout/                    # Layout components
│   ├── ui-button.js              # Form components
│   ├── ui-input.js
│   ├── ui-select.js
│   ├── ui-card.js                # Container components
│   ├── ui-tabs.js
│   ├── ui-accordion.js
│   └── ui-smart-table.js         # Advanced components
├── demo/                         # Demo application
└── index.js                      # Main entry point
```

## Browser Support

- Chrome 64+
- Firefox 63+
- Safari 13+
- Edge 79+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Roadmap

### Phase 1 ✅
- Core component library
- BeerCSS integration
- Web Components architecture

### Phase 2 ✅  
- Demo application
- Documentation
- Build system

### Phase 3 🚧
- Reactive state management
- Event-driven architecture
- Page-level hooks and routing
- Advanced component features

---

Built with ❤️ and 🍺 by the BeerCSS community.