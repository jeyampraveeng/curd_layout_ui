// text-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CurdLayoutComponent } from '../curd-layout/curd-layout.component';
import { MasterScreen } from '../common-data/master-screen';
import { ColumnConfig } from '../common-data/column-config';
import { Permission } from '../common-data/permission';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { Observable, of } from 'rxjs'; 

interface TextItem {
  id: number;
  title: string;
  content: string;
  createdBy: string;
  createdDate: Date;
  isActive: boolean;
  status: string;
}

@Component({
  selector: 'app-text-list',
  standalone: true,
  imports: [
    CommonModule,
    CurdLayoutComponent,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './text-list.component.html',
  styles: [],
})
export class TextListComponent implements OnInit {
  // to inlilize parent comopont  config
  public masterScreen!: MasterScreen;
  public rowData: TextItem[] = [];
  public totalCount!: number;

  // Form related
  textItemForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.masterScreen = new MasterScreen();
    
    // Initialize the permission property if it doesn't exist
    this.masterScreen.permission = new Permission(); // Add this line
    
    this.masterScreen.columnConfig = [
      {columnName:'id',columnKey:'id',dataType:'long',isSortable:true},
      { columnName: 'title',columnKey:'title', dataType: 'string', isSortable: true },
      { columnName: 'content',columnKey:'content', dataType: 'string', isSortable: false },
      { columnName: 'createdBy',columnKey:'createdBy', dataType: 'string', isSortable: true },
      { columnName: 'createdDate',columnKey:'createdDate', dataType: 'date', isSortable: true },
      { columnName: 'isActive',columnKey:'isActive', dataType: 'boolean', isSortable: true },
      { columnName: 'status',columnKey:'status', dataType: 'status' },
    ];
    
    // Now these will work as expected
    this.masterScreen.permission.create = true;
    this.masterScreen.permission.edit = true;
    this.masterScreen.permission.delete = true;
    this.masterScreen.permission.downloadFile = true;
    this.masterScreen.permission.uploadFile = true;
    this.masterScreen.permission.view = true;
    this.masterScreen.permission.filterByStatus = true;

    this.masterScreen.id = 'testing';
    this.masterScreen.name = 'Testing';
    this.masterScreen.description = 'testing';
    this.masterScreen.size = 'lg';
}

  ngOnInit(): void {

    this.initForm();
    this.loadSampleData();

  }


  private initForm(item?: TextItem) {
    this.textItemForm = this.fb.group({
      title: [
        item?.title || '',
        [Validators.required, Validators.minLength(3)],
      ],
      content: [item?.content || '', [Validators.required]],
      createdBy: [item?.createdBy || 'Current User', [Validators.required]],
      createdDate: [item?.createdDate || new Date(), [Validators.required]],
      isActive: [item?.isActive !== undefined ? item.isActive : true],
      status: [item?.status || 'ACTIVE', [Validators.required]],
    });
  }

  qryList:any[]=[]
  new(form: any) {
    this.qryList = [];
  }

 loadSampleData() {
    // Sample data for demonstration
    this.rowData = [
      {
        id: 1,
        title: 'Welcome Note',
        content: 'Welcome to our application! We hope you enjoy using it.',
        createdBy: 'Admin',
        createdDate: new Date(2025, 3, 5),
        isActive: true,
        status: "ACTIVE",
      },
      {
        id: 2,
        title: 'Important Update',
        content: 'We have released a new version with exciting features.',
        createdBy: 'System',
        createdDate: new Date(2025, 3, 7),
        isActive: true,
        status: "ACTIVE",
      },
      {
        id: 3,
        title: 'Scheduled Maintenance',
        content: 'The system will be unavailable on Sunday from 2 AM to 4 AM.',
        createdBy: 'Support',
        createdDate: new Date(2025, 3, 8),
        isActive: true,
        status: "ACTIVE",
      },
      {
        id: 4,
        title: 'Feature Feedback',
        content: 'Please provide your feedback on the new features we added.',
        createdBy: 'Product Manager',
        createdDate: new Date(2025, 3, 9),
        isActive: true,
        status: "ACTIVE",
      },
      {
        id: 5,
        title: 'Archived Note',
        content: 'This is an old note that is no longer relevant.',
        createdBy: 'Admin',
        createdDate: new Date(2025, 2, 15),
        isActive: false,
        status: "INACTIVE",
      },
      {
        id: 6,
        title: 'Welcome Note',
        content: 'Welcome to our application! We hope you enjoy using it.',
        createdBy: 'Admin',
        createdDate: new Date(2025, 3, 5),
        isActive: true,
        status: "ACTIVE",
      },
      {
        id: 7,
        title: 'Important Update',
        content: 'We have released a new version with exciting features.',
        createdBy: 'System',
        createdDate: new Date(2025, 3, 7),
        isActive: true,
        status: "ACTIVE",
      },
      {
        id: 8,
        title: 'Scheduled Maintenance',
        content: 'The system will be unavailable on Sunday from 2 AM to 4 AM.',
        createdBy: 'Support',
        createdDate: new Date(2025, 3, 8),
        isActive: true,
        status: "ACTIVE",
      },
      {
        id: 9,
        title: 'Feature Feedback',
        content: 'Please provide your feedback on the new features we added.',
        createdBy: 'Product Manager',
        createdDate: new Date(2025, 3, 9),
        isActive: true,
        status: "ACTIVE",
      },
      {
        id: 10,
        title: 'Archived Note',
        content:
          'Thiaqqqqqqqqqqqqqqqs is an old note that is no longer relevant.',
        createdBy: 'Admin',
        createdDate: new Date(2025, 2, 15),
        isActive: false,
        status: "INACTIVE",
      },
      {
        id: 11,
        title: 'Welcome Note',
        content:
          'Welcome to our application! We hope you enjoy using iqqqqqqqqqqqt.',
        createdBy: 'Admin',
        createdDate: new Date(2025, 3, 5),
        isActive: true,
        status: "ACTIVE",
      },
      {
        id: 12,
        title: 'Important Update',
        content: 'We have released a new version with exciting features.as',
        createdBy: 'System',
        createdDate: new Date(2025, 3, 7),
        isActive: true,
        status: "ACTIVE",
      },
      {
        id: 13,
        title: 'Scheduled Maintenance111',
        content: 'The system will be unavailable on Sunday from 2 AM to 4 AM.',
        createdBy: 'Support',
        createdDate: new Date(2025, 3, 8),
        isActive: true,
        status: "ACTIVE",
      },
      {
        id: 14,
        title: 'Feature Feedback1111',
        content: 'Please provide your feedback on the new features we added.',
        createdBy: 'Product Manager',
        createdDate: new Date(2025, 3, 9),
        isActive: true,
        status: "ACTIVE",
      },
      {
        id: 15,
        title: 'Archived Note11111',
        content: 'This is an old note that is no longer relevant.',
        createdBy: 'Admin',
        createdDate: new Date(2025, 2, 15),
        isActive: false,
        status: "INACTIVE",
      },
    ];
    this.totalCount= this.rowData.length;
  }


  returns:any;

  getAll  () {
    
    return of(this.rowData); 
  }
  
  create (data: any){
  console.log(data);
  return this.returns;
  }
  
  update  (id: number, data: any){
    console.log(id,data)

    return this.returns;
  }
  
  delete  (id: number){
    console.log(id)
    return this.returns;
  }
  
  upload (file: File){
    
    console.log(file)

    return this.returns;
  }
  
  download () {
   
    console.log("itsworking")
    return this.returns;
  }

  formConfig = {
    disabledFields: ['id'], // Fields to disable in edit mode
    defaultValues: {
      status: 'ACTIVE',
      isActive: true
    }
  };

  onDataLoaded(data: any[]) {
    console.log('Data loaded', data);
  }
  
  onError(error: any) {
    console.error('API Error', error);
  }
}
