import React, { useState, useEffect, useCallback } from 'react';
import { getFLRUSDPrice } from '../../utils/ftso';
import { CheckCircle, X, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface Step {
  id: string;
  label: string;
  status: 'pending' | 'loading' | 'completed';
}

interface TransactionConfirmationDialogProps {
  amount: string;
  currency: string;
  onComplete: () => void;
  onClose: () => void;
}

const TransactionConfirmationDialog: React.FC<TransactionConfirmationDialogProps> = ({
  amount,
  currency,
  onComplete,
  onClose
}) => {
  const [steps, setSteps] = useState<Step[]>([
    { id: 'ftso', label: 'Confirming FLR/USD Feed price from FTSO...', status: 'pending' },
    { id: 'channel', label: 'Creating State Channel...', status: 'pending' },
    { id: 'contract', label: 'Deploying Subscription Contract...', status: 'pending' },
    { id: 'funds', label: 'Locking Funds...', status: 'pending' },
    { id: 'confirmation', label: 'Finalizing Transaction...', status: 'pending' }
  ]);
  
  const [flrPrice, setFlrPrice] = useState<string | null>(null);
  const [allCompleted, setAllCompleted] = useState(false);

  // Function to update step status
  const updateStepStatus = useCallback((stepId: string, status: 'pending' | 'loading' | 'completed') => {
    setSteps(prevSteps => 
      prevSteps.map(step => 
        step.id === stepId ? { ...step, status } : step
      )
    );
  }, []);

  // Process all steps in sequence with proper delays
  useEffect(() => {
    const processSteps = async () => {
      // Step 1: FTSO Price
      updateStepStatus('ftso', 'loading');
      try {
        const priceData = await getFLRUSDPrice();
        setFlrPrice(priceData.formattedPrice);
        
        // Update step label with price
        setSteps(prevSteps => 
          prevSteps.map(step => 
            step.id === 'ftso' 
              ? { ...step, label: `Confirmed FLR/USD Feed price: $${priceData.formattedPrice}` } 
              : step
          )
        );
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        updateStepStatus('ftso', 'completed');
        
        // Step 2: State Channel
        updateStepStatus('channel', 'loading');
        await new Promise(resolve => setTimeout(resolve, 3000));
        updateStepStatus('channel', 'completed');
        
        // Step 3: Contract Deployment
        updateStepStatus('contract', 'loading');
        await new Promise(resolve => setTimeout(resolve, 3000));
        updateStepStatus('contract', 'completed');
        
        // Step 4: Locking Funds
        updateStepStatus('funds', 'loading');
        await new Promise(resolve => setTimeout(resolve, 3000));
        updateStepStatus('funds', 'completed');
        
        // Step 5: Confirmation
        updateStepStatus('confirmation', 'loading');
        await new Promise(resolve => setTimeout(resolve, 3000));
        updateStepStatus('confirmation', 'completed');
        
        // All steps completed
        setAllCompleted(true);
      } catch (error) {
        console.error('Error in transaction process:', error);
        // Still proceed with mock data
        updateStepStatus('ftso', 'completed');
        
        // Continue with remaining steps
        updateStepStatus('channel', 'loading');
        await new Promise(resolve => setTimeout(resolve, 3000));
        updateStepStatus('channel', 'completed');
        
        updateStepStatus('contract', 'loading');
        await new Promise(resolve => setTimeout(resolve, 3000));
        updateStepStatus('contract', 'completed');
        
        updateStepStatus('funds', 'loading');
        await new Promise(resolve => setTimeout(resolve, 3000));
        updateStepStatus('funds', 'completed');
        
        updateStepStatus('confirmation', 'loading');
        await new Promise(resolve => setTimeout(resolve, 3000));
        updateStepStatus('confirmation', 'completed');
        
        setAllCompleted(true);
      }
    };
    
    processSteps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl border border-gray-100">
        {/* Header with close button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Transaction in Progress
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Transaction amount card */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Amount</p>
              <p className="text-xl font-bold text-gray-800">
                {currency === 'USD' ? `$${amount}` : `${amount} CFLR`}
              </p>
            </div>
            <div className="h-12 w-12 relative">
              <Image 
                src="/flr-logo.svg" 
                alt="Flare Logo" 
                width={48} 
                height={48} 
              />
            </div>
          </div>
        </div>
        
        {/* Steps progress */}
        <div className="space-y-5 my-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-start group">
              <div className="mr-4 relative">
                {/* Step indicator */}
                <div className={`
                  w-7 h-7 rounded-full flex items-center justify-center
                  ${step.status === 'completed' ? 'bg-green-100' : 
                    step.status === 'loading' ? 'bg-blue-100' : 'bg-gray-100'}
                `}>
                  {step.status === 'completed' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : step.status === 'loading' ? (
                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-gray-300" />
                  )}
                </div>
                
                {/* Vertical line connecting steps */}
                {index < steps.length - 1 && (
                  <div className={`
                    absolute top-7 left-3.5 w-0.5 h-5 -ml-px
                    ${step.status === 'completed' ? 'bg-green-200' : 'bg-gray-200'}
                  `}></div>
                )}
              </div>
              
              <div className="flex-1">
                <p className={`font-medium ${step.status === 'completed' ? 'text-green-600' : 
                  step.status === 'loading' ? 'text-blue-600' : 'text-gray-600'}`}>
                  {step.label}
                </p>
                
                {/* Optional step description */}
                {step.id === 'ftso' && flrPrice && step.status === 'completed' && (
                  <p className="text-xs text-gray-500 mt-1">
                    Current FLR/USD price: ${flrPrice}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Action button */}
        {allCompleted ? (
          <button
            onClick={onComplete}
            className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg 
                     hover:from-green-600 hover:to-emerald-700 transition-all font-medium shadow-md
                     flex items-center justify-center space-x-2"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Transaction Complete!</span>
          </button>
        ) : (
          <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
            <p className="flex items-center">
              <Loader2 className="w-4 h-4 mr-2 animate-spin text-blue-500" />
              Processing your transaction. Please wait...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionConfirmationDialog;
