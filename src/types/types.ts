// export interface ICard {
//   id: string;
//   title: string;
//   description: string;
//   price: number;
//   category: TCategory;
//   image: string;
//   inBasket: boolean;
// }
export interface ICard {
  id: string;
  title: string;
  description: string;
  price: number;
  category: TCategory;
  image: string;
}

export interface IOrder {
  //payment: TPaymentMethod;
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

export interface IOrderForm {
  //payment: TPaymentMethod;
  payment: string;
  address: string;
  email: string;
  phone: string;
}

export interface ICardsData {
	cards: ICard[];
  preview: string;
  getCard(cardId: string): ICard;
}

export interface IBasketData {
  cards: ICard[];
  total: number;
  addCard(card: ICard): void;
	deleteCard(cardId: string): void;
}

export interface IAppState {
  catalog: ICard[];
  basket: ICard[];
  preview: string | null;
  order: IOrderForm | null;
}

export type TOrderInfo = Pick<ICard, 'title' | 'price'>;

export type TCategory = 'другое'|'софт-скил'|'дополнительное'|'кнопка'|'хард-скил';

export type TPaymentMethod = 'онлайн' | 'при получении'

export type FormErrors = Partial<Record<keyof IOrderForm, string>>;

export type cardCategory = {
  [Key in TCategory]: string;
};
