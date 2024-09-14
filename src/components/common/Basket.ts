import {Component} from "../base/Component";
import {cloneTemplate, createElement, ensureElement, /*formatNumber*/} from "../../utils/utils";
import {EventEmitter} from "../base/events";
import {ICard} from '../../types/types';

interface IBasketView {
    backetItems: HTMLElement[];
    total: number;
}

export class BasketView extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', container);
        this._total = container.querySelector('.basket__price');
        this._button = container.querySelector('.basket__button');

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('order:open');
            });
        }

        this.backetItems = [];
    }

    set list(items: HTMLElement[]) {
        this._list.replaceChildren(...items);
        this._button.disabled = items.length ? false : true;
      }

    set backetItems(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
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
        this.setText(this._total, total);
    }
    refreshIndices() {
        Array.from(this._list.children).forEach(
          (item, index) =>
          (item.querySelector(`.basket__item-index`)!.textContent = (
            index + 1
          ).toString())
        );
      }
}

export interface ICardBasket extends ICard {
    id: string;
    index: number;
}

export interface IStoreItemBasketActions {
    onClick: (event: MouseEvent) => void;
}

  export class StoreItemBasket extends Component<ICardBasket> {
    protected _index: HTMLElement;
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(
      protected blockName: string,
      container: HTMLElement,
      actions?: IStoreItemBasketActions
    ) {
      super(container);

      this._title = container.querySelector(`.${blockName}__title`);
      this._index = container.querySelector(`.basket__item-index`);
      this._price = container.querySelector(`.${blockName}__price`);
      this._button = container.querySelector(`.${blockName}__button`);

      if (this._button) {
        this._button.addEventListener('click', (evt) => {
          this.container.remove();
          actions?.onClick(evt);
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
