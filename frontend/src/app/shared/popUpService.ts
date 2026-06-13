import { Injectable } from "@angular/core";
import { BsModalService } from 'ngx-bootstrap';
import { DebitNoteComponent } from '../finance/debit-note/debit-note.component';
import { defaultOptions } from 'highcharts';


@Injectable({ providedIn: 'root' })
export class popUpService {
    constructor(public modalService: BsModalService) {

    }

    openModal(component, initialState) {
        const defaultOptions: any = {
            backdrop: 'static',
            keyboard: true,
            focus: true,
            show: false,
            ignoreBackdrop: false,
            animated: true,
            initialState: {}
        };
        defaultOptions.initialState = initialState;

        switch (component) {
            case 'DebitNoteComponent': this.modalService.show(DebitNoteComponent, defaultOptions);
                break;
        }
        return this.modalService;
    }
}
