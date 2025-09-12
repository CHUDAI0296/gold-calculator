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
    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error('Invalid data format from API');
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in gold price API:', error);
    // 返回模拟数据作为备份
    return NextResponse.json([{
      price: 2000.00,
      timestamp: Date.now()
    }]);
  }
}