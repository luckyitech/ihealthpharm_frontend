export class UserHistoryModel {

  public userModel: any
  public module: String
  public screenName: String
  public action: String
  public createdUser: any
  public lastUpdateUser: any

  constructor(module, screenName, action) {
    this.userModel = { employeeId: localStorage.getItem('id') }
    this.screenName = screenName
    this.module = module
    this.action = action
    this.createdUser = localStorage.getItem('id')
    this.lastUpdateUser = localStorage.getItem('id')
  }

}
