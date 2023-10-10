import { Router } from 'express';
import { useTypeORM } from '../app';
import { Client } from '../entity/client.entity';
import { Banker } from '../entity/banker.entity';

export const connectRouter = Router();

connectRouter.put('/banker/:bankerId/client/:clientId', async (req, res) => {
  try {
    const { bankerId, clientId } = req.params;

    const client = await useTypeORM(Client).findOneBy({ id: clientId });
    if (!client) return res.status(404).json({ msg: 'Client was not found!' });
    const banker = await useTypeORM(Banker).findOneBy({ id: bankerId });
    if (!banker) return res.status(404).json({ msg: 'Banker was not found!' });

    // Because banker has join table in Banker Entity so we should do this from banker instance side
    banker.clients = [client];

    await useTypeORM(Banker).save(banker);

    return res.status(200).json({ msg: 'Connection was successful!' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'Something went wrong' });
  }
});
