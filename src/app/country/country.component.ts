import { Component, OnInit } from '@angular/core';
import { MasterScreen } from '../common-data/master-screen';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { Permission } from '../common-data/permission';
import { CurdLayoutComponent } from '../curd-layout/curd-layout.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-country',
  standalone: true,
  imports: [CurdLayoutComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './country.component.html',
  styleUrl: './country.component.scss'
})
export class CountryComponent implements OnInit {
  // Master component configuration
  public masterScreen!: MasterScreen;
  
  // Data properties
  public rowData: any[] = [];
  public totalCount: number = 0;

  // Pagination properties
  currentPage: number = 1;
  pageSize: number = 5;
  
  // Search and filter properties
  searchTerm: string = '';
  statusFilter: string = '';
  
  // Sorting properties
  sortBy: string = 'id';
  sortDir: string = 'asc';
  
  // Flag to determine pagination mode
  useServerPagination: boolean = false;
  
  // Form related
  countryForm!: FormGroup;
  statuses = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' }
  ];

  constructor(private fb: FormBuilder, private toastr: ToastrService, private auth: AuthService) {
    this.masterScreen = new MasterScreen();
    this.masterScreen.id = 'country';
    this.masterScreen.name = 'Country';
    this.masterScreen.description = 'Country';
    this.masterScreen.size = 'lg';
    this.masterScreen.columnConfig = [
      {columnName:'Id',columnKey:'id',dataType:'number',isSortable:true},
      { columnName: 'Country Name', columnKey: 'countryName', dataType: 'string', isSortable: true },
      { columnName: 'Country Code', columnKey: 'countryCode', dataType: 'string', isSortable: true },
      { columnName: 'Capital', columnKey: 'capital', dataType: 'string', isSortable: true },
      { columnName: 'Description', columnKey: 'description', dataType: 'string', isSortable: true },
      { columnName: 'Status', columnKey: 'status', dataType: 'status' },
    ];
    this.masterScreen.permission = new Permission();
    this.masterScreen.permission.create = true;
    this.masterScreen.permission.edit = true;
    this.masterScreen.permission.view = true;
    this.masterScreen.permission.delete = true;
    this.masterScreen.permission.downloadFile = true;
    this.masterScreen.permission.uploadFile = true;
    this.masterScreen.permission.filterByStatus = true;
    this.masterScreen.permission.selectable = true;
  }

  ngOnInit(): void {
    this.initializeForm();
    
    // Determine which type of pagination to use (can be set dynamically or from a configuration)
    // For example, you might have a feature flag or config setting to turn on server pagination
    this.useServerPagination = false; // Set to true for server-side pagination, false for client-side
    
    this.getCountries();
  }

  initializeForm() {
    this.countryForm = this.fb.group({
      id:[''],
      countryName: ['', [Validators.required, this.whiteSpaceValidator(true)]],
      countryCode: ['', [Validators.required, Validators.maxLength(3), this.whiteSpaceValidator(true)]],
      capital: ['', [Validators.required, this.whiteSpaceValidator(true)]],
      description: ['', [Validators.required, this.whiteSpaceValidator(true)]],
      status: ['ACTIVE', [Validators.required]]
    });
  }

  // This method decides which getAll function to use based on useServerPagination flag
  getCountries(params?: any): void {
    if (this.useServerPagination) {
      this.getAllWithPagination(params);
    } else {
      this.getAllCountries();
    }
  }  

  // Get all countries without pagination (client-side pagination)
  getAllCountries(): void {
    this.auth.getAll('country')
      .then((res: any) => {
        if (res.code === '200' && res.data) {
          this.rowData = res.data;
          this.totalCount = this.rowData.length;
        } else {
          this.rowData = [];
          this.totalCount = 0;
        }
      })
      .catch(error => {
        console.error('Error fetching countries:', error);
        this.toastr.error('Failed to load countries');
      });
  }

  // Get countries with server-side pagination
getAllWithPagination(params?: any): void {
  const queryParams = {
    page: params?.page || this.currentPage,
    limit: params?.limit || this.pageSize,
    search: params?.search !== undefined ? params.search : this.searchTerm,
    status: params?.status !== undefined ? params.status : this.statusFilter,
    orderBy: params?.orderBy || this.sortBy,
    orderDir: params?.orderDir || this.sortDir
  };
  
  // Update the local values with the params
  if (params) {
    if (params.page) this.currentPage = params.page;
    if (params.limit) this.pageSize = params.limit;
    if (params.search !== undefined) this.searchTerm = params.search;
    if (params.status !== undefined) this.statusFilter = params.status;
    if (params.orderBy) this.sortBy = params.orderBy;
    if (params.orderDir) this.sortDir = params.orderDir;
  }

  // Make the API call with the updated params
  this.auth.getWithPagination<any>('country/pagination', queryParams)
    .then((res: any) => {
      if (res.code === '200') {
        this.rowData = res.data.records;
        this.totalCount = res.data.totalCount || this.rowData.length;
      } else {
        this.rowData = [];
        this.totalCount = 0;
      }
    })
    .catch(error => {
      console.error('Error fetching countries with pagination:', error);
      this.toastr.error('Failed to load countries');
    });
}


  // Form related methods
  public setData(row: any, form: any): void {
    form.patchValue(row);
    form.get("id").disable();
  }

  view(row: any, form: any) {
    form.patchValue(row);
  }

  new(form: any) {
    form.reset();
    form.patchValue({
      status: "ACTIVE"
    });
  }

  selectedItems: any[] = [];
  onSelectionChange(selectedItems: any[]) {
    this.selectedItems = selectedItems;
    console.log('Selected items:', this.selectedItems);
    
    // You can now use the selectedItems for bulk operations
    // For example, enable/disable bulk action buttons based on selection
  }
  whiteSpaceValidator(isRequired: boolean) {
    return (control: any) => {
      if (isRequired && control.value && control.value.trim() === '') {
        return { whitespace: true };
      }
      return null;
    };
  }

  createCountry(form: FormGroup, context: any): void {
    if (form.valid) {
      this.auth.post('country', form.value)
        .then((res: any) => {
          if (res.code === '201' && res.data) {
            this.toastr.success('Country created successfully');
            context.closeModal({ code: '0000' });
            this.getCountries();
          } else {
            this.toastr.error('Failed to create country');
            context.closeModal({ code: '1111' });
          }
        })
        .catch(error => {
          console.error('Error creating country:', error);
          this.toastr.error('Failed to create country');
          context.closeModal({ code: '1111' });
        });
    }
  }

  updateCountry(row: any, form: FormGroup, context: any): void {
    const updateData = {
      id: row.id,
      countryName: form.value.countryName,
      countryCode: form.value.countryCode,
      capital: form.value.capital,
      description: form.value.description,
      status: form.value.status
    };

    if (form.valid) {
      this.auth.put('country', updateData)
        .then((res: any) => {
          if (res.code === '200' && res.data) {
            this.toastr.success('Country updated successfully');
            context.closeModal({ code: '0000' });
            this.getCountries();
          } else {
            this.toastr.error('Failed to update country');
            context.closeModal({ code: '1111' });
          }
        })
        .catch(error => {
          console.error('Error updating country:', error);
          this.toastr.error('Failed to update country');
          context.closeModal({ code: '1111' });
        });
    }
  }

  deleteCountry(row: any): void {
    this.auth.delete('country', row.id)
      .then((res: any) => {
        if (res.code === '200') {
          this.toastr.success('Country deleted successfully');
          this.getCountries();
        } else {
          this.toastr.error('Failed to delete country');
        }
      })
      .catch(error => {
        console.error('Error deleting country:', error);
        this.toastr.error('Failed to delete country');
      });
  }

  downloadCountryData(): void {
    // Implement download functionality if needed
    this.toastr.info('Download functionality not implemented');
  }
  
  uploadCountryData(file: any): void {
    console.log("Uploading file:", file);
    // Implement file upload logic here
  }
}