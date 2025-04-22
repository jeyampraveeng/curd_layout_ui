import { ColumnConfig } from "./column-config";
import { Permission } from "./permission";


export class MasterScreen {
    id!: string;
    name!: string;
    description!: string;
    columnConfig!: ColumnConfig [];
    permission!: Permission;
    size!:string;
    theme?: 'primary' | 'success' | 'warning' | 'danger';
}