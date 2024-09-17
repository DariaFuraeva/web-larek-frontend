import {Component} from "../base/Component";
import {cloneTemplate, createElement, ensureElement, /*formatNumber*/} from "../../utils/utils";
import {EventEmitter} from "../base/events";
import {ICard} from '../../types/types';

interface IBasketView {
    backetItems: HTMLElement[];
    total: number;
}

export class BasketView extends Component<IBasketView> {
    protected _backetItems: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);
        this._backetItems = ensureElement<HTMLElement>('.basket__list', container);
        this._total = container.querySelector('.basket__price');
        this._button = container.querySelector('.basket__button');

        if (this._button) {
            this._button.addEventListener('click', () => {
              events.emit('basket:openOrder');
            });
        }

        // this.backetItems = [];
    }

    set backetItems(items: HTMLElement[]) {
        if (items.length) {
            this._backetItems.replaceChildren(...items);
            this._button.disabled = false;
        } else {
            this._backetItems.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
            this._button.disabled = true;
        }
    }

    set selected(items: string[]) {
        if (items.length) {
            this.setDisabled(this._button, false);
        } else {
            this.setDisabled(this._button, true);
        }
    }

    set total(total: number) {
        this.setText(this._total, total + ' синапсов');
    }

    uptateIndex() {
        Array.from(this._backetItems.children).forEach(
          (item, index) => (item.querySelector(`.basket__item-index`)!.textContent = (index + 1).toString())
        );
      }
}

// Карточка товара в корзине
export interface ICardBasket extends ICard {
    id: string;
    index: number;
}

  export class CardInBasket extends Component<ICardBasket> {
    protected _index: HTMLElement;
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor( container: HTMLElement, events?: {onClick: (event: MouseEvent) => void;}
    ){
      super(container);

      this._title = container.querySelector('.card__title');
      this._index = container.querySelector('.basket__item-index');
      this._price = container.querySelector('.card__price');
      this._button = container.querySelector('.basket__item-delete');

      if (this._button) {
        this._button.addEventListener('click', (evt) => {
          this.container.remove();
          events?.onClick(evt);
        });
      }
    }

    set title(value: string) {
      this._title.textContent = value;
    }

    set index(value: number) {
      this._index.textContent = value.toString();
    }

    set price(value: number) {
      this._price.textContent = value.toString() + ' синапсов';
    }
  }
