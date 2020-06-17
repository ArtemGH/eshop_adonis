'use strict'
const Order = use('App/Models/Order')
const OrdersPosition = use('App/Models/OrdersPosition')
const Database = use('Database')
const Logger = use('Logger')
const path = require('path')
const fs = require('fs')


class OrderController {
  async Create_Order({request,response, auth}){
    let req = (request.raw())
    req = JSON.parse(req)
    let answer =  await Order.CreateOrder(auth.user.id,req)
    response.json(answer);
  }

  async show({request,view, auth}) {
    let data =  await Order.Show(request.all().page,request.all().filter, auth)
    return  view.render('orders',data)
  }

  async UpDateOrdersPage({request,response,view, auth}) {
    let data =  await Order.Show(request.all().page,request.all().filter, auth)
    response.json(data);
  }

  async get_edit_order_window({ request, response, auth }) {
    let reqpath = path.join(__dirname, '../../../')
    let req = request.all()
    let data={modal_form: "", modal_data:""}
    data.modal_form = fs.readFileSync("resources/modal_forms/order_control.html", "utf8");
    data.modal_data = await Order.Show_one(req.order_id,auth) ;
    response.json(data);
  }

  async ExecOrder({request,response, auth}){
    let req = request.raw()
    req = JSON.parse(req)
    let answer =  await Order.ExecOrder(auth.user.id,req)
    response.json(answer);
  }

  async CancelOrder({request,response, auth}){
    let req = request.raw()
    req = JSON.parse(req)
    let answer =  await Order.CancelOrder(auth.user.id,req)
    response.json(answer);
  }

  async ReturnOrder({request,response, auth}){
    let req = request.raw()
    req = JSON.parse(req)
    let answer =  await Order.ReturnOrder(auth.user.id,req)
    response.json(answer);
  }

}

module.exports = OrderController
