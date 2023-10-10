import express from 'express';
import { DataSource, EntityTarget, ObjectLiteral, Repository } from 'typeorm';
import { Client } from './entity/client.entity';
import { Banker } from './entity/banker.entity';
import { Transaction } from './entity/transaction.entity';

import env from 'dotenv';
import { clientRouter } from './controllers/client.controller';
import { bankerRouter } from './controllers/banker.controller';
import { connectRouter } from './controllers/connect.controller';
env.config();

const app = express();

let typeORMDB: DataSource;

const main = async () => {
  // Postgres DB
  const dataSource: DataSource = new DataSource({
    type: 'postgres',
    host: process.env.PGSQL_HOST,
    port: Number(process.env.PGSQL_PORT),
    username: process.env.PGSQL_USERNAME,
    password: process.env.PGSQL_PASSWORD,
    database: process.env.PGSQL_DB,
    entities: [Client, Banker, Transaction],
    synchronize: true,
  });

  try {
    typeORMDB = await dataSource.initialize();
    console.log('Database connected successfuly!');

    app.use(express.json());

    app.use('/api/client', clientRouter);
    app.use('/api/banker', bankerRouter);
    app.use('/api/connect', connectRouter);

    app.listen(process.env.PORT, () => {
      console.log('Server is up and running on port ', process.env.PORT);
    });
  } catch (error) {
    console.log(error);
    throw new Error('Can not connect to the database!');
  }
};

export function useTypeORM(entity: EntityTarget<ObjectLiteral>): Repository<ObjectLiteral> {
  if (!typeORMDB) {
    throw new Error('TypeORM has not been initialized!');
  }

  //To find an entity by id you can use manager.findOneBy or repository.findOneBy. Example:
  return typeORMDB.getRepository(entity);
}

main();
