'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PositionsSchema extends Schema {
  up () {
    this.create('positions', (table) => {
      table.increments()
      table.bigInteger('cat_id').unsigned().references('id').inTable('cats')
      table.string('pos_name', 250).notNullable()
      table.bigInteger('pos_prise').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('positions')
  }
}

module.exports = PositionsSchema
