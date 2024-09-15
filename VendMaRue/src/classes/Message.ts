export class Message {
  constructor(
    public id : number,
    public contenu : string,
    public userid : number,
    public conversation_id : number,
    public date : Date
  ) {
    this.contenu = contenu;
    this.id = id;
    this.userid = userid;
    this.conversation_id = conversation_id;
    this.date = date;
  }
}
