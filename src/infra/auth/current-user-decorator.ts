import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserPayload } from "./jwt.strategy";

export const CurrentUser = createParamDecorator((_: never /* Não precisa passar primeiro parametro */,context: ExecutionContext ) => {
    const request = context.switchToHttp().getRequest()

    return request.user as UserPayload
})