# Launch Quest AI 🚀

Launch Quest AI es un orquestador de agentes IA gamificado diseñado para transformar ideas en roadmaps ejecutables. La cantidad de niveles se ajusta automáticamente a la ambición de tu proyecto.

## 🤝 Colaboración Abierta (Open Source)

Este proyecto busca ser un esfuerzo colaborativo comunitario. Invitamos a desarrolladores, diseñadores y entusiastas de la IA a contribuir. 
Puedes encontrar el repositorio público oficial aquí: [LaunchQuestAiPlanningOrckestra en GitHub](https://github.com/nicogoldman/LaunchQuestAiPlanningOrckestra).

## 🎯 Características

- **Planificación con IA**: Genera roadmaps completos de 60+ tareas.
- **Ejecución Autónoma**: Ejecuta tareas reales usando múltiples proveedores de IA (Gemini, OpenAI, Anthropic, DeepSeek, Qwen).
- **Multi-Proyecto**: Crea, clona y gestiona múltiples misiones de forma local.
- **Gamificación**: Gana XP, sube de nivel y desarrolla habilidades técnicas reales.
- **Tracking de Tokens**: Compara estimaciones vs uso real de IA con aprendizaje constante.
- **Privacidad Total**: Todo se guarda localmente en tu navegador.

## 🛠️ Stack Tecnológico

- **Frontend**: React + Vite + Tailwind CSS + Motion
- **Backend**: Express (Node.js) + TSX
- **Estado**: Zustand + Persistencia Local
- **IA**: Google Gemini, OpenAI, Anthropic, DeepSeek, Alibaba Qwen
- **Iconos**: Lucide React

## 🚀 Instalación y Desarrollo

1. Clona el repositorio.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura tus API Keys en el archivo `.env` (basado en `.env.example`) o directamente en la sección de **Ajustes** de la app.
4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## 🛸 Handoff para Antigravity

Este proyecto está listo para ser continuado por agentes de IA. 
- **Lógica Central**: `server/services/aiService.ts` maneja la abstracción de todos los modelos.
- **Estado Global**: `src/stores/gameStore.ts` gestiona proyectos, XP y keys.
- **Documentación Agente**: Consulta `PROYECTO.md` para un desglose técnico profundo diseñado para LLMs.

## 🎨 Estilo Visual

Basado en la identidad visual de MercadoLibre para una experiencia familiar, limpia y profesional.
