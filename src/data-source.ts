import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  host: process.env.DATABASE_URL,
  logging: false,
  synchronize: false,
  name: 'default',
  // type: 'postgres',
  // url: process.env.DATABASE_URL,
  // synchronize: false,
  // ssl:
  //   process.env.NODE_ENV !== 'local' && process.env.NODE_ENV !== 'test'
  //     ? { rejectUnauthorized: false }
  //     : false,
  // logging: true,
  entities: ['dist/src/app/domain/entities/**/*.js'],
  migrations: ['dist/src/migrations/**/*.js'],
  subscribers: ['dist/src/subscriber/**/*.js'],
  migrationsTransactionMode: 'each',
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
