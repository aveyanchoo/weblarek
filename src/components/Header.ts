import { Component } from './base/Component';
import { IEvents } from './base/Events';

export interface IHeaderRenderData {
  counter: number;
}

export class Header extends Component<IHeaderRenderData> {
  private readonly counterElement: HTMLElement | null;
  private readonly basketButton: HTMLButtonElement | null;

  constructor(container: HTMLElement, private readonly events: IEvents) {
    super(container);
    this.counterElement = container.querySelector('.header__basket-counter');
    this.basketButton = container.querySelector<HTMLButtonElement>('.header__basket');

    this.basketButton?.addEventListener('click', (event) => {
      event.preventDefault();
      this.events.emit('view:cart-open');
    });
  }

  override render(data?: Partial<IHeaderRenderData>): HTMLElement {
    if (this.counterElement && data?.counter !== undefined) {
      const value = Math.max(0, data.counter);
      this.counterElement.textContent = String(value);
      this.counterElement.toggleAttribute('hidden', value === 0);
    }
    return this.container;
  }
}
