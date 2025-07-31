// Core module raw SQL queries
export const CORE_QUERIES = {
  GET_MERCHANT_BY_ID: `
    SELECT 
      me.id,
      ue."firstName",
      ue."lastName",
      ue.email,
      CONCAT(ue."phoneCountryCode", ue."phoneNumber") as "phone",
      me."createdAt" as "signupDate",
      me.approved as "isActive",
      mbi."legalBusinessName" as "businessName",
      mbt.id as "businessTypeId",
      mbt.name as "businessType",
      me."createdAt",
      me."updatedAt"
    FROM merchant_entity me
    LEFT JOIN business_to_user_entity btue ON me.id = btue."businessId" AND btue."userType" = 'OWNER'
    LEFT JOIN user_entity ue ON btue."userId" = ue.id
    LEFT JOIN merchant_business_info_entity mbi ON me.id = mbi."merchantId"
    LEFT JOIN merchant_business_type_entity mbt ON mbi."businessTypeId" = mbt.id
    WHERE me.id = $1
  `,

  GET_BULK_MERCHANT_BY_IDS: `
    SELECT 
      me.id,
      ue."firstName",
      ue."lastName",
      ue.email,
      CONCAT(ue."phoneCountryCode", ue."phoneNumber") as "phone",
      me."createdAt" as "signupDate",
      me.approved as "isActive",
      mbi."legalBusinessName" as "businessName",
      mbt.id as "businessTypeId",
      mbt.name as "businessType",
      me."createdAt",
      me."updatedAt"
    FROM merchant_entity me
    LEFT JOIN business_to_user_entity btue ON me.id = btue."businessId" AND btue."userType" = 'OWNER'
    LEFT JOIN user_entity ue ON btue."userId" = ue.id
    LEFT JOIN merchant_business_info_entity mbi ON me.id = mbi."merchantId"
    LEFT JOIN merchant_business_type_entity mbt ON mbi."businessTypeId" = mbt.id
    WHERE me.id = ANY($1)
  `,

  GET_DASHBOARD_USERS_BY_TELE_CALLER_ROLE: `
    SELECT * FROM dashboard_user_entity du
    LEFT JOIN role_entity re ON du."roleId" = re.id
    WHERE re."name" = $1
  `,
};
