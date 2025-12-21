import { BaseForm, IBaseFormRenderData } from './BaseForm';
import { IEvents } from '../base/Events';

export interface IContactsFormRenderData extends IBaseFormRenderData {
  email: string;
  phone: string;
}

export class ContactsForm extends BaseForm<IContactsFormRenderData> {
  private readonly emailInput: HTMLInputElement | null;
  private readonly phoneInput: HTMLInputElement | null;

  constructor(container: HTMLFormElement, private readonly events: IEvents) {
    super(container);
    this.emailInput = container.querySelector<HTMLInputElement>('input[name="email"]');
    this.phoneInput = container.querySelector<HTMLInputElement>('input[name="phone"]');

    this.emailInput?.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement;
      this.events.emit('view:form-change', { field: 'email', value: target.value });
    });

    this.phoneInput?.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement;
      this.events.emit('view:form-change', { field: 'phone', value: target.value });
    });

    this.formElement.addEventListener('submit', (event) => {
      event.preventDefault();
      this.events.emit('view:checkout-submit');
    });
  }

  override render(data?: Partial<IContactsFormRenderData>): HTMLElement {
    if (data?.email !== undefined && this.emailInput) {
      this.emailInput.value = data.email;
    }

    if (data?.phone !== undefined && this.phoneInput) {
      this.phoneInput.value = data.phone;
    }

    return super.render(data);
  }
}
