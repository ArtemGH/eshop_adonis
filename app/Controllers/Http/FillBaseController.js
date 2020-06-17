'use strict'
const Database = use('Database')
const Hash = use('Hash')
const Logger = use('Logger')
const fs = require('fs');

class FillBaseController {
  async fill() {
    await Database.raw("delete from users;")
    await Database.raw("delete from positions;")
    await Database.raw("delete from cats;")
    await Database.raw("delete from orders_positions;")
    await Database.raw("delete from orders;")

    await Database.raw("insert into "+
      "users(user_login, user_password, user_first_name, user_last_name, user_tel, user_email, user_can_do) "+
      "values('admin', '"+await Hash.make('admin')+"', 'ad', 'min', '+380665194008', 'artem.global.mail@gmail.com', '"+JSON.stringify(["prise","order","user"])+"');")
    await Database.raw("insert into "+
      "users(user_login, user_password, user_first_name, user_last_name, user_tel, user_email, user_can_do) "+
      "values('order_man', '"+await Hash.make('order_man')+"', 'oMan', 'oGer', '+3111111111111', 'oMan@gmail.com', '"+JSON.stringify(["order"])+"');")
    await Database.raw("insert into "+
      "users(user_login, user_password, user_first_name, user_last_name, user_tel, user_email, user_can_do) "+
      "values('content_man', '"+await Hash.make('content_man')+"', 'cMan', 'cGer', '+322222222222', 'cMan@gmail.com', '"+JSON.stringify(["prise"])+"');")
    await Database.raw("insert into "+
      "users(user_login, user_password, user_first_name, user_last_name, user_tel, user_email, user_can_do) "+
      "values('user_man', '"+await Hash.make('user_man')+"', 'uMan', 'uGer', '+33333333333', 'uMan@gmail.com', '"+JSON.stringify([])+"');")

    let id = ""
    let idp = ""

    id = await Database.raw("insert into cats(cat_name) values('Для дома') returning(id);");
    id = Number(id.rows[0].id)
    fs.createReadStream(__dirname+'\\..\\..\\..\\public\\decor\\def\\c1.jpg').pipe(fs.createWriteStream(__dirname+'\\..\\..\\..\\public\\content\\img\\cat\\cat_'+id+'.jpg'));

    id = await Database.raw("insert into cats(cat_name) values('Для авто') returning(id);");
    id = Number(id.rows[0].id)
    fs.createReadStream(__dirname+'\\..\\..\\..\\public\\decor\\def\\c2.jpg').pipe(fs.createWriteStream(__dirname+'\\..\\..\\..\\public\\content\\img\\cat\\cat_'+id+'.jpg'));

    id = await Database.raw("insert into cats(cat_name) values('Красота и здоровье') returning(id);");
    id = Number(id.rows[0].id)
    fs.createReadStream(__dirname+'\\..\\..\\..\\public\\decor\\def\\c4.jpg').pipe(fs.createWriteStream(__dirname+'\\..\\..\\..\\public\\content\\img\\cat\\cat_'+id+'.jpg'));

    id = await Database.raw("insert into cats(cat_name) values('Одежда и обувь') returning(id);");
    id = Number(id.rows[0].id)
    fs.createReadStream(__dirname+'\\..\\..\\..\\public\\decor\\def\\c5.jpg').pipe(fs.createWriteStream(__dirname+'\\..\\..\\..\\public\\content\\img\\cat\\cat_'+id+'.jpg'));

    id = await Database.raw("insert into cats(cat_name) values('Компьютеры комплектующие') returning(id);");
    id = Number(id.rows[0].id)
    fs.createReadStream(__dirname+'\\..\\..\\..\\public\\decor\\def\\c3.jpg').pipe(fs.createWriteStream(__dirname+'\\..\\..\\..\\public\\content\\img\\cat\\cat_'+id+'.jpg'));

    idp = await Database.raw("insert into positions(cat_id, pos_name, pos_prise) "+
      "values("+id+", 'ARTLINE Gaming X39 v33 (X39v33)', 27000) returning(id);");
    idp = Number(idp.rows[0].id)
    fs.createReadStream(__dirname+'\\..\\..\\..\\public\\decor\\def\\p1.jpg').pipe(fs.createWriteStream(__dirname+'\\..\\..\\..\\public\\content\\img\\pos\\pos_'+idp+'.jpg'));
    fs.createReadStream(__dirname+'\\..\\..\\..\\public\\decor\\def\\t1.html').pipe(fs.createWriteStream(__dirname+'\\..\\..\\..\\public\\content\\txt\\pos_'+idp+'.html'));

    idp = await Database.raw("insert into positions(cat_id, pos_name, pos_prise) "+
      "values("+id+", 'ARTLINE Gaming X48 v04 (X48v04)', 20400) returning(id);");
    idp = Number(idp.rows[0].id)
    fs.createReadStream(__dirname+'\\..\\..\\..\\public\\decor\\def\\p2.jpg').pipe(fs.createWriteStream(__dirname+'\\..\\..\\..\\public\\content\\img\\pos\\pos_'+idp+'.jpg'));
    fs.createReadStream(__dirname+'\\..\\..\\..\\public\\decor\\def\\t2.html').pipe(fs.createWriteStream(__dirname+'\\..\\..\\..\\public\\content\\txt\\pos_'+idp+'.html'));

    idp = await Database.raw("insert into positions(cat_id, pos_name, pos_prise) "+
      "values("+id+", 'Ноутбук Asus TUF Gaming FX705DY-AU105 (90NR0191-M02610) Gold Steel', 22999) returning(id);");
    idp = Number(idp.rows[0].id)
    fs.createReadStream(__dirname+'\\..\\..\\..\\public\\decor\\def\\p3.jpg').pipe(fs.createWriteStream(__dirname+'\\..\\..\\..\\public\\content\\img\\pos\\pos_'+idp+'.jpg'));
    fs.createReadStream(__dirname+'\\..\\..\\..\\public\\decor\\def\\t3.html').pipe(fs.createWriteStream(__dirname+'\\..\\..\\..\\public\\content\\txt\\pos_'+idp+'.html'));

    idp = await Database.raw("insert into positions(cat_id, pos_name, pos_prise) "+
      "values("+id+", 'Apple MacBook Air 13 256GB 2020 Space Gray', 77777) returning(id);");
    idp = Number(idp.rows[0].id)
    fs.createReadStream(__dirname+'\\..\\..\\..\\public\\decor\\def\\p4.jpg').pipe(fs.createWriteStream(__dirname+'\\..\\..\\..\\public\\content\\img\\pos\\pos_'+idp+'.jpg'));
    fs.createReadStream(__dirname+'\\..\\..\\..\\public\\decor\\def\\t4.html').pipe(fs.createWriteStream(__dirname+'\\..\\..\\..\\public\\content\\txt\\pos_'+idp+'.html'));

    fs.createReadStream(__dirname+'\\..\\..\\..\\public\\decor\\def\\pos_0.html').pipe(fs.createWriteStream(__dirname+'\\..\\..\\..\\public\\content\\txt\\pos_0.html'));
    fs.createReadStream(__dirname+'\\..\\..\\..\\public\\decor\\def\\0.jpg').pipe(fs.createWriteStream(__dirname+'\\..\\..\\..\\public\\content\\img\\pos\\pos_0.jpg'));
    fs.createReadStream(__dirname+'\\..\\..\\..\\public\\decor\\def\\0.jpg').pipe(fs.createWriteStream(__dirname+'\\..\\..\\..\\public\\content\\img\\cat\\cat_0.jpg'));

  }
}

module.exports = FillBaseController
