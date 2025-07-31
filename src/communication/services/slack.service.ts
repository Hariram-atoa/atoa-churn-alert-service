import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SlackService {
  private readonly logger = new Logger(SlackService.name);

  private async postMessage(
    token: string,
    channelId: string,
    message: string,
  ): Promise<boolean> {
    const axiosInstance = axios.create({
      baseURL: 'https://slack.com/api',
      headers: { Authorization: `Bearer ${token}` },
    });

    try {
      await axiosInstance.post('chat.postMessage', {
        channel: channelId,
        text: message,
      });
      this.logger.log(`Successfully notified on slack channel- ${channelId}`);
      return true;
    } catch (error) {
      this.logger.error('SlackService post message Error', {
        message: error?.data?.error,
        name: 'SlackService',
      });
      return false;
    }
  }

  async triggerSlackAlert(message: string): Promise<boolean> {
    const token = process.env.SLACK_APP_TOKEN;
    const channelId = process.env.SLACK_CHANNEL_ID;

    if (!token || !channelId) {
      this.logger.error('Slack configuration missing');
      return false;
    }

    return this.postMessage(token, channelId, message);
  }
}
