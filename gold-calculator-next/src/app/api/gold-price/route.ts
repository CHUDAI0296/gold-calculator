import { NextResponse } from 'next/server';

const METALS_API_URL = 'https://api.metals.live/v1/spot/gold';
const CACHE_TIME = 300; // 5分钟缓存

let cachedData: any = null;
let lastFetchTime = 0;

async function fetchGoldPrice() {
  const now = Date.now();
  
  // 如果缓存有效，返回缓存数据
  if (cachedData && (now - lastFetchTime) < CACHE_TIME * 1000) {
    return cachedData;
  }

  try {
    const response = await fetch(METALS_API_URL);
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // 更新缓存
    cachedData = data;
    lastFetchTime = now;
    
    return data;
  } catch (error) {
    console.error('Error fetching gold price:', error);
    throw error;
  }
}

export async function GET() {
  try {
    const data = await fetchGoldPrice();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch gold price data' },
      { status: 500 }
    );
  }
}