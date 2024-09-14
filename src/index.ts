import './scss/styles.scss';

import {EventEmitter} from './components/base/events';
import {ensureElement} from './utils/utils';
import {AppState, CatalogChangeEvent, Card} from './components/AppData';
import {Page} from './components/Page';
import {Modal} from './components/common/Modal';
import {BasketView} from './components/common/Basket';
import {OrderForm} from './components/common/Order';
import {SuccessMessage} from './components/common/Success';
import {API_URL} from './utils/constants';
import {Api, ApiListResponse} from './components/base/api';
import {cloneTemplate, createElement} from "./utils/utils";
import {ICard} from './types/types';
import {CardPreview, CatalogCard} from './components/Card'
import {StoreItemBasket} from './components/common/Basket'


//import {AuctionAPI} from "./components/AuctionAPI";
// import {API_URL, CDN_URL} from "./utils/constants";
// import {EventEmitter} from "./components/base/events";
 //import {AppState, CatalogChangeEvent, LotItem} from "./components/AppData";
// import {Page} from "./components/Page";
// import {Auction, AuctionItem, BidItem, CatalogItem} from "./components/Card";

// import {Modal} from "./components/common/Modal";
// import {Basket} from "./components/common/Basket";
// import {Tabs} from "./components/common/Tabs";
// import {IOrderForm} from "./types";
// import {Order} from "./components/Order";
// import {Success} from "./components/common/Success";


// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const events = new EventEmitter();

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
  console.log(eventName, data);
})



const api = new Api (API_URL);



// Переиспользуемые части интерфейса
const basket = new BasketView(cloneTemplate(basketTemplate), events);
// const tabs = new Tabs(cloneTemplate(tabsTemplate), {
//     onClick: (name) => {
//         if (name === 'closed') events.emit('basket:open');
//         else events.emit('bids:open');
//     }
// });
const order = new OrderForm('888888',cloneTemplate(orderTemplate), events);
const success = new SuccessMessage('order-success', cloneTemplate(successTemplate), {
  onClick: () => {
    events.emit('modal:close')
    modal.close()
  }
})

// Запрос для загрузки данных о всех карточка с сервера
api.get('/product')
    .then((res: ApiListResponse<ICard>) => {
      appData.setCatalog(res.items as ICard[])
    })
    .catch((err) => {
      console.error(err);
    });


// Дальше идет бизнес-логика
// Поймали событие, сделали что нужно

// Изменились элементы каталога
events.on<CatalogChangeEvent>('items:changed', () => {
    page.catalog = appData.catalog.map(item => {
        const card = new CatalogCard(cloneTemplate(cardCatalogTemplate), {
          onClick: () => events.emit('card:select', item)
        });
        return card.render({
            title: item.title,
            image: item.image,
            description: item.description,
            // status: {
            //     status: item.status,
            //     label: item.statusLabel
            // },
        });
    });

    page.counter = appData.basket.length;
});

// Открыть карточку (превью)
events.on('card:select', (item: Card) => {
    appData.setPreview(item);
    console.log(item.id, 'Эта карточка для превью');
    const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), {
      onClick: () => {
        events.emit('card:addToBasket', item)
      },
    });
    cardPreview.buttonSwitch(appData.basket.find((itemBasket) => itemBasket.id === item.id) != null ? true : false);


    modal.render({
      content: cardPreview.render({
        id: item.id,
        title: item.title,
        description: item.description,
        price: item.price,
        category: item.category,
        image: item.image,
      }),
    });
});


// Добавляем карточку (товар) в корзину
events.on('card:addToBasket', (item: Card) => {
  console.log('ДОбавлено');
  appData.addToBasket(item);
  console.log('ДОбавлено');

  // Обновляем счетчик количества товаров в корзине
  page.counter = appData.getQuantityCardsInBasket();
  modal.close();
})

events.on('basket:open', () => {
  // page.locked = true
  const basketItems = appData.basket.map((item, index) => {
    const storeItem = new StoreItemBasket(
      'card',
      cloneTemplate(cardBasketTemplate),
      {
        onClick: () => events.emit('basket:delete', item)
      }
    );
    return storeItem.render({
      title: item.title,
      price: item.price,
      index: index + 1,
    });
  });
  modal.render({
    content: basket.render({
      backetItems: basketItems,
      total: appData.getTotalBasketPrice(),
    }),
  });
});

// Удалить товар из корзины
events.on('basket:delete', (item: Card) => {
  appData.deleteFromBasket(item.id);
  basket.total = appData.getTotalBasketPrice();
  page.counter = appData.getBasketAmount();
  basket.refreshIndices();
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
});

// Отправлена форма заказа
// events.on('order:submit', () => {
//     api.orderLots(appData.order)
//         .then((result) => {
//             const success = new Success(cloneTemplate(successTemplate), {
//                 onClick: () => {
//                     modal.close();
//                     appData.clearBasket();
//                     events.emit('auction:changed');
//                 }
//             });

//             modal.render({
//                 content: success.render({})
//             });
//         })
//         .catch(err => {
//             console.error(err);
//         });
// });

// // Изменилось состояние валидации формы
// events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
//     const { email, phone } = errors;
//     order.valid = !email && !phone;
//     order.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
// });

// // Изменилось одно из полей
// events.on(/^order\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
//     appData.setOrderField(data.field, data.value);
// });

// // Открыть форму заказа
// events.on('order:open', () => {
//     modal.render({
//         content: order.render({
//             phone: '',
//             email: '',
//             valid: false,
//             errors: []
//         })
//     });
// });

// // Открыть активные лоты
// events.on('bids:open', () => {
//     modal.render({
//         content: createElement<HTMLElement>('div', {}, [
//             tabs.render({
//                 selected: 'active'
//             }),
//             bids.render()
//         ])
//     });
// });

// // Открыть закрытые лоты
// events.on('basket:open', () => {
//     modal.render({
//         content: createElement<HTMLElement>('div', {}, [
//             tabs.render({
//                 selected: 'closed'
//             }),
//             basket.render()
//         ])
//     });
// });

// // Изменения в лоте, но лучше все пересчитать
// events.on('auction:changed', () => {
//     page.counter = appData.getClosedLots().length;
//     bids.items = appData.getActiveLots().map(item => {
//         const card = new BidItem(cloneTemplate(cardBasketTemplate), {
//             onClick: () => events.emit('preview:changed', item)
//         });
//         return card.render({
//             title: item.title,
//             image: item.image,
//             status: {
//                 amount: item.price,
//                 status: item.isMyBid
//             }
//         });
//     });
//     let total = 0;
//     basket.items = appData.getClosedLots().map(item => {
//         const card = new BidItem(cloneTemplate(soldTemplate), {
//             onClick: (event) => {
//                 const checkbox = event.target as HTMLInputElement;
//                 appData.toggleOrderedLot(item.id, checkbox.checked);
//                 basket.total = appData.getTotal();
//                 basket.selected = appData.order.items;
//             }
//         });
//         return card.render({
//             title: item.title,
//             image: item.image,
//             status: {
//                 amount: item.price,
//                 status: item.isMyBid
//             }
//         });
//     });
//     basket.selected = appData.order.items;
//     basket.total = total;
// })

// // Открыть лот
// events.on('card:select', (item: LotItem) => {
//     appData.setPreview(item);
// });

// // Изменен открытый выбранный лот
// events.on('preview:changed', (item: LotItem) => {
//     const showItem = (item: LotItem) => {
//         const card = new AuctionItem(cloneTemplate(cardPreviewTemplate));
//         const auction = new Auction(cloneTemplate(auctionTemplate), {
//             onSubmit: (price) => {
//                 item.placeBid(price);
//                 auction.render({
//                     status: item.status,
//                     time: item.timeStatus,
//                     label: item.auctionStatus,
//                     nextBid: item.nextBid,
//                     history: item.history
//                 });
//             }
//         });

//         modal.render({
//             content: card.render({
//                 title: item.title,
//                 image: item.image,
//                 description: item.description.split("\n"),
//                 status: auction.render({
//                     status: item.status,
//                     time: item.timeStatus,
//                     label: item.auctionStatus,
//                     nextBid: item.nextBid,
//                     history: item.history
//                 })
//             })
//         });

//         if (item.status === 'active') {
//             auction.focus();
//         }
//     };

//     if (item) {
//         api.getLotItem(item.id)
//             .then((result) => {
//                 item.description = result.description;
//                 item.history = result.history;
//                 showItem(item);
//             })
//             .catch((err) => {
//                 console.error(err);
//             })
//     } else {
//         modal.close();
//     }
// });


// // Блокируем прокрутку страницы если открыта модалка
// events.on('modal:open', () => {
//     page.locked = true;
// });

// // ... и разблокируем
// events.on('modal:close', () => {
//     page.locked = false;
// });

// // Получаем лоты с сервера
// api.getLotList()
//     .then(appData.setCatalog.bind(appData))
//     .catch(err => {
//         console.error(err);
//     });
