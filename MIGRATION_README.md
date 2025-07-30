# User Snapshot Entity Migration

## Overview
This migration populates the `user_snapshot_entity` table with transaction data for the last 3 months for each eligible merchant.

## Migration Order

### 1. Initial Migration (1753870201672-InitialMigration.ts)
**Purpose**: Creates the database tables
- Creates `user_snapshot_entity` table
- Creates `alert_entity` table  
- Creates `call_log_entity` table
- Sets up indexes and foreign keys

### 2. Data Population Migration (1753874686695-PopulateUserSnapshotEntity.ts)
**Purpose**: Populates the `user_snapshot_entity` table with transaction data

## Migration Details

### File: `src/migrations/1753874686695-PopulateUserSnapshotEntity.ts`

### What it does:
1. **Fetches eligible merchants**: Non-internal users with approved status from CORE database
2. **Calculates month periods**: Based on each merchant's signup day
3. **Processes transactions**: Separates Link payments (with userId) and QR payments (without userId) from PAYMENT database
4. **Creates snapshots**: One entry per merchant-store-user combination per month
5. **Stores metadata**: Day-wise transaction count and volume

### Key Features:
- **Merchant Filtering**: Only processes non-internal, approved merchants
- **Date Logic**: Month start = signup day of month, Month end = day before next month start
- **Transaction Types**: Handles both Link payments (with `acceptedUserId`) and QR payments (without `acceptedUserId`)
- **Data Aggregation**: Groups by merchant, store, and user combinations
- **Metadata Storage**: Stores daily transaction counts and volumes in JSONB format
- **Conflict Handling**: Uses UPSERT to handle duplicate entries
- **Multi-Database**: Uses separate data sources for core and payment databases

### Database Requirements:
- **CORE Database**: `merchant_entity` table with columns: `id`, `createdAt`, `internalUser`, `approved`
- **PAYMENT Database**: `payment_transaction_entity` table with columns: `acceptedByUserId`, `storeId`, `merchantId`, `createdAt`, `status`, `paidAmount`
- **CORE Database**: `user_snapshot_entity` table (created by initial migration)

### Data Source Usage:
- **Core Data Source**: Used for `merchant_entity` queries and `user_snapshot_entity` inserts
- **Payment Data Source**: Used for `payment_transaction_entity` queries
- **Main QueryRunner**: Used for inserting into `user_snapshot_entity` (our service's database)

### Running the Migration:

```bash
# Run all migrations (recommended)
npm run migration:run

# To rollback if needed
npm run migration:revert

# To see migration status
npm run migration:show

# To create a new empty migration
npm run migration:create -- src/migrations/YourMigrationName
```

### Expected Output:
The migration will log progress including:
- Number of eligible merchants found
- Processing progress for each merchant
- Transaction counts for each month
- Number of snapshot entries created

### Data Structure:
Each snapshot entry contains:
- `merchantId`: The merchant identifier
- `userId`: User ID (NULL for QR payments)
- `storeId`: Store identifier
- `monthStart`: Start date of the month period
- `monthEnd`: End date of the month period
- `metaData`: JSONB with daily transaction data
- `transactionCount`: Total transactions for the month
- `transactionVolume`: Total transaction volume for the month

### Example Metadata:
```json
{
  "2025-05-28": {"transactionCount": 50, "transactionVolume": 7000},
  "2025-05-29": {"transactionCount": 30, "transactionVolume": 4500},
  "2025-05-30": {"transactionCount": 25, "transactionVolume": 3800}
}
```

## Notes:
- The migration processes the last 3 months from the current date
- Only completed transactions (`status = 'COMPLETED'`) are included
- Uses `paidAmount` for transaction volume calculations
- Handles both Link and QR payment scenarios
- Includes comprehensive error handling and logging
- Uses separate database connections for core and payment data 