# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build

```
## Описание данных и типов данных, используемых в приложении
Карточка товара
```
interface ICard {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
}
```
Форма
```
interface IFormState {
    valid: boolean;
    errors: string[];
}
```

Данные о заказе
```
interface IOrder {
  payment: 'online' | 'cash-on-delivery';
  email: string;
  phone: string;
  address: string;
  total: number;
  items: ICard[];

}
```
Контакты
```
interface IContacts {
  phone: string;
  email: string;
}
```

Интерфейс для модели данных карточек
```
interface ICardsData {
	cards: ICard[];
//	preview: string;
}

```
Карточка това в корзине
```
interface ICardBasket {
  cards: ICard[];
  addCard(card: ICard): void;
  deleteCard(cardId: string): void;
}
```


Корзина с выбранными карточками товаров
```
interface IBasketView{
    backetItems: HTMLElement[];
    total: number;
}
```

Состояние приложения
```
interface IAppState {
  catalog: ICard[];
  basket: ICard[];
  preview: string | null;
  order: IOrderForm | null;
}
```

Модальное окно
```
interface IModalData {
  content: HTMLElement;
}
```
Успешный заказ
```
interface ISuccess {
  description: number;
}
```

Данные карточки, используемые в модальном окне при открытии корзины с покупками
```
type TOrderInfo = Pick<ICard, 'title' | 'price'>
```
Категории товаров
```
type TCategory = 'другое'|'софт-скил'|'дополнительное'|'кнопка'|'хард-скил';
```
Способ оплаты
```
type TPaymentMethod = 'онлайн' | 'при получении'
```

### Базовый код

#### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Методы:
- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие

### Слой данных

#### Класс Model
Базовая модель, чтобы можно было отличить ее от простых объектов с данными\
Метод класса:
emitChanges(event: string, payload?: object)


#### Класс Card
Расширяет класс Model.\
В полях класса содержатся следующие данные:
description: string;
    id: string;
    image: string;
    title: string;
    price: number;
    category: TCategory;

#### Класс AppState
Расширяет класс Model.\
В полях класса содержатся следующие данные:
- preview: string | null; - id карточки для превью.
- order: IOrder = {
      items: [],
      email: '',
      payment: '',
      address: '',
      phone: '',
      total: null
  }; - объект с данными для заказа.
- catalog: Card[] - массив всех карточек товаров в каталоге.
- basket: Card[]=[] - массив карточек товаров в корзине
- formErrors: FormErrors = {}; - объект ошибок, возникающих при заполнении форм.

Так же класс предоставляет набор методов для взаимодействия с этими данными.
setCatalog(items: ICard[]) - заполнение каталога карточками,
setPreview(item: ICard) - заполнение превью карточки,
addToBasket(item: Card) - добавление товара в корзину,
removeFromBasket(id: string) - удаление товара из корзины,
getTotal() - получение суммы всего заказа,
clearBasket() - очистка корзины,
getQuantityCardsInBasket () - получение количества товаров в корзне,
setOrderedItems() - заполнение выбранных в заказе товаров,
setOrderField(field: keyof IOrderForm, value: string) - заполнение полей формы заказа,
createOrder() - создание заказа,
validateOrder() - валидация формы заказа (адрес, способ оплаты)
validateContacts() - валидация формы заказа (контакты)


#### Класс CardsCatalog
Класс отвечает за хранение и логику работы с данными карточек товаров.\
Конструктор класса принимает инстант брокера событий\
В полях класса хранятся следующие данные:
- _cards: ICard[] - массив объектов карточек
- _preview: string; - id карточки, выбранной для просмотра в модальной окне

Так же класс предоставляет набор методов для взаимодействия с этими данными.
- getCard(cardId: string): ICard - возвращает карточку по ее id

#### Класс BasketData
Класс отвечает за хранение и логику работы с данными товаров, добавленных в корзину.
В полях класса хранятся следующие данные:
- _cards: ICard[]; - массив объектов карточек.
- _total: number; - суммараня тоимость покупки.

Так же класс предоставляет набор методов для взаимодействия с этими данными.
- addCard(card: ICard): void; - добавляет товар в корзину.
- deleteCard(cardId: string): void; - удаляет товар из корзины.

### Классы представления
Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Класс Component
Является абстрактным и родительским классом для всех классов слоя отображения данных. Класс содержит общие поля и методы для этих классов. Отвечает за отображение любого компонента на странице.
Конструктор принимает родительский элемент./
constructor(protected readonly container: HTMLElement).

Методы:
- toggleClass(element: HTMLElement, className: string, force?: boolean) - Переключить класс.
- protected setText(element: HTMLElement, value: unknown) - Установить содержимое.
- setDisabled(element: HTMLElement, state: boolean) - Сменить статус блокировки.
- protected setHidden(element: HTMLElement) - Скрыть.
- protected setVisible(element: HTMLElement) - Показать.
- protected setImage(element: HTMLImageElement, src: string, alt?: string) - Установить изображение с альтернативным текстом.
- render(data?: Partial<T>): HTMLElement - Вернуть корневой DOM-элемент.

#### Класс Form extends Component
Расширяет класс Component. Ревлизует отображение формы. В конструктор передается DOM-элемент

Поля класса:
- _submit: HTMLButtonElement;
- _errors: HTMLElement;

Методы:
- set valid(value: boolean) - изменяет активность кнопки подтверждения.
- set errors(value: string)
- onInputChange((field: keyof T, value: string))
- render(HTMLElement): HTMLElement - метод возвращает отрисованный элемент.

#### Класс OrderForm extends Form
Расширяет класс Form. Представляет собой форму заказа. В конструктор класса передается DOM элемент темплейта (id="order") и обработчик событий.

Поля класса:
- _card
- _cash

Методы:
- disableButtons()

#### Класс ContactsForm extends Form
Расширяет класс Form. Отвечает за отображение формы ввода контактных данных пользователя. В конструктор класса передается DOM элемент темплейта (id="contacts") и обработчик событий.

Поля класса:
- email - поле ввода для почты.
- phone - поле ввода для номера телефона.

Методы:
- getInputValue(): Record<string, string> - возвращает объект с данными из полей формы, где ключ - name инпута, значение - данные введенные пользователем.

#### Класс Modal extends Component
Расширяет класс Component. Реализует модальное окно. Также предоставляет методы `open` и `close` для управления отображением модального окна. Устанавливает слушатели на клавиатуру, для закрытия модального окна по Esc, на клик в оверлей и кнопку-крестик для закрытия попапа.
- constructor(selector: string, events: IEvents) Конструктор принимает селектор, по которому в разметке страницы будет идентифицировано модальное окно и экземпляр класса `EventEmitter` для возможности инициации событий.

Поля класса
- _closeButton: HTMLButtonElement;
- _content: HTMLElement;
- events: IEvents - брокер событий

Методы:
- open()
- close()
- render(data: IModalData): HTMLElement - метод возвращает отрисованное модальное окно.


#### Класс BasketView extends Component
Расширяет класс Component. Отвечает за отображение корзины со списком выбранных товаров.\
В конструктор передается DOM-элемент темплейта (id="card-basket") и обработчик событий.

Поля класса:
- _backetItems: HTMLElement;
- _total: HTMLElement;
- _button: HTMLElement;
- events: IEvents - брокер событий.

Методы:
- set backetItems(items: HTMLElement[])
- set selected(items: string[])
- set total(total: number)
- uptateIndex()

#### Класс SuccessMessage extends Component
асширяет класс Component. Отображает сообщение об успешном оформлении заказа. В конструктор класса передается DOM элемент темплейта (id="success").

Поля класса:
- _button: HTMLButtonElement;
- _description: HTMLElement;

Методы:
- set description (value: number)


#### Класс Card extends Component
Расширяет класс Component. Отвечает за отображение карточки товара, задавая в карточке данные названия, изображения, цены, категории, описания. Класс используется для отображения карточек на странице сайта. В конструктор класса передается DOM элемент темплейта, а, также, обработчик клика, что позволяет при необходимости формировать карточки разных вариантов верстки. В классе устанавливаются слушатели на все интерактивные элементы, в результате взаимодействия с которыми пользователя генерируются соответствующие события.\
Поля класса содержат элементы разметки элементов карточки. Конструктор, кроме темплейта принимает экземпляр `EventEmitter` для инициации событий.\

Поля:
- _title: HTMLElement;
- _description: HTMLElement;
- _price: HTMLElement;
- _category: HTMLElement;
- _image: HTMLImageElement;
- _button: HTMLButtonElement;

Методы:
- set id(value: string)
- get id(): string
- set title(value: string)
- set price(value: number | null)
- get title()
- set image(value: string)
- set description(value: string | string[])


#### Класс CardInBasket
Расширяет класс Component. Отвечает за отображение карточки товара в корзине.
Поля:
- _index: HTMLElement;
- _title: HTMLElement;
- _price: HTMLElement;
- _button: HTMLButtonElement;

Методы:
- set title(value: string)
- set index(value: number)
- set price(value: number)

#### Класс Page extends Component
Расширяет класс Component. Отвечает за отображение главной страницы. Конструктор принимает DOM-элемент и обработчик событий.

Поля класса:
- _counter: HTMLElement;
- _catalog: HTMLElement;
- _basket: HTMLElement;

Методы:
- set counter(value: number)
- set catalog(items: HTMLElement[])
- set locked(value: boolean)

### Слой коммуникации

#### Класс AppApi
Принимает в конструктор экземпляр класса Api и предоставляет методы реализующие взаимодействие с бэкендом сервиса.

## Взаимодействие компонентов
Архитектура построена на принципе MVP.
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

*Список всех событий, которые могут генерироваться в системе:*\
*События изменения данных (генерируются классами моделями данных)*
- `card:selected` - изменение открываемой в модальном окне карточки
- `card:previewClear` - необходима очистка данных выбранной для показа в модальном окне карточки

*События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)*
- `card:select` - выбор карточки для отображения в модальном окне
- `card:delete` - выбор карточки для удаления (из корзины)
- `form:input` - изменение данных в форме
- `form:submit` - сохранение данных пользователя в модальном окне
- `modal:open` - открытие модального окна










