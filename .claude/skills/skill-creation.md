# Skill Creation Skill

## Description

A meta-skill for creating effective Claude Code skills. Use this pattern when you need to create a new skill that codifies a domain-specific pattern or workflow in the Kilalo project.

## When to Use

- Creating a new reusable pattern or workflow
- Documenting complex technical procedures
- Building AI-assisted development tools
- Establishing code generation standards

## Skill File Structure

Every skill should follow this structure:

```markdown
# [Skill Name] Skill

## Description

[1-2 sentences: What does this skill do and what value does it provide?]

## When to Use

[Bullet list of specific scenarios when this skill should be invoked]

- Scenario 1
- Scenario 2
- Scenario 3

## Input Parameters

[What information does Claude need to use this skill effectively?]

- **param1**: Description and examples
- **param2**: Description and examples

## Output

[What does this skill produce? Be specific about deliverables]
Returns complete [X] implementation with:

1. Item 1
2. Item 2
3. Item 3

## Example Usage

**Input:**
```

[Example user request]

````

**Output:**

### 1. [First Deliverable]
[Code or detailed instructions]

### 2. [Second Deliverable]
[Code or detailed instructions]

## Best Practices Applied
[Numbered list of development best practices this skill enforces]
1. Practice 1
2. Practice 2

## Required Dependencies
[If applicable, list npm packages, tools, or environment requirements]
```json
{
  "package": "version"
}
````

## Common Patterns

[Reusable code snippets, configurations, or reference implementations]

## Notes

[Additional context, gotchas, or important reminders]

````

## Skill Creation Checklist

When creating a new skill, ensure it has:

- [ ] **Clear Purpose**: One-sentence description of what it does
- [ ] **Specific Triggers**: Exact scenarios when it should be used
- [ ] **Input Definition**: What information Claude needs upfront
- [ ] **Expected Output**: Concrete deliverables with examples
- [ ] **Complete Example**: Full end-to-end example usage
- [ ] **Best Practices**: Engineering standards it enforces
- [ ] **Dependencies**: Required packages or tools
- [ ] **Patterns Library**: Reusable snippets for common cases

## Skill Categories

Organize skills into these categories:

### 1. **Code Generation Skills**
Generate boilerplate code following project conventions
- Component generation
- API route creation
- Test file creation
- Form scaffolding

### 2. **Integration Skills**
Work with external services and APIs
- Sanity CMS queries
- Supabase authentication
- Email services
- Analytics integration

### 3. **Testing Skills**
Create and maintain test suites
- Unit tests (Vitest)
- E2E tests (Playwright)
- Integration tests
- Test data factories

### 4. **DevOps Skills**
Deployment, infrastructure, and tooling
- Vercel deployment
- Environment variables
- Database migrations
- CI/CD workflows

### 5. **Content Skills**
i18n, SEO, and content management
- Translation workflows
- SEO metadata
- Content modeling
- Documentation generation

### 6. **Meta Skills**
Skills that help create or improve other skills
- This skill (skill-creation.md)
- Code review patterns
- Refactoring workflows

## Example: Creating a New Skill

**User Request:**
> "Create a skill for generating Sanity GROQ queries for blog posts"

**Skill Output:**

File: `.claude/skills/sanity-blog-query.md`

```markdown
# Sanity Blog Query Skill

## Description
Generate type-safe GROQ queries for fetching blog posts from Sanity CMS with all required fields, optimized images, and proper content projections.

## When to Use
- Fetching blog posts for listing pages
- Getting a single blog post by slug
- Querying related blog posts
- Building blog RSS feeds

## Input Parameters
- **queryType**: 'list' | 'single' | 'related' | 'feed'
- **locale**: 'en' | 'fr' (for localized content)
- **filters**: Optional filtering criteria (category, author, date range)

## Output
Returns:
1. GROQ query string
2. TypeScript return type
3. Usage example in Server Component
4. Response data structure

## Example Usage

**Input:**
````

Create a query to fetch all published blog posts in English with author and category

````

**Output:**

### 1. GROQ Query
```typescript
const query = `*[_type == "blogPost" && language == $locale && !(_id in path("drafts.**"))] | order(publishedAt desc) {
  _id,
  _createdAt,
  _updatedAt,
  "slug": slug.current,
  title,
  excerpt,
  publishedAt,
  "mainImage": mainImage.asset->url,
  "author": author->{
    name,
    "slug": slug.current,
    "image": image.asset->url
  },
  "category": category->{
    title,
    "slug": slug.current
  }
}`
````

### 2. TypeScript Types

```typescript
interface BlogPost {
  _id: string
  _createdAt: string
  _updatedAt: string
  slug: string
  title: string
  excerpt: string
  publishedAt: string
  mainImage: string
  author: {
    name: string
    slug: string
    image: string
  }
  category: {
    title: string
    slug: string
  }
}
```

### 3. Server Component Usage

```typescript
import { sanityFetch } from '@/lib/sanity/client'

export default async function BlogPage({ params }: { params: { locale: string } }) {
  const posts = await sanityFetch<BlogPost[]>({
    query: `...query here...`,
    params: { locale: params.locale },
    tags: ['blogPost'],
  })

  return (
    <div>
      {posts.map(post => (
        <BlogCard key={post._id} post={post} />
      ))}
    </div>
  )
}
```

## Best Practices Applied

1. Use projections to fetch only needed fields
2. Dereference related documents with `->`
3. Filter out drafts with `!(_id in path("drafts.**"))`
4. Use query parameters for dynamic values
5. Include cache tags for ISR revalidation
6. Type-safe responses with TypeScript interfaces

## Common Query Patterns

### Pagination

```groq
*[_type == "blogPost"] | order(publishedAt desc) [0...10]
```

### Search

```groq
*[_type == "blogPost" && title match $searchTerm]
```

### Category Filter

```groq
*[_type == "blogPost" && category._ref == $categoryId]
```

```

## Skill Naming Conventions

- Use kebab-case: `sanity-blog-query.md`
- Be specific: `form-validation.md` not `forms.md`
- Group related skills: `playwright-e2e.md`, `vitest-testing.md`
- Avoid generic names: `component-generation.md` not `components.md`

## Skill Maintenance

Skills should be updated when:
- Project conventions change
- New dependencies are added
- Better patterns are discovered
- User feedback reveals gaps

## Integration with Claude Code

Skills are automatically loaded from `.claude/skills/` and referenced in:
- Project instructions (CLAUDE.md)
- Task documentation (tasks/todo.md)
- Developer guides

Claude should:
1. Reference skills in responses: `"Reference: .claude/skills/supabase-auth.md"`
2. Suggest relevant skills when patterns match
3. Update skills when patterns evolve

## Notes

- Skills are living documents - update them as the project evolves
- Keep examples realistic and based on actual project code
- Test skill outputs to ensure they work in the real codebase
- Cross-reference related skills where applicable
```
