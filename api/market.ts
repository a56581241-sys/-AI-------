import type { IncomingMessage, ServerResponse } from "http";

export default function handler(
  req: IncomingMessage & { method?: string },
  res: ServerResponse & {
    status?: (code: number) => any;
    json?: (body: any) => any;
  }
) {
  const payload = {
    status: "ok",
    service: "StockNow Vercel API",
    marketStatus: "실시간 장중",
    updatedAt: new Date().toISOString(),
    indices: [
      { id: "kospi", name: "코스피", value: "2,684.50", change: "+0.82%" },
      { id: "kosdaq", name: "코스닥", value: "865.12", change: "+1.45%" },
      { id: "sp500", name: "S&P 500", value: "5,117.09", change: "-0.24%" },
      { id: "nasdaq", name: "나스닥 종합", value: "16,177.77", change: "+0.16%" },
    ],
  };

  if (typeof res.status === "function" && typeof res.json === "function") {
    return res.status(200).json(payload);
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}
