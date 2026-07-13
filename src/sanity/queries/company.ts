import groq from 'groq'

export const allCompaniesQuery = groq`
  *[_type == "company"] | order(category->order asc, order asc) {
    _id,
    name,
    "slug": slug.current,
    order,
    description,
    logo { asset->, alt },
    "categoryId": category->_id
  }
`
