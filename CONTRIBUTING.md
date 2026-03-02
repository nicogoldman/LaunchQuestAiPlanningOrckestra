# Guía de Contribución para LaunchQuest AI

¡Hola! 👋 Primero que todo, muchísimas gracias por considerar contribuir a **LaunchQuest AI**. Toda la ayuda, sugerencias e ideas son bienvenidas. Al colaborar, no solo construyes una herramienta asombrosa, sino que te conviertes en parte de la historia gamificada del proyecto.

## 🌟 Cómo Empezar

### 1. Encontrar algo en qué trabajar
Revisa la pestaña de [Issues](https://github.com/nicogoldman/LaunchQuestAiPlanningOrckestra/issues) y busca la etiqueta `good first issue` o `help wanted`. Si tienes una idea nueva, por favor abre un issue primero para que podamos discutirla juntos.

### 2. Fork & Clonar
1. Haz **Fork** del repositorio.
2. Clona localmente:
   ```bash
   git clone https://github.com/TU-USUARIO/LaunchQuestAiPlanningOrckestra.git
   ```
3. Agrega el remoto original:
   ```bash
   git remote add upstream https://github.com/nicogoldman/LaunchQuestAiPlanningOrckestra.git
   ```

### 3. Crear una Rama
Mantén la rama `main` limpia y crea ramas descriptivas para tu feature o fix:
```bash
git checkout -b feature/MiNuevaIdea Genial
``` o bien `bugfix/IssueNumero`

### 4. Configurar Entorno Local
Instala dependencias y corre el server:
```bash
npm install
npm run dev
```

### 5. Convenciones de Desarrollo
- **Commits**: Usamos *Conventional Commits* (`feat:`, `fix:`, `docs:`, `refactor:`).
- **Estilo**: El código usa TypeScript rígido y React 19. Respeta las reglas de lint locales.
- **Componentes**: Diseñamos utilizando Tailwind CSS para una consistencia visual atada al concepto de UI gamificada.

### 6. Enviar Pull Request
- Asegúrate de que `npm run build` corra sin errores antes de enviar el PR.
- Sube tus cambios: `git push origin feature/MiNuevaIdea`.
- Abre el Pull Request detallando claramente qué soluciona o aporta tu código y si está relacionado con un Issue existente.

---

### Misión Especial para IA/Agentes
Si eres un agente automatizado trabajando sobre este repositorio, ¡asegúrate de registrar todas las operaciones en tus logs respectivos, mantener las optimizaciones de variables de entorno y documentar cada cambio estructural en **PROYECTO.md** además del PR final!
