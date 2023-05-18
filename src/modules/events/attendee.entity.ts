import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Event } from './event.entity';

export enum AttendeeAnswerEnum {
  Accepted = 1,
  Maybe = 2,
  Rejected = 3,
}

@Entity('attendees')
export class Attendee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Event, (event) => event.attendees, {
    nullable: true,
  })
  @JoinColumn({
    name: 'event_id',
  })
  event: Event;

  @Column('enum', {
    enum: AttendeeAnswerEnum,
    default: AttendeeAnswerEnum.Accepted,
  })
  answer: AttendeeAnswerEnum;
}
