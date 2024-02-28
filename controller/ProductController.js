import ProductModel from '../model/Product.js'
export const getProducts = async (req, res) => {
	const products = await ProductModel.find()
	res.status(200).json(products)
}
export const postProduct = async (req, res) => {
	const doc = new ProductModel({
		title: req.body.title,
		price: req.body.price,
		description: req.body.description,
		imageUrl: req.body.imageUrl,
	})
	const product = await doc.save()
	res.status(200).json(product)
}
export const removeProduct = async (req, res) => {
	await ProductModel.findOneAndDelete({ _id: req.params.id })
	res.status(200).json({})
}
