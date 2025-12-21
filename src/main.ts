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
import { API_URL, CDN_URL, REMOTE_API_URL, REMOTE_CDN_URL } from './utils/constants';
import { apiProducts } from './utils/data';
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

let api = new WebLarekAPI(CDN_URL, API_URL);
let activeModal: 'preview' | 'basket' | 'order' | 'contacts' | 'success' | null = null;
let catalogLoadFailed = false;

const placeholderImage = new URL('./images/Subtract.svg', import.meta.url).href;

const renderHeader = () => {
  header.render({ counter: basketModel.getItemCount() });
};

const renderCatalog = () => {
  const products = catalogModel.getItems();
  const basketIds = new Set(basketModel.getItems().map((item) => item.id));
  const elements = products.map((product) => {
    const cardElement = cloneTemplate<HTMLButtonElement>(catalogCardTemplate);
    const card = new CatalogCard(cardElement, events);
    card.render({
      id: product.id,
      title: product.title,
      category: product.category,
      price: product.price,
      image: product.image,
      inBasket: basketIds.has(product.id),
    });
    return cardElement;
  });

  const catalogElement = catalogView.render({ elements });

  if (catalogLoadFailed && products.length === 0) {
    const message = document.createElement('p');
    message.className = 'gallery__message';
    message.textContent = 'Не удалось загрузить каталог. Попробуйте позже.';
    catalogElement.append(message);
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
  const addressValid = buyer.address.length > 0;
  const addressError = addressValid ? '' : 'Адрес доставки обязателен';
  return orderForm.render({
    payment: buyer.payment,
    address: buyer.address,
    isValid: addressValid,
    errorText: addressError,
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
  const element = renderBasket();
  modal.open(element);
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

const findProduct = (id: string) => catalogModel.getProduct(id) ?? basketModel.getItems().find((item) => item.id === id) ?? null;

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
  renderCatalog();
  if (activeModal === 'basket') {
    renderBasket();
  }
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
  const product = findProduct(id);
  if (product) {
    basketModel.addItem(product);
    closeModal();
  }
});

events.on<{ id: string }>('view:product-remove', ({ id }) => {
  const product = findProduct(id);
  if (product) {
    basketModel.removeItem(product);
    closeModal();
  }
});

events.on<{ id: string }>('view:basket-remove', ({ id }) => {
  const product = findProduct(id);
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
  const buyer = buyerModel.getBuyerData();
  if (buyer.address.length === 0) {
    renderOrderStep();
    return;
  }
  openContactsForm();
});

events.on('view:checkout-submit', async () => {
  const validation = buyerModel.validateBuyerData();
  if (!validation.isValid) {
    renderContactsStep();
    return;
  }

  try {
    const buyer = buyerModel.getBuyerData();
    const order = await api.createOrder({
      payment: buyer.payment,
      email: buyer.email,
      phone: buyer.phone,
      address: buyer.address,
      total: basketModel.getTotalPrice(),
      items: basketModel.getItems().map((item) => item.id),
    });
    openSuccess(order.total);
    basketModel.clearBasket();
    buyerModel.clearBuyerData();
  } catch (error) {
    contactsForm.render({
      email: buyerModel.getBuyerData().email,
      phone: buyerModel.getBuyerData().phone,
      isValid: false,
      errorText: 'Не удалось оформить заказ. Попробуйте позже.',
    });
  }
});

events.on('view:modal-close', () => {
  closeModal();
});

events.on('view:success-close', () => {
  closeModal();
});

const loadCatalogFromSources = async () => {
  const sources: Array<{ apiUrl: string; cdnUrl: string }> = [
    { apiUrl: API_URL, cdnUrl: CDN_URL },
  ];

  if (!sources.some((source) => source.apiUrl === REMOTE_API_URL)) {
    sources.push({ apiUrl: REMOTE_API_URL, cdnUrl: REMOTE_CDN_URL });
  }

  let lastError: unknown = null;

  for (const source of sources) {
    try {
      const sourceApi = new WebLarekAPI(source.cdnUrl, source.apiUrl);
      const items = await sourceApi.getProductList();
      api = sourceApi;
      catalogLoadFailed = false;
      catalogModel.setItems(items);
      return true;
    } catch (error) {
      lastError = error;
    }
  }

  console.error('Не удалось загрузить каталог с сервера', lastError);
  catalogLoadFailed = true;
  return false;
};

const bootstrap = async () => {
  renderHeader();
  const success = await loadCatalogFromSources();

  if (!success) {
    const fallbackItems = apiProducts.items.map((item) => ({
      ...item,
      image: placeholderImage,
    }));
    catalogModel.setItems(fallbackItems);
    catalogLoadFailed = fallbackItems.length === 0;
  }
};

bootstrap();
