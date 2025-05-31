'use client';

import { FC, useState } from 'react';
import { ArrowUp, Check, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAccount } from 'wagmi';
import { EthereumIcon } from '../../components/EthereumIcon';

interface Creator {
  id: string;
  name: string;
  address: string;
  verified: boolean;
  img: string;
}

const popularCreators: Creator[] = [
  { id: '1', name: 'Ethereum Magazine', address: '0xEthMag123...', verified: true, img: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg' },
  { id: '2', name: 'Ethereum Foundation', address: '0xEthFound456...', verified: true, img: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg' },
  { id: '3', name: 'Vitalik Newsletter', address: '0xVitalik789...', verified: true, img: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg' },
  { id: '4', name: 'Crypto Artists DAO', address: '0xArtDAO123...', verified: true, img: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg' }
];

const SubscriptionForm: FC = () => {
  const router = useRouter();
  const { isConnected } = useAccount();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Form fields
  const [plan, setPlan] = useState<string>('monthly');
  const [recipientType, setRecipientType] = useState<string>('creator');
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('10');
  const [currency, setCurrency] = useState<string>('USD');
  const [duration, setDuration] = useState<string>('3');
  
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  
  // Ethereum price simulation
  const ethPrice = 3450; // USD
  const ethAmount = currency === 'USD' ? Number(amount) / ethPrice : Number(amount);
  
  const handleSelectCreator = (creator: Creator) => {
    setSelectedCreator(creator);
    setRecipientAddress(creator.address);
  };
  
  const handleNextStep = () => {
    if (!isConnected) {
      toast.error('Please connect to a wallet');
      return;
    }

    // Validate current step
    if (currentStep === 1) {
      if (!plan) {
        toast.error("Please select a subscription plan");
        return;
      }
    } else if (currentStep === 2) {
      if (!recipientAddress && recipientType === 'address') {
        toast.error("Please enter a recipient address");
        return;
      }
      
      if (!selectedCreator && recipientType === 'creator') {
        toast.error("Please select a creator");
        return;
      }
    } else if (currentStep === 3) {
      if (!amount || Number(amount) <= 0) {
        toast.error("Please enter a valid amount");
        return;
      }
    }
    
    setCurrentStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };
  
  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };
  
  const handleConfirmSubscription = () => {
    setLoading(true);
    setTimeout(() => {
      toast.success("Subscription created successfully!");
      setLoading(false);
      router.push('/dashboard');
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto pt-20 px-4 pb-16">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-black">Create New Subscription</h1>
          <button 
            onClick={() => router.push('/dashboard')}
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
        </div>
        
        <div className="mt-6">
          <div className="h-2 bg-gray-100 rounded-full">
            <div 
              className="h-full bg-indigo-600 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span className={currentStep >= 1 ? 'font-medium text-gray-900' : 'text-gray-500'}>
              Plan
            </span>
            <span className={currentStep >= 2 ? 'font-medium text-gray-900' : 'text-gray-500'}>
              Recipient
            </span>
            <span className={currentStep >= 3 ? 'font-medium text-gray-900' : 'text-gray-500'}>
              Amount
            </span>
            <span className={currentStep >= 4 ? 'font-medium text-gray-900' : 'text-gray-500'}>
              Confirm
            </span>
          </div>
        </div>
      </div>
      
      {/* Step 1: Select Plan */}
      {currentStep === 1 && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-black">Choose Your Subscription Plan</h2>
            <p className="text-gray-500 mt-1">Select how often you want to make payments</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {['monthly', 'quarterly', 'annual'].map((p) => (
                <div 
                  key={p}
                  className={`flex items-center space-x-4 border rounded-lg p-4 cursor-pointer hover:border-indigo-200 transition-colors ${
                    plan === p ? 'border-indigo-600 bg-indigo-50' : ''
                  }`}
                  onClick={() => setPlan(p)}
                >
                  <input
                    type="radio"
                    checked={plan === p}
                    onChange={() => setPlan(p)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium capitalize text-black">{p} Plan</div>
                    <div className="text-sm text-gray-500">
                      Pay once every {p === 'monthly' ? 'month' : p === 'quarterly' ? '3 months' : 'year'}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-medium text-black">
                      {p === 'monthly' ? '12x' : p === 'quarterly' ? '4x' : '1x'}
                    </span>
                    <div className="text-sm text-gray-500">payments/year</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-6 border-t border-gray-200 flex justify-end">
            <button
              onClick={handleNextStep}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}
      
      {/* Step 2: Choose Recipient */}
      {currentStep === 2 && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-black">Choose Your Recipient</h2>
            <p className="text-gray-500 mt-1">Select who will receive your subscription payments</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex space-x-4 border-b border-gray-200">
                <button
                  className={`pb-4 px-2 ${
                    recipientType === 'creator'
                      ? 'border-b-2 border-indigo-600 text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setRecipientType('creator')}
                >
                  Popular Creators
                </button>
                <button
                  className={`pb-4 px-2 ${
                    recipientType === 'address'
                      ? 'border-b-2 border-indigo-600 text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setRecipientType('address')}
                >
                  Custom Recipient
                </button>
              </div>

              {recipientType === 'creator' ? (
                <div className="space-y-4">
                  {popularCreators.map((creator) => (
                    <div 
                      key={creator.id}
                      className={`flex items-center space-x-4 border rounded-lg p-4 cursor-pointer hover:border-indigo-200 transition-colors ${
                        selectedCreator?.id === creator.id ? 'border-indigo-600 bg-indigo-50' : ''
                      }`}
                      onClick={() => handleSelectCreator(creator)}
                    >
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                        {creator.img ? (
                          <img 
                            src={creator.img} 
                            alt={creator.name} 
                            className="w-8 h-8 object-contain"
                          />
                        ) : (
                          <div className="text-lg font-medium">
                            {creator.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-black">{creator.name}</span>
                          {creator.verified && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <Check className="mr-1 h-3 w-3" /> Verified
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {creator.address}
                        </div>
                      </div>
                      {selectedCreator?.id === creator.id && (
                        <Check className="h-5 w-5 text-indigo-600" />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Recipient Address
                    </label>
                    <input
                      type="text"
                      value={recipientAddress}
                      onChange={(e) => setRecipientAddress(e.target.value)}
                      placeholder="Enter an Ethereum address"
                      className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Enter the wallet address of the person or organization you want to pay
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="p-6 border-t border-gray-200 flex justify-between">
            <button
              onClick={handlePrevStep}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium text-black"
            >
              Back
            </button>
            <button
              onClick={handleNextStep}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}
      
      {/* Step 3: Set Amount */}
      {currentStep === 3 && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-black">Set Payment Amount</h2>
            <p className="text-gray-500 mt-1">
              How much do you want to pay per {plan === 'monthly' ? 'month' : plan === 'quarterly' ? 'quarter' : 'year'}?
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Amount</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500 text-black"
                  >
                    <option value="USD">USD</option>
                    <option value="ETH">ETH</option>
                  </select>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-xl pr-12 placeholder-gray-800 text-black"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {currency}
                  </div>
                </div>
                <div className="mt-1 text-sm text-gray-500 flex items-center gap-1">
                  {currency === 'USD' ? (
                    <>≈ <EthereumIcon size={12} /> {ethAmount.toFixed(6)} ETH</>
                  ) : (
                    <>≈ ${(Number(amount) * ethPrice).toFixed(2)} USD</>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subscription Duration
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black"
                >
                  <option value="3">3 months</option>
                  <option value="6">6 months</option>
                  <option value="12">12 months</option>
                  <option value="24">24 months</option>
                  <option value="0">Until cancelled</option>
                </select>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-base font-medium text-black mb-4">Smart Contract Lock Preview</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Locked Amount:</span>
                    <span className="font-semibold text-black flex items-center gap-1">
                      <EthereumIcon size={14} /> {(ethAmount * (plan === 'monthly' ? 3 : plan === 'quarterly' ? 2 : 1)).toFixed(6)} ETH
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-500">Smart Contract Coverage:</span>
                      <Info size={14} className="text-gray-400" />
                    </div>
                    <span className="font-semibold text-black">
                      {duration === '0' ? 'Until Cancelled' : `${duration} months`}
                    </span>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-500">
                  ETH will be locked in a smart contract and automatically sent to the recipient based on your subscription schedule. You can cancel anytime, and remaining funds will be returned to you.
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 border-t border-gray-200 flex justify-between">
            <button
              onClick={handlePrevStep}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium text-black"
            >
              Back
            </button>
            <button
              onClick={handleNextStep}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}
      
      {/* Step 4: Confirmation */}
      {currentStep === 4 && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-black">Confirm Subscription</h2>
            <p className="text-gray-500 mt-1">Review your subscription details before confirming</p>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <div className="text-gray-500">Subscription Plan</div>
                <div className="font-medium text-black">
                  {plan === 'monthly' ? 'Monthly' : plan === 'quarterly' ? 'Quarterly' : 'Annual'} Payments
                </div>
              </div>
              
              <div>
                <div className="text-gray-500">Recipient</div>
                <div className="font-medium text-black">
                  {selectedCreator ? selectedCreator.name : 'Custom Address'}
                </div>
                <div className="text-sm text-gray-500 truncate">
                  {recipientAddress}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-gray-500">Amount per payment</div>
                  <div className="font-medium text-black">
                    {currency === 'USD' ? `$${amount}` : `${amount} ETH`}
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      {currency === 'USD' ? (
                        <>≈ <EthereumIcon size={12} /> {ethAmount.toFixed(6)} ETH</>
                      ) : (
                        <>≈ ${(Number(amount) * ethPrice).toFixed(2)} USD</>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="text-gray-500">Duration</div>
                  <div className="font-medium text-black">
                    {duration === '0' ? 'Until Cancelled' : `${duration} months`}
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base font-medium text-black">Total ETH to Lock</h3>
                  <span className="text-indigo-600 font-semibold flex items-center gap-1">
                    <EthereumIcon size={14} /> {(ethAmount * (plan === 'monthly' ? 3 : plan === 'quarterly' ? 2 : 1)).toFixed(6)} ETH
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  By clicking confirm, you agree to lock the above amount of ETH in a smart contract. This will enable automatic payments according to your subscription schedule. You can cancel anytime.
                </p>
              </div>
              
              <div className="text-sm text-gray-500">
                <p>
                  <span className="font-semibold">Privacy Note:</span> Your subscription details are stored in an encrypted format on the Ethereum blockchain. Only you and the recipient can view the full transaction details.
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 border-t border-gray-200 flex justify-between">
            <button
              onClick={handlePrevStep}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium text-black"
            >
              Back
            </button>
            <button
              onClick={handleConfirmSubscription}
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                'Processing...'
              ) : (
                <>
                  <ArrowUp className="h-4 w-4" />
                  Confirm & Pay
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionForm;
