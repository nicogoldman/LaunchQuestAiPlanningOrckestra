import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";

dotenv.config();

export interface AIRequestOptions {
  model?: string;
  apiKeys?: {
    gemini?: string;
    openai?: string;
    anthropic?: string;
    deepseek?: string;
    alibaba?: string;
  };
  integrations?: any[];
}

export class AIService {
  private defaultModel = "gemini-3-flash-preview";

  private getProvider(options: AIRequestOptions) {
    const model = options.model || this.defaultModel;
    const provider = this.getProviderName(model);
    const keys = options.apiKeys || {};

    switch (provider) {
      case 'google':
        const geminiKey = keys.gemini || process.env.GEMINI_API_KEY;
        if (!geminiKey) throw new Error("Google Gemini API Key is missing");
        return { type: 'google' as const, client: new GoogleGenAI({ apiKey: geminiKey }) };
      
      case 'openai':
        const openaiKey = keys.openai || process.env.OPENAI_API_KEY;
        if (!openaiKey) throw new Error("OpenAI API Key is missing");
        return { type: 'openai' as const, client: new OpenAI({ apiKey: openaiKey }) };

      case 'anthropic':
        const anthropicKey = keys.anthropic || process.env.ANTHROPIC_API_KEY;
        if (!anthropicKey) throw new Error("Anthropic API Key is missing");
        return { type: 'anthropic' as const, client: new Anthropic({ apiKey: anthropicKey }) };

      case 'deepseek':
        const deepseekKey = keys.deepseek || process.env.DEEPSEEK_API_KEY;
        if (!deepseekKey) throw new Error("DeepSeek API Key is missing");
        return { 
          type: 'openai-compatible' as const, 
          client: new OpenAI({ apiKey: deepseekKey, baseURL: "https://api.deepseek.com" }) 
        };

      case 'alibaba':
        const alibabaKey = keys.alibaba || process.env.ALIBABA_API_KEY;
        if (!alibabaKey) throw new Error("Alibaba Qwen API Key is missing");
        return { 
          type: 'openai-compatible' as const, 
          client: new OpenAI({ apiKey: alibabaKey, baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1" }) 
        };

      default:
        throw new Error(`Unsupported provider for model: ${model}`);
    }
  }

  private getProviderName(model: string): string {
    const m = model.toLowerCase();
    if (m.includes('gemini')) return 'google';
    if (m.includes('gpt') || m.startsWith('o1-')) return 'openai';
    if (m.includes('claude')) return 'anthropic';
    if (m.includes('deepseek')) return 'deepseek';
    if (m.includes('qwen')) return 'alibaba';
    return 'google';
  }

  async generateContent(prompt: string, options: AIRequestOptions) {
    const { type, client } = this.getProvider(options);
    const model = options.model || this.defaultModel;

    if (type === 'google') {
      const response = await (client as GoogleGenAI).models.generateContent({
        model: model,
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      return response.text || "{}";
    } else if (type === 'openai' || type === 'openai-compatible') {
      const response = await (client as OpenAI).chat.completions.create({
        model: model,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });
      return response.choices[0].message.content || "{}";
    } else if (type === 'anthropic') {
      const response = await (client as Anthropic).messages.create({
        model: model,
        max_tokens: 4096,
        messages: [{ role: "user", content: prompt }],
        system: "Responde ÚNICAMENTE con un JSON válido."
      });
      const textPart = response.content.find(p => p.type === 'text');
      return textPart && 'text' in textPart ? textPart.text : "{}";
    }
    throw new Error("Generation failed");
  }

  async generatePlan(description: string, options: AIRequestOptions) {
    const prompt = `
      Eres un Planificador de Proyectos Experto y Orquestador de Agentes IA.
      Tu objetivo es desglosar la siguiente idea de proyecto en un roadmap de niveles gamificados. La cantidad de niveles debe ajustarse a la ambición del proyecto (mínimo 6, máximo 15).
      
      PROYECTO: "${description}"
      
      REGLAS:
      1. Genera la cantidad de niveles necesaria según la ambición del proyecto.
      2. Cada nivel debe tener entre 4 y 6 tareas.
      3. Cada tarea debe tener:
         - id (ej: "1.1")
         - title (corto y directo)
         - detail (explicación de 1-2 frases)
         - aiType: "ai", "human" o "hybrid"
         - estimatedTokens: número entre 1000 y 10000
         - estimatedCostAI: número entre 50 y 500 (en ARS)
         - estimatedTimeAI: string (ej: "5m", "15m")
         - estimatedTimeHuman: string (ej: "1h", "4h")
         - costHuman: 0
         - xp: número entre 50 y 200
         
      ESTRUCTURA SUGERIDA (adapta según el proyecto):
      - Fundación y Validación
      - Core del Producto
      - Integraciones Técnicas
      - UI/UX y Frontend
      - Go-To-Market y Crecimiento
      - Escalamiento y Optimización
      
      Responde ÚNICAMENTE con un JSON válido siguiendo esta estructura:
      {
        "project": {
          "name": "Nombre del Proyecto",
          "description": "Breve descripción",
          "context": "Un resumen técnico detallado del proyecto para que otros agentes entiendan el stack, arquitectura y objetivos",
          "levels": [
            {
              "id": 1,
              "title": "Título del Nivel",
              "description": "Descripción del nivel",
              "xp": 1000,
              "tasks": [...]
            }
          ]
        }
      }
    `;

    const text = await this.generateContent(prompt, options);
    return JSON.parse(text);
  }

  async generateSubTasks(taskTitle: string, taskDetail: string, projectContext: string | undefined, options: AIRequestOptions) {
    const prompt = `
      Eres un Planificador de Proyectos Experto. 
      Desglosa la siguiente tarea en 7 sub-tareas detalladas para profundizar en su ejecución.
      
      TAREA: "${taskTitle}"
      DETALLE: "${taskDetail}"
      CONTEXTO DEL PROYECTO: "${projectContext || 'No definido'}"

      REGLAS:
      1. Genera exactamente 7 sub-tareas.
      2. Cada sub-tarea debe ser ejecutable y específica.
      3. Usa el mismo formato de tarea que el plan original.
      
      Responde ÚNICAMENTE con un JSON válido que sea un ARRAY de 7 objetos tarea:
      [
        {
          "id": "sub-1",
          "title": "Título de la Sub-tarea",
          "detail": "Explicación detallada",
          "aiType": "ai" | "human" | "hybrid",
          "estimatedTokens": 500,
          "estimatedCostAI": 50,
          "estimatedTimeAI": "5m",
          "estimatedTimeHuman": "0m",
          "costHuman": 0,
          "xp": 50,
          "aiSteps": [{ "tool": "Tool Name", "detail": "What to do", "prompt": "AI prompt" }],
          "humanSteps": [{ "title": "Step title", "detail": "What to do", "checklist": true }]
        }
      ]
    `;

    const text = await this.generateContent(prompt, options);
    return JSON.parse(text);
  }

  async executeTask(task: any, projectContext: string | undefined, options: AIRequestOptions) {
    const connectedTools = options.integrations?.filter(t => t.connected).map(t => t.name).join(", ") || "Ninguna";
    
    const prompt = `
      Eres un Agente IA Autónomo especializado en ejecución técnica.
      Tu objetivo es realizar la siguiente tarea dentro del contexto del proyecto.
      
      PROYECTO: "${projectContext || 'No definido'}"
      TAREA: "${task.title}"
      DETALLE: "${task.detail}"
      HERRAMIENTAS CONECTADAS: "${connectedTools}"

      REGLAS:
      1. Genera una respuesta técnica real (código, configuración, o pasos detallados).
      2. Si hay herramientas conectadas, simula cómo interactuarías con ellas.
      3. Sé específico y profesional.
      
      Responde ÚNICAMENTE con un JSON válido siguiendo esta estructura:
      {
        "output": "El resultado de la ejecución en formato Markdown (código, tablas, etc.)",
        "tokensUsed": 2500,
        "cost": 120,
        "nextSteps": ["Paso 1", "Paso 2"]
      }
    `;

    const text = await this.generateContent(prompt, options);
    return JSON.parse(text);
  }
}

export const aiService = new AIService();
