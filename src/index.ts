/**
 * PocketChain - A 100-line minimalist LLM framework for TypeScript/Node.js
 * 
 * Inspired by PocketFlow by Zachary Huang (@https://github.com/The-Pocket/PocketFlow)
 * 
 * This framework provides the core abstraction for building LLM applications:
 * - Graph-based workflow orchestration
 * - Shared state management
 * - Retry mechanisms with fallbacks
 * - Batch processing capabilities
 * - Async/await support
 * - Parallel execution
 */

export type SharedStore = Record<string, any>;
export type Params = Record<string, any>;
export type Action = string;

export abstract class BaseNode {
  protected params: Params = {};
  protected successors: Map<Action, BaseNode> = new Map();

  setParams(params: Params): void {
    this.params = params;
  }

  next(node: BaseNode, action: Action = "default"): BaseNode {
    if (this.successors.has(action)) {
      console.warn(`Overwriting successor for action '${action}'`);
    }
    this.successors.set(action, node);
    return node;
  }

  prep(shared: SharedStore): any {}
  exec(prepRes: any): any {}
  post(shared: SharedStore, prepRes: any, execRes: any): Action | void {}

  protected _exec(prepRes: any): any {
    return this.exec(prepRes);
  }

  protected _run(shared: SharedStore): Action | void {
    const p = this.prep(shared);
    const e = this._exec(p);
    return this.post(shared, p, e);
  }

  run(shared: SharedStore): Action | void {
    if (this.successors.size > 0) {
      console.warn("Node won't run successors. Use Flow.");
    }
    return this._run(shared);
  }

  // Operator overloading simulation
  rshift(other: BaseNode): BaseNode {
    return this.next(other);
  }

  sub(action: Action): ConditionalTransition {
    if (typeof action === "string") {
      return new ConditionalTransition(this, action);
    }
    throw new TypeError("Action must be a string");
  }
}

export class ConditionalTransition {
  constructor(private src: BaseNode, private action: Action) {}

  rshift(tgt: BaseNode): BaseNode {
    return this.src.next(tgt, this.action);
  }
}

export class Node extends BaseNode {
  constructor(
    protected maxRetries: number = 1,
    protected wait: number = 0
  ) {
    super();
  }

  protected curRetry: number = 0;

  execFallback(prepRes: any, exc: Error): never {
    throw exc;
  }

  protected override _exec(prepRes: any): any {
    for (this.curRetry = 0; this.curRetry < this.maxRetries; this.curRetry++) {
      try {
        return this.exec(prepRes);
      } catch (e) {
        if (this.curRetry === this.maxRetries - 1) {
          return this.execFallback(prepRes, e as Error);
        }
        if (this.wait > 0) {
          // Note: In a real implementation, you'd want to use setTimeout with async/await
          // For simplicity, we'll use a blocking sleep (not recommended for production)
          const start = Date.now();
          while (Date.now() - start < this.wait * 1000) {
            // Busy wait - in production, use proper async sleep
          }
        }
      }
    }
  }
}

export class BatchNode extends Node {
  protected override _exec(items: any[]): any[] {
    return (items || []).map(item => super._exec(item));
  }
}

export class Flow extends BaseNode {
  protected startNode: BaseNode | null = null;

  constructor(start?: BaseNode) {
    super();
    this.startNode = start || null;
  }

  start(node: BaseNode): BaseNode {
    this.startNode = node;
    return node;
  }

  protected getNextNode(curr: BaseNode, action: Action): BaseNode | null {
    const next = this.successors.get(action || "default");
    if (!next && this.successors.size > 0) {
        console.warn(`Flow ends: '${action}' not found in ${Array.from(this.successors.keys())}`);
        // return null;
    }
    return next || null;
  }

  protected _orch(shared: SharedStore, params?: Params): Action | void {
    let curr = this.startNode ? Object.create(Object.getPrototypeOf(this.startNode)) : null;
    if (curr && this.startNode) {
      Object.assign(curr, this.startNode);
    }
    const p = params || { ...this.params };
    let lastAction: Action | void = undefined;

    while (curr) {
      curr.setParams(p);
      lastAction = curr._run(shared);
      curr = this.getNextNode(curr, lastAction as Action);
      if (curr) {
        const nextNode = Object.create(Object.getPrototypeOf(curr));
        Object.assign(nextNode, curr);
        curr = nextNode;
      }
    }

    return lastAction;
  }

  protected override _run(shared: SharedStore): Action | void {
    const p = this.prep(shared);
    const o = this._orch(shared);
    return this.post(shared, p, o);
  }

  override post(shared: SharedStore, prepRes: any, execRes: any): any {
    return execRes;
  }
}

export class BatchFlow extends Flow {
  protected override _run(shared: SharedStore): Action | void {
    const pr = this.prep(shared) || [];
    for (const bp of pr) {
      this._orch(shared, { ...this.params, ...bp });
    }
    return this.post(shared, pr, undefined);
  }
}

export interface IAsyncNode {
  prepAsync(shared: SharedStore): Promise<any>;
  execAsync(prepRes: any): Promise<any>;
  execFallbackAsync(prepRes: any, exc: Error): Promise<any>;
  postAsync(shared: SharedStore, prepRes: any, execRes: any): Promise<Action | void>;
  runAsync(shared: SharedStore): Promise<Action | void>;
}

export abstract class AsyncNode extends Node implements IAsyncNode {
  async prepAsync(shared: SharedStore): Promise<any> { return undefined; }
  async execAsync(prepRes: any): Promise<any> { return undefined; }
  async execFallbackAsync(prepRes: any, exc: Error): Promise<any> { throw exc; }
  async postAsync(shared: SharedStore, prepRes: any, execRes: any): Promise<Action | void> { return undefined; }

  protected override async _exec(prepRes: any): Promise<any> {
    for (let i = 0; i < this.maxRetries; i++) {
      try {
        return await this.execAsync(prepRes);
      } catch (e) {
        if (i === this.maxRetries - 1) {
          return await this.execFallbackAsync(prepRes, e as Error);
        }
        if (this.wait > 0) {
          await new Promise(resolve => setTimeout(resolve, this.wait * 1000));
        }
      }
    }
  }

  async runAsync(shared: SharedStore): Promise<Action | void> {
    if (this.successors.size > 0) {
      console.warn("Node won't run successors. Use AsyncFlow.");
    }
    return await this._runAsync(shared);
  }

  protected async _runAsync(shared: SharedStore): Promise<Action | void> {
    const p = await this.prepAsync(shared);
    const e = await this._exec(p);
    return await this.postAsync(shared, p, e);
  }

  protected override _run(shared: SharedStore): never {
    throw new Error("Use runAsync.");
  }
}

export class AsyncBatchNode extends AsyncNode {
  protected override async _exec(items: any[]): Promise<any[]> {
    return await Promise.all(items.map(item => super._exec(item)));
  }
}

export class AsyncParallelBatchNode extends AsyncNode {
  protected override async _exec(items: any[]): Promise<any[]> {
    return await Promise.all(items.map(item => super._exec(item)));
  }
}

export class AsyncFlow extends Flow implements IAsyncNode {
  async prepAsync(shared: SharedStore): Promise<any> { return this.prep(shared); }
  async execAsync(prepRes: any): Promise<any> { return undefined; }
  async execFallbackAsync(prepRes: any, exc: Error): Promise<any> { throw exc; }
  async postAsync(shared: SharedStore, prepRes: any, execRes: any): Promise<Action | void> { return execRes; }

  async runAsync(shared: SharedStore): Promise<Action | void> {
    return await this._runAsync(shared);
  }

  async _orchAsync(shared: SharedStore, params?: Params): Promise<Action | void> {
    let curr = this.startNode ? Object.create(Object.getPrototypeOf(this.startNode)) : null;
    if (curr && this.startNode) {
      Object.assign(curr, this.startNode);
    }
    const p = params || { ...this.params };
    let lastAction: Action | void = undefined;

    while (curr) {
      curr.setParams(p);
      if (typeof (curr as any).runAsync === 'function') {
        lastAction = await (curr as IAsyncNode).runAsync(shared);
      } else {
        lastAction = curr._run(shared);
      }
      curr = this.getNextNode(curr, lastAction as Action);
      if (curr) {
        const nextNode = Object.create(Object.getPrototypeOf(curr));
        Object.assign(nextNode, curr);
        curr = nextNode;
      }
    }

    return lastAction;
  }

  protected async _runAsync(shared: SharedStore): Promise<Action | void> {
    const p = await this.prepAsync(shared);
    const o = await this._orchAsync(shared);
    return await this.postAsync(shared, p, o);
  }
}

export class AsyncBatchFlow extends AsyncFlow {
  protected override async _runAsync(shared: SharedStore): Promise<Action | void> {
    const pr = await this.prepAsync(shared) || [];
    for (const bp of pr) {
      await this._orchAsync(shared, { ...this.params, ...bp });
    }
    return await this.postAsync(shared, pr, undefined);
  }
}

export class AsyncParallelBatchFlow extends AsyncFlow {
  protected override async _runAsync(shared: SharedStore): Promise<Action | void> {
    const pr = await this.prepAsync(shared) || [];
    await Promise.all(pr.map((bp: any) => this._orchAsync(shared, { ...this.params, ...bp })));
    return await this.postAsync(shared, pr, undefined);
  }
}

// Operator overloading helpers
export function operatorRshift(left: BaseNode, right: BaseNode): BaseNode {
  return left.rshift(right);
}

export function operatorSub(left: BaseNode, right: Action): ConditionalTransition {
  return left.sub(right);
} 