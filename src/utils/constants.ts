import { ProductCategory } from '../types';

export const REMOTE_API_ORIGIN = 'https://larek-api.nomoreparties.co';

const apiOrigin = (import.meta.env.VITE_API_ORIGIN ?? REMOTE_API_ORIGIN).replace(/\/$/, '');

/* Константа для получения полного пути для сервера. Для выполнения запроса
необходимо к API_URL добавить только ендпоинт. */
export const API_URL = `${apiOrigin}/api/weblarek`;
/* Константа для формирования полного пути к изображениям карточек.
Для получения полной ссылки на картинку необходимо к CDN_URL добавить только название файла изображения,
которое хранится в объекте товара. */
export const CDN_URL = `${apiOrigin}/content/weblarek`;

export const REMOTE_API_URL = `${REMOTE_API_ORIGIN}/api/weblarek`;
export const REMOTE_CDN_URL = `${REMOTE_API_ORIGIN}/content/weblarek`;

export const settings = {};

export const priceLabel = {
  free: 'Бесценно',
  currency: 'синапсов',
};

export const categoryMap: Record<ProductCategory, { label: string; modifier: string }> = {
  'софт-скил': { label: 'софт-скил', modifier: 'soft' },
  'хард-скил': { label: 'хард-скил', modifier: 'hard' },
  'другое': { label: 'другое', modifier: 'other' },
  'дополнительное': { label: 'дополнительное', modifier: 'additional' },
  'кнопка': { label: 'кнопка', modifier: 'button' },
};
