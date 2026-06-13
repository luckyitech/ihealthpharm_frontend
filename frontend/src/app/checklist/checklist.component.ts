import { Component, OnInit } from '@angular/core';
import { ChecklistService } from './checklist.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss'],
  providers: [ChecklistService]
})

export class ChecklistComponent implements OnInit {

  pendingCount: number = 0;
  changeCheckListName: any;
  ngOnInit() {
    this.addCheckListInformationForm = new FormGroup(this.addCheckListFormValidations);
  }

  checkListPendingNumber: any;
  viewEditCheckList: false;
  constructor(private checkListService: ChecklistService,
    private datePipe: DatePipe, private toasterService: ToastrService) {
    this.getTitles();
  }

  checkLists: String[];
  status: ['pending', 'In Progress', 'Done'];
  selected = null;
  editCheck = false;
  addCheck = false;
  viewCheck = false;
  TitleCheck = true;
  changedStatus: any;

  viewCheckList() {
    this.viewCheck = true;
    this.editCheck = false;
    this.addCheck = false;
    this.TitleCheck = false;
    this.filteredCheckList();
  }
  cancelEdit() {
    this.viewCheck = false;
    this.editCheck = true;
    this.addCheck = false;
    this.TitleCheck = false;
    this.filteredCheckList();
  }
  cancelView() {
    this.viewCheck = false;
    this.editCheck = false;
    this.addCheck = false;
    this.TitleCheck = true;
    this.getTitles();
  }
  cancelAdd() {
    this.addCheckListInformationForm.reset();
  }


  EditCheckList() {
    this.editCheck = true;
    this.viewCheck = false;
    this.addCheck = false;
    this.TitleCheck = false;
    this.filteredCheckList();
  }
  addCheckList() {
    this.addCheck = true;
    this.viewCheck = false;
    this.editCheck = false;
    this.TitleCheck = false;
  }
  TitleCheckList() {
    this.TitleCheck = true;
    this.viewCheck = false;
    this.editCheck = false;
    this.addCheck = false;
    this.getTitles();
  }

  getCheckList() {
    this.checkListService.getCheckListItems().subscribe(
      data => {
        this.checkLists = data['result'];
      },
      (err: HttpErrorResponse) => {
        this.toasterService.error('Please Contact Administrator', 'Error Occurred', {
          timeOut: 5000
        })
      }
    );
  }

  editStatus(event, checkListId) {
    this.changedStatus = event['target']['value'];
    for (var i = 0; i < this.checkLists.length; i++) {
      if (this.checkLists[i]['checkListId'] == checkListId) {
        this.checkLists[i]['status'] = this.changedStatus;
        if (this.checkLists[i]['status'] == 'Done') {
          this.checkLists[i]['doneDateTS'] = Date.now();
        }
      }
    }
  }

  changeTitle: any;
  changesInCheckListName(event, checkListId) {
    this.changeCheckListName = event['target']['value'];
    for (var i = 0; i < this.checkLists.length; i++) {
      if (this.checkLists[i]['checkListId'] == checkListId) {
        this.checkLists[i]['checkListName'] = this.changeCheckListName;
      }
    }
  }

  onSubmit() {
    let payload = this.checkLists;
    this.checkListService.saveCheckList(payload).subscribe(
      res => {
        if (res instanceof Object) {
          if (res['responseStatus']['code'] === 200) {
            this.editCheck = true;
            this.filteredCheckList();
            this.toasterService.success(res['message'], 'Success', {
              timeOut: 3000
            })
          }
        }
      })
  }

  checkFormDisability() {
    return (this.addCheckListInformationForm.get('sno').errors instanceof Object)
      || (this.addCheckListInformationForm.get('title').errors instanceof Object)
      || (this.addCheckListInformationForm.get('checkListName').errors instanceof Object)
      || (this.addCheckListInformationForm.get('assignedBy').errors instanceof Object)
      || (this.addCheckListInformationForm.get('assignedTo').errors instanceof Object)
      || (this.addCheckListInformationForm.get('assignedDate').errors instanceof Object)
      || (this.addCheckListInformationForm.get('targetDate').errors instanceof Object)
      || (this.addCheckListInformationForm.get('targetTime').errors instanceof Object)
      || (this.addCheckListInformationForm.get('doneBy').errors instanceof Object)

  }

  selectedStatus: any;
  statusDropDown = [{ name: 'pending' }, { name: 'In Progress' }, { name: 'Done' }];

  onChangeStatus(event) {
    this.selectedStatus = event['name'];
  }


  addCheckListInformationForm: FormGroup;

  addCheckListFormValidations = {
    sno: new FormControl('', [Validators.required]),
    title: new FormControl('', [Validators.required]),
    checkListName: new FormControl('', [Validators.required]),
    assignedBy: new FormControl('', [Validators.required]),
    assignedTo: new FormControl('', [Validators.required]),
    assignedDate: new FormControl('', [Validators.required]),
    targetDate: new FormControl('', [Validators.required]),
    targetTime: new FormControl('', [Validators.required]),
    doneBy: new FormControl('', [Validators.required]),

  }

  onSave() {
    let payload = Object.assign({}, this.addCheckListInformationForm.value);
    payload['status'] = this.selectedStatus;
    payload['targetTime'] = this.addCheckListInformationForm.get('targetTime').value;

    this.checkListService.addCheckListService(payload).subscribe(res => {
      if (res instanceof Object) {
        if (res['responseStatus']['code'] === 200) {
          this.getCheckList();
          this.addCheckListInformationForm.reset();
          this.toasterService.success(res['message'], 'Success', {
            timeOut: 3000
          });
        }
      }
    })

  }

  titles: any;
  titleSelected: any;

  getTitles() {
    this.checkListService.getOnlyTitles().subscribe(
      res => {
        this.titles = res['result'];
      }
    )
  }
  filteredCheckList() {
    this.checkListService.getFilteredCheckLists(this.titleSelected).subscribe(
      res => {
        if (res['responseStatus']['code'] === 200) {
          this.checkLists = res['result'];
        }
      },
      (err: HttpErrorResponse) => {
        this.toasterService.error('Please Contact Administrator', 'Error Occurred', {
          timeOut: 5000
        })
      }
    )
  }
  showView = false;
  selectedTitle(event) {
    this.titleSelected = event['target']['value'];
    this.showView = true;
  }
}
