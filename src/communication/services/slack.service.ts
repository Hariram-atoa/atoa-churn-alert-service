import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { SlackAlertLevel } from '../enums/slack-alert-level.enum';

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

  async triggerSlackAlert(
    alertLevel: SlackAlertLevel,
    businessName: string,
    reason: string,
    summary: string,
  ): Promise<boolean> {
    const token = process.env.SLACK_APP_TOKEN;
    const channelId = process.env.SLACK_CHANNEL_ID;

    if (!token || !channelId) {
      this.logger.error('Slack configuration missing');
      return false;
    }

    const message = this.buildAlertMessage(
      alertLevel,
      businessName,
      reason,
      summary,
    );
    return this.postMessage(token, channelId, message);
  }

  private buildAlertMessage(
    alertLevel: SlackAlertLevel,
    businessName: string,
    reason: string,
    summary: string,
  ): string {
    const icon = this.getAlertIcon(alertLevel);
    const levelText = this.getAlertLevelText(alertLevel);

    return (
      `${icon} *${levelText}*\n\n` +
      `*Business:* ${businessName}\n` +
      `*Reason:* ${reason}\n` +
      `*Summary:* ${summary}\n\n` +
      `_Alert triggered at ${new Date().toISOString()}_`
    );
  }

  private getAlertIcon(alertLevel: SlackAlertLevel): string {
    switch (alertLevel) {
      case SlackAlertLevel.HIGH_LEVEL_ALERT:
        return '🚨';
      case SlackAlertLevel.MID_LEVEL_ALERT:
        return '⚠️';
      case SlackAlertLevel.LOW_LEVEL_ALERT:
        return 'ℹ️';
      default:
        return '📢';
    }
  }

  private getAlertLevelText(alertLevel: SlackAlertLevel): string {
    switch (alertLevel) {
      case SlackAlertLevel.HIGH_LEVEL_ALERT:
        return 'HIGH LEVEL ALERT';
      case SlackAlertLevel.MID_LEVEL_ALERT:
        return 'MID LEVEL ALERT';
      case SlackAlertLevel.LOW_LEVEL_ALERT:
        return 'LOW LEVEL ALERT';
      default:
        return 'ALERT';
    }
  }
}
