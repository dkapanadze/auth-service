"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSourceOptions = void 0;
const typeorm_1 = require("typeorm");
exports.dataSourceOptions = {
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
const dataSource = new typeorm_1.DataSource(exports.dataSourceOptions);
exports.default = dataSource;
