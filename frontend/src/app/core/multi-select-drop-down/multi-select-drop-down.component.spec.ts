import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

import { MultiSelectDropDownComponent } from './multi-select-drop-down.component';
import { MultiSelectDropDownService } from './shared/multi-select-drop-down.service';
import { MultiSelectDropDown } from './shared/multi-select-drop-down.model';

describe('a multi-select-drop-down component', () => {
	let component: MultiSelectDropDownComponent;

	// register all needed dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpModule],
			providers: [
				{ provide: MultiSelectDropDownService, useClass: MockMultiSelectDropDownService },
				MultiSelectDropDownComponent
			]
		});
	});

	// instantiation through framework injection
	beforeEach(inject([MultiSelectDropDownComponent], (MultiSelectDropDownComponent) => {
		component = MultiSelectDropDownComponent;
	}));

	it('should have an instance', () => {
		expect(component).toBeDefined();
	});
});

// Mock of the original multi-select-drop-down service
class MockMultiSelectDropDownService extends MultiSelectDropDownService {
	getList(): Observable<any> {
		return Observable.from([ { id: 1, name: 'One'}, { id: 2, name: 'Two'} ]);
	}
}
