import {Router} from 'express';
import asyncHandler from 'express-async-handler';
import { BAD_REQUEST } from '../constants/http_status';
import { OrderStatus } from '../constants/order_status';
import { OrderModel } from '../models/order.model';
import auth from '../middlewares/auth.mid';
import { Schema, Types, model } from 'mongoose';

const router = Router();
router.use(auth);

router.get('/', asyncHandler( async (req, res) => {
    const orders = await OrderModel.find();
    res.send(orders);
}))

router.get('/:userName', asyncHandler( async (req, res) => {
    const orders = await OrderModel.find({ name: req.params.userName });
    res.send(orders);
}))

//working on it
router.get('/:userId', asyncHandler( async (req, res) => {
    const orders = await OrderModel.find({ id: req.params.userId });
    res.send(orders);
}))

router.get('/', asyncHandler( async (req, res) => {
    const orders = await OrderModel.find();
    res.send(orders);
}))

var id = 0;
router.post('/create',
asyncHandler(async (req:any, res:any) => {
    const requestOrder = req.body;

    if(requestOrder.items.length <= 0){
        res.status(BAD_REQUEST).send('Cart Is Empty!');
        return;
    }

    await OrderModel.deleteOne({
        user: req.user.id,
        status: OrderStatus.NEW
    });

    const newOrder = new OrderModel({...requestOrder,user: req.user.id});
    await newOrder.save();
    // console.log("new order", newOrder);
    res.send(newOrder);
})
)


router.get('/newOrderForCurrentUser/:id', asyncHandler( async (req: any,res ) => {
    const order= await getNewOrderForCurrentUser(req.params.id);
    if(order) res.send(order);
    else res.status(BAD_REQUEST).send();
}))

router.post('/pay', asyncHandler( async (req:any, res) => {
    const {paymentId} = req.body;
    console.log('req',req.body);
    const order = await getNewOrderForCurrentUser(req.body._id);
    console.log('order',order)
    if(!order){
        res.status(BAD_REQUEST).send('Order Not Found!');
        return;
    }

    order.paymentId = paymentId;
    order.status = OrderStatus.PAYED;
    await order.save();

    res.send(order._id);
}))

router.get('/track/:id', asyncHandler( async (req, res) => {
    const order = await OrderModel.findById(req.params.id);
    res.send(order);
}))

router.get('/track/:userName', asyncHandler( async (req, res) => {
    const order = await OrderModel.find({ name: req.params.userName});
    res.send(order);
}))

async function getNewOrderForCurrentUser(req: any) {
    return await OrderModel.findOne({ _id: req, status: OrderStatus.NEW });
}

export default router;


