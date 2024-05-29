import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('authentication system (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', async () => {
    const user = {
      email: 'vf@gmail.com',
      password: 'password',
      name: 'name',
      repeatPassword: 'password',
    };
    return await request(app.getHttpServer())
      .post('/auth/local/signup')
      .send(user)
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        console.log(res.body, 'res.body');
        expect(id).toBeDefined();
        expect(email).toEqual(user.email);
      });
  });
});
