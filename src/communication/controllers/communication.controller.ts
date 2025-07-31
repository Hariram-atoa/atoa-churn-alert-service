import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { SlackService } from '../services/slack.service';
import { TriggerSlackAlertDto } from '../dto/trigger-slack-alert.dto';

@Controller('communication')
export class CommunicationController {
  constructor(private readonly slackService: SlackService) {}

  @Post('/trigger-slack-alert')
  async triggerSlackAlert(@Body() triggerSlackAlertDto: TriggerSlackAlertDto) {
    const { message } = triggerSlackAlertDto;

    try {
      const result = await this.slackService.triggerSlackAlert(message);

      return result
        ? `Slack alert triggered successfully.`
        : `Failed to trigger Slack alert.`;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
