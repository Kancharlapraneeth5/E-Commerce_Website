declare module 'razorpay' {
  import { EventEmitter } from 'events';
  interface RazorpayOrderRequest {
    amount: number;
    currency: string;
    receipt?: string;
    payment_capture?: number;
    notes?: Record<string, any>;
  }
  interface RazorpayOrderResponse {
    id: string;
    entity: string;
    amount: number;
    currency: string;
    receipt: string;
    status: string;
    [key: string]: any;
  }
  class Razorpay extends EventEmitter {
    constructor(options: { key_id: string; key_secret: string });
    orders: {
      create(params: RazorpayOrderRequest): Promise<RazorpayOrderResponse>;
    };
    // Add more APIs as needed
  }
  export = Razorpay;
}
