import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild, OnChanges, SimpleChanges, ContentChild, TemplateRef, Output, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MasterScreen } from '../common-data/master-screen';
import { Subscription } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-curd-layout',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSelectModule,
    MatDialogModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './curd-layout.component.html',
  styleUrl: './curd-layout.component.scss',
})
export class CurdLayoutComponent implements OnInit, OnChanges {
  @Input() masterScreen!: MasterScreen;
  @Input() rowData: any[] = [];
  @Input() form!: FormGroup;
  @Input() totalCount: number = 0;
  
  // Server-side pagination control
  @Input() useServerPagination: boolean = false;
  
  // Function inputs similar to original CurdLayoutComponent
  @Input() query!: Function;
  @Input() new!: Function;
  @Input() save!: Function;
  @Input() update!: Function;
  @Input() delete!: Function;
  @Input() setData!: Function;
  @Input() view!: Function;
  @Input() class!: Object;
  @Input() upload!: Function;
  @Input() download!: Function;
  
  // Form configuration
  @Input() formTitle: string = '';
  @Input() showSaveButton: boolean = true;
  
  // Search and sorting inputs
  @Input() searchInput = '';
  @Input() sortingDir = '';
  @Input() sortingBy = '';
  
  // Outputs for component events
  @Output() saveItem = new EventEmitter<any>();
  @Output() deleteItem = new EventEmitter<any>();
  @Output() dataLoaded = new EventEmitter<any[]>();
  @Output() error = new EventEmitter<any>();
  @Output() pageChange = new EventEmitter<any>();
  @Output() sortChange = new EventEmitter<any>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() statusFilterChange = new EventEmitter<string>();
  
  // Content projection for form templates
  @ContentChild('createFormTemplate') createFormTemplate!: TemplateRef<any>;
  @ContentChild('editFormTemplate') editFormTemplate!: TemplateRef<any>;
  @ContentChild('deleteConfirmTemplate') deleteConfirmTemplate!: TemplateRef<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  selection = new SelectionModel<any>(true, []);
  @Output() selectionChange = new EventEmitter<any[]>();

  Math = Math;
  // Modal control
  currentItem: any = null;
  modalMode: 'new' | 'update' | 'view' | 'delete' = 'new';
  isModalOpen: boolean = false;
  headerText = "Create";
  saveCloseBtn: boolean = true;
  row: any = {};

  // Table data
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>([]);
  
  // Loading state
  isLoading: boolean = false;
  
  // Pagination properties
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 5;
  totalItems: number = 0;
  visiblePageNumbers: number[] = [];
  hasMorePages: boolean = false;
  
  // Search and filter properties
  searchText: string = '';
  searchValue: string = '';
  searchValueText = '';
  searchCD: string = '';
  statusFilter: string = '';
  filteredData: any[] = [];
  selectedStatusLabel: string = 'All Status';
  
  // Sorting properties
  sortBy: string = 'id';
  sortDir: string = 'asc';
  
  // Subscriptions
  private subscriptions: Subscription = new Subscription();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('modalContent') modalContent!: TemplateRef<any>;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    if (!this.masterScreen || !this.masterScreen.columnConfig) {
      throw new Error('Required masterScreen not provided');
    }

    // Initialize columns from config
    this.initializeColumns();

    // Set default values
    this.pageSize = 5;
    this.currentPage = 1;
    this.sortBy = 'id';
    this.sortDir = 'asc';
    this.statusFilter = '';
    
    this.selection = new SelectionModel<any>(true, []);
    // Load initial data
    if (this.query) {
      this.loadData();
    }
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rowData'] && this.rowData) {
      // Store the complete data set for client-side operations
      this.filteredData = [...this.rowData];
      
      // Update counts based on pagination mode
      if (this.useServerPagination) {
        // For server-side, use the provided totalCount
        this.totalItems = this.totalCount;
      } else {
        // For client-side, use the filtered data length
        this.totalItems = this.filteredData.length;
      }
      
      // Calculate pagination
      this.calculateTotalPages();
      this.updateVisiblePageNumbers();
      
      // Update table data
      if (!this.useServerPagination) {
        this.updateTableData();
      } else {
        this.dataSource.data = this.rowData;
      }
    }
  }
  
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

 /**
   * Initialize columns from masterScreen config
   */
 initializeColumns(): void {
  if (this.masterScreen && this.masterScreen.columnConfig) {
    // Add select column if selectable is true
    if (this.masterScreen.permission && this.masterScreen.permission.selectable) {
      this.displayedColumns = ['select', ...this.masterScreen.columnConfig.map(col => col.columnKey)];
    } else {
      this.displayedColumns = this.masterScreen.columnConfig.map(col => col.columnKey);
    }
    
    // Add action column if needed
    if (this.masterScreen.permission && (this.masterScreen.permission.edit || this.masterScreen.permission.delete)) {
      this.displayedColumns.push('actions');
    }
  }
}

  /**
   * Load data based on pagination mode
   */
  loadData(): void {
    this.isLoading = true;
    
    if (this.useServerPagination) {
      // For server-side pagination, pass all parameters
      const params = {
        page: this.currentPage,
        limit: this.pageSize,
        search: this.searchValueText,
        status: this.statusFilter,
        orderBy: this.sortBy,
        orderDir: this.sortDir
      };
      
      console.log("params----",params )
      // Call the query function with params
      this.query(params);
    } else {
      // For client-side pagination, just fetch all data
      this.query(this.class);
    }
  }
  
  /**
   * Apply filter to data
   */
  applyFilter(event: any): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.searchValueText = filterValue;
    this.currentPage = 1;
    
    if (this.useServerPagination) {
      // For server-side filtering, emit event and reload data
      this.searchChange.emit(filterValue);
      this.loadData();
    } else {
      // For client-side filtering, filter data locally
      if (filterValue) {
        this.filteredData = this.rowData.filter(item => {
          return this.displayedColumns.some(column => {
            if (column === 'actions') return false;
            const value = item[column];
            return value !== null && value !== undefined && 
                   value.toString().toLowerCase().includes(filterValue);
          });
        });
      } else {
        this.filteredData = [...this.rowData];
      }
      
      // Update pagination and table data
      this.totalItems = this.filteredData.length;
      this.calculateTotalPages();
      this.updateVisiblePageNumbers();
      this.updateTableData();
    }
  }


  clearSearch(): void {
    this. searchText = '';
    this.searchValueText = '';
    this.emptyList('');
    this.applyFilter({target: {value: ''}});
    this.searchChange.emit('');
    this.loadData();
  }
  
  /**
   * Reset search/filter
   */
  emptyList(valueText: any): void {
    if (valueText === '') {
      this.searchValueText = '';
      this.searchCD = '';
      this.currentPage = 1;
      
      if (this.useServerPagination) {
        this.searchChange.emit('');
        this.loadData();
      } else {
        this.filteredData = [...this.rowData];
        this.totalItems = this.filteredData.length;
        this.calculateTotalPages();
        this.updateVisiblePageNumbers();
        this.updateTableData();
      }
    }
  }

  /**
   * Change sort direction
   */
  changeSortDir(sortBy: string): void {
    // If the same column is clicked, toggle between 'asc' and 'desc'
    if (this.sortBy === sortBy) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      // If a new column is clicked, reset to 'asc'
      this.sortBy = sortBy;
      this.sortDir = 'asc';
    }
    
    if (this.useServerPagination) {
      // For server-side sorting, emit event and reload data
      this.sortChange.emit({sortBy: this.sortBy, sortDir: this.sortDir});
      this.loadData();
    } else {
      // For client-side sorting, sort data locally
      this.sortData();
    }
  }
  
  /**
   * Sort data locally
   */
  sortData(): void {
    if (!this.useServerPagination) {
      this.filteredData.sort((a, b) => {
        const valueA = a[this.sortBy];
        const valueB = b[this.sortBy];
        
        if (valueA === valueB) return 0;
        
        let comparison = 0;
        if (valueA > valueB) {
          comparison = 1;
        } else if (valueA < valueB) {
          comparison = -1;
        }
        
        return this.sortDir === 'asc' ? comparison : -comparison;
      });
      
      this.updateTableData();
    }
  }

  /**
   * handle selectable
   */
 /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.dataSource.data.forEach(row => this.selection.select(row));
    }
    // Emit selection change event
    this.emitSelectionChange();
  }

  /** Toggle selection for a single row */
  toggleRowSelection(row: any) {
    this.selection.toggle(row);
    // Emit selection change event
    this.emitSelectionChange();
  }

  /** Emit the current selection to parent component */
  emitSelectionChange() {
    this.selectionChange.emit(this.selection.selected);
  }

  /**
   * Filter by status
   */
  filterByStatus(status: string): void {
    this.statusFilter = status;
    this.currentPage = 1;


    switch (status) {
      case 'ACTIVE':
        this.selectedStatusLabel = 'Active';
        break;
      case 'INACTIVE':
        this.selectedStatusLabel = 'Inactive';
        break;
      default:
        this.selectedStatusLabel = 'All Status';
        break;
    }
    
    if (this.useServerPagination) {
      // For server-side filtering, emit event and reload data
      this.statusFilterChange.emit(status);
      this.loadData();
    } else {
      // For client-side filtering, filter data locally
      if (status === '') {
        this.filteredData = [...this.rowData];
      } else {
        this.filteredData = this.rowData.filter(item => item.status === status);
      }
      
      // Update pagination and table data
      this.totalItems = this.filteredData.length;
      this.calculateTotalPages();
      this.updateVisiblePageNumbers();
      this.updateTableData();
    }
  }

  /**
   * Handle file upload
   */
  uploadFile(event: any): void {
    const file = event.target.files[0];
    if (file && this.upload) {
      this.upload(file);
    }
  }
  
  /**
   * Clear uploaded file
   */
  uploadClear(): void {
    // Clear the file input
  }

  /**
   * Download file
   */
  downloadFile(): void {
    if (this.download) {
      this.download();
    }
  }

  /**
   * Open modal for new item
   */
  openNew(content: any): void {
    let modalSize = this.masterScreen.size || 'md';
    
    this.dialog.open(content, {
      width: this.getModalWidth(modalSize),
      disableClose: true
    }).afterClosed().subscribe(result => {
      // Handle modal close
    });
    
    this.addNew();
  }

  /**
   * Open modal for viewing item
   */
  openView(content: any, row: any): void {
    let modalSize = this.masterScreen.size || 'md';
    this.saveCloseBtn = false;
    
    this.dialog.open(content, {
      width: this.getModalWidth(modalSize),
      disableClose: true
    }).afterClosed().subscribe(result => {
      // Handle modal close
    });
    
    this.preView(row);
  }

  /**
   * Open modal for updating item
   */
  openUpdate(content: any, row: any): void {
    let modalSize = this.masterScreen.size || 'md';
    this.saveCloseBtn = true;
    
    this.dialog.open(content, {
      width: this.getModalWidth(modalSize),
      disableClose: true
    }).afterClosed().subscribe(result => {
      // Handle modal close
    });
    
    this.preUpdate(row);
  }

  /**
   * Open modal for deleting item
   */
  openDelete(content: any, row: any): void {
    let modalSize = this.masterScreen.size || 'md';
    
    this.dialog.open(content, {
      width: this.getModalWidth(modalSize),
      disableClose: true
    }).afterClosed().subscribe(result => {
      // Handle modal close
    });
    
    this.setDeletedRecord(row);
  }

  /**
   * Get modal width based on size
   */
  getModalWidth(size: string): string {
    switch (size) {
      case 'sm': return '400px';
      case 'lg': return '800px';
      default: return '600px';
    }
  }

  /**
   * Prepare form for new item
   */
  addNew(): void {
    this.form.reset();
    localStorage.removeItem("servicedata");
    
    // Enable all form controls
    for (var key in this.form.getRawValue()) {
      this.form.get(key)?.enable();
    }
    
    this.headerText = "Create";
    this.new(this.form, this);
  }

  /**
   * Prepare form for viewing item
   */
  preView(row: any): void {
    // Disable all form controls for view mode
    for (var key in this.form.getRawValue()) {
      this.form.get(key)?.disable();
    }
    
    this.headerText = "View";
    this.view(row, this.form);
  }

  /**
   * Prepare form for updating item
   */
  preUpdate(row: any): void {
    // Enable all form controls for edit mode
    for (var key in this.form.getRawValue()) {
      this.form.get(key)?.enable();
    }
    
    this.headerText = "Update";
    this.row = row;
    this.setData(row, this.form, this);
  }

  /**
   * Set record for deletion
   */
  setDeletedRecord(row: any): void {
    this.row = row;
    this.headerText = "Delete";
  }

  /**
   * Execute delete operation
   */
  preDelete(): void {
    this.delete(this.row);
    this.dialog.closeAll();
  }

  /**
   * Save form data
   */
  preSave(): void {
    if (this.headerText === "Create") {
      this.save(this.form, this);
    } else if (this.headerText === "Update") {
      this.update(this.row, this.form, this);
    } else {
      this.dialog.closeAll();
    }
  }

  /**
   * Close modal with data
   */
  closeModal(data: any): void {
    this.dialog.closeAll();
    
    if (data && data.code) {
      if (data.code === "0000") {
        this.searchCD = '';
        this.searchValueText = '';
        // Success notification could be added here
        this.loadData();
      } else if (data.code === "1111") {
        // Error notification could be added here
        this.loadData();
      }
    }
  }

  /**
   * Handle page change
   */
  goToPage(page: number): void {
    if (page !== this.currentPage && page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      
      if (this.useServerPagination) {
        // For server-side pagination, emit event and reload data
        this.pageChange.emit({page: this.currentPage, pageSize: this.pageSize});
        this.loadData();
      } else {
        // For client-side pagination, update table data
        this.updateVisiblePageNumbers();
        this.updateTableData();
      }
    }
  }
  
  goToFirstPage(): void {
    this.goToPage(1);
  }
  
  goToLastPage(): void {
    this.goToPage(this.totalPages);
  }
  
  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }
  
  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }
  
  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    if (this.totalPages === 0) {
      this.totalPages = 1;
    }
  }
  
  onPageSizeChange(): void {
    this.calculateTotalPages();
    this.currentPage = 1;
    
    if (this.useServerPagination) {
      // For server-side pagination, emit event and reload data
      this.pageChange.emit({page: this.currentPage, pageSize: this.pageSize});
      this.loadData();
    } else {
      // For client-side pagination, update table data
      this.updateVisiblePageNumbers();
      this.updateTableData();
    }
  }
  
  updateVisiblePageNumbers(): void {
    const totalVisible = 5;
    this.visiblePageNumbers = [];
    
    if (this.totalPages <= totalVisible) {
      // Show all pages if there are few
      for (let i = 1; i <= this.totalPages; i++) {
        this.visiblePageNumbers.push(i);
      }
      this.hasMorePages = false;
    } else {
      // Show some pages with current page in middle if possible
      let start = Math.max(1, this.currentPage - Math.floor(totalVisible / 2));
      let end = Math.min(this.totalPages, start + totalVisible - 1);
      
      // Adjust start if end is at max
      if (end === this.totalPages) {
        start = Math.max(1, end - totalVisible + 1);
      }
      
      for (let i = start; i <= end; i++) {
        this.visiblePageNumbers.push(i);
      }
      
      this.hasMorePages = end < this.totalPages;
    }
  }
  
  // Override when data changes
  updateTableData(): void {
    if (!this.filteredData) return;
    
    // For client-side pagination
    if (!this.useServerPagination) {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = Math.min(startIndex + this.pageSize, this.filteredData.length);
      
      // Get the subset of data for the current page
      const paginatedData = this.filteredData.slice(startIndex, endIndex);
      
      // Update the data source
      this.dataSource.data = paginatedData;
      
      // Sync selection model with current page data
      this.syncSelectionWithCurrentPage();
      
      // Emit the data loaded event
      this.dataLoaded.emit(paginatedData);
    }
  }

  // Sync selection model with current page data to handle pagination
  syncSelectionWithCurrentPage() {
    // This method is needed when paginating to ensure the selection state reflects the current page
    // For more complex implementations, you might need to track selected IDs across pages
  }
  
  /**
   * Refresh data
   */
 // In the CurdLayoutComponent class (curd-layout.component.ts)
onRefresh(): void {
  this.sortBy = 'id';
  this.sortDir = 'asc';
  this.searchValueText = '';
  this.searchInput = '';
  this.searchCD = '';
  this.statusFilter = '';
  this.currentPage = 1;
  this.searchText = '';
  this.selectedStatusLabel = 'All Status'; // Reset the status label

  this.loadData();
  

}
  
  /**
   * Search with text
   */
  serachGivenText(value: any): void {
    let text = value.trim();
    this.searchValueText = text;
    this.currentPage = 1;
    
    if (this.useServerPagination) {
      // For server-side search, emit event and reload data
      this.searchChange.emit(text);
      this.loadData();
    } else {
      // For client-side search, filter data locally
      this.applyFilter({target: {value: text}});
    }
  }
}