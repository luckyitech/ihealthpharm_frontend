import { Component, OnInit } from '@angular/core';
import { ItemsSupplierService } from './shared/Items-Supplier.service';

@Component({
	
	selector: 'Items-Supplier',
	templateUrl: 'Items-Supplier.component.html',
	providers: [ItemsSupplierService]
})

export class ItemsSupplierComponent implements OnInit {
	
	selectedTab='add';

	constructor(private ItemsSupplierService: ItemsSupplierService) { }

	ngOnInit() {
		
	}
}