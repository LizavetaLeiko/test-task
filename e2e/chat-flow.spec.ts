import { expect, test, type Route } from '@playwright/test'

const REPLY_TEXT = 'Привет из MAX!'
const CHAT_ID = '79991234567@c.us'

test('user logs in, sends a message and sees the reply', async ({ page }) => {
  let messageSent = false
  let replyDelivered = false

  await page.route('**/api.green-api.com/**', (route: Route) => {
    const url = route.request().url()

    if (url.includes('/getStateInstance/')) {
      return route.fulfill({ json: { stateInstance: 'authorized' } })
    }
    if (url.includes('/sendMessage/')) {
      messageSent = true
      return route.fulfill({ json: { idMessage: 'srv-1' } })
    }
    if (url.includes('/receiveNotification/')) {
      if (messageSent && !replyDelivered) {
        replyDelivered = true
        return route.fulfill({
          json: {
            receiptId: 1,
            body: {
              typeWebhook: 'incomingMessageReceived',
              timestamp: 1700000000,
              idMessage: 'reply-1',
              senderData: { chatId: CHAT_ID, sender: CHAT_ID },
              messageData: {
                typeMessage: 'textMessage',
                textMessageData: { textMessage: REPLY_TEXT },
              },
            },
          },
        })
      }
      return route.fulfill({ status: 200, body: '' })
    }
    if (url.includes('/deleteNotification/')) {
      return route.fulfill({ json: { result: true } })
    }
    return route.continue()
  })

  await page.goto('/')

  await page.getByLabel('idInstance').fill('1101')
  await page.getByLabel('apiTokenInstance').fill('token')
  await page.getByRole('button', { name: 'Войти' }).click()

  await page.getByRole('button', { name: 'Новый чат' }).click()
  await page.getByLabel('Номер телефона').fill('+7 999 123 45 67')
  await page.getByRole('button', { name: 'Создать чат' }).click()

  await page.getByLabel('Сообщение').fill('Тестовое сообщение')
  await page.getByRole('button', { name: 'Отправить' }).click()

  const conversation = page.getByRole('main')
  await expect(conversation.getByText('Тестовое сообщение')).toBeVisible()
  await expect(conversation.getByText(REPLY_TEXT)).toBeVisible()
})
