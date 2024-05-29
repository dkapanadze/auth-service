// import { TokenEntity, UserEntity } from '../src/users/entities';
// import { DataSource } from 'typeorm';

// export const AppDataSource = new DataSource({
//   type: 'postgres',
//   host: 'localhost',
//   port: 5432,
//   username: 'postgres',
//   password: 'postgres',
//   database: 'myproject_test',
//   synchronize: false, // We'll handle synchronization manually
//   entities: [UserEntity, TokenEntity],
// });

// global.afterEach(async () => {
//   await AppDataSource.initialize();
//   await AppDataSource.dropDatabase();
//   await AppDataSource.synchronize(); // Optional: to recreate the schema
//   await AppDataSource.destroy();
// });
