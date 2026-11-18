
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import type { Relation } from 'typeorm';

import { User } from '../../users/entites/user.entity.js';
import { Club } from '../../clubs/entities/club.entity.js';

@Entity('memberships')
export class Membership {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.memberships, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @ManyToOne(() => Club, (club) => club.memberships, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'club_id' })
  club: Relation<Club>;

  @Column({ name: 'club_role', type: 'varchar', default: 'MEMBER' })
  clubRole: string;

  @Column({ type: 'varchar', default: 'PENDING' })
  status: string;

  @CreateDateColumn({ name: 'joined_at' })
  joinedAt: Date;
}
