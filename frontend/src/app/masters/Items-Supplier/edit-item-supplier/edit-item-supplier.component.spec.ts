import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

import { EditItemSupplierComponent } from './edit-item-supplier.component';
import { EditItemSupplierService } from './shared/edit-item-supplier.service';
import { EditItemSupplier } from './shared/edit-item-supplier.model';

describe('a edit-item-supplier component', () => {
	let component: EditItemSupplierComponent;

	// register all needed dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpModule],
			providers: [
				{ provide: EditItemSupplierService, useClass: MockEditItemSupplierService },
				EditItemSupplierComponent
			]
		});
	});

	// instantiation through framework injection
	beforeEach(inject([EditItemSupplierComponent], (EditItemSupplierComponent) => {
		component = EditItemSupplierComponent;
	}));

	it('should have an instance', () => {
		expect(component).toBeDefined();
	});
});

// Mock of the original edit-item-supplier service
class MockEditItemSupplierService extends EditItemSupplierService {
	getList(): Observable<any> {
		return Observable.from([ { id: 1, name: 'One'}, { id: 2, name: 'Two'} ]);
	}
}
