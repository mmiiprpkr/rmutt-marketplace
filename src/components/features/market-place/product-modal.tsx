import { Badge } from "@/components/common/ui/badge";
import { Button } from "@/components/common/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription } from "@/components/common/ui/dialog";

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

export const ProductDetailModal = ({ product, setSelectedProduct }: { product: Product | null, setSelectedProduct: (product: Product | null) => void }) => {
  if (!product) return null;

  return (
    <Dialog open={!!product} onOpenChange={() => setSelectedProduct(null)}>
      <DialogContent className="max-w-2xl bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold flex items-center justify-between">
            {product.name}
            <Badge variant={
              product.status === 'available' ? 'default' :
                product.status === 'pending' ? 'secondary' : 'destructive'
            }>
              {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
            </Badge>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Listed by <span className="text-primary">{product.seller.name}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            {/* Product Image */}
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Price</h4>
              <p className="text-2xl font-semibold text-primary">฿{product.price.toLocaleString()}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Availability</h4>
              <p className="text-gray-900">
                {product.type === 'unlimited' ? 'Always Available' :
                  `${product.quantity} items left`}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Category</h4>
              <div className="flex gap-2 mt-1">
                <Badge variant="outline">{product.category}</Badge>
                <Badge variant="outline">
                  {product.type === 'single' ? '🎯 Single' :
                    product.type === 'multiple' ? '🔄 Multiple' : '♾️ Unlimited'}
                </Badge>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Description</h4>
              <p className="text-gray-600">{product.description}</p>
            </div>

            <Button
              className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
              disabled={product.status !== 'available'}
            >
              {product.status === 'available' ? 'Buy Now' : 'Not Available'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};