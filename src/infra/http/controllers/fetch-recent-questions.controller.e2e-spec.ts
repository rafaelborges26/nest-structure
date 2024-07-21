import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Fetch recent questions (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService // para usar o token de autenticação

  beforeAll(async () => {
    // rodar aplicação para funcionar local
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService) // chamar o banco de dados
    jwt = moduleRef.get(JwtService) // chamar o token gerado de autenticaçao
    await app.init()
  })

  test('GET /accounts', async () => {
    // criar a conta de usuario
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
      },
    })

    const accessToken = jwt.sign({
      sub: user.id,
    })

    // criar perguntas
    await prisma.question.createMany({
        data: [
            {
                title: 'Question 01',
                slog: 'question-01',
                content: 'Question contect',
                authorId: user.id
            },
            {
                title: 'Question 02',
                slog: 'question-02',
                content: 'Question contect',
                authorId: user.id
            }
        ]
    })

    // consultar perguntas
    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)


expect(response.body).toEqual({
    questions: [
        expect.objectContaining({title: 'Question 01'}), // verificar se contem esses items dentro dos primeiros elementos da question
        expect.objectContaining({title: 'Question 02'})
    ]
})
  })
})
