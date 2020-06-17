'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Database = use('Database')
const Logger = use('Logger')
const path = require('path')
const fs = require('fs')

class Cat extends Model {
  position () {
    return this.hasMany('App/Models/Position', 'id', 'cat_id')
  }

  static async show (page_n, filter, auth) {
    if (page_n == undefined) {page_n = 1}
    if (filter == undefined) {filter = ''}
    try {
      page_n = Number(page_n)
    }catch (e) {
      page_n = 1
    }

    let answer = {
      time_marker:new Date().getTime(),
      user: auth.user,
      user_can_do: [],
      filter: filter,
      page_n:page_n,
      page_count:0,
      pages_nav:[],
      record_count: await Database.raw("select count(*) as cat_count from cats where cat_name like '%"+filter+"%'"),
      data: await Database.raw("select cats.id, cat_name, pos_count "+
        "from cats left join "+
        "(select cat_id, count(cat_id) as pos_count from positions group by cat_id) as p_count "+
        "on cats.id = p_count.cat_id "+
        "where cat_name like '%"+filter+"%' "+
        "order by cat_name asc limit 20 offset "+(Number(page_n)-1)*20+""),
      record_count_on_page:0,
    }
    for (let i=0; i<answer.data.rows.length;i++){
      if (answer.data.rows[i].pos_count == null) {answer.data.rows[i].pos_count = 0}
    }

    answer.record_count = Number(answer.record_count.rows[0].cat_count)
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

  static async save_cat(page_n, filter, cat_id, cat_name, auth){
    let reqpath = path.join(__dirname, '../../')
    Logger.info(reqpath)
    if(cat_id==0){
      let idp = await Database.raw("insert into cats(cat_name) "+
        "values('"+cat_name+"') returning(id);");
      idp = Number(idp.rows[0].id)
      let data = fs.readFileSync(reqpath+'\\public\\temp\\edit_cat_'+auth.user.user_login+cat_id+'.jpg')
      Logger.info(reqpath+'\\public\\temp\\edit_cat_'+auth.user.user_login+cat_id+'.jpg')
      fs.writeFileSync(reqpath+'\\public\\content\\img\\cat\\cat_'+idp+'.jpg', data)
      Logger.info(reqpath+'\\public\\content\\img\\cat\\cat_'+idp+'.jpg')
    }else {
      let idp = await Database.raw("update cats set cat_name='"+cat_name+"' "+
        "where (id="+cat_id+") returning(id);");
      let data = fs.readFileSync(reqpath+'\\public\\temp\\edit_cat_'+auth.user.user_login+cat_id+'.jpg')
      fs.writeFileSync(reqpath+'\\public\\content\\img\\cat\\cat_'+cat_id+'.jpg', data)
    }

    if (page_n == undefined) {page_n = 1}
    if (filter == undefined) {filter = ''}
    try {
      page_n = Number(page_n)
    }catch (e) {
      page_n = 1
    }

    let answer = {
      time_marker:new Date().getTime(),
      user: auth.user,
      user_can_do: [],
      filter: filter,
      page_n:page_n,
      page_count:0,
      pages_nav:[],
      record_count: await Database.raw("select count(*) as cat_count from cats where cat_name like '%"+filter+"%'"),
      data: await Database.raw("select cats.id, cat_name, pos_count "+
        "from cats left join "+
        "(select cat_id, count(cat_id) as pos_count from positions group by cat_id) as p_count "+
        "on cats.id = p_count.cat_id "+
        "where cat_name like '%"+filter+"%' "+
        "order by cat_name asc limit 20 offset "+(Number(page_n)-1)*20+""),
      record_count_on_page:0,
    }
    for (let i=0; i<answer.data.rows.length;i++){
      if (answer.data.rows[i].pos_count == null) {answer.data.rows[i].pos_count = 0}
    }

    answer.record_count = Number(answer.record_count.rows[0].cat_count)
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

  static async delete_cat(page_n, filter, cat_id, auth){
    let reqpath = path.join(__dirname, '../../')
    Logger.info(reqpath)
    await Database.raw("delete from cats  where (id="+cat_id+");");

    if (page_n == undefined) {page_n = 1}
    if (filter == undefined) {filter = ''}
    try {
      page_n = Number(page_n)
    }catch (e) {
      page_n = 1
    }
    let answer = {
      time_marker:new Date().getTime(),
      user: auth.user,
      user_can_do: [],
      filter: filter,
      page_n:page_n,
      page_count:0,
      pages_nav:[],
      record_count: await Database.raw("select count(*) as cat_count from cats where cat_name like '%"+filter+"%'"),
      data: await Database.raw("select cats.id, cat_name, pos_count "+
        "from cats left join "+
        "(select cat_id, count(cat_id) as pos_count from positions group by cat_id) as p_count "+
        "on cats.id = p_count.cat_id "+
        "where cat_name like '%"+filter+"%' "+
        "order by cat_name asc limit 20 offset "+(Number(page_n)-1)*20+""),
      record_count_on_page:0,
    }
    for (let i=0; i<answer.data.rows.length;i++){
      if (answer.data.rows[i].pos_count == null) {answer.data.rows[i].pos_count = 0}
    }

    answer.record_count = Number(answer.record_count.rows[0].cat_count)
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

}

module.exports = Cat
