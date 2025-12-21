import { IProduct } from "../types";
import { EventEmitter } from "../components/base/Events";
/**
 * Класс ProductCatalog
 * Назначение: управление каталогом товаров в приложении
 * Зона ответственности: хранение полного списка товаров и управление выбранным товаром для детального просмотра
 */
export class ProductCatalog extends EventEmitter {
  private items: IProduct[] = []; // Массив всех товаров в каталоге
  private preview: IProduct | null = null; // Товар для подробного отображения

  /**
   * Конструктор класса ProductCatalog
   * Инициализирует пустые массивы и значения по умолчанию
   */
  constructor() {
    super();
    this.items = [];
    this.preview = null;
  }

  /**
   * Сохранение массива товаров в модели каталога
   * @param items - массив товаров для сохранения
   */
  setItems(items: IProduct[]): void {
    this.items = [...items];
    this.emit("catalog:changed", this.getItems());
  }

  /**
   * Получение полного массива товаров из модели
   * @returns массив всех товаров в каталоге
   */
  getItems(): IProduct[] {
    return this.items;
  }

  /**
   * Получение конкретного товара по его идентификатору
   * @param id - уникальный идентификатор товара
   * @returns найденный товар или null, если товар не найден
   */
  getProduct(id: string): IProduct | null {
    return this.items.find((item) => item.id === id) || null;
  }

  /**
   * Сохранение товара для подробного отображения
   * @param product - товар для детального просмотра
   */
  setPreview(product: IProduct | null): void {
    this.preview = product;
    this.emit("product:select", { product });
  }

  /**
   * Получение товара, выбранного для подробного отображения
   * @returns выбранный товар или null
   */
  getPreview(): IProduct | null {
    return this.preview;
  }
}
