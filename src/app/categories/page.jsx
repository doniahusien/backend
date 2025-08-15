'use client';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { addToCart } from '@/redux/features/cartSlice';

export default function CategoriesPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const userId = useSelector((state) => state.auth.user?.id);

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const handleAddToCart = (toy, event) => {
    event.stopPropagation();
    dispatch(addToCart({ userId, item: toy }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('https://backend-chi-sepia.vercel.app/api/products');
        const data = await res.json();

        setCategories(data.categories.map((cat) => ({ ...cat, id: String(cat.id) })));
        setProducts(data.products.map((prod) => ({ ...prod, categoryId: String(prod.categoryId) })));
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCategory !== null) {
      const filtered = products.filter(
        (product) => product.categoryId === selectedCategory
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [selectedCategory, products]);
          const user = useAuth();
          useEffect(() => {
            if (!user) {
              router.push("/login");
            }
          }, [user, router]);
        
          if (!user) return null;
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">التصنيفات</h1>

      {/* Category Buttons */}
      <div className="flex flex-wrap gap-4 justify-center mb-8">

        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`px-4 py-2 rounded font-bold ${selectedCategory === cat.id
              ? 'bg-yellow-500 text-white'
              : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Product Cards */}
      {selectedCategory !== null && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((toy, index) => {
            const imagePath =
              toy.images?.[0]?.startsWith('/')
                ? toy.images[0]
                : `/uploads/${toy.images?.[0] || 'default.jpg'}`;

            return (
              <div
                key={index}
                onClick={() => router.push(`/toys/${toy.id}`)}
                className="cursor-pointer bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
              >
                <div className="h-56 rounded-md mb-4 flex items-center justify-center overflow-hidden">
                  <Image
                    src={imagePath}
                    alt={toy.name}
                    width={200}
                    height={150}
                    className="w-full h-52 object-cover"
                  />
                </div>

                <h2 className="text-2xl font-extrabold text-blue-700 mt-4 text-center">{toy.name}</h2>
                <p className="text-lg font-semibold text-gray-600 text-center">ج.م {toy.price}</p>
                <button
                  onClick={(e) => handleAddToCart(toy, e)}
                  className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-pink-400 to-yellow-400 text-white rounded-full shadow-md hover:from-pink-500 hover:to-yellow-500 hover:shadow-lg transition-all duration-300"
                >
                  أضف إلى السلة
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
