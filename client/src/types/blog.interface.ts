export interface Blog {
  _id: string;
  author_id: string;
  author: string;
  image: string;
  title: string;
  slug: string;
  content: string;
  tags: string[];
  published_at: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
