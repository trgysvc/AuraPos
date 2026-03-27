Alright, I need to address the user's problem where every INSERT, UPDATE, or DELETE operation needs to be added to a sync queue after they're performed. The user is using TypeScript with Supabase, and they provided a code snippet that uses a non-native module and lacks error handling, which violates their system rules.

First, I'll analyze the existing code. The code uses `supabase.on`, which is part of the Supabase client. However, the user's system rules strictly prohibit the use of third-party middleware unless it's Supabase itself. So, using `supabase.on` might be acceptable since Supabase is allowed, but I need to ensure that the code doesn't introduce any middleware.

Next, the user mentioned that the code lacks error handling. I should add proper try-catch blocks around the async operations to handle any potential errors.

I'll structure the solution by creating a new file, `sync-queue.ts`, which will handle the sync queue functionality. This file will include an interface for the sync operations, a queue array, and functions to setup the queue, add operations, retrieve the queue, and clear it.

In the `setupSyncQueue` function, I'll use the Supabase client to listen for 'after' events on queries. For each event, I'll check if it's an INSERT, UPDATE, or DELETE operation. If it is, I'll create an operation object with the table name, operation type, data, and timestamp, then add it to the queue.

I'll also implement a maximum queue size to prevent memory issues. If the queue exceeds this size, the oldest items will be removed.

For error handling, I'll wrap the event listener setup in a try-catch block. Additionally, I'll ensure that any async operations within the listener are properly handled to prevent uncaught exceptions.

Finally, I'll export the necessary functions so they can be used elsewhere in the application. This setup ensures that all write operations are captured and added to the sync queue, adhering to the user's system rules and improving the code's robustness with proper error handling.
</think>

```typescript
// src/sync-queue.ts

interface SyncOperation {
    table: string;
    operation: 'INSERT' | 'UPDATE' | 'DELETE';
    data: any;
    timestamp: number;
}

const MAX_QUEUE_SIZE = 1000;
let syncQueue: SyncOperation[] = [];

export function setupSyncQueue(supabaseClient) {
    try {
        supabaseClient.on('after', { event: 'query' }, async (event) => {
            try {
                if (event.queryName === 'insert' || event.queryName === 'update' || event.queryName === 'delete') {
                    const operation: SyncOperation = {
                        table: event.table,
                        operation: event.queryName.toUpperCase() as 'INSERT' | 'UPDATE' | 'DELETE',
                        data: event.data,
                        timestamp: Date.now()
                    };

                    addOperationToQueue(operation);
                }
            } catch (error) {
                console.error('Error processing sync operation:', error);
            }
        }).subscribe();
    } catch (error) {
        console.error('Error setting up sync queue:', error);
    }
}

function addOperationToQueue(operation: SyncOperation) {
    syncQueue.push(operation);
    
    if (syncQueue.length > MAX_QUEUE_SIZE) {
        syncQueue.shift();
    }
}

export function getSyncQueue() {
    return syncQueue;
}

export function clearSyncQueue() {
    syncQueue = [];
}
```