import Script from 'next/script';

interface BaseStructuredData {
  "@context": "https://schema.org";
}

interface WebsiteData extends BaseStructuredData {
  "@type": "WebSite";
  name: string;
  description: string;
  url: string;
  potentialAction: {
    "@type": "SearchAction";
    target: string;
    "query-input": string;
  };
}

interface CalculatorData extends BaseStructuredData {
  "@type": "SoftwareApplication";
  name: string;
  applicationCategory: string;
  operatingSystem: string;
  offers: {
    "@type": "Offer";
    price: string;
    priceCurrency: string;
  };
}

interface MarketData extends BaseStructuredData {
  "@type": "Dataset";
  name: string;
  description: string;
  keywords: string[];
  temporalCoverage: string;
  spatialCoverage: string;
  license: string;
  creator: {
    "@type": "Organization";
    name: string;
    url: string;
  };
}

type StructuredData = WebsiteData | CalculatorData | MarketData;

interface JsonLdProps {
  type: 'website' | 'calculator' | 'market';
  data?: Partial<StructuredData>;
}

export default function JsonLd({ type, data }: JsonLdProps) {
  const getStructuredData = () => {
    const baseData = {
      "@context": "https://schema.org",
    };

    switch (type) {
      case 'website':
        return {
          ...baseData,
          "@type": "WebSite",
          "name": "Gold Calculator",
          "description": "Free online gold calculator tool to calculate the value of gold based on weight, karat, and current market price.",
          "url": "https://www.goldcalculator.click",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://www.goldcalculator.click/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        };

      case 'calculator':
        return {
          ...baseData,
          "@type": "SoftwareApplication",
          "name": "Gold Value Calculator",
          "applicationCategory": "FinanceApplication",
          "operatingSystem": "Web Browser",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        };

      case 'market':
        return {
          ...baseData,
          "@type": "Dataset",
          "name": "Gold Market Price Data",
          "description": "Real-time and historical gold price data with market analysis and charts.",
          "keywords": ["gold price", "gold market", "precious metals", "gold trading", "market analysis"],
          "temporalCoverage": "2024-03-12/...",
          "spatialCoverage": "Global",
          "license": "https://www.goldcalculator.click/terms",
          "creator": {
            "@type": "Organization",
            "name": "Gold Calculator",
            "url": "https://www.goldcalculator.click"
          }
        };

      default:
        return baseData;
    }
  };

  const structuredData = getStructuredData();

  return (
    <Script
      id="json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      strategy="afterInteractive"
    />
  );
}