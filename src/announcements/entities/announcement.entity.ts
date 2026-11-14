import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('announcements')
export class Announcement {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'club_id', type: 'uuid' })
    clubId: string;

    @Column({ name: 'event_id', type: 'uuid', nullable: true })
    eventId: string | null;

    @Column({ name: 'author_id', type: 'int' })
    authorId: number;

    @Column()
    title: string;

    @Column({ type: 'text' })
    body: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
