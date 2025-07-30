const axios = require('axios');

const BASE_URL = 'http://localhost:8089';

// Test data
const testData = {
  // Alert test data
  alert: {
    severity: 'High',
    merchantId: '123e4567-e89b-12d3-a456-426614174000',
    summary: {
      issue: 'Payment failure',
      amount: 5000,
      customerId: 'CUST_001',
    },
    followUpReason: 'Customer needs immediate attention',
  },

  // Call log test data
  callLog: {
    alert: '123e4567-e89b-12d3-a456-426614174000',
    callId: 'CALL_001',
    calledBy: 'John Doe',
    callStatus: 'Re-Engaged',
    summary: 'Customer was interested in our new product',
  },

  // Update alert status data
  updateAlertStatus: {
    status: 'Resolved',
    followUpReason: 'Issue resolved successfully',
    callLog: {
      calledBy: 'Sarah Johnson',
      callId: 'CALL_002',
      callStatus: 'Re-Engaged',
      summary: 'Customer agreed to upgrade plan',
    },
  },

  // Search filters
  searchFilters: {
    severity: 'High',
    fromDate: '2024-01-01T00:00:00Z',
    toDate: '2024-12-31T23:59:59Z',
    status: 'Open',
    merchantId: '123e4567-e89b-12d3-a456-426614174000',
    page: 1,
    limit: 10,
  },
};

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

// Test functions
async function testAlertsEndpoints() {
  console.log('\n🚨 TESTING ALERTS ENDPOINTS 🚨');
  console.log('================================');

  let createdAlertId = null;

  // 1. Test POST /alerts - Create Alert
  console.log('\n1. Testing POST /alerts - Create Alert');
  const createAlertResult = await makeRequest(
    'POST',
    '/alerts',
    testData.alert,
  );
  if (createAlertResult.success) {
    console.log('✅ Create Alert - SUCCESS');
    console.log('Response:', JSON.stringify(createAlertResult.data, null, 2));
    createdAlertId = createAlertResult.data.id;
  } else {
    console.log('❌ Create Alert - FAILED');
    console.log('Error:', createAlertResult.error);
  }

  // 2. Test POST /alerts/search - Search Alerts
  console.log('\n2. Testing POST /alerts/search - Search Alerts');
  const searchAlertsResult = await makeRequest(
    'POST',
    '/alerts/search',
    testData.searchFilters,
  );
  if (searchAlertsResult.success) {
    console.log('✅ Search Alerts - SUCCESS');
    console.log('Response:', JSON.stringify(searchAlertsResult.data, null, 2));
  } else {
    console.log('❌ Search Alerts - FAILED');
    console.log('Error:', searchAlertsResult.error);
  }

  // 3. Test GET /alerts/:id - Get Alert by ID
  if (createdAlertId) {
    console.log('\n3. Testing GET /alerts/:id - Get Alert by ID');
    const getAlertResult = await makeRequest(
      'GET',
      `/alerts/${createdAlertId}`,
    );
    if (getAlertResult.success) {
      console.log('✅ Get Alert by ID - SUCCESS');
      console.log('Response:', JSON.stringify(getAlertResult.data, null, 2));
    } else {
      console.log('❌ Get Alert by ID - FAILED');
      console.log('Error:', getAlertResult.error);
    }

    // 4. Test PUT /alerts/:id/status - Update Alert Status
    console.log('\n4. Testing PUT /alerts/:id/status - Update Alert Status');
    const updateStatusResult = await makeRequest(
      'PUT',
      `/alerts/${createdAlertId}/status`,
      testData.updateAlertStatus,
    );
    if (updateStatusResult.success) {
      console.log('✅ Update Alert Status - SUCCESS');
      console.log(
        'Response:',
        JSON.stringify(updateStatusResult.data, null, 2),
      );
    } else {
      console.log('❌ Update Alert Status - FAILED');
      console.log('Error:', updateStatusResult.error);
    }

    // 5. Test DELETE /alerts/:id - Delete Alert
    console.log('\n5. Testing DELETE /alerts/:id - Delete Alert');
    const deleteAlertResult = await makeRequest(
      'DELETE',
      `/alerts/${createdAlertId}`,
    );
    if (deleteAlertResult.success) {
      console.log('✅ Delete Alert - SUCCESS');
      console.log('Response:', JSON.stringify(deleteAlertResult.data, null, 2));
    } else {
      console.log('❌ Delete Alert - FAILED');
      console.log('Error:', deleteAlertResult.error);
    }
  }
}

async function testCallLogsEndpoints() {
  console.log('\n📞 TESTING CALL-LOGS ENDPOINTS 📞');
  console.log('==================================');

  let createdCallLogId = null;
  let createdAlertId = null;

  // First create an alert for call log testing
  console.log('\nCreating test alert for call log testing...');
  const createAlertResult = await makeRequest(
    'POST',
    '/alerts',
    testData.alert,
  );
  if (createAlertResult.success) {
    createdAlertId = createAlertResult.data.id;
    console.log('✅ Test alert created with ID:', createdAlertId);
  } else {
    console.log('❌ Failed to create test alert');
    return;
  }

  // Update call log data with the created alert ID
  const callLogData = {
    ...testData.callLog,
    alert: createdAlertId,
  };

  // 1. Test POST /call-logs - Create Call Log
  console.log('\n1. Testing POST /call-logs - Create Call Log');
  const createCallLogResult = await makeRequest(
    'POST',
    '/call-logs',
    callLogData,
  );
  if (createCallLogResult.success) {
    console.log('✅ Create Call Log - SUCCESS');
    console.log('Response:', JSON.stringify(createCallLogResult.data, null, 2));
    createdCallLogId = createCallLogResult.data.id;
  } else {
    console.log('❌ Create Call Log - FAILED');
    console.log('Error:', createCallLogResult.error);
  }

  // 2. Test POST /call-logs/search - Search Call Logs
  console.log('\n2. Testing POST /call-logs/search - Search Call Logs');
  const searchCallLogsResult = await makeRequest('POST', '/call-logs/search', {
    calledBy: 'John Doe',
    fromDate: '2024-01-01T00:00:00Z',
    toDate: '2024-12-31T23:59:59Z',
    callStatus: 'Re-Engaged',
    page: 1,
    limit: 10,
  });
  if (searchCallLogsResult.success) {
    console.log('✅ Search Call Logs - SUCCESS');
    console.log(
      'Response:',
      JSON.stringify(searchCallLogsResult.data, null, 2),
    );
  } else {
    console.log('❌ Search Call Logs - FAILED');
    console.log('Error:', searchCallLogsResult.error);
  }

  // 3. Test GET /call-logs/alert/:alertId - Get Call Logs by Alert ID
  console.log(
    '\n3. Testing GET /call-logs/alert/:alertId - Get Call Logs by Alert ID',
  );
  const getCallLogsByAlertResult = await makeRequest(
    'GET',
    `/call-logs/alert/${createdAlertId}`,
  );
  if (getCallLogsByAlertResult.success) {
    console.log('✅ Get Call Logs by Alert ID - SUCCESS');
    console.log(
      'Response:',
      JSON.stringify(getCallLogsByAlertResult.data, null, 2),
    );
  } else {
    console.log('❌ Get Call Logs by Alert ID - FAILED');
    console.log('Error:', getCallLogsByAlertResult.error);
  }

  // 4. Test GET /call-logs/:id - Get Call Log by ID
  if (createdCallLogId) {
    console.log('\n4. Testing GET /call-logs/:id - Get Call Log by ID');
    const getCallLogResult = await makeRequest(
      'GET',
      `/call-logs/${createdCallLogId}`,
    );
    if (getCallLogResult.success) {
      console.log('✅ Get Call Log by ID - SUCCESS');
      console.log('Response:', JSON.stringify(getCallLogResult.data, null, 2));
    } else {
      console.log('❌ Get Call Log by ID - FAILED');
      console.log('Error:', getCallLogResult.error);
    }

    // 5. Test PUT /call-logs/:id - Update Call Log
    console.log('\n5. Testing PUT /call-logs/:id - Update Call Log');
    const updateCallLogResult = await makeRequest(
      'PUT',
      `/call-logs/${createdCallLogId}`,
      {
        callStatus: 'Not Interested',
        summary: 'Customer declined the offer after discussion',
      },
    );
    if (updateCallLogResult.success) {
      console.log('✅ Update Call Log - SUCCESS');
      console.log(
        'Response:',
        JSON.stringify(updateCallLogResult.data, null, 2),
      );
    } else {
      console.log('❌ Update Call Log - FAILED');
      console.log('Error:', updateCallLogResult.error);
    }

    // 6. Test DELETE /call-logs/:id - Delete Call Log
    console.log('\n6. Testing DELETE /call-logs/:id - Delete Call Log');
    const deleteCallLogResult = await makeRequest(
      'DELETE',
      `/call-logs/${createdCallLogId}`,
    );
    if (deleteCallLogResult.success) {
      console.log('✅ Delete Call Log - SUCCESS');
      console.log(
        'Response:',
        JSON.stringify(deleteCallLogResult.data, null, 2),
      );
    } else {
      console.log('❌ Delete Call Log - FAILED');
      console.log('Error:', deleteCallLogResult.error);
    }
  }

  // Clean up - delete the test alert
  if (createdAlertId) {
    console.log('\nCleaning up test alert...');
    await makeRequest('DELETE', `/alerts/${createdAlertId}`);
  }
}

async function testCommunicationEndpoints() {
  console.log('\n💬 TESTING COMMUNICATION ENDPOINTS 💬');
  console.log('=====================================');

  // Test POST /communication/trigger-slack-alert
  console.log(
    '\n1. Testing POST /communication/trigger-slack-alert - Trigger Slack Alert',
  );
  const slackAlertResult = await makeRequest(
    'POST',
    '/communication/trigger-slack-alert',
    {
      alertLevel: 'high_level_alert',
      businessName: 'Test Corp',
      reason: 'Test alert for endpoint verification',
      summary:
        'This is a test alert to verify the communication endpoint is working',
    },
  );
  if (slackAlertResult.success) {
    console.log('✅ Trigger Slack Alert - SUCCESS');
    console.log('Response:', JSON.stringify(slackAlertResult.data, null, 2));
  } else {
    console.log('❌ Trigger Slack Alert - FAILED');
    console.log('Error:', slackAlertResult.error);
  }
}

// Main test function
async function runAllTests() {
  console.log('🧪 STARTING COMPREHENSIVE ENDPOINT TESTS 🧪');
  console.log('============================================');
  console.log(`Base URL: ${BASE_URL}`);
  console.log('Make sure your NestJS application is running on port 3000');

  try {
    // Test all modules
    await testAlertsEndpoints();
    await testCallLogsEndpoints();
    await testCommunicationEndpoints();

    console.log('\n🎉 ALL TESTS COMPLETED! 🎉');
    console.log('Check the results above to see which endpoints are working.');
  } catch (error) {
    console.error('❌ Test execution failed:', error.message);
  }
}

// Run the tests
runAllTests();
