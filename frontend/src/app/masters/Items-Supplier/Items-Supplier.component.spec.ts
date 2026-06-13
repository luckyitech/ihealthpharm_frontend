import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

import { ItemsSupplierComponent } from './Items-Supplier.component';
import { ItemsSupplierService } from './shared/Items-Supplier.service';
import { ItemsSupplier } from './shared/Items-Supplier.model';

describe('a Items-Supplier component', () => {
	let component: ItemsSupplierComponent;

	// register all needed dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpModule],
			providers: [
				{ provide: ItemsSupplierService, useClass: MockItemsSupplierService },
				ItemsSupplierComponent
			]
		});
	});

	// instantiation through framework injection
	beforeEach(inject([ItemsSupplierComponent], (ItemsSupplierComponent) => {
		component = ItemsSupplierComponent;
	}));

	it('should have an instance', () => {
		expect(component).toBeDefined();
	});
});

// Mock of the original Items-Supplier service
class MockItemsSupplierService extends ItemsSupplierService {
	getList(): Observable<any> {
		return Observable.from([ { id: 1, name: 'One'}, { id: 2, name: 'Two'} ]);
	}
}
