import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { Person } from './shared/person.shared';
import { Client } from './client.entity';

@Entity('banker')
export class Banker extends Person {
  @Column({ unique: true, length: 10 })
  employee_number: string;

  @ManyToMany(() => Client) // when we have ManyToMany relationsip we can not have a foreign key in any of them table
  @JoinTable({
    name: 'banker_client',
    joinColumn: {
      name: 'banker',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'client',
      referencedColumnName: 'id',
    },
  })
  clients: Client[];
}
