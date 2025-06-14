# Как добавить плагин?

Скопируйте папку YaGame в  <Путь к Construct 2>\exporters\html5\plugins
В Construct 2 добавьте объект YdGame (только один на сцену)

# Как протестировать плагин локально?

Импортируйте файл test-ysdk.js в Project Bar -> Files
Добавьте в папку <Путь к Construct 2>\exporters\html5\templates все файлы из папки templates

# Как работают методы?

Для просмотра 90% функционала можете посмотреть в проекте-примере в папке example
Все другие функции имеют простое описание, можете изучить их по описанию

# Руководство по методам

Добавьте один объект **`YdGame`** на любой макет — все события и действия
будут относиться к нему.

---

## 1. Условия (Triggers / Checks)

| Событие | Когда срабатывает |
|---------|------------------|
| **`OnAdvOpened`** | Открылся любой рекламный блок (баннер или видео) |
| **`OnAdvClosed`** | Любая реклама закрыта |
| **`CanShowFullscreenAdv`** | Проверка: можно ли сейчас показать полноэкранную рекламу |
| **`OnFullscreenAdvOpened`** | Открылся полноэкранный баннер |
| **`OnFullscreenAdvClosed`** | Закрылся полноэкранный баннер |
| **`OnFullscreenAdvError`** | Ошибка показа полноэкранного баннера |
| **`OnRewardAdvOpened`** | Открылось вознаграждаемое видео |
| **`OnRewardAdvClosed`** | Вознаграждаемое видео закрыто |
| **`OnRewardAdvError`** | Ошибка показа вознаграждаемого видео |
| **`OnRewarded`** | Пользователь досмотрел видео и получил награду |
| **`OnPlayerRecordUpdated`** | Личная запись игрока в таблице лидеров обновлена |
| **`OnLeaderboardEntriesGetted`** | Список записей лидеров загружен |
| **`OnPlayerRecordGetted`** | Загружена запись игрока в таблице лидеров |
| **`OnLeaderboardError`** | Любая ошибка работы с таблицей лидеров |
| **`OnPlayerAuth`** | Игрок дал доступ к профилю (полная авторизация) |
| **`HasEnvironmentData`** | Проверка: получены ли данные окружения |
| **`HasPayload`** | Проверка: передан ли payload в URL игры |
| **`OnCloudDataUpdatedSuccess`** | Данные `player.setData` успешно отправлены |
| **`OnCloudStatsUpdatedSuccess`** | Статистика `player.setStats` успешно отправлена |
| **`OnCloudDataGetted`** | Загружены пользовательские данные из облака |
| **`OnCloudStatsGetted`** | Загружена статистика из облака |
| **`OnCloudError`** | Ошибка при работе с облачными данными/статистикой |
| **`OnPurchasesInit`** | Платежная подсистема инициализирована |
| **`OnPurchaseSuccess`** | Покупка завершилась успешно |
| **`OnPurchaseError`** | Покупка завершилась ошибкой/отказом |
| **`OnGetPurchasesSuccess`** | Список покупок успешно получен |
| **`OnGetCatalogSuccess`** | Каталог товаров успешно получен |
| **`OnCanReviewYes`** | SDK разрешает показать окно оценки игры |
| **`OnCanReviewNo`** | SDK не разрешает показывать окно оценки (см. причину) |
| **`OnRequestReviewComplete`** | Окно оценки закрыто (оценка поставлена или отмена) |
| **`OnSDKInitialized`** | SDK инициализирован успешно |
| **`OnSDKInitFailed`** | SDK не инициализировался |

---

## 2. Действия

| Действие | Параметры | Что делает |
|----------|-----------|-----------|
| **`ShowFullScreenAdv`** | — | Показывает полноэкранную рекламу |
| **`ShowRewardAdv`** | `rewardId` | Показывает вознаграждаемое видео |
| **`UpdateLeaderboardRecord`** | `lbName`, `value` | Записывает новый результат игрока в таблицу лидеров |
| **`GetPlayerRecordInLeanderboard`** | `lbName` | Загружает запись игрока из таблицы лидеров |
| **`GetLeaderboardEntries`** | `lbName`, `qtyTop` | Загружает верхние позиции таблицы лидеров |
| **`GetLeaderboardEntriesWithPlayer`** | `lbName`, `qtyTop`, `qtyAround` | Загружает позиции + игроков вокруг пользователя |
| **`AuthPlayer`** | — | Запрашивает у игрока доступ к полному профилю |
| **`SetCloudData`** | `key`, `value` | Сохраняет строковые данные в облаке |
| **`GetCloudData`** | `key ⎯ или пусто` | Загружает данные (один ключ или все) |
| **`SetCloudStats`** | `key`, `number` | Сохраняет числовую статистику |
| **`GetCloudStats`** | `key ⎯ или пусто` | Загружает статистику |
| **`InitPurchases`** | `signed (true/false)` | Инициализирует платежи |
| **`Purchase`** | `productId`, `payload` | Запускает покупку товара |
| **`GetPurchases`** | — | Загружает список покупок пользователя |
| **`ConsumePurchase`** | `token` | Помечает покупку как использованную |
| **`GetCatalog`** | — | Загружает каталог товаров |
| **`CheckCanReview`** | — | Проверяет, может ли игрок оценить игру |
| **`RequestReview`** | — | Открывает всплывающее окно оценки игры |

---

## 3. Выражения

| Выражение | Что возвращает |
|-----------|----------------|
| **`IsLastFullscreenAdvShowed`** | `1` если баннер был показан, иначе `0` |
| **`LastFullscreenAdvError`** | Последняя ошибка баннера |
| **`LastRewardId`** | ID последнего вознаграждаемого видео |
| **`LastRewardError`** | Последняя ошибка вознаграждаемого видео |
| **`LeaderboardPlayerRecord(lbName)`** | Текущий рекорд игрока в таблице |
| **`HasLeaderboardEntries(lbName)`** | `1` если есть загруженные записи |
| **`GetLeaderboardEntriesLength(lbName)`** | Количество загруженных записей |
| **`GetPlayerNameInLeaderboardEntries(lbName, idx)`** | Имя игрока по индексу |
| **`GetPlayerScoreInLeaderboardEntries(lbName, idx)`** | Счёт игрока по индексу |
| **`FlagValue(flagName)`** | Значение флага из Remote Config |
| **`PlayerName`** | Имя игрока |
| **`PlayerPayingStatus`** | Статус платежеспособности (`pay / non_pay / unknown`) |
| **`PlayerIsAuth`** | `1`, если игрок авторизован |
| **`PlayerId`** | Уникальный ID игрока |
| **`IsEnvironmentLoaded`** | `1`, если данные окружения загружены |
| **`IsMobile / IsTablet / IsDesktop / IsTV`** | `1/0` тип устройства |
| **`AppId`** | Идентификатор приложения в Yandex Games |
| **`Lang`** | Локаль игрока (например `ru`) |
| **`Payload`** | Строка payload из URL игры |
| **`CloudDataValue(key)`** | Кешированное значение данных по ключу |
| **`CloudStatsValue(key)`** | Кешированное числовое значение статистики |
| **`LastCloudError`** | Последняя ошибка облака |
| **`CloudDataExists(key)` / `CloudStatsExists(key)`** | `1`, если ключ существует в кеше |
| **`LastPurchaseError`** | Последняя ошибка покупок |
| **`PurchasesCount`** | Количество покупок в кеше |
| **`PurchaseProductId(idx)`** | productID покупки по индексу |
| **`PurchaseToken(idx)`** | purchaseToken покупки |
| **`CatalogCount`** | Сколько товаров в загруженном каталоге |
| **`CatalogProductId / Price / Title / Description (idx)`** | Данные товара |
| **`CatalogProductCurrencyImage(idx, size)`** | URL иконки валюты |
| **`LastPurchaseProductId`** | productID последней покупки |
| **`LastPurchaseToken`** | purchaseToken последней покупки |
| **`LastReviewReason`** | Причина `canReview = false` |
| **`LastReviewError`** | Последняя ошибка при запросе отзыва |
| **`LastFeedbackSent`** | `1`, если оценка поставлена |
| **`LastSDKInitError`** | Текст последней ошибки инициализации SDK |
| **`IsSDKInitialized`** | `1`, если SDK успешно инициализирован |

---

*Документация составлена для версии **1.0** плагина «YdGame».*  

_Made with ❤️ by Петров Андрей_