import { Entity, Column, OneToMany, ManyToMany } from 'typeorm';
import { Person } from './shared/person.shared';
import { Transaction } from './transaction.entity';
import { Banker } from './banker.entity';

@Entity('client')
export class Client extends Person {
  @Column({ type: 'numeric' })
  balance: number;

  @Column({ default: true, name: 'active' })
  is_active: boolean;

  @Column({
    type: 'simple-json',
    nullable: true,
  })
  additional_info: {
    age: number;
    hair_color: string;
  };

  @Column({
    type: 'simple-array',
    default: [],
  })
  family_members: string[];

  @OneToMany(() => Transaction, (transaction) => transaction.client)
  transactions: Transaction[];

  @ManyToMany(() => Banker)
  bankers: Banker[];
}
