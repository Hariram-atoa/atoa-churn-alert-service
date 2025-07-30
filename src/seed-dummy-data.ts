import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AlertEntity } from './entities/alert.entity/alert.entity';
import { CallLogEntity } from './entities/call-log.entity/call-log.entity';
import { AlertSeverityEnum } from './enum/alert.severity.enum';
import { AlertStatusEnum } from './enum/alert.status.enum';
import { AlertTypeEnum } from './enum/alert.type.enum';
import { CallStatusEnum } from './enum/call.status.enum';

async function seedDummyData() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const alertRepository = app.get(getRepositoryToken(AlertEntity));
  const callLogRepository = app.get(getRepositoryToken(CallLogEntity));

  console.log('Starting to seed dummy data...');

  // Create dummy alerts with various scenarios
  const dummyAlerts = [
    // Critical GTV Drop - Open
    {
      severity: AlertSeverityEnum.CRITICAL,
      merchantId: '550e8400-e29b-41d4-a716-446655440001',
      summary: {
        previousGtv: 50000,
        currentGtv: 15000,
        dropPercentage: 70,
        riskLevel: 'High'
      },
      status: AlertStatusEnum.OPEN,
      alertType: AlertTypeEnum.GTV_DROP,
      assignedToUser: '550e8400-e29b-41d4-a716-446655440010',
      comments: [
        {
          fromUser: '550e8400-e29b-41d4-a716-446655440010',
          comment: 'Critical GTV drop detected. Immediate action required.'
        }
      ]
    },
    // High TC Drop - Open
    {
      severity: AlertSeverityEnum.HIGH,
      merchantId: '550e8400-e29b-41d4-a716-446655440002',
      summary: {
        previousTc: 150,
        currentTc: 80,
        dropPercentage: 47,
        riskLevel: 'Medium'
      },
      status: AlertStatusEnum.OPEN,
      alertType: AlertTypeEnum.TC_DROP,
      assignedToUser: '550e8400-e29b-41d4-a716-446655440012',
      comments: [
        {
          fromUser: '550e8400-e29b-41d4-a716-446655440012',
          comment: 'Significant TC drop. Need to investigate root cause.'
        }
      ]
    },
    // Medium GTV Drop - Resolved
    {
      severity: AlertSeverityEnum.MEDIUM,
      merchantId: '550e8400-e29b-41d4-a716-446655440003',
      summary: {
        previousGtv: 30000,
        currentGtv: 22000,
        dropPercentage: 27,
        riskLevel: 'Low'
      },
      status: AlertStatusEnum.RESOLVED,
      alertType: AlertTypeEnum.GTV_DROP,
      assignedToUser: '550e8400-e29b-41d4-a716-446655440014',
      followUpDate: new Date('2024-02-15'),
      followUpReason: 'Merchant explained seasonal business slowdown',
      comments: [
        {
          fromUser: '550e8400-e29b-41d4-a716-446655440014',
          comment: 'Issue resolved after discussion with merchant.'
        }
      ]
    },
    // Low TC Drop - Open
    {
      severity: AlertSeverityEnum.LOW,
      merchantId: '550e8400-e29b-41d4-a716-446655440004',
      summary: {
        previousTc: 50,
        currentTc: 45,
        dropPercentage: 10,
        riskLevel: 'Low'
      },
      status: AlertStatusEnum.OPEN,
      alertType: AlertTypeEnum.TC_DROP,
      comments: [
        {
          fromUser: '550e8400-e29b-41d4-a716-446655440016',
          comment: 'Minor TC drop. Monitoring required.'
        }
      ]
    },
    // Critical GTV Drop - Open (Unassigned)
    {
      severity: AlertSeverityEnum.CRITICAL,
      merchantId: '550e8400-e29b-41d4-a716-446655440005',
      summary: {
        previousGtv: 75000,
        currentGtv: 20000,
        dropPercentage: 73,
        riskLevel: 'Critical'
      },
      status: AlertStatusEnum.OPEN,
      alertType: AlertTypeEnum.GTV_DROP,
      comments: [
        {
          fromUser: '550e8400-e29b-41d4-a716-446655440018',
          comment: 'New critical alert. Needs immediate assignment.'
        }
      ]
    },
    // High TC Drop - Resolved
    {
      severity: AlertSeverityEnum.HIGH,
      merchantId: '550e8400-e29b-41d4-a716-446655440006',
      summary: {
        previousTc: 200,
        currentTc: 120,
        dropPercentage: 40,
        riskLevel: 'Medium'
      },
      status: AlertStatusEnum.RESOLVED,
      alertType: AlertTypeEnum.TC_DROP,
      assignedToUser: '550e8400-e29b-41d4-a716-446655440020',
      followUpDate: new Date('2024-02-10'),
      followUpReason: 'Technical issue resolved',
      comments: [
        {
          fromUser: '550e8400-e29b-41d4-a716-446655440020',
          comment: 'Technical issue was causing the drop. Fixed now.'
        }
      ]
    },
    // Medium GTV Drop - Open
    {
      severity: AlertSeverityEnum.MEDIUM,
      merchantId: '550e8400-e29b-41d4-a716-446655440007',
      summary: {
        previousGtv: 45000,
        currentGtv: 32000,
        dropPercentage: 29,
        riskLevel: 'Medium'
      },
      status: AlertStatusEnum.OPEN,
      alertType: AlertTypeEnum.GTV_DROP,
      assignedToUser: '550e8400-e29b-41d4-a716-446655440022',
      comments: [
        {
          fromUser: '550e8400-e29b-41d4-a716-446655440022',
          comment: 'Investigating the cause of GTV drop.'
        }
      ]
    },
    // Low TC Drop - Resolved
    {
      severity: AlertSeverityEnum.LOW,
      merchantId: '550e8400-e29b-41d4-a716-446655440008',
      summary: {
        previousTc: 30,
        currentTc: 28,
        dropPercentage: 7,
        riskLevel: 'Low'
      },
      status: AlertStatusEnum.RESOLVED,
      alertType: AlertTypeEnum.TC_DROP,
      assignedToUser: '550e8400-e29b-41d4-a716-446655440024',
      followUpDate: new Date('2024-02-05'),
      followUpReason: 'Normal business fluctuation',
      comments: [
        {
          fromUser: '550e8400-e29b-41d4-a716-446655440024',
          comment: 'Minor fluctuation. No action needed.'
        }
      ]
    }
  ];

  // Insert alerts
  const savedAlerts = await alertRepository.save(dummyAlerts);
  console.log(`Inserted ${savedAlerts.length} alerts`);

  // Create dummy call logs for various alerts
  const dummyCallLogs = [
    // Call logs for Critical GTV Drop Alert
    {
      alert: savedAlerts[0],
      callId: 'call_001',
      calledBy: '550e8400-e29b-41d4-a716-446655440010',
      callStatus: CallStatusEnum.RE_ENGAGED,
      summary: 'Merchant was concerned about the drop. Provided support and solutions.'
    },
    {
      alert: savedAlerts[0],
      callId: 'call_002',
      calledBy: '550e8400-e29b-41d4-a716-446655440011',
      callStatus: CallStatusEnum.CALLBACK,
      summary: 'Scheduled follow-up call for next week.'
    },
    // Call logs for High TC Drop Alert
    {
      alert: savedAlerts[1],
      callId: 'call_003',
      calledBy: '550e8400-e29b-41d4-a716-446655440012',
      callStatus: CallStatusEnum.NO_ANSWER,
      summary: 'No answer. Left voicemail.'
    },
    {
      alert: savedAlerts[1],
      callId: 'call_004',
      calledBy: '550e8400-e29b-41d4-a716-446655440013',
      callStatus: CallStatusEnum.NOT_INTERESTED,
      summary: 'Merchant not interested in discussing the issue.'
    },
    // Call logs for Medium GTV Drop Alert (Resolved)
    {
      alert: savedAlerts[2],
      callId: 'call_005',
      calledBy: '550e8400-e29b-41d4-a716-446655440014',
      callStatus: CallStatusEnum.RE_ENGAGED,
      summary: 'Discussed seasonal business patterns. Issue resolved.'
    },
    // Call logs for Low TC Drop Alert
    {
      alert: savedAlerts[3],
      callId: 'call_006',
      calledBy: '550e8400-e29b-41d4-a716-446655440016',
      callStatus: CallStatusEnum.RE_ENGAGED,
      summary: 'Minor fluctuation explained. No immediate action needed.'
    },
    // Call logs for Critical GTV Drop Alert (Unassigned)
    {
      alert: savedAlerts[4],
      callId: 'call_007',
      calledBy: '550e8400-e29b-41d4-a716-446655440018',
      callStatus: CallStatusEnum.NO_ANSWER,
      summary: 'No answer. Critical alert needs immediate attention.'
    },
    // Call logs for High TC Drop Alert (Resolved)
    {
      alert: savedAlerts[5],
      callId: 'call_008',
      calledBy: '550e8400-e29b-41d4-a716-446655440020',
      callStatus: CallStatusEnum.RE_ENGAGED,
      summary: 'Technical issue identified and resolved.'
    },
    // Call logs for Medium GTV Drop Alert
    {
      alert: savedAlerts[6],
      callId: 'call_009',
      calledBy: '550e8400-e29b-41d4-a716-446655440022',
      callStatus: CallStatusEnum.CALLBACK,
      summary: 'Scheduled investigation call.'
    },
    {
      alert: savedAlerts[6],
      callId: 'call_010',
      calledBy: '550e8400-e29b-41d4-a716-446655440023',
      callStatus: CallStatusEnum.RE_ENGAGED,
      summary: 'Investigation in progress. Gathering more information.'
    },
    // Call logs for Low TC Drop Alert (Resolved)
    {
      alert: savedAlerts[7],
      callId: 'call_011',
      calledBy: '550e8400-e29b-41d4-a716-446655440024',
      callStatus: CallStatusEnum.RE_ENGAGED,
      summary: 'Confirmed normal business fluctuation. No action required.'
    }
  ];

  // Insert call logs
  const savedCallLogs = await callLogRepository.save(dummyCallLogs);
  console.log(`Inserted ${savedCallLogs.length} call logs`);

  console.log('Dummy data seeding completed successfully!');
  console.log('\nTest Cases Created:');
  console.log('1. Critical GTV Drop - Open (with 2 call logs)');
  console.log('2. High TC Drop - Open (with 2 call logs)');
  console.log('3. Medium GTV Drop - Resolved (with 1 call log)');
  console.log('4. Low TC Drop - Open (with 1 call log)');
  console.log('5. Critical GTV Drop - Open, Unassigned (with 1 call log)');
  console.log('6. High TC Drop - Resolved (with 1 call log)');
  console.log('7. Medium GTV Drop - Open (with 2 call logs)');
  console.log('8. Low TC Drop - Resolved (with 1 call log)');

  await app.close();
}

seedDummyData().catch(console.error); 