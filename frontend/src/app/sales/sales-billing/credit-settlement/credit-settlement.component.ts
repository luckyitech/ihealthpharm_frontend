import { GridOptions, ColDef } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Component, OnInit } from '@angular/core';

import { CreditSettlementService } from './credit-settlement.service';

/**
 * Settles a credit payment across a customer's outstanding bills.
 *
 * Replaces picking bills off by hand: the payment cascades over the open bills
 * oldest first, and nothing is written until the user has seen exactly which
 * bills would be settled and for how much.
 *
 * Three things deliberately stop and ask rather than deciding on their own:
 * debt older than the ageing threshold will not default to oldest-first, money
 * left over once every bill is settled has to be refunded or held explicitly,
 * and a cheque is recorded but not settled until it is approved.
 */
@Component({
  selector: 'app-credit-settlement',
  templateUrl: './credit-settlement.component.html',
  styleUrls: ['./credit-settlement.component.scss']
})
export class CreditSettlementComponent implements OnInit {

  /** Oldest first is the default; the user can settle newest first instead. */
  readonly ORDER_OLDEST = 'OLDEST';
  readonly ORDER_NEWEST = 'NEWEST';

  readonly PAYMENT_TYPE_CHEQUE = 'Cheque';
  readonly paymentTypes: string[] = ['Cash', 'M-Pesa', 'Card', 'Bank Transfer', this.PAYMENT_TYPE_CHEQUE];

  /** What this user may do, answered by the server. */
  access = { canSettle: false, canReverse: false };
  accessLoaded = false;

  /**
   * The account the user picked out of the search box.
   *
   * Picking rather than typing is what makes this unambiguous: a name can
   * belong to several credit accounts, and the server refuses to allocate
   * against an ambiguous name rather than guessing which one was meant.
   */
  selectedAccount: any = undefined;

  /** What the search box currently offers, refreshed as the user types. */
  accountResults: any[] = [];
  searching = false;

  /** Below this a search matches most of the ledger and helps nobody. */
  readonly MIN_SEARCH_LENGTH = 2;

  private searchDebounce: any;

  openBills: any[] = [];
  billsLoaded = false;

  paymentAmount: number;
  allocationOrder: string = this.ORDER_OLDEST;
  paymentType = 'Cash';
  paymentRef = '';
  chequeDate: string;

  plan: any = undefined;

  /**
   * Set when the account has debt past the ageing threshold. The user must pick
   * an order themselves before anything is settled, so an old balance is never
   * cleared just because oldest-first is the default.
   */
  orderConfirmationRequired = false;
  orderConfirmed = false;

  /** REFUND or HOLD_ON_ACCOUNT, needed only when the payment clears every bill. */
  overpaymentAction: string;

  approvalPin = '';
  applying = false;

  // --- Reversing a past settlement -------------------------------------------

  readonly STATUS_ALLOCATED = 'ALLOCATED';
  readonly STATUS_HELD = 'HELD_PENDING_APPROVAL';
  readonly STATUS_REVERSED = 'REVERSED';
  readonly STATUS_FLAGGED = 'REVERSAL_FLAGGED';

  settlements: any[] = [];
  settlementsLoaded = false;

  /** The settlement the user is acting on, if any. */
  actionBatch: any = undefined;

  /** REVERSE or APPROVE_CHEQUE. */
  actionKind = '';

  actionReason = '';
  actionPin = '';

  /**
   * Whether to unwind the settlement now, or only mark it for review.
   *
   * A bounced cheque is sometimes reversed on the spot and sometimes left for
   * whoever handles the account to look at, so both are offered rather than
   * one being assumed.
   */
  reverseAutomatically = true;

  actionInProgress = false;

  constructor(private creditSettlementService: CreditSettlementService,
    private toasterService: ToastrService,
    private spinnerService: Ng4LoadingSpinnerService) {

    this.openBillsGridOptions = <GridOptions>{ context: { componentParent: this } };
    this.openBillsGridOptions.columnDefs = this.openBillsColumnDefs;
    this.openBillsGridOptions.rowSelection = 'single';

    this.planGridOptions = <GridOptions>{ context: { componentParent: this } };
    this.planGridOptions.columnDefs = this.planColumnDefs;
  }

  ngOnInit() {
    this.loadAccess();
    this.loadSettlements();
  }

  private loadAccess() {
    this.creditSettlementService.getAccess().subscribe(res => {
      if (res['responseStatus']['code'] === 200) {
        this.access = res['result'];
      }
      this.accessLoaded = true;
    }, err => {
      this.accessLoaded = true;
      this.showError(err, 'Could not check your permissions');
    });
  }

  // ---------------------------------------------------------------------------
  // Grids
  // ---------------------------------------------------------------------------

  openBillsGridOptions: GridOptions;
  openBillsColumnDefs: ColDef[] = [
    { headerName: 'Bill Code', field: 'billCode', sortable: true, filter: true, resizable: true, width: 160 },
    { headerName: 'Bill Date', field: 'billDate', sortable: true, filter: true, resizable: true, width: 120 },
    {
      headerName: 'Outstanding', field: 'outstanding', sortable: true, filter: true, resizable: true, width: 140,
      type: 'numericColumn', valueFormatter: this.moneyFormatter
    },
    { headerName: 'Status', field: 'currentPaymentStatus', sortable: true, filter: true, resizable: true, width: 140 }
  ];

  planGridOptions: GridOptions;
  planColumnDefs: ColDef[] = [
    { headerName: '#', field: 'sequenceNo', width: 60 },
    { headerName: 'Bill Code', field: 'billCode', sortable: true, resizable: true, width: 160 },
    { headerName: 'Bill Date', field: 'billDate', sortable: true, resizable: true, width: 120 },
    {
      headerName: 'Balance Before', field: 'priorBalance', resizable: true, width: 140,
      type: 'numericColumn', valueFormatter: this.moneyFormatter
    },
    {
      headerName: 'Amount Applied', field: 'amountApplied', resizable: true, width: 140,
      type: 'numericColumn', valueFormatter: this.moneyFormatter
    },
    // Comes from the server already worked out. Subtracting it here would put
    // money arithmetic in the browser, where 11111 - 5997 can render as
    // 5113.999999999; the engine holds every figure to whole cents.
    {
      headerName: 'Balance After', field: 'resultingBalance', resizable: true, width: 140,
      type: 'numericColumn', valueFormatter: this.moneyFormatter,
      cellStyle: function (params) {
        return Number(params.value) === 0 ? { color: '#155724', fontWeight: 'bold' } : null;
      }
    },
    { headerName: 'Status Before', field: 'priorPaymentStatus', resizable: true, width: 140 },
    {
      headerName: 'Status After', field: 'resultingPaymentStatus', resizable: true, width: 140,
      cellStyle: function (params) {
        return params.value === 'Paid' ? { color: '#155724', fontWeight: 'bold' } : null;
      }
    }
  ];

  moneyFormatter(params): string {
    if (params.value === null || params.value === undefined || isNaN(params.value)) {
      return '';
    }
    return Number(params.value).toFixed(2);
  }

  // ---------------------------------------------------------------------------
  // Loading the account
  // ---------------------------------------------------------------------------

  get totalOutstanding(): number {
    return this.openBills.reduce((sum, bill) => sum + Number(bill['outstanding'] || 0), 0);
  }

  get oldestBillDate(): string {
    return this.openBills.length ? this.openBills[0]['billDate'] : '';
  }

  /**
   * Looks up accounts as the user types.
   *
   * Debounced so a fast typist causes one lookup rather than one per letter,
   * and held off entirely until the term is long enough to narrow anything
   * down - the server applies the same floor.
   */
  onAccountSearch(event: any) {
    const term = event && event['term'] ? String(event['term']).trim() : '';

    clearTimeout(this.searchDebounce);

    if (term.length < this.MIN_SEARCH_LENGTH) {
      this.accountResults = [];
      this.searching = false;
      return;
    }

    this.searching = true;
    this.searchDebounce = setTimeout(() => {
      this.creditSettlementService.searchAccounts(term).subscribe(res => {
        this.searching = false;
        if (res['responseStatus']['code'] === 200) {
          this.accountResults = res['result'] || [];
        }
      }, err => {
        this.searching = false;
        this.accountResults = [];
        this.showError(err, 'Could not search accounts');
      });
    }, 250);
  }

  /**
   * Shows every result the server returned, unfiltered.
   *
   * The dropdown would otherwise filter again on the visible label, which is
   * the customer name - so searching by account number would find the account
   * on the server and then hide it on screen.
   */
  keepServerResults = () => true;

  /** Label shown for a result and for the chosen account. */
  accountLabel(account: any): string {
    if (!account) {
      return '';
    }
    return account['masterAccountNo']
      ? account['customerNames'] + ' · ' + account['masterAccountNo']
      : account['customerNames'] + ' · no credit account';
  }

  onAccountSelected() {
    // The bills on screen belong to whoever was selected before.
    this.openBills = [];
    this.billsLoaded = false;
    this.resetPlan();

    if (this.selectedAccount) {
      this.loadOpenBills();
    }
    this.loadSettlements();
  }

  loadOpenBills() {
    if (!this.selectedAccount) {
      this.toasterService.error('Search for the customer or credit account first', 'Nothing to look up',
        { timeOut: 5000 });
      return;
    }

    this.resetPlan();
    this.openBills = [];
    this.billsLoaded = false;
    this.spinnerService.show();

    this.creditSettlementService.getOpenBills(this.buildRequest()).subscribe(res => {
      this.spinnerService.hide();
      if (res['responseStatus']['code'] === 200) {
        this.openBills = res['result'] || [];
        this.billsLoaded = true;

        if (!this.openBills.length) {
          this.toasterService.info('This account has no outstanding bills', '', { timeOut: 5000 });
        }
      }
    }, err => {
      this.spinnerService.hide();
      this.showError(err, 'Could not load outstanding bills');
    });
  }

  // ---------------------------------------------------------------------------
  // Previewing
  // ---------------------------------------------------------------------------

  /** True once there is a plan with lines that could actually be applied. */
  get planIsApplicable(): boolean {
    return !!this.plan && !this.plan['orderConfirmationRequired']
      && this.plan['lines'] && this.plan['lines'].length > 0;
  }

  /** Money left once every outstanding bill has been settled. */
  get unallocatedAmount(): number {
    return this.plan ? Number(this.plan['unallocatedAmount'] || 0) : 0;
  }

  get hasOverpayment(): boolean {
    return this.unallocatedAmount > 0;
  }

  preview() {
    if (!this.validatePayment()) {
      return;
    }

    this.spinnerService.show();

    this.creditSettlementService.preview(this.buildRequest()).subscribe(res => {
      this.spinnerService.hide();
      if (res['responseStatus']['code'] !== 200) {
        return;
      }

      this.plan = res['result'];
      this.orderConfirmationRequired = this.plan['orderConfirmationRequired'];

      if (this.orderConfirmationRequired) {
        // Nothing was planned. The user has to choose the order before the
        // cascade will touch debt this old.
        this.orderConfirmed = false;
        this.toasterService.warning(res['message'], 'Confirm the order', { timeOut: 8000 });
        return;
      }

      if (this.hasOverpayment) {
        this.toasterService.info(
          'This payment clears every outstanding bill. Choose what to do with the remainder.',
          'Overpayment', { timeOut: 8000 });
      }
    }, err => {
      this.spinnerService.hide();
      this.showError(err, 'Could not work out the allocation');
    });
  }

  /**
   * Re-runs the preview with the order the user has explicitly picked.
   *
   * Kept separate from choosing the order in the dropdown so the confirmation
   * is a deliberate act rather than a side effect of changing a field.
   */
  confirmOrderAndPreview() {
    this.orderConfirmed = true;
    this.preview();
  }

  // ---------------------------------------------------------------------------
  // Applying
  // ---------------------------------------------------------------------------

  get isCheque(): boolean {
    return this.paymentType === this.PAYMENT_TYPE_CHEQUE;
  }

  apply() {
    if (!this.planIsApplicable) {
      this.toasterService.error('Preview the allocation before applying it', 'Nothing to apply',
        { timeOut: 5000 });
      return;
    }
    if (this.hasOverpayment && !this.overpaymentAction) {
      this.toasterService.error('Choose whether to refund the remainder or hold it on the account',
        'Overpayment', { timeOut: 5000 });
      return;
    }
    if (!this.approvalPin) {
      this.toasterService.error('Enter your approval PIN', 'PIN required', { timeOut: 5000 });
      return;
    }

    this.applying = true;
    this.spinnerService.show();

    this.creditSettlementService.apply(this.buildRequest()).subscribe(res => {
      this.spinnerService.hide();
      this.applying = false;

      if (res['responseStatus']['code'] !== 200) {
        return;
      }

      // Report what the server says it wrote, not what this screen assumed it
      // would. Deciding from the payment type here told the operator a cheque
      // was held while the server had in fact settled the bills.
      const applied = res['result'] || {};

      if (applied['status'] === this.STATUS_HELD) {
        this.toasterService.success(
          'Recorded as ' + applied['batchRef'] +
          '. The bills stay outstanding until the cheque is approved.',
          'Held pending approval', { timeOut: 8000 });
      } else {
        this.toasterService.success(res['message'], 'Settled ' + (applied['batchRef'] || ''),
          { timeOut: 6000 });
        this.printReceipt(applied['receiptNumber']);
      }

      this.approvalPin = '';
      // Reload from the server rather than adjusting the grid by hand, so what
      // is shown is what was actually written.
      this.loadOpenBills();
      this.loadSettlements();
    }, err => {
      this.spinnerService.hide();
      this.applying = false;
      this.approvalPin = '';
      this.showError(err, 'The settlement was not applied');
    });
  }

  // ---------------------------------------------------------------------------
  // Past settlements
  // ---------------------------------------------------------------------------

  /** Loads recent settlements, narrowed to the selected account when there is one. */
  loadSettlements() {
    const account = this.selectedAccount ? this.selectedAccount['masterAccountNo'] : '';

    this.creditSettlementService.recentSettlements(account).subscribe(res => {
      if (res['responseStatus']['code'] === 200) {
        this.settlements = res['result'] || [];
        this.settlementsLoaded = true;
      }
    }, err => {
      this.settlementsLoaded = true;
      this.showError(err, 'Could not load recent settlements');
    });
  }

  /**
   * True while a settlement is recorded but has not moved any money yet.
   *
   * Only cheques reach this state. What the batch calls its allocated amount is
   * the plan, not the outcome: the bills are untouched and the ledger is empty
   * until the cheque is approved.
   */
  isPending(batch: any): boolean {
    return batch['status'] === this.STATUS_HELD;
  }

  /**
   * True when this settlement left money the customer is owed back.
   *
   * Money held on account looks after itself - it shows up as credit against
   * the customer's next payment. A refund does not: nothing in the system pays
   * money out, so unless it stays on screen here it is forgotten. A reversed
   * settlement owes nothing, since the payment itself was undone.
   */
  owesRefund(batch: any): boolean {
    return batch['overpaymentAction'] === 'REFUND'
      && Number(batch['unallocatedAmount'] || 0) > 0
      && batch['status'] !== this.STATUS_REVERSED;
  }

  /** Only a standing settlement can be reversed; a reversed one cannot go back. */
  canReverseBatch(batch: any): boolean {
    return this.access.canReverse
      && (batch['status'] === this.STATUS_ALLOCATED || batch['status'] === this.STATUS_HELD);
  }

  canApproveBatch(batch: any): boolean {
    return this.access.canSettle && batch['status'] === this.STATUS_HELD;
  }

  startReverse(batch: any) {
    this.actionBatch = batch;
    this.actionKind = 'REVERSE';
    this.actionReason = '';
    this.actionPin = '';
    this.reverseAutomatically = true;
  }

  startApproveCheque(batch: any) {
    this.actionBatch = batch;
    this.actionKind = 'APPROVE_CHEQUE';
    this.actionReason = '';
    this.actionPin = '';
  }

  cancelAction() {
    this.actionBatch = undefined;
    this.actionKind = '';
    this.actionReason = '';
    this.actionPin = '';
  }

  get isReversing(): boolean {
    return this.actionKind === 'REVERSE';
  }

  confirmAction() {
    if (!this.actionPin) {
      this.toasterService.error('Enter your approval PIN', 'PIN required', { timeOut: 5000 });
      return;
    }
    if (this.isReversing && !this.actionReason.trim()) {
      // The server refuses without one; asking here saves a round trip and
      // makes it clear the reason is recorded, not incidental.
      this.toasterService.error('Give a reason for reversing this settlement', 'Reason required',
        { timeOut: 5000 });
      return;
    }

    const action = {
      batchRef: this.actionBatch['batchRef'],
      approvalPin: this.actionPin,
      reason: this.actionReason.trim() || undefined,
      reverseAutomatically: this.reverseAutomatically
    };

    this.actionInProgress = true;
    this.spinnerService.show();

    const call = this.isReversing
      ? this.creditSettlementService.reverse(action)
      : this.creditSettlementService.approveCheque(action);

    call.subscribe(res => {
      this.spinnerService.hide();
      this.actionInProgress = false;

      if (res['responseStatus']['code'] !== 200) {
        return;
      }

      this.toasterService.success(res['message'], '', { timeOut: 6000 });
      if (!this.isReversing) {
        // Approving is the moment the cheque settles, so that is when the
        // customer's receipt is issued.
        this.printReceipt((res['result'] || {})['receiptNumber']);
      }
      this.cancelAction();
      this.loadSettlements();

      // Both actions move money, so whatever bills are on screen are now stale.
      if (this.selectedAccount) {
        this.loadOpenBills();
      }
    }, err => {
      this.spinnerService.hide();
      this.actionInProgress = false;
      this.actionPin = '';
      this.showError(err, this.isReversing ? 'The settlement was not reversed'
        : 'The cheque was not approved');
    });
  }

  // ---------------------------------------------------------------------------
  // Shared
  // ---------------------------------------------------------------------------

  private buildRequest(): any {
    const account = this.selectedAccount || {};

    return {
      // One of these, never both: an account number when the customer has a
      // credit account, otherwise the name. Taken from what was picked rather
      // than from free text, so it always matches a real account.
      masterAccountNo: account['masterAccountNo'] || undefined,
      customerName: account['masterAccountNo'] ? undefined : account['customerNames'],
      paymentAmount: this.paymentAmount,
      allocationOrder: this.allocationOrder,
      orderConfirmed: this.orderConfirmed,
      paymentType: this.paymentType,
      paymentRef: this.paymentRef.trim() || undefined,
      chequeDate: this.isCheque ? this.chequeDate : undefined,
      overpaymentAction: this.overpaymentAction,
      approvalPin: this.approvalPin || undefined
    };
  }

  private validatePayment(): boolean {
    if (!this.paymentAmount || Number(this.paymentAmount) <= 0) {
      this.toasterService.error('Enter the amount paid', 'Amount required', { timeOut: 5000 });
      return false;
    }
    if (this.isCheque && !this.chequeDate) {
      // The receivables update writes this onto the sales bill and fails
      // outright without it.
      this.toasterService.error('Enter the date on the cheque', 'Cheque date required', { timeOut: 5000 });
      return false;
    }
    return true;
  }

  /** Clears the plan whenever the inputs it was built from change. */
  resetPlan() {
    this.plan = undefined;
    this.orderConfirmationRequired = false;
    this.orderConfirmed = false;
    this.overpaymentAction = undefined;
  }

  reset() {
    this.selectedAccount = undefined;
    this.accountResults = [];
    this.paymentAmount = undefined;
    this.allocationOrder = this.ORDER_OLDEST;
    this.paymentType = 'Cash';
    this.paymentRef = '';
    this.chequeDate = undefined;
    this.approvalPin = '';
    this.openBills = [];
    this.billsLoaded = false;
    this.resetPlan();
    this.cancelAction();
    this.loadSettlements();
  }

  /**
   * Prints the customer's receipt for a settlement.
   *
   * The same report the Receipts screen prints after a bulk payment, gathered
   * by the receipt number the settlement issued, so a customer gets the same
   * document whether their payment was ticked off by hand or cascaded here.
   *
   * A failure here is reported but never treated as a failed settlement: the
   * money is already applied by this point, and telling the user otherwise
   * would invite them to enter it a second time.
   */
  /**
   * Prints the customer's statement of what they still owe.
   *
   * Offered beside the account rather than after a payment: it is as often
   * wanted by someone who has come in to ask what they owe as by someone
   * settling.
   */
  printStatement() {
    if (!this.selectedAccount) {
      this.toasterService.error('Search for the customer or credit account first',
        'Nothing to print', { timeOut: 5000 });
      return;
    }

    this.spinnerService.show();
    this.creditSettlementService.downloadStatement(
      this.selectedAccount['masterAccountNo'], this.selectedAccount['customerNames'])
      .subscribe((data: any) => {
        this.spinnerService.hide();
        this.openPdf(data);
      }, err => {
        this.spinnerService.hide();
        this.showError(err, 'The statement could not be printed');
      });
  }

  /** Hands a generated PDF to the browser's printer. */
  private openPdf(data: any) {
    const url = window.URL.createObjectURL(data);
    const frame = document.createElement('iframe');
    frame.style.display = 'none';
    frame.src = url;
    document.body.appendChild(frame);
    frame.onload = () => frame.contentWindow.print();
  }

  private printReceipt(receiptNumber: string) {
    if (!receiptNumber) {
      return;
    }

    this.creditSettlementService.downloadReceipt(receiptNumber).subscribe((data: any) => {
      this.openPdf(data);
    }, () => {
      this.toasterService.warning(
        'The settlement is saved. Print the receipt from Reports if you need it.',
        'Receipt ' + receiptNumber + ' could not be printed', { timeOut: 8000 });
    });
  }

  private showError(err: any, fallback: string) {
    const message = (err && err['error'] && err['error']['message']) ? err['error']['message'] : fallback;
    this.toasterService.error(message, fallback, { timeOut: 8000 });
  }

}
