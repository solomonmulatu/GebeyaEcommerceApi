const Cart = require('../../models/Cart')

//region add item To Cart
const addToCart=async (req,res)=>{
    const qty = Number.parseInt(req.body.qty);
    try{

        for(let x=0;x<req.body.length;x++) {
            const cart = await Cart.findOne({
                user_id: req.user._id
            });
            if (cart) {
                const indexFound = cart.items.findIndex(item => {
                    return item.product_id === req.body[x].product_id;
                });
                if (indexFound !== -1 && qty <= 0) {
                    cart.items.splice(indexFound, 1);
                } else if (indexFound !== -1) {
                    cart.items[indexFound].qty = cart.items[indexFound].qty + req.body[x].qty;
                } else if (req.body[x].qty > 0) {
                    cart.items.push({
                        product_id: req.body[x].product_id,
                        qty: req.body[x].qty
                    });
                }
                await cart.save()

            } else {

                const cartData = {
                    user_id: req.user._id,
                    items: [
                        {
                            product_id: req.body[x].product_id,
                            qty: req.body[x].qty
                        }
                    ]
                };
                let newCartItem = new Cart(cartData);
                await newCartItem.save();

            }
        }
        await res.status(201).json("Item Added To Cart");
    }catch (error) {
        res.status(500).send('Server error ' + error);

    }
}
//endregion

//region remove item from cart
const removeItemFromCart=async (req,res)=>{
    try{
        const {  product_id } = req.body;
        const cart = await Cart.findOne({
            user_id: req.user._id
        });
            const indexFound = cart.items.findIndex(item => {
                return item.product_id == product_id;
            });
            if (indexFound !== -1 ) {
                cart.items[indexFound].qty = cart.items[indexFound].qty - 1;

                if(cart.items[indexFound].qty===0){
                    cart.items=cart.items.filter((item)=>{
                        return item.product_id !==product_id
                    })
                    await cart.save();
                    await res.status(201).json(cart);
                }else {
                    await cart.save()
                    await res.status(201).json(cart);
                }



            }else {
                await res.status(400).json({errors: [{msg: 'Invalid Item'}]})

            }

    }catch (error) {
        res.status(500).send('Server error ' + error);


    }

}
//endregion


//region cart details
const cartDetail=async (req,res)=>{
    try{
        const cart = await Cart.findOne({
            user_id: req.user._id
        }).populate('items.product_id');

       if(!cart){
           await res.status(400).json({errors: [{msg: 'Your Cart Is Empty'}]})

       }else {
           await res.status(201).json(cart);

       }


    }catch (error) {
        res.status(500).send('Server error ' + error);


    }

}
//endregion



module.exports = {
    addToCart,
    removeItemFromCart,
    cartDetail
}
