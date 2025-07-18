# PocketFlow-Node Analytics

A data analysis tool that can process CSV files and generate insights using LLMs with PocketFlow-Node.

## What it does

This analytics tool can:
- Load and parse CSV data files
- Analyze data patterns and trends
- Generate statistical summaries
- Identify anomalies and outliers
- Create data visualizations (text-based)
- Provide actionable insights and recommendations
- Handle multiple data sources

## Architecture

The analytics tool uses a multi-node flow:
1. **LoadNode**: Loads and validates CSV data
2. **AnalyzeNode**: Performs statistical analysis
3. **InsightNode**: Generates insights using LLMs
4. **ReportNode**: Creates comprehensive reports

```mermaid
flowchart LR
    A[LoadNode] --> B[AnalyzeNode]
    B --> C[InsightNode]
    C --> D[ReportNode]
```

## Features

- **Data Loading**: Supports CSV files with automatic type detection
- **Statistical Analysis**: Calculates basic statistics (mean, median, std dev, etc.)
- **Pattern Recognition**: Identifies trends and patterns in data
- **Anomaly Detection**: Finds outliers and unusual data points
- **Insight Generation**: Uses LLMs to interpret data and provide insights
- **Report Generation**: Creates comprehensive analysis reports
- **Data Validation**: Checks for data quality issues

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment**:
   ```bash
   cp env.example .env
   # Edit .env and add your OpenAI API key
   ```

3. **Add your data**:
   ```bash
   # Copy your CSV files to the data/ folder
   cp your-data.csv data/
   ```

4. **Run the analytics**:
   ```bash
   npm start
   ```

5. **Analyze your data**:
   ```
   Enter CSV file: data/sales.csv
   Analyzing...
   Report: Your sales data shows a 15% increase in Q4...
   ```

## Usage Examples

### Sales Data Analysis
```
File: sales.csv
Report: 
- Total sales: $1,234,567
- Average order value: $89.45
- Top performing product: Widget Pro
- Seasonal trend: 23% increase in December
- Recommendation: Increase inventory for Q1
```

### Customer Data Analysis
```
File: customers.csv
Report:
- Customer retention rate: 78%
- Average customer lifetime value: $456
- Most common customer segment: Small Business
- Churn risk factors: Low engagement, late payments
- Recommendation: Implement loyalty program
```

### Financial Data Analysis
```
File: financial.csv
Report:
- Revenue growth: 12% YoY
- Profit margin: 23.4%
- Cash flow: Positive trend
- Risk areas: High accounts receivable
- Recommendation: Improve collection process
```

## Configuration

### Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `OPENAI_MODEL`: Model to use (default: "gpt-3.5-turbo")
- `MAX_ROWS`: Maximum rows to analyze (default: 10000)
- `ANALYSIS_DEPTH`: Depth of analysis (basic/advanced)

### Customization

You can modify the analytics behavior by editing:
- `src/nodes.ts`: Change how data is analyzed and insights generated
- `src/flow.ts`: Modify the analysis flow
- `src/utils/data.ts`: Add support for different data formats

## Project Structure

```
pocketflow-node-analytics/
├── README.md              # This file
├── package.json           # Dependencies and scripts
├── env.example           # Environment variables template
├── src/
│   ├── main.ts           # Entry point
│   ├── nodes.ts          # Node definitions
│   ├── flow.ts           # Flow orchestration
│   └── utils/
│       ├── llm.ts        # LLM utility functions
│       └── data.ts       # Data processing utilities
├── data/
│   ├── input/            # Your CSV files go here
│   ├── output/           # Generated reports
│   └── sample/           # Sample data files
└── sample-data/          # Sample CSV files for testing
```

## API Reference

### LoadNode
- **Purpose**: Loads and validates CSV data
- **Input**: CSV file path
- **Output**: Parsed data with metadata

### AnalyzeNode
- **Purpose**: Performs statistical analysis
- **Input**: Parsed data
- **Output**: Statistical summary and patterns

### InsightNode
- **Purpose**: Generates insights using LLMs
- **Input**: Statistical analysis results
- **Output**: Interpreted insights and recommendations

### ReportNode
- **Purpose**: Creates comprehensive reports
- **Input**: Analysis results and insights
- **Output**: Formatted report

## Troubleshooting

### Common Issues

1. **"File not found"**
   - Make sure your CSV file is in the `data/` directory
   - Check the file path and permissions

2. **"Invalid CSV format"**
   - Ensure your CSV file has proper headers
   - Check for missing commas or quotes

3. **"Data too large"**
   - The tool has a maximum row limit
   - Consider sampling your data or increasing the limit

### Debug Mode

Run with debug logging:
```bash
DEBUG=true npm start
```

## Extending the Analytics Tool

### Adding New Features

1. **Database support**: Add support for SQL databases
2. **Visualization**: Generate charts and graphs
3. **Machine learning**: Add predictive analytics
4. **Real-time analysis**: Process streaming data

### Example: Adding Chart Generation

```typescript
// In src/utils/charts.ts
export function generateChart(data: any[], type: string): string {
  // Generate ASCII charts or export to image
  return chartOutput;
}
```

## Data Format Requirements

### CSV Format
- First row should contain column headers
- Data should be comma-separated
- Text fields should be quoted if they contain commas
- Missing values should be empty or marked as NULL

### Supported Data Types
- **Numeric**: Integers, decimals, percentages
- **Text**: Names, descriptions, categories
- **Dates**: Various date formats
- **Boolean**: Yes/No, True/False, 1/0

## Sample Data

The tool includes sample CSV files for testing:
- `sample/sales.csv`: Sales data with products, dates, amounts
- `sample/customers.csv`: Customer data with demographics
- `sample/financial.csv`: Financial data with revenue, expenses

## License

This example is provided under the MIT license. 