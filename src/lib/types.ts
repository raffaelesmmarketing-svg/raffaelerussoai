export interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  category: string
  readingTime: string
  content?: string
}

export interface Risorsa {
  slug: string
  title: string
  description: string
  category: string
  coverImage?: string
}
