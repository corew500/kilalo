import { type SchemaTypeDefinition } from 'sanity'
import { teamMember } from './teamMember'
import { post } from './post'
import { venture } from './venture'
import { program } from './program'
import { event } from './event'
import { caseStudy } from './caseStudy'
import { impactMetrics } from './impactMetrics'
import { siteSettings } from './siteSettings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    teamMember,
    post,
    venture,
    program,
    event,
    caseStudy,
    impactMetrics,
    siteSettings,
  ],
}
