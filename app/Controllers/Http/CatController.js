'use strict'
const Cat = use('App/Models/Cat')
const Logger = use('Logger')

class CatController {

  async show({request,view, auth}) {
    let data =  await Cat.show(request.all().page,request.all().filter,auth)
    return  view.render('cats',data)
  }



}

module.exports = CatController
