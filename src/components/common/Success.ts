import { Component } from '../base/Component';

interface ISuccessAction {
  onClick: (event: MouseEvent) => void;
}

export interface ISuccess {
  description: number;
}

export class SuccessMessage extends Component<ISuccess> {
  protected _button: HTMLButtonElement;
  protected _description: HTMLElement;

  constructor( container: HTMLElement, actions?: ISuccessAction) {
    super(container);

    this._button = container.querySelector('.order-success__close');
    this._description = container.querySelector('.order-success__description');

    if (actions?.onClick) {
      if (this._button) {
        this._button.addEventListener('click', actions.onClick)
      }
    }
  }

  set description (value: number) {
    this.setText(this._description, String(value) + ' синапсов');
  }
}
