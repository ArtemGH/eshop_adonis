'use strict'

const User = use('App/Models/User')
const Logger = use('Logger')
const Hash = use('Hash')
const Database = use('Database')
const fs = require('fs')


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class UserController {
  async check_login_present({ request, response }) {
    let req = (request.raw())
    req = JSON.parse(req)
    if (req.login=="") {
      response.json("NO");
    } else {
      let user = await User.findBy('user_login', req.login)
      if (user == null) {
        response.json("OK");
      } else {
        response.json("NO");
      }
    }
  }

  async register ({ request, session, response, auth }) {
    let answ = ''
    let req = (request.raw())
    req = JSON.parse(req)

    if (req.post_type == 'new_user') {
      const user = new User()
      user.user_login = req.reg_login
      user.user_password = await Hash.make(req.reg_password)
      user.user_first_name = req.reg_name
      user.user_last_name = req.reg_fam
      user.user_tel = req.reg_tel
      user.user_email = req.reg_email
      user.user_can_do = JSON.stringify([])
      await user.save()
      await auth.attempt(req.reg_login,req.reg_password)
      answ = auth.user
      if (answ != null) {
        answ.user_password = ""
        answ.user_can_do = JSON.parse(auth.user.user_can_do)
      }
      response.json(answ);
    }
    else {
      response.json("NO");
    }
  }

  async login({ request, response, auth }) {
    let answ = {login:false, user_id:0, user_login:"",user_can_do:[]};
    let req = (request.raw())
    req = JSON.parse(req)
    let login = true

    try{
      await auth.attempt(req.login,req.password)
    } catch(e){
      login = false
    }

    if (login == false ) {
      answ.login=false
      answ.user_id=0
      answ.user_login=""
      answ.user_can_do =[]
    } else {
      answ.login=true
      answ.user_id=auth.user.id
      answ.user_login=auth.user.user_login
      answ.user_can_do =JSON.parse(auth.user.user_can_do)
    }
    response.json(answ);
  }

  async logout({ request, response, auth }) {
    let answ = ''
    let req = (request.raw())
    req = JSON.parse(req)
    await auth.logout()
    response.json({logOut:"ok"});
  }

  async get_registration_window({ request, response, auth }) {
    let registration_window = fs.readFileSync("resources/modal_forms/user_registration.html", "utf8");
    response.json(registration_window);
  }

  async show({request,view, auth}) {
    let data =  await User.show(request.all().page,request.all().filter, auth)
    return  view.render('users',data)
  }

}

module.exports = UserController
