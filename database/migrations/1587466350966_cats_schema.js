'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CatsSchema extends Schema {
  up () {
    this.create('cats', (table) => {
      table.increments()
      table.string('cat_name', 80).notNullable().unique()
      table.timestamps()
    })
  }

  down () {
    this.drop('cats')
  }
}

module.exports = CatsSchema
