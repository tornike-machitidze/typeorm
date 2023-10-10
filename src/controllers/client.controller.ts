import express from 'express';
import { Client } from '../entity/client.entity';
import { useTypeORM } from '../app';
import { Transaction, TransactionTypes } from '../entity/transaction.entity';
export const clientRouter = express.Router();

/**
 * Create a Client
 */
clientRouter.post('/', async (req, res) => {
  const { firstName: first_name, lastName: last_name, email, cardNumber: card_number, balance } = req.body;
  try {
    const client = await useTypeORM(Client).save({ first_name, last_name, email, card_number, balance });
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong!' });
  }
});

/**
 * Create Transaction
 */
clientRouter.post('/:clientId/transaction', async (req, res) => {
  const { clientId } = req.params;
  const { type, amount } = req.body;

  try {
    const client = await useTypeORM(Client).findOneBy({ id: clientId });
    if (!client) {
      return res.status(404).json({ msg: 'client not found!' });
    }

    const transaction = await useTypeORM(Transaction).save({ type, amount, client });

    if (type === TransactionTypes.DEPOSIT) {
      client.balance = Number(client.balance) + Number(amount);
    } else if (type === TransactionTypes.WITHDRAW) {
      client.balance = client.balance - amount;
    }

    await useTypeORM(Client).save(client);

    return res.status(201).json({ msg: 'Transaction was successful', data: transaction });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * Delete client
 */
clientRouter.delete('/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;
    const response = await useTypeORM(Client).delete({ id: clientId });
    return res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Something went wrong!' });
  }
});

/**
 *Get all the clients fistnames and balance { firstName: '', balance: 0 } whos balance is more then 50 000
 */
clientRouter.get('/', async (req, res) => {
  try {
    const clients = await useTypeORM(Client)
      .createQueryBuilder('client')
      .select('client.first_name') // select onli first name from getting clients (optinaly client will return hole client objet)
      .addSelect('client.balance') // + last name { first_name: , last_name:  }
      // .from(Client, 'client')
      .leftJoinAndSelect('client.transactions', 'transactions')
      .where('client.balance >= :balance', { balance: 50000 }) // where / cause (the logic / reason / criteria how we are choosing the instances)
      .getMany();
    res.status(200).json({ data: clients });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: 'Something went wrong!' });
  }
});
