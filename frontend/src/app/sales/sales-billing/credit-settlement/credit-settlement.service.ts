import { Environment } from 'src/app/core/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/**
 * Calls for the credit settlement tab.
 *
 * The auth token is attached by the global interceptor, so nothing here sets
 * headers of its own.
 */
@Injectable({
  providedIn: 'root'
})
export class CreditSettlementService {

  constructor(private http: HttpClient) { }
  urlRef = new Environment();

  /**
   * What the signed-in user is allowed to do here.
   *
   * Asked of the server rather than read out of the permissions array: that
   * array carries each permission as a bare id with no name, and a user who
   * has not been granted every permission gets a shorter array in which a
   * fixed position points at the wrong entry.
   */
  /**
   * The printed receipt for a settlement.
   *
   * The same ACCOUNT_RECEIVABLES_RECEIPT report the Receipts screen prints,
   * gathered by the receipt number stamped on every bill the payment touched,
   * so a customer gets the same document either way. No Authorization header
   * is set here on purpose - the global interceptor attaches the real token,
   * and the copy of this call on the Receipts screen sets a broken literal one
   * that only works because the interceptor overrides it.
   */
  public downloadReceipt(receiptNumber: string) {
    const inputJson = encodeURI(JSON.stringify({
      ReportCode: 'ACCOUNT_RECEIVABLES_RECEIPT',
      UNIQUE_RECEIPT_NO: receiptNumber
    }));
    return this.http.get(this.urlRef.url + 'reports/generateReportPdf?inputJson=' + inputJson,
      { responseType: 'blob' as 'json' });
  }

  public getAccess() {
    return this.http.get(this.urlRef.url + 'creditAllocation/access');
  }

  /**
   * Credit accounts matching what the user is typing.
   *
   * Searches account numbers and customer names together, so a pharmacist who
   * knows the person but not the account code can still find them.
   */
  public searchAccounts(term: string) {
    return this.http.get(this.urlRef.url + 'creditAllocation/searchAccounts',
      { params: { term: term } });
  }

  /** The outstanding bills a payment could be applied to. */
  public getOpenBills(request: any) {
    return this.http.post(this.urlRef.url + 'creditAllocation/openBills', request);
  }

  /** What the payment would settle, without settling it. */
  public preview(request: any) {
    return this.http.post(this.urlRef.url + 'creditAllocation/preview', request);
  }

  /** Settles the bills. Needs the approval PIN, which the server checks. */
  public apply(request: any) {
    return this.http.post(this.urlRef.url + 'creditAllocation/apply', request);
  }

  /** Recent settlements, newest first. Blank account means all accounts. */
  public recentSettlements(masterAccountNo: string) {
    return this.http.get(this.urlRef.url + 'creditAllocation/recentSettlements',
      { params: { masterAccountNo: masterAccountNo || '' } });
  }

  /** Settles a cheque batch that was held until the cheque cleared. */
  public approveCheque(action: any) {
    return this.http.post(this.urlRef.url + 'creditAllocation/approveCheque', action);
  }

  /**
   * Unwinds a settlement, or only flags it for review.
   *
   * Send reverseAutomatically false to leave it standing and just mark it, so
   * a bounced cheque can wait for someone to look at it.
   */
  public reverse(action: any) {
    return this.http.post(this.urlRef.url + 'creditAllocation/reverse', action);
  }

}
