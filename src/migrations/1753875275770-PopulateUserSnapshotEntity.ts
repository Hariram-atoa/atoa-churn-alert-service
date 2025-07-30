import { MigrationInterface, QueryRunner } from 'typeorm';
import { DataSource } from 'typeorm';
import { coreDataSourceConfig } from '../core/config/core-database.config';
import { paymentDataSourceConfig } from '../payment/config/payment-database.config';

export class PopulateUserSnapshotEntity1753875275770
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('Starting user snapshot entity population migration...');

    try {
      // Create separate data sources for core and payment databases
      const coreDataSource = new DataSource(coreDataSourceConfig);
      const paymentDataSource = new DataSource(paymentDataSourceConfig);

      await coreDataSource.initialize();
      await paymentDataSource.initialize();

      try {
        // Step 1: Get all eligible merchants from CORE database
        console.log('Fetching eligible merchants...');
        const eligibleMerchants = await coreDataSource.query(`
          SELECT 
            me.id as merchant_id,
            me."createdAt" as signup_date,
            EXTRACT(DAY FROM me."createdAt") as signup_day
          FROM merchant_entity me
          WHERE me."internalUser" = false 
            AND me."status" = 'APPROVED'
        `);

        console.log(`Found ${eligibleMerchants.length} eligible merchants`);

        let processedMerchants = 0;
        for (const merchant of eligibleMerchants) {
          const merchantId = merchant.merchant_id;
          const signupDay = parseInt(merchant.signup_day);

          // Step 2: Calculate specific months (May, June, July) for this merchant
          const last3Months = [];

          // May 2025: 28-04-2025 to 27-05-2025
          const mayStart = new Date(2025, 3, signupDay); // April 28th (month is 0-indexed)
          const mayEnd = new Date(2025, 4, signupDay - 1); // May 27th

          // June 2025: 28-05-2025 to 27-06-2025
          const juneStart = new Date(2025, 4, signupDay); // May 28th
          const juneEnd = new Date(2025, 5, signupDay - 1); // June 27th

          // July 2025: 28-06-2025 to 27-07-2025
          const julyStart = new Date(2025, 5, signupDay); // June 28th
          const julyEnd = new Date(2025, 6, signupDay - 1); // July 27th

          last3Months.push(
            { monthStart: mayStart, monthEnd: mayEnd, monthKey: 'May 2025' },
            { monthStart: juneStart, monthEnd: juneEnd, monthKey: 'June 2025' },
            { monthStart: julyStart, monthEnd: julyEnd, monthKey: 'July 2025' },
          );

          // Step 3: Get transactions for each month from PAYMENT database
          for (const month of last3Months) {
            // Get all transactions for this merchant in this month
            const transactions = await paymentDataSource.query(
              `
              SELECT 
                pt."merchantId" as merchant_id,
                DATE(pt."createdAt") as transaction_date,
                COUNT(*) as daily_transaction_count,
                SUM(pt."paidAmount") as daily_transaction_volume
              FROM payment_transaction_entity pt
              WHERE pt."merchantId" = $1
                AND pt."status" = 'COMPLETED'
                AND pt."createdAt" >= $2
                AND pt."createdAt" <= $3
              GROUP BY 
                pt."merchantId",
                DATE(pt."createdAt")
            `,
              [merchantId, month.monthStart, month.monthEnd],
            );

            console.log(
              `Found ${transactions.length} transaction days for merchant ${merchantId} in ${month.monthKey}`,
            );

            // Step 4: Create metadata and totals for this merchant and month
            const metadata = {};
            let totalTransactionCount = 0;
            let totalTransactionVolume = 0;

            for (const transaction of transactions) {
              const dateKey = transaction.transaction_date;

              // Add to metadata
              metadata[dateKey] = {
                transactionCount: parseInt(transaction.daily_transaction_count),
                transactionVolume: parseFloat(
                  transaction.daily_transaction_volume,
                ),
              };

              // Add to totals
              totalTransactionCount += parseInt(
                transaction.daily_transaction_count,
              );
              totalTransactionVolume += parseFloat(
                transaction.daily_transaction_volume,
              );
            }

            // Step 5: Insert snapshot entry for this merchant and month
            await queryRunner.query(
              `
              INSERT INTO user_snapshot_entity (
                "businessId",
                "userId",
                "storeId",
                "monthStart",
                "monthEnd",
                "metaData",
                "transactionCount",
                "transactionVolume",
                "createdAt",
                "updatedAt"
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
            `,
              [
                merchantId,
                null, // userId is null
                null, // storeId is null
                month.monthStart,
                month.monthEnd,
                JSON.stringify(metadata),
                totalTransactionCount,
                totalTransactionVolume,
              ],
            );
          }

          processedMerchants++;
          if (processedMerchants % 100 === 0) {
            console.log(
              `Processed ${processedMerchants}/${eligibleMerchants.length} merchants`,
            );
          }
        }

        console.log('Migration completed successfully!');
      } finally {
        // Clean up data sources
        await coreDataSource.destroy();
        await paymentDataSource.destroy();
      }
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('Rolling back user snapshot entity migration...');

    try {
      // Clear all data from user_snapshot_entity table
      await queryRunner.query(`DELETE FROM user_snapshot_entity`);
      console.log('Rollback completed successfully!');
    } catch (error) {
      console.error('Rollback failed:', error);
      throw error;
    }
  }
}
