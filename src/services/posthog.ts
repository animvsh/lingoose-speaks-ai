
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
  private isInitialized: boolean = false;

  constructor(apiKey: string, host: string = 'https://us.i.posthog.com') {
    this.apiKey = apiKey;
    this.host = host.replace(/\/$/, ''); // Remove trailing slash
    this.isInitialized = true;
    console.log('PostHog Service initialized with:', { apiKey: this.apiKey.substring(0, 10) + '...', host: this.host });
  }

  // Check if PostHog is properly initialized
  getInitializationStatus(): boolean {
    return this.isInitialized && !!this.apiKey;
  }

  // Test method using webhook.site for debugging
  async testWithWebhook(webhookUrl: string, event: string, distinctId: string, properties?: Record<string, any>): Promise<void> {
    const eventData = {
      api_key: this.apiKey,
      event,
      distinct_id: distinctId,
      properties: {
        ...properties,
        $current_url: window.location.href,
        $pathname: window.location.pathname,
        $timestamp: new Date().toISOString(),
        test_mode: true
      }
    };

    console.log('Sending test event to webhook.site:', eventData);

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData)
      });

      console.log('Webhook test response:', response.status, response.statusText);
      
      if (!response.ok) {
        console.error('Webhook test failed:', response.status, response.statusText);
      } else {
        console.log('Webhook test successful - your integration code is working!');
      }
    } catch (error) {
      console.error('Webhook test error:', error);
    }
  }

  // Send a single event immediately
  async capture(event: string, distinctId: string, properties?: Record<string, any>): Promise<void> {
    if (!this.isInitialized || !this.apiKey) {
      console.error('PostHog not properly initialized');
      return;
    }

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

    console.log('Sending PostHog event:', { event, distinctId, properties });

    try {
      const response = await fetch(`${this.host}/i/v0/e/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: this.apiKey,
          ...eventData
        }),
        mode: 'cors' // Explicitly set CORS mode
      });

      console.log('PostHog response:', response.status, response.statusText);

      if (!response.ok) {
        console.error('PostHog event failed:', response.status, response.statusText);
        const responseText = await response.text();
        console.error('Response body:', responseText);
      } else {
        console.log('PostHog event sent successfully');
      }
    } catch (error) {
      console.error('PostHog capture error:', error);
      console.error('This could be due to ad blockers, CORS issues, or network problems');
    }
  }

  // Add event to queue for batching
  captureQueued(event: string, distinctId: string, properties?: Record<string, any>): void {
    if (!this.isInitialized || !this.apiKey) {
      console.error('PostHog not properly initialized');
      return;
    }

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
        }),
        mode: 'cors'
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
  console.log('Initializing PostHog with API key:', apiKey.substring(0, 10) + '...');
  posthogService = new PostHogService(apiKey, host);
  console.log('PostHog service created successfully');
  return posthogService;
};

export default PostHogService;
