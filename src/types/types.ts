export interface ICard {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export interface ICustomer {
  payment: 'online' | 'cash-on-delivery';
  email: string;
  phone: string;
  address: string;
  total: number;
  items: ICard[];
}

export interface ICardsData {
	cards: ICard[];
  preview: string;
  getCard(cardId: string): ICard;
}

export interface IBasket {
  cards: ICard[];
  total: number;
  addCard(card: ICard): void;
	deleteCard(cardId: string): void;
}

export type TOrderInfo = Pick<ICard, 'title' | 'price'>;

