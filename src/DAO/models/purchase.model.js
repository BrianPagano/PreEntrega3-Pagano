const mongoose = require ('mongoose')

const purchaseCollection = 'purchase'

const purchaseSchema = new mongoose.Schema({
     code: String,
     purchase_datetime: { type: Date, default: Date.now }, //fecha y hora exacta en la que se realizo la compra
     amount: Number, //Precio total de compra
     purchaser: String, //string de correo del usuario asociado al carrito
  });

const Purchase = mongoose.model(purchaseCollection, purchaseSchema)

module.exports = Purchase