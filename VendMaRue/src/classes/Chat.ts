export class Chat {
  constructor(
    public id : number,
    public title : string,
    public userid_vendor : number,
    public userid_client : number,
    public date : Date
  ) {
    this.title = title;
    this.id = id;
    this.userid_vendor = userid_vendor;
    this.userid_client = userid_client;
    this.date = date;
  }
}
