import { SharedStore } from 'pocketchain';
import { createScrapingFlow } from './flow';
import * as fs from 'fs';
import * as path from 'path';

async function main(): Promise<void> {
  console.log('🕷️  PocketChain Web Scraper Example');
  console.log('====================================\n');

  // Initialize shared store
  const shared: SharedStore = {};

  try {
    // Load URLs from sample file
    const urlsFile = path.join(__dirname, '../sample-urls.txt');
    const urlsText = fs.readFileSync(urlsFile, 'utf-8');
    const urls = urlsText.split('\n').filter(url => url.trim().length > 0);
    
    shared.urls = urls;
    console.log(`📋 Loaded ${urls.length} URLs to scrape`);
    console.log('URLs:', urls);
    console.log();

    // Run the scraping flow
    const scrapingFlow = createScrapingFlow();
    await scrapingFlow.run(shared);

    // Display results
    console.log('\n📊 Final Results');
    console.log('================');
    console.log(shared.finalReport);
    
    console.log('\n🎉 Web scraping demonstration completed!');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the example
if (require.main === module) {
  main().catch(console.error);
} 