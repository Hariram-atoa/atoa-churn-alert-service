// Payment module raw SQL queries
export const PAYMENT_QUERIES = {
  GET_MERCHANT_PLAN_NAME: `
    SELECT 
      pp."displayName" as "planName"
    FROM merchant_plan_entity mp
    LEFT JOIN plan_entity pp ON mp."planId" = pp.id
    WHERE mp."merchantId" = $1
  `,

  GET_LAST_SIX_MONTH_TRANSACTION: `
    WITH month_series AS (
      SELECT generate_series(
        DATE_TRUNC('month', NOW() - INTERVAL '5 months'),
        DATE_TRUNC('month', NOW()),
        INTERVAL '1 month'
      ) as month
    ),
    transaction_data AS (
      SELECT 
        DATE_TRUNC('month', te."createdAt") as month,
        COUNT(*) as transaction_count,
        COALESCE(SUM(te."paidAmount"), 0) as total_amount
      FROM payment_transaction_entity te
      WHERE te."merchantId" = $1
        AND te."createdAt" >= NOW() - INTERVAL '6 months'
        AND te.status = 'COMPLETED'
      GROUP BY DATE_TRUNC('month', te."createdAt")
    )
    SELECT 
      ms.month,
      COALESCE(td.transaction_count, 0) as transaction_count,
      COALESCE(td.total_amount, 0) as total_amount
    FROM month_series ms
    LEFT JOIN transaction_data td ON ms.month = td.month
    ORDER BY ms.month DESC
  `,
};
