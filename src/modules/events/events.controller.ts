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
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto.';
import { Event } from './event.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EventService } from './events.service';
import { ListEvents } from './list.events';

@Controller('/events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>,
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
  create(@Body(ValidationPipe) input: CreateEventDto) {
    return this.repository.save({
      ...input,
      when: new Date(input.when),
    });
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() input: UpdateEventDto,
  ) {
    const event = await this.repository.findOneBy({ id: id });

    return this.repository.save({
      ...event,
      ...input,
      when: input.when ? new Date(input.when) : event.when,
    });
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number) {
    const result = await this.eventService.deleteEvent(id);
    if (result.affected !== 1) {
      throw new NotFoundException();
    }
    return result;
  }
}
