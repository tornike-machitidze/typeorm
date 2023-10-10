import { Router } from 'express';
import { Banker } from '../entity/banker.entity';
import { useTypeORM } from '../app';

export const bankerRouter = Router();

/**
 * Create a Banker
 */
bankerRouter.post('/', async (req, res) => {
  const {
    firstName: first_name,
    lastName: last_name,
    email,
    cardNumber: card_number,
    employeeNumber: employee_number,
  } = req.body;

  try {
    const banker = await useTypeORM(Banker).save({ first_name, last_name, email, card_number, employee_number });
    res.status(201).json(banker);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong!' });
  }
});
