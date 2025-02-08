import { defineSchema, defineTable } from "convex/server"
import { authTables } from "@convex-dev/auth/server"
import { v } from "convex/values"

const schema = defineSchema({
   ...authTables,
   communities: defineTable({
      name: v.string(),
      description: v.optional(v.string()),
      image: v.optional(v.string()),
      createdAt: v.string(),
      userId: v.id("users"),
   }),
   posts: defineTable({
      userId: v.id("users"),
      title: v.string(),
      likes: v.optional(v.number()),
      image: v.optional(v.string()),
      gift: v.optional(v.string()),
      productId: v.optional(v.id("products")),
      createdAt: v.string(),
      communityId: v.optional(v.id("communities")),
   }),
   comments: defineTable({
      postId: v.id("posts"),
      content: v.string(),
      author: v.id("users"),
      createdAt: v.string(),
      parentId: v.optional(v.id("comments")),
   }),
   userCommunities: defineTable({
      userId: v.id("users"),
      communityId: v.id("communities"),
   }),
   likes: defineTable({
      userId: v.id("users"),
      postId: v.id("posts"),
      createdAt: v.string(),
   }),
   savedPosts: defineTable({
      userId: v.id("users"),
      postId: v.id("posts"),
      createdAt: v.string(),
   }),
   products: defineTable({
      sellerId: v.id("users"),
      name: v.string(),
      description: v.string(),
      price: v.number(),
      image: v.string(),
      category: v.string(),
      productType: v.union(v.literal("food"), v.literal("goods")), // เพิ่มเพื่อแยกประเภทสินค้า
      quantity: v.optional(v.number()),
      status: v.union(v.literal("available"), v.literal("unavailable")),
      createdAt: v.string(),
   }),
   orders: defineTable({
      productId: v.id("products"),
      buyerId: v.id("users"),
      sellerId: v.id("users"),
      quantity: v.number(),
      totalPrice: v.number(),
      status: v.union(
         v.literal("pending"), // รอยืนยัน (ลด quantity แล้ว)
         v.literal("accepted"), // ยืนยันแล้ว สร้าง conversation
         v.literal("rejected"), // ปฏิเสธ (เพิ่ม quantity กลับ)
         v.literal("completed"), // ส่งของแล้ว
         v.literal("cancelled"), // ยกเลิก (เพิ่ม quantity กลับ)
      ),
      createdAt: v.string(),
   }),
   conversations: defineTable({
      userId1: v.id("users"),
      userId2: v.id("users"),
      createdAt: v.string(),
   }),
   messages: defineTable({
      conversationId: v.id("conversations"),
      senderId: v.id("users"),
      content: v.string(),
      createdAt: v.string(),
   }),
   categories: defineTable({
      name: v.string(),
   }),
})

export default schema
