import knex from 'knex';

export const database = knex({
  client: 'mysql',
  connection: {
    host: '178.128.109.9',
    user: 'test01',
    password: 'PlsDoNotShareThePass123@',
    database: 'entrance_test',
  },
});

// Create a table
// database.schema
//   .createTable('users', (table) => {
//     table.increments('id');
//     table.string('firstName');
//     table.string('lastName');
//     table.string('email');
//     table.string('password');
//     table.datetime('updatedAt');
//     table.datetime('createdAt');
//   })
//   .createTable('tokens', (table) => {
//     table.increments('id');
//     table.integer('userId').unsigned().references('users.id');
//     table.string('refreshToken');
//     table.string('expiresIn');
//     table.datetime('updatedAt');
//     table.datetime('createdAt');
//   });
