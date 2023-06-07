import * as fs from 'node:fs';
import * as path from 'node:path';

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Connection } from 'typeorm';

import { AppModule } from '../src/app.module';
import { User } from '../src/modules/auth/user.entity';
import { AuthService } from '../src/modules/auth/auth.service';

const loadFixtures = async (connection: Connection, sqlFileName: string) => {
  const sql = fs.readFileSync(
    path.join(__dirname, 'fixtures', sqlFileName),
    'utf8',
  );

  const queryRunner = connection.driver.createQueryRunner('master');
  for (const c of sql.split(';')) {
    if (c) {
      await queryRunner.query(c);
    }
  }
};

export const tokenForUser = (
  app: INestApplication,
  user: Partial<User> = {
    id: 1,
    username: 'e2e-test',
  },
): string => {
  return app.get(AuthService).getTokenForUser(user as User); // fetches AuthService from ioc container ( dependency injection )
};

describe('Events E2E', () => {
  let app: INestApplication;
  let mod: TestingModule;
  let connection: Connection;

  beforeAll(async () => {
    mod = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = mod.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    connection = app.get(Connection); // fetches connection from ioc container
    await loadFixtures(connection, 'event-user.sql');
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return a single event', async () => {
    return request(app.getHttpServer())
      .get('/events/1')
      .expect(200)
      .then((response) => {
        expect(response.body.id).toBe(1);
        expect(response.body.name).toBe('Interesting Party');
      });
  });

  it('should return a list of (2) events', async () => {
    return request(app.getHttpServer())
      .get('/events')
      .expect(200)
      .then((resp) => {
        expect(resp.body.data.length).toBe(2);
      });
  });

  it('should throw a an error when creating event being unauthenticated', () => {
    return request(app.getHttpServer()).post('/events').send({}).expect(401);
  });

  it('should throw an error when creating event with wrong input', async () => {
    return request(app.getHttpServer())
      .post('/events')
      .set('Authorization', `Bearer ${tokenForUser(app)}`)
      .send({})
      .expect(400)
      .then((response) => {
        expect(response.body).toMatchObject({
          statusCode: 400,
          message: [
            'The name length should have at least 2 characters',
            'name must be a string',
            'description must be longer than or equal to 5 characters',
            'description must be a string',
            'when must be a valid ISO 8601 date string',
            'address must be longer than or equal to 2 characters',
            'address must be a string',
          ],
          error: 'Bad Request',
        });
      });
  });

  it('should create an event', async () => {
    const when = new Date().toISOString();

    return request(app.getHttpServer())
      .post('/events')
      .set('Authorization', `Bearer ${tokenForUser(app)}`)
      .send({
        name: 'E2e Event',
        description: 'A fake event from e2e tests',
        when,
        address: 'Street 123',
      })
      .expect(201)
      .then((resp) => {
        return request(app.getHttpServer())
          .get(`/events/${resp.body.id}`)
          .expect(200)
          .then((response) => {
            expect(response.body).toMatchObject({
              id: resp.body.id,
              name: 'E2e Event',
              description: 'A fake event from e2e tests',
              address: 'Street 123',
            });
          });
      });
  });

  it('should throw an error when changing non existing event', () => {
    return request(app.getHttpServer())
      .put('/events/100')
      .set('Authorization', `Bearer ${tokenForUser(app)}`)
      .send({})
      .expect(404);
  });

  it('should throw an error when changing an event of other user', async () => {
    return request(app.getHttpServer())
      .patch('/events/1')
      .set(
        'Authorization',
        `Bearer ${tokenForUser(app, { id: 2, username: 'nasty' })}`,
      )
      .send({
        name: 'Updated event name',
      })
      .expect(403);
  });

  it('should update an event name', async () => {
    return request(app.getHttpServer())
      .patch('/events/1')
      .set('Authorization', `Bearer ${tokenForUser(app)}`)
      .send({
        name: 'Updated event name',
      })
      .expect(200)
      .then((response) => {
        expect(response.body.name).toBe('Updated event name');
      });
  });

  it('should throw an error when removing an event of other user', async () => {
    return request(app.getHttpServer())
      .delete('/events/1')
      .set(
        'Authorization',
        `Bearer ${tokenForUser(app, { id: 2, username: 'nasty' })}`,
      )
      .expect(403);
  });

  it('should remove an event', async () => {
    return request(app.getHttpServer())
      .delete('/events/1')
      .set('Authorization', `Bearer ${tokenForUser(app)}`)
      .expect(204)
      .then((_) => {
        return request(app.getHttpServer()).get('/events/1').expect(404);
      });
  });

  it('should throw an error when removing non existing event', async () => {
    return request(app.getHttpServer())
      .delete('/events/100')
      .set('Authorization', `Bearer ${tokenForUser(app)}`)
      .expect(404);
  });
});
