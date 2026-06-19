import type { CollectionConfig } from 'payload'

const isAuthenticated = ({ req }: { req: { user?: unknown } }) => Boolean(req.user)

export const Reports: CollectionConfig = {
  slug: 'reports',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'image'],
  },
  access: {
    read: () => true,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isAuthenticated,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'date',
      type: 'date',
      required: true,
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
    },
    {
      name: 'image',
      type: 'text',
      required: true,
    },
  ],
}
