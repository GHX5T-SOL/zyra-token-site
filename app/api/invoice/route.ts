import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { PumpAgent } from '@pump-fun/agent-payments-sdk';
import { NextResponse } from 'next/server';

const AGENT_MINT = process.env.AGENT_TOKEN_MINT_ADDRESS!;
const CURRENCY_MINT = process.env.CURRENCY_MINT!;
const SOLANA_RPC = process.env.SOLANA_RPC_URL!;
const PRICE_LAMPORTS = process.env.PRICE_LAMPORTS || '100000000'; // 0.1 SOL

function generateInvoiceParams() {
  const memo = String(
    Math.floor(Math.random() * 900000000000) + 100000,
  );
  const now = Math.floor(Date.now() / 1000);
  const startTime = String(now);
  const endTime = String(now + 86400);
  return { amount: PRICE_LAMPORTS, memo, startTime, endTime };
}

export async function POST(req: Request) {
  try {
    const { userWallet } = (await req.json()) as { userWallet: string };
    if (!userWallet) {
      return NextResponse.json(
        { error: 'Missing userWallet' },
        { status: 400 },
      );
    }

    if (!AGENT_MINT || !CURRENCY_MINT || !SOLANA_RPC) {
      return NextResponse.json(
        { error: 'Server misconfigured: missing env' },
        { status: 500 },
      );
    }

    const connection = new Connection(SOLANA_RPC);
    const agentMint = new PublicKey(AGENT_MINT);
    const currencyMint = new PublicKey(CURRENCY_MINT);
    const agent = new PumpAgent(agentMint, 'mainnet', connection);
    const userPublicKey = new PublicKey(userWallet);

    const { amount, memo, startTime, endTime } = generateInvoiceParams();
    const numAmount = Number(amount);
    if (numAmount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 },
      );
    }

    const instructions = await agent.buildAcceptPaymentInstructions({
      user: userPublicKey,
      currencyMint,
      amount,
      memo,
      startTime,
      endTime,
      computeUnitPrice: 100_000,
    });

    const { blockhash } = await connection.getLatestBlockhash('confirmed');
    const tx = new Transaction();
    tx.recentBlockhash = blockhash;
    tx.feePayer = userPublicKey;
    tx.add(...instructions);

    const serialized = tx
      .serialize({ requireAllSignatures: false })
      .toString('base64');

    return NextResponse.json({
      transaction: serialized,
      memo,
      startTime,
      endTime,
      amount: numAmount,
    });
  } catch (e) {
    console.error('Invoice error:', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Invoice failed' },
      { status: 500 },
    );
  }
}
