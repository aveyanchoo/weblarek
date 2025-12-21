// export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

// export interface IApi {
//     get<T extends object>(uri: string): Promise<T>;
//     post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
// }


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

// Сервис для работы с API
export interface IWebLarekAPI {
    getProductList(): Promise<IProduct[]>;
    getProduct(id: string): Promise<IProduct>;
    createOrder(order: IOrderRequest): Promise<IOrderResponse>;
}
