import { type SchemaTypeDefinition } from 'sanity'
import { page } from './page'
import { service } from './service'
import { teamMember } from './teamMember'
import { post } from './post'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [page, service, teamMember, post],
}
