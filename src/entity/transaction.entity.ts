import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Client } from './client.entity';

export enum TransactionTypes {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

@Entity('transaction')
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: TransactionTypes,
  })
  type: string;

  @Column({
    type: 'numeric',
  })
  amount: number;

  // foreigin-key is usually on many side not one side
  @ManyToOne(() => Client, (client) => client.transactions, { onDelete: 'CASCADE' }) // cascade allows to delete relational instances as well
  // when we are actualy write new instance of transaction we will give it a hole client and from client entity knows what to do
  @JoinColumn({
    name: 'client_id',
  })
  client: Client;
}

// transaction          client
//  1                    3
//  2                    3
//  3                    3

// delete client === 3 will deletes all the transactions asigned to the client 3
// so deletes 1, 2, 3 transactions
