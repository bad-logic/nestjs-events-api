import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Event } from './event.entity';
import { User } from '../auth/user.entity';
import { Field, ObjectType } from '@nestjs/graphql';

export enum AttendeeAnswerEnum {
  Accepted = 1,
  Maybe = 2,
  Rejected = 3,
}

@Entity('attendees')
@ObjectType()
export class Attendee {
  @PrimaryGeneratedColumn()
  @Field({ nullable: true })
  id: number;

  @ManyToOne(() => Event, (event) => event.attendees, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'event_id',
  })
  event: Event;

  @Column()
  event_id: number;

  @Column('enum', {
    enum: AttendeeAnswerEnum,
    default: AttendeeAnswerEnum.Accepted,
  })
  answer: AttendeeAnswerEnum;

  @ManyToOne(() => User, (user) => user.attended)
  @JoinColumn({
    name: 'user_id',
  })
  user: User;

  @Column()
  user_id: number;
}
