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

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  when: Date;

  @Column()
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

  attendeeCount?: number;

  attendeeRejected?: number;

  attendeeMaybe?: number;

  attendeeAccepted?: number;
}
