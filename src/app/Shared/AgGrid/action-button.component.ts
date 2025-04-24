import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-action-button',
  template: `
    <div style="display: flex; gap: 8px; justify-content: center;">
     
      <button
        type="button"
        class="btn btn-primary"
        style="font-size: 13px; padding: 2px 5px; color: white;"
        (click)="onEdit($event)"
      >
        <i class="fa fa-edit"></i>
      </button>
   
      <button
        type="button"
        class="btn btn-danger"
        style="font-size: 13px; padding: 2px 5px; color: white;"
        (click)="onDelete($event)"
      >
        <i class="fa fa-trash"></i>
      </button>
    </div>
  `,
})
export class ActionButtonComponent implements ICellRendererAngularComp {
  params: any;

  agInit(params): void {
    this.params = params;
  }

  refresh(params?: any): boolean {
    return true;
  }

  onEdit($event) {
    if (this.params.onEdit instanceof Function) {
      const params = {
        event: $event,
        rowData: this.params.node.data,
      };
      this.params.onEdit(params);
    }
  }

  onDelete($event) {
    if (this.params.onDelete instanceof Function) {
      const params = {
        event: $event,
        rowData: this.params.node.data,
      };
      this.params.onDelete(params);
    }
  }
}
