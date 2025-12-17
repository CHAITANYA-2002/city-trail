import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { CATEGORIES } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get("/api/cities", async (req, res) => {
    try {
      const cities = await storage.getCities();
      res.json(cities);
    } catch (error) {
      console.error("Error fetching cities:", error);
      res.status(500).json({ error: "Failed to fetch cities" });
    }
  });

  app.get("/api/cities/:id", async (req, res) => {
    try {
      const city = await storage.getCity(req.params.id);
      if (!city) {
        return res.status(404).json({ error: "City not found" });
      }
      res.json(city);
    } catch (error) {
      console.error("Error fetching city:", error);
      res.status(500).json({ error: "Failed to fetch city" });
    }
  });

  app.get("/api/categories", async (req, res) => {
    try {
      res.json(CATEGORIES);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.get("/api/locations", async (req, res) => {
    try {
      const cityId = req.query.cityId as string | undefined;
      const category = req.query.category as string | undefined;
      
      let locations;
      if (cityId && category) {
        locations = await storage.getLocationsByCategory(cityId, category);
      } else if (cityId) {
        locations = await storage.getLocations(cityId);
      } else {
        locations = await storage.getLocations();
      }
      
      res.json(locations);
    } catch (error) {
      console.error("Error fetching locations:", error);
      res.status(500).json({ error: "Failed to fetch locations" });
    }
  });

  app.get("/api/locations/:id", async (req, res) => {
    try {
      const location = await storage.getLocation(req.params.id);
      if (!location) {
        return res.status(404).json({ error: "Location not found" });
      }
      res.json(location);
    } catch (error) {
      console.error("Error fetching location:", error);
      res.status(500).json({ error: "Failed to fetch location" });
    }
  });

  app.get("/api/search", async (req, res) => {
    try {
      const cityId = req.query.cityId as string;
      const query = req.query.q as string;
      
      if (!cityId || !query) {
        return res.status(400).json({ error: "cityId and q parameters are required" });
      }
      
      const results = await storage.searchLocations(cityId, query);
      res.json(results);
    } catch (error) {
      console.error("Error searching locations:", error);
      res.status(500).json({ error: "Failed to search locations" });
    }
  });

  return httpServer;
}
