'use strict'

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')
const Logger = use('Logger')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Database = use('Database')

class User extends Model {
  static boot () {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
//    this.addHook('beforeSave', async (userInstance) => {
//      if (userInstance.dirty.password) {
//        userInstance.password = await Hash.make(userInstance.password)
//      }
//    })
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens () {
    return this.hasMany('App/Models/Token')
  }

  static async show (page_n, filter, auth) {
    let  user_can_do = JSON.parse(auth.user.user_can_do)
    let can_do = false
    let answer = {}
    for (let i = 0; i<user_can_do.length; i++) {
      if (user_can_do[i] == 'user')  {can_do = true }
    }
    if (can_do) {
      answer = {
        time_marker:new Date().getTime(),
        user: auth.user,
        user_can_do: [],
        filter: filter,
        page_n:page_n,
        record_count: await Database.raw("select count(*) as cat_count from cats where cat_name like '%"+filter+"%'"),
        page_count:0,
        record_count_on_page:0,
        pages_nav:[],
        data: await Database.raw("select * "+
          "from users "+
          "where user_login like '%"+filter+"%' "+
          "order by user_login asc limit 20 offset "+(Number(page_n)-1)*20+""),

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


    }
    else {
      answer = {
        time_marker:new Date().getTime(),
        user: auth.user,
        user_can_do: [],
        filter: filter,
        page_n: page_n,
        record_count: 0,
        page_count: 0,
        record_count_on_page: 0,
        data: [],
        pages_nav:[],
      }

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

  static async fill_default() {
    let user = new User()
    user.user_login = 'admin'
    user.user_password = await Hash.make('admin')
    user.user_first_name = 'ad'
    user.user_last_name = 'min'
    user.user_tel = '+380665194008'
    user.user_email = 'artem.global.mail@gmail.com'
    user.user_can_do = JSON.stringify(["prise","order","user"])
    await user.save()

    user = new User()
    user.user_login = 'order_man'
    user.user_password = await Hash.make('order_man')
    user.user_first_name = 'oMan'
    user.user_last_name = 'Ger'
    user.user_tel = '+380665194008'
    user.user_email = 'artem.global.mail@gmail.com'
    user.user_can_do = JSON.stringify(["order"])
    await user.save()

    user = new User()
    user.user_login = 'content_man'
    user.user_password = await Hash.make('content_man')
    user.user_first_name = 'cMan'
    user.user_last_name = 'Ger'
    user.user_tel = '+380665194008'
    user.user_email = 'artem.global.mail@gmail.com'
    user.user_can_do = JSON.stringify(["prise"])
    await user.save()

    user = new User()
    user.user_login = 'user_man'
    user.user_password = await Hash.make('user_man')
    user.user_first_name = 'uMan'
    user.user_last_name = 'user'
    user.user_tel = '+380665194008'
    user.user_email = 'artem.global.mail@gmail.com'
    user.user_can_do = JSON.stringify([])
    await user.save()
  }
}

module.exports = User
