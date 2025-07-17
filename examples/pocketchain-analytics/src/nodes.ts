import { Node, BatchNode, SharedStore } from 'pocketchain';
import { readCSVFile, calculateStats, filterData, CSVData } from './utils/csv';

/**
 * Node to load CSV data files
 */
export class LoadData extends BatchNode {
  prep(shared: SharedStore): string[] {
    return shared.dataFiles || [];
  }

  exec(filePath: string): CSVData {
    console.log(`📁 Loading data from: ${filePath}`);
    return readCSVFile(filePath);
  }

  post(shared: SharedStore, prepRes: string[], execResList: CSVData[]): void {
    shared.datasets = execResList;
    console.log(`✅ Loaded ${execResList.length} datasets`);
  }
}

/**
 * Node to calculate basic statistics for each dataset
 */
export class CalculateStatistics extends BatchNode {
  prep(shared: SharedStore): CSVData[] {
    return shared.datasets || [];
  }

  exec(dataset: CSVData): { dataset: CSVData; stats: Record<string, any> } {
    const stats = calculateStats(dataset);
    return { dataset, stats };
  }

  post(shared: SharedStore, prepRes: CSVData[], execResList: any[]): void {
    shared.statistics = execResList;
    console.log(`📊 Calculated statistics for ${execResList.length} datasets`);
  }
}

/**
 * Node to generate insights from the data
 */
export class GenerateInsights extends Node {
  prep(shared: SharedStore): { datasets: CSVData[]; statistics: any[] } {
    return {
      datasets: shared.datasets || [],
      statistics: shared.statistics || []
    };
  }

  async exec(inputs: { datasets: CSVData[]; statistics: any[] }): Promise<string> {
    const { datasets, statistics } = inputs;
    
    let insights = '📈 Data Analysis Insights\n';
    insights += '========================\n\n';
    
    for (let i = 0; i < datasets.length; i++) {
      const dataset = datasets[i];
      const stats = statistics[i];
      
      insights += `📋 Dataset: ${dataset.metadata.fileName}\n`;
      insights += `   Rows: ${dataset.metadata.rowCount}, Columns: ${dataset.metadata.columnCount}\n\n`;
      
      // Generate insights for each column
      for (const [column, columnStats] of Object.entries(stats.stats)) {
        if (columnStats.type === 'categorical') {
          insights += `   📊 ${column}: ${columnStats.uniqueCount} unique values\n`;
        } else {
          insights += `   📊 ${column}: Mean=${columnStats.mean}, Range=${columnStats.range}\n`;
        }
      }
      
      insights += '\n';
    }
    
    // Cross-dataset insights
    if (datasets.length > 1) {
      insights += '🔗 Cross-Dataset Analysis:\n';
      insights += '   - Multiple datasets provide comprehensive view\n';
      insights += '   - Data can be correlated for deeper insights\n';
      insights += '   - Consider joining datasets for enhanced analysis\n\n';
    }
    
    return insights;
  }

  post(shared: SharedStore, prepRes: { datasets: CSVData[]; statistics: any[] }, execRes: string): void {
    shared.insights = execRes;
    console.log('💡 Generated data insights');
  }
}

/**
 * Node to create data visualizations (mock)
 */
export class CreateVisualizations extends Node {
  prep(shared: SharedStore): { datasets: CSVData[]; statistics: any[] } {
    return {
      datasets: shared.datasets || [],
      statistics: shared.statistics || []
    };
  }

  async exec(inputs: { datasets: CSVData[]; statistics: any[] }): Promise<string[]> {
    const { datasets, statistics } = inputs;
    const visualizations: string[] = [];
    
    for (let i = 0; i < datasets.length; i++) {
      const dataset = datasets[i];
      const stats = statistics[i];
      
      // Generate mock visualization descriptions
      const viz = `📊 Visualization for ${dataset.metadata.fileName}:
   - Bar chart: Distribution of categorical variables
   - Histogram: Distribution of numeric variables
   - Scatter plot: Correlation between numeric columns
   - Summary table: Key statistics and metrics`;
      
      visualizations.push(viz);
    }
    
    return visualizations;
  }

  post(shared: SharedStore, prepRes: { datasets: CSVData[]; statistics: any[] }, execRes: string[]): void {
    shared.visualizations = execRes;
    console.log(`📊 Created ${execRes.length} visualization plans`);
  }
}

/**
 * Node to generate recommendations based on data analysis
 */
export class GenerateRecommendations extends Node {
  prep(shared: SharedStore): { insights: string; datasets: CSVData[]; statistics: any[] } {
    return {
      insights: shared.insights || '',
      datasets: shared.datasets || [],
      statistics: shared.statistics || []
    };
  }

  async exec(inputs: { insights: string; datasets: CSVData[]; statistics: any[] }): Promise<string> {
    const { datasets, statistics } = inputs;
    
    let recommendations = '🎯 Data-Driven Recommendations\n';
    recommendations += '==============================\n\n';
    
    for (let i = 0; i < datasets.length; i++) {
      const dataset = datasets[i];
      const stats = statistics[i];
      
      recommendations += `📋 For ${dataset.metadata.fileName}:\n`;
      
      // Generate recommendations based on data characteristics
      const numericColumns = Object.entries(stats.stats).filter(([_, s]) => s.type !== 'categorical');
      const categoricalColumns = Object.entries(stats.stats).filter(([_, s]) => s.type === 'categorical');
      
      if (numericColumns.length > 0) {
        recommendations += `   🔢 Numeric Analysis: Consider trend analysis and forecasting\n`;
      }
      
      if (categoricalColumns.length > 0) {
        recommendations += `   📊 Categorical Analysis: Focus on distribution and segmentation\n`;
      }
      
      if (dataset.metadata.rowCount > 1000) {
        recommendations += `   📈 Large Dataset: Consider sampling for faster analysis\n`;
      }
      
      recommendations += '\n';
    }
    
    recommendations += '🚀 Next Steps:\n';
    recommendations += '   1. Implement automated data quality checks\n';
    recommendations += '   2. Set up regular data refresh processes\n';
    recommendations += '   3. Create interactive dashboards\n';
    recommendations += '   4. Establish data governance policies\n';
    
    return recommendations;
  }

  post(shared: SharedStore, prepRes: { insights: string; datasets: CSVData[]; statistics: any[] }, execRes: string): void {
    shared.recommendations = execRes;
    console.log('🎯 Generated data recommendations');
  }
} 