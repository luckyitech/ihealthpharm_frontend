import { ItemsSupplierComponent } from './Items-Supplier/Items-Supplier.component';
import { AddItemSupplierComponent } from './Items-Supplier/add-item-supplier/add-item-supplier.component';
import { EditItemSupplierComponent } from './Items-Supplier/edit-item-supplier/edit-item-supplier.component';
import { ItemsComponent } from './items/items.component';
import { EditSupplierComponent } from './supplier/edit-supplier/edit-supplier.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './../app-routing.module';
import { MembershipsComponent } from './membership/membership.component';
import { ToastrModule } from 'ngx-toastr';
import { AddSupplierComponent } from './supplier/add-supplier/add-supplier.component';
import { SupplierComponent } from './supplier/supplier.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { MastersComponent } from './masters.component';
import { ManufacturerComponent } from './manufacturer/manufacturer.component';
import { ProviderComponent } from './provider/provider.component';
import { EmployeeComponent } from './employee/employee.component';
import { HospitalComponent } from './hospital/hospital.component';
import { PharmacyComponent } from './pharmacy/pharmacy.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { InsuranceComponent } from './insurance/insurance.component';
import { ItemComponent } from './items/item/item.component';
import { ItemCategoryComponent } from './items/item-category/item-category.component';
import { ItemForumComponent } from './items/item-forum/item-forum.component';
import { ItemGenericCodeComponent } from './items/item-generic-code/item-generic-code.component';
import { ItemGroupsComponent } from './items/item-groups/item-groups.component';
import { SpecializationComponent } from './items/specialization/specialization.component';
import { UomComponent } from './items/uom/uom.component';
import { FormulationInstructionsComponent } from './items/formulation-instructions/formulation-instructions.component';
import { FormulationInstructionsEditComponent } from './items/formulation-instructions-edit/formulation-instructions-edit.component';
import { ItemEditComponent } from './items/item-edit/item-edit.component';
import { ItemCategoryEditComponent } from './items/item-category-edit/item-category-edit.component';
import { ItemForumEditComponent } from './items/item-forum-edit/item-forum-edit.component';
import { ItemGenericCodeEditComponent } from './items/item-generic-code-edit/item-generic-code-edit.component';
import { ItemGroupsEditComponent } from './items/item-groups-edit/item-groups-edit.component';
import { UomEditComponent } from './items/uom-edit/uom-edit.component';
import { SpecializationEditComponent } from './items/specialization-edit/specialization-edit.component';
import { EditManufacturerComponent } from './manufacturer/edit-manufacturer/edit-manufacturer.component';
import { AddManufacturerComponent } from './manufacturer/add-manufacturer/add-manufacturer.component';
import { AddProviderComponent } from './provider/add-provider/add-provider.component';
import { EditProviderComponent } from './provider/edit-provider/edit-provider.component';
import { EditHospitalComponent } from './hospital/edit-hospital/edit-hospital.component';
import { AddHospitalComponent } from './hospital/add-hospital/add-hospital.component';
import { AddPharmacyComponent } from './pharmacy/add-pharmacy/add-pharmacy.component';
import { EditPharmacyComponent } from './pharmacy/edit-pharmacy/edit-pharmacy.component';
import { EditTermsAndConditionsComponent } from './terms-and-conditions/edit-terms-and-conditions/edit-terms-and-conditions.component';
import { AddTermsAndConditionsComponent } from './terms-and-conditions/add-terms-and-conditions/add-terms-and-conditions.component';
import { AddInsuranceComponent } from './insurance/add-insurance/add-insurance.component';
import { EditInsuranceComponent } from './insurance/edit-insurance/edit-insurance.component';
import { CustomerComponent } from './customer/customer.component';
import { CustomerSingleComponent } from './customer/customer-single/customer-single.component';
import { CustomerMembershipComponent } from './customer/customer-membership/customer-membership.component';
import { CustomerInsuranceComponent } from './customer/customer-insurance/customer-insurance.component';
import { CustomerInsuranceEditComponent } from './customer/customer-insurance-edit/customer-insurance-edit.component';
import { CustomerMembershipEditComponent } from './customer/customer-membership-edit/customer-membership-edit.component';
import { CustomerSingleEditComponent } from './customer/customer-single-edit/customer-single-edit.component';
import { AddMembershipsComponent } from './membership/add-memberships/add-memberships.component';
import { EditMembershipsComponent } from './membership/edit-memberships/edit-memberships.component';
import { AddEmployeeComponent } from './employee/add-employee/add-employee.component';
import { EditEmployeeComponent } from './employee/edit-employee/edit-employee.component';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { ConfigComponent } from './config/config.component';
import { AccountComponent } from './account/account.component';

@NgModule({
  declarations: [MastersComponent,

    SupplierComponent,
    ManufacturerComponent,
    ProviderComponent,
    EmployeeComponent,
    HospitalComponent,
    PharmacyComponent,
    TermsAndConditionsComponent,
    InsuranceComponent,
    ItemComponent,
    ItemCategoryComponent,
    ItemForumComponent,
    ItemGenericCodeComponent,
    ItemGroupsComponent,
    SpecializationComponent,
    UomComponent,
    FormulationInstructionsComponent,
    FormulationInstructionsEditComponent,
    ItemEditComponent,
    ItemCategoryEditComponent,
    ItemForumEditComponent,
    ItemGenericCodeEditComponent,
    ItemGroupsEditComponent,
    UomEditComponent,
    SpecializationEditComponent,
    AddSupplierComponent,
    EditSupplierComponent,
    EditManufacturerComponent,
    AddManufacturerComponent,
    AddProviderComponent,
    EditProviderComponent,
    EditHospitalComponent,
    AddHospitalComponent,
    AddPharmacyComponent,
    EditPharmacyComponent,
    EditTermsAndConditionsComponent,
    AddTermsAndConditionsComponent,
    AddInsuranceComponent,
    EditInsuranceComponent,
    CustomerComponent,
    CustomerSingleComponent,
    CustomerMembershipComponent,
    CustomerInsuranceComponent,
    CustomerInsuranceEditComponent,
    CustomerMembershipEditComponent,
    CustomerSingleEditComponent,
    AddMembershipsComponent,
    EditMembershipsComponent,
    MembershipsComponent,
    ItemsComponent,
    CustomerComponent,
    CustomerSingleComponent,
    CustomerMembershipComponent,
    CustomerInsuranceComponent,
    CustomerSingleEditComponent,
    CustomerMembershipEditComponent,
    CustomerInsuranceEditComponent,
    MembershipsComponent,
    AddMembershipsComponent,
    EditMembershipsComponent,
    ItemsSupplierComponent,
    AddItemSupplierComponent,
    EditItemSupplierComponent,
    AddEmployeeComponent,
    EditEmployeeComponent,
    ConfigComponent,
    AccountComponent
  ],
  imports: [
    CommonModule,
    Ng4LoadingSpinnerModule.forRoot(),
    AgGridModule.withComponents([]),
    NgSelectModule,
    ToastrModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class MastersModule { }
