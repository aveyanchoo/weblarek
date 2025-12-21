import { Component } from './base/Component';

export interface ICatalogViewRenderData {
  elements: HTMLElement[];
}

export class CatalogView extends Component<ICatalogViewRenderData> {
  constructor(container: HTMLElement) {
    super(container);
  }

  override render(data?: Partial<ICatalogViewRenderData>): HTMLElement {
    if (data?.elements) {
      this.renderItems(data.elements);
    }
    return this.container;
  }
  
  private renderItems(elements: HTMLElement[]): void {
    this.container.replaceChildren(...elements);
  }
  
}
