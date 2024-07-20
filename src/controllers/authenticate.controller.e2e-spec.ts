import { AppModule } from "@/app.module";
import { PrismaService } from "@/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { Test } from '@nestjs/testing'
import { hash } from "bcryptjs";
import request from 'supertest'

describe('Authenticate (E2E)', () => {

    let app: INestApplication;
    let prisma: PrismaService


    beforeAll(async () => {
        //rodar aplicação para funcionar local
        const moduleRef = await Test.createTestingModule({
          imports: [AppModule],
        }).compile();
    
        app = moduleRef.createNestApplication();
        prisma = moduleRef.get(PrismaService) //chamar o banco de dados
        await app.init();
      });

    test('POST /sessions', async () => {

        await prisma.user.create({
            data: {
                name: 'John Doe',
                email: 'johndoe@example.com',
                password: await hash('123456', 8)
            }
        })

        const response = await request(app.getHttpServer()).post('/sessions').send({
            email: 'johndoe@example.com',
            password: '123456'
        })

        expect(response.statusCode).toBe(201)
        expect(response.body).toEqual({
            access_token: expect.any(String)  //verificar se tem o token
        })
    })
})