import Script from 'next/script';

interface JsonLdProps {
  type: 'website' | 'calculator' | 'market' | 'metals' | 'news' | 'webpage' | 'organization' | 'breadcrumbs';
  data?: Record<string, any>;
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
        } as any;

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
        } as any;

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
        } as any;

      case 'metals':
        return {
          ...baseData,
          "@type": "Dataset",
          "name": "Silver & Platinum Spot Prices (USD/oz)",
          "description": "Live silver and platinum prices in USD per troy ounce with quick updates.",
          "keywords": ["silver price", "platinum price", "precious metals"],
          "spatialCoverage": "Global",
          "license": "https://www.goldcalculator.click/terms"
        } as any;

      case 'news':
        return {
          ...baseData,
          "@type": "CollectionPage",
          "name": "Gold Market News",
          "description": "Latest headlines about gold and precious metals from multiple sources.",
          "url": "https://www.goldcalculator.click/news"
        } as any;

      case 'webpage':
        return {
          ...baseData,
          "@type": "WebPage",
          "name": "Gold Calculator Page",
          "url": "https://www.goldcalculator.click"
        } as any;

      case 'organization':
        return {
          ...baseData,
          "@type": "Organization",
          "name": "Gold Calculator",
          "url": "https://www.goldcalculator.click",
          "logo": "https://www.goldcalculator.click/images/favicon.svg",
          "sameAs": [
            "https://twitter.com/",
            "https://www.facebook.com/",
            "https://www.linkedin.com/"
          ]
        } as any;

      case 'breadcrumbs':
        const items = (data && data.items) || []
        const host = 'https://www.goldcalculator.click'
        return {
          ...baseData,
          "@type": "BreadcrumbList",
          "itemListElement": items.map((it: any, idx: number) => ({
            "@type": "ListItem",
            position: idx + 1,
            name: it.name,
            item: it.url?.startsWith('http') ? it.url : `${host}${it.url || '/'}`
          }))
        } as any;

      default:
        return baseData;
    }
  };

  const structuredData = { ...getStructuredData(), ...(data || {}) };

  return (
    <Script
      id="json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      strategy="afterInteractive"
    />
  );
}