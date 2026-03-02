<div align="center">

# LaunchQuest AI 🚀

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/Node.js-18%2B-blue.svg)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

**El orquestador de proyectos gamificado definitivo. Convierte ideas abstractas en roadmaps ejecutables con el poder de la Inteligencia Artificial.**

[Reportar Bug](https://github.com/nicogoldman/LaunchQuestAiPlanningOrckestra/issues) • [Solicitar Feature](https://github.com/nicogoldman/LaunchQuestAiPlanningOrckestra/issues)
</div>

<br>

---

## 🌟 ¿Qué es LaunchQuest AI?

Alguna vez has tenido una idea brillante pero no sabes por dónde empezar? **LaunchQuest AI** evalúa tu ambición, calcula la complejidad real y crea un plan detallado de ejecución (un "roadmap" de hasta 60+ tareas en minutos). 

Pero no se detiene ahí. LaunchQuest te permite **ejecutar esas tareas localmente** seleccionando a tu proveedor preferido (Gemini, OpenAI, Anthropic, DeepSeek, Qwen), convirtiendo todo el proceso en una experiencia **gamificada** donde tú o tu equipo ganan experiencia (XP), suben de nivel y mejoran habilidades técnicas a medida que avanza el proyecto.

### 💡 Casos de Uso
* **Solopreneurs:** Entiende el alcance completo de tu próxima SaaS.
* **Agencias:** Entrega roadmaps hiper-acertados con esfuerzo y costo calculados.
* **Estudiantes:** Aprende qué necesitas aprender segmentando proyectos grandes.
* **Developers:** Genera el esqueleto y delega los "boring tasks" a tu LLM favorito de manera ágil.


## 🎯 Características Superiores

✨ **Planificación con IA a gran escala**: Desgloses inteligentes automatizados.  
🤖 **IA Agnóstica**: Funciona con Google Gemini, OpenAI, Anthropic, DeepSeek o Alibaba Qwen. ¡Tú eliges el motor!  
🎮 **Progreso Gamificado**: Gana XP, desbloquea niveles, ve cómo crece tu maestría (Backend, UI/UX, etc).  
📂 **Multi-Misión**: Trabaja en varios proyectos (o clona intentos) desde una misma interfaz.  
📊 **Costos Claros**: Tracking riguroso del uso real de _Tokens_ (¡Ideal para quienes cuidan la facturación API!).  
🔐 **100% Privado**: Funciona puramente en tu equipo gracias a almacenamiento y cacheo en `localStorage`.

<br>


## 🛠️ Stack Tecnológico

Elegimos un stack moderno y ultra-rápido:
- **Frontend**: React + Vite + Tailwind CSS + Framer Motion (para fluidez).
- **Backend / Orquestación**: Express (Node.js) + TSX.
- **Estado**: Zustand + Persistencia Local.
- **Iconos & Tipografía**: Lucide React + Identidad armónica.

---

## 🚀 Guía Rápida de Instalación

Sube LaunchQuest a tu equipo en minutos:

**1. Clona el repositorio:**
```bash
git clone https://github.com/nicogoldman/LaunchQuestAiPlanningOrckestra.git
cd LaunchQuestAiPlanningOrckestra
```

**2. Instala con NPM o PNPM:**
```bash
npm install
```

**3. Configura tus Credenciales AI:**
Renombra `.env.example` a `.env` e ingresa al menos la API Key principal:
```bash
GEMINI_API_KEY="tu-api-key-aqui"
```
*(También puedes configurarlas gráficamente en los **Ajustes** de la App luego).*

**4. 3.. 2.. 1.. ¡Despegue!:**
```bash
npm run dev
```
Dirígete a `http://localhost:3000` y empieza tu primera misión.

---

## 🤝 Colaboración Abierta (Open Source)

Este puerto estelar es mantenido por la comunidad. ¡Hagamos juntos una locura de herramienta!

Si eres de los que disfrutan mejorando Prompts, limpiando UI o repensando la arquitectura, echa un vistazo a nuestra guía [CONTRIBUTING.md](CONTRIBUTING.md).

1. Haz un Fork del proyecto
2. Crea una Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Haz Commit (`git commit -m 'feat: Add some AmazingFeature'`)
4. Haz Push (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 🛸 Handoff para Agentes (Antigravity & AI)

Este código está construido asumiendo que **otros agentes continuarán el desarrollo**. Si eres un AI Assistant:
- **Lógica Central / LLM Service**: Revisar `server/services/aiService.ts`.
- **Estado Global**: Revisar `src/stores/gameStore.ts`.
- **Documentación Hardcore**: Dirígete directamente a `PROYECTO.md` para el contexto arquitectónico profundo.

---

*(Iconos y estilos inspirados por las mejores plataformas SaaS. Hecho con ❤️ para constructores)*
