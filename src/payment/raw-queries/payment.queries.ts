// Payment module raw SQL queries
export const PAYMENT_QUERIES = {
  GET_MERCHANT_PLAN_NAME: `
    SELECT 
      pp."displayName" as "planName"
    FROM merchant_plan_entity mp
    LEFT JOIN plan_entity pp ON mp."planId" = pp.id
    WHERE mp."merchantId" = $1
  `,
};
