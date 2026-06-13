import { Component } from "@angular/core";
import { ICellRendererParams } from "ag-grid-community";
import { AppService } from "./app.service";

@Component({
    selector: 'child-cell',
    template: `
    <button class="btn-primary" style='margin-right:16px' (click)="editClick()">EDIT</button>
    <button class="btn-primary" style='margin-right:16px' (click)="deleteClick()">DELETE</button>
    `
})
export class ModifierRendererComponent {
    public params: any;
    public val: any;

    constructor(private appService: AppService) {

    }

    public agInit(params: ICellRendererParams): void {
        this.params = params;
        this.val = params.value;
    }

    editClick() {
        this.appService.setEditedObj(this.params.data);
    }

    deleteClick() {
        this.appService.setDeletedObj(this.params.data);
    }
}