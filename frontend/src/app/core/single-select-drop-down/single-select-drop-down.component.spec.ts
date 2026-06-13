import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

import { SingleSelectDropDownComponent } from './single-select-drop-down.component';
import { SingleSelectDropDownService } from './shared/single-select-drop-down.service';
import { SingleSelectDropDown } from './shared/single-select-drop-down.model';

describe('a single-select-drop-down component', () => {
	let component: SingleSelectDropDownComponent;

	// register all needed dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpModule],
			providers: [
				{ provide: SingleSelectDropDownService, useClass: MockSingleSelectDropDownService },
				SingleSelectDropDownComponent
			]
		});
	});

	// instantiation through framework injection
	beforeEach(inject([SingleSelectDropDownComponent], (SingleSelectDropDownComponent) => {
		component = SingleSelectDropDownComponent;
	}));

	it('should have an instance', () => {
		expect(component).toBeDefined();
	});
});

// Mock of the original single-select-drop-down service
class MockSingleSelectDropDownService extends SingleSelectDropDownService {
	getList(): Observable<any> {
		return Observable.from([ { id: 1, name: 'One'}, { id: 2, name: 'Two'} ]);
	}
}
