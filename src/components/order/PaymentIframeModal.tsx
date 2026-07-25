import React from 'react';
import { Modal } from '../ui/Modal';

interface PaymentIframeModalProps {
  isOpen: boolean;
  onClose: () => void;
  iframeUrl?: string;
}

export const PaymentIframeModal: React.FC<PaymentIframeModalProps> = ({
  isOpen,
  onClose,
  iframeUrl,
}) => {
  if (!iframeUrl) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Paymob Secure Checkout" maxWidth="4xl">
      <div className="w-full h-[600px] rounded-xl overflow-hidden bg-slate-900">
        <iframe
          src={iframeUrl}
          title="Paymob Payment Gateway"
          className="w-full h-full border-0"
          allow="payment"
        />
      </div>
    </Modal>
  );
};
