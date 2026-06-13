import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { SingleSelectDropDownService } from './shared/single-select-drop-down.service';

@Component({
	selector: 'single-select-drop-down',
	templateUrl: 'single-select-drop-down.component.html',
	styleUrls: ['single-select-drop-down.component.css'],
	providers: [SingleSelectDropDownService]
})

export class SingleSelectDropDownComponent implements OnInit {
	@Input('items') set items(list: any[]) {
	
		if (list instanceof Array) {
			this.list = list;
		}
	}

	@Input('resetSearchTerm') set resetSearchTerm(reset:boolean) {
		this.searchTerm = '';
	}

	@Input('readKey') set readKey(readProperty: string) {
		if (typeof readProperty === 'string') {
			this.readProperty = readProperty;
		}
	}

	@Output() selectionChanged = new EventEmitter<any>();
	@Output() searchTermChanged = new EventEmitter<any>();

	constructor(private singleSelectDropDownService: SingleSelectDropDownService) { }

	list: any[] = [];
	readProperty: string = '';
	searchTerm: string = '';

	ngOnInit() {

	}

	onItemClick(item: any) {
		this.selectionChanged.emit(item);
	}

	getItemTitle(item: any) {
		return item[this.readProperty];
	}

	onSearchTermChanged() {
		this.searchTermChanged.emit(this.searchTerm);
	}

}