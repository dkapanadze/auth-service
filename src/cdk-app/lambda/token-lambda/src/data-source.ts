import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'postgres',
  host: process.env.DB_HOST,
  logging: false,
  synchronize: true,
  name: 'default2',
  ssl: {
    rejectUnauthorized: false,
  },
  // entities: ['src/dist/users/entities/*.js'],
  // autoLoadEntities: true,
  migrationsTransactionMode: 'each',
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
