import {Component} from "./base/Component";
// import {ILot, LotStatus} from "../types";
import {bem, createElement, ensureElement, /*formatNumber*/} from "../utils/utils";
import { CDN_URL } from '../utils/constants';
// import clsx from "clsx";
import {TCategory, ICard} from "../types/types"

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

const cardsCategories = {
    'софт-скил': 'card__category_soft',
    'хард-скил': 'card__category_hard',
    'другое': 'card__category_other',
    'дополнительное': 'card__category_additional',
    'кнопка': 'card__category_button'
  };

export class Card<T> extends Component<ICard> {
    protected _title: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _description?: HTMLElement;
    protected _button?: HTMLButtonElement;
    protected _category: HTMLElement;
    protected _price: HTMLElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._image = ensureElement<HTMLImageElement>(`.${blockName}__image`, container);
        this._button = container.querySelector(`.${blockName}__button`);
        this._description = container.querySelector(`.${blockName}__description`);
        this._category = container.querySelector(`.${blockName}__category`);
        this._price = container.querySelector(`.${blockName}__price`);

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id(): string {
        return this.container.dataset.id || '';
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set price(value: number | null) {
        // if (this._price != null) {
        //     this.setText(this._price, value + ' синапсов')
        //     console.log('Нормальная карточка', this._price.textContent)
        // } else { if (this._price = null) {

        //     this.setText(this._price, 'Бесценно')
        //     console.log('Бесценная карточка', this._price.textContent)
        // }}

        this._price.textContent = value
          ? value + ' синапсов'
          : 'Бесценно';

        if (this._button && !value) {
          this._button.disabled = true;
        }
      }

    get title(): string {
        return this._title.textContent || '';
    }
    // set image(value: string) {
    //     this.setImage(this._image, value, this.title)
    // }
    set image(value: string) {
        this._image.src = CDN_URL + value;
    }

    set description(value: string | string[]) {
        if (Array.isArray(value)) {
            this._description.replaceWith(...value.map(str => {
                const descTemplate = this._description.cloneNode() as HTMLElement;
                this.setText(descTemplate, str);
                return descTemplate;
            }));
        } else {
            this.setText(this._description, value);
        }
    }
    set category(value: TCategory) {
        this._category.textContent = value;
        // this._category.classList.add(`card__category_${value}`);
        this._category.classList.remove('card__category_other');
        this._category.classList.add(cardsCategories[value])
      }
}


// export type CatalogItemStatus = {
//     status: LotStatus,
//     label: string
// };

export class CardsCatalog extends Card<ICard> {
    // protected _status: HTMLElement;
    _cards: ICard[];
    // id карточки, выбранной для просмотра в модальной окне
    _preview: string;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super('card', container, actions);
    }

    // getCard(cardId: string): ICard | undefined {
    //     return  this.catalog
    // }
}

export class CardPreviewItem extends Card<ICard> {
    protected _description: HTMLElement;
    protected _button?: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super('card', container, actions);
        this._description = container.querySelector(`.${this.blockName}__text`);
        this._button = container.querySelector(`.${this.blockName}__button`);
      }

      set description(text: string) {
        this._description.textContent = text;
      }

      buttonSwitch(flag: boolean){
        this._button.disabled = flag;
      }
}

export class CatalogItem extends Card<ICard> {
    constructor(container: HTMLElement, actions?: ICardActions) {
      super('card', container, actions);
    }
  }

// export class AuctionItem extends Card<HTMLElement> {
//     protected _status: HTMLElement;

//     constructor(container: HTMLElement, actions?: ICardActions) {
//         super('lot', container, actions);
//         this._status = ensureElement<HTMLElement>(`.lot__status`, container);
//     }

//     set status(content: HTMLElement) {
//         this._status.replaceWith(content);
//     }
// }

// interface IAuctionActions {
//     onSubmit: (price: number) => void;
// }

// export class Auction extends Component<AuctionStatus> {
//     protected _time: HTMLElement;
//     protected _label: HTMLElement;
//     protected _button: HTMLButtonElement;
//     protected _input: HTMLInputElement;
//     protected _history: HTMLElement;
//     protected _bids: HTMLElement
//     protected _form: HTMLFormElement;

//     constructor(container: HTMLElement, actions?: IAuctionActions) {
//         super(container);

//         this._time = ensureElement<HTMLElement>(`.lot__auction-timer`, container);
//         this._label = ensureElement<HTMLElement>(`.lot__auction-text`, container);
//         this._button = ensureElement<HTMLButtonElement>(`.button`, container);
//         this._input = ensureElement<HTMLInputElement>(`.form__input`, container);
//         this._bids = ensureElement<HTMLElement>(`.lot__history-bids`, container);
//         this._history = ensureElement<HTMLElement>('.lot__history', container);
//         this._form = ensureElement<HTMLFormElement>(`.lot__bid`, container);

//         this._form.addEventListener('submit', (event) => {
//             event.preventDefault();
//             actions?.onSubmit?.(parseInt(this._input.value));
//             return false;
//         });
//     }

//     set time(value: string) {
//         this.setText(this._time, value);
//     }
//     set label(value: string) {
//         this.setText(this._label, value);
//     }
//     set nextBid(value: number) {
//         this._input.value = String(value);
//     }
//     set history(value: number[]) {
//         this._bids.replaceChildren(...value.map(item => createElement<HTMLUListElement>('li', {
//             className: 'lot__history-item',
//             textContent: formatNumber(item)
//         })));
//     }

//     set status(value: LotStatus) {
//         if (value !== 'active') {
//             this.setHidden(this._history);
//             this.setHidden(this._form);
//         } else {
//             this.setVisible(this._history);
//             this.setVisible(this._form);
//         }
//     }

//     focus() {
//         this._input.focus();
//     }
// }

// export interface BidStatus {
//     amount: number;
//     status: boolean;
// }

// export class BidItem extends Card<BidStatus> {
//     protected _amount: HTMLElement;
//     protected _status: HTMLElement;
//     protected _selector: HTMLInputElement;

//     constructor(container: HTMLElement, actions?: ICardActions) {
//         super('bid', container, actions);
//         this._amount = ensureElement<HTMLElement>(`.bid__amount`, container);
//         this._status = ensureElement<HTMLElement>(`.bid__status`, container);
//         this._selector = container.querySelector(`.bid__selector-input`);

//         if (!this._button && this._selector) {
//             this._selector.addEventListener('change', (event: MouseEvent) => {
//                 actions?.onClick?.(event);
//             })
//         }
//     }

//     set status({ amount, status }: BidStatus) {
//         this.setText(this._amount, formatNumber(amount));

//         if (status) this.setVisible(this._status);
//         else this.setHidden(this._status);
//     }
// }
