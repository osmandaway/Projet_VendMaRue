export class Card {
  constructor(
    public id : number,
    public title : string,
    public userid : number,
    public photo: string,
    public brand: string,
    public price: number,
    public OnSale: number,
    public likes: number,
    public quantity: number,
    public date : Date,
    public loc : string,
    public text ?: string,
  ) {
    this.photo = photo;
    this.title = title;
    this.brand = brand;
    this.price = price;
    this.text = text;
    this.OnSale = OnSale;
    this.id = id;
    this.userid = userid;
    this.likes = likes;
    this.quantity = quantity;
    this.date=date;
    this.loc=loc;
  }
}
