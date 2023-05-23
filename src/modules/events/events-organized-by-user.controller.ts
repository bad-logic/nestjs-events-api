import {
  Controller,
  DefaultValuePipe,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { EventService } from './events.service';

@Controller('events-organized-by-user/:userId')
export class EventsOrganizedByUserController {
  logger = new Logger(EventsOrganizedByUserController.name);

  constructor(private readonly eventsService: EventService) {}

  @Get()
  public async findAll(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ) {
    return this.eventsService.getEventsOrganizedByUserIdPaginated(userId, {
      currentPage: page,
      limit,
    });
  }
}
