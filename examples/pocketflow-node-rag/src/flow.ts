import { Flow } from '../../../src/index';
import { 
  ChunkDocs, 
  EmbedDocs, 
  StoreIndex, 
  EmbedQuery, 
  RetrieveDocs, 
  GenerateAnswer 
} from './nodes';

/**
 * Create the offline indexing flow
 * This flow processes documents and creates a searchable index
 */
export function createOfflineFlow(): Flow {
  const chunkNode = new ChunkDocs();
  const embedNode = new EmbedDocs();
  const storeNode = new StoreIndex();

  // Connect nodes with natural syntax
  chunkNode.then(embedNode).then(storeNode);

  return new Flow(chunkNode);
}

/**
 * Create the online query flow
 * This flow answers questions using the pre-built index
 */
export function createOnlineFlow(): Flow {
  const embedQueryNode = new EmbedQuery();
  const retrieveNode = new RetrieveDocs();
  const generateNode = new GenerateAnswer();

  // Connect nodes with natural syntax
  embedQueryNode.then(retrieveNode).then(generateNode);

  return new Flow(embedQueryNode);
} 