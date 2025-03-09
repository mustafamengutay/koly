import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column('simple-array', { default: [] })
  leaderIds: number[];

  @Column('simple-array', { default: [] })
  participantIds: number[];

  @Column('simple-array', { default: [] })
  issueIds: number[];

  @Column('simple-array', { default: [] })
  invitationIds: number[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
