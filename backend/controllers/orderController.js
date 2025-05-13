import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// placing user order for frontend

const placeOrder = async (req, res) => {

    const frontend_url = "http://localhost:5173";

    try{
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, {cartData:{}});

        const line_items = req.body.items.map((item) => {
            // Giả sử item.price đã là giá trị VND
            return {
                price_data: {
                    currency: 'vnd',
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: Math.round(item.price), // Làm tròn để đảm bảo là số nguyên
                },
                quantity: item.quantity,
            };
        });

        line_items.push({
            price_data: {
                currency: 'vnd',
                product_data: {
                    name: 'Phí giao hàng',
                },
                unit_amount: 20000, // Ví dụ: Phí giao hàng 20.000 VND
            },
            quantity: 1,
        });

        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: 'payment',
            payment_method_types: ['card'],
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        });

        res.json({success:true, session_url:session.url});
    }catch(error){
        console.log(error);
        res.json({success:false, message:"Error"});
    }
}

const verifyOrder = async(req, res) => {
    const { success, orderId } = req.body;
    try{
        if(success == "true"){
            await orderModel.findByIdAndUpdate(orderId, {payment:true});
            res.json({success:true, message:"Paid"});
        }else{
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false, message:"Not Paid"});
        }
    }catch(error){
        console.log(error);
        res.json({success:false, message:"Error"});
    }
}

// user orders for frontend
const userOrder = async(req, res) => {
    try{
        const orders = await orderModel.find({userId:req.body.userId});
        res.json({success:true, data:orders});
    }catch(error){
        console.log(error);
        res.json({success:false, message:"Error"});
    }
}

// Listing all orders for admin
const listOrders = async(req, res) => {
    try{
        const orders = await orderModel.find({});
        res.json({success:true, data:orders});
    }catch(error){
        console.log(error);
        res.json({success:false, message:"Error"});
    }
}

// api for placing order
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status updated" });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.json({ success: false, message: "Error" });
    }
};

export { placeOrder, verifyOrder, userOrder, listOrders, updateStatus };