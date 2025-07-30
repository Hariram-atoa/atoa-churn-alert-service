# Alerts Module

The Alerts Module manages alert entities for the churn alert service. It provides comprehensive CRUD operations with advanced filtering, pagination, severity statistics, and automatic call log creation when alerts are resolved.

## Overview

This module handles all alert-related operations including creating, reading, updating, and deleting alerts. It supports advanced filtering by various criteria, maintains relationships with call log entities, and provides severity-based statistics for analytics.

## Architecture

```
Controller → Service → Repository → Database
    ↓
  DTO Validation
    ↓
  Business Logic
    ↓
  TypeORM Queries
    ↓
  Call Logs Integration
```

## Components

### 1. **CreateAlertDto**

Defines the structure for creating new alerts:

- `severity`: Must be one of the defined enum values (Low, Medium, High, Critical)
- `merchantId`: Required UUID for merchant identification
- `summary`: Optional JSON object for additional alert details
- `followUpReason`: Optional string for follow-up notes

### 2. **UpdateAlertStatusDto**

Defines the structure for updating alert status:

- `status`: Must be one of the defined enum values (Open, Resolved)
- `followUpReason`: Optional string for follow-up notes
- `callLog`: Optional call log data (required when status is RESOLVED)
  - `calledBy`: Required string for who made the call
  - `callId`: Optional string for call identification
  - `callStatus`: Required enum value for call outcome
  - `summary`: Optional string for call summary

### 3. **SearchAlertsDto**

Defines the structure for filtered alert requests:

- `severity`: Filter by alert severity (optional)
- `fromDate`: Start date for date range filtering (optional)
- `toDate`: End date for date range filtering (optional)
- `status`: Filter by alert status (optional)
- `merchantId`: Filter by merchant ID (optional)
- `page`: Page number for pagination (default: 1)
- `limit`: Number of records per page (default: 10)

### 4. **AlertsRepository**

Handles all database operations:

- **Query Building**: Dynamic query construction with TypeORM
- **Filtering**: Date ranges, severity, status, merchant ID
- **Pagination**: Skip/take with proper counting
- **Statistics**: Severity-based statistics calculation
- **CRUD Operations**: Create, read, update, delete

### 5. **AlertsService**

Business logic layer with:

- **Validation**: Date range validation, required field checks
- **Error Handling**: Proper HTTP exceptions
- **Pagination Logic**: Metadata calculation
- **Call Log Integration**: Automatic call log creation when status is RESOLVED
- **Statistics**: Severity-based analytics

### 6. **AlertsController**

REST API endpoints with:

- **UUID Validation**: Using ParseUUIDPipe
- **Proper HTTP Methods**: GET, POST, PUT, DELETE
- **Path Parameters**: For specific resource access
- **Body Validation**: Using DTOs

## Alert Severity Enum

The module uses `AlertSeverityEnum` with the following values:

- `LOW` - Low priority alerts
- `MEDIUM` - Medium priority alerts
- `HIGH` - High priority alerts
- `CRITICAL` - Critical alerts requiring immediate attention

## Alert Status Enum

The module uses `AlertStatusEnum` with the following values:

- `OPEN` - Alert is open and requires attention
- `RESOLVED` - Alert has been resolved (requires call log data)

## API Endpoints

### POST `/alerts`

Create a new alert entry.

**Request Body:**

```json
{
  "severity": "High",
  "merchantId": "123e4567-e89b-12d3-a456-426614174000",
  "summary": {
    "issue": "Payment failure",
    "amount": 5000,
    "customerId": "CUST_001"
  },
  "followUpReason": "Customer needs immediate attention"
}
```

**Curl Examples:**

#### Basic Alert Creation

```bash
curl -X POST http://localhost:3000/alerts \
  -H "Content-Type: application/json" \
  -d '{
    "severity": "Medium",
    "merchantId": "123e4567-e89b-12d3-a456-426614174000",
    "summary": {
      "issue": "Login attempts",
      "count": 15
    }
  }'
```

#### Critical Alert Creation

```bash
curl -X POST http://localhost:3000/alerts \
  -H "Content-Type: application/json" \
  -d '{
    "severity": "Critical",
    "merchantId": "456e7890-e89b-12d3-a456-426614174001",
    "summary": {
      "issue": "System outage",
      "affectedServices": ["payment", "auth"],
      "duration": "2 hours"
    },
    "followUpReason": "Emergency response required"
  }'
```

**Response:**

```json
{
  "id": "789e0123-e89b-12d3-a456-426614174002",
  "severity": "High",
  "merchantId": "123e4567-e89b-12d3-a456-426614174000",
  "status": "Open",
  "summary": {
    "issue": "Payment failure",
    "amount": 5000
  },
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### PUT `/alerts/:id/status`

Update alert status with optional call log creation.

**Request Body:**

```json
{
  "status": "Resolved",
  "followUpReason": "Issue resolved successfully",
  "callLog": {
    "calledBy": "John Doe",
    "callId": "CALL_001",
    "callStatus": "Re-Engaged",
    "summary": "Customer was satisfied with the resolution"
  }
}
```

**Curl Examples:**

#### Update to Open Status

```bash
curl -X PUT http://localhost:3000/alerts/123e4567-e89b-12d3-a456-426614174000/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Open",
    "followUpReason": "Escalated to senior team"
  }'
```

#### Update to Resolved Status (with call log)

```bash
curl -X PUT http://localhost:3000/alerts/123e4567-e89b-12d3-a456-426614174000/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Resolved",
    "followUpReason": "Issue resolved successfully",
    "callLog": {
      "calledBy": "Sarah Johnson",
      "callId": "CALL_002",
      "callStatus": "Re-Engaged",
      "summary": "Customer agreed to upgrade plan"
    }
  }'
```

**Response:**

```json
{
  "alert": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "severity": "High",
    "merchantId": "456e7890-e89b-12d3-a456-426614174001",
    "status": "Resolved",
    "summary": {...},
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T14:20:00.000Z"
  },
  "callLog": {
    "id": "789e0123-e89b-12d3-a456-426614174002",
    "callId": "CALL_002",
    "calledBy": "Sarah Johnson",
    "callStatus": "Re-Engaged",
    "summary": "Customer agreed to upgrade plan",
    "createdAt": "2024-01-15T14:20:00.000Z"
  }
}
```

### POST `/alerts/search`

Search and filter alerts with pagination and severity statistics.

**Request Body:**

```json
{
  "severity": "High",
  "fromDate": "2024-01-01T00:00:00Z",
  "toDate": "2024-12-31T23:59:59Z",
  "status": "Open",
  "merchantId": "123e4567-e89b-12d3-a456-426614174000",
  "page": 1,
  "limit": 10
}
```

**Curl Examples:**

#### Basic Search

```bash
curl -X POST http://localhost:3000/alerts/search \
  -H "Content-Type: application/json" \
  -d '{
    "page": 1,
    "limit": 5
  }'
```

#### Filtered Search with Stats

```bash
curl -X POST http://localhost:3000/alerts/search \
  -H "Content-Type: application/json" \
  -d '{
    "severity": "High",
    "fromDate": "2024-01-01T00:00:00Z",
    "toDate": "2024-01-31T23:59:59Z",
    "status": "Open",
    "page": 1,
    "limit": 20
  }'
```

#### Date Range Search

```bash
curl -X POST http://localhost:3000/alerts/search \
  -H "Content-Type: application/json" \
  -d '{
    "fromDate": "2024-01-15T00:00:00Z",
    "toDate": "2024-01-15T23:59:59Z",
    "status": "Resolved"
  }'
```

**Response:**

```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "severity": "High",
      "merchantId": "456e7890-e89b-12d3-a456-426614174001",
      "status": "Open",
      "summary": {
        "issue": "Payment failure",
        "amount": 5000
      },
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  },
  "stats": {
    "Low": 5,
    "Medium": 8,
    "High": 10,
    "Critical": 2
  }
}
```

### GET `/alerts/:id`

Get a specific alert by ID with associated call logs.

**Curl Example:**

```bash
curl -X GET http://localhost:3000/alerts/123e4567-e89b-12d3-a456-426614174000
```

**Response:**

```json
{
  "alert": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "severity": "High",
    "merchantId": "456e7890-e89b-12d3-a456-426614174001",
    "status": "Resolved",
    "summary": {
      "issue": "Payment failure",
      "amount": 5000
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T14:20:00.000Z"
  },
  "callLogs": [
    {
      "id": "789e0123-e89b-12d3-a456-426614174002",
      "callId": "CALL_001",
      "calledBy": "John Doe",
      "callStatus": "Re-Engaged",
      "summary": "Customer was satisfied with the resolution",
      "createdAt": "2024-01-15T14:20:00.000Z"
    }
  ]
}
```

### DELETE `/alerts/:id`

Delete an alert entry.

**Curl Example:**

```bash
curl -X DELETE http://localhost:3000/alerts/123e4567-e89b-12d3-a456-426614174000
```

**Response:**

```json
{
  "message": "Alert with ID 123e4567-e89b-12d3-a456-426614174000 deleted successfully"
}
```

## Business Logic

### Alert Creation Logic

- **Default Status**: All new alerts are created with status "Open"
- **Required Fields**: severity and merchantId are mandatory
- **Enum Validation**: Severity must be valid enum value
- **Summary Storage**: Optional JSON object for flexible data storage

### Status Update Logic

- **Status Validation**: Only "Open" and "Resolved" are valid
- **Call Log Requirement**: When status is "Resolved", call log data is mandatory
- **Automatic Call Log Creation**: Creates call log record when alert is resolved
- **Validation**: Call log data must include calledBy and callStatus

### Search and Filtering Logic

- **Date Range**: Automatically swaps from/to dates if fromDate > toDate
- **Partial Filters**: All filters are optional, allowing flexible queries
- **Case Sensitivity**: String filters are case-sensitive
- **Enum Validation**: Severity and status must match defined enum values
- **Statistics**: Calculates severity distribution for filtered results

### Pagination Logic

- **Default Values**: page=1, limit=10 if not provided
- **Validation**: Minimum values enforced (page≥1, limit≥1)
- **Metadata**: Includes total count, total pages, hasNext, hasPrev
- **Performance**: Uses TypeORM's skip/take for efficient pagination

### Statistics Logic

- **Severity Distribution**: Counts alerts by severity level
- **Filtered Stats**: Statistics respect all applied filters
- **Real-time**: Calculated on each search request
- **Complete Coverage**: Includes all severity levels (Low, Medium, High, Critical)

## Error Handling

- **404 Not Found**: When alert doesn't exist
- **400 Bad Request**: Invalid data, missing required fields, invalid enums
- **500 Internal Server Error**: Database or system errors

### Specific Error Cases

- **Missing Call Log**: When status is "Resolved" but no call log data provided
- **Invalid Call Status**: When call status doesn't match enum values
- **Date Range Issues**: When fromDate > toDate (automatically fixed)
- **Missing Required Fields**: When severity or merchantId not provided

## Data Validation

- **UUID Validation**: All ID parameters validated as UUIDs
- **Required Fields**: severity and merchantId required for creation
- **Enum Validation**: severity, status, and call status must be valid enum values
- **Date Validation**: Date strings must be valid ISO format
- **JSON Validation**: Summary field must be valid JSON object

## Database Schema

The module works with the `AlertEntity` which includes:

- **Primary Key**: UUID id
- **Required Fields**: severity, merchantId, status
- **Optional Fields**: summary (JSON), followUpReason, followUpDate
- **Timestamps**: createdAt, updatedAt (auto-generated)
- **Indexes**: merchantId is indexed for efficient queries

## Performance Considerations

- **Indexed Queries**: Uses database indexes for efficient filtering
- **Pagination**: Prevents large result sets
- **Query Optimization**: Uses TypeORM query builder for complex queries
- **Statistics**: Efficient aggregation queries for severity stats
- **Relationship Loading**: Call logs loaded only when needed

## Security Features

- **Input Validation**: All inputs validated and sanitized
- **UUID Validation**: Prevents SQL injection through ID parameters
- **Error Handling**: No sensitive information leaked in errors
- **Access Control**: Ready for authentication/authorization integration
- **JSON Validation**: Prevents malicious JSON payloads

## Integration Points

- **Call Logs Module**: Creates call logs when alerts are resolved
- **Communication Module**: Can trigger Slack alerts based on alert severity
- **Database**: Uses TypeORM for data persistence
- **Validation**: Uses class-validator for request validation

## Call Log Integration

### Automatic Creation

When an alert status is updated to "Resolved":

1. Validates call log data is provided
2. Creates call log record with alert relationship
3. Returns both updated alert and created call log
4. Maintains data consistency between modules

### Data Flow

```
Alert Update → Status Check → Call Log Creation → Response
     ↓              ↓              ↓              ↓
  Validation    RESOLVED?    Repository    Alert + Call Log
```

## Statistics Feature

### Severity Distribution

The search endpoint includes severity statistics:

- **Low**: Count of low priority alerts
- **Medium**: Count of medium priority alerts
- **High**: Count of high priority alerts
- **Critical**: Count of critical alerts

### Use Cases

- **Dashboard Analytics**: Real-time severity distribution
- **Trend Analysis**: Track alert patterns over time
- **Resource Planning**: Understand alert volume by severity
- **Performance Monitoring**: Monitor alert resolution rates

## Best Practices

### Alert Creation

- Use appropriate severity levels based on business impact
- Include relevant details in summary field
- Provide clear follow-up reasons for tracking

### Status Updates

- Always include call log data when resolving alerts
- Use descriptive call summaries for audit trails
- Validate call status matches business outcomes

### Search and Filtering

- Use date ranges for time-based analysis
- Combine filters for precise results
- Monitor statistics for trend analysis
