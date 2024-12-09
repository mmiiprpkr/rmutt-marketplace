import { Avatar } from "@/components/common/ui/avatar";
import { Input } from "@/components/common/ui/input";
import { Card } from "@/components/common/ui/card";
import { Button } from "@/components/common/ui/button";
import { Heart, MessageSquare, Share2, ImageIcon } from "lucide-react";
import { Gift, Package } from "lucide-react";

export const Feed = () => {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Create Post Card */}
      <Card className="p-6 mb-8 bg-white/50 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
        <div className="flex gap-4 items-start">
          <Avatar className="w-10 h-10 ring-2 ring-primary/10" />
          <div className="flex-1">
            <Input
              placeholder="Share something with the community..."
              className="mb-4 bg-white/80 border-gray-200 focus:ring-2 focus:ring-primary/10 transition-all duration-200"
            />
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/80 hover:bg-primary/5 transition-colors duration-200"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
              Add Photo
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/80 hover:bg-primary/5 transition-colors duration-200"
              >
                <Gift className="w-4 h-4 mr-2" />
              Add GIF
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/80 hover:bg-primary/5 transition-colors duration-200"
              >
                <Package className="w-4 h-4 mr-2" />
              Link Product
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Posts Feed with Modern Design */}
      <div className="space-y-6">
        <Card className="overflow-hidden bg-white/50 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <Avatar className="w-10 h-10 ring-2 ring-primary/10" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">John Doe</h3>
                  <span className="text-sm text-gray-500">2h ago</span>
                </div>
                <p className="text-sm text-gray-600">Product Designer</p>
              </div>
            </div>

            <p className="text-gray-800 mb-4">
            Excited to share my latest product in the marketplace! 🎉
            </p>

            {/* Modern Product Preview */}
            <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:border-primary/20 transition-all duration-200 cursor-pointer">
              <div className="flex gap-4">
                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                  {/* Product Image Placeholder */}
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Modern Desk Lamp</h4>
                  <p className="text-sm text-gray-600 mb-2">฿1,500</p>
                  <Button
                    size="sm"
                    className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors duration-200"
                  >
                  View Details
                  </Button>
                </div>
              </div>
            </div>

            {/* Modern Interaction Buttons */}
            <div className="flex gap-6 pt-4 mt-4 border-t border-gray-100">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-primary hover:bg-primary/5 transition-colors duration-200"
              >
                <Heart className="w-4 h-4 mr-2" />
                <span className="text-sm">24</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-primary hover:bg-primary/5 transition-colors duration-200"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                <span className="text-sm">12</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-primary hover:bg-primary/5 transition-colors duration-200"
              >
                <Share2 className="w-4 h-4 mr-2" />
                <span className="text-sm">Share</span>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};