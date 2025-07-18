/**
 * CSV processing utility for analytics example
 * In production, use libraries like csv-parser or papaparse
 */

export interface CSVRow {
  [key: string]: string | number;
}

export interface CSVData {
  headers: string[];
  rows: CSVRow[];
  metadata: {
    rowCount: number;
    columnCount: number;
    fileName: string;
  };
}

/**
 * Parse CSV content into structured data
 */
export function parseCSV(content: string, fileName: string): CSVData {
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  
  if (lines.length === 0) {
    throw new Error('Empty CSV file');
  }
  
  // Parse headers
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  
  // Parse rows
  const rows: CSVRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
    const row: CSVRow = {};
    
    for (let j = 0; j < headers.length; j++) {
      const value = values[j] || '';
      // Try to convert to number if possible
      const numValue = parseFloat(value);
      row[headers[j]] = isNaN(numValue) ? value : numValue;
    }
    
    rows.push(row);
  }
  
  return {
    headers,
    rows,
    metadata: {
      rowCount: rows.length,
      columnCount: headers.length,
      fileName
    }
  };
}

/**
 * Read CSV file from disk
 */
export function readCSVFile(filePath: string): CSVData {
  const fs = require('fs');
  const path = require('path');
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(filePath);
  
  return parseCSV(content, fileName);
}

/**
 * Calculate basic statistics for numeric columns
 */
export function calculateStats(data: CSVData): Record<string, any> {
  const stats: Record<string, any> = {};
  
  for (const header of data.headers) {
    const values = data.rows.map(row => row[header]).filter(v => typeof v === 'number');
    
    if (values.length > 0) {
      const numbers = values as number[];
      const sum = numbers.reduce((a, b) => a + b, 0);
      const mean = sum / numbers.length;
      const sorted = numbers.sort((a, b) => a - b);
      const median = sorted.length % 2 === 0 
        ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
        : sorted[Math.floor(sorted.length / 2)];
      
      stats[header] = {
        count: numbers.length,
        sum,
        mean: Math.round(mean * 100) / 100,
        median: Math.round(median * 100) / 100,
        min: Math.min(...numbers),
        max: Math.max(...numbers),
        range: Math.max(...numbers) - Math.min(...numbers)
      };
    } else {
      // For non-numeric columns, count unique values
      const uniqueValues = new Set(data.rows.map(row => row[header]));
      stats[header] = {
        type: 'categorical',
        uniqueCount: uniqueValues.size,
        uniqueValues: Array.from(uniqueValues).slice(0, 10) // First 10 unique values
      };
    }
  }
  
  return stats;
}

/**
 * Filter data based on conditions
 */
export function filterData(data: CSVData, filters: Record<string, any>): CSVData {
  const filteredRows = data.rows.filter(row => {
    for (const [column, condition] of Object.entries(filters)) {
      if (typeof condition === 'object') {
        // Range filter: { min: 10, max: 100 }
        if (condition.min !== undefined && row[column] < condition.min) return false;
        if (condition.max !== undefined && row[column] > condition.max) return false;
      } else {
        // Exact match filter
        if (row[column] !== condition) return false;
      }
    }
    return true;
  });
  
  return {
    ...data,
    rows: filteredRows,
    metadata: {
      ...data.metadata,
      rowCount: filteredRows.length
    }
  };
}

// Test the utility
if (require.main === module) {
  const sampleCSV = `id,name,age,salary
1,John,30,50000
2,Jane,25,45000
3,Bob,35,60000
4,Alice,28,52000`;
  
  const data = parseCSV(sampleCSV, 'sample.csv');
  console.log('Parsed CSV:', data);
  
  const stats = calculateStats(data);
  console.log('Statistics:', stats);
  
  const filtered = filterData(data, { age: { min: 25, max: 30 } });
  console.log('Filtered data:', filtered);
} 