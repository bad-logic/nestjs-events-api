import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, SelectQueryBuilder } from 'typeorm';
import { AttendeeAnswerEnum } from './attendee.entity';
import { Event } from './event.entity';
import { Injectable, Logger } from '@nestjs/common';
import { ListEvents, WhenEventFilter } from './list.events';
import { PaginateOptions, paginate } from '../../common/pagination/paginator';
import { CreateEventDto } from './dto/create-event.dto';
import { User } from '../auth/user.entity';
import { UpdateEventDto } from './dto/update-event.dto.';

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);

  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
  ) {}

  private getEventsBaseQuery(): SelectQueryBuilder<Event> {
    return this.eventsRepository
      .createQueryBuilder('e')
      .orderBy('e.id', 'DESC');
  }

  public async createEvent(input: CreateEventDto, user: User) {
    return this.eventsRepository.save({
      ...input,
      when: new Date(input.when),
      organizer: user,
    });
  }

  public async updateEvent(event: Event, input: UpdateEventDto) {
    return this.eventsRepository.save({
      ...event,
      ...input,
      when: input.when ? new Date(input.when) : event.when,
    });
  }

  private getEventsWithAttendeeCountQuery(): SelectQueryBuilder<Event> {
    return this.getEventsBaseQuery()
      .loadRelationCountAndMap('e.attendeeCount', 'e.attendees')
      .loadRelationCountAndMap(
        'e.attendeeAccepted',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.answer = :answer', {
            answer: AttendeeAnswerEnum.Accepted,
          }),
      )
      .loadRelationCountAndMap(
        'e.attendeeRejected',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.answer = :answer', {
            answer: AttendeeAnswerEnum.Rejected,
          }),
      )
      .loadRelationCountAndMap(
        'e.attendeeMaybe',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.answer = :answer', {
            answer: AttendeeAnswerEnum.Maybe,
          }),
      );
  }

  private getEventsWithAttendeeCountFiltered(
    filter?: ListEvents,
  ): SelectQueryBuilder<Event> {
    let query = this.getEventsWithAttendeeCountQuery();
    if (!filter) {
      return query;
    }
    if (filter.when) {
      if (filter.when === WhenEventFilter.Today) {
        query = query.andWhere(
          `e.when >= CURDATE() AND e.when <= CURDATE() + INTERVAL 1 DAY`,
        );
      }

      if (filter.when === WhenEventFilter.Tomorrow) {
        query = query.andWhere(
          `e.when >= CURDATE() + INTERVAL 1 DAY AND e.when <= CURDATE() + INTERVAL 2 DAY`,
        );
      }

      if (filter.when === WhenEventFilter.ThisWeek) {
        query = query.andWhere(`YEARWEEK(e.when,1) = YEARWEEK(CURDATE(),1) `);
      }

      if (filter.when === WhenEventFilter.NextWeek) {
        query = query.andWhere(
          `YEARWEEK(e.when,1) = YEARWEEK(CURDATE(),1) + 1 `,
        );
      }
    }
    this.logger.log(`executing ${query.getSql()}`);

    return query;
  }

  public getEventsWithAttendeeCountFilteredPaginated(filter: ListEvents) {
    const paginateOptions: PaginateOptions = {
      currentPage: +filter.page,
      limit: +filter.limit,
    };
    return paginate(
      this.getEventsWithAttendeeCountFiltered(filter),
      paginateOptions,
    );
  }

  public getEvent(id: number): Promise<Event | undefined> {
    const query = this.getEventsWithAttendeeCountQuery().andWhere(
      'e.id = :id',
      { id },
    );
    this.logger.log(`executing ${query.getSql()}`);
    return query.getOne();
  }

  public async deleteEvent(id: number): Promise<DeleteResult> {
    return this.eventsRepository
      .createQueryBuilder('e')
      .delete()
      .where('id = :id', { id })
      .execute();
  }
}
