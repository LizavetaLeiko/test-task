# MAX Chat

Веб-интерфейс для отправки и получения текстовых сообщений в мессенджере **MAX** через сервис [GREEN-API](https://green-api.com/max). 
Прототип интерфейса — [web.max.ru](https://web.max.ru/).

Тестовое задание на должность «Фронтенд-разработчик React».

## Стек

- **React 19** + **TypeScript** (strict)
- **Vite 8** — сборка и dev-сервер
- **TanStack Query** — запросы, кэш, поллинг, ретраи
- **Zustand** — клиентское состояние (сессия/учётные данные)
- **Tailwind CSS v4** — стили
- **Vitest** + **Testing Library** + **MSW** — unit/integration-тесты
- **Playwright** — e2e (на следующих этапах)
- **ESLint** (+ `eslint-plugin-boundaries`) и **Prettier**
- **GitHub Actions** — CI

## Требования

- **Node.js ≥ 22** (см. `.nvmrc`). Vite 8 и тест-раннер не работают на Node 21 и ниже.

```bash
nvm use   # подхватит версию из .nvmrc
```

## Локальный запуск

```bash
npm install       # установка зависимостей
npm run dev       # dev-сервер на http://localhost:5173
```

Для работы приложения понадобятся учётные данные инстанса GREEN-API
(`idInstance`, `apiTokenInstance`) — их вводит пользователь на экране входа.

## Скрипты

| Команда                 | Назначение                                 |
| ----------------------- | ------------------------------------------ |
| `npm run dev`           | dev-сервер                                 |
| `npm run build`         | production-сборка (typecheck + vite build) |
| `npm run preview`       | локальный просмотр production-сборки        |
| `npm run typecheck`     | проверка типов                             |
| `npm run lint`          | ESLint (включая границы слоёв FSD)         |
| `npm run format`        | автоформат Prettier                        |
| `npm run test`          | unit/integration-тесты                     |
| `npm run test:coverage` | тесты с покрытием                          |
| `npm run test:e2e`      | e2e-тесты Playwright                        |

## Архитектура

Проект организован по методологии **Feature-Sliced Design**. Слои (сверху вниз):

```
src/
  app/        # провайдеры, глобальные стили, входная точка приложения
  pages/      # страницы (экраны)
  widgets/    # композиционные блоки UI
  features/   # пользовательские сценарии (отправка, приём, вход)
  entities/   # бизнес-сущности (сообщение, чат)
  shared/     # переиспользуемое: api-клиент GREEN-API, ui-kit, утилиты
```

Правило импортов — слой может зависеть только от слоёв строго ниже себя. Это
проверяется автоматически линтером (`eslint-plugin-boundaries`), нарушение
границ роняет CI.

## Взаимодействие с GREEN-API

- **Отправка** — `POST .../sendMessage` (`chatId`, `message`).
- **Получение** — HTTP API: long-polling `GET .../receiveNotification`, после
  обработки уведомление подтверждается через `DELETE .../deleteNotification/{receiptId}`.
- Номер получателя нормализуется в `chatId` формата `{phone}@c.us`.

### CORS

GREEN-API отдаёт `Access-Control-Allow-Origin: *`, поэтому запросы идут
**напрямую из браузера** — серверный прокси не требуется.

### Безопасность учётных данных

`idInstance`/`apiTokenInstance` вводятся пользователем и хранятся только на его
устройстве (в рамках сессии). Токен не покидает браузер и никуда, кроме самого
GREEN-API, не отправляется. Это осознанное ограничение фронтенд-приложения без
бэкенда — для продакшена запросы стоит проксировать через сервер, чтобы токен не
попадал в браузер.

## CI

На каждый push в `main` и pull request GitHub Actions прогоняет:
`typecheck → lint → format check → tests → build`.
