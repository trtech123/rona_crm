export interface Post {
  id: number
  type: "image" | "video" | "text"
  content: string
  date: string
}

export interface Lead {
  id: number
  fullName: string
  email: string
  phone: string
  source: string
  date: string
  status: string
  autoResponse: boolean
  autoResponseChannel?: string
  convertedFromResponse: boolean
  post: Post
  postId: number
}

export interface Response {
  id: number
  name: string
  text: string
  platform: string
  date: string
  post: Post
  status: string
  convertedToLead: boolean
  autoTag: string
} 