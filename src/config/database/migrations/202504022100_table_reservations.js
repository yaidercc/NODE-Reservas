function up(knex) {
    return knex.schema.createTable('reservations', function (table) {
        table.uuid('id').primary();
        table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
        table.uuid('room_id').notNullable().references('id').inTable('rooms').onDelete('CASCADE');
        table.datetime('date_from').notNullable();
        table.datetime('date_to');
        table.datetime('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        table.datetime('updated_at').nullable();
        table.datetime('deleted_at').nullable();
    });
}

function down(knex) {
    return knex.schema.dropTable('reservations');
}

module.exports = {
    up,
    down
};
