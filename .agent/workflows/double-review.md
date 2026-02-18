---
description: Perform a double code review using Codex and Gemini personas on the entire codebase.
---

1.  Read the current codebase to gain full context. Key files include:
    -   `App.tsx`
    -   `constants.ts`
    -   `index.html`
    -   `index.tsx`
    -   `types.ts`
    -   `vite.config.ts`
    -   `package.json`
    -   `tsconfig.json`
    -   All files in `api/`
    -   All files in `services/`

2.  **Review Phase 1: OpenAI Codex Persona**
    Analyze the code acting as **OpenAI Codex**. Focus your review on:
    -   **Syntax & Logic**: Identify syntax errors, logical flaws, and potential runtime bugs.
    -   **Efficiency**: Suggest optimizations for performance and resource usage.
    -   **Conventions**: Check adherence to standard coding conventions and style guides.

3.  **Review Phase 2: Google Gemini Persona**
    Analyze the code acting as **Google Gemini**. Focus your review on:
    -   **Reasoning & Architecture**: Evaluate the overall design, modularity, and scalability.
    -   **Safety & Security**: Identify potential security vulnerabilities and safety risks.
    -   **Best Practices**: Suggest improvements based on modern development best practices and maintainability.

4.  **Compilation & Report**
    Compile the findings from both reviews into a single, comprehensive report.
    -   **Structure**: Use clear headings for each persona's feedback.
    -   **Synthesis**: Highlight areas of agreement (consensus) and any conflicting recommendations.
    -   **Actionable Items**: Provide a summarized list of actionable steps for the developer.
