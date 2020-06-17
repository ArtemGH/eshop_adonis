'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Database = use ('Database')
const Logger = use ('Logger')

class Order extends Model {
  static async CreateOrder(user_id,shopping) {
    let id = 0
    id = await Database.raw("insert into orders(user_id, order_status, order_sum) "+
      "values("+user_id+", 'Открыт', "+shopping.sum+") returning(id);");
    id = Number(id.rows[0].id)
    for (let i=0; i<shopping.pos.length; i++) {
      await Database.raw("insert into orders_positions(order_id, order_pos_id, order_pos_name, order_pos_prise, order_pos_count, order_pos_sum) "+
        "values("+id+", "+shopping.pos[i].id+", '"+shopping.pos[i].posname+"', "+shopping.pos[i].price+", "+shopping.pos[i].CNT+", "+shopping.pos[i].price*shopping.pos[i].CNT+");");
    }
    return id
  }

  static async Show(page_n, filter, auth) {
    if (filter == undefined) {filter = ''}
    if (page_n == undefined) {page_n = 1}
    if (auth.user==null){
      let user_can_do = []
    }else{
      let user_can_do = JSON.parse(auth.user.user_can_do)
    }
    let sql_filter = ''
    if(user_can_do.indexOf('order')  != -1) {
      if (filter==''){
        sql_filter = ''
      }else{
        sql_filter = "where ((order_status like '%"+filter+"%') or (user_login like '%"+filter+"%'))"
      }
    }else{
      if (filter==''){
        sql_filter = "where (user_id = "+auth.user.id+")"
      }else{
        sql_filter = "where ((user_id = "+auth.user.id+")and((order_status like '%"+filter+"%') or (user_login like '%"+filter+"%')))"
      }
    }
    let answer = {
      time_marker:new Date().getTime(),
      user: auth.user,
      user_can_do: [],
      filter: filter,
      page_n: page_n,
      page_count:0,
      pages_nav:[],
      record_count: await Database.raw("select count(*) as ord_count "+
        "from orders left join users on orders.user_id = users.id "+sql_filter),
      data: await Database.raw("select orders.id, orders.order_status, orders.order_sum, orders.created_at, user_login "+
        "from orders left join users on orders.user_id = users.id "+
        sql_filter+
        " order by orders.created_at asc limit 20 offset "+(Number(page_n)-1)*20+""),
      record_count_on_page:0,
    }

    answer.record_count = Number(answer.record_count.rows[0].ord_count)
    answer.data = answer.data.rows
    answer.record_count_on_page=Number(answer.record_count)-(Number(page_n)-1)*20;
    if (answer.record_count_on_page>20) {answer.record_count_on_page=20}
    if (answer.record_count_on_page<0) { answer.record_count_on_page=0 }
    answer.page_count=Math.trunc(answer.record_count/20);
    if ((answer.page_count<answer.record_count/20) || (answer.record_count==0)){
      answer.page_count=answer.page_count+1;
    }
    for (let i = page_n-3; i<=page_n+3; i++) {
      if ((i > 0) && (i <= answer.page_count)) {
        answer.pages_nav.push(i)
      }
    }
    try {
      answer.user_can_do = JSON.parse(auth.user.user_can_do)
    }catch (e) {
      answer.user_can_do = []
    }
    return answer
  }

  static async Show_one(order_id, auth) {
    if (auth.user==null){
      let user_can_do = []
    }else{
      let user_can_do = JSON.parse(auth.user.user_can_do)
    }
    let answer = {
      time_marker:new Date().getTime(),
      user: auth.user,
      user_can_do: [],
      page_count:0,
      pages_nav:[],
      record_count: 1,
      data: await Database.raw("select order_id, order_pos_name, order_pos_prise, order_pos_count, order_pos_sum, order_status, order_sum, orders.created_at, user_login, user_first_name, user_last_name, user_tel, user_email "+
                               "from orders_positions left join (orders left join users on orders.user_id = users.id) on orders_positions.order_id = orders.id where orders_positions.order_id = "+order_id+";"),
      record_count_on_page:0,
    }
    answer.data = answer.data.rows
    return answer.data
  }

  static async ExecOrder(user_id,req) {
    let id = 0
    await Database.raw("update orders set order_status='Выполнен' where (id="+req.order_id+");");
    return id
  }

  static async ReturnOrder(user_id,req) {
    let id = 0
    await Database.raw("update orders set order_status='Открыт' where (id="+req.order_id+");");
    return id
  }

  static async CancelOrder(user_id,req) {
    let id = 0
    await Database.raw("update orders set order_status='Отменен' where (id="+req.order_id+");");
    return id
  }

  OrdersPosition () {
    return this.hasMany('App/Models/OrdersPosition', 'id', 'order_id')
  }

}

module.exports = Order
