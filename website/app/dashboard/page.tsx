'use client';

import { FC, useState } from 'react';
import { Plus, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Subscription {
  id: string;
  name: string;
  logo: string;
  amount: number;
  interval: 'Monthly' | 'Quarterly' | 'Yearly';
  nextPayment: Date;
  status: 'Active' | 'Paused' | 'Failed';
}

const Dashboard: FC = () => {

  // Mock data
  const [subscriptions] = useState<Subscription[]>([
    {
      id: '1',
      name: 'Notion Pro Plan',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png',
      amount: 0.0004,
      interval: 'Monthly',
      nextPayment: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'Active'
    },
    {
      id: '2',
      name: 'Flares Magazine+',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg',
      amount: 0.0012,
      interval: 'Yearly',
      nextPayment: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      status: 'Active'
    },
    {
      id: '3',
      name: 'Developer DAO Membership',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg',
      amount: 0.0008,
      interval: 'Monthly',
      nextPayment: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      status: 'Active'
    }
  ]);

  const getDaysUntilNextPayment = (nextPayment: Date) => {
    const today = new Date();
    const diffTime = nextPayment.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `In ${diffDays} days`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
      <div className="mt-12 mb-16">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-black">Dashboard</h1>
          <Link 
            href="/subscription/new"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2 font-semibold"
          >
            <Plus className="h-4 w-4" />
            New Subscription
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {/* Total Active Subscriptions */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
          <h2 className="text-2xl font-bold text-black mb-4">Total Active Subscriptions</h2>
          <div className="text-4xl font-bold text-black mb-4">3</div>
          <div className="text-gray-600 flex items-center gap-1">Monthly spending: <Image src="/flr-logo.svg" width={14} height={14} alt="CFLR" className="inline" /> 0.0024</div>
        </div>

        {/* Upcoming Payments */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
          <h2 className="text-2xl font-bold text-black mb-4">Upcoming Payments</h2>
          <div className="text-4xl font-bold text-orange-400 mb-4 flex items-center gap-2"><Image src="/flr-logo.svg" width={28} height={28} alt="CFLR" /> 0.0004</div>
          <div className="text-gray-600">Due in the next 7 days</div>
        </div>

        {/* Smart Contract Lock */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
          <h2 className="text-2xl font-bold text-black mb-4">Smart Contract Lock</h2>
          <div className="text-4xl font-bold text-indigo-600 mb-4 flex items-center gap-2"><Image src="/flr-logo.svg" width={28} height={28} alt="CFLR" /> 0.0032</div>
          <div className="text-gray-600">68% of recommended coverage</div>
        </div>
      </div>

      {/* Active Subscriptions */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-black mb-6">Active Subscriptions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {subscriptions.map((subscription) => (
            <div
              key={subscription.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:shadow-indigo-200/50 hover:border-indigo-200 transition-all duration-300 flex flex-col h-full"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg bg-orange-50 flex items-center justify-center">
                    <img
                      src={subscription.logo}
                      alt={subscription.name}
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{subscription.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-medium text-gray-900">
                        {subscription.interval}
                      </span>
                      <span className="text-base font-bold text-orange-400 flex items-center gap-1">
                        <Image src="/flr-logo.svg" width={12} height={12} alt="CFLR" /> {subscription.amount}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="px-3 py-1.5 text-sm font-medium text-green-700 bg-green-100 rounded-full">
                  Active
                </span>
              </div>
              <div className="mt-auto">
                <div className="flex items-center gap-2 text-base text-gray-600 bg-gray-50 px-4 py-3 rounded-lg">
                  <Clock size={18} className="text-orange-400" />
                  <span>Next Payment: {getDaysUntilNextPayment(subscription.nextPayment)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
