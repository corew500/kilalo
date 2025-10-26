import { type SchemaTypeDefinition } from 'sanity'
import { page } from './page'
import { service } from './service'
import { teamMember } from './teamMember'
import { post } from './post'
import { portfolioCompany } from './portfolioCompany'
import { program } from './program'
import { event } from './event'
import { caseStudy } from './caseStudy'
import { impactMetrics } from './impactMetrics'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    page,
    service,
    teamMember,
    post,
    portfolioCompany,
    program,
    event,
    caseStudy,
    impactMetrics,
  ],
}
