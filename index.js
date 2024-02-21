import TelegramBot from 'node-telegram-bot-api'
import express from 'express'
import cors from 'cors'
const token = '6940538154:AAHva2agTSA87Kear1shOv5xIfo4-HkSKPc'

const bot = new TelegramBot(token, { polling: true })

const webAppUrl = 'https://stirring-salmiakki-f50182.netlify.app'
const app = express()

app.use(express.json())
app.use(cors())

bot.on('message', async msg => {
	const chatId = msg.chat.id
	const text = msg.text
	if (text === '/start') {
		await bot.sendMessage(chatId, 'Заполните форму', {
			reply_markup: {
				keyboard: [[{ text: 'Заполнить форму', web_app: { url: webAppUrl + '/form' } }]],
			},
		})
		await bot.sendMessage(chatId, 'Ниже появится кнопка входа', {
			reply_markup: {
				inline_keyboard: [[{ text: 'Зайти в интернет-магазин', web_app: { url: webAppUrl } }]],
			},
		})
	}
	if (msg?.web_app_data?.data) {
		try {
			const data = JSON.parse(msg?.web_app_data?.data)

			await bot.sendMessage(chatId, `Страна: ${data.country}`)
			await bot.sendMessage(chatId, `Улица: ${data.street}`)
			setTimeout(async () => {
				await bot.sendMessage(chatId, 'Спасибо за обратную связь')
			}, 3000)
		} catch (e) {
			console.log(e)
		}
	}
})
app.post('/web-data', async (req, res) => {
	const { queryId, products, totalPrice } = req.body
	try {
		await bot.answerWebAppQuery(queryId, {
			type: 'article',
			id: queryId,
			title: 'Успешная покупка',
			input_message_content: { message_text: `Поздравляю с покупкой вы приобрели товар на сумму: ${totalPrice}$` },
		})
		res.status(200).json({})
	} catch (err) {
		console.log(err)
		await bot.answerWebAppQuery(queryId, {
			type: 'article',
			id: queryId,
			title: 'Неудачная покупка',
			input_message_content: { message_text: `Ошибка покупки` },
		})
		res.status(500).json({})
	}
})
const PORT = 8000
app.listen(PORT, () => console.log(`server started on PORT ${PORT}`))
