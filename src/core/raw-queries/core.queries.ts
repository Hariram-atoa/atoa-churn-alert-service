// Core module raw SQL queries
export const CORE_QUERIES = {
  // Example queries - replace with actual business logic queries
  GET_MERCHANT_BY_ID: `
    SELECT * FROM merchant_entity 
    WHERE me."id" = $1
  `,

  GET_MERCHANTS_BY_SIGNUP_DAY: `
    SELECT me."id", mbt."id" FROM merchant_entity me JOIN merchant_business_info_entity mb ON mb."merchantId" = me."id" JOIN merchant_business_type_entity mbt ON mbt."id" = mb."businessTypeId"
    WHERE EXTRACT(DAY FROM me."createdAt") = $1 
    AND me."internalUser" = false
  `,

  GET_MERCHANTS_FOR_FIRST_DAY_OF_MONTH: `
    SELECT me."id", mbt."id" FROM merchant_entity me JOIN merchant_business_info_entity mb ON mb."merchantId" = me."id" JOIN merchant_business_type_entity mbt ON mbt."id" = mb."businessTypeId"
    WHERE EXTRACT(DAY FROM me."createdAt") IN (29, 30, 31, 1)
    AND me."internalUser" = false
  `,

  GET_MERCHANT_SNAPSHOTS: `
    SELECT * FROM merchantSnapshots 
    WHERE merchantId = $1 
    ORDER BY snapshotMonth DESC 
    LIMIT $2
  `,

  // Add more core business queries here
};
