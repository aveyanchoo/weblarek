import { Component } from '../base/Component';
import { ProductCategory } from '../../types';
import { categoryMap, priceLabel } from '../../utils/constants';

export interface IBaseCardProps {
  title?: string;
  category?: ProductCategory;
  price?: number | null;
  image?: string;
  description?: string;
}

export abstract class BaseCard<T extends IBaseCardProps> extends Component<T> {
  protected readonly titleElement: HTMLElement | null;
  protected readonly categoryElement: HTMLElement | null;
  protected readonly priceElement: HTMLElement | null;
  protected readonly imageElement: HTMLImageElement | null;

  protected constructor(container: HTMLElement) {
    super(container);
    this.titleElement = container.querySelector('.card__title');
    this.categoryElement = container.querySelector('.card__category');
    this.priceElement = container.querySelector('.card__price');
    this.imageElement = container.querySelector('.card__image');
  }

  protected setTitle(title?: string) {
    if (this.titleElement && title !== undefined) {
      this.titleElement.textContent = title;
    }
  }

  protected setCategory(category?: ProductCategory) {
    if (!this.categoryElement || category === undefined) {
      return;
    }
    const config = categoryMap[category];
    this.categoryElement.textContent = config.label;
    this.categoryElement.className = `card__category card__category_${config.modifier}`;
  }

  protected setPrice(price?: number | null) {
    if (!this.priceElement || price === undefined) {
      return;
    }
    this.priceElement.textContent = price === null ? priceLabel.free : `${price} ${priceLabel.currency}`;
  }

  protected setImageContent(src?: string, alt?: string) {
    if (!this.imageElement || !src) {
      return;
    }
    this.setImage(this.imageElement, src, alt);
  }

  override render(data?: Partial<T>): HTMLElement {
    if (data) {
      this.setTitle(data.title);
      this.setCategory(data.category);
      this.setPrice(data.price);
      if ('image' in data) {
        this.setImageContent(data.image, data.title);
      }
    }
    return super.render(data);
  }
}
