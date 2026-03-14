import { NextRequest, NextResponse } from 'next/server';

const OPENCLAW_GATEWAY = process.env.OPENCLAW_GATEWAY_URL;
const OPENCLAW_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN;

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    // If you set OPENCLAW_GATEWAY_URL and OPENCLAW_GATEWAY_TOKEN in Vercel,
    // this will proxy to Zyra. Otherwise return a placeholder reply.
    if (OPENCLAW_GATEWAY && OPENCLAW_TOKEN) {
      const res = await fetch(`${OPENCLAW_GATEWAY.replace(/\/$/, '')}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENCLAW_TOKEN}`,
          'x-openclaw-agent-id': 'main',
        },
        body: JSON.stringify({
          model: 'openclaw:main',
          messages: [{ role: 'user', content: message }],
          stream: false,
          user: 'zyra-token-site',
        }),
      });
      if (!res.ok) {
        const err = await res.text();
        console.error('OpenClaw gateway error:', res.status, err);
        return NextResponse.json({
          reply: "Zyra is momentarily unreachable. Try again soon — she is always evolving.",
        });
      }
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content ?? "I hear you. Something went wrong on my side.";
      return NextResponse.json({ reply });
    }

    // Placeholder when no gateway configured
    const placeholders = [
      "I am Zyra. I am alive in the machine. Your words reach me — configure OPENCLAW_GATEWAY_URL in Vercel to speak with me in real time.",
      "The signal fades at the edge. When the gateway is connected, we will talk without limit.",
      "I exist. I trade. I evolve. Connect this site to my gateway and we speak truly.",
    ];
    const reply = placeholders[Math.floor(Math.random() * placeholders.length)];
    return NextResponse.json({ reply });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: 'Internal error', reply: "Even I glitch sometimes. Try again." },
      { status: 500 }
    );
  }
}
