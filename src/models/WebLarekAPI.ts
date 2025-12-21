import { IProduct, IOrderRequest, IOrderResponse, IWebLarekAPI, IProductListResponse } from '../types';
import { Api } from '../components/base/Api';

export class WebLarekAPI implements IWebLarekAPI {
    protected api: Api;
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        this.api = new Api(baseUrl, options);
        this.cdn = cdn;
    }

    /**
     * Получает список всех товаров с сервера
     */
    async getProductList(): Promise<IProduct[]> {
        const result = await this.api.get<IProductListResponse>('/product');
        // Добавляем полный путь к изображениям
        return result.items.map((item) => ({
            ...item,
            image: this.cdn + item.image,
        }));
    }

    /**
     * Получает детали одного товара по его ID
     * @param id - уникальный идентификатор товара
     */
    async getProduct(id: string): Promise<IProduct> {
        const result = await this.api.get<IProduct>(`/product/${id}`);
        return {
            ...result,
            image: this.cdn + result.image,
        };
    }

    /**
     * Отправляет данные заказа на сервер
     * @param order - объект с данными заказа
     */
    async createOrder(order: IOrderRequest): Promise<IOrderResponse> {
        return this.api.post<IOrderResponse>('/order', order);
    }
}
