import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Index, OneToMany } from 'typeorm';
import { Registration } from '../../event-registrations/entities/event-registration.entity.js';

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

    // Will be connected to Club entity after merging
    @Column({ name: 'club_id', type: 'int', nullable: true })
    clubId: number | null;

    // Will be connected to Venue entity after merging
    @Column({ name: 'venue_id', type: 'int', nullable: true })
    venueId: number | null;

    // Will be connected to User entity after merging
    @Column({ name: 'created_by', type: 'int', nullable: true })
    createdById: number | null;

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


    @OneToMany(() => Registration, (r) => r.event)
    registrations: Registration[];
}