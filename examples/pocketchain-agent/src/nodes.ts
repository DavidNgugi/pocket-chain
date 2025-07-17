import { AsyncNode, SharedStore } from 'pocketchain';
export interface TaskContext {
  task: string;
  steps: string[];
  currentStep: number;
  results: Record<string, any>;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
}

export interface AgentAction {
  action: string;
  reason: string;
  parameters?: Record<string, any>;
}

/**
 * Node to analyze and break down complex tasks
 */
export class AnalyzeTask extends AsyncNode {
  async prepAsync(shared: SharedStore): Promise<string> {
    console.log("AnalyzeTask: prepAsync - shared.task:", shared.task);
    return shared.task || '';
  }

  async execAsync(task: string): Promise<string[]> {
    console.log("AnalyzeTask: execAsync - task:", task);
    // In a real implementation, use LLM to break down the task
    // For now, use simple heuristics
    const steps: string[] = [];
    
    if (task.toLowerCase().includes('research')) {
      steps.push('Define research scope');
      steps.push('Gather information');
      steps.push('Analyze findings');
      steps.push('Create summary');
    } else if (task.toLowerCase().includes('plan')) {
      steps.push('Identify objectives');
      steps.push('List requirements');
      steps.push('Create timeline');
      steps.push('Assign resources');
    } else if (task.toLowerCase().includes('analyze')) {
      steps.push('Collect data');
      steps.push('Process information');
      steps.push('Identify patterns');
      steps.push('Draw conclusions');
    } else {
      steps.push('Understand requirements');
      steps.push('Execute task');
      steps.push('Review results');
      steps.push('Finalize output');
    }
    
    console.log("AnalyzeTask: execAsync - returning steps:", steps);
    return steps;
  }

  async postAsync(shared: SharedStore, prepRes: string, execRes: string[]): Promise<string> {
    console.log("AnalyzeTask: postAsync - prepRes:", prepRes, "execRes:", execRes);
    shared.taskContext = {
      task: prepRes,
      steps: execRes,
      currentStep: 0,
      results: {},
      status: 'pending'
    };
    console.log(`📋 Task broken down into ${execRes.length} steps`);
    console.log("AnalyzeTask: postAsync - returning 'default'");
    return "default";
  }
}

/**
 * Node to decide the next action based on current context
 */
export class DecideAction extends AsyncNode {
  async prepAsync(shared: SharedStore): Promise<TaskContext> {
    return shared.taskContext || { task: '', steps: [], currentStep: 0, results: {}, status: 'pending' };
  }

  async execAsync(context: TaskContext): Promise<AgentAction> {
    const { task, steps, currentStep, results, status } = context;
    
    // Decision logic based on current state
    if (status === 'pending') {
      return {
        action: 'start',
        reason: 'Task is ready to begin',
        parameters: { step: steps[currentStep] }
      };
    }
    
    if (currentStep >= steps.length) {
      return {
        action: 'complete',
        reason: 'All steps completed',
        parameters: { results }
      };
    }
    
    if (status === 'in_progress') {
      return {
        action: 'execute',
        reason: 'Continue with current step',
        parameters: { step: steps[currentStep] }
      };
    }
    
    return {
      action: 'error',
      reason: 'Unknown state',
      parameters: { context }
    };
  }

  async postAsync(shared: SharedStore, prepRes: TaskContext, execRes: AgentAction): Promise<string> {
    shared.currentAction = execRes;
    return execRes.action;
  }
}

/**
 * Node to execute a specific step
 */
export class ExecuteStep extends AsyncNode {
  async prepAsync(shared: SharedStore): Promise<{ step: string; context: TaskContext }> {
    return {
      step: shared.currentAction?.parameters?.step || '',
      context: shared.taskContext || { task: '', steps: [], currentStep: 0, results: {}, status: 'pending' }
    };
  }

  async execAsync(inputs: { step: string; context: TaskContext }): Promise<any> {
    const { step, context } = inputs;
    
    // Simulate step execution with delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Mock execution results based on step type
    let result: any;
    
    if (step.includes('research') || step.includes('gather')) {
      result = {
        type: 'information',
        content: `Research findings for: ${step}`,
        sources: ['source1.com', 'source2.com'],
        confidence: 0.85
      };
    } else if (step.includes('analyze') || step.includes('process')) {
      result = {
        type: 'analysis',
        insights: [`Key insight 1 from ${step}`, `Key insight 2 from ${step}`],
        metrics: { accuracy: 0.92, relevance: 0.88 }
      };
    } else if (step.includes('create') || step.includes('generate')) {
      result = {
        type: 'output',
        content: `Generated content for: ${step}`,
        format: 'text',
        quality: 'high'
      };
    } else {
      result = {
        type: 'general',
        status: 'completed',
        notes: `Step "${step}" executed successfully`
      };
    }
    
    return result;
  }

  async postAsync(shared: SharedStore, prepRes: { step: string; context: TaskContext }, execRes: any): Promise<string> {
    const context = shared.taskContext as TaskContext;
    context.results[prepRes.step] = execRes;
    context.currentStep++;
    context.status = context.currentStep >= context.steps.length ? 'completed' : 'in_progress';
    
    console.log(`✅ Completed step: ${prepRes.step}`);
    return "default";
  }
}

/**
 * Node to handle task completion
 */
export class CompleteTask extends AsyncNode {
  async prepAsync(shared: SharedStore): Promise<TaskContext> {
    return shared.taskContext || { task: '', steps: [], currentStep: 0, results: {}, status: 'pending' };
  }

  async execAsync(context: TaskContext): Promise<string> {
    const summary = `Task "${context.task}" completed successfully!
    
Steps completed: ${context.steps.length}
Results generated: ${Object.keys(context.results).length}
Final status: ${context.status}

Summary of results:
${Object.entries(context.results).map(([step, result]) => 
  `- ${step}: ${JSON.stringify(result).substring(0, 100)}...`
).join('\n')}`;
    
    return summary;
  }

  async postAsync(shared: SharedStore, prepRes: TaskContext, execRes: string): Promise<string> {
    shared.finalSummary = execRes;
    console.log('🎉 Task completed successfully!');
    return "default";
  }
}

/**
 * Node to handle errors and recovery
 */
export class HandleError extends AsyncNode {
  async prepAsync(shared: SharedStore): Promise<{ error: any; context: TaskContext }> {
    return {
      error: shared.lastError || 'Unknown error',
      context: shared.taskContext || { task: '', steps: [], currentStep: 0, results: {}, status: 'pending' }
    };
  }

  async execAsync(inputs: { error: any; context: TaskContext }): Promise<string> {
    const { error, context } = inputs;
    
    // Error recovery logic
    const recoveryPlan = `Error encountered: ${error}
    
Recovery actions:
1. Log error details
2. Attempt retry with modified parameters
3. If retry fails, skip to next step
4. Update task status

Current context: Step ${context.currentStep + 1} of ${context.steps.length}`;
    
    return recoveryPlan;
  }

  async postAsync(shared: SharedStore, prepRes: { error: any; context: TaskContext }, execRes: string): Promise<string> {
    const context = shared.taskContext as TaskContext;
    context.status = 'in_progress'; // Reset to continue
    shared.errorRecovery = execRes;
    
    console.log('🔄 Error handled, continuing with task...');
    return "default";
  }
} 