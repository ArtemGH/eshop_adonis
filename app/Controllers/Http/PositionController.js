'use strict'
const Position = use('App/Models/Position')
const Logger = use('Logger')

class PositionController {
  async show({request,view, auth}) {
    Logger.info(request.all())
    let data =  await Position.show(request.all().page,request.all().filter, request.all().cat,auth)
    return  view.render('positions',data)
  }
  async show_one({request,view, auth}) {
    let data =  await Position.show_one(request.all().pos,auth)
    return  view.render('position',data)
  }
  async check_shopping({request,response, auth}){
    let req = (request.raw())
    req = JSON.parse(req)
    try {
      req.sum = Number(req.sum)
      req.CNT = Number(req.CNT)
      req.pos.length = Number(req.pos.length)
    } catch (e) {
      req.sum = 0
      req.CNT = 0
      req.pos.length = 0
    }

    let answer = {sum:0,CNT:req.CNT,pos:req.pos}
    let pos_in_base = await Position.show_items(req.pos)
    let b=false

    for (let i=0; i<answer.pos.length;i++){
      b=false;
      for (let j=0; j<pos_in_base.rows.length;j++){
        if (pos_in_base.rows[j].id == answer.pos[i].id){
          b=true
          answer.pos[i].price = pos_in_base.rows[j].pos_prise
          answer.pos[i].posname = pos_in_base.rows[j].pos_name
        }
      }
      if (b==false){answer.pos[i].CNT=0}
    }
    answer.sum = 0
    for (let i=0; i<answer.pos.length;i++){
      answer.sum = answer.sum + answer.pos[i].CNT*answer.pos[i].price
    }
    response.json(answer);
  }
  async show_shopping({request,view, auth}) {
    let req = request.all()
    let answer = {
      time_marker: new Date().getTime(),
      user: auth.user,
      user_can_do: [],
      filter: req.filter,
      page_count: 0,
      pages_nav: [],
      req:req,
    }
    try {
      answer.user_can_do = JSON.parse(auth.user.user_can_do)
    }catch{
      answer.user_can_do = []
    }
    return  view.render('shopping',answer)
  }
}

module.exports = PositionController
