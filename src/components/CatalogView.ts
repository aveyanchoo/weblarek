import { Component } from './base/Component';

export interface ICatalogViewRenderData {
  elements: HTMLElement[];
}

export class CatalogView extends Component<ICatalogViewRenderData> {
  constructor(container: HTMLElement) {
    super(container);
  }

  override render(data?: Partial<ICatalogViewRenderData>): HTMLElement {
    if (!data) {
      return this.container;
    }

    const elements = data.elements ?? [];
    this.container.replaceChildren(...elements);

    return this.container;
  }
}
