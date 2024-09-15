export class User {
  constructor(
    public id : number,
    public user_pp: string,
    public user_name: string,
    public user_surname: string,
    public user_email: string,
    public user_phone: number,
    public user_acc_date : Date,
    public user_loc : string,
    public user_pwd : string,
    public user_desc ?: string,
  ) {
    this.id=id;
    this.user_pwd=user_pwd;
    this.user_pp=user_pp;
    this.user_name=user_name;
    this.user_surname=user_surname;
    this.user_email=user_email;
    this.user_phone=user_phone;
    this.user_acc_date=user_acc_date;
    this.user_loc=user_loc;
    this.user_desc=user_desc;
  }
}
