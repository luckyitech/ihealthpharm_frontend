import { TestBed, inject } from '@angular/core/testing';

import { CheckBoxComponent } from './check-box.component';

describe('a check-box component', () => {
	let component: CheckBoxComponent;

	// register all needed dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				CheckBoxComponent
			]
		});
	});

	// instantiation through framework injection
	beforeEach(inject([CheckBoxComponent], (CheckBoxComponent) => {
		component = CheckBoxComponent;
	}));

	it('should have an instance', () => {
		expect(component).toBeDefined();
	});
});