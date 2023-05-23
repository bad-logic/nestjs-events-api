import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { EventService } from './events.service';

@Controller('events-organized-by-user/:userId')
export class EventsOrganizedByUserController {
  logger = new Logger(EventsOrganizedByUserController.name);

  constructor(private readonly eventsService: EventService) {}

  @Get()
  public async findAll(
    @Param('userId') userId: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.eventsService.getEventsOrganizedByUserIdPaginated(userId, {
      currentPage: page,
      limit,
    });
  }
}
