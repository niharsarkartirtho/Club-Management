import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Venue } from '../../venues/entites/venue.entity.js';
import { User } from '../../users/entites/user.entity.js';
import { Club } from '../../clubs/entities/club.entity.js';

export enum EventStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    ONGOING = 'ONGOING',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

export enum EventVisibility {
    PUBLIC = 'PUBLIC',
    MEMBERS_ONLY = 'MEMBERS_ONLY',
}

@Entity('events')
export class Event {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Club, (c) => c.events, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'club_id' })
    club: Club;

    @ManyToOne(() => Venue, (v) => v.events, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'venue_id' })
    venue: Venue;

    @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'author_id' })
    author: User;

    @Column()
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string | null;

    @Column({ name: 'start_time', type: 'timestamptz' })
    startTime: Date;

    @Column({ name: 'end_time', type: 'timestamptz' })
    endTime: Date;

    @Column('int')
    capacity: number;

    @Column({
        type: 'enum',
        enum: EventVisibility,
        default: EventVisibility.PUBLIC,
    })
    visibility: EventVisibility;

    @Column({
        type: 'enum',
        enum: EventStatus,
        default: EventStatus.DRAFT,
    })
    status: EventStatus;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}