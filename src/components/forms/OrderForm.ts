import { BaseForm, IBaseFormRenderData } from './BaseForm';
import { IEvents } from '../base/Events';
import { TPayment } from '../../types';

export interface IOrderFormRenderData extends IBaseFormRenderData {
  payment: TPayment;
  address: string;
}

const paymentButtonsConfig: Array<{ selector: string; value: TPayment }> = [
  { selector: 'button[name="card"]', value: 'card' },
  { selector: 'button[name="cash"]', value: 'cash' },
];

export class OrderForm extends BaseForm<IOrderFormRenderData> {
  private readonly addressInput: HTMLInputElement | null;
  private readonly paymentButtons: Array<{ button: HTMLButtonElement; value: TPayment }> = [];

  constructor(container: HTMLFormElement, private readonly events: IEvents) {
    super(container);

    paymentButtonsConfig.forEach(({ selector, value }) => {
      const button = container.querySelector<HTMLButtonElement>(selector);
      if (button) {
        button.dataset.payment = value;
        button.addEventListener('click', (event) => {
          event.preventDefault();
          this.events.emit('view:payment-change', { payment: value });
        });
        this.paymentButtons.push({ button, value });
      }
    });

    this.addressInput = container.querySelector<HTMLInputElement>('input[name="address"]');
    this.addressInput?.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement;
      this.events.emit('view:form-change', { field: 'address', value: target.value });
    });

    this.formElement.addEventListener('submit', (event) => {
      event.preventDefault();
      this.events.emit('view:checkout-next');
    });
  }

  override render(data?: Partial<IOrderFormRenderData>): HTMLElement {
    if (data?.address !== undefined && this.addressInput) {
      this.addressInput.value = data.address;
    }

    if (data?.payment !== undefined) {
      this.updatePaymentButtons(data.payment);
    }

    return super.render(data);
  }

  private updatePaymentButtons(activePayment: TPayment) {
    this.paymentButtons.forEach(({ button, value }) => {
      button.classList.toggle('button_alt-active', value === activePayment);
    });
  }
}
