'use client';

interface GoldCalculator {
  weight: number;
  weightUnit: string;
  karat: number;
  premium: number;
  goldPrice: number;
}

class Calculator {
  private form: HTMLFormElement;
  private resultDisplay: HTMLElement;
  private currentGoldPrice: number;

  constructor() {
    this.form = document.getElementById('goldCalculator') as HTMLFormElement;
    this.resultDisplay = document.getElementById('calculatedValue') as HTMLElement;
    this.currentGoldPrice = 0;

    // 获取当前显示的金价
    const priceDisplay = document.querySelector('.price-display .display-4');
    if (priceDisplay) {
      const priceText = priceDisplay.textContent;
      if (priceText) {
        this.currentGoldPrice = parseFloat(priceText.replace('$', ''));
      }
    }

    this.initializeEventListeners();
  }

  private initializeEventListeners(): void {
    this.form.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      this.calculateValue();
    });

    // 实时计算
    ['weight', 'weightUnit', 'karat', 'premium'].forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener('change', () => this.calculateValue());
        if (id === 'weight' || id === 'premium') {
          element.addEventListener('input', () => this.calculateValue());
        }
      }
    });
  }

  private getFormValues(): GoldCalculator {
    return {
      weight: parseFloat((document.getElementById('weight') as HTMLInputElement).value) || 0,
      weightUnit: (document.getElementById('weightUnit') as HTMLSelectElement).value,
      karat: parseInt((document.getElementById('karat') as HTMLSelectElement).value),
      premium: parseFloat((document.getElementById('premium') as HTMLInputElement).value) || 0,
      goldPrice: this.currentGoldPrice
    };
  }

  private convertToTroyOunces(weight: number, unit: string): number {
    switch (unit) {
      case 'g':
        return weight * 0.03215;
      case 'dwt':
        return weight * 0.05;
      default:
        return weight;
    }
  }

  private calculateValue(): void {
    const values = this.getFormValues();
    
    if (values.weight <= 0 || values.goldPrice <= 0) {
      this.resultDisplay.textContent = '$0.00';
      return;
    }

    // 转换为金衡盎司
    const weightInTroyOz = this.convertToTroyOunces(values.weight, values.weightUnit);
    
    // 计算纯度
    const purity = values.karat / 24;
    
    // 计算基础价值
    let value = weightInTroyOz * values.goldPrice * purity;
    
    // 应用溢价/折扣
    value *= (1 + values.premium / 100);
    
    // 显示结果
    this.resultDisplay.textContent = `$${value.toFixed(2)}`;
  }
}

// 当DOM加载完成后初始化计算器
document.addEventListener('DOMContentLoaded', () => {
  new Calculator();
});