import React, { useEffect, useState } from 'react';
import { ApiClient, CollectionResponse, ProductResponse } from '@smartlinks/sdk';

// You can provide either or both of these values:
const apiKey = 'YOUR_API_KEY'; // sent as X-API-Key header (optional)
const bearerToken = 'YOUR_BEARER_TOKEN'; // sent as AUTHORIZATION: Bearer ... (optional)

// Example: with both headers
const client = new ApiClient('https://smartlinks.app/api/v1', apiKey, bearerToken);

const ReactDemo: React.FC = () => {
  const [collection, setCollection] = useState<CollectionResponse | null>(null);
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const col = await client.getCollection('abc123');
        const prod = await client.getProductItem('abc123', 'prod789');
        setCollection(col);
        setProduct(prod);
      } catch (err) {
        setError((err as Error).message);
      }
    }
    fetchData();
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!collection || !product) return <div>Loading...</div>;

  return (
    <div>
      <h1>{collection.title}</h1>
      <img src={collection.logoImage} alt={collection.title} width="100" />
      <h2>{product.name}</h2>
      <img src={product.heroImage} alt={product.name} width="100" />
      <p>{product.description}</p>
    </div>
  );
};

export default ReactDemo;
