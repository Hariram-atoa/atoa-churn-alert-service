import { Module } from '@nestjs/common';
import { CommunicationController } from './controllers/communication.controller';
import { SlackService } from './services/slack.service';

@Module({
  controllers: [CommunicationController],
  providers: [SlackService],
  exports: [SlackService],
})
export class CommunicationModule {}
