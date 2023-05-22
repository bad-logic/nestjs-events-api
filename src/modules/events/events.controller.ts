import {
  Controller,
  Delete,
  Get,
  Post,
  Patch,
  Param,
  Body,
  HttpCode,
  ParseIntPipe,
  ValidationPipe,
  Logger,
  NotFoundException,
  Inject,
  Query,
  UsePipes,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto.';
import { EventService } from './events.service';
import { ListEvents } from './list.events';
import { currentUser } from '../auth/current-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/user.entity';
import { AuthGuardJwt } from '../auth/auth-guard.jwt';

@Controller('/events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(
    @Inject(EventService)
    private readonly eventService: EventService,
  ) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() filter: ListEvents) {
    this.logger.log(`Hit the findAll route`);
    const result =
      await this.eventService.getEventsWithAttendeeCountFilteredPaginated({
        when: +filter.when,
        limit: +filter.limit,
        page: +filter.page,
      });
    this.logger.log(`Found ${result.data.length} events`);
    return result;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const event = await this.eventService.getEvent(id);
    if (!event) {
      throw new NotFoundException();
    }
    return event;
  }

  @Post()
  // @UseGuards(AuthGuard('jwt'))
  @UseGuards(AuthGuardJwt)
  create(
    @currentUser() user: User,
    @Body(ValidationPipe) input: CreateEventDto,
  ) {
    return this.eventService.createEvent(input, user);
  }

  @Patch(':id')
  @UseGuards(AuthGuardJwt)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() input: UpdateEventDto,
    @currentUser() user: User,
  ) {
    const event = await this.eventService.getEvent(id);
    if (!event) {
      throw new NotFoundException();
    }

    if (event.organizer_id !== user.id) {
      throw new ForbiddenException(
        null,
        `you are not authorized to update this event`,
      );
    }

    if (event.organizer_id !== user.id) {
      throw new ForbiddenException(
        null,
        `you are not authorized to change this event`,
      );
    }

    return this.eventService.updateEvent(event, input);
  }

  @Delete(':id')
  @UseGuards(AuthGuardJwt)
  @HttpCode(204)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @currentUser() user: User,
  ) {
    const event = await this.eventService.getEvent(id);

    if (!event) {
      throw new NotFoundException();
    }

    if (event.organizer_id !== user.id) {
      throw new ForbiddenException(
        null,
        `you are not authorized to delete this event`,
      );
    }

    return this.eventService.deleteEvent(id);
  }
}
