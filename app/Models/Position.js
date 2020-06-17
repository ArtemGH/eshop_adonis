'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Database = use ('Database')
const Logger = use ('Logger')
const fs = require('fs')
const path = require('path')

class Position extends Model {

  static async show (page_n, filter, cat_id, auth) {

    Logger.info(filter)

    if (page_n == undefined) {page_n = 1}
    if (filter == undefined) {filter = ''}
    if (cat_id == undefined) {cat_id = 0}
    try {page_n = Number(page_n)}catch (e){page_n = 1}
    try {cat_id = Number(cat_id)}catch (e){cat_id = 0}

    let sql_filter = ''
    if ((cat_id == 0)&&(filter=='')){
      sql_filter = ''
    }else if((cat_id != 0)&&(filter =='')){
      sql_filter = "where (cat_id = "+cat_id+")"
    }else if((cat_id == 0)&&(filter !='')){
      sql_filter = "where (pos_name like '%"+filter+"%')"
    }else{
      sql_filter = "where ((cat_id = "+cat_id+")and(pos_name like '%"+filter+"%'))"
    }

    let answer = {
      cat_id:cat_id,
      time_marker:new Date().getTime(),
      user: auth.user,
      user_can_do: [],
      filter: filter,
      page_n: page_n,
      page_count:0,
      pages_nav:[],
      record_count: await Database.raw("select count(*) as pos_count "+
                                       "from positions left join cats on positions.cat_id = cats.id "+sql_filter),
      data: await Database.raw("select positions.id, positions.cat_id, positions.pos_name, positions.pos_prise, cats.cat_name "+
                               "from positions left join cats on positions.cat_id = cats.id "+
                               sql_filter+
                               " order by pos_name asc limit 20 offset "+(Number(page_n)-1)*20+""),
      record_count_on_page:0,
    }

    answer.record_count = Number(answer.record_count.rows[0].pos_count)
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

  static async show_one (pos_id, auth) {
    if (pos_id == undefined) {pos_id = 0}
    try {pos_id = Number(pos_id)}catch (e){pos_id = 0}

    let answer = {
      time_marker:new Date().getTime(),
      user: auth.user,
      user_can_do: [],
      filter: "",
      page_n: 0,
      page_count:0,
      pages_nav:[],
      record_count: 1,
      data: await Database.raw("select positions.id, positions.cat_id, positions.pos_name, positions.pos_prise, cats.cat_name "+
        "from positions left join cats on positions.cat_id = cats.id where positions.id = "+pos_id),
      record_count_on_page:0,
    }

    try {
      answer.user_can_do = JSON.parse(auth.user.user_can_do)
    }catch (e) {
      answer.user_can_do = []
    }
    return answer
  }

  static async show_items(pos_ids) {
    if (pos_ids == undefined) {pos_ids = []}
    let sql_filter='';
    let answer=[]
    for (let i=0; i<pos_ids.length; i++){
      if (i==0) {sql_filter='((positions.id)='+pos_ids[i].id+')'}
      else {sql_filter=sql_filter+' OR ((positions.id)='+pos_ids[i].id+')'}
      if (i==pos_ids.length-1) {sql_filter='WHERE '+sql_filter}
    }

    if(pos_ids.length > 0) {
      answer = await Database.raw("select positions.id, positions.cat_id, positions.pos_name, positions.pos_prise, cats.cat_name "+
                                  "from positions left join cats on positions.cat_id = cats.id "+sql_filter)
    }
    return answer;
  }

  static async save_position(page_n, filter, cat_id, pos_id, pos_name, pos_price, text, auth){
//    Logger.info(page_n+' '+filter+' '+cat_id+' '+pos_id+' '+pos_name+' '+pos_price)
    let reqpath = path.join(__dirname, '../../')
    Logger.info(pos_id)
    if(pos_id==0){
      let idp = await Database.raw("insert into positions(cat_id, pos_name, pos_prise) "+
        "values("+cat_id+", '"+pos_name+"', "+pos_price+") returning(id);");
      idp = Number(idp.rows[0].id)
      let data = fs.readFileSync(reqpath+'\\public\\temp\\edit_pos_'+auth.user.user_login+pos_id+'.jpg')
      fs.writeFileSync(reqpath+'\\public\\content\\img\\pos\\pos_'+idp+'.jpg', data)
      fs.writeFileSync(reqpath+'\\public\\content\\txt\\pos_'+idp+'.html', text)
    }else {
      let idp = await Database.raw("update positions set cat_id="+cat_id+", pos_name='"+pos_name+"', pos_prise="+pos_price+" "+
        "where (id="+pos_id+") returning(id);");
       Logger.info(reqpath+'\\public\\temp\\edit_pos_'+auth.user.user_login+pos_id+'.jpg')

      let data = fs.readFileSync(reqpath+'\\public\\temp\\edit_pos_'+auth.user.user_login+pos_id+'.jpg')
      Logger.info(2)
      fs.writeFileSync(reqpath+'\\public\\content\\img\\pos\\pos_'+pos_id+'.jpg', data)
      Logger.info(3)
      fs.writeFileSync(reqpath+'\\public\\content\\txt\\pos_'+pos_id+'.html', text)
      Logger.info(4)
    }

    if (page_n == undefined) {page_n = 1}
    if (filter == undefined) {filter = ''}
    if (cat_id == undefined) {cat_id = 0}
    try {page_n = Number(page_n)}catch (e){page_n = 1}
    try {cat_id = Number(cat_id)}catch (e){cat_id = 0}

    let sql_filter = ''
    if ((cat_id == 0)&&(filter=='')){
      sql_filter = ''
    }else if((cat_id != 0)&&(filter =='')){
      sql_filter = "where (cat_id = "+cat_id+")"
    }else if((cat_id == 0)&&(filter !='')){
      sql_filter = "where (pos_name like '%"+filter+"%')"
    }else{
      sql_filter = "where ((cat_id = "+cat_id+")and(pos_name like '%"+filter+"%'))"
    }

    let answer = {
      cat_id:cat_id,
      time_marker:new Date().getTime(),
      user: auth.user,
      user_can_do: [],
      filter: filter,
      page_n: page_n,
      page_count:0,
      pages_nav:[],
      record_count: await Database.raw("select count(*) as pos_count "+
        "from positions left join cats on positions.cat_id = cats.id "+sql_filter),
      data: await Database.raw("select positions.id, positions.cat_id, positions.pos_name, positions.pos_prise, cats.cat_name "+
        "from positions left join cats on positions.cat_id = cats.id "+
        sql_filter+
        " order by pos_name asc limit 20 offset "+(Number(page_n)-1)*20+""),
      record_count_on_page:0,
    }

    answer.record_count = Number(answer.record_count.rows[0].pos_count)
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

  static async delete_position(page_n, filter, cat_id, pos_id, auth){
//    Logger.info(page_n+' '+filter+' '+cat_id+' '+pos_id+' '+pos_name+' '+pos_price)
    let reqpath = path.join(__dirname, '../../')
    Logger.info(pos_id)
    await Database.raw("delete from positions where (id="+pos_id+");");

    if (page_n == undefined) {page_n = 1}
    if (filter == undefined) {filter = ''}
    if (cat_id == undefined) {cat_id = 0}
    try {page_n = Number(page_n)}catch (e){page_n = 1}
    try {cat_id = Number(cat_id)}catch (e){cat_id = 0}

    let sql_filter = ''
    if ((cat_id == 0)&&(filter=='')){
      sql_filter = ''
    }else if((cat_id != 0)&&(filter =='')){
      sql_filter = "where (cat_id = "+cat_id+")"
    }else if((cat_id == 0)&&(filter !='')){
      sql_filter = "where (pos_name like '%"+filter+"%')"
    }else{
      sql_filter = "where ((cat_id = "+cat_id+")and(pos_name like '%"+filter+"%'))"
    }

    let answer = {
      cat_id:cat_id,
      time_marker:new Date().getTime(),
      user: auth.user,
      user_can_do: [],
      filter: filter,
      page_n: page_n,
      page_count:0,
      pages_nav:[],
      record_count: await Database.raw("select count(*) as pos_count "+
        "from positions left join cats on positions.cat_id = cats.id "+sql_filter),
      data: await Database.raw("select positions.id, positions.cat_id, positions.pos_name, positions.pos_prise, cats.cat_name "+
        "from positions left join cats on positions.cat_id = cats.id "+
        sql_filter+
        " order by pos_name asc limit 20 offset "+(Number(page_n)-1)*20+""),
      record_count_on_page:0,
    }

    answer.record_count = Number(answer.record_count.rows[0].pos_count)
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

module.exports = Position
