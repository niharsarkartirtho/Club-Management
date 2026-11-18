import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Membership } from '../../memberships/entities/membership.entity.js';
import type { Relation } from 'typeorm';
import { Registration } from '../../event-registrations/entities/event-registration.entity.js';
export enum Role {
  ADMIN = 'ADMIN',
  STUDENT = 'STUDENT',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash', select: false })
  password: string;

  @Column({ name: 'student_id', unique: true })
  studentId: string;

  @Column()
  department: string;

  @Column({ type: 'enum', enum: Role, default: Role.STUDENT })
  role: Role;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;



  @OneToMany(() => Membership, (mem) => mem.user)
  memberships: Relation<Membership[]>;

  @OneToMany(() => Registration, (r) => r.user)
  registrations: Registration[];

}
