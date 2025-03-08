function up(knex){
    return knex.schema.createTable('users', function (table){
        table.uuid('id').primary();
        table.string('name', 100).notNullable();
        table.string('last_name', 36).notNullable();
        table.string('email', 100).notNullable();
        table.string('password', 30).notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
}

function down(knex){
    return knex.schema.dropTable('users');
}

module.exports = {
    up,
    down
}