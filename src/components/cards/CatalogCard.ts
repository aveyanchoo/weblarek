import { BaseCard, IBaseCardProps } from './BaseCard';
import { IEvents } from '../base/Events';

export interface ICatalogCardProps extends IBaseCardProps {
  id: string;
  inBasket?: boolean;
}

export class CatalogCard extends BaseCard<ICatalogCardProps> {
  constructor(container: HTMLElement, private readonly events: IEvents) {
    super(container);
    this.container.addEventListener('click', () => {
      if (!this.container.dataset.id) {
        return;
      }
      this.events.emit('view:product-open', { id: this.container.dataset.id });
    });
  }

  override render(data?: Partial<ICatalogCardProps>): HTMLElement {
    if (data?.id) {
      this.container.dataset.id = data.id;
    }
    if (data?.inBasket !== undefined) {
      this.container.dataset.inBasket = String(Boolean(data.inBasket));
    }
    return super.render(data);
  }
}
