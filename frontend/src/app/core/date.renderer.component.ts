import { Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
    selector: 'child-cell',
    template: `
     <input type="date" (change)="onDateChange($event)" [value]="params.value">
    `
})

export class DateRenderer {
    params: ICellRendererParams
    public agInit(params: any): void {
        this.params = params;
    }

    onDateChange(event: Event) {
        this.params.data[this.params.colDef.field] = event.target['value'];
    }

}