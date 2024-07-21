import { Module } from "@nestjs/common";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { CreateAccountController } from "./controllers/create-account.controller";
import { CreateQuestionController } from "./controllers/create-question.controller";
import { FetchListenController } from "./controllers/fetch-recent-questions.controller";
import { PrismaService } from "../prisma/prisma.service";

@Module({
    controllers: [CreateAccountController, AuthenticateController, CreateQuestionController, FetchListenController],
    providers: [PrismaService],
})
export class httpModule {}