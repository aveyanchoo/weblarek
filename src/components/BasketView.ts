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

    if (this.submitButton) {
      this.submitButton.disabled = true;

      this.submitButton?.addEventListener('click', (event) => {
        event.preventDefault();
        this.events.emit('view:checkout');
      });
    }
  }


  override render(data?: Partial<IBasketViewRenderData>): HTMLElement {
    if (!data) {
      return this.container;
    }

    if (data.elements) {
      this.renderItems(data.elements);
    }

    if (data.total !== undefined) {
      this.renderTotal(data.total);
    }

    return this.container;
  }

  private renderItems(items: HTMLElement[]): void {
    if (!this.listElement) {
      return;
    }

    this.listElement.replaceChildren();

    if (items.length === 0) {
      this.listElement.append(this.emptyElement);
    } else {
      this.listElement.append(...items);
    }

    this.toggleSubmitButton(items.length > 0);
  }

  private renderTotal(total: number): void {
    if (!this.totalElement) {
      return;
    }

    this.totalElement.textContent = `${total} ${priceLabel.currency}`;
  }

  private toggleSubmitButton(enabled: boolean): void {
    if (!this.submitButton) {
      return;
    }

    this.submitButton.disabled = !enabled;
  }
}
