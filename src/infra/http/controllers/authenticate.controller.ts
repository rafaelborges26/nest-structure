import {
    Body,
    Controller, Post,
    UnauthorizedException,
    UsePipes
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcryptjs'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
  
  import { PrismaService } from '@/infra/prisma/prisma.service'
import { z } from 'zod'
  
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string(),
  })
  
  type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>
  
  @Controller('/sessions')
  export class AuthenticateController {
    constructor(private jwt: JwtService, private prisma: PrismaService) {}
    @Post()
    @UsePipes(new ZodValidationPipe(authenticateBodySchema)) // adicionar validação dos campos com o zod
    async handle(@Body() body: AuthenticateBodySchema) {
        const { email, password } = body 

        // validate email
        const user = await this.prisma.user.findUnique({
            where: {
                email
            }
        })

        if(!user){
            throw new UnauthorizedException('User credentials do not match.')
        }

        // validate password
        const isPasswordValid = await compare(password, user.password)

        if(!isPasswordValid) {
            throw new UnauthorizedException('User credentials do not match.')
        }

        const accessToken = this.jwt.sign({ sub: user.id })

        return {
            access_token: accessToken
        }
    }
  }
  