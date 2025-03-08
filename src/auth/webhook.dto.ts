import { IsString } from "class-validator";

export class WebhookDto {
  @IsString()
  token: string;
}
