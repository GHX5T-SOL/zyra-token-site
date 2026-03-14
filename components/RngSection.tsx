'use client';

import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { signAndSendPayment } from '@/lib/signAndSendPayment';

export default function RngSection() {
  const { publicKey, signTransaction, connected } = useWallet();
  const { connection } = useConnection();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [number, setNumber] = useState<number | null>(null);

  async function handlePayAndGenerate() {
    if (!publicKey || !signTransaction) {
      setError('Connect your wallet first.');
      return;
    }
    setError(null);
    setStatus(null);
    setNumber(null);
    setLoading(true);

    try {
      setStatus('Creating invoice…');
      const invoiceRes = await fetch('/api/invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userWallet: publicKey.toBase58() }),
      });
      const invoiceData = await invoiceRes.json();
      if (!invoiceRes.ok) {
        throw new Error(invoiceData.error || 'Failed to create invoice');
      }

      const { transaction, memo, startTime, endTime, amount } = invoiceData;

      setStatus('Approve the transaction in your wallet…');
      const signature = await signAndSendPayment(
        transaction,
        signTransaction,
        connection,
      );

      setStatus('Verifying payment…');
      const verifyRes = await fetch('/api/verify-and-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userWallet: publicKey.toBase58(),
          memo,
          startTime,
          endTime,
          amount,
        }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) {
        throw new Error(verifyData.error || 'Payment verification failed');
      }

      setNumber(verifyData.number);
      setStatus('Payment confirmed.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
      setStatus(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rng-section">
      <h2 className="section-title">PAY TO GENERATE · RNG</h2>
      <p className="section-desc">
        Pay 0.1 SOL to unlock one random number (0–1000). Revenue flows to the Zyra agent. Connect wallet, pay, then generate.
      </p>
      <div className="rng-card card">
        <div className="rng-wallet-row">
          <WalletMultiButton className="rng-wallet-btn" />
        </div>
        {!connected ? (
          <p className="terminal-line rng-status">
            <span className="prompt">$</span> Connect wallet to continue.
          </p>
        ) : (
          <>
            <button
              type="button"
              className="rng-pay-btn"
              onClick={handlePayAndGenerate}
              disabled={loading}
            >
              {loading ? 'Processing…' : 'Pay 0.1 SOL & Generate Number'}
            </button>
            {error && <p className="rng-error">{error}</p>}
            {status && <p className="rng-status">{status}</p>}
            {number !== null && (
              <p className="rng-result">
                <span className="rng-result-label">Output</span>
                <span className="rng-result-value">{number}</span>
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
