import { PublicKey } from '@solana/web3.js';
import { PumpAgent } from '@pump-fun/agent-payments-sdk';
import { NextResponse } from 'next/server';

const AGENT_MINT = process.env.AGENT_TOKEN_MINT_ADDRESS!;
const CURRENCY_MINT = process.env.CURRENCY_MINT!;

async function verifyPayment(params: {
  user: string;
  amount: number;
  memo: number;
  startTime: number;
  endTime: number;
}): Promise<boolean> {
  const agentMint = new PublicKey(AGENT_MINT);
  const agent = new PumpAgent(agentMint);

  const invoiceParams = {
    user: new PublicKey(params.user),
    currencyMint: new PublicKey(CURRENCY_MINT),
    amount: params.amount,
    memo: params.memo,
    startTime: params.startTime,
    endTime: params.endTime,
  };

  for (let attempt = 0; attempt < 10; attempt++) {
    const verified = await agent.validateInvoicePayment(invoiceParams);
    if (verified) return true;
    await new Promise((r) => setTimeout(r, 2000));
  }

  return false;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      userWallet: string;
      memo: string;
      startTime: string;
      endTime: string;
      amount: number;
    };

    const { userWallet, memo, startTime, endTime, amount } = body;
    if (
      !userWallet ||
      memo === undefined ||
      startTime === undefined ||
      endTime === undefined ||
      amount === undefined
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    if (!AGENT_MINT || !CURRENCY_MINT) {
      return NextResponse.json(
        { error: 'Server misconfigured' },
        { status: 500 },
      );
    }

    const paid = await verifyPayment({
      user: userWallet,
      amount,
      memo: Number(memo),
      startTime: Number(startTime),
      endTime: Number(endTime),
    });

    if (!paid) {
      return NextResponse.json(
        { error: 'Payment not verified. Try again after confirmation.' },
        { status: 402 },
      );
    }

    const number = Math.floor(Math.random() * 1001);

    return NextResponse.json({ number });
  } catch (e) {
    console.error('Verify/generate error:', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Verification failed' },
      { status: 500 },
    );
  }
}
