// BeerCSS UI Components Library
// Zero dependency UI component library built on BeerCSS

// Import all components
import './components/base/ui-component.js';
import './components/layout/ui-grid.js';
import './components/layout/ui-layout.js';
import './components/ui-button.js';
import './components/ui-input.js';
import './components/ui-select.js';
import './components/ui-tabs.js';
import './components/ui-accordion.js';
import './components/ui-card.js';
import './components/ui-smart-table.js';

// Export components for ES module usage
export { UIComponent } from './components/base/ui-component.js';
export { UIGrid, UIGridItem } from './components/layout/ui-grid.js';
export { UILayout, UIFlexbox, UIFlex, UIFlexItem } from './components/layout/ui-layout.js';
export { UIButton } from './components/ui-button.js';
export { UIInput } from './components/ui-input.js';
export { UISelect } from './components/ui-select.js';
export { UITabs, UITab } from './components/ui-tabs.js';
export { UIAccordion, UIAccordionItem } from './components/ui-accordion.js';
export { UICard, UICardHeader, UICardContent, UICardActions, UICardMedia } from './components/ui-card.js';
export { UISmartTable } from './components/ui-smart-table.js';

// Add component styles
const componentStyles = `
/* BeerCSS UI Components Styles */

/* Global component styles */
ui-input, ui-select {
  display: block;
  margin-bottom: 1rem;
}

.field {
  position: relative;
  display: flex;
  flex-direction: column;
}

.field input, .field select {
  padding: 1rem;
  border: 1px solid var(--outline, #79747e);
  border-radius: 4px;
  background: var(--surface, #fef7ff);
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s ease;
}

.field input:focus, .field select:focus {
  border-color: var(--primary, #6750a4);
  border-width: 2px;
}

.field label {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: var(--surface, #fef7ff);
  padding: 0 0.25rem;
  color: var(--on-surface-variant, #49454f);
  transition: all 0.2s ease;
  pointer-events: none;
  font-size: 1rem;
}

.field input:focus + label,
.field input:not(:placeholder-shown) + label,
.field select:focus + label,
.field select:not([value=""]) + label {
  top: 0;
  font-size: 0.75rem;
  color: var(--primary, #6750a4);
}

.field.focused label {
  color: var(--primary, #6750a4);
}

.field.invalid input,
.field.invalid select {
  border-color: var(--error, #ba1a1a);
}

.field.invalid label {
  color: var(--error, #ba1a1a);
}

.helper {
  font-size: 0.75rem;
  margin-top: 0.25rem;
  color: var(--on-surface-variant, #49454f);
}

.helper.error {
  color: var(--error, #ba1a1a);
}

/* Button styles enhancement */
ui-button {
  display: inline-block;
  margin: 0.25rem;
}

ui-button button {
  font-family: inherit;
  cursor: pointer;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 2.5rem;
  background: var(--primary, #bb86fc);
  color: var(--on-primary, #000000);
  text-transform: none;
  letter-spacing: 0.1px;
}

ui-button button.filled {
  background: var(--primary, #bb86fc);
  color: var(--on-primary, #000000);
}

ui-button button.outlined {
  background: transparent;
  border: 1px solid var(--outline, rgba(255, 255, 255, 0.3));
  color: var(--primary, #bb86fc);
}

ui-button button.text {
  background: transparent;
  color: var(--primary, #bb86fc);
  padding: 0.75rem 1rem;
}

ui-button button.tonal {
  background: var(--secondary-container, rgba(187, 134, 252, 0.2));
  color: var(--on-secondary-container, #bb86fc);
}

ui-button button:hover:not(:disabled) {
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  transform: translateY(-1px);
}

ui-button button:active {
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
}

ui-button button:disabled {
  opacity: 0.38;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

ui-button button.circle {
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  padding: 0;
  justify-content: center;
}

ui-button button.small {
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  min-height: 2rem;
}

ui-button button.large {
  padding: 1rem 2rem;
  font-size: 1rem;
  min-height: 3rem;
}

/* Smart Table Styles */
ui-smart-table {
  display: block;
  position: relative;
}

.table-search {
  margin-bottom: 1rem;
}

.table-search input {
  width: 100%;
  max-width: 300px;
  padding: 0.5rem;
  border: 1px solid var(--outline, #ccc);
  border-radius: 4px;
}

.table-container {
  overflow-x: auto;
  border: 1px solid var(--outline, #ccc);
  border-radius: 8px;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid var(--outline-variant, #e0e0e0);
}

.table th {
  background-color: var(--surface-variant, #f5f5f5);
  font-weight: 500;
}

.table th.sortable {
  cursor: pointer;
  user-select: none;
}

.table th.sortable:hover {
  background-color: var(--surface-container-high, #e8e8e8);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sort-icon {
  font-size: 1rem;
  margin-left: 0.25rem;
}

.table tr:hover {
  background-color: var(--surface-container, #f8f8f8);
}

.table tr.selected {
  background-color: var(--secondary-container, #e3f2fd);
}

.empty-row td {
  text-align: center;
  padding: 2rem;
  color: var(--on-surface-variant, #666);
}

.table-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-top: 1px solid var(--outline-variant, #e0e0e0);
  flex-wrap: wrap;
  gap: 1rem;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.pagination-btn {
  padding: 0.5rem;
  border: 1px solid var(--outline, #ccc);
  background: var(--surface, white);
  border-radius: 4px;
  cursor: pointer;
  min-width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-btn:hover:not(:disabled) {
  background-color: var(--surface-container, #f8f8f8);
}

.pagination-btn.active {
  background-color: var(--primary, #1976d2);
  color: var(--on-primary, white);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.rows-per-page select {
  padding: 0.25rem;
  border: 1px solid var(--outline, #ccc);
  border-radius: 4px;
  background: var(--surface, white);
}

.table-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.loading-spinner {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--surface, white);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.loading-spinner i {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.text-success {
  color: var(--success, #4caf50);
}

.text-error {
  color: var(--error, #f44336);
}

/* Accordion Styles */
.accordion-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: var(--surface-variant, #f5f5f5);
  cursor: pointer;
  border-bottom: 1px solid var(--outline-variant, #e0e0e0);
}

.accordion-header:hover {
  background: var(--surface-container, #f0f0f0);
}

.accordion-header.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.accordion-content {
  padding: 1rem;
}

.accordion-icon {
  transition: transform 0.2s ease;
}

ui-accordion-item.open .accordion-icon {
  transform: rotate(180deg);
}

/* Tab Styles */
.tabs {
  display: flex;
  border-bottom: 1px solid var(--outline-variant, #e0e0e0);
  background: var(--surface, #fef7ff);
}

.tabs button {
  padding: 1rem 1.5rem;
  border: none;
  background: none;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 500;
}

.tabs button:hover {
  background: var(--surface-container, #f8f8f8);
}

.tabs button.active {
  border-bottom-color: var(--primary, #6750a4);
  color: var(--primary, #6750a4);
}

.tabs button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tab-content {
  padding: 1rem;
}

.tab-panel {
  display: none;
}

/* Card Styles */
.card {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  background: var(--surface, white);
  overflow: hidden;
}

.card.outlined {
  border: 1px solid var(--outline, #ccc);
  box-shadow: none;
}

.card.clickable {
  cursor: pointer;
  transition: box-shadow 0.2s ease;
}

.card.clickable:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.card-header {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--outline-variant, #e0e0e0);
}

.header-content {
  flex: 1;
  margin-left: 1rem;
}

.card-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 500;
}

.card-subtitle {
  margin: 0.25rem 0 0 0;
  color: var(--on-surface-variant, #666);
  font-size: 0.875rem;
}

.card-content {
  padding: 1rem;
}

.card-actions {
  padding: 0.5rem 1rem 1rem 1rem;
  display: flex;
  gap: 0.5rem;
}

.card-actions.right-align {
  justify-content: flex-end;
}

.card-actions.center-align {
  justify-content: center;
}

.card-media img {
  width: 100%;
  height: auto;
  display: block;
}

/* Grid system fixes */
ui-grid {
  display: grid !important;
  grid-template-columns: repeat(12, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

ui-grid-item {
  display: block;
}

ui-grid-item.s1 { grid-column: span 1; }
ui-grid-item.s2 { grid-column: span 2; }
ui-grid-item.s3 { grid-column: span 3; }
ui-grid-item.s4 { grid-column: span 4; }
ui-grid-item.s5 { grid-column: span 5; }
ui-grid-item.s6 { grid-column: span 6; }
ui-grid-item.s7 { grid-column: span 7; }
ui-grid-item.s8 { grid-column: span 8; }
ui-grid-item.s9 { grid-column: span 9; }
ui-grid-item.s10 { grid-column: span 10; }
ui-grid-item.s11 { grid-column: span 11; }
ui-grid-item.s12 { grid-column: span 12; }

@media (min-width: 600px) {
  ui-grid-item.m1 { grid-column: span 1; }
  ui-grid-item.m2 { grid-column: span 2; }
  ui-grid-item.m3 { grid-column: span 3; }
  ui-grid-item.m4 { grid-column: span 4; }
  ui-grid-item.m5 { grid-column: span 5; }
  ui-grid-item.m6 { grid-column: span 6; }
  ui-grid-item.m7 { grid-column: span 7; }
  ui-grid-item.m8 { grid-column: span 8; }
  ui-grid-item.m9 { grid-column: span 9; }
  ui-grid-item.m10 { grid-column: span 10; }
  ui-grid-item.m11 { grid-column: span 11; }
  ui-grid-item.m12 { grid-column: span 12; }
}

@media (min-width: 1024px) {
  ui-grid-item.l1 { grid-column: span 1; }
  ui-grid-item.l2 { grid-column: span 2; }
  ui-grid-item.l3 { grid-column: span 3; }
  ui-grid-item.l4 { grid-column: span 4; }
  ui-grid-item.l5 { grid-column: span 5; }
  ui-grid-item.l6 { grid-column: span 6; }
  ui-grid-item.l7 { grid-column: span 7; }
  ui-grid-item.l8 { grid-column: span 8; }
  ui-grid-item.l9 { grid-column: span 9; }
  ui-grid-item.l10 { grid-column: span 10; }
  ui-grid-item.l11 { grid-column: span 11; }
  ui-grid-item.l12 { grid-column: span 12; }
}
`;

// Inject component styles if not already present
function injectStyles() {
  if (!document.getElementById('beercss-ui-components-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'beercss-ui-components-styles';
    styleSheet.textContent = componentStyles;
    document.head.appendChild(styleSheet);
    console.log('BeerCSS UI Components styles injected');
  }
}

// Inject styles immediately and also when DOM is ready
injectStyles();
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectStyles);
}

// Version info
export const version = '1.0.0';

console.log('BeerCSS UI Components v1.0.0 loaded successfully! 🍺💛');