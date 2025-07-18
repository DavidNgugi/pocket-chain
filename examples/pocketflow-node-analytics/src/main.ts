import { SharedStore } from 'pocketflow-node';
import { createAnalyticsFlow } from './flow';
import * as fs from 'fs';
import * as path from 'path';

async function main(): Promise<void> {
  console.log('📊 PocketFlow-Node Data Analytics Example');
  console.log('=====================================\n');

  // Initialize shared store
  const shared: SharedStore = {};

  try {
    // Get sample data files
    const dataDir = path.join(__dirname, '../sample-data');
    const dataFiles = fs.readdirSync(dataDir)
      .filter(file => file.endsWith('.csv'))
      .map(file => path.join(dataDir, file));
    
    shared.dataFiles = dataFiles;
    console.log(`📁 Found ${dataFiles.length} CSV files to analyze`);
    console.log('Files:', dataFiles.map(f => path.basename(f)));
    console.log();

    // Run the analytics flow
    const analyticsFlow = createAnalyticsFlow();
    await analyticsFlow.run(shared);

    // Display results
    console.log('\n📈 Analysis Results');
    console.log('==================');
    
    if (shared.insights) {
      console.log('\n💡 Insights:');
      console.log(shared.insights);
    }
    
    if (shared.visualizations) {
      console.log('\n📊 Visualizations:');
      shared.visualizations.forEach((viz, index) => {
        console.log(`\n${index + 1}. ${viz}`);
      });
    }
    
    if (shared.recommendations) {
      console.log('\n🎯 Recommendations:');
      console.log(shared.recommendations);
    }
    
    console.log('\n🎉 Data analytics demonstration completed!');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the example
if (require.main === module) {
  main().catch(console.error);
} 