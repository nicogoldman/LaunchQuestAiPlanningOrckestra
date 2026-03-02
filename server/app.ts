import express from "express";
import { aiService } from "./services/aiService.js";

const app = express();

app.use(express.json());

// API Routes
app.post("/api/plan", async (req, res) => {
  const { description, model, apiKeys } = req.body;
  
  if (!description) {
    return res.status(400).json({ error: "Description is required" });
  }

  try {
    const result = await aiService.generatePlan(description, { model, apiKeys });
    res.json(result);
  } catch (error: any) {
    console.error("AI Planning Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate plan" });
  }
});

app.post("/api/task/breakdown", async (req, res) => {
  const { taskTitle, taskDetail, projectContext, model, apiKeys } = req.body;
  
  if (!taskTitle) {
    return res.status(400).json({ error: "Task title is required" });
  }

  try {
    const result = await aiService.generateSubTasks(taskTitle, taskDetail, projectContext, { model, apiKeys });
    res.json(result);
  } catch (error: any) {
    console.error("AI Breakdown Error:", error);
    res.status(500).json({ error: error.message || "Failed to break down task" });
  }
});

app.post("/api/chat", async (req, res) => {
  res.json({ message: "Chat API ready" });
});

app.post("/api/execute", async (req, res) => {
  const { task, projectContext, model, apiKeys, integrations } = req.body;
  
  if (!task) {
    return res.status(400).json({ error: "Task is required" });
  }

  try {
    const result = await aiService.executeTask(task, projectContext, { model, apiKeys, integrations });
    res.json(result);
  } catch (error: any) {
    console.error("AI Execution Error:", error);
    res.status(500).json({ error: error.message || "Failed to execute task" });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
