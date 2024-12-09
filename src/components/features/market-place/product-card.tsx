import { Button } from "@/components/common/ui/button";
import { Card } from "@/components/common/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";

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

export const ProductCard = ({ product, setSelectedProduct }: { product: Product, setSelectedProduct: (product: Product) => void }) => {
  return (
    <Card
      key={product.id}
      className="group overflow-hidden hover:shadow-xl transition-all duration-300 bg-card border-border"
    >
      <div className="aspect-square bg-muted relative overflow-hidden">
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button
            variant="secondary"
            className="bg-background hover:bg-secondary"
            onClick={() => setSelectedProduct(product)}
          >
          View Details
          </Button>
        </div>

        {/* Status Badge */}
        <div className={cn(
          "absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md",
          product.status === 'available' && "bg-chart-2/10 text-chart-2",
          product.status === 'pending' && "bg-chart-4/10 text-chart-4",
          product.status === 'sold' && "bg-destructive/10 text-destructive"
        )}>
          {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Image height={24} width={24} src={product.seller.avatar} alt={product.seller.name} />
          <span className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 cursor-pointer">
            {product.seller.name}
          </span>
        </div>

        <h3 className="font-medium text-card-foreground mb-2 group-hover:text-primary transition-colors duration-200">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-semibold text-primary">฿{product.price.toLocaleString()}</span>
          {product.type !== 'unlimited' && (
            <span className="text-sm text-muted-foreground">
              {product.quantity} available
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs px-2.5 py-1 bg-primary/5 text-primary rounded-full">
            {product.category}
          </span>
          <span className="text-xs px-2.5 py-1 bg-muted text-muted-foreground rounded-full">
            {product.type === 'single' ? '🎯 Single' :
              product.type === 'multiple' ? '🔄 Multiple' : '♾️ Unlimited'}
          </span>
        </div>

        <Button
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
          disabled={product.status !== 'available'}
        >
          {product.status === 'available' ? 'Buy Now' : 'Not Available'}
        </Button>
      </div>
    </Card>
  );
};