export const HOTLINK_IMAGES = {
  logo: "https://lh3.googleusercontent.com/aida/AEtjO1VcP9mXREcK3ObMS538rZ4ZFoPVbvY6SyaTbtxhx0vlPZUfDizCQhysupx5iydFDDH8aBYrdKPXwfXGuhSF828QQW2zn0oonuu2Kw7vEUQBVORoT38N-Tl9ozx_MF8k3VdprAQCY1_2WNrJ6HGSJBpjU9XJ9_jIaC5AzjJ92ptxBhzETM0yYPa8ntXDHulMaX53SNe0FFJ1y4RJz1-mulb9l_PSqfk1eB9_4DSJAIQAsntxYp0FUzjfrZQ",
  profile1:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCA4KZxeSPJIu7ox1sU92gavWL-5LKrYcOlncX9j8o9iqoeM7u-9YbX9iS0LU8iQxWdAepcZuHMqk17o5ixotzJi04tgtPa_ZMOyVO3tEv0np3KCQbDPKPVWmp2hcGl20tFfZdLPURTlWx14Zt926woaEwvv-ZDtavr_bIBd2mcImG-_a92F-LKu9LoPrp7PV8dBy6t9AJNogV6R_AX2hebUkj5pp5Z2rHhbb2H7D0-co-_MOMmqdoD",
  profile2:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuChfxO5E9ru17o0TmxcTBbLHPl4O8mJvZLAk1waQXI0L6Wu_G2pAvttpiY9C_5C83GUxvlNhF4jgkzp-qGODvwK0DVOmvDW_Lkkjncv2F5bvlbaLFn7ZH414mP1p01_KT_9VAPn_ipiB_KIIHLA2EgSVuJN0Hv022ztopwayReKch1XpnosxTh54dYbcTYPSfza745uySCa9RsKD2VcgmjYBfLGfYbfD8JEhV3ipPBQP0fTmTNmMTYc",
  profile3:
    "https://lh3.googleusercontent.com/aida/AEtjO1XSsgbTxAgE6kDis35G38lSr5A24Xs7U6z7pUW-0g42ZRipnNVpxUF3fpzLat4ES4P6eR3DKExMXv99IduBdnFIjyKvR8EC64hPQ3Nr9odKMldoOx_MWblqFEKH4zpVLUMcBledJm6u17eO1cen4fbGFMuMIJiC2WaKy8R3EhXaBi6Tr41-4S6xA5vTHrj9AIPDLVjF1CYgzxCDkEz1OSItfg3vXqMjbnxUFP2cYFnhd7sj9B6N8we-AhI",
};

export type ChartPeriod = "1일" | "1주" | "1개월" | "3개월" | "1년" | "전체";

export interface StockPeriodChart {
  high: number;
  low: number;
  linePath: string;
  areaPath: string;
  endY: number;
  volumes: number[];
  timeLabels: [string, string, string];
}

export interface StockItem {
  id: string;
  code: string;
  name: string;
  shortLabel: string;
  market: string;
  sector: string;
  price: number;
  changeAmount: number;
  changePercent: number;
  volume: number;
  tradingValueText: string;
  tradingValueNumeric: number; // in 억
  summaryLine: string;
  tags: string[];
  themes: string[];
  discoveryCategories: string[];
  watchlistGroups: string[];
  marketCap: string;
  week52HighLow: string;
  per: string;
  pbr: string;
  foreignOwnership: string;
  foreignOwnershipDelta: string;
  sparklinePath: string;
  sparklineArea: string;
  isFavorite: boolean;
  alertEnabled: boolean;
  targetAlertPrice?: number;
  charts: Record<ChartPeriod, StockPeriodChart>;
}

export interface HoldingItem {
  stockId: string;
  quantity: number;
  avgBuyPrice: number;
}

export interface OrderRecord {
  id: string;
  stockId: string;
  stockName: string;
  stockCode: string;
  type: "buy" | "sell";
  orderType: "지정가" | "시장가";
  price: number;
  quantity: number;
  totalAmount: number;
  status: "체결완료" | "미체결" | "취소됨";
  timestamp: string;
}

export interface MarketIndex {
  id: string;
  name: string;
  value: string;
  changePercent: string;
  changePoints: string;
  isUp: boolean;
  svgPath: string;
  description: string;
}

export interface InsightItem {
  id: string;
  badge: string;
  timeAndSource: string;
  title: string;
  summary: string;
  relatedThemeTitle: string;
  relatedStocksText: string;
  relatedThemeFilter: string;
  bookmarked: boolean;
  fullContent: string;
}

const DEFAULT_CHARTS_UP: Record<ChartPeriod, StockPeriodChart> = {
  "1일": {
    high: 79100,
    low: 77400,
    linePath: "M 0 105 C 40 100, 75 92, 110 80 C 150 65, 190 72, 235 48 C 275 30, 295 35, 320 26",
    areaPath:
      "M 0 105 C 40 100, 75 92, 110 80 C 150 65, 190 72, 235 48 C 275 30, 295 35, 320 26 L 320 140 L 0 140 Z",
    endY: 26,
    volumes: [35, 50, 42, 65, 55, 78, 88, 100],
    timeLabels: ["09:00", "12:00", "15:30"],
  },
  "1주": {
    high: 79400,
    low: 76200,
    linePath: "M 0 118 C 35 102, 70 108, 105 84 C 145 60, 185 74, 225 46 C 265 25, 290 38, 320 28",
    areaPath:
      "M 0 118 C 35 102, 70 108, 105 84 C 145 60, 185 74, 225 46 C 265 25, 290 38, 320 28 L 320 140 L 0 140 Z",
    endY: 28,
    volumes: [40, 38, 55, 48, 70, 62, 85, 95],
    timeLabels: ["월요일", "수요일", "금요일"],
  },
  "1개월": {
    high: 79200,
    low: 77100,
    linePath: "M 0 110 C 35 115, 60 85, 95 90 C 130 95, 160 50, 200 65 C 240 80, 270 20, 320 30",
    areaPath:
      "M 0 110 C 35 115, 60 85, 95 90 C 130 95, 160 50, 200 65 C 240 80, 270 20, 320 30 L 320 140 L 0 140 Z",
    endY: 30,
    volumes: [30, 45, 40, 60, 50, 75, 90, 100],
    timeLabels: ["09:00", "12:00", "15:30"],
  },
  "3개월": {
    high: 83500,
    low: 71800,
    linePath: "M 0 95 C 45 115, 85 105, 120 75 C 155 45, 195 60, 240 35 C 275 18, 295 25, 320 22",
    areaPath:
      "M 0 95 C 45 115, 85 105, 120 75 C 155 45, 195 60, 240 35 C 275 18, 295 25, 320 22 L 320 140 L 0 140 Z",
    endY: 22,
    volumes: [50, 42, 68, 54, 60, 82, 76, 94],
    timeLabels: ["7월", "8월", "9월"],
  },
  "1년": {
    high: 86000,
    low: 65800,
    linePath: "M 0 125 C 50 110, 90 80, 135 88 C 180 95, 210 40, 255 45 C 285 48, 300 28, 320 24",
    areaPath:
      "M 0 125 C 50 110, 90 80, 135 88 C 180 95, 210 40, 255 45 C 285 48, 300 28, 320 24 L 320 140 L 0 140 Z",
    endY: 24,
    volumes: [45, 60, 52, 75, 68, 80, 85, 98],
    timeLabels: ["2025.10", "2026.04", "2026.09"],
  },
  "전체": {
    high: 96800,
    low: 42300,
    linePath: "M 0 132 C 45 120, 95 95, 140 70 C 185 45, 225 68, 265 38 C 290 24, 305 22, 320 18",
    areaPath:
      "M 0 132 C 45 120, 95 95, 140 70 C 185 45, 225 68, 265 38 C 290 24, 305 22, 320 18 L 320 140 L 0 140 Z",
    endY: 18,
    volumes: [25, 40, 58, 72, 64, 85, 92, 100],
    timeLabels: ["2020", "2023", "2026"],
  },
};

export const INITIAL_MARKET_INDICES: MarketIndex[] = [
  {
    id: "kospi",
    name: "코스피",
    value: "2,684.50",
    changePercent: "0.82%",
    changePoints: "+21.84",
    isUp: true,
    svgPath: "M1 17L18 13L32 15L48 7L67 3",
    description: "외국인·기관 동반 순매수에 힘입어 반도체 및 자동차 대형주 강세 마감",
  },
  {
    id: "kosdaq",
    name: "코스닥",
    value: "865.12",
    changePercent: "1.45%",
    changePoints: "+12.38",
    isUp: true,
    svgPath: "M1 18L19 12L34 14L49 6L67 2",
    description: "바이오 대장주 및 AI 소부장 강세로 860선 안착",
  },
  {
    id: "sp500",
    name: "S&P 500",
    value: "5,117.09",
    changePercent: "0.24%",
    changePoints: "-12.31",
    isUp: false,
    svgPath: "M1 4L18 8L35 6L50 14L67 17",
    description: "미 국채 금리 소폭 반등 속 차익실현 매물 출회",
  },
  {
    id: "nasdaq",
    name: "나스닥 종합",
    value: "16,177.77",
    changePercent: "0.16%",
    changePoints: "+25.80",
    isUp: true,
    svgPath: "M1 14L22 15L40 9L67 5",
    description: "엔비디아 및 AI 인프라 관련주 견조한 흐름 지속",
  },
];

export const INITIAL_STOCKS: StockItem[] = [
  {
    id: "005930",
    code: "005930",
    name: "삼성전자",
    shortLabel: "삼",
    market: "코스피",
    sector: "코스피 대형주 · 전기전자",
    price: 78900,
    changeAmount: 2200,
    changePercent: 2.87,
    volume: 14892104,
    tradingValueText: "거래대금 8,420억",
    tradingValueNumeric: 8420,
    summaryLine: "차세대 AI 메모리 수주 확대 기대",
    tags: ["코스피 1위", "배당수익률 2.1%", "반도체 대표주"],
    themes: ["온디바이스AI", "차세대 SMR"],
    discoveryCategories: ["전체", "인기 검색", "거래대금 TOP", "고배당주"],
    watchlistGroups: ["기본 그룹", "AI & 반도체", "배당성장주"],
    marketCap: "471조 120억",
    week52HighLow: "86,000 / 65,800",
    per: "14.8배",
    pbr: "1.32배",
    foreignOwnership: "55.4%",
    foreignOwnershipDelta: "+0.12%",
    sparklinePath: "M 0 20 L 15 17 L 30 14 L 45 8 L 60 5",
    sparklineArea: "M 0 20 L 15 17 L 30 14 L 45 8 L 60 5 L 60 24 L 0 24 Z",
    isFavorite: true,
    alertEnabled: true,
    targetAlertPrice: 82000,
    charts: DEFAULT_CHARTS_UP,
  },
  {
    id: "000660",
    code: "000660",
    name: "SK하이닉스",
    shortLabel: "SK",
    market: "코스피",
    sector: "코스피 대형주 · 전기전자",
    price: 182500,
    changeAmount: 8000,
    changePercent: 4.58,
    volume: 6120400,
    tradingValueText: "거래대금 6,190억",
    tradingValueNumeric: 6190,
    summaryLine: "HBM3E 양산 호조 · 외인 대량순매수",
    tags: ["코스피 2위", "HBM 글로벌 1위", "AI 반도체 핵심"],
    themes: ["온디바이스AI"],
    discoveryCategories: ["전체", "인기 검색", "급상승 🔥", "거래대금 TOP", "52주 신고가"],
    watchlistGroups: ["기본 그룹", "AI & 반도체"],
    marketCap: "132조 8,600억",
    week52HighLow: "248,500 / 112,000",
    per: "21.4배",
    pbr: "2.15배",
    foreignOwnership: "54.8%",
    foreignOwnershipDelta: "+0.45%",
    sparklinePath: "M 0 18 L 12 16 L 24 20 L 36 10 L 48 12 L 60 2",
    sparklineArea: "M 0 18 L 12 16 L 24 20 L 36 10 L 48 12 L 60 2 L 60 24 L 0 24 Z",
    isFavorite: true,
    alertEnabled: true,
    targetAlertPrice: 195000,
    charts: {
      ...DEFAULT_CHARTS_UP,
      "1개월": {
        high: 186000,
        low: 168500,
        linePath: "M 0 115 C 30 110, 65 95, 100 82 C 135 70, 170 58, 210 52 C 250 45, 280 28, 320 22",
        areaPath:
          "M 0 115 C 30 110, 65 95, 100 82 C 135 70, 170 58, 210 52 C 250 45, 280 28, 320 22 L 320 140 L 0 140 Z",
        endY: 22,
        volumes: [35, 48, 52, 64, 58, 82, 94, 100],
        timeLabels: ["09:00", "12:00", "15:30"],
      },
    },
  },
  {
    id: "196170",
    code: "코스닥",
    name: "알테오젠",
    shortLabel: "알",
    market: "코스닥",
    sector: "코스닥 우량주 · 제약/바이오",
    price: 194000,
    changeAmount: 12900,
    changePercent: 7.12,
    volume: 4820000,
    tradingValueText: "거래대금 4,210억",
    tradingValueNumeric: 4210,
    summaryLine: "거래량 482만주 · 키트루다SC 독점",
    tags: ["코스닥 시총 상위", "글로벌 기술수출", "바이오 대장"],
    themes: ["온디바이스AI"],
    discoveryCategories: ["전체", "급상승 🔥", "거래대금 TOP", "52주 신고가"],
    watchlistGroups: ["기본 그룹"],
    marketCap: "10조 3,100억",
    week52HighLow: "215,000 / 64,500",
    per: "68.2배",
    pbr: "12.40배",
    foreignOwnership: "16.2%",
    foreignOwnershipDelta: "+0.81%",
    sparklinePath: "M 0 21 L 14 19 L 28 15 L 42 9 L 60 3",
    sparklineArea: "M 0 21 L 14 19 L 28 15 L 42 9 L 60 3 L 60 24 L 0 24 Z",
    isFavorite: false,
    alertEnabled: false,
    charts: {
      ...DEFAULT_CHARTS_UP,
      "1개월": {
        high: 198500,
        low: 171000,
        linePath: "M 0 120 C 40 112, 75 98, 110 85 C 145 72, 180 60, 220 42 C 260 25, 290 22, 320 18",
        areaPath:
          "M 0 120 C 40 112, 75 98, 110 85 C 145 72, 180 60, 220 42 C 260 25, 290 22, 320 18 L 320 140 L 0 140 Z",
        endY: 18,
        volumes: [28, 35, 48, 62, 70, 85, 92, 100],
        timeLabels: ["09:00", "12:00", "15:30"],
      },
    },
  },
  {
    id: "005380",
    code: "005380",
    name: "현대차",
    shortLabel: "현",
    market: "코스피",
    sector: "코스피 대형주 · 운수장비",
    price: 245000,
    changeAmount: 4500,
    changePercent: 1.87,
    volume: 1892300,
    tradingValueText: "거래대금 3,120억",
    tradingValueNumeric: 3120,
    summaryLine: "북미 하이브리드 판매 호조 및 자사주 소각 기대",
    tags: ["밸류업 대표주", "배당수익률 4.6%", "글로벌 모빌리티"],
    themes: ["휴머노이드 로봇", "2차전지"],
    discoveryCategories: ["전체", "인기 검색", "고배당주"],
    watchlistGroups: ["기본 그룹", "배당성장주"],
    marketCap: "51조 3,800억",
    week52HighLow: "299,500 / 178,000",
    per: "5.4배",
    pbr: "0.64배",
    foreignOwnership: "40.2%",
    foreignOwnershipDelta: "+0.18%",
    sparklinePath: "M 0 16 L 15 18 L 30 11 L 45 13 L 60 7",
    sparklineArea: "M 0 16 L 15 18 L 30 11 L 45 13 L 60 7 L 60 24 L 0 24 Z",
    isFavorite: true,
    alertEnabled: true,
    targetAlertPrice: 260000,
    charts: {
      ...DEFAULT_CHARTS_UP,
      "1개월": {
        high: 252000,
        low: 236500,
        linePath: "M 0 105 C 35 108, 70 90, 105 92 C 140 94, 175 62, 215 68 C 255 74, 285 38, 320 34",
        areaPath:
          "M 0 105 C 35 108, 70 90, 105 92 C 140 94, 175 62, 215 68 C 255 74, 285 38, 320 34 L 320 140 L 0 140 Z",
        endY: 34,
        volumes: [40, 52, 48, 60, 55, 70, 82, 90],
        timeLabels: ["09:00", "12:00", "15:30"],
      },
    },
  },
  {
    id: "247540",
    code: "247540",
    name: "에코프로비엠",
    shortLabel: "에",
    market: "코스닥",
    sector: "코스닥 대형주 · 2차전지 소재",
    price: 215000,
    changeAmount: -5400,
    changePercent: -2.45,
    volume: 1240900,
    tradingValueText: "거래대금 2,680억",
    tradingValueNumeric: 2680,
    summaryLine: "양극재 출하량 전망 조정 속 저가 매수세 유입",
    tags: ["코스닥 대장주", "양극재 글로벌 선두", "2차전지 핵심"],
    themes: ["2차전지"],
    discoveryCategories: ["전체", "인기 검색", "거래대금 TOP"],
    watchlistGroups: ["기본 그룹"],
    marketCap: "21조 280억",
    week52HighLow: "352,000 / 189,000",
    per: "82.1배",
    pbr: "11.20배",
    foreignOwnership: "12.8%",
    foreignOwnershipDelta: "-0.24%",
    sparklinePath: "M 0 5 L 16 7 L 30 17 L 44 14 L 60 21",
    sparklineArea: "M 0 5 L 16 7 L 30 17 L 44 14 L 60 21 L 60 24 L 0 24 Z",
    isFavorite: true,
    alertEnabled: false,
    charts: {
      ...DEFAULT_CHARTS_UP,
      "1개월": {
        high: 229000,
        low: 211500,
        linePath: "M 0 35 C 35 42, 70 65, 105 58 C 140 52, 175 88, 215 82 C 255 76, 285 102, 320 108",
        areaPath:
          "M 0 35 C 35 42, 70 65, 105 58 C 140 52, 175 88, 215 82 C 255 76, 285 102, 320 108 L 320 140 L 0 140 Z",
        endY: 108,
        volumes: [65, 58, 72, 48, 52, 60, 75, 84],
        timeLabels: ["09:00", "12:00", "15:30"],
      },
    },
  },
  {
    id: "035720",
    code: "035720",
    name: "카카오",
    shortLabel: "카",
    market: "코스피",
    sector: "코스피 대형주 · 서비스업",
    price: 48200,
    changeAmount: -600,
    changePercent: -1.23,
    volume: 2940100,
    tradingValueText: "거래대금 1,850억",
    tradingValueNumeric: 1850,
    summaryLine: "AI 카나나 서비스 공개 앞두고 플랫폼 수익성 점검",
    tags: ["플랫폼 대표주", "AI 에이전트", "모바일 생태계"],
    themes: ["온디바이스AI"],
    discoveryCategories: ["전체", "거래대금 TOP"],
    watchlistGroups: [],
    marketCap: "21조 4,100억",
    week52HighLow: "61,800 / 37,300",
    per: "34.2배",
    pbr: "1.85배",
    foreignOwnership: "26.4%",
    foreignOwnershipDelta: "-0.09%",
    sparklinePath: "M 0 6 L 15 9 L 30 14 L 45 12 L 60 19",
    sparklineArea: "M 0 6 L 15 9 L 30 14 L 45 12 L 60 19 L 60 24 L 0 24 Z",
    isFavorite: false,
    alertEnabled: false,
    charts: DEFAULT_CHARTS_UP,
  },
  {
    id: "068270",
    code: "068270",
    name: "셀트리온",
    shortLabel: "셀",
    market: "코스피",
    sector: "코스피 대형주 · 의약품",
    price: 189400,
    changeAmount: 2000,
    changePercent: 1.07,
    volume: 1105400,
    tradingValueText: "거래대금 2,100억",
    tradingValueNumeric: 2100,
    summaryLine: "짐펜트라 미국 처방 확대 및 바이오시밀러 점유율 상승",
    tags: ["바이오 대표주", "자사주 매입", "미국 직판 확대"],
    themes: ["차세대 SMR"],
    discoveryCategories: ["전체", "거래대금 TOP", "고배당주"],
    watchlistGroups: ["기본 그룹"],
    marketCap: "41조 1,200억",
    week52HighLow: "205,000 / 142,100",
    per: "39.5배",
    pbr: "2.41배",
    foreignOwnership: "21.3%",
    foreignOwnershipDelta: "+0.15%",
    sparklinePath: "M 0 18 L 15 15 L 30 16 L 45 10 L 60 8",
    sparklineArea: "M 0 18 L 15 15 L 30 16 L 45 10 L 60 8 L 60 24 L 0 24 Z",
    isFavorite: false,
    alertEnabled: false,
    charts: DEFAULT_CHARTS_UP,
  },
  {
    id: "042700",
    code: "042700",
    name: "한미반도체",
    shortLabel: "한",
    market: "코스피",
    sector: "코스피 중대형주 · 반도체장비",
    price: 142300,
    changeAmount: 6800,
    changePercent: 5.02,
    volume: 3412000,
    tradingValueText: "거래대금 3,890억",
    tradingValueNumeric: 3890,
    summaryLine: "HBM 필수 공정 TC본더 글로벌 독점 공급 모멘텀",
    tags: ["TC본더 세계 1위", "AI 반도체 장비", "고성장주"],
    themes: ["온디바이스AI"],
    discoveryCategories: ["전체", "인기 검색", "급상승 🔥", "52주 신고가"],
    watchlistGroups: ["AI & 반도체"],
    marketCap: "13조 8,400억",
    week52HighLow: "196,200 / 51,200",
    per: "44.1배",
    pbr: "18.20배",
    foreignOwnership: "14.9%",
    foreignOwnershipDelta: "+0.62%",
    sparklinePath: "M 0 20 L 15 16 L 30 12 L 45 7 L 60 3",
    sparklineArea: "M 0 20 L 15 16 L 30 12 L 45 7 L 60 3 L 60 24 L 0 24 Z",
    isFavorite: true,
    alertEnabled: false,
    charts: DEFAULT_CHARTS_UP,
  },
  {
    id: "000270",
    code: "000270",
    name: "기아",
    shortLabel: "기",
    market: "코스피",
    sector: "코스피 대형주 · 운수장비",
    price: 118500,
    changeAmount: 2400,
    changePercent: 2.07,
    volume: 2150800,
    tradingValueText: "거래대금 2,540억",
    tradingValueNumeric: 2540,
    summaryLine: "EV3 글로벌 흥행 및 고배당 주주환원 정책 강화",
    tags: ["고배당 대표주", "배당수익률 5.4%", "영업이익률 1위"],
    themes: ["2차전지", "휴머노이드 로봇"],
    discoveryCategories: ["전체", "인기 검색", "고배당주"],
    watchlistGroups: ["배당성장주"],
    marketCap: "47조 6,200억",
    week52HighLow: "135,000 / 78,200",
    per: "4.8배",
    pbr: "0.89배",
    foreignOwnership: "39.8%",
    foreignOwnershipDelta: "+0.22%",
    sparklinePath: "M 0 19 L 15 16 L 30 14 L 45 9 L 60 6",
    sparklineArea: "M 0 19 L 15 16 L 30 14 L 45 9 L 60 6 L 60 24 L 0 24 Z",
    isFavorite: false,
    alertEnabled: false,
    charts: DEFAULT_CHARTS_UP,
  },
  {
    id: "NVDA",
    code: "NVDA",
    name: "엔비디아",
    shortLabel: "NV",
    market: "NASDAQ",
    sector: "나스닥 대형주 · AI 반도체",
    price: 168400,
    changeAmount: 5200,
    changePercent: 3.19,
    volume: 42180000,
    tradingValueText: "거래대금 9,850억",
    tradingValueNumeric: 9850,
    summaryLine: "블랙웰 아키텍처 데이터센터 수요 폭발적 증가",
    tags: ["글로벌 시총 1위권", "AI 가속기 독점", "서학개미 1위"],
    themes: ["온디바이스AI", "휴머노이드 로봇"],
    discoveryCategories: ["전체", "인기 검색", "급상승 🔥", "52주 신고가"],
    watchlistGroups: ["AI & 반도체"],
    marketCap: "4,120조",
    week52HighLow: "189,000 / 98,500",
    per: "48.5배",
    pbr: "42.10배",
    foreignOwnership: "68.4%",
    foreignOwnershipDelta: "+0.35%",
    sparklinePath: "M 0 21 L 15 18 L 30 12 L 45 8 L 60 2",
    sparklineArea: "M 0 21 L 15 18 L 30 12 L 45 8 L 60 2 L 60 24 L 0 24 Z",
    isFavorite: true,
    alertEnabled: false,
    charts: DEFAULT_CHARTS_UP,
  },
  {
    id: "086520",
    code: "086520",
    name: "에코프로",
    shortLabel: "에",
    market: "코스닥",
    sector: "코스닥 대형주 · 지주/2차전지",
    price: 94200,
    changeAmount: -1800,
    changePercent: -1.88,
    volume: 1520000,
    tradingValueText: "거래대금 1,430억",
    tradingValueNumeric: 1430,
    summaryLine: "전구체 및 리사이클링 밸류체인 수직계열화",
    tags: ["2차전지 지주사", "배터리 리사이클링"],
    themes: ["2차전지"],
    discoveryCategories: ["전체", "인기 검색"],
    watchlistGroups: [],
    marketCap: "12조 5,400억",
    week52HighLow: "165,000 / 82,100",
    per: "64.0배",
    pbr: "7.80배",
    foreignOwnership: "18.2%",
    foreignOwnershipDelta: "-0.31%",
    sparklinePath: "M 0 6 L 15 10 L 30 15 L 45 14 L 60 20",
    sparklineArea: "M 0 6 L 15 10 L 30 15 L 45 14 L 60 20 L 60 24 L 0 24 Z",
    isFavorite: false,
    alertEnabled: false,
    charts: DEFAULT_CHARTS_UP,
  },
  {
    id: "277810",
    code: "277810",
    name: "레인보우로보틱스",
    shortLabel: "레",
    market: "코스닥",
    sector: "코스닥 우량주 · 로보틱스",
    price: 164800,
    changeAmount: 8400,
    changePercent: 5.37,
    volume: 940000,
    tradingValueText: "거래대금 1,540억",
    tradingValueNumeric: 1540,
    summaryLine: "양팔형 휴머노이드 로봇 산업현장 실증 확대",
    tags: ["삼성전자 지분투자", "휴머노이드 대장", "협동로봇"],
    themes: ["휴머노이드 로봇"],
    discoveryCategories: ["전체", "급상승 🔥"],
    watchlistGroups: [],
    marketCap: "3조 1,900억",
    week52HighLow: "198,000 / 121,000",
    per: "112.0배",
    pbr: "14.50배",
    foreignOwnership: "8.4%",
    foreignOwnershipDelta: "+0.29%",
    sparklinePath: "M 0 19 L 15 17 L 30 11 L 45 8 L 60 3",
    sparklineArea: "M 0 19 L 15 17 L 30 11 L 45 8 L 60 3 L 60 24 L 0 24 Z",
    isFavorite: false,
    alertEnabled: false,
    charts: DEFAULT_CHARTS_UP,
  },
  {
    id: "034020",
    code: "034020",
    name: "두산에너빌리티",
    shortLabel: "두",
    market: "코스피",
    sector: "코스피 대형주 · 에너지/원전",
    price: 21450,
    changeAmount: 1150,
    changePercent: 5.67,
    volume: 8920000,
    tradingValueText: "거래대금 1,910억",
    tradingValueNumeric: 1910,
    summaryLine: "글로벌 빅테크 데이터센터향 SMR 주기기자재 수주 가시화",
    tags: ["SMR 파운드리", "원전 수출 대표주", "AI 전력 인프라"],
    themes: ["차세대 SMR"],
    discoveryCategories: ["전체", "급상승 🔥", "52주 신고가"],
    watchlistGroups: [],
    marketCap: "13조 7,400억",
    week52HighLow: "23,800 / 14,900",
    per: "28.4배",
    pbr: "1.92배",
    foreignOwnership: "23.4%",
    foreignOwnershipDelta: "+0.54%",
    sparklinePath: "M 0 20 L 15 15 L 30 13 L 45 7 L 60 3",
    sparklineArea: "M 0 20 L 15 15 L 30 13 L 45 7 L 60 3 L 60 24 L 0 24 Z",
    isFavorite: false,
    alertEnabled: false,
    charts: DEFAULT_CHARTS_UP,
  },
];

export const INITIAL_HOLDINGS: HoldingItem[] = [
  { stockId: "000660", quantity: 50, avgBuyPrice: 147058 }, // +24.1%
  { stockId: "005930", quantity: 120, avgBuyPrice: 71858 }, // +9.8%
  { stockId: "005380", quantity: 15, avgBuyPrice: 214535 }, // +14.2%
  { stockId: "247540", quantity: 20, avgBuyPrice: 227272 }, // -5.4%
];

export const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: "ORD-20260929-01",
    stockId: "005930",
    stockName: "삼성전자",
    stockCode: "005930",
    type: "buy",
    orderType: "지정가",
    price: 78900,
    quantity: 10,
    totalAmount: 789000,
    status: "체결완료",
    timestamp: "오늘 14:28:15",
  },
  {
    id: "ORD-20260929-02",
    stockId: "000660",
    stockName: "SK하이닉스",
    stockCode: "000660",
    type: "buy",
    orderType: "지정가",
    price: 181000,
    quantity: 5,
    totalAmount: 905000,
    status: "체결완료",
    timestamp: "오늘 11:05:42",
  },
  {
    id: "ORD-20260929-03",
    stockId: "005380",
    stockName: "현대차",
    stockCode: "005380",
    type: "buy",
    orderType: "지정가",
    price: 241000,
    quantity: 3,
    totalAmount: 723000,
    status: "미체결",
    timestamp: "오늘 09:32:10",
  },
];

export const INITIAL_INSIGHTS: InsightItem[] = [
  {
    id: "ins-1",
    badge: "AI 브리핑",
    timeAndSource: "10분 전 · 신한투자증권",
    title: '"반도체 슈퍼사이클 초입"... HBM 글로벌 공급망 확대에 따른 수혜 분석',
    summary:
      "엔비디아 차세대 아키텍처 출시와 맞물려 국내 고대역폭메모리 선두 기업들에 대한 외국인 투자자의 집중 순매수세가 포착되었습니다.",
    relatedThemeTitle: "관련 테마주",
    relatedStocksText: "SK하이닉스, 한미반도체 외 4개",
    relatedThemeFilter: "온디바이스AI",
    bookmarked: false,
    fullContent:
      "글로벌 AI 데이터센터 투자 확대로 HBM3E 및 차세대 HBM4 수주 경쟁이 본격화되고 있습니다. 특히 SK하이닉스와 삼성전자의 선단 공정 수율 안정화, 한미반도체 등 핵심 장비주의 수주 잔고 증가가 맞물리며 외국인 및 기관 수급이 3거래일 연속 반도체 섹터로 집중되고 있습니다.",
  },
  {
    id: "ins-2",
    badge: "밸류업 리포트",
    timeAndSource: "42분 전 · 미래에셋증권",
    title: "자동차·금융주 중심 코리아 밸류업 지수 편입 수혜 및 자사주 소각 모멘텀",
    summary:
      "현대차·기아의 주주환원율 35% 달성 로드맵과 고배당 정책이 부각되며 장기 배당성장 포트폴리오 내 비중 확대가 권고됩니다.",
    relatedThemeTitle: "관련 테마주",
    relatedStocksText: "현대차, 기아 외 3개",
    relatedThemeFilter: "휴머노이드 로봇",
    bookmarked: true,
    fullContent:
      "북미 하이브리드(HEV) 시장 내 점유율 상승으로 역대급 현금흐름을 창출 중인 현대차와 기아가 적극적인 자사주 매입·소각 및 분기 배당을 이어가고 있습니다. 낮은 PER/PBR 밸류에이션 매력이 부각되며 기관 투자가의 순매수가 지속되고 있습니다.",
  },
];

export const SEARCH_RANKING_ITEMS = [
  { rank: 1, name: "엔비디아", code: "NVDA", stockId: "NVDA", isUp: true },
  { rank: 2, name: "삼성전자", code: "005930", stockId: "005930", isUp: true },
  { rank: 3, name: "현대차", code: "005380", stockId: "005380", isUp: true },
  { rank: 4, name: "한미반도체", code: "042700", stockId: "042700", isUp: true },
  { rank: 5, name: "에코프로", code: "086520", stockId: "086520", isUp: false },
  { rank: 6, name: "기아", code: "000270", stockId: "000270", isUp: true },
];
