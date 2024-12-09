'use client';

import { useState } from 'react';
import { Button } from "@/components/common/ui/button";
import { Input } from "@/components/common/ui/input";
import { Avatar } from "@/components/common/ui/avatar";
import { Home, Store, Search } from 'lucide-react';
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/ui/select";
import { ProductCard } from '@/components/features/market-place/product-card';
import { Feed } from '@/components/features/community/feed';
import { ProductDetailModal } from '@/components/features/market-place/product-modal';

// Product Type Definition
type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  type: 'single' | 'multiple' | 'unlimited';
  quantity?: number;
  status: 'available' | 'pending' | 'sold';
  images: string[];
  seller: {
    name: string;
    avatar: string;
    id: string;
  };
  category: string;
};

// Mock Products Data
const mockProducts: Product[] = Array.from({ length: 20 }, (_, i) => ({
  id: `prod-${i}`,
  name: [
    "Vintage T-Shirt",
    "Study Notes",
    "Handmade Cookies",
    "Engineering Calculator",
    "Lab Coat",
    "Textbook",
  ][Math.floor(Math.random() * 6)],
  price: Math.floor(Math.random() * 1000) + 100,
  description: "Product description here...",
  type: ['single', 'multiple', 'unlimited'][Math.floor(Math.random() * 3)] as Product['type'],
  quantity: Math.floor(Math.random() * 10) + 1,
  status: ['available', 'pending', 'sold'][Math.floor(Math.random() * 3)] as Product['status'],
  images: ['/placeholder.jpg'],
  seller: {
    name: `Seller ${i}`,
    avatar: '/avatar-placeholder.jpg',
    id: `seller-${i}`,
  },
  category: [
    "Books",
    "Electronics",
    "Fashion",
    "Food",
    "Stationery",
  ][Math.floor(Math.random() * 5)],
}));

const RootPage = () => {
  const [activeTab, setActiveTab] = useState<'community' | 'marketplace'>('community');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filter products based on search, category, and type
  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesType = selectedType === 'all' || product.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
      {/* Modern Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                className={cn(
                  "relative h-16 px-6 rounded-none transition-all duration-200",
                  activeTab === 'community' ?
                    "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-primary after:rounded-t-lg" :
                    "text-gray-600 hover:text-gray-900"
                )}
                onClick={() => setActiveTab('community')}
              >
                <Home className="w-5 h-5 mr-2" />
                Community
              </Button>
              <Button
                variant="ghost"
                className={cn(
                  "relative h-16 px-6 rounded-none transition-all duration-200",
                  activeTab === 'marketplace' ?
                    "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-primary after:rounded-t-lg" :
                    "text-gray-600 hover:text-gray-900"
                )}
                onClick={() => setActiveTab('marketplace')}
              >
                <Store className="w-5 h-5 mr-2" />
                Marketplace
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content with Modern Layout */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'community' ? (
          <Feed />
        ) : (
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary-foreground mb-8">
              <div className="relative z-10 p-8">
                <h1 className="text-4xl font-bold text-white mb-2">RMUTT Marketplace</h1>
                <p className="text-white/80 max-w-xl text-lg">Discover unique items from fellow students. From books to handmade goods, find everything you need.</p>
              </div>
              <div className="absolute right-0 top-0 w-1/3 h-full opacity-10">
                <Store className="w-full h-full text-white" />
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-card backdrop-blur-lg rounded-xl p-4 shadow-sm border border-border">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    placeholder="Search products..."
                    className="pl-10 h-12 bg-background border-input focus:ring-2 focus:ring-ring transition-all duration-200"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-3">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px] h-12 bg-white">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Books">📚 Books</SelectItem>
                      <SelectItem value="Electronics">💻 Electronics</SelectItem>
                      <SelectItem value="Fashion">👕 Fashion</SelectItem>
                      <SelectItem value="Food">🍱 Food</SelectItem>
                      <SelectItem value="Stationery">✏️ Stationery</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-[180px] h-12 bg-white">
                      <SelectValue placeholder="Product Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="single">🎯 Single Item</SelectItem>
                      <SelectItem value="multiple">🔄 Multiple Items</SelectItem>
                      <SelectItem value="unlimited">♾️ Unlimited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} setSelectedProduct={setSelectedProduct} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Add Modal Component */}
      <ProductDetailModal product={selectedProduct} setSelectedProduct={setSelectedProduct} />
    </div>
  );
};

export default RootPage;

