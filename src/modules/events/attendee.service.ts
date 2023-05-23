import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendee } from './attendee.entity';
import { Repository } from 'typeorm';
import { CreateAttendeeDto } from './dto/create-attendee.dto';

@Injectable()
export class AttendeeService {
  logger = new Logger(AttendeeService.name);

  constructor(
    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>,
  ) {}

  public async findByEventId(eventId: number): Promise<Attendee[]> {
    return this.attendeeRepository.findBy({
      event: { id: eventId },
    });
  }

  public async findOneByEventIdAndUserId(
    eventId: number,
    userId: number,
  ): Promise<Attendee | undefined> {
    return this.attendeeRepository.findOneBy({
      event: { id: eventId },
      user: { id: userId },
    });
  }

  public async createOrUpdate(
    input: CreateAttendeeDto,
    eventId: number,
    userId: number,
  ) {
    let attendee = await this.findOneByEventIdAndUserId(eventId, userId);
    if (!attendee) {
      attendee = new Attendee();
    }

    attendee.event_id = eventId;
    attendee.user_id = userId;
    attendee.answer = input.answer;

    return this.attendeeRepository.save(attendee);
  }
}
