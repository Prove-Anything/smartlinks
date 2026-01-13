// examples/react-demo.tsx
// React frontend usage examples for the Smartlinks SDK

import React, { useEffect, useState } from 'react';
import { initializeApi } from '../src/index';
import { auth } from '../src/api/auth';
import { collection } from '../src/api/collection';
import { product } from '../src/api/product';
import { asset } from '../src/api/asset';
import type { Asset } from '../src/types/asset';
import type { CollectionResponse } from '../src/types/collection';
import type { ProductResponse } from '../src/types/product';

// Initialize the SDK
initializeApi({
  baseURL: 'https://smartlinks.app/api/v1',
  // For client-side, you typically don't use an API key
  // Authentication is done via login
});

const SmartlinksDemo: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [collections, setCollections] = useState<CollectionResponse[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>('');
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Login function
  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError('');
    try {
      const result = await auth.login(email, password);
      setIsAuthenticated(true);
      console.log('Login successful');
      // Load collections after login
      await loadCollections();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
    setLoading(false);
  };

  // Load collections
  const loadCollections = async () => {
    setLoading(true);
    try {
      const data = await collection.list(false); // Public endpoint
      setCollections(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load collections');
    }
    setLoading(false);
  };

  // Load products for selected collection
  const loadProducts = async (collectionId: string) => {
    setLoading(true);
    try {
      const data = await product.list(collectionId, false); // Public endpoint
      setProducts(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load products');
    }
    setLoading(false);
  };

  // Load assets for current collection
  const loadCollectionAssets = async (collectionId: string) => {
    try {
      const list = await asset.list({ scope: { type: 'collection', collectionId }, mimeTypePrefix: 'image/' });
      setAssets(list);
    } catch (err: any) {
      setError(err.message || 'Failed to load assets');
    }
  };

  // Handle file upload to collection using new API with progress
  const handleCollectionUpload = async (file: File, collectionId: string) => {
    setLoading(true);
    setUploadProgress(0);
    try {
      const uploaded = await asset.upload({
        file,
        scope: { type: 'collection', collectionId },
        metadata: { description: 'Uploaded from React demo' },
        onProgress: (p) => setUploadProgress(p),
      });
      console.log('File uploaded successfully:', uploaded);
      await loadCollectionAssets(collectionId);
    } catch (err: any) {
      setError(err.message || 'File upload failed');
    }
    setLoading(false);
  };

  // Load collections on component mount
  useEffect(() => {
    loadCollections();
  }, []);

  // Load products when collection changes
  useEffect(() => {
    if (selectedCollection) {
      loadProducts(selectedCollection);
      loadCollectionAssets(selectedCollection);
    }
  }, [selectedCollection]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Smartlinks SDK React Demo</h1>
      
      {error && (
        <div style={{ background: '#ffebee', color: '#c62828', padding: '10px', marginBottom: '20px' }}>
          Error: {error}
        </div>
      )}

      {loading && <div>Loading...</div>}

      {!isAuthenticated ? (
        <LoginForm onLogin={handleLogin} loading={loading} />
      ) : (
        <div>
          <h2>Collections</h2>
          <select 
            value={selectedCollection} 
            onChange={(e) => setSelectedCollection(e.target.value)}
            style={{ marginBottom: '20px', padding: '5px' }}
          >
            <option value="">Select a collection...</option>
            {collections.map(col => (
              <option key={col.id} value={col.id}>
                {col.title}
              </option>
            ))}
          </select>

          {selectedCollection && (
            <div>
              <h3>Products in Collection</h3>
              {products.length === 0 ? (
                <p>No products found in this collection.</p>
              ) : (
                <div style={{ display: 'grid', gap: '10px' }}>
                  {products.map(prod => (
                    <ProductCard key={prod.id} product={prod} />
                  ))}
                </div>
              )}

              <h3 style={{ marginTop: '24px' }}>Assets in Collection</h3>
              <div style={{ marginBottom: '12px' }}>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleCollectionUpload(f, selectedCollection);
                  }}
                />
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div style={{ fontSize: 12 }}>Upload: {uploadProgress}%</div>
                )}
              </div>

              {assets.length === 0 ? (
                <p>No assets yet.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
                  {assets.map(a => (
                    <div key={a.id} style={{ border: '1px solid #ddd', borderRadius: 6, padding: 8, background: '#fff' }}>
                      <div style={{ marginBottom: 8, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        <img
                          src={a.thumbnails?.x200 || a.url}
                          alt={a.name}
                          style={{ maxWidth: '100%', maxHeight: '100%' }}
                        />
                      </div>
                      <div style={{ fontSize: 12, color: '#333' }}>{a.cleanName || a.name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Login form component
const LoginForm: React.FC<{ onLogin: (email: string, password: string) => void; loading: boolean }> = ({ onLogin, loading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '300px' }}>
      <h2>Login</h2>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: '8px' }}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: '8px' }}
        />
      </div>
      <button 
        type="submit" 
        disabled={loading}
        style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none' }}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

// Product card component
const ProductCard: React.FC<{ product: ProductResponse }> = ({ product }) => {
  return (
    <div style={{ 
      border: '1px solid #ddd', 
      padding: '15px', 
      borderRadius: '5px',
      background: '#f9f9f9'
    }}>
      <h4>{product.name}</h4>
      <p>{product.description}</p>
      <small>ID: {product.id}</small>
      {product.heroImage && (
        <div style={{ marginTop: '10px' }}>
          <img 
            src={product.heroImage.thumbnails?.x200 || product.heroImage.url} 
            alt={product.name}
            style={{ maxWidth: '200px', height: 'auto' }}
          />
        </div>
      )}
    </div>
  );
};

export default SmartlinksDemo;
