import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from 'typeorm';

@Entity('announcements')
export class Announcement {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'club_id', type: 'int', nullable: true })
    clubId: number | null;

    @Column({ name: 'event_id', type: 'int', nullable: true })
    eventId: number | null;

    @Column({ name: 'author_id', type: 'int', nullable: true })
    authorId: number | null;

    @Column()
    title: string;

    @Column({ type: 'text' })
    body: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}