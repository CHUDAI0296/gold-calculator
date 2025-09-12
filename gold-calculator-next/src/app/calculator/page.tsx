import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Gold Calculator - Calculate Gold Value by Weight and Karat',
  description: 'Calculate the value of your gold items with our easy-to-use calculator. Support for all karat types and weight units with real-time gold prices.',
  alternates: {
    canonical: 'https://www.goldcalculator.click/calculator'
  }
};

'use client';

import { useState, useEffect } from 'react';
import React from 'react';

export default function Calculator() {
  const [goldPrice, setGoldPrice] = useState<number | null>(null);
  const [calculatedValue, setCalculatedValue] = useState<number>(0);

  // 从本地API获取实时金价
  const getGoldPrice = async () => {
    try {
      const response = await fetch('/api/gold-price');
      const data = await response.json();
      return data[0].price;
    } catch (error) {
      console.error('Error fetching gold price:', error);
      return null;
    }
  };

  useEffect(() => {
    getGoldPrice().then(price => setGoldPrice(price));
  }, []);

  // 计算黄金价值
  const calculateValue = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const weight = parseFloat((form.querySelector('#weight') as HTMLInputElement).value);
    const weightUnit = (form.querySelector('#weightUnit') as HTMLSelectElement).value;
    const karat = parseInt((form.querySelector('#karat') as HTMLSelectElement).value);
    const premium = parseFloat((form.querySelector('#premium') as HTMLInputElement).value);

    if (!goldPrice || isNaN(weight)) return;

    // 转换重量到盎司
    let weightInOz = weight;
    if (weightUnit === 'g') {
      weightInOz = weight * 0.03215;
    } else if (weightUnit === 'dwt') {
      weightInOz = weight * 0.05;
    }

    // 计算纯度
    const purity = karat / 24;

    // 计算基础价值
    let value = weightInOz * goldPrice * purity;

    // 应用溢价/折扣
    if (!isNaN(premium)) {
      value = value * (1 + premium / 100);
    }

    setCalculatedValue(value);
  };

  return (
    <React.Fragment>
      <JsonLd type="calculator" />
      <div className="container py-5">
      <h1 className="text-center mb-4">Gold Value Calculator</h1>
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header bg-warning text-dark">
              <h2 className="h5 mb-0">Current Gold Price</h2>
            </div>
            <div className="card-body">
              <div className="price-display text-center">
                <span className="display-4">
                  {goldPrice ? `$${goldPrice.toFixed(2)}` : 'Loading...'}
                </span>
                <p className="text-muted">USD per troy ounce</p>
                <p className="small">Last updated: {new Date().toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header bg-warning text-dark">
              <h2 className="h5 mb-0">Calculator Settings</h2>
            </div>
            <div className="card-body">
              <form id="goldCalculator" onSubmit={calculateValue}>
                <div className="mb-3">
                  <label htmlFor="weight" className="form-label">Weight</label>
                  <div className="input-group">
                    <input type="number" className="form-control" id="weight" placeholder="Enter weight" step="0.01" min="0" required />
                    <select className="form-select" id="weightUnit">
                      <option value="g">Grams</option>
                      <option value="oz">Troy Ounces</option>
                      <option value="dwt">Pennyweight</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="karat" className="form-label">Karat</label>
                  <select className="form-select" id="karat" defaultValue="24">
                    <option value="24">24K (99.9%)</option>
                    <option value="22">22K (91.6%)</option>
                    <option value="18">18K (75.0%)</option>
                    <option value="14">14K (58.5%)</option>
                    <option value="10">10K (41.7%)</option>
                    <option value="9">9K (37.5%)</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="premium" className="form-label">Premium/Discount</label>
                  <div className="input-group">
                    <input type="number" className="form-control" id="premium" placeholder="Enter adjustment" defaultValue="0" />
                    <span className="input-group-text">%</span>
                  </div>
                  <div className="form-text">Use negative values for discounts</div>
                </div>

                <button type="submit" className="btn btn-warning w-100">Calculate Value</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-success text-white">
              <h2 className="h5 mb-0">Results</h2>
            </div>
            <div className="card-body">
              <div className="result-display text-center">
                <h3>Estimated Value</h3>
                <div className="display-4">${calculatedValue.toFixed(2)}</div>
                <p className="text-muted mt-2">Based on current market price</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">
              <h3 className="h5 mb-0">Weight Conversion Table</h3>
            </div>
            <div className="card-body">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>From</th>
                    <th>To</th>
                    <th>Multiply By</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Grams</td>
                    <td>Troy Ounces</td>
                    <td>0.03215</td>
                  </tr>
                  <tr>
                    <td>Grams</td>
                    <td>Pennyweight</td>
                    <td>0.6430</td>
                  </tr>
                  <tr>
                    <td>Troy Ounces</td>
                    <td>Grams</td>
                    <td>31.1035</td>
                  </tr>
                  <tr>
                    <td>Pennyweight</td>
                    <td>Grams</td>
                    <td>1.5552</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">
              <h3 className="h5 mb-0">Karat Purity Guide</h3>
            </div>
            <div className="card-body">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Karat</th>
                    <th>Gold Content</th>
                    <th>Purity</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>24K</td>
                    <td>24/24</td>
                    <td>99.9%</td>
                  </tr>
                  <tr>
                    <td>22K</td>
                    <td>22/24</td>
                    <td>91.6%</td>
                  </tr>
                  <tr>
                    <td>18K</td>
                    <td>18/24</td>
                    <td>75.0%</td>
                  </tr>
                  <tr>
                    <td>14K</td>
                    <td>14/24</td>
                    <td>58.5%</td>
                  </tr>
                  <tr>
                    <td>10K</td>
                    <td>10/24</td>
                    <td>41.7%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    </React.Fragment>
  );
}