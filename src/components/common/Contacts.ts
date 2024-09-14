import { IEvents } from '../base/events';
import { Form } from '../common/Form';

export interface IContacts {
  phone: string;
  email: string;
}

export class ContactsForm extends Form<IContacts> {
  constructor(
    container: HTMLFormElement,
    events: IEvents
  ) {
    super(container, events);
  }
}
