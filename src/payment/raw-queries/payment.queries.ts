// Payment module raw SQL queries
export const PAYMENT_QUERIES = {
  // Example queries - replace with actual payment business logic queries
  GET_TRANSACTIONS_BY_MERCHANT: `
    SELECT * FROM transactions 
    WHERE merchantId = $1 
    AND transactionDate >= $2 
    AND transactionDate <= $3
    ORDER BY transactionDate DESC
  `,

  GET_GTV_BY_PERIOD: `
    SELECT 
      merchantId,
      SUM(amount) as totalGtv,
      COUNT(*) as transactionCount,
      DATE_TRUNC('week', transactionDate) as weekStart
    FROM transactions 
    WHERE merchantId = $1 
    AND transactionDate >= $2 
    AND transactionDate <= $3
    GROUP BY merchantId, DATE_TRUNC('week', transactionDate)
    ORDER BY weekStart DESC
  `,

  GET_PAYMENT_METHODS: `
    SELECT DISTINCT paymentMethod 
    FROM transactions 
    WHERE merchantId = $1 
    AND transactionDate >= $2
  `,

  // Add more payment business queries here
};
