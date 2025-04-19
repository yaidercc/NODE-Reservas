function up(knex){
    return knex.schema.createTable('rooms', function (table){
        table.uuid('id').primary();
        table.string('name', 3).notNullable();
        table.datetime('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
        table.datetime('updated_at').nullable();
        table.datetime('deleted_at').nullable();
    });
}

function down(knex){
    return knex.schema.dropTable('rooms');
}

module.exports = {
    up,
    down
}
