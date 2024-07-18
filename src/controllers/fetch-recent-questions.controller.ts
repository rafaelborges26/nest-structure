import {
    Body,
    Controller, Get, Post,
    Req,
    UseGuards,
    UsePipes
} from '@nestjs/common'
import { CurrentUser } from 'src/auth/current-user-decorator'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { UserPayload } from 'src/auth/jwt.strategy'
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'



  @Controller('/questions')
  @UseGuards(JwtAuthGuard)
  export class FetchListenController {
    constructor(private prisma: PrismaService) {}
    @Get()
    async handle() {
        const questions = await this.prisma.question.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        })

        return { questions }
    }

  }
  