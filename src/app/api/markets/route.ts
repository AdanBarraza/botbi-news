import { NextResponse } from "next/server";

export const runtime = "nodejs";

const WATCHLIST = [
  { symbol: "AAPL", name: "Apple" },
  { symbol: "MSFT", name: "Microsoft" },
  { symbol: "NVDA", name: "NVIDIA" },
  { symbol: "AMZN", name: "Amazon" },
  { symbol: "GOOGL", name: "Alphabet" },
  { symbol: "META", name: "Meta" },
  { symbol: "TSLA", name: "Tesla" },
  { symbol: "BRK.B", name: "Berkshire Hathaway" },
  { symbol: "AVGO", name: "Broadcom" },
  { symbol: "JPM", name: "JPMorgan Chase" },
];

async function obtenerAccionesFinnhub() {
  const key = process.env.FINNHUB_API_KEY;
  if (!key) {
    // Sin key, devolvemos solo nombres (fallback)
    return WATCHLIST.map((s) => ({ ...s, price: 0, changePct: 0 }));
  }

  const results = await Promise.all(
    WATCHLIST.map(async (s) => {
      // Finnhub quote: c=current, pc=prev close
      const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(s.symbol)}&token=${key}`;
      const r = await fetch(url, { cache: "no-store" });
      if (!r.ok) return { ...s, price: 0, changePct: 0 };

      const q = await r.json();
      const price = Number(q.c ?? 0);
      const prevClose = Number(q.pc ?? 0);
      const changePct = prevClose > 0 ? ((price - prevClose) / prevClose) * 100 : 0;

      return { ...s, price, changePct };
    })
  );

  return results;
}

async function obtenerCriptoCoinGecko() {
  const cryptoRes = await fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h",
    { cache: "no-store" }
  );

  if (!cryptoRes.ok) {
    const t = await cryptoRes.text();
    throw new Error(`Crypto API failed: ${t.slice(0, 200)}`);
  }

  const cryptoJson = (await cryptoRes.json()) as any[];
  return cryptoJson.map((c) => ({
    symbol: String(c.symbol || "").toUpperCase(),
    name: String(c.name || ""),
    priceUsd: Number(c.current_price ?? 0),
    changePct24h: Number(c.price_change_percentage_24h ?? 0),
  }));
}

export async function GET() {
  try {
    const [topAcciones, topCripto] = await Promise.all([
      obtenerAccionesFinnhub(),
      obtenerCriptoCoinGecko(),
    ]);

    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      topAcciones,
      topCripto,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unknown error" }, { status: 502 });
  }
}