import {
    Controller, Post,
    UseGuards
} from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
  
  //import { PrismaService } from 'src/prisma/prisma.service'
  
  //const authenticateBodySchema = z.object({
  //  email: z.string().email(),
  //  password: z.string(),
  //})
  

  
  @Controller('/questions')
  @UseGuards(JwtAuthGuard)
  export class CreateQuestionController {
    constructor() {}
    @Post()
    //@HttpCode(201) // determinando o sucesso
    //@UsePipes(new ZodValidationPipe(authenticateBodySchema)) // adicionar validação dos campos com o zod
    async handle() {
        return 'ok'
        
    }
  }
  