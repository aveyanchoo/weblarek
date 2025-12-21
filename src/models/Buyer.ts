import { IBuyer, TPayment } from "../types";
import { EventEmitter } from "../components/base/Events";

/**
 * Класс Buyer
 * Назначение: управление данными покупателя при оформлении заказа
 * Зона ответственности: хранение контактной информации, способа оплаты и валидация данных
 */
export class Buyer extends EventEmitter {
    private payment: TPayment = 'card'; // Способ оплаты по умолчанию
    private email: string = '';          // Email адрес покупателя
    private phone: string = '';          // Номер телефона покупателя
    private address: string = '';        // Адрес доставки

    /**
     * Конструктор класса Buyer
     * Инициализирует поля покупателя значениями по умолчанию
     */
    constructor() {
        super();
        this.payment = 'card';
        this.email = '';
        this.phone = '';
        this.address = '';
    }

    /**
     * Установка способа оплаты
     * @param payment - выбранный способ оплаты
     */
    setPayment(payment: TPayment): void {
        this.payment = payment;
        this.emitChange();
    }

    /**
     * Установка email адреса покупателя
     * @param email - email адрес
     */
    setEmail(email: string): void {
        this.email = email.trim();
        this.emitChange();
    }

    /**
     * Установка номера телефона покупателя
     * @param phone - номер телефона
     */
    setPhone(phone: string): void {
        this.phone = phone.trim();
        this.emitChange();
    }

    /**
     * Установка адреса доставки
     * @param address - адрес доставки
     */
    setAddress(address: string): void {
        this.address = address.trim();
        this.emitChange();
    }

    /**
     * Массовое обновление данных покупателя
     * @param data - объект с частичными данными покупателя
     */
    setBuyerData(data: Partial<IBuyer>): void {
        let changed = false;

        if (data.payment !== undefined) {
            this.payment = data.payment;
            changed = true;
        }
        if (data.email !== undefined) {
            this.email = data.email.trim();
            changed = true;
        }
        if (data.phone !== undefined) {
            this.phone = data.phone.trim();
            changed = true;
        }
        if (data.address !== undefined) {
            this.address = data.address.trim();
            changed = true;
        }

        if (changed) {
            this.emitChange();
        }
    }

    /**
     * Получение всех данных покупателя
     * @returns полные данные покупателя
     */
    getBuyerData(): IBuyer {
        return {
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address
        };
    }

    /**
     * Очистка всех данных покупателя
     */
    clearBuyerData(): void {
        this.payment = 'card';
        this.email = '';
        this.phone = '';
        this.address = '';
        this.emitChange();
    }

    /**
     * Валидация введенных данных покупателя
     * @returns объект с результатом валидации и списком ошибок по полям
     */
    validateBuyerData(): { isValid: boolean; errors: Partial<IBuyer> } {
        const errors: Partial<IBuyer> = {};

        if (!this.isValidEmail()) {
            errors.email = 'Некорректный email адрес';
        }

        if (!this.isValidPhone()) {
            errors.phone = 'Некорректный номер телефона';
        }

        if (!this.isValidAddress()) {
            errors.address = 'Адрес доставки обязателен';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    /**
     * Проверка корректности email адреса
     * @returns true, если email корректный
     */
    isValidEmail(): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(this.email);
    }

    /**
     * Проверка корректности номера телефона
     * @returns true, если номер корректный
     */
    isValidPhone(): boolean {
        const phoneRegex = /^\+7\d{10}$/;
        return phoneRegex.test(this.phone);
    }

    /**
     * Проверка заполненности адреса доставки
     * @returns true, если адрес заполнен
     */
    isValidAddress(): boolean {
        return this.address.length > 0;
    }

    private emitChange(): void {
        this.emit('buyer:changed', this.getBuyerData());
    }
}
