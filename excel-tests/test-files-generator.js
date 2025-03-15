// test-files-generator.js
// Install required package: npm install xlsx

const XLSX = require('xlsx');

// 1. Create Standard Format Test File
function createStandardFile() {
  const data = [
    {
      'Date': '2025-03-05',
      'Time': '09:00',
      'Meter Name': 'TH-E-01',
      'Reading': 2845.67,
      'Unit': 'kWh',
      'Delta': 12.5,
      'Notes': 'Normal load'
    },
    {
      'Date': '2025-03-05',
      'Time': '10:00',
      'Meter Name': 'TH-E-01',
      'Reading': 2858.17,
      'Unit': 'kWh',
      'Delta': 12.5,
      'Notes': 'Normal load'
    },
    {
      'Date': '2025-03-05',
      'Time': '11:00',
      'Meter Name': 'TH-E-01',
      'Reading': 2870.67,
      'Unit': 'kWh',
      'Delta': 12.5,
      'Notes': 'Normal load'
    }
  ];
  
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, 'Test_Standard.xlsx');
  console.log('Created: Test_Standard.xlsx');
}

// 2. Create Alternative Column Names Test File
function createAltColumnsFile() {
  const data = [
    {
      'Timestamp': '2025-03-05',
      'Meter ID': 'TH-E-01',
      'Consumption': 2845.67,
      'Measurement Unit': 'kWh',
      'Change': 12.5,
      'Comments': 'Normal load'
    },
    {
      'Timestamp': '2025-03-05',
      'Meter ID': 'TH-E-01',
      'Consumption': 2858.17,
      'Measurement Unit': 'kWh',
      'Change': 12.5,
      'Comments': 'Normal load'
    },
    {
      'Timestamp': '2025-03-05',
      'Meter ID': 'TH-E-01',
      'Consumption': 2870.67,
      'Measurement Unit': 'kWh',
      'Change': 12.5,
      'Comments': 'Normal load'
    }
  ];
  
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, 'Test_Alt_Columns.xlsx');
  console.log('Created: Test_Alt_Columns.xlsx');
}

// 3. Create Different Date Formats Test File
function createDateFormatsFile() {
  const data = [
    {
      'Date': '3/5/2025',
      'Time': '09:00',
      'Meter': 'TH-E-01',
      'Reading': 2845.67,
      'Unit': 'kWh'
    },
    {
      'Date': '05-Mar-25',
      'Time': '10:00',
      'Meter': 'TH-E-01',
      'Reading': 2858.17,
      'Unit': 'kWh'
    },
    {
      'Date': '2025.03.05',
      'Time': '11:00',
      'Meter': 'TH-E-01',
      'Reading': 2870.67,
      'Unit': 'kWh'
    }
  ];
  
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, 'Test_Date_Formats.xlsx');
  console.log('Created: Test_Date_Formats.xlsx');
}

// Generate all files
createStandardFile();
createAltColumnsFile();
createDateFormatsFile();

console.log('All test files created successfully!');