'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OrdersPositionsSchema extends Schema {
  up () {
    this.create('orders_positions', (table) => {
      table.increments()
      table.bigInteger('order_id').unsigned().references('id').inTable('orders')
      table.bigInteger('order_pos_id').unsigned().references('id').inTable('positions')
      table.string('order_pos_name', 250).notNullable()
      table.bigInteger('order_pos_prise').notNullable()
      table.bigInteger('order_pos_count').notNullable()
      table.bigInteger('order_pos_sum').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('orders_positions')
  }
}

module.exports = OrdersPositionsSchema
