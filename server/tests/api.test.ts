import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";
import { aiService } from "../services/aiService.js";

// Mock the AI Service
vi.mock("../services/aiService.js", () => ({
  aiService: {
    generatePlan: vi.fn()
  }
}));

describe("API Endpoints", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET /api/health should return ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  it("POST /api/plan should return 400 if description is missing", async () => {
    const res = await request(app).post("/api/plan").send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Description is required");
  });

  it("POST /api/plan should return a plan when successful", async () => {
    const mockPlan = {
      project: {
        name: "Test Project",
        description: "Test Description",
        levels: []
      }
    };
    
    (aiService.generatePlan as any).mockResolvedValue(mockPlan);

    const res = await request(app)
      .post("/api/plan")
      .send({ description: "Build a spaceship" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockPlan);
    expect(aiService.generatePlan).toHaveBeenCalledWith("Build a spaceship");
  });

  it("POST /api/plan should return 500 if AI service fails", async () => {
    (aiService.generatePlan as any).mockRejectedValue(new Error("AI Error"));

    const res = await request(app)
      .post("/api/plan")
      .send({ description: "Build a spaceship" });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("AI Error");
  });
});
