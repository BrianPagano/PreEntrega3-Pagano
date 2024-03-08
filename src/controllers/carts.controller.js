const { Router } = require('express')
const router = Router()

const CartService = require ('../services/cart.service.js')
const ProductsService = require ('../services/products.service.js')
const calculateSubtotalAndTotal = require('../utils/calculoTotales-Cart.util.js')

//crear un carrito
router.post('/', async (req, res) => {
    try {
        const result = await CartService.addCart() // Capturar el resultado de addCart()
        res.status(201).json({ message: 'Carrito creado correctamente', cid: result.cid })
    } catch (error) {
        console.error('Error al cargar productos:', error.message)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

//mostrar el carrito elegido
router.get('/:cid', async (req, res) => {
    try {
        //utilizo params el id
        const { cid } = req.params
        //realizo una busqueda por id
        const filterById =  await CartService.getCartByID(cid)
        if (!filterById) {
            return res.status(404).json({ error: 'El carrito con el ID buscado no existe.'})
        } else {
            // Calcular los subtotales y el total del carrito
            const { subtotal, total } = calculateSubtotalAndTotal(filterById.products)
              res.render ('cart', { 
                subtotal,
                filterById,
                total,
                style: 'style.css',})
        }
    } catch (error) {
        console.error ('Error al obtener el carrito:', error.message)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

//agregar producto indicando el carrito (cid) y el producto (pid)
router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params
        const product = await ProductsService.getProductByID(pid)

        if (!product) {
            return res.status(404).json({ error: 'El producto con el ID proporcionado no existe.' })
        }
        const result = await CartService.addProductInCart(cid, pid)
        if (result.success) {
            // Actualizar el valor de user.cart en la sesión del usuario
            req.session.user.cart = cid
            res.status(201).json({ message: result.message })
        } else {
            res.status(500).json({ error: result.message })
        }
    } catch (error) {
        console.error('Error al cargar productos:', error.message)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

//actualizar el carrito con un array de productos 
router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params
        const { products } = req.body

        const result = await CartService.updateCart(cid, products)

        if (result.success) {
            res.status(201).json({ message: result.message })
        } else {
            res.status(500).json({ error: result.message })
        }
    } catch (error) {
        console.error('Error al actualizar los productos del carrito:', error.message)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

//actualizar producto pasando el cid y pid
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params
        const { quantity } = req.body

        const result = await CartService.updateProductQuantity(cid, pid, quantity)

        if (result.success) {
            res.status(200).json({ message: result.message })
        } else {
            res.status(500).json({ error: result.message })
        }
        } catch (error) {
            console.error('Error al actualizar la cantidad del producto:', error.message)
            res.status(500).json({ error: 'Internal Server Error' })
        }
})



//borrar un solo producto del carrito enviando por parametros el cid y pid
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params
        const result = await CartService.deleteProductInCart(cid, pid)

        if (result.success) {
            res.status(201).json({ message: result.message })
        } else {
            res.status(500).json({ error: result.message })
        }
    } catch (error) {
        console.error('Error al eliminar el producto:', error.message)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

//delete de todos los productos del carrito
router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params
        const result = await CartService.deleteProductsInCart(cid)

        if (result.success) {
            res.status(201).json({ message: result.message })
        } else {
            res.status(500).json({ error: result.message })
        }
    } catch (error) {
        console.error('Error al eliminar los productos:', error.message)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

module.exports = router
 