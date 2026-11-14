
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('attendances')
export class Attendance {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    registration_id: string;

    @Column({ type: 'uuid' })
    checked_in_by: string;

    @Column({ type: 'timestamp' })
    checked_in_at: Date;
}
