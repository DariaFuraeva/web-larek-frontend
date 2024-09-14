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

  constructor(
    protected blockName: string,
    container: HTMLElement,
    actions?: ISuccessAction
  ) {
    super(container);

    this._button = container.querySelector(`.${blockName}__close`);
    this._description = container.querySelector(`.${blockName}__description`);

    if (actions?.onClick) {
      if (this._button) {
        this._button.addEventListener('click', actions.onClick)
      }
    }
  }

}
