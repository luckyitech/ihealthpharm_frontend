import { Environment } from 'src/app/core/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class EmployeeService {

  urlRef = new Environment();
  
  constructor(private http: HttpClient) {

  }

  getCountries() {
    return this.http.get(this.urlRef.url + 'getCountries');
  }

  getPharmacyRoles() {
    return this.http.get(this.urlRef.url + 'getallpharmacyrolesdata');
  }

  getPharmacies() {
    return this.http.get(this.urlRef.url + 'getactivepharmaciesdata');
  }

  getAccessPermissions() {
    return this.http.get(this.urlRef.url + 'getallpharmaaccessdata');
  }

  getAllEmployeeTypes() {
    return this.http.get(this.urlRef.url + 'getallemployeetypedata');
  }
  getProvinces(country: Object) {
    return this.http.post(this.urlRef.url + 'getProvincebyid', country);
  }
  getRowDataFromServer() {
    return this.http.get(this.urlRef.url + 'getallemployeesdata');
  }

  getAllEmployeesWithAccess(){
    return this.http.get(this.urlRef.url+'getEmployess/havingAccess')
  }

  getLastCreatedEmployeeId() {
    return this.http.get(this.urlRef.url + 'getemployeeid');
  }

  /* Employee API */

  saveEmployeeData(employeeInformation: Object) {
    return this.http.post(this.urlRef.url + 'save/employee', employeeInformation)
  }

  saveEmployeeDataWithProfileImage(employeeInformation: Object) {
    return this.http.put(this.urlRef.url + 'save/employeewithprofileimage', employeeInformation)
  }

  saveEmployeeDataWithIdentificationDocument(employeeInformation: Object) {
    return this.http.put(this.urlRef.url + 'save/employeewithidentificationdocument', employeeInformation)
  }

  saveEmployeeDataWithPoliceGoodConductCertificate(employeeInformation: Object) {
    return this.http.put(this.urlRef.url + 'save/employeewithpolicegoodconductcertificate', employeeInformation)
  }

  saveEmployeeDataWithResume(employeeInformation: Object) {
    return this.http.put(this.urlRef.url + 'save/employeewithresume', employeeInformation)
  }

  saveEmployeeDataWithSignedContract(employeeInformation: Object) {
    return this.http.put(this.urlRef.url + 'save/employeewithsignedcontract', employeeInformation)
  }

  saveEmployeeImage(employeeImageInformation: Object) {
    return this.http.post(this.urlRef.url + 'save/employeeImage', employeeImageInformation)
  }

  updateEmployeeImage(employeeImageInformation: Object) {
    return this.http.put(this.urlRef.url + 'update/employeeImage', employeeImageInformation)
  }


  getEmployeeImageByEmployeeId(employeeInformation: Object) {
    return this.http.post(this.urlRef.url + 'getimagesbyemployeeid', employeeInformation)
  }

  updateEmployeeData(selectedEmployee: any) {
    return this.http.put(this.urlRef.url + 'update/employee', selectedEmployee)
  }

  updateEmployeeDataWithImage(selectedEmployee: Object) {
    return this.http.put(this.urlRef.url + 'update/employee/withimages', selectedEmployee)
  }


  deleteEmployeeData(selectedEmployee) {

    return this.http.request('delete', this.urlRef.url + 'delete/employees?employeeIds=' + selectedEmployee);
  }

  getEmployeeById(employeeId) {
    return this.http.get(this.urlRef.url + 'getemployeedatabyid?employeeId=' + employeeId);
  }


  /* Employee Credential API */

  saveEmployeeCredentials(employeeCredentials: Object) {
    return this.http.post(this.urlRef.url + 'save/employeecredentials', employeeCredentials);
  }

  updateEmployeeCredentials(employeeCredentials: Object) {
    return this.http.put(this.urlRef.url + 'update/employeecredential', employeeCredentials);
  }
  updateEmployeePwdCredentials(resetpwd: Object) {
    return this.http.put(this.urlRef.url + 'update/employeeresetpwdcredential', resetpwd);
  }
  getEmployeeCredentialsByEmployeeId(id) {
    return this.http.post(this.urlRef.url + 'getemployeecredentialsbyEmployeeid', { employeeId: id });
  }

  /* Employee Access API */

  saveEmployeeAccess(employeeAccess: Object) {
    return this.http.post(this.urlRef.url + 'save/employeeaccess', employeeAccess);
  }

  updateEmployeeAccess(employeeAccess: Object) {
    return this.http.put(this.urlRef.url + 'update/employeeaccess', employeeAccess);
  }

  getEmployeeAccessByEmployeeId(id) {
    return this.http.post(this.urlRef.url + 'getemployeeaccessdatabyemployeeid', { employeeId: id });
  }

  /* Employee Honor API */

  saveEmployeeHonor(employeeHonor: Object) {
    return this.http.post(this.urlRef.url + 'save/employeehonor', employeeHonor);
  }

  updateEmployeeHonor(employeeHonor: Object) {
    return this.http.put(this.urlRef.url + 'update/employeehonor', employeeHonor);
  }

  getEmployeeHonorByEmployeeId(id) {
    return this.http.post(this.urlRef.url + 'getemployeehonordatabyemployeeid', { employeeId: id });
  }

  /* Employee Education API */

  saveEmployeeEducation(employeeEducation: Object) {
    return this.http.post(this.urlRef.url + 'save/employeeeducation', employeeEducation);
  }

  updateEmployeeEducation(employeeEducation: Object) {
    return this.http.put(this.urlRef.url + 'update/employeeeducation', employeeEducation);
  }

  getEmployeeEducationByEmployeeId(id) {
    return this.http.post(this.urlRef.url + 'getemployeeeducationdatabyemployeeid', { employeeId: id });
  }

  /* Employee Interest API */

  saveEmployeeInterest(employeeInterest: Object) {
    return this.http.post(this.urlRef.url + 'save/employeeinterest', employeeInterest);
  }

  updateEmployeeInterest(employeeInterest: Object) {
    return this.http.put(this.urlRef.url + 'update/employeeinterest', employeeInterest);
  }

  getEmployeeInterestByEmployeeId(id) {
    return this.http.post(this.urlRef.url + 'getemployeeinterestdatabyemployeeid', { employeeId: id });
  }

  /* Employee Pharmacyrole API */

  saveEmployeePharmacyrole(employeePharmacyrole: Object) {
    return this.http.post(this.urlRef.url + 'save/employeepharmacyrole', employeePharmacyrole);
  }

  updateEmployeePharmacyrole(employeePharmacyrole: Object) {
    return this.http.put(this.urlRef.url + 'update/employeepharmacyrole', employeePharmacyrole);
  }

  getEmployeePharmacyroleByEmployeeId(id) {
    return this.http.post(this.urlRef.url + 'getemployeepharmacyroledatabyemployeeid', { employeeId: id });
  }


  /* Employee ProfMembership API */

  saveEmployeeProfMembership(employeeProfMembership: Object) {
    return this.http.post(this.urlRef.url + 'save/employeeprofmembership', employeeProfMembership);
  }

  updateEmployeeProfMembership(employeeProfMembership: Object) {
    return this.http.put(this.urlRef.url + 'update/employeeprofmembership', employeeProfMembership);
  }

  getEmployeeProfMembershipByEmployeeId(id) {
    return this.http.post(this.urlRef.url + 'getemployeeprofmembershipdatabyemployeeid', { employeeId: id });
  }

  /* Employee Publication API */

  saveEmployeePublication(employeePublication: Object) {
    return this.http.post(this.urlRef.url + 'save/employeepublication', employeePublication);
  }

  updateEmployeePublication(employeePublication: Object) {
    return this.http.put(this.urlRef.url + 'update/employeepublication', employeePublication);
  }

  getEmployeePublicationByEmployeeId(id) {
    return this.http.post(this.urlRef.url + 'getemployeepublicationdatabyemployeeid', { employeeId: id });
  }

  /* Employee Salary API */

  saveEmployeeSalary(employeeSalary: Object) {
    return this.http.post(this.urlRef.url + 'save/employeesalary', employeeSalary);
  }

  updateEmployeeSalary(employeeSalary: Object) {
    return this.http.put(this.urlRef.url + 'update/employeesalary', employeeSalary);
  }

  getEmployeeSalaryByEmployeeId(id) {
    return this.http.post(this.urlRef.url + 'getemployeesalarydatabyemployeeid', { employeeId: id });
  }

  /* Employee History API */

  saveEmployeeHistory(employeeHistory: Object) {
    return this.http.post(this.urlRef.url + 'save/employmenthistory', employeeHistory);
  }

  updateEmployeeHistory(employeeHistory: Object) {
    return this.http.put(this.urlRef.url + 'update/employmenthistory', employeeHistory);
  }

  getEmployeeHistoryByEmployeeId(id) {
    return this.http.post(this.urlRef.url + 'getemploymenthistorydatabyemployeeid', { employeeId: id });
  }

  getEmployeesBySearchKey(key) {
    return this.http.get(this.urlRef.url + 'getemployeebyname?name=' + key);
  }
  
  fetchEmpCode(){
     return this.http.get(this.urlRef.url + 'get/uniquecodebyuniquecodename?uniqueCodeName=EM');
  } 
  getEmployeeDataByEmployeeId(employeeId){
    return this.http.get(this.urlRef.url + 'getemployeedatabyid?employeeId='+employeeId);
  }

  // employee Images API
  getEmployeeImageByEmployeeIdAndImageDesc(employeeId,imageDesc){
    return this.http.get(this.urlRef.url + 'getimagesbyemployeeidandimagedesc?employeeId='+employeeId+'&imageDesc='+imageDesc);
  }

  getEmployeeImageById(employeeId){
    return this.http.get(this.urlRef.url + 'getimagesbyemployeeid?employeeId='+employeeId);
  }

}
