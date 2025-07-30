# Communication Module

The Communication Module handles Slack alert notifications for the churn alert service. It provides a centralized way to send different types of alerts to Slack channels with customizable messages and severity levels.

## Overview

This module integrates with Slack's API to send formatted alert messages based on different alert levels. It includes proper error handling, logging, and environment-based configuration.

## Architecture

```
Controller → Service → Slack API
    ↓
  DTO Validation
    ↓
  Environment Config
```

## Components

### 1. **SlackAlertLevel Enum**

Defines the three alert levels with corresponding icons:

- `HIGH_LEVEL_ALERT` (🚨) - Critical alerts requiring immediate attention
- `MID_LEVEL_ALERT` (⚠️) - Important alerts needing attention soon
- `LOW_LEVEL_ALERT` (ℹ️) - Informational alerts

### 2. **TriggerSlackAlertDto**

Validates incoming request data:

- `alertLevel`: Must be one of the defined enum values
- `businessName`: Required string for business identification
- `reason`: Required string describing the alert reason
- `summary`: Required string with detailed summary

### 3. **SlackService**

Core service handling Slack integration:

- **Private Methods:**
  - `postMessage()`: Handles actual Slack API communication
  - `buildAlertMessage()`: Constructs formatted message with icons and metadata
  - `getAlertIcon()`: Returns appropriate emoji based on alert level
  - `getAlertLevelText()`: Returns human-readable alert level text

- **Public Methods:**
  - `triggerSlackAlert()`: Main method for sending alerts with validation

### 4. **CommunicationController**

REST API endpoint for triggering Slack alerts.

## Environment Variables

Required environment variables for Slack integration:

```bash
SLACK_APP_TOKEN=your_slack_bot_token
SLACK_CHANNEL_ID=your_channel_id
```

## API Endpoints

### POST `/communication/trigger-slack-alert`

Triggers a Slack alert with specified parameters.

**Request Body:**

```json
{
  "alertLevel": "high_level_alert",
  "businessName": "ABC Corporation",
  "reason": "Payment failure detected",
  "summary": "Multiple failed payment attempts in the last 24 hours"
}
```

**Curl Examples:**

#### High Level Alert (Critical)

```bash
curl -X POST http://localhost:3000/communication/trigger-slack-alert \
  -H "Content-Type: application/json" \
  -d '{
    "alertLevel": "high_level_alert",
    "businessName": "TechCorp Inc",
    "reason": "Critical system outage",
    "summary": "Database connection failed, affecting all services"
  }'
```

#### Mid Level Alert (Important)

```bash
curl -X POST http://localhost:3000/communication/trigger-slack-alert \
  -H "Content-Type: application/json" \
  -d '{
    "alertLevel": "mid_level_alert",
    "businessName": "StartupXYZ",
    "reason": "Unusual activity detected",
    "summary": "Multiple login attempts from unknown IP addresses"
  }'
```

#### Low Level Alert (Informational)

```bash
curl -X POST http://localhost:3000/communication/trigger-slack-alert \
  -H "Content-Type: application/json" \
  -d '{
    "alertLevel": "low_level_alert",
    "businessName": "SmallBiz Ltd",
    "reason": "Scheduled maintenance reminder",
    "summary": "System maintenance scheduled for tonight at 2 AM"
  }'
```

**Response:**

```json
{
  "message": "Slack alert triggered successfully."
}
```

## Message Format

The service automatically formats messages with:

- **Icon**: Emoji based on alert level (🚨, ⚠️, ℹ️)
- **Level Text**: Human-readable alert level
- **Business Name**: Company or entity name
- **Reason**: Brief description of the alert cause
- **Summary**: Detailed explanation
- **Timestamp**: ISO timestamp of when alert was triggered

**Example Message:**

```
🚨 *HIGH LEVEL ALERT*

*Business:* TechCorp Inc
*Reason:* Critical system outage
*Summary:* Database connection failed, affecting all services

_Alert triggered at 2024-01-15T10:30:00.000Z_
```

## Error Handling

The service includes comprehensive error handling:

- **Configuration Errors**: Missing environment variables
- **API Errors**: Slack API communication failures
- **Validation Errors**: Invalid request data
- **Network Errors**: Connection timeouts and failures

All errors are logged with appropriate context for debugging.

## Logging

The service uses NestJS Logger for:

- Successful message deliveries
- Error conditions with detailed context
- Configuration issues
- API response tracking

## Security Considerations

- Uses environment variables for sensitive configuration
- Validates all input data
- Implements proper error handling without exposing sensitive information
- Uses HTTPS for all external API calls

## Integration

This module can be easily integrated with other services by:

1. Injecting `SlackService` into other modules
2. Calling `triggerSlackAlert()` method with appropriate parameters
3. Handling the boolean response for success/failure tracking

## Dependencies

- `@nestjs/common`: Core NestJS functionality
- `axios`: HTTP client for Slack API calls
- `class-validator`: Request validation
- `class-transformer`: Data transformation
