
interface PostHogEvent {
  event: string;
  distinct_id: string;
  properties?: Record<string, any>;
  timestamp?: string;
}

interface PostHogBatchEvent {
  event: string;
  properties: {
    distinct_id: string;
    [key: string]: any;
  };
  timestamp?: string;
}

class PostHogService {
  private apiKey: string;
  private host: string;
  private eventQueue: PostHogEvent[] = [];
  private batchTimeout: NodeJS.Timeout | null = null;
  private readonly BATCH_SIZE = 10;
  private readonly BATCH_TIMEOUT = 5000; // 5 seconds

  constructor(apiKey: string, host: string = 'https://us.i.posthog.com') {
    this.apiKey = apiKey;
    this.host = host.replace(/\/$/, ''); // Remove trailing slash
  }

  // Send a single event immediately
  async capture(event: string, distinctId: string, properties?: Record<string, any>): Promise<void> {
    const eventData: PostHogEvent = {
      event,
      distinct_id: distinctId,
      properties: {
        ...properties,
        $current_url: window.location.href,
        $pathname: window.location.pathname,
        $timestamp: new Date().toISOString()
      }
    };

    try {
      const response = await fetch(`${this.host}/i/v0/e/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: this.apiKey,
          ...eventData
        })
      });

      if (!response.ok) {
        console.error('PostHog event failed:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('PostHog capture error:', error);
    }
  }

  // Add event to queue for batching
  captureQueued(event: string, distinctId: string, properties?: Record<string, any>): void {
    const eventData: PostHogEvent = {
      event,
      distinct_id: distinctId,
      properties: {
        ...properties,
        $current_url: window.location.href,
        $pathname: window.location.pathname,
        $timestamp: new Date().toISOString()
      }
    };

    this.eventQueue.push(eventData);

    // Send batch if we reach the batch size
    if (this.eventQueue.length >= this.BATCH_SIZE) {
      this.flushBatch();
    } else {
      // Set timeout to send batch
      this.scheduleBatchFlush();
    }
  }

  // Send all queued events in a batch
  private async flushBatch(): Promise<void> {
    if (this.eventQueue.length === 0) return;

    const batch = [...this.eventQueue];
    this.eventQueue = [];

    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
      this.batchTimeout = null;
    }

    const batchEvents: PostHogBatchEvent[] = batch.map(event => ({
      event: event.event,
      properties: {
        distinct_id: event.distinct_id,
        ...event.properties
      },
      timestamp: event.timestamp
    }));

    try {
      const response = await fetch(`${this.host}/batch/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: this.apiKey,
          batch: batchEvents
        })
      });

      if (!response.ok) {
        console.error('PostHog batch failed:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('PostHog batch error:', error);
    }
  }

  private scheduleBatchFlush(): void {
    if (this.batchTimeout) return;

    this.batchTimeout = setTimeout(() => {
      this.flushBatch();
    }, this.BATCH_TIMEOUT);
  }

  // Identify a user
  async identify(distinctId: string, properties?: Record<string, any>): Promise<void> {
    await this.capture('$identify', distinctId, {
      $set: properties,
      ...properties
    });
  }

  // Track page view
  async pageView(distinctId: string, properties?: Record<string, any>): Promise<void> {
    await this.capture('$pageview', distinctId, {
      $current_url: window.location.href,
      $pathname: window.location.pathname,
      $title: document.title,
      ...properties
    });
  }

  // Flush any remaining events (useful for page unload)
  async flush(): Promise<void> {
    await this.flushBatch();
  }
}

// Create a singleton instance
export let posthogService: PostHogService | null = null;

export const initializePostHog = (apiKey: string, host?: string) => {
  posthogService = new PostHogService(apiKey, host);
  return posthogService;
};

export default PostHogService;
