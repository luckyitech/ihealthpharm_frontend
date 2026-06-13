import { AfterViewInit, Component, ViewChild, ViewContainerRef } from "@angular/core";

import { ICellEditorAngularComp } from "ag-grid-angular";

@Component({
    selector: 'numeric-cell',
    template: `<input #input (keydown)="onKeyDown($event)" [(ngModel)]="value" style="width: 100%">`
})
export class NumericEditor implements ICellEditorAngularComp, AfterViewInit {
    private params: any;
    public value: number;
    public originalValue;
    private cancelBeforeStart: boolean = false;

    @ViewChild('input', { read: ViewContainerRef, static: false }) public input;


    agInit(params: any): void {
        this.params = params;
        this.value = this.originalValue = this.params.value;
        // only start edit if key pressed is a number, not a letter
        this.cancelBeforeStart = params.charPress && ('1234567890'.indexOf(params.charPress) < 0);
    }

    getValue(): any {
        return this.value;
    }

    isCancelBeforeStart(): boolean {
        return this.cancelBeforeStart;
    }

    // will reject the number if it greater than 1,000,000
    // not very practical, but demonstrates the method.
    // isCancelAfterEnd(): boolean {
    //     return this.value > 1000000;
    // };

    onKeyDown(event): void {
        let key = event.which || event.keyCode
        if (key == 37 || key == 39) {
            event.stopPropagation();
        }
        else {
            if (!this.isKeyPressedNumeric(event)) {
                // this.loadEntitiesService.setNanFound(true);
                if (event.preventDefault) event.preventDefault();
            } else {
                //this.loadEntitiesService.setNanFound(false);
            }
        }
    }

    // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
    ngAfterViewInit() {
        setTimeout(() => {
            this.input.element.nativeElement.focus();
        })
    }

    private getCharCodeFromEvent(event): any {
        event = event || window.event;
        return (typeof event.which == "undefined") ? event.keyCode : event.which;
    }

    private isCharNumeric(charStr): boolean {
        return !!/\d/.test(charStr);
    }

    private isKeyPressedNumeric(event): boolean {
        const charCode = this.getCharCodeFromEvent(event);
        const charStr = event.key ? event.key : String.fromCharCode(charCode);
        if (charStr === "Backspace") {
            return this.isCharNumeric(8);
        } else if (charStr === "Delete") {
            return this.isCharNumeric(46);
        } else if (charStr === ".") {
            if (this.getValue().indexOf('.') <= 0) {
                return this.isCharNumeric(190);
            }
        } else if (charStr === "Enter") {
            return this.isCharNumeric(13);
        } else if (charStr === "Tab") {
            return this.isCharNumeric(9);
        } else if (charStr === "Control") {
            return this.isCharNumeric(17);
        } else if (charStr === "Alt") {
            return this.isCharNumeric(18);
        } else {
            return this.isCharNumeric(charStr);
        }
    }
}