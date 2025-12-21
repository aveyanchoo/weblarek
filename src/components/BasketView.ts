import { Component } from './base/Component';
import { IEvents } from './base/Events';
import { priceLabel } from '../utils/constants';

export interface IBasketViewRenderData {
  elements: HTMLElement[];
  total: number;
}

export class BasketView extends Component<IBasketViewRenderData> {
  private readonly listElement: HTMLElement | null;
  private readonly totalElement: HTMLElement | null;
  private readonly submitButton: HTMLButtonElement | null;
  private readonly emptyElement: HTMLElement;

  constructor(
    container: HTMLElement,
    private readonly events: IEvents,
  ) {
    super(container);
    this.listElement = container.querySelector('.basket__list');
    this.totalElement = container.querySelector('.basket__price');
    this.submitButton = container.querySelector<HTMLButtonElement>('.basket__button');
    this.emptyElement = document.createElement('li');
    this.emptyElement.className = 'basket__empty';
    this.emptyElement.textContent = 'Корзина пуста';

    this.submitButton?.addEventListener('click', (event) => {
      event.preventDefault();
      this.events.emit('view:checkout');
    });
  }

  override render(data?: Partial<IBasketViewRenderData>): HTMLElement {
    if (!this.listElement || !data) {
      return this.container;
    }

    this.listElement.replaceChildren();

    const items = data.elements ?? [];

    if (items.length === 0) {
      this.listElement.append(this.emptyElement);
    } else {
      this.listElement.append(...items);
    }

    if (this.totalElement && data.total !== undefined) {
      this.totalElement.textContent = `${data.total} ${priceLabel.currency}`;
    }

    if (this.submitButton) {
      this.submitButton.disabled = items.length === 0;
    }

    return this.container;
  }
}
