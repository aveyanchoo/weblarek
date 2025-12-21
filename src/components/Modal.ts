import { Component } from './base/Component';
import { IEvents } from './base/Events';

export interface IModalRenderData {
  isOpen: boolean;
  content?: HTMLElement | null;
}

export class Modal extends Component<IModalRenderData> {
  private readonly containerElement: HTMLElement;
  private readonly contentElement: HTMLElement | null;
  private readonly closeButton: HTMLButtonElement | null;
  private readonly pageWrapper: HTMLElement | null;

  constructor(container: HTMLElement, private readonly events: IEvents) {
    super(container);
    this.containerElement = container;
    this.contentElement = container.querySelector('.modal__content');
    this.closeButton = container.querySelector('.modal__close');
    this.pageWrapper = document.querySelector('.page__wrapper');

    this.closeButton?.addEventListener('click', (event) => {
      event.preventDefault();
      this.events.emit('view:modal-close');
    });

    this.containerElement.addEventListener('click', (event) => {
      if (event.target === this.containerElement) {
        this.events.emit('view:modal-close');
      }
    });
  }

  open(content: HTMLElement) {
    if (this.contentElement) {
      this.contentElement.replaceChildren(content);
    }
    this.toggle(true);
  }

  close() {
    if (this.contentElement) {
      this.contentElement.replaceChildren();
    }
    this.toggle(false);
  }

  override render(data?: Partial<IModalRenderData>): HTMLElement {
    if (!data) {
      return this.containerElement;
    }

    if (data.content) {
      this.open(data.content);
    } else if (data.content === null) {
      this.contentElement?.replaceChildren();
    }

    if (data.isOpen !== undefined) {
      this.toggle(data.isOpen);
    }

    return this.containerElement;
  }

  private toggle(state: boolean) {
    this.containerElement.classList.toggle('modal_active', state);
    this.pageWrapper?.classList.toggle('page__wrapper_locked', state);
  }
}
