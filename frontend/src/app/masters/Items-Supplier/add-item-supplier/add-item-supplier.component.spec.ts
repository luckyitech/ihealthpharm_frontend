import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

import { AddItemSupplierComponent } from './add-item-supplier.component';
import { AddItemSupplierService } from './shared/add-item-supplier.service';
import { AddItemSupplier } from './shared/add-item-supplier.model';

describe('a add-item-supplier component', () => {
	let component: AddItemSupplierComponent;

	// register all needed dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpModule],
			providers: [
				{ provide: AddItemSupplierService, useClass: MockAddItemSupplierService },
				AddItemSupplierComponent
			]
		});
	});

	// instantiation through framework injection
	beforeEach(inject([AddItemSupplierComponent], (AddItemSupplierComponent) => {
		component = AddItemSupplierComponent;
	}));

	it('should have an instance', () => {
		expect(component).toBeDefined();
	});
});

// Mock of the original add-item-supplier service
class MockAddItemSupplierService extends AddItemSupplierService {
	getList(): Observable<any> {
		return Observable.from([ { id: 1, name: 'One'}, { id: 2, name: 'Two'} ]);
	}
}
