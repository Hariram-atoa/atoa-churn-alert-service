const axios = require('axios');

const BASE_URL = 'http://localhost:8089';

// Helper function to make requests
async function makeRequest(method, url, data = null) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${url}`,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status || 500,
    };
  }
}

// Test data for creating multiple alerts and call logs
const testAlerts = [
  {
    severity: 'Critical',
    merchantId: '123e4567-e89b-12d3-a456-426614174000',
    summary: {
      issue: 'System outage',
      affectedServices: ['payment', 'auth'],
      duration: '2 hours',
    },
    followUpReason: 'Emergency response required',
  },
  {
    severity: 'High',
    merchantId: '456e7890-e89b-12d3-a456-426614174001',
    summary: {
      issue: 'Payment failure',
      amount: 5000,
      customerId: 'CUST_001',
    },
    followUpReason: 'Customer needs immediate attention',
  },
  {
    severity: 'Medium',
    merchantId: '789e0123-e89b-12d3-a456-426614174002',
    summary: {
      issue: 'Login attempts',
      count: 15,
      ipAddress: '192.168.1.100',
    },
    followUpReason: 'Monitor for suspicious activity',
  },
  {
    severity: 'Low',
    merchantId: '012e3456-e89b-12d3-a456-426614174003',
    summary: {
      issue: 'Scheduled maintenance',
      duration: '30 minutes',
      affectedServices: ['reporting'],
    },
    followUpReason: 'Inform users about maintenance',
  },
];

const testCallLogs = [
  {
    calledBy: 'John Doe',
    callId: 'CALL_001',
    callStatus: 'Re-Engaged',
    summary: 'Customer was satisfied with the resolution',
  },
  {
    calledBy: 'Sarah Johnson',
    callId: 'CALL_002',
    callStatus: 'Not Interested',
    summary: 'Customer declined the offer',
  },
  {
    calledBy: 'Mike Wilson',
    callId: 'CALL_003',
    callStatus: 'Callback Scheduled',
    summary: 'Customer requested callback next week',
  },
  {
    calledBy: 'Lisa Brown',
    callId: 'CALL_004',
    callStatus: 'Re-Engaged',
    summary: 'Customer agreed to upgrade plan',
  },
];

async function createTestData() {
  console.log('\n📝 CREATING TEST DATA 📝');
  console.log('========================');

  const createdAlerts = [];
  const createdCallLogs = [];

  // Create multiple alerts
  for (let i = 0; i < testAlerts.length; i++) {
    console.log(`Creating alert ${i + 1}/${testAlerts.length}...`);
    const result = await makeRequest('POST', '/alerts', testAlerts[i]);
    if (result.success) {
      createdAlerts.push(result.data);
      console.log(`✅ Alert ${i + 1} created with ID: ${result.data.id}`);
    } else {
      console.log(`❌ Failed to create alert ${i + 1}:`, result.error);
    }
  }

  // Create call logs for some alerts
  for (
    let i = 0;
    i < Math.min(createdAlerts.length, testCallLogs.length);
    i++
  ) {
    console.log(`Creating call log ${i + 1}/${testCallLogs.length}...`);
    const callLogData = {
      ...testCallLogs[i],
      alert: createdAlerts[i].id,
    };
    const result = await makeRequest('POST', '/call-logs', callLogData);
    if (result.success) {
      createdCallLogs.push(result.data);
      console.log(`✅ Call log ${i + 1} created with ID: ${result.data.id}`);
    } else {
      console.log(`❌ Failed to create call log ${i + 1}:`, result.error);
    }
  }

  return { createdAlerts, createdCallLogs };
}

async function testAlertsSearchComprehensive() {
  console.log('\n🚨 COMPREHENSIVE ALERTS SEARCH TESTS 🚨');
  console.log('==========================================');

  // Test 1: Basic search without filters
  console.log('\n1. Testing basic search without filters');
  const basicSearch = await makeRequest('POST', '/alerts/search', {
    page: 1,
    limit: 5,
  });
  if (basicSearch.success) {
    console.log('✅ Basic search - SUCCESS');
    console.log(`Total alerts: ${basicSearch.data.pagination.total}`);
    console.log(`Severity stats:`, basicSearch.data.stats);
  } else {
    console.log('❌ Basic search - FAILED:', basicSearch.error);
  }

  // Test 2: Search by severity
  console.log('\n2. Testing search by severity (Critical)');
  const severitySearch = await makeRequest('POST', '/alerts/search', {
    severity: 'Critical',
    page: 1,
    limit: 10,
  });
  if (severitySearch.success) {
    console.log('✅ Severity search - SUCCESS');
    console.log(
      `Critical alerts found: ${severitySearch.data.pagination.total}`,
    );
  } else {
    console.log('❌ Severity search - FAILED:', severitySearch.error);
  }

  // Test 3: Search by status
  console.log('\n3. Testing search by status (Open)');
  const statusSearch = await makeRequest('POST', '/alerts/search', {
    status: 'Open',
    page: 1,
    limit: 10,
  });
  if (statusSearch.success) {
    console.log('✅ Status search - SUCCESS');
    console.log(`Open alerts found: ${statusSearch.data.pagination.total}`);
  } else {
    console.log('❌ Status search - FAILED:', statusSearch.error);
  }

  // Test 4: Search by merchant ID
  console.log('\n4. Testing search by merchant ID');
  const merchantSearch = await makeRequest('POST', '/alerts/search', {
    merchantId: '123e4567-e89b-12d3-a456-426614174000',
    page: 1,
    limit: 10,
  });
  if (merchantSearch.success) {
    console.log('✅ Merchant search - SUCCESS');
    console.log(`Alerts for merchant: ${merchantSearch.data.pagination.total}`);
  } else {
    console.log('❌ Merchant search - FAILED:', merchantSearch.error);
  }

  // Test 5: Search with date range
  console.log('\n5. Testing search with date range');
  const dateSearch = await makeRequest('POST', '/alerts/search', {
    fromDate: '2024-01-01T00:00:00Z',
    toDate: '2025-12-31T23:59:59Z',
    page: 1,
    limit: 10,
  });
  if (dateSearch.success) {
    console.log('✅ Date range search - SUCCESS');
    console.log(`Alerts in date range: ${dateSearch.data.pagination.total}`);
  } else {
    console.log('❌ Date range search - FAILED:', dateSearch.error);
  }

  // Test 6: Combined filters
  console.log('\n6. Testing combined filters');
  const combinedSearch = await makeRequest('POST', '/alerts/search', {
    severity: 'High',
    status: 'Open',
    fromDate: '2024-01-01T00:00:00Z',
    toDate: '2025-12-31T23:59:59Z',
    page: 1,
    limit: 5,
  });
  if (combinedSearch.success) {
    console.log('✅ Combined filters search - SUCCESS');
    console.log(`Results: ${combinedSearch.data.pagination.total}`);
  } else {
    console.log('❌ Combined filters search - FAILED:', combinedSearch.error);
  }

  // Test 7: Pagination test
  console.log('\n7. Testing pagination');
  const paginationSearch = await makeRequest('POST', '/alerts/search', {
    page: 1,
    limit: 2,
  });
  if (paginationSearch.success) {
    console.log('✅ Pagination test - SUCCESS');
    console.log(`Page: ${paginationSearch.data.pagination.page}`);
    console.log(`Limit: ${paginationSearch.data.pagination.limit}`);
    console.log(`Total: ${paginationSearch.data.pagination.total}`);
    console.log(`Total Pages: ${paginationSearch.data.pagination.totalPages}`);
    console.log(`Has Next: ${paginationSearch.data.pagination.hasNext}`);
    console.log(`Has Prev: ${paginationSearch.data.pagination.hasPrev}`);
  } else {
    console.log('❌ Pagination test - FAILED:', paginationSearch.error);
  }

  // Test 8: All severity levels
  console.log('\n8. Testing all severity levels');
  const severities = ['Low', 'Medium', 'High', 'Critical'];
  for (const severity of severities) {
    const severityTest = await makeRequest('POST', '/alerts/search', {
      severity: severity,
      page: 1,
      limit: 10,
    });
    if (severityTest.success) {
      console.log(
        `✅ ${severity} severity search - SUCCESS (${severityTest.data.pagination.total} found)`,
      );
    } else {
      console.log(
        `❌ ${severity} severity search - FAILED:`,
        severityTest.error,
      );
    }
  }
}

async function testCallLogsSearchComprehensive() {
  console.log('\n📞 COMPREHENSIVE CALL-LOGS SEARCH TESTS 📞');
  console.log('=============================================');

  // Test 1: Basic search without filters
  console.log('\n1. Testing basic call logs search without filters');
  const basicSearch = await makeRequest('POST', '/call-logs/search', {
    page: 1,
    limit: 5,
  });
  if (basicSearch.success) {
    console.log('✅ Basic call logs search - SUCCESS');
    console.log(`Total call logs: ${basicSearch.data.pagination.total}`);
  } else {
    console.log('❌ Basic call logs search - FAILED:', basicSearch.error);
  }

  // Test 2: Search by calledBy
  console.log('\n2. Testing search by calledBy');
  const calledBySearch = await makeRequest('POST', '/call-logs/search', {
    calledBy: 'John Doe',
    page: 1,
    limit: 10,
  });
  if (calledBySearch.success) {
    console.log('✅ CalledBy search - SUCCESS');
    console.log(
      `Call logs by John Doe: ${calledBySearch.data.pagination.total}`,
    );
  } else {
    console.log('❌ CalledBy search - FAILED:', calledBySearch.error);
  }

  // Test 3: Search by call status
  console.log('\n3. Testing search by call status');
  const callStatuses = [
    'Re-Engaged',
    'Not Interested',
    'Bounced',
    'Callback Scheduled',
  ];
  for (const status of callStatuses) {
    const statusTest = await makeRequest('POST', '/call-logs/search', {
      callStatus: status,
      page: 1,
      limit: 10,
    });
    if (statusTest.success) {
      console.log(
        `✅ ${status} status search - SUCCESS (${statusTest.data.pagination.total} found)`,
      );
    } else {
      console.log(`❌ ${status} status search - FAILED:`, statusTest.error);
    }
  }

  // Test 4: Search with date range
  console.log('\n4. Testing call logs search with date range');
  const dateSearch = await makeRequest('POST', '/call-logs/search', {
    fromDate: '2024-01-01T00:00:00Z',
    toDate: '2025-12-31T23:59:59Z',
    page: 1,
    limit: 10,
  });
  if (dateSearch.success) {
    console.log('✅ Call logs date range search - SUCCESS');
    console.log(`Call logs in date range: ${dateSearch.data.pagination.total}`);
  } else {
    console.log('❌ Call logs date range search - FAILED:', dateSearch.error);
  }

  // Test 5: Combined filters for call logs
  console.log('\n5. Testing combined filters for call logs');
  const combinedSearch = await makeRequest('POST', '/call-logs/search', {
    calledBy: 'John Doe',
    callStatus: 'Re-Engaged',
    fromDate: '2024-01-01T00:00:00Z',
    toDate: '2025-12-31T23:59:59Z',
    page: 1,
    limit: 5,
  });
  if (combinedSearch.success) {
    console.log('✅ Combined call logs filters - SUCCESS');
    console.log(`Results: ${combinedSearch.data.pagination.total}`);
  } else {
    console.log(
      '❌ Combined call logs filters - FAILED:',
      combinedSearch.error,
    );
  }

  // Test 6: Pagination for call logs
  console.log('\n6. Testing pagination for call logs');
  const paginationSearch = await makeRequest('POST', '/call-logs/search', {
    page: 1,
    limit: 2,
  });
  if (paginationSearch.success) {
    console.log('✅ Call logs pagination - SUCCESS');
    console.log(`Page: ${paginationSearch.data.pagination.page}`);
    console.log(`Limit: ${paginationSearch.data.pagination.limit}`);
    console.log(`Total: ${paginationSearch.data.pagination.total}`);
    console.log(`Total Pages: ${paginationSearch.data.pagination.totalPages}`);
    console.log(`Has Next: ${paginationSearch.data.pagination.hasNext}`);
    console.log(`Has Prev: ${paginationSearch.data.pagination.hasPrev}`);
  } else {
    console.log('❌ Call logs pagination - FAILED:', paginationSearch.error);
  }
}

async function testEdgeCases() {
  console.log('\n🔍 TESTING EDGE CASES 🔍');
  console.log('==========================');

  // Test 1: Invalid UUID
  console.log('\n1. Testing invalid UUID');
  const invalidUuidTest = await makeRequest('GET', '/alerts/invalid-uuid-123');
  if (!invalidUuidTest.success) {
    console.log('✅ Invalid UUID properly rejected');
  } else {
    console.log('❌ Invalid UUID should have been rejected');
  }

  // Test 2: Invalid enum values
  console.log('\n2. Testing invalid enum values');
  const invalidSeverityTest = await makeRequest('POST', '/alerts', {
    severity: 'InvalidSeverity',
    merchantId: '123e4567-e89b-12d3-a456-426614174000',
  });
  if (!invalidSeverityTest.success) {
    console.log('✅ Invalid severity properly rejected');
  } else {
    console.log('❌ Invalid severity should have been rejected');
  }

  // Test 3: Missing required fields
  console.log('\n3. Testing missing required fields');
  const missingFieldsTest = await makeRequest('POST', '/alerts', {
    severity: 'High',
    // Missing merchantId
  });
  if (!missingFieldsTest.success) {
    console.log('✅ Missing required fields properly rejected');
  } else {
    console.log('❌ Missing required fields should have been rejected');
  }

  // Test 4: Date range with fromDate > toDate
  console.log('\n4. Testing date range with fromDate > toDate');
  const invalidDateRangeTest = await makeRequest('POST', '/alerts/search', {
    fromDate: '2025-12-31T23:59:59Z',
    toDate: '2024-01-01T00:00:00Z',
    page: 1,
    limit: 10,
  });
  if (invalidDateRangeTest.success) {
    console.log('✅ Invalid date range handled properly (auto-swapped)');
  } else {
    console.log('❌ Invalid date range should have been handled');
  }

  // Test 5: Non-existent alert ID
  console.log('\n5. Testing non-existent alert ID');
  const nonExistentAlertTest = await makeRequest(
    'GET',
    '/alerts/123e4567-e89b-12d3-a456-426614174999',
  );
  if (!nonExistentAlertTest.success) {
    console.log('✅ Non-existent alert properly handled');
  } else {
    console.log('❌ Non-existent alert should have been rejected');
  }
}

async function testCommunicationEdgeCases() {
  console.log('\n💬 TESTING COMMUNICATION EDGE CASES 💬');
  console.log('========================================');

  // Test 1: Invalid alert level
  console.log('\n1. Testing invalid alert level');
  const invalidAlertLevelTest = await makeRequest(
    'POST',
    '/communication/trigger-slack-alert',
    {
      alertLevel: 'invalid_level',
      businessName: 'Test Corp',
      reason: 'Test',
      summary: 'Test',
    },
  );
  if (!invalidAlertLevelTest.success) {
    console.log('✅ Invalid alert level properly rejected');
  } else {
    console.log('❌ Invalid alert level should have been rejected');
  }

  // Test 2: Missing required fields
  console.log('\n2. Testing missing required fields');
  const missingFieldsTest = await makeRequest(
    'POST',
    '/communication/trigger-slack-alert',
    {
      alertLevel: 'high_level_alert',
      // Missing businessName, reason, summary
    },
  );
  if (!missingFieldsTest.success) {
    console.log('✅ Missing required fields properly rejected');
  } else {
    console.log('❌ Missing required fields should have been rejected');
  }

  // Test 3: All alert levels
  console.log('\n3. Testing all alert levels');
  const alertLevels = [
    'high_level_alert',
    'mid_level_alert',
    'low_level_alert',
  ];
  for (const level of alertLevels) {
    const levelTest = await makeRequest(
      'POST',
      '/communication/trigger-slack-alert',
      {
        alertLevel: level,
        businessName: `Test Corp - ${level}`,
        reason: `Test reason for ${level}`,
        summary: `Test summary for ${level}`,
      },
    );
    if (levelTest.success) {
      console.log(`✅ ${level} - SUCCESS`);
    } else {
      console.log(`❌ ${level} - FAILED:`, levelTest.error);
    }
  }
}

async function cleanupTestData(createdAlerts) {
  console.log('\n🧹 CLEANING UP TEST DATA 🧹');
  console.log('============================');

  for (const alert of createdAlerts) {
    console.log(`Deleting alert: ${alert.id}`);
    await makeRequest('DELETE', `/alerts/${alert.id}`);
  }

  console.log('✅ Test data cleanup completed');
}

// Main test function
async function runComprehensiveTests() {
  console.log('🧪 STARTING COMPREHENSIVE ENDPOINT TESTS 🧪');
  console.log('============================================');
  console.log(`Base URL: ${BASE_URL}`);

  try {
    // Create test data
    const { createdAlerts, createdCallLogs } = await createTestData();

    // Run comprehensive tests
    await testAlertsSearchComprehensive();
    await testCallLogsSearchComprehensive();
    await testEdgeCases();
    await testCommunicationEdgeCases();

    // Cleanup
    await cleanupTestData(createdAlerts);

    console.log('\n🎉 COMPREHENSIVE TESTS COMPLETED! 🎉');
    console.log(
      'All search endpoints, filters, pagination, and edge cases have been tested.',
    );
  } catch (error) {
    console.error('❌ Comprehensive test execution failed:', error.message);
  }
}

// Run the comprehensive tests
runComprehensiveTests();
