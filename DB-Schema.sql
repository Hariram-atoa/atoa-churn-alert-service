CREATE TABLE "rule_entity"(
    "id" BIGINT NOT NULL,
    "name" VARCHAR(255) NULL,
    "description" VARCHAR(255) NULL,
    "type" VARCHAR(255) CHECK
        ("type" IN('')) NULL,
        "timePeriod" VARCHAR(255)
    CHECK
        ("timePeriod" IN('')) NULL,
        "severity" VARCHAR(255)
    CHECK
        ("severity" IN('')) NULL,
        "gtvDropPercentage" DECIMAL(8, 2) NOT NULL,
        "tcDropPercentage" DECIMAL(8, 2) NOT NULL,
        "businessTypeId" UUID NOT NULL,
        "priorityOrder" INTEGER NOT NULL,
        "createdAt" DATE NOT NULL,
        "updatedAt" DATE NOT NULL,
        "mintenureDays" INTEGER NOT NULL,
        "comparisionWindowDays" INTEGER NOT NULL,
        "default" BOOLEAN NOT NULL
);
CREATE INDEX "rule_entity_id_index" ON
    "rule_entity"("id");
CREATE INDEX "rule_entity_priorityorder_index" ON
    "rule_entity"("priorityOrder");
CREATE INDEX "rule_entity_businesstypeid_index" ON
    "rule_entity"("businessTypeId");
ALTER TABLE
    "rule_entity" ADD PRIMARY KEY("id");
CREATE TABLE "user_snapshot_entity"(
    "id" BIGINT NOT NULL,
    "merchantId" UUID NULL,
    "userId" UUID NOT NULL,
    "monthStart" DATE NOT NULL,
    "monthEnd" DATE NOT NULL,
    "metaData" jsonb NOT NULL,
    "storeId" BIGINT NOT NULL,
    "transactionCount" INTEGER NOT NULL,
    "transactionVolume" DECIMAL(8, 2) NOT NULL,
    "createdAt" DATE NOT NULL,
    "updatedAt" DATE NOT NULL
);
CREATE INDEX "user_snapshot_entity_merchantid_index" ON
    "user_snapshot_entity"("merchantId");
CREATE INDEX "user_snapshot_entity_userid_index" ON
    "user_snapshot_entity"("userId");
CREATE INDEX "user_snapshot_entity_storeid_index" ON
    "user_snapshot_entity"("storeId");
ALTER TABLE
    "user_snapshot_entity" ADD PRIMARY KEY("id");
CREATE TABLE "alert_entity"(
    "id" BIGINT NOT NULL,
    "severity" VARCHAR(255) CHECK
        ("severity" IN('')) NOT NULL,
        "ruleId" UUID NOT NULL,
        "merchantId" UUID NOT NULL,
        "summary" jsonb NOT NULL,
        "createdAt" DATE NOT NULL,
        "updatedAt" BIGINT NOT NULL,
        "status" VARCHAR(255)
    CHECK
        ("status" IN('')) NOT NULL
);
CREATE INDEX "alert_entity_merchantid_index" ON
    "alert_entity"("merchantId");
CREATE INDEX "alert_entity_ruleid_index" ON
    "alert_entity"("ruleId");
ALTER TABLE
    "alert_entity" ADD PRIMARY KEY("id");
CREATE TABLE "call_log_entity"(
    "id" BIGINT NOT NULL,
    "merchantId" UUID NOT NULL,
    "alertId" BIGINT NOT NULL,
    "callId" BIGINT NOT NULL,
    "calledBy" VARCHAR(255) NOT NULL,
    "createdAt" BIGINT NOT NULL,
    "callStatus" VARCHAR(255) CHECK
        ("callStatus" IN('')) NOT NULL,
        "summary" VARCHAR(255) NOT NULL,
        "followUpDate" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "call_log_entity" ADD PRIMARY KEY("id");
ALTER TABLE
    "rule_entity" ADD CONSTRAINT "rule_entity_timeperiod_foreign" FOREIGN KEY("timePeriod") REFERENCES "alert_entity"("summary");
ALTER TABLE
    "alert_entity" ADD CONSTRAINT "alert_entity_status_foreign" FOREIGN KEY("status") REFERENCES "call_log_entity"("calledBy");