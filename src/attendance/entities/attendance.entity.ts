
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from 'typeorm';

@Entity('attendance')
export class Attendance {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'registration_id',
        type: 'varchar',
        nullable: true,
    })
    registrationId: string;

    @Column({
        name: 'checked_in_by',
        type: 'varchar',
        nullable: true,
    })
    checkedInBy: string;

    @CreateDateColumn({
        name: 'checked_in_at',
        type: 'timestamp',
    })
    checkedInAt: Date;
}
