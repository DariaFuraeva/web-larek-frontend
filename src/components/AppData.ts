// import _ from "lodash";
// import {dayjs, formatNumber} from "../utils/utils";

import {Model} from "./base/Model";
import { IOrder, ICard, IOrderForm, IBasketData, ICardsData,TPaymentMethod, IAppState, FormErrors, TCategory} from "../types/types";

export type CatalogChangeEvent = {
    catalog: Card[]
};

export class Card extends Model<ICard> {
    description: string;
    id: string;
    image: string;
    title: string;
    price: number;
    category: TCategory;
}

export class AppState extends Model<IAppState> {
    preview: string | null;
    order: IOrder = {
        items: [],
        email: '',
        payment: '',
        address: '',
        phone: '',
        total: null
    };
    catalog: Card[];
    basket: Card[]=[];

    formErrors: FormErrors = {};

    // toggleOrderedLot(id: string, isIncluded: boolean) {
    //     if (isIncluded) {
    //         this.order.items = _.uniq([...this.order.items, id]);
    //     } else {
    //         this.order.items = _.without(this.order.items, id);
    //     }
    // }

    // clearBasket() {
    //     this.order.items.forEach(id => {
    //         this.toggleOrderedLot(id, false);
    //         this.catalog.find(it => it.id === id).clearBid();
    //     });
    // }

    // getTotal() {
    //     return this.order.items.reduce((a, c) => a + this.catalog.find(it => it.id === c).price, 0)
    // }


    setCatalog(items: ICard[]) {
        this.catalog = items.map(item => new Card(item, this.events));
        this.emitChanges('items:changed', { catalog: this.catalog });
    }

    setPreview(item: ICard) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }

    addToBasket(item: Card) {
        this.basket.push(item);
        //this.emitChanges('card:addToBasket', { basket: this.basket });
        console.log(this.basket);
      }

    removeFromBasket(id: string) {
        this.basket = this.basket.filter(item => item.id !== id);
      }


    getTotal() {
        return this.basket.reduce((a, c) => a + c.price, 0);
      }

    clearBasket() {
        this.basket = [];
        console.log ('Это корзина после очистки', this.basket)
      }

    getQuantityCardsInBasket () {
        return this.basket.length;
        console.log (this.basket.length);
    }


//     getActiveLots(): LotItem[] {
//         return this.catalog
//             .filter(item => item.status === 'active' && item.isParticipate);
//     }

//     getClosedLots(): LotItem[] {
//         return this.catalog
//             .filter(item => item.status === 'closed' && item.isMyBid)
//     }

    // setOrderField(field: keyof IOrder, value: string) {
    //     this.order[field] = value;

    //     if (this.validateOrder()) {
    //         this.events.emit('order:ready', this.order);
    //     }
    // }

    /*validateOrder() {
        const errors: typeof this.formErrors = {};
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }*/

        setOrderedItems() {
            this.order.items = this.basket.map(item => item.id)
          }


        setOrderField(field: keyof IOrderForm, value: string) {
            this.order[field] = value;

            if (this.validateOrder()) {
                this.events.emit('order:ready', this.order);
              }

            if (this.validateContacts()) {
              this.events.emit('contacts:ready', this.order)
            }
          }

        createOrder(){
            this.order = {
              items: [],
              total: 0,
              payment: '',
              address: '',
              email: '',
              phone: '',
            };
        }

        validateOrder() {
            const errors: typeof this.formErrors = {};
            if (!this.order.address) {
              errors.address = 'Необходимо указать адрес';
            }
            if (!this.order.payment) {
              errors.payment = 'Необходимо указать способ оплаты';
            }
            this.formErrors = errors;
            this.events.emit('orderFormErrors:change', this.formErrors);
            return Object.keys(errors).length === 0;
        }

        validateContacts() {
            const errors: typeof this.formErrors = {};
            if (!this.order.email) {
              errors.email = 'Необходимо указать email';
            }
            if (!this.order.phone) {
              errors.phone = 'Необходимо указать телефон';
            }
            this.formErrors = errors;
            this.events.emit('contactsFormErrors:change', this.formErrors);
            return Object.keys(errors).length === 0;
        }


 }
