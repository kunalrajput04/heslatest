import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-edit-button',
  template: `<button  type="button" [style.background-color]="color" class="btn" style="font-size: 13px;padding: 2px 5px 3px;color:white;" (click)="onClick($event)">{{label}}</button>`

})

export class EditButtonComponent implements ICellRendererAngularComp {
  params;
  label: string;
  color: string = 'red';
  
  agInit(params): void {

    this.params = params;
    this.label = this.params.label || null;
    this.color = this.params.color || 'blue';
  
  }

  refresh(params?: any): boolean {
    return true;
  }

  onClick($event) {
    if (this.params.onClick instanceof Function) {
      // put anything into params u want pass into parents component
      const params = {
        event: $event,
        rowData: this.params.node.data
        // ...something
      }
      this.params.onClick(params);

    }
  }

}
