import mongoose from 'mongoose'
const ProductSchema = new mongoose.Schema({
	title: { type: String, required: true },
	price: { type: Number, required: true },
	description: { type: String, default: 'Для этого товара нет описания' },
	imageUrl: {
		type: String,
		default:
			'https://trial-sport.ru/images/catalog/miv9214_8541_c3h_0_2865452.jpg',
	},
})

export default mongoose.model('Product', ProductSchema)
