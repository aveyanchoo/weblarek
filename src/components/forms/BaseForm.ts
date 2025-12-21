import { Component } from '../base/Component';

export interface IBaseFormRenderData {
  isValid: boolean;
  errorText?: string;
}

export abstract class BaseForm<T extends IBaseFormRenderData> extends Component<T> {
  protected readonly formElement: HTMLFormElement;
  protected readonly submitButton: HTMLButtonElement | null;
  protected readonly errorsElement: HTMLElement | null;

  protected constructor(container: HTMLFormElement) {
    super(container);
    this.formElement = container;
    this.submitButton = container.querySelector('button[type="submit"]');
    this.errorsElement = container.querySelector('.form__errors');
  }

  protected setSubmitState(isEnabled: boolean) {
    if (this.submitButton) {
      this.submitButton.disabled = !isEnabled;
    }
  }

  showError(message?: string) {
    if (!this.errorsElement) {
      return;
    }
    this.errorsElement.textContent = message ?? '';
  }

  override render(data?: Partial<T>): HTMLElement {
    if (!data) {
      return this.container;
    }

    this.setSubmitState(Boolean(data.isValid));
    this.showError(data.errorText);

    return this.container;
  }
}
