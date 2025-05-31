# Nitrolite State Channel Integration

This directory contains the implementation of Nitrolite state channels for the Reloop subscription platform on Flare Network.

## Overview

Nitrolite is a state channel framework that enables off-chain transactions with on-chain security guarantees. This integration allows users to create subscription payments using Nitrolite state channels on the Flare Network.

## Files

- `nitrolite.ts` - Core Nitrolite client implementation with channel creation, management, and state update functionality
- `subscriptionService.ts` - Subscription service that uses Nitrolite for creating and managing recurring payments

## Key Features

- Create state channels for subscription payments
- Fund channels with CFLR tokens
- Update channel state off-chain for efficient recurring payments
- Close channels cooperatively when subscriptions end

## Usage

The subscription flow integrates with Nitrolite through the following steps:

1. User selects a subscription plan and amount
2. Transaction confirmation dialog shows the process:
   - Confirming FLR/USD price from FTSO
   - Creating Nitrolite state channel
   - Funding channel with CFLR
   - Setting up subscription state
   - Finalizing transaction

## Technical Details

The implementation uses:
- Ethers.js for blockchain interactions
- Flare Network's FTSO for price feeds
- Nitrolite state channel protocol for off-chain transactions

## Integration Points

- Transaction confirmation dialog shows the Nitrolite channel creation process
- Subscription page uses the subscription service to create and manage subscriptions
- Dashboard will display active subscriptions managed through Nitrolite channels
