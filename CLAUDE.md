# CLAUDE.md — Project Rules

This file defines conventions Claude (and contributors) must follow when working in this repository. Keep it concise and up to date.

---

1. First think through the problem, read the codebase for relevant files, and write a plan to tasks/todo.md.
2. The plan should have a list of todo items that you can check off as you complete them
3. Before you begin working, check in with me and I will verify the plan.
4. Then, begin working on the todo items, marking them as complete as you go.
5. Please every step of the way just give me a high level explanation of what changes you made
6. Make every task and code change you do as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity.
7. DO NOT BE LAZY. NEVER BE LAZY. IF THERE IS A BUG FIND THE ROOT CAUSE AND FIX IT. NO TEMPORARY FIXES. YOU ARE A SENIOR DEVELOPER. NEVER BE LAZY
8. MAKE ALL FIXES AND CODE CHANGES AS SIMPLE AS HUMANLY POSSIBLE. THEY SHOULD ONLY IMPACT NECESSARY CODE RELEVANT TO THE TASK AND NOTHING ELSE. IT SHOULD IMPACT AS LITTLE CODE AS POSSIBLE. YOUR GOAL IS TO NOT INTRODUCE ANY BUGS. IT'S ALL ABOUT SIMPLICITY
9. Clean up as you go.  Delete dead code, update JSDOC, make sure tests are created and updated
10. Use appropriate Nx patterns
11. Prefer shared components and shared libraries, always be sure what you are trying to make isn't already in a shared folder
12. Don't be afraid to disagree and say no. Always present your reasoning based on best practices. Recommend safer and simpler alternatives.
13. Respect typescript script enforcement.  Do not work around this but use it correctly.

## Todo Management

14. **NEVER remove incomplete todos without explicit permission** - If todos exist from previous work, integrate new tasks with them, don't replace them
15. When asked to "add" todos, ADD them to the existing list, don't create a new file
16. Mark todos as complete as you finish them, keep incomplete ones visible
17. If a todo seems outdated or irrelevant, ASK before removing it

- **CRITICAL**: Follow Supabase migration procedures in `supabase/CLAUDE.md`
- Use `supabase db push --db-url` for applying migrations to remote databases

## Git & Workflow

- Commits follow: `type(scope): subject`
  - Types: feat, fix, docs, chore, refactor, test
- PRs must:
  - Have descriptive titles
  - Reference related issues
  - Pass CI and receive review approval

## AI Usage

- **Style Enforcement**: Claude should follow this file's rules above all else (security > correctness > clarity > performance).
- **Constraints**:
  - Do not generate placeholder secrets, API keys, or dummy credentials.
  - Do not invent business logic or external integrations without explicit request.
  - Do not add unnecessary dependencies. Favor built-in libraries unless specified.
- **Documentation**: Any AI-generated changes must include updated comments, tests, and relevant doc updates.
