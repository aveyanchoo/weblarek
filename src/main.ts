import './scss/styles.scss';
import { EventEmitter } from './components/base/Events';
import { ensureElement, cloneTemplate } from './utils/utils';
import { CatalogView } from './components/CatalogView';
import { Header } from './components/Header';
import { Modal } from './components/Modal';
import { BasketView } from './components/BasketView';
import { OrderForm } from './components/forms/OrderForm';
import { ContactsForm } from './components/forms/ContactsForm';
import { OrderSuccess } from './components/OrderSuccess';
import { PreviewCard } from './components/cards/PreviewCard';
import { CatalogCard } from './components/cards/CatalogCard';
import { BasketCard } from './components/cards/BasketCard';
import { ProductCatalog } from './models/ProductCatalog';
import { Basket } from './models/Basket';
import { Buyer } from './models/Buyer';
import { WebLarekAPI } from './models/WebLarekAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { IBuyer, IProduct } from './types';

const events = new EventEmitter();

const catalogModel = new ProductCatalog();
const basketModel = new Basket();
const buyerModel = new Buyer();

const header = new Header(ensureElement<HTMLElement>('.header'), events);
const catalogCardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const basketItemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

const catalogView = new CatalogView(
  ensureElement<HTMLElement>('.gallery'),
);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basketView = new BasketView(
  cloneTemplate<HTMLDivElement>('#basket'),
  events,
);
const orderForm = new OrderForm(
  cloneTemplate<HTMLFormElement>('#order'),
  events,
);
const contactsForm = new ContactsForm(
  cloneTemplate<HTMLFormElement>('#contacts'),
  events,
);
const orderSuccess = new OrderSuccess(
  cloneTemplate<HTMLDivElement>('#success'),
  events,
);
const previewCard = new PreviewCard(
  cloneTemplate<HTMLDivElement>('#card-preview'),
  events,
);

const api = new WebLarekAPI(CDN_URL, API_URL);
let activeModal: 'preview' | 'basket' | 'order' | 'contacts' | 'success' | null = null;
let catalogLoadFailed = false;

const renderHeader = () => {
  header.render({ counter: basketModel.getItemCount() });
};

const renderCatalog = () => {
  const products = catalogModel.getItems();
  const elements = products.map((product) => {
    const cardElement = cloneTemplate<HTMLButtonElement>(catalogCardTemplate);
    const card = new CatalogCard(cardElement, events);
    card.render({
      id: product.id,
      title: product.title,
      category: product.category,
      price: product.price,
      image: product.image,
      inBasket: basketModel.hasItem(product.id),
    });
    return cardElement;
  });

  if (catalogLoadFailed && products.length === 0) {
    catalogView.showErrorMessage('Не удалось загрузить каталог. Попробуйте позже.');
  } else {
    catalogView.render({ elements });
  }
};

const renderBasket = () => {
  const items = basketModel.getItems();
  const elements = items.map((item, index) => {
    const cardElement = cloneTemplate<HTMLLIElement>(basketItemTemplate);
    const card = new BasketCard(cardElement, events);
    card.render({
      id: item.id,
      index: index + 1,
      title: item.title,
      price: item.price,
    });
    return cardElement;
  });

  return basketView.render({ elements, total: basketModel.getTotalPrice() });
};

const renderOrderStep = () => {
  const buyer = buyerModel.getBuyerData();
  const addressValid = buyerModel.isValidAddress();
  return orderForm.render({
    payment: buyer.payment,
    address: buyer.address,
    isValid: addressValid,
    errorText: addressValid ? '' : 'Адрес доставки обязателен',
  });
};

const renderContactsStep = () => {
  const buyer = buyerModel.getBuyerData();
  const { errors } = buyerModel.validateBuyerData();
  const contactErrors = [errors.email, errors.phone].filter(Boolean);
  const errorMessages = contactErrors.join('. ');
  const contactsValid = contactErrors.length === 0;
  return contactsForm.render({
    email: buyer.email,
    phone: buyer.phone,
    isValid: contactsValid,
    errorText: contactsValid ? '' : errorMessages || 'Укажите корректные контакты',
  });
};

const openPreview = (product: IProduct) => {
  const element = previewCard.render({
    id: product.id,
    title: product.title,
    category: product.category,
    price: product.price,
    image: product.image,
    description: product.description,
    inBasket: basketModel.hasItem(product.id),
  });
  modal.open(element);
  activeModal = 'preview';
};

const openBasket = () => {
  modal.open(basketView.render());
  activeModal = 'basket';
};

const openOrderForm = () => {
  const element = renderOrderStep();
  modal.open(element);
  activeModal = 'order';
};

const openContactsForm = () => {
  const element = renderContactsStep();
  modal.open(element);
  activeModal = 'contacts';
};

const openSuccess = (total: number) => {
  const element = orderSuccess.render({ total });
  modal.open(element);
  activeModal = 'success';
};

const closeModal = () => {
  if (activeModal) {
    modal.close();
    activeModal = null;
  }
  if (catalogModel.getPreview()) {
    catalogModel.setPreview(null);
  }
};

const getProductById = (id: string) => catalogModel.getProduct(id)

catalogModel.on<IProduct[]>('catalog:changed', () => {
  renderCatalog();
});

catalogModel.on<{ product: IProduct | null }>('product:select', ({ product }) => {
  if (product) {
    openPreview(product);
  } else if (activeModal === 'preview') {
    closeModal();
  }
});

basketModel.on<{ items: IProduct[]; total: number }>('basket:changed', () => {
  renderHeader();
  renderBasket();
  if (activeModal === 'preview') {
    const preview = catalogModel.getPreview();
    if (preview) {
      openPreview(preview);
    }
  }
});

buyerModel.on<IBuyer>('buyer:changed', () => {
  if (activeModal === 'order') {
    renderOrderStep();
  }
  if (activeModal === 'contacts') {
    renderContactsStep();
  }
});

events.on<{ id: string }>('view:product-open', ({ id }) => {
  const product = catalogModel.getProduct(id);
  if (product) {
    catalogModel.setPreview(product);
  }
});

events.on<{ id: string }>('view:product-add', ({ id }) => {
  const product = getProductById(id);
  if (product) {
    basketModel.addItem(product);
    closeModal();
  }
});

events.on<{ id: string }>('view:product-remove', ({ id }) => {
  const product = getProductById(id);
  if (product) {
    basketModel.removeItem(product);
    closeModal();
  }
});

events.on<{ id: string }>('view:basket-remove', ({ id }) => {
  const product = getProductById(id);
  if (product) {
    basketModel.removeItem(product);
  }
});

events.on('view:cart-open', () => {
  openBasket();
});

events.on('view:checkout', () => {
  openOrderForm();
});

events.on<{ payment: IBuyer['payment'] }>('view:payment-change', ({ payment }) => {
  buyerModel.setPayment(payment);
});

events.on<{ field: keyof IBuyer; value: string }>('view:form-change', ({ field, value }) => {
  switch (field) {
    case 'address':
      buyerModel.setAddress(value);
      break;
    case 'email':
      buyerModel.setEmail(value);
      break;
    case 'phone':
      buyerModel.setPhone(value);
      break;
    default:
      break;
  }
});

events.on('view:checkout-next', () => {
  openContactsForm();
});

events.on('view:checkout-submit', async () => {
  try {
    const buyer = buyerModel.getBuyerData();

    const order = await api.createOrder({
      ...buyer,
      total: basketModel.getTotalPrice(),
      items: basketModel.getItems().map((item) => item.id),
    });
    openSuccess(order.total);
    basketModel.clearBasket();
    buyerModel.clearBuyerData();
  } catch (error) {
    contactsForm.showError('Не удалось оформить заказ. Попробуйте позже.')
  }
});

events.on('view:modal-close', () => {
  closeModal();
});

const loadCatalog = async () => {
  try {
    const items = await api.getProductList();
    catalogLoadFailed = false;
    catalogModel.setItems(items);
  } catch (error) {
    console.error('Не удалось загрузить каталог', error);
    catalogLoadFailed = true;
  }
};

const bootstrap = async () => {
  renderHeader();
  await loadCatalog();
};

bootstrap();