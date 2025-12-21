import { BaseCard, IBaseCardProps } from './BaseCard';
import { IEvents } from '../base/Events';

export interface IBasketCardProps extends IBaseCardProps {
  id: string;
  index: number;
}

export class BasketCard extends BaseCard<IBasketCardProps> {
  private readonly indexElement: HTMLElement | null;
  private readonly removeButton: HTMLButtonElement | null;

  constructor(container: HTMLElement, private readonly events: IEvents) {
    super(container);
    this.indexElement = container.querySelector('.basket__item-index');
    this.removeButton = container.querySelector('.basket__item-delete');

    this.removeButton?.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const id = this.container.dataset.id;
      if (!id) {
        return;
      }
      this.events.emit('view:basket-remove', { id });
    });
  }

  override render(data?: Partial<IBasketCardProps>): HTMLElement {
    if (data?.id) {
      this.container.dataset.id = data.id;
    }
    if (this.indexElement && data?.index !== undefined) {
      this.indexElement.textContent = String(data.index);
    }
    return super.render(data);
  }
}
