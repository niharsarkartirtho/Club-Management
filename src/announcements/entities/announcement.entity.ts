import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    JoinColumn,
    ManyToOne,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Club } from '../../clubs/entities/club.entity.js';
import { Event } from '../../events/entities/event.entity.js';
import { User } from '../../users/entites/user.entity.js';

@Entity('announcements')
export class Announcement {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Club, (c) => c.announcements, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'club_id' })
    club: Relation<Club>;

    @ManyToOne(() => Event, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'event_id' })
    event: Relation<Event | null>;

    
    @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'author_id' })
    author: Relation<User>;

    @Column()
    title: string;

    @Column({ type: 'text' })
    body: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}