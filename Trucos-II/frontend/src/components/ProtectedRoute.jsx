const express = require("express")
const router = express.Router()

const Product = require("../models/Product")

router.post("/", async (req, res) => {

    try {

        const product = new Product(req.body)

        const savedProduct = await product.save()

        res.json(savedProduct)

    } catch (error) {

        res.status(500).json({ error: error.message })

    }

})
module.exports = router