const Product = require('../../models/Product')

//region insert item
const insertItem = async (req, res) => {
    const {itemName, itemPicture, itemPrice, itemDescription, itemVendorName} = req.body;
    try {
        let item = new Product({
            itemName,
            itemPrice,
            itemPicture,
            itemDescription,
            itemVendorName
        });
        await item.save();
        if (item) {
            await res.status(201).json(item);

        }
    } catch (error) {
        res.status(500).send('Server error ' + error);

    }

}
//endregion


//region update item
const updateItem = async (req, res) => {
    const {itemName, itemPicture, itemPrice, itemDescription, itemVendorName} = req.body;
    const {itemId} = req.params;
    try {
        let item = await Product.findOneAndUpdate(
            {_id: itemId},
            {
                $set: {
                    itemName,
                    itemPrice,
                    itemPicture,
                    itemDescription,
                    itemVendorName
                }
            })
        await item.save()
        if (item) {
            await res.status(201).json(item);

        }

    } catch (error) {
        res.status(500).send('Server error ' + error);

    }
}
//endregion

//region delete item
const deleteItem = async (req, res) => {
    try {
        const {itemId} = req.params;
        let item = await Product.deleteOne({
            _id: itemId
        })
        if (item) {
            await res.status(201).json("item successfully deleted");

        }
    } catch (error) {
        res.status(500).send('Server error ' + error);

    }
}
//region delete item

//region item detail
const itemDetail = async (req, res) => {
    try {
        const {itemId} = req.params;
        let item = await Product.find({
            _id: itemId
        })
        if (item) {
            await res.status(201).json(item);

        } else {
            return res.status(400).json({errors: [{msg: 'invalid item id'}]})

        }
    } catch (error) {
        res.status(500).send('Server error ' + error);

    }
}
//endregion

//region get Product List
const productList = async (req, res) => {
    const {page = 1, limit = 2,sort='asc'} = req.body;
    let sortBy=1;
    if(sort==='desc'){
        sortBy=-1
    }

    try {
        let item = await Product.find({},
            ).sort({itemPrice: sortBy}).skip(((page - 1) * limit)).limit(limit * 1)
        if (item.length) {
            await res.status(201).json(item);

        } else {
            return res.status(400).json({errors: [{msg: 'There Is No Item'}]})

        }
    } catch (error) {
        res.status(500).send('Server error ' + error);

    }
}
//endregion

module.exports = {
    insertItem,
    updateItem,
    deleteItem,
    itemDetail,
    productList
}