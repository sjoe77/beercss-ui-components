import { UIComponent } from './base/ui-component.js';

/**
 * Smart Table Component
 * Advanced, metadata-driven table with pagination, search, sorting, and formatting
 * 
 * Usage:
 * <ui-smart-table 
 *   field-id="userTable"
 *   rows-per-page="10"
 *   searchable="true"
 *   columns='[
 *     {"key": "name", "type": "text", "label": "Name", "sortable": true},
 *     {"key": "age", "type": "number", "label": "Age", "sortable": true},
 *     {"key": "salary", "type": "currency", "label": "Salary", "currency": "USD"},
 *     {"key": "active", "type": "boolean", "label": "Active"}
 *   ]'>
 * </ui-smart-table>
 */
export class UISmartTable extends UIComponent {
  static get observedAttributes() {
    return [
      'field-id', 'columns', 'data-source', 'rows-per-page', 'current-page', 
      'searchable', 'sortable', 'selectable', 'loading'
    ];
  }

  init() {
    this.data = [];
    this.filteredData = [];
    this.currentSort = { column: null, direction: 'asc' };
    this.selectedRows = new Set();
    this.fieldId = this.getAttribute('field-id');
    
    this.createStructure();
    this.bindToState();
    this.updateTable();
  }

  bindToState() {
    if (!this.fieldId || !window.AppState) return;
    
    const fieldState = window.AppState.fields?.[this.fieldId];
    if (fieldState) {
      if (fieldState.data) this.setData(fieldState.data);
      if (fieldState.columns) this.setAttribute('columns', JSON.stringify(fieldState.columns));
      if (fieldState.rowsPerPage) this.setAttribute('rows-per-page', fieldState.rowsPerPage);
      if (fieldState.searchable !== undefined) this.setAttribute('searchable', fieldState.searchable);
      if (fieldState.loading !== undefined) this.setAttribute('loading', fieldState.loading);
    }
  }

  syncFromState() {
    this.bindToState();
    this.updateTable();
  }

  updateComponent() {
    this.updateTable();
  }

  createStructure() {
    this.innerHTML = '';
    
    // Search container
    if (this.getBooleanAttribute('searchable')) {
      this.searchContainer = this.createElement('div', 'table-search');
      this.searchInput = this.createElement('input', '', {
        type: 'text',
        placeholder: 'Search...',
        'aria-label': 'Search table'
      });
      this.searchContainer.appendChild(this.searchInput);
      this.appendChild(this.searchContainer);
    }
    
    // Table container
    this.tableContainer = this.createElement('div', 'table-container');
    this.table = this.createElement('table', 'table');
    this.thead = this.createElement('thead');
    this.tbody = this.createElement('tbody');
    
    this.table.appendChild(this.thead);
    this.table.appendChild(this.tbody);
    this.tableContainer.appendChild(this.table);
    this.appendChild(this.tableContainer);
    
    // Pagination container
    this.paginationContainer = this.createElement('div', 'table-pagination');
    this.appendChild(this.paginationContainer);
    
    // Loading overlay
    this.loadingOverlay = this.createElement('div', 'table-loading');
    this.loadingOverlay.innerHTML = '<div class="loading-spinner"><i class="material-icons">refresh</i> Loading...</div>';
    this.appendChild(this.loadingOverlay);
  }

  bindEvents() {
    // Search functionality
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.handleSearch(e.target.value);
      });
    }
    
    // Header click for sorting
    this.thead.addEventListener('click', (e) => {
      const th = e.target.closest('th');
      if (th && th.dataset.sortable === 'true') {
        this.handleSort(th.dataset.column);
      }
    });
    
    // Row selection
    if (this.getBooleanAttribute('selectable')) {
      this.tbody.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox' && e.target.classList.contains('row-select')) {
          this.handleRowSelection(e.target);
        }
      });
      
      // Select all checkbox
      this.thead.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox' && e.target.classList.contains('select-all')) {
          this.handleSelectAll(e.target.checked);
        }
      });
    }
  }

  updateTable() {
    if (this.getBooleanAttribute('loading')) {
      this.loadingOverlay.style.display = 'flex';
      return;
    } else {
      this.loadingOverlay.style.display = 'none';
    }
    
    this.renderHeader();
    this.renderBody();
    this.renderPagination();
  }

  renderHeader() {
    const columns = this.getJSONAttribute('columns', []);
    const selectable = this.getBooleanAttribute('selectable');
    
    let headerHTML = '<tr>';
    
    // Select all checkbox
    if (selectable) {
      headerHTML += `
        <th>
          <input type="checkbox" class="select-all" aria-label="Select all rows">
        </th>
      `;
    }
    
    // Column headers
    columns.forEach(column => {
      const sortable = column.sortable !== false && this.getBooleanAttribute('sortable');
      const isSorted = this.currentSort.column === column.key;
      const sortIcon = isSorted ? 
        (this.currentSort.direction === 'asc' ? 'arrow_upward' : 'arrow_downward') : 
        'unfold_more';
      
      headerHTML += `
        <th 
          data-column="${column.key}" 
          data-sortable="${sortable}"
          class="${sortable ? 'sortable' : ''} ${isSorted ? 'sorted' : ''}"
          role="${sortable ? 'button' : ''}"
          tabindex="${sortable ? '0' : ''}"
        >
          <span class="header-content">
            ${column.label || column.key}
            ${sortable ? `<i class="material-icons sort-icon">${sortIcon}</i>` : ''}
          </span>
        </th>
      `;
    });
    
    headerHTML += '</tr>';
    this.thead.innerHTML = headerHTML;
  }

  renderBody() {
    const columns = this.getJSONAttribute('columns', []);
    const selectable = this.getBooleanAttribute('selectable');
    const paginatedData = this.getPaginatedData();
    
    if (paginatedData.length === 0) {
      this.tbody.innerHTML = `
        <tr class="empty-row">
          <td colspan="${columns.length + (selectable ? 1 : 0)}" class="center-align">
            No data available
          </td>
        </tr>
      `;
      return;
    }
    
    let bodyHTML = '';
    
    paginatedData.forEach((row, index) => {
      const rowId = row.id || index;
      const isSelected = this.selectedRows.has(rowId);
      
      bodyHTML += `<tr data-row-id="${rowId}" class="${isSelected ? 'selected' : ''}">`;
      
      // Selection checkbox
      if (selectable) {
        bodyHTML += `
          <td>
            <input 
              type="checkbox" 
              class="row-select" 
              data-row-id="${rowId}"
              ${isSelected ? 'checked' : ''}
              aria-label="Select row"
            >
          </td>
        `;
      }
      
      // Data cells
      columns.forEach(column => {
        const value = this.getNestedValue(row, column.key);
        const formattedValue = this.formatValue(value, column);
        
        bodyHTML += `
          <td data-column="${column.key}" class="${column.type || 'text'}">
            ${formattedValue}
          </td>
        `;
      });
      
      bodyHTML += '</tr>';
    });
    
    this.tbody.innerHTML = bodyHTML;
  }

  renderPagination() {
    const rowsPerPage = parseInt(this.getAttribute('rows-per-page')) || 10;
    const currentPage = parseInt(this.getAttribute('current-page')) || 1;
    const totalRows = this.filteredData.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    
    if (totalPages <= 1) {
      this.paginationContainer.innerHTML = '';
      return;
    }
    
    const startRow = (currentPage - 1) * rowsPerPage + 1;
    const endRow = Math.min(currentPage * rowsPerPage, totalRows);
    
    let paginationHTML = `
      <div class="pagination-info">
        Showing ${startRow}-${endRow} of ${totalRows} rows
      </div>
      <div class="pagination-controls">
        <button 
          class="pagination-btn" 
          ${currentPage === 1 ? 'disabled' : ''}
          onclick="this.closest('ui-smart-table').previousPage()"
        >
          <i class="material-icons">chevron_left</i>
        </button>
    `;
    
    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let page = startPage; page <= endPage; page++) {
      paginationHTML += `
        <button 
          class="pagination-btn ${page === currentPage ? 'active' : ''}"
          onclick="this.closest('ui-smart-table').goToPage(${page})"
        >
          ${page}
        </button>
      `;
    }
    
    paginationHTML += `
        <button 
          class="pagination-btn" 
          ${currentPage === totalPages ? 'disabled' : ''}
          onclick="this.closest('ui-smart-table').nextPage()"
        >
          <i class="material-icons">chevron_right</i>
        </button>
      </div>
      <div class="rows-per-page">
        <label>
          Rows per page:
          <select onchange="this.closest('ui-smart-table').setRowsPerPage(this.value)">
            <option value="5" ${rowsPerPage === 5 ? 'selected' : ''}>5</option>
            <option value="10" ${rowsPerPage === 10 ? 'selected' : ''}>10</option>
            <option value="25" ${rowsPerPage === 25 ? 'selected' : ''}>25</option>
            <option value="50" ${rowsPerPage === 50 ? 'selected' : ''}>50</option>
          </select>
        </label>
      </div>
    `;
    
    this.paginationContainer.innerHTML = paginationHTML;
  }

  // Data management methods
  setData(data) {
    this.data = Array.isArray(data) ? data : [];
    this.filteredData = [...this.data];
    this.selectedRows.clear();
    this.setAttribute('current-page', '1');
    this.updateTable();
    this.emit('data-changed', { data: this.data });
  }

  getData() {
    return this.data;
  }

  getFilteredData() {
    return this.filteredData;
  }

  getPaginatedData() {
    const rowsPerPage = parseInt(this.getAttribute('rows-per-page')) || 10;
    const currentPage = parseInt(this.getAttribute('current-page')) || 1;
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    
    return this.filteredData.slice(startIndex, endIndex);
  }

  // Search functionality
  handleSearch(query) {
    const columns = this.getJSONAttribute('columns', []);
    
    if (!query.trim()) {
      this.filteredData = [...this.data];
    } else {
      this.filteredData = this.data.filter(row => {
        return columns.some(column => {
          const value = this.getNestedValue(row, column.key);
          const searchableValue = this.formatValue(value, column, true);
          return searchableValue.toLowerCase().includes(query.toLowerCase());
        });
      });
    }
    
    this.setAttribute('current-page', '1');
    this.updateTable();
    this.emit('search', { query, results: this.filteredData.length });
  }

  // Sort functionality
  handleSort(columnKey) {
    const columns = this.getJSONAttribute('columns', []);
    const column = columns.find(col => col.key === columnKey);
    
    if (!column || column.sortable === false) return;
    
    // Toggle sort direction
    if (this.currentSort.column === columnKey) {
      this.currentSort.direction = this.currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSort.column = columnKey;
      this.currentSort.direction = 'asc';
    }
    
    // Sort data
    this.filteredData.sort((a, b) => {
      const aValue = this.getNestedValue(a, columnKey);
      const bValue = this.getNestedValue(b, columnKey);
      
      let comparison = this.compareValues(aValue, bValue, column.type);
      return this.currentSort.direction === 'desc' ? -comparison : comparison;
    });
    
    this.updateTable();
    this.emit('sort', { 
      column: columnKey, 
      direction: this.currentSort.direction 
    });
  }

  compareValues(a, b, type) {
    // Handle null/undefined values
    if (a == null && b == null) return 0;
    if (a == null) return -1;
    if (b == null) return 1;
    
    switch (type) {
      case 'number':
      case 'currency':
        return Number(a) - Number(b);
      case 'date':
        return new Date(a) - new Date(b);
      case 'boolean':
        return (a === b) ? 0 : a ? 1 : -1;
      default:
        return String(a).localeCompare(String(b));
    }
  }

  // Selection functionality
  handleRowSelection(checkbox) {
    const rowId = checkbox.dataset.rowId;
    
    if (checkbox.checked) {
      this.selectedRows.add(rowId);
    } else {
      this.selectedRows.delete(rowId);
    }
    
    // Update row visual state
    const row = checkbox.closest('tr');
    row.classList.toggle('selected', checkbox.checked);
    
    // Update select all checkbox
    this.updateSelectAllState();
    
    this.emit('selection-change', {
      selectedRows: Array.from(this.selectedRows),
      selectedCount: this.selectedRows.size
    });
  }

  handleSelectAll(checked) {
    const paginatedData = this.getPaginatedData();
    
    paginatedData.forEach(row => {
      const rowId = row.id || row;
      if (checked) {
        this.selectedRows.add(rowId);
      } else {
        this.selectedRows.delete(rowId);
      }
    });
    
    // Update all row checkboxes
    this.tbody.querySelectorAll('.row-select').forEach(checkbox => {
      checkbox.checked = checked;
      checkbox.closest('tr').classList.toggle('selected', checked);
    });
    
    this.emit('selection-change', {
      selectedRows: Array.from(this.selectedRows),
      selectedCount: this.selectedRows.size
    });
  }

  updateSelectAllState() {
    const selectAllCheckbox = this.thead.querySelector('.select-all');
    if (!selectAllCheckbox) return;
    
    const paginatedData = this.getPaginatedData();
    const visibleRowIds = paginatedData.map(row => row.id || row);
    const selectedVisibleRows = visibleRowIds.filter(id => this.selectedRows.has(id));
    
    if (selectedVisibleRows.length === 0) {
      selectAllCheckbox.checked = false;
      selectAllCheckbox.indeterminate = false;
    } else if (selectedVisibleRows.length === visibleRowIds.length) {
      selectAllCheckbox.checked = true;
      selectAllCheckbox.indeterminate = false;
    } else {
      selectAllCheckbox.checked = false;
      selectAllCheckbox.indeterminate = true;
    }
  }

  // Pagination methods
  nextPage() {
    const currentPage = parseInt(this.getAttribute('current-page')) || 1;
    const totalPages = this.getTotalPages();
    if (currentPage < totalPages) {
      this.goToPage(currentPage + 1);
    }
  }

  previousPage() {
    const currentPage = parseInt(this.getAttribute('current-page')) || 1;
    if (currentPage > 1) {
      this.goToPage(currentPage - 1);
    }
  }

  goToPage(page) {
    const totalPages = this.getTotalPages();
    const newPage = Math.max(1, Math.min(page, totalPages));
    this.setAttribute('current-page', newPage);
    this.updateTable();
    this.emit('page-change', { page: newPage });
  }

  setRowsPerPage(rows) {
    this.setAttribute('rows-per-page', rows);
    this.setAttribute('current-page', '1');
    this.updateTable();
  }

  getTotalPages() {
    const rowsPerPage = parseInt(this.getAttribute('rows-per-page')) || 10;
    return Math.ceil(this.filteredData.length / rowsPerPage);
  }

  // Utility methods
  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  formatValue(value, column, forSearch = false) {
    if (value == null) return '';
    
    switch (column.type) {
      case 'currency':
        if (forSearch) return String(value);
        const currency = column.currency || 'USD';
        const locale = column.locale || 'en-US';
        return new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: currency
        }).format(value);
        
      case 'number':
        if (forSearch) return String(value);
        const decimals = column.decimals || 0;
        return Number(value).toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals
        });
        
      case 'date':
        if (forSearch) return String(value);
        const dateFormat = column.format || 'short';
        return new Intl.DateTimeFormat(undefined, { dateStyle: dateFormat }).format(new Date(value));
        
      case 'boolean':
        if (forSearch) return value ? 'true yes' : 'false no';
        return value ? 
          '<i class="material-icons text-success">check</i>' : 
          '<i class="material-icons text-error">close</i>';
        
      default:
        return String(value);
    }
  }

  // Public API methods
  getSelectedRows() {
    return Array.from(this.selectedRows);
  }

  clearSelection() {
    this.selectedRows.clear();
    this.updateTable();
  }

  selectRow(rowId) {
    this.selectedRows.add(rowId);
    this.updateTable();
  }

  deselectRow(rowId) {
    this.selectedRows.delete(rowId);
    this.updateTable();
  }

  exportData(format = 'json') {
    const data = this.getFilteredData();
    const columns = this.getJSONAttribute('columns', []);
    
    switch (format.toLowerCase()) {
      case 'csv':
        return this.exportToCSV(data, columns);
      case 'json':
        return JSON.stringify(data, null, 2);
      default:
        return data;
    }
  }

  exportToCSV(data, columns) {
    const headers = columns.map(col => col.label || col.key).join(',');
    const rows = data.map(row => 
      columns.map(col => {
        const value = this.getNestedValue(row, col.key);
        const formatted = this.formatValue(value, col, true);
        return `"${String(formatted).replace(/"/g, '""')}"`;
      }).join(',')
    );
    
    return [headers, ...rows].join('\n');
  }
}

// Register component
customElements.define('ui-smart-table', UISmartTable);