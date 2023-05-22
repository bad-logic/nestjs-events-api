import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Attendee } from './attendee.entity';
import { User } from '../auth/user.entity';
import { Expose } from 'class-transformer';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column()
  @Expose()
  name: string;

  @Column()
  @Expose()
  description: string;

  @Column()
  @Expose()
  when: Date;

  @Column()
  @Expose()
  address: string;

  @OneToMany(() => Attendee, (attendee) => attendee.event, { cascade: true })
  attendees: Attendee[];

  @ManyToOne(() => User, (user) => user.events)
  @JoinColumn({
    name: 'organizer_id',
  })
  organizer: User;

  @Column({ nullable: true })
  organizer_id: number;

  @Expose()
  attendeeCount?: number;

  @Expose()
  attendeeRejected?: number;

  @Expose()
  attendeeMaybe?: number;

  @Expose()
  attendeeAccepted?: number;
}
