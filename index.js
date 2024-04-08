import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import TelegramBot from 'node-telegram-bot-api'
import {
	getProducts,
	postProduct,
	removeProduct,
} from './controller/ProductController.js'
const token = '6940538154:AAHva2agTSA87Kear1shOv5xIfo4-HkSKPc'

const bot = new TelegramBot(token, { polling: true })

// const webAppUrl = 'https://strong-mousse-d4d1c0.netlify.app' //- netlify static(for production)
const webAppUrl = 'https://fly-deciding-ray.ngrok-free.app' // - ngrok dynamic(for testing)
// перед продакшен не забыть изменить в botfather копку /setmenubutton
const app = express()

app.use(express.json())
app.use(cors())
const DBURL =
	'mongodb+srv://artemverk05:qqQQ220767@nikita-shop.hvg5uv7.mongodb.net/?retryWrites=true&w=majority&appName=nikita-shop'
mongoose.connect(DBURL).then(() => console.log('db is ok'))
bot.on('message', async msg => {
	const chatId = msg.chat.id
	const text = msg.text
	if (text === '/start') {
		await bot.sendMessage(chatId, 'Ниже появится кнопка входа', {
			reply_markup: {
				inline_keyboard: [
					[{ text: 'Зайти в интернет-магазин', web_app: { url: webAppUrl } }],
				],
			},
		})
	} else if (text === '/admin') {
		await bot.sendMessage(chatId, 'Вот ваша страница админ панели:', {
			reply_markup: {
				inline_keyboard: [
					[
						{
							text: 'Зайти в админ панель',
							web_app: { url: webAppUrl + '/admin' },
						},
					],
				],
			},
		})
	}
})

app.post('/web-data', async (req, res) => {
	const { queryId, totalPrice, products } = req.body
	let messageText = 'Поздравляю с покупкой, вы приобрели товар: \n'
	products.forEach((obj, i) => {
		messageText += `${i + 1}) ${obj.title} x${obj.counter}\n`
	})
	messageText += `На сумму ${totalPrice}₽`
	try {
		await bot.answerWebAppQuery(queryId, {
			type: 'article',
			id: queryId,
			title: 'Успешная покупка',
			input_message_content: {
				message_text: messageText,
			},
		})
		res.status(200).json({})
	} catch (err) {
		await bot.answerWebAppQuery(queryId, {
			type: 'article',
			id: queryId,
			title: 'Неудачная покупка',
			input_message_content: { message_text: `Ошибка покупки` },
		})
		res.status(500).json({})
	}
})
app.post('/products', postProduct)
app.delete('/products/:id', removeProduct)
app.get('/products', getProducts)
const PORT = 8000
app.listen(PORT, () => console.log(`server started on PORT ${PORT}`))
