import { Component } from './base/Component';
import { IEvents } from './base/Events';
import { priceLabel } from '../utils/constants';

export interface IOrderSuccessRenderData {
  total: number;
}

export class OrderSuccess extends Component<IOrderSuccessRenderData> {
  private readonly descriptionElement: HTMLElement | null;
  private readonly closeButton: HTMLButtonElement | null;

  constructor(container: HTMLElement, private readonly events: IEvents) {
    super(container);
    this.descriptionElement = container.querySelector('.order-success__description');
    this.closeButton = container.querySelector<HTMLButtonElement>('.order-success__close');

    this.closeButton?.addEventListener('click', (event) => {
      event.preventDefault();
      this.events.emit('view:success-close');
    });
  }

  override render(data?: Partial<IOrderSuccessRenderData>): HTMLElement {
    if (data?.total !== undefined) {
      this.renderTotal(data.total);
    }
    return this.container;
  }

  private renderTotal(total: number): void {
    if (!this.descriptionElement) {
      return;
    }

    this.descriptionElement.textContent =
      `Списано ${total} ${priceLabel.currency}`;
  }

}
