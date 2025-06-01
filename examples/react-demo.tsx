import React, { useEffect, useState } from 'react';
import { initializeApi } from '../dist/index';
import { collection } from '../dist/api/collection';
import { product } from '../dist/api/product';
import { proof } from '../dist/api/proof';
import type { CollectionResponse } from '../dist/types/collection';
import type { ProductResponse } from '../dist/types/product';
import type { ProofResponse } from '../dist/types/proof';

// You can provide either or both of these values:
const apiKey = 'YOUR_API_KEY'; // optional
const bearerToken = 'YOUR_BEARER_TOKEN'; // optional

initializeApi({
  baseURL: 'https://smartlinks.app/api/v1',
  apiKey,
  bearerToken,
});

const ReactDemo: React.FC = () => {
  const [collectionData, setCollection] = useState<CollectionResponse | null>(null);
  const [productData, setProduct] = useState<ProductResponse | null>(null);
  const [proofData, setProof] = useState<ProofResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const col = await collection.get('abc123');
        const prod = await product.get('abc123', 'prod789');
        const prf = await proof.get('abc123', 'proof456');
        setCollection(col);
        setProduct(prod);
        setProof(prf);
      } catch (err) {
        setError((err as Error).message);
      }
    }
    fetchData();
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!collectionData || !productData || !proofData) return <div>Loading...</div>;

  return (
    <div>
      <h1>{collectionData.title}</h1>
      <img src={collectionData.logoImage} alt={collectionData.title} width="100" />
      <h2>{productData.name}</h2>
      <img src={productData.heroImage} alt={productData.name} width="100" />
      <p>{productData.description}</p>
      <h3>Proof</h3>
      <pre>{JSON.stringify(proofData, null, 2)}</pre>
    </div>
  );
};

export default ReactDemo;
