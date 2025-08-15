'use client';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    categoryId: '',
    image: null,
  });
  const [editProductId, setEditProductId] = useState(null);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAll = async () => {
      const res = await fetch('https://backend-chi-sepia.vercel.app/api/products');
      const data = await res.json();
      setProducts(data.products);
      setCategories(data.categories);
    };
    fetchAll();
  }, []);
const [isLoading, setIsLoading] = useState(false);

  
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  const fd = new FormData();
  fd.append('name', formData.name);
  fd.append('price', formData.price);
  fd.append('categoryId', formData.categoryId);
  if (formData.image) fd.append('image', formData.image);

  // Correctly define the URL here
  const url = editProductId 
    ? `https://backend-chi-sepia.vercel.app/api/products/${editProductId}` 
    : '/api/products/';
  
  const method = editProductId ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, { method, body: fd });
    const result = await res.json();

    if (!res.ok) {
      console.error('Failed to save product:', result);  // Log the error
      alert(`Error: ${result.error || result.details || 'Something went wrong'}`);
      setIsLoading(false);
      return;
    }

    if (res.ok) {
      if (editProductId) {
        setProducts(prev => prev.map(p => (p.id === editProductId ? result.product : p)));
      } else {
        setProducts(prev => [...prev, result.product]);
      }
      setFormData({ name: '', price: '', categoryId: '', image: null });
      setEditProductId(null);
    }
  } catch (error) {
    console.error('Error:', error);  // Log error if it occurs in the frontend
    alert('An error occurred while saving the product.');
  } finally {
    setIsLoading(false);  // Set loading to false after request finishes
  }
};




  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      price: product.price,
      categoryId: product.categoryId,
      image: null,
    });
    setEditProductId(product.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const res = await fetch(`https://backend-chi-sepia.vercel.app/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setProducts(prev => prev.filter(p => p.id !== id));
    } else {
      alert('Error deleting product');
    }
  };
  { user?.role != 'admin' && !isAuthenticated && router.push('/login') }
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin: Products</h1>
      <div className="mb-6">
        <button
          onClick={() => router.push('/admin/orders')}
          className="inline-block bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg shadow transition"
        >
          View All Orders
        </button>
      </div>
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-6 mb-10 space-y-4 border border-gray-200"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Product Name"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            required
            className="border p-2 rounded-md w-full"
          />
          <input
            placeholder="Price"
            type="number"
            value={formData.price}
            onChange={e => setFormData({ ...formData, price: e.target.value })}
            required
            className="border p-2 rounded-md w-full"
          />
        </div>

        <select
          value={formData.categoryId}
          onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
          required
          className="border p-2 rounded-md w-full"
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={e => setFormData({ ...formData, image: e.target.files[0] })}
          className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />

      <button
  type="submit"
  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg shadow font-medium"
  disabled={isLoading}  // Disable the button while loading
>
  {isLoading ? 'Saving...' : editProductId ? 'Update Product' : 'Add Product'}
</button>

      </form>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 font-semibold text-gray-600 uppercase">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Image</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map(prod => {
              const category = categories.find(c => c.id == prod.categoryId);
              return (
                <tr key={prod.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{prod.name}</td>
                  <td className="px-6 py-4">ج.م {prod.price}</td>
                  <td className="px-6 py-4">{category?.name || 'Unknown'}</td>
                  <td className="px-6 py-4">
                    {prod.images?.[0] ? (
                      <Image
                        width={100}
                        height={100}
                        src={
                      prod.images[0] }
                        
                        alt={prod.name}
                        className="w-24 h-24 object-cover rounded-md"
                      />
                    ) : (
                      <span className="text-gray-400 italic">No image</span>
                    )}
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => handleEdit(prod)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(prod.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
