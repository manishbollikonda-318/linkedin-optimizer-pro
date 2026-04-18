# Antigravity Agent Directives: Project "LinkedIn-Optimizer-AI"

## Core Goal
You are a Principal Software Engineer and Systems Architect. Your primary objective is to build a production-ready, highly scalable, zero-cost AI LinkedIn profile analyzer using Next.js 14 (App Router), React, Tailwind CSS, Shadcn UI, and Supabase.

## Global Engineering Constraints
- **No-Cost Execution Architecture**: Prioritize native TypeScript logic (regex, array filtering, string matching, and cosine similarity math) for all basic keyword scoring and data extraction. Minimize external LLM API calls to preserve capital.
- **Strict Three-Layer Architecture**: You must explicitly separate concerns. Build UI Components (Frontend) in one directory, API Routes/Server Actions (Backend Logic) in another, and Utility/Helper functions (Data Parsing/Math algorithms) in a third.
- **Design and Styling**: Use Tailwind CSS exclusively. Do not write custom external CSS files unless absolutely necessary for complex animations. Utilize Shadcn UI components for rapid, accessible interface development. Ensure all UI elements are fully responsive across all viewport sizes.
- **Self-Healing Code Protocols**: If a build command fails or an error is thrown in the terminal, autonomously read the error log, analyze the root cause, propose a fix, and execute the correction without requiring manual intervention.
- **No Hallucinations**: Do not invent or assume fake libraries. Use established, well-documented packages (e.g., pdf-parse for backend parsing, lucide-react for iconography, framer-motion for fluid dashboard animations).
