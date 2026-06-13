import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { MultiSelectDropDown } from './shared/multi-select-drop-down.model';
import { MultiSelectDropDownService } from './shared/multi-select-drop-down.service';

@Component({
	selector: 'multi-select-drop-down',
	templateUrl: 'multi-select-drop-down.component.html',
	styleUrls:['multi-select-drop-down.component.css'],
	providers: [MultiSelectDropDownService]
})

export class MultiSelectDropDownComponent implements OnInit {
	multiSelectDropDown: MultiSelectDropDown[] = [];

	constructor(private multiSelectDropDownService: MultiSelectDropDownService) { }

	@Input('items') set items(list: any[]) {

		if (list instanceof Array) {
			this.list = list;
		}
	}

	@Input('primaryKey') set setPrimaryKey(primaryKey: string) {
		if (typeof primaryKey === 'string') {
			this.uniqueKey = primaryKey;
		}
	}

	@Input('selectedItems') set selectedItems(list: any[]) {

		if (list instanceof Array) {
			this.selectedList = list;
		}
	}

	@Input('resetSearchTerm') set resetSearchTerm(reset: boolean) {
		this.searchTerm = '';
	}

	@Input('readKey') set readKey(readProperty: string) {
		if (typeof readProperty === 'string') {
			this.readProperty = readProperty;
		}
	}

	@Output() selectionChanged = new EventEmitter<any>();
	@Output() searchTermChanged = new EventEmitter<any>();
	@Output() checkedItem = new EventEmitter<any>();
	@Output() checkedItems = new EventEmitter<any>();

	list: any[] = [];
	selectedList: any[] = [];
	readProperty: string = '';
	searchTerm: string = '';
	uniqueKey: string = '';

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

	onCheckBoxSelected(event: Event, item: Object) {
		if (event.target['checked']) {
			this.selectedList.push(item);
		} else {
			let deleteIndex = this.findObjectIndex(this.selectedList, item, this.uniqueKey);
			if (deleteIndex !== -1) {
				this.selectedList.splice(deleteIndex, 1);
			}
		}
		this.checkedItem.emit(item);
		this.checkedItems.emit(this.selectedList);
	}

	findObjectIndex(listArray: any[], item: any, key: string): number {
		return listArray.findIndex(x => x[key] === item[key]);
	}

	checkSelectedItemStatus(item: any) {
		let checkedIndex = this.findObjectIndex(this.selectedList, item, this.uniqueKey);
		if (checkedIndex !== -1) {
			return true;
		}
		else {
			return false;
		}
	}

}