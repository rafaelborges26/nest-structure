import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create account (E2E)', () => {

    let app: INestApplication;
    let prisma: PrismaService


    beforeAll(async () => {
        // rodar aplicação para funcionar local
        const moduleRef = await Test.createTestingModule({
          imports: [AppModule],
        }).compile();
    
        app = moduleRef.createNestApplication();
        prisma = moduleRef.get(PrismaService) // chamar o banco de dados
        await app.init();
      });

    test('POST /accounts', async () => {
        const response = await request(app.getHttpServer()).post('/accounts').send({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        })

        expect(response.statusCode).toBe(201)

        const userOnDatabase = await prisma.user.findUnique({
            where: {
                email: 'johndoe@example.com',
            }
        })

        expect(userOnDatabase).toBeTruthy() // verificar se foi criado
    })
})