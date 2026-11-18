import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from '../../events/entities/event.entity.js';

@Entity('venues')
export class Venue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  location: string;

  // max people the room can hold
  @Column('int')
  capacity: number;

  @OneToMany(() => Event, (e) => e.venue)
  events: Event[];
}
