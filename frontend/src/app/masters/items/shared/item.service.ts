import { Environment } from './../../../core/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private http: HttpClient) { }

  urlRef = new Environment();

  public saveItem(itemData: any) {
    return this.http.post(this.urlRef.url + 'item/save/item', itemData);
  }

  public updateItem(itemData: any) {
    return this.http.put(this.urlRef.url + 'item/update/item', itemData);
  }

  public getItems() {
    return this.http.get(this.urlRef.url + 'item/getallitemsdata');
  }

  public getLimitedItems() {
    return this.http.get(this.urlRef.url + 'item/getlimiteditemdata');
  }

  public deleteItem(itemId: any) {
    return this.http.delete(this.urlRef.url + 'item/' + itemId + '/delete');
  }

  public getItemCategories() {
    return this.http.get(this.urlRef.url + 'getallitemcategories');
  }

  public getItemCategoriesMapWithItems() {
    return this.http.get(this.urlRef.url + 'getallitemcategories/mapwith/items');
  }

  public getItemCategoryById(itemCategoryId) {
    return this.http.get(this.urlRef.url + 'getitemcategorydatabyid?itemCategoryId=' + itemCategoryId);
  }

  public updateItemCategory(itemCategory) {
    return this.http.put(this.urlRef.url + 'update/itemcategory', itemCategory);
  }

  //this search for grid based on id
  public getItemBasedOnItemId(itemId) {
    return this.http.get(this.urlRef.url + 'item/getitemdatabyid?itemId=' + itemId);
  }

  //thesee urlddd
  public getIssueUOMS() {
    return this.http.get(this.urlRef.url + 'uom/findAll/measurements');
  }

  public getPurchaseUOMS() {
    return this.http.get(this.urlRef.url + 'uom/findAll/measurements');
  }

  public getItemGroups() {
    return this.http.get(this.urlRef.url + 'getallitemgroupdata');
  }

  public getItemForms() {
    return this.http.get(this.urlRef.url + 'getallitemforms');
  }

  public getItemFormsBySearch(medicalOrNonMedical, formCodeSearchTerm) {
    return this.http.get(`${this.urlRef.url}getitemformsbysearch?medicalOrNonMedical=${medicalOrNonMedical}&&searchTerm=${formCodeSearchTerm}`);
  }
  public getItemFormById(itemformId) {
    return this.http.get(this.urlRef.url + 'geitemformdatabyid?itemformIds=' + itemformId);
  }

  public getSpecializationBySearch(specializationSearchTerm) {
    return this.http.get(this.urlRef.url + 'getallspecializationsbysearch?searchTerm=' + specializationSearchTerm);

  }

  //url same becoz getting data from same table
  public getAllIssueUOMBBySearch(issueCodeSearchTerm) {
    return this.http.get(this.urlRef.url + 'getallunitsdatabysearch?searchTerm=' + issueCodeSearchTerm);
  }

  public getAllPurchaseUOMBBySearch(purchaseSearchTerm) {
    return this.http.get(this.urlRef.url + 'getallunitsdatabysearch?searchTerm=' + purchaseSearchTerm);
  }

  public getAllManufacturersBySearch(manufacturerSearchTerm) {
    return this.http.get(this.urlRef.url + 'getallmanufacturersdatabysearch?searchTerm=' + manufacturerSearchTerm);
  }

  public getAllItemCategoriesBySearch(medicalOrNonMedical, itemCategorySearchTerm) {
    return this.http.get(`${this.urlRef.url}getallitemcategoriesdata?medicalOrNonMedical=${medicalOrNonMedical}&&searchTerm=${itemCategorySearchTerm}`);
  }

  public getSpecializations() {
    return this.http.get(this.urlRef.url + 'getallspecializationdata');
  }

  public getItemGenericaNames() {
    return this.http.get(this.urlRef.url + 'getallitemgenericsdata');
  }

  public saveItemGenericaNames(genericNames) {
    return this.http.post(this.urlRef.url + 'save/itemgeneric', genericNames);
  }

  public getItemGenericaNameById(genericId) {
    return this.http.get(this.urlRef.url + 'getitemgenericdatabyid?itemGenericId=' + genericId);
  }

  public updateItemGenericaName(genericName) {
    return this.http.put(this.urlRef.url + 'update/itemgeneric', genericName);

  }

  public getManufacturers() {
    return this.http.get(this.urlRef.url + 'getactivemanufacturersdata/foritem');
  }

  public updateItemMultiple(items: any) {
    return this.http.put(this.urlRef.url + 'item/update/items', items);
  }
  public deleteItems(itemIds: any) {
    return this.http.request('delete', this.urlRef.url + 'item/delete/items?itemIds=', itemIds);
  }

  public saveItemCategory(itemData: any) {
    return this.http.post(this.urlRef.url + 'save/itemcategory', itemData);
  }

  public saveItemForm(itemData: any) {
    return this.http.post(this.urlRef.url + 'save/itemform', itemData);
  }

  public updateItemForm(itemData: any) {
    return this.http.put(this.urlRef.url + 'update/itemform', itemData);
  }

  public saveItemGroup(itemGroupData: any) {
    return this.http.post(this.urlRef.url + 'save/itemgroup', itemGroupData);
  }

  public saveSpecialization(itemData: any) {
    return this.http.post(this.urlRef.url + 'save/specialization', itemData);
  }

  //item search based on searchTerms

  public getAllItemDataByItemNameSearch(searchTerm: string) {
    return this.http.get(`${this.urlRef.url}item/getallby/ItemNameSearch?searchTerm=${searchTerm}`);
  }

  public getAllItemDescDataByItemDesc(searchTerm: string) {
    return this.http.get(`${this.urlRef.url}item/getallby/ItemDescriptionSearch?searchTerm=${searchTerm}`);
  }

  getAllItemsByGroupCodeSearch(searchTerm: string) {
    return this.http.get(`${this.urlRef.url}item/getallby/groupcodeSearch?searchTerm=${searchTerm}`);
  }

  getAllItemsByGenericNameSearch(searchTerm: string) {
    return this.http.get(`${this.urlRef.url}item/getallby/genericnameSearch?searchTerm=${searchTerm}`);
  }

  public getItemSpecialization() {
    return this.http.get(`${this.urlRef.url}getallspecializationdata`);
  }

  public getAllItemGroupsData(medicalOrNonMedical: string, searchTerm: string) {
    return this.http.get(`${this.urlRef.url}getallitemgroupsdata?medicalOrNonMedical=${medicalOrNonMedical}&&searchTerm=${searchTerm}`)
  }

  public getAllItemGenericNamesdata(medicalOrNonMedical: string, searchTerm: string, itemGroupId: number) {
    return this.http.get(`${this.urlRef.url}getallitemgenericnamesdata?medicalOrNonMedical=${medicalOrNonMedical}&&searchTerm=${searchTerm}&&itemGroupId=${itemGroupId}`);
  }

  public updateSpecialization(updatedata: any) {
    return this.http.put(this.urlRef.url + 'update/specialization', updatedata);
  }

  deleteSpecializations(specializationIds: any) {
    return this.http.request('delete', this.urlRef.url + "delete/specializations?specializationIds=" + specializationIds);
  }

  public updateItemGroup(updatedata: any) {
    return this.http.put(this.urlRef.url + 'update/itemgroup', updatedata);
  }

  deleteItemGroup(itemGroupIds: any) {
    return this.http.request('delete', this.urlRef.url + "delete/itemgroups?itemGroupIds=" + itemGroupIds);
  }

  getSpecializationById(id: any) {
    return this.http.get(this.urlRef.url + 'getspecializationdatabyid?specializationId=' + id);
  }

  getItemGroupById(id: any) {
    return this.http.get(this.urlRef.url + 'getitemgroupdatabyid?itemGroupId=' + id);
  }

  public saveitemUOM(itemUOMData: any) {
    return this.http.post(this.urlRef.url + 'uom/save', itemUOMData);
  }

  public updateItemUOM(updatedata: any) {
    return this.http.put(this.urlRef.url + 'uom/update', updatedata);
  }

  getUOMById(id: any) {
    return this.http.get(this.urlRef.url + 'uom/find/by/id?id=' + id);
  }

  getAllItemUOMs() {
    return this.http.get(this.urlRef.url + 'uom/findAll/measurements');
  }

  deleteItemUOMs(ids: any) {
    return this.http.get(this.urlRef.url + "uom/delete/ids?ids=" + ids);
  }

  saveAlternativeItems(formdata) {
    return this.http.post(this.urlRef.url + "save/itemalternative", formdata);
  }

  getAlternativeItemsBasedonItem(selectedItem: any) {
    return this.http.post(this.urlRef.url + "getitemalternativedatabyitemid", selectedItem);
  }

  updateItemAlternativeBasedOnItem(formdata) {
    return this.http.put(this.urlRef.url + "updateItemAlternativebasedonItem", formdata);
  }

  getItemsFormulationForItems() {
    return this.http.get(this.urlRef.url + 'item/getallitemsdata')
  }

  getItemsbySearchKey(key) {
    return this.http.get(this.urlRef.url + 'item/getallby/searchkey?searchTerm=' + key)
  }
  getItemsbySearchKeyAndCode(key, code, start, end) {
    return this.http.get(this.urlRef.url + 'item/getallby/searchkeyandsearchcode?searchTerm=' + key + '&searchCode=' + code + '&start=' + start + '&end=' + end);
  }

  getItemsCountBySearch(key, type) {
    return this.http.get(this.urlRef.url + 'item/getitemscountbysearch?searchTerm=' + key + '&searchType=' + type)
  }

  deleteRowData(selectedPharmacys: number[]) {
    return this.http.request('delete', this.urlRef.url + 'delete/formulation' + selectedPharmacys.join());
  }
  saveFormChanges(formulationInformation: Object) {
    return this.http.post(this.urlRef.url + 'save/formulation', formulationInformation)
  }

  getRowDataFromServer() {
    return this.http.get(this.urlRef.url + 'getallformulationinstructions');
  }

  updateFormulation(formulationInformation: Object) {
    return this.http.put(this.urlRef.url + 'update/formulation', formulationInformation)
  }


  //latin and schedule codes

  getLatinCodes() {
    return this.http.get(this.urlRef.url + 'getAll/latincodes/withDesc')
  }

  /*  getConcatenateCodes(){
   return this.http.get(this.urlRef.url + 'getconcatenatecode')
 } */

  getScheduleCodes() {
    return this.http.get(this.urlRef.url + 'getall/schedulecodes/withDesc')
  }

  getItemsByItemName(key) {
    return this.http.get(this.urlRef.url + 'item/getitemsdatabyname?key=' + key)
  }

  getItemsByLimit(start, end) {
    return this.http.get(this.urlRef.url + 'item/getitemdatabylimit?start=' + start + '&end=' + end);
  }

  getManufacturersByLimit(start,end){
    return this.http.get(this.urlRef.url + 'getall/manufacturersdatabylimit/foritem?start=' + start + '&end=' + end);
  }

  getManufacturersByNameSearch(name :string){
     return this.http.get(this.urlRef.url +'getall/manufacturers/bynamesearch?name='+name);
  }

  getRowDataFromServerofSuppliers() {
    return this.http.get(this.urlRef.url + 'getallsuppliersdata/foritemsuppliers');
  }

  
  getAllActiveSTaxes() {
    return this.http.get(this.urlRef.url + 'getall/taxcategories/basedOnActive')
  }

}
