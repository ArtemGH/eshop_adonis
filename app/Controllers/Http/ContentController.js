'use strict'
const Position = use('App/Models/Position')
const Cat = use('App/Models/Cat')
const Logger = use('Logger')
const fs = require('fs')
const path = require('path')

class ContentController {
  async show({request,view, auth}) {
    let content_type = await request.all().ContentType
    if (content_type=="Categories") {
      let data =  await Cat.show(request.all().page,request.all().filter,auth)
      return  view.render('content_cats',data)
    }else{
      let data = await Position.show(request.all().page,request.all().filter, request.all().cat_id,auth)
      return  view.render('content_pos',data)
    }
  }

  async get_edit_position_window({ request, response, auth }) {
    let reqpath = path.join(__dirname, '../../../')
    let req = request.all()
    let data=''
    try{
      data = fs.readFileSync(reqpath+'\\public\\content\\img\\pos\\pos_'+req.pos_id+'.jpg')
    }catch (e) {
      data = fs.readFileSync(reqpath+'\\public\\content\\img\\pos\\pos_0.jpg')
    }
    fs.writeFileSync(reqpath+'\\public\\temp\\edit_pos_'+req.username+req.pos_id+'.jpg', data)
    let edit_position_window = fs.readFileSync("resources/modal_forms/edit_position.html", "utf8");
    response.json(edit_position_window);
  }

  async get_edit_position_text({ request, response, auth }) {
    let reqpath = path.join(__dirname, '../../../')
    let req = request.all()
    if (req.pos_id==undefined) { req.pos_id = 0 }
    let data = fs.readFileSync(reqpath+"\\public\\content\\txt\\pos_"+req.pos_id+".html")
    if (data == undefined) {data = ""}
    response.send(data)
  }

  async set_foto_for_edit_pos({ request, response, auth }){
    let reqpath = path.join(__dirname, '../../../')
    let req = await request.all()
    fs.writeFileSync(reqpath+'\\public\\temp\\edit_pos_'+req.username+req.pos_id+'.jpg',req.new_image.split(',')[1], {encoding: 'base64'})
    response.json("ok");
  }

  async save_position({ request, response, auth }){
    let data = await Position.save_position(request.all().page_n, request.all().filter, request.all().cat_id, request.all().pos_id, request.all().pos_name, request.all().pos_price, request.all().text, auth)
    data.user = ""
    response.json((data))
  }

  async delete_position({ request, response, auth }){
    let data = await Position.delete_position(request.all().page_n, request.all().filter, request.all().cat_id, request.all().pos_id, auth)
    data.user = ""
    response.json((data))
  }

  async get_edit_cat_window({ request, response, auth }) {
    let reqpath = path.join(__dirname, '../../../')
    let req = request.all()
    let data = ''

    try{
      data = fs.readFileSync(reqpath+'\\public\\content\\img\\cat\\cat_'+req.cat_id+'.jpg')
    }catch (e) {
      data = fs.readFileSync(reqpath+'\\public\\content\\img\\cat\\cat_0.jpg')
    }
    fs.writeFileSync(reqpath+'\\public\\temp\\edit_cat_'+req.username+req.cat_id+'.jpg', data)
    let edit_cat_window = fs.readFileSync("resources/modal_forms/edit_cat.html", "utf8");
    response.json(edit_cat_window);
  }

  async set_foto_for_edit_cat({ request, response, auth }){
    let reqpath = path.join(__dirname, '../../../')
    let req = await request.all()
    fs.writeFileSync(reqpath+'\\public\\temp\\edit_cat_'+req.username+req.cat_id+'.jpg',req.new_image.split(',')[1], {encoding: 'base64'})
    response.json("ok");
  }

  async save_cat({ request, response, auth }){
    let data = await Cat.save_cat(request.all().page_n, request.all().filter, request.all().cat_id, request.all().cat_name, auth)
    data.user = ""
    response.json((data))
  }

  async delete_cat({ request, response, auth }){
    let data = await Cat.delete_cat(request.all().page_n, request.all().filter, request.all().cat_id, auth)
    data.user = ""
    response.json((data))
  }

}

module.exports = ContentController
