# Call Logs Module

The Call Logs Module manages call log entries for the churn alert service. It provides comprehensive CRUD operations with advanced filtering, pagination, and relationship management with alerts.

## Overview

This module handles all call log-related operations including creating, reading, updating, and deleting call logs. It supports advanced filtering by various criteria and maintains relationships with alert entities.

## Architecture

```
Controller → Service → Repository → Database
    ↓
  DTO Validation
    ↓
  Business Logic
    ↓
  TypeORM Queries
```

## Components

### 1. **GetCallLogsDto**

Defines the structure for filtered call log requests:

- `calledBy`: Filter by who made the call (optional)
- `fromDate`: Start date for date range filtering (optional)
- `toDate`: End date for date range filtering (optional)
- `callStatus`: Filter by call status enum (optional)
- `page`: Page number for pagination (default: 1)
- `limit`: Number of records per page (default: 10)

### 2. **CallLogsRepository**

Handles all database operations:

- **Query Building**: Dynamic query construction with TypeORM
- **Filtering**: Date ranges, call status, called by
- **Pagination**: Skip/take with proper counting
- **Relations**: Includes alert data in responses
- **CRUD Operations**: Create, read, update, delete

### 3. **CallLogsService**

Business logic layer with:

- **Validation**: Date range validation, required field checks
- **Error Handling**: Proper HTTP exceptions
- **Pagination Logic**: Metadata calculation
- **Data Processing**: Business rule enforcement

### 4. **CallLogsController**

REST API endpoints with:

- **UUID Validation**: Using ParseUUIDPipe
- **Proper HTTP Methods**: GET, POST, PUT, DELETE
- **Path Parameters**: For specific resource access
- **Body Validation**: Using DTOs

## Call Status Enum

The module uses `CallStatusEnum` with the following values:

- `RE_ENGAGED` - Customer was re-engaged
- `NOT_INTERESTED` - Customer showed no interest
- `NO_ANSWER` - Call was bounced/no answer
- `CALLBACK` - Callback was scheduled

## API Endpoints

### POST `/call-logs/search`

Search and filter call logs with pagination.

**Request Body:**

```json
{
  "calledBy": "John Doe",
  "fromDate": "2024-01-01T00:00:00Z",
  "toDate": "2024-12-31T23:59:59Z",
  "callStatus": "Re-Engaged",
  "page": 1,
  "limit": 10
}
```

**Curl Examples:**

#### Basic Search

```bash
curl -X POST http://localhost:3000/call-logs/search \
  -H "Content-Type: application/json" \
  -d '{
    "page": 1,
    "limit": 5
  }'
```

#### Filtered Search

```bash
curl -X POST http://localhost:3000/call-logs/search \
  -H "Content-Type: application/json" \
  -d '{
    "calledBy": "Sarah Johnson",
    "fromDate": "2024-01-01T00:00:00Z",
    "toDate": "2024-01-31T23:59:59Z",
    "callStatus": "Re-Engaged",
    "page": 1,
    "limit": 20
  }'
```

#### Date Range Search

```bash
curl -X POST http://localhost:3000/call-logs/search \
  -H "Content-Type: application/json" \
  -d '{
    "fromDate": "2024-01-15T00:00:00Z",
    "toDate": "2024-01-15T23:59:59Z",
    "callStatus": "Not Interested"
  }'
```

**Response:**

```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "callId": "CALL_001",
      "calledBy": "John Doe",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "callStatus": "Re-Engaged",
      "summary": "Customer was interested in our new product",
      "alert": {
        "id": "456e7890-e89b-12d3-a456-426614174001",
        "title": "High Churn Risk Alert"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### GET `/call-logs/alert/:alertId`

Get all call logs for a specific alert.

**Curl Example:**

```bash
curl -X GET http://localhost:3000/call-logs/alert/123e4567-e89b-12d3-a456-426614174000
```

**Response:**

```json
[
  {
    "id": "789e0123-e89b-12d3-a456-426614174002",
    "callId": "CALL_002",
    "calledBy": "Sarah Johnson",
    "createdAt": "2024-01-15T14:20:00.000Z",
    "callStatus": "Re-Engaged",
    "summary": "Customer agreed to upgrade plan",
    "alert": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "High Churn Risk Alert"
    }
  }
]
```

### GET `/call-logs/:id`

Get a specific call log by ID.

**Curl Example:**

```bash
curl -X GET http://localhost:3000/call-logs/123e4567-e89b-12d3-a456-426614174000
```

**Response:**

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "callId": "CALL_001",
  "calledBy": "John Doe",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "callStatus": "Re-Engaged",
  "summary": "Customer was interested in our new product",
  "alert": {
    "id": "456e7890-e89b-12d3-a456-426614174001",
    "title": "High Churn Risk Alert"
  }
}
```

### POST `/call-logs`

Create a new call log entry.

**Request Body:**

```json
{
  "alert": "123e4567-e89b-12d3-a456-426614174000",
  "callId": "CALL_003",
  "calledBy": "Mike Wilson",
  "callStatus": "Re-Engaged",
  "summary": "Customer was satisfied with the resolution"
}
```

**Curl Example:**

```bash
curl -X POST http://localhost:3000/call-logs \
  -H "Content-Type: application/json" \
  -d '{
    "alert": "123e4567-e89b-12d3-a456-426614174000",
    "callId": "CALL_003",
    "calledBy": "Mike Wilson",
    "callStatus": "Re-Engaged",
    "summary": "Customer was satisfied with the resolution"
  }'
```

### PUT `/call-logs/:id`

Update an existing call log.

**Request Body:**

```json
{
  "callStatus": "Not Interested",
  "summary": "Customer declined the offer after discussion"
}
```

**Curl Example:**

```bash
curl -X PUT http://localhost:3000/call-logs/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -d '{
    "callStatus": "Not Interested",
    "summary": "Customer declined the offer after discussion"
  }'
```

### DELETE `/call-logs/:id`

Delete a call log entry.

**Curl Example:**

```bash
curl -X DELETE http://localhost:3000/call-logs/123e4567-e89b-12d3-a456-426614174000
```

**Response:**

```json
{
  "message": "Call log with ID 123e4567-e89b-12d3-a456-426614174000 deleted successfully"
}
```

## Business Logic

### Filtering Logic

- **Date Range**: Automatically swaps from/to dates if fromDate > toDate
- **Partial Filters**: All filters are optional, allowing flexible queries
- **Case Sensitivity**: String filters are case-sensitive
- **Enum Validation**: Call status must match defined enum values

### Pagination Logic

- **Default Values**: page=1, limit=10 if not provided
- **Validation**: Minimum values enforced (page≥1, limit≥1)
- **Metadata**: Includes total count, total pages, hasNext, hasPrev
- **Performance**: Uses TypeORM's skip/take for efficient pagination

### Error Handling

- **404 Not Found**: When call log or alert doesn't exist
- **400 Bad Request**: Invalid data, date ranges, or enum values
- **500 Internal Server Error**: Database or system errors

### Data Validation

- **UUID Validation**: All ID parameters validated as UUIDs
- **Required Fields**: calledBy and callStatus required for creation
- **Enum Validation**: callStatus must be valid enum value
- **Date Validation**: Date strings must be valid ISO format

## Database Schema

The module works with the `CallLogEntity` which includes:

- **Primary Key**: UUID id
- **Relationships**: Many-to-one with AlertEntity
- **Required Fields**: calledBy, callStatus
- **Optional Fields**: callId, summary
- **Timestamps**: createdAt (auto-generated)

## Performance Considerations

- **Indexed Queries**: Uses database indexes for efficient filtering
- **Lazy Loading**: Alert relationships loaded only when needed
- **Pagination**: Prevents large result sets
- **Query Optimization**: Uses TypeORM query builder for complex queries

## Security Features

- **Input Validation**: All inputs validated and sanitized
- **UUID Validation**: Prevents SQL injection through ID parameters
- **Error Handling**: No sensitive information leaked in errors
- **Access Control**: Ready for authentication/authorization integration

## Integration Points

- **Alert Module**: References alert entities
- **Communication Module**: Can trigger alerts based on call outcomes
- **Database**: Uses TypeORM for data persistence
- **Validation**: Uses class-validator for request validation
