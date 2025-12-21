import { BaseCard, IBaseCardProps } from './BaseCard';
import { IEvents } from '../base/Events';

export interface IPreviewCardProps extends IBaseCardProps {
  id: string;
  description?: string;
  inBasket: boolean;
}

export class PreviewCard extends BaseCard<IPreviewCardProps> {
  private readonly descriptionElement: HTMLElement | null;
  private readonly actionButton: HTMLButtonElement | null;

  constructor(container: HTMLElement, private readonly events: IEvents) {
    super(container);
    this.descriptionElement = container.querySelector('.card__text');
    this.actionButton = container.querySelector('.card__button');

    this.actionButton?.addEventListener('click', (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      const id = this.container.dataset.id;
      if (!id || !this.actionButton || this.actionButton.disabled) {
        return;
      }
      if (this.actionButton.dataset.mode === 'remove') {
        this.events.emit('view:product-remove', { id });
      } else {
        this.events.emit('view:product-add', { id });
      }
    });
  }

  override render(data?: Partial<IPreviewCardProps>): HTMLElement {
    if (data?.id) {
      this.container.dataset.id = data.id;
    }

    if (this.descriptionElement && data?.description !== undefined) {
      this.descriptionElement.textContent = data.description;
    }

    if (this.actionButton) {
      const price = data?.price ?? null;
      const isInBasket = Boolean(data?.inBasket);
      if (price === null) {
        this.actionButton.textContent = 'Недоступно';
        this.actionButton.disabled = true;
        this.actionButton.dataset.mode = 'disabled';
      } else {
        this.actionButton.disabled = false;
        if (isInBasket) {
          this.actionButton.textContent = 'Удалить из корзины';
          this.actionButton.dataset.mode = 'remove';
        } else {
          this.actionButton.textContent = 'Купить';
          this.actionButton.dataset.mode = 'add';
        }
      }
    }

    return super.render(data);
  }
}
