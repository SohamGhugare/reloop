import { ethers } from 'ethers';
import { NitroliteClient, createSubscription } from './nitrolite';
import { getFLRUSDPrice } from '../utils/ftso';

// Token addresses
const CFLR_TOKEN_ADDRESS = '0x1D80c49BbBCd1C0911346656B529DF9E5c2F783d'; // Coston2 CFLR token

/**
 * Service for managing subscriptions using Nitrolite state channels
 */
export class SubscriptionService {
  private provider: ethers.Provider;
  private signer: ethers.Signer | null = null;
  private nitroliteClient: NitroliteClient | null = null;
  
  constructor(provider: ethers.Provider) {
    this.provider = provider;
  }
  
  /**
   * Connect a wallet to the subscription service
   */
  async connect(signer: ethers.Signer): Promise<boolean> {
    try {
      this.signer = signer;
      const account = await signer.getAddress();
      
      // Initialize Nitrolite client
      this.nitroliteClient = new NitroliteClient({
        provider: this.provider,
        signer,
        account
      });
      
      return true;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      return false;
    }
  }
  
  /**
   * Create a new subscription
   */
  async createSubscription({
    recipient,
    amount,
    currency,
    plan
  }: {
    recipient: string;
    amount: string;
    currency: 'USD' | 'CFLR';
    plan: 'monthly' | 'quarterly' | 'yearly';
  }) {
    if (!this.signer || !this.nitroliteClient) {
      throw new Error('Wallet not connected');
    }
    
    try {
      // If amount is in USD, convert to CFLR
      let cflrAmount = amount;
      if (currency === 'USD') {
        // Get CFLR price from FTSO
        const priceData = await getFLRUSDPrice();
        const usdAmount = parseFloat(amount);
        const cflrValue = usdAmount / parseFloat(priceData.formattedPrice);
        cflrAmount = cflrValue.toFixed(6);
      }
      
      // Create subscription using Nitrolite
      const result = await createSubscription({
        provider: this.provider,
        signer: this.signer,
        recipient,
        amount: cflrAmount,
        token: CFLR_TOKEN_ADDRESS,
        period: plan
      });
      
      return result;
    } catch (error) {
      console.error('Error creating subscription:', error);
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }
  
  /**
   * Get all active subscriptions for the connected wallet
   */
  async getActiveSubscriptions() {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }
    
    // This would normally query the Nitrolite contracts or an indexer
    // For now, return mock data
    return [
      {
        id: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        recipient: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
        amount: '100',
        token: CFLR_TOKEN_ADDRESS,
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        nextPayment: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        plan: 'monthly'
      },
      {
        id: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        recipient: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
        amount: '500',
        token: CFLR_TOKEN_ADDRESS,
        startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
        nextPayment: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        plan: 'quarterly'
      }
    ];
  }
  
  /**
   * Cancel a subscription
   */
  async cancelSubscription(subscriptionId: string) {
    if (!this.signer || !this.nitroliteClient) {
      throw new Error('Wallet not connected');
    }
    
    // This would normally:
    // 1. Fetch the channel
    // 2. Create a final state
    // 3. Close the channel
    
    console.log(`Cancelling subscription ${subscriptionId}`);
    
    // Simulate a delay for processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      success: true,
      transactionHash: '0x' + Math.random().toString(16).substring(2, 66)
    };
  }
}

// Create a singleton instance
let subscriptionServiceInstance: SubscriptionService | null = null;

/**
 * Get the subscription service instance
 */
export function getSubscriptionService(provider?: ethers.Provider) {
  if (!subscriptionServiceInstance && provider) {
    subscriptionServiceInstance = new SubscriptionService(provider);
  }
  
  if (!subscriptionServiceInstance) {
    throw new Error('Subscription service not initialized');
  }
  
  return subscriptionServiceInstance;
}
