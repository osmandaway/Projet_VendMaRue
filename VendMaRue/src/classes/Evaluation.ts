export class Evaluation {
    constructor(
        public id: number,
        public user_id: number,
        public card_id: number,
        public rate: number,
    ) {
        this.id = id;
        this.user_id = user_id;
        this.card_id = card_id;
        this.rate = rate;
    }
}
