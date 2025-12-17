import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Category enum for location types
export const CategoryType = z.enum([
  "history",
  "food",
  "shopping",
  "nature",
  "culture",
  "events",
  "popular",
  "hidden"
]);

export type CategoryType = z.infer<typeof CategoryType>;

// City model
export const cities = pgTable("cities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  country: text("country").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  isDefault: boolean("is_default").default(false),
});

export const insertCitySchema = createInsertSchema(cities).omit({ id: true });
export type InsertCity = z.infer<typeof insertCitySchema>;
export type City = typeof cities.$inferSelect;

// Location model
export const locations = pgTable("locations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  shortDescription: text("short_description"),
  category: text("category").notNull(),
  cityId: varchar("city_id").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  imageUrl: text("image_url"),
  gallery: text("gallery").array(),
  rating: real("rating").default(4.0),
  reviewCount: integer("review_count").default(0),
  openingHours: text("opening_hours"),
  closingHours: text("closing_hours"),
  entryFee: text("entry_fee"),
  address: text("address"),
  phone: text("phone"),
  website: text("website"),
  tags: text("tags").array(),
  isFeatured: boolean("is_featured").default(false),
});

export const insertLocationSchema = createInsertSchema(locations).omit({ id: true });
export type InsertLocation = z.infer<typeof insertLocationSchema>;
export type Location = typeof locations.$inferSelect;

// Category display info
export interface CategoryInfo {
  id: CategoryType;
  name: string;
  icon: string;
  color: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { id: "history", name: "History", icon: "Landmark", color: "#C17817" },
  { id: "food", name: "Food Trails", icon: "UtensilsCrossed", color: "#E25822" },
  { id: "shopping", name: "Shopping", icon: "ShoppingBag", color: "#8B5CF6" },
  { id: "nature", name: "Nature", icon: "TreePine", color: "#22C55E" },
  { id: "culture", name: "Culture & Experiences", icon: "Sparkles", color: "#EC4899" },
  { id: "events", name: "Events", icon: "Calendar", color: "#3B82F6" },
  { id: "popular", name: "Popular Places", icon: "Star", color: "#F59E0B" },
  { id: "hidden", name: "Hidden Gems", icon: "Gem", color: "#14B8A6" },
];

// Users table (kept for auth if needed)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
