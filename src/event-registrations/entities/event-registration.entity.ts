import {
  Column, CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Event } from '../../events/entities/event.entity.js';
import { User } from '../../users/entites/user.entity.js';
import type { Relation } from 'typeorm';

@Entity('registrations')
export class Registration {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (u) => u.registrations)
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;


  @ManyToOne(() => Event, (e) => e.registrations)
  @JoinColumn({ name: 'event_id' })
  event: Relation<Event>;


  @Column({ type: 'varchar'})
  status: string;


  @CreateDateColumn({ name: 'registered_at'})
  registeredAt: Date;


}
