'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('user_login', 80).notNullable().unique()
      table.string('user_password', 60).notNullable()
      table.string('user_first_name', 254).notNullable()
      table.string('user_last_name', 254).notNullable()
      table.string('user_tel', 20).notNullable()
      table.string('user_email', 254).notNullable()
      table.string('user_can_do', 254).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
