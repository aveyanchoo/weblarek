export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// ===== БАЗОВЫЕ ИНТЕРФЕЙСЫ =====

// Товар
export interface IProduct {
    id: string;
    title: string;
    description: string;
    image: string;
    category: ProductCategory;
    price: number | null;
}

// Категории товаров
export type ProductCategory = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил';

// Ответ API со списком товаров
export interface IProductListResponse {
    total: number;
    items: IProduct[];
}

// Покупатель
export interface IBuyer {
    email: string;
    phone: string;
    address: string;
    payment: TPayment;
}

// Способы оплаты
export type TPayment = 'card' | 'cash';

// Заказ для отправки на сервер
export interface IOrderRequest {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[]; // массив ID товаров
}

// Ответ сервера при создании заказа
export interface IOrderResponse {
    id: string;
    total: number;
}

// Ошибка API
export interface IApiError {
    error: string;
}

// ===== ИНТЕРФЕЙСЫ ДЛЯ КОМПОНЕНТОВ UI =====

// Корзина с товарами
export interface IBasket {
    items: IBasketItem[];
    total: number;
    addItem(product: IProduct): void;
    removeItem(productId: string): void;
    clearBasket(): void;
    getItemCount(): number;
    getTotalPrice(): number;
}

// Элемент корзины
export interface IBasketItem {
    id: string;
    title: string;
    price: number | null;
    quantity: number;
}

// Каталог товаров
export interface ICatalog {
    products: IProduct[];
    selectedCategory?: ProductCategory;
    searchQuery?: string;
    setCategory(category: ProductCategory | undefined): void;
    setSearchQuery(query: string): void;
    getFilteredProducts(): IProduct[];
}

// Карточка товара в каталоге
export interface IProductCard {
    product: IProduct;
    isInBasket: boolean;
    onAddToBasket?: (product: IProduct) => void;
    onRemoveFromBasket?: (productId: string) => void;
    onOpenDetails?: (product: IProduct) => void;
}

// Модальное окно с деталями товара
export interface IProductModal {
    product: IProduct | null;
    isOpen: boolean;
    isInBasket: boolean;
    onClose(): void;
    onAddToBasket?: (product: IProduct) => void;
    onRemoveFromBasket?: (productId: string) => void;
}

// Форма данных покупателя
export interface IBuyerForm {
    formData: IBuyer;
    errors: Partial<IBuyer>;
    isValid: boolean;
    onFieldChange(field: keyof IBuyer, value: string): void;
    validateForm(): boolean;
    resetForm(): void;
}

// Форма выбора способа оплаты
export interface IPaymentForm {
    selectedPayment: TPayment;
    onPaymentChange(method: TPayment): void;
}

// Страница успешного заказа
export interface IOrderSuccess {
    orderId: string;
    total: number;
    onClose(): void;
}

// ===== ИНТЕРФЕЙСЫ ДЛЯ УПРАВЛЕНИЯ СОСТОЯНИЕМ =====

// Глобальное состояние приложения
export interface IAppState {
    catalog: IProduct[];
    basket: IBasketItem[];
    selectedProduct: IProduct | null;
    buyer: IBuyer;
    paymentMethod: TPayment;
    isLoading: boolean;
    error: string | null;
}

// События приложения
export interface IAppEvents {
// Каталог
    'catalog:loaded': IProduct[];
    'catalog:category-changed': ProductCategory | undefined;
    'catalog:search': string;

// Товары
    'product:select': IProduct;
    'product:add-to-basket': IProduct;
    'product:remove-from-basket': string;

// Корзина
    'basket:open': void;
    'basket:close': void;
    'basket:clear': void;
    'basket:item-count-changed': number;

// Покупатель
    'buyer:field-changed': { field: keyof IBuyer; value: string };
    'buyer:validation-error': Partial<IBuyer>;

// Заказ
    'order:create': IOrderRequest;
    'order:success': IOrderResponse;
    'order:error': string;

// UI
    'modal:open': void;
    'modal:close': void;
    'loading:start': void;
    'loading:end': void;
}

// ===== ИНТЕРФЕЙСЫ ДЛЯ API =====

// Сервис для работы с API
export interface IWebLarekAPI {
    getProductList(): Promise<IProduct[]>;
    getProduct(id: string): Promise<IProduct>;
    createOrder(order: IOrderRequest): Promise<IOrderResponse>;
}
// Конфигурация API
export interface IApiConfig {
    baseUrl: string;
    headers?: Record<string, string>;
}

// ===== ИНТЕРФЕЙСЫ ДЛЯ ВАЛИДАЦИИ =====

// Правила валидации
export interface IValidationRules {
    email: RegExp;
    phone: RegExp;
    required: string[];
}

// Результат валидации
export interface IValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
}

// ===== ВСПОМОГАТЕЛЬНЫЕ ТИПЫ =====

// Тип для обработчиков событий
export type EventHandler<T = any> = (data: T) => void;

// Тип для асинхронных операций
export type AsyncResult<T> = Promise<{
    success: boolean;
    data?: T;
    error?: string;
}>;

// Опции для компонентов
export interface IComponentOptions {
    className?: string;
    disabled?: boolean;
}

// ===== ИНТЕРФЕЙСЫ ДЛЯ КОМПОНЕНТОВ ФОРМЫ =====

// Базовый интерфейс для полей формы
export interface IFormField {
    name: string;
    value: string;
    placeholder?: string;
    required?: boolean;
    error?: string;
    onChange?: (value: string) => void;
}

// Интерфейс для кнопки
export interface IButton extends IComponentOptions {
    text: string;
    type?: 'button' | 'submit';
    onClick?: () => void;
}

// Интерфейс для модального окна
export interface IModal extends IComponentOptions {
    isOpen: boolean;
    title?: string;
    content: HTMLElement | string;
    onClose?: () => void;
}
