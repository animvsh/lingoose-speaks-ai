
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
  private retryAttempts: number = 3;
  private retryDelay: number = 1000;

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

  // Enhanced fetch with retry logic and better error handling
  private async fetchWithRetry(url: string, options: RequestInit, retries: number = this.retryAttempts): Promise<Response> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`PostHog request attempt ${attempt}/${retries} to ${url}`);
        
        const response = await fetch(url, {
          ...options,
          mode: 'cors',
          credentials: 'omit', // Don't send credentials for CORS
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options.headers
          }
        });

        if (response.ok) {
          console.log(`PostHog request successful on attempt ${attempt}`);
          return response;
        }

        console.warn(`PostHog request failed with status ${response.status} on attempt ${attempt}`);
        
        // If it's the last attempt, throw the error
        if (attempt === retries) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
        
      } catch (error) {
        console.error(`PostHog request attempt ${attempt} failed:`, error);
        
        // If it's the last attempt, throw the error
        if (attempt === retries) {
          throw error;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt));
      }
    }
    
    throw new Error('All retry attempts failed');
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
      const response = await this.fetchWithRetry(webhookUrl, {
        method: 'POST',
        body: JSON.stringify(eventData)
      });

      console.log('Webhook test successful - your integration code is working!');
    } catch (error) {
      console.error('Webhook test error:', error);
    }
  }

  // Send a single event with improved error handling
  async capture(event: string, distinctId: string, properties?: Record<string, any>): Promise<boolean> {
    if (!this.isInitialized || !this.apiKey) {
      console.error('PostHog not properly initialized');
      return false;
    }

    const eventData = {
      api_key: this.apiKey,
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
      // Try the standard PostHog endpoint first
      await this.fetchWithRetry(`${this.host}/capture/`, {
        method: 'POST',
        body: JSON.stringify(eventData)
      });

      console.log('PostHog event sent successfully via /capture/');
      return true;
    } catch (error) {
      console.warn('Failed to send via /capture/, trying /e/ endpoint:', error);
      
      // Fallback to the alternative endpoint
      try {
        await this.fetchWithRetry(`${this.host}/e/`, {
          method: 'POST',
          body: JSON.stringify(eventData)
        });

        console.log('PostHog event sent successfully via /e/');
        return true;
      } catch (fallbackError) {
        console.error('All PostHog endpoints failed:', fallbackError);
        
        // Queue the event for later retry
        this.captureQueued(event, distinctId, properties);
        return false;
      }
    }
  }

  // Add event to queue for batching with improved error handling
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
    console.log(`Event queued for batch sending. Queue size: ${this.eventQueue.length}`);

    // Send batch if we reach the batch size
    if (this.eventQueue.length >= this.BATCH_SIZE) {
      this.flushBatch();
    } else {
      // Set timeout to send batch
      this.scheduleBatchFlush();
    }
  }

  // Send all queued events in a batch with improved error handling
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

    console.log(`Flushing batch of ${batchEvents.length} events`);

    try {
      await this.fetchWithRetry(`${this.host}/batch/`, {
        method: 'POST',
        body: JSON.stringify({
          api_key: this.apiKey,
          batch: batchEvents
        })
      });

      console.log('PostHog batch sent successfully');
    } catch (error) {
      console.error('PostHog batch failed completely, events lost:', error);
      // In a production app, you might want to store failed events locally
    }
  }

  private scheduleBatchFlush(): void {
    if (this.batchTimeout) return;

    this.batchTimeout = setTimeout(() => {
      this.flushBatch();
    }, this.BATCH_TIMEOUT);
  }

  // Identify a user with improved error handling
  async identify(distinctId: string, properties?: Record<string, any>): Promise<boolean> {
    return await this.capture('$identify', distinctId, {
      $set: properties,
      ...properties
    });
  }

  // Track page view with improved error handling
  async pageView(distinctId: string, properties?: Record<string, any>): Promise<boolean> {
    return await this.capture('$pageview', distinctId, {
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

  // Get debug information
  getDebugInfo(): any {
    return {
      initialized: this.isInitialized,
      apiKey: this.apiKey ? this.apiKey.substring(0, 10) + '...' : 'Not set',
      host: this.host,
      queueSize: this.eventQueue.length,
      hasBatchTimeout: !!this.batchTimeout
    };
  }
}

// Create a singleton instance
export let posthogService: PostHogService | null = null;

export const initializePostHog = (apiKey: string, host?: string) => {
  console.log('Initializing PostHog with API key:', apiKey.substring(0, 10) + '...');
  posthogService = new PostHogService(apiKey, host);
  console.log('PostHog service created successfully');
  console.log('PostHog debug info:', posthogService.getDebugInfo());
  return posthogService;
};

export default PostHogService;
