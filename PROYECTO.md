# Launch Quest AI 🚀 - Documentación Técnica y de Contexto

Este documento sirve como la **Fuente de Verdad Central** para el proyecto Launch Quest AI. Está diseñado para ser leído por otros LLMs, agentes de IA y herramientas de orquestación (como **Antigravity**) para entender la arquitectura, el propósito y las reglas del sistema.

## 📌 Visión General
Launch Quest AI es un orquestador de proyectos gamificado que transforma ideas abstractas en roadmaps ejecutables. Soporta múltiples proveedores de IA y permite la ejecución autónoma de tareas técnicas.

## 🏗️ Arquitectura del Sistema

### Frontend (React + Vite + Tailwind)
- **Estado**: Zustand con persistencia en `localStorage`. Ver `src/stores/gameStore.ts`.
- **Navegación**: React Router DOM.
- **UI**: Basada en la identidad visual de MercadoLibre.
- **Componentes Clave**:
    - `Dashboard`: Vista principal de progreso y clonación de misiones.
    - `ProjectHub`: Gestión de contexto, skills y herramientas.
    - `TaskModal`: Desglose y ejecución de tareas.
    - `AgentSteps`: Interfaz de ejecución real de IA con visualización Markdown.
    - `Instructions`: Manual evolutivo para el usuario.

### Backend (Express + Node.js)
- **Entry Point**: `server.ts`.
- **API Endpoints**:
    - `POST /api/plan`: Genera el roadmap inicial.
    - `POST /api/execute`: Ejecuta una tarea real usando el modelo seleccionado.
    - `POST /api/task/breakdown`: Desglosa una tarea en sub-tareas.
- **Integración IA**: `server/services/aiService.ts` abstrae Google Gemini, OpenAI, Anthropic, DeepSeek y Alibaba.

## 🧠 Lógica de Negocio y Reglas

### Gamificación y Skills
- **XP**: Se gana al completar tareas.
- **Niveles**: `Math.floor(XP / 1000) + 1`.
- **Inferencia de Skills**: El sistema analiza el título de la tarea para asignar XP a habilidades específicas (Backend, UI/UX, etc.).

### Ejecución de IA
- Los agentes reciben el `projectContext` y las `integrations` conectadas para generar respuestas coherentes.
- Se registra el uso real de tokens para alimentar el sistema de aprendizaje de costos.

## 🛸 Instrucciones para Antigravity (Continuación)
1. **Modelos**: Para añadir nuevos modelos, actualiza la lista `MODELS` en `src/pages/Settings.tsx` y la lógica de detección en `server/services/aiService.ts`.
2. **Integraciones**: Implementar OAuth real para las herramientas en `src/pages/Settings.tsx`. Actualmente son simulaciones.
3. **Persistencia**: El sistema usa `localStorage`. Para multi-usuario real, migrar el store a una base de datos externa.
4. **Prompt Engineering**: Refinar los prompts en `aiService.ts` para mejorar la calidad de los desgloses de tareas.
