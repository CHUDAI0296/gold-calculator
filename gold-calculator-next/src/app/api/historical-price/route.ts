import { NextResponse } from 'next/server';

const METALS_API_URL = 'https://api.metals.live/v1/spot/gold/historical';
const CACHE_TIME = 3600; // 1小时缓存

interface CacheData {
  [key: string]: {
    data: any;
    timestamp: number;
  };
}

const cache: CacheData = {};

async function fetchHistoricalData(period: string) {
  const now = Date.now();
  const cacheKey = `historical_${period}`;

  // 检查缓存
  if (cache[cacheKey] && (now - cache[cacheKey].timestamp) < CACHE_TIME * 1000) {
    return cache[cacheKey].data;
  }

  try {
    const response = await fetch(`${METALS_API_URL}/${period}`);
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // 更新缓存
    cache[cacheKey] = {
      data,
      timestamp: now
    };

    return data;
  } catch (error) {
    console.error(`Error fetching historical data for period ${period}:`, error);
    throw error;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || '1m'; // 默认获取1个月数据

  // 验证period参数
  const validPeriods = ['1d', '1w', '1m', '1y'];
  if (!validPeriods.includes(period)) {
    return NextResponse.json(
      { error: 'Invalid period parameter. Valid values are: 1d, 1w, 1m, 1y' },
      { status: 400 }
    );
  }

  try {
    const data = await fetchHistoricalData(period);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch historical price data' },
      { status: 500 }
    );
  }
}