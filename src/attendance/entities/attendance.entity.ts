import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    OneToOne,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

import type { Relation } from 'typeorm';

import { Registration } from '../../event-registrations/entities/event-registration.entity.js';
import { User } from '../../users/entites/user.entity.js';

@Entity('attendance')
export class Attendance {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Registration, {
        nullable: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'registration_id' })
    registration: Relation<Registration>;

    @ManyToOne(() => User, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'checked_in_by' })
    checkedInByUser: Relation<User>;

    @CreateDateColumn({
        name: 'checked_in_at',
        type: 'timestamp',
    })
    checkedInAt: Date;
}