import api from './axios';

export interface Article {
  id: number;
  title: string;
  content: string;
  summary?: string;
  cover_image?: string;
  author_id: number;
  author: string;
  category_id?: number;
  category_name?: string;
  views: number;
  published: number;
  custom_date?: string; // 自定义时间字段
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  article_count?: number;
}

export interface Comment {
  id: number;
  article_id: number;
  user_id?: number;
  nickname: string;
  email: string;
  content: string;
  approved: number;
  created_at: string;
  article_title?: string;
}

// 文章相关 API
export const articleApi = {
  getList: (page = 1, limit = 10, categoryId?: number) =>
    api.get('/articles', { params: { page, limit, category: categoryId } }),
  
  getDetail: (id: number) =>
    api.get(`/articles/${id}`),
  
  getAll: () =>
    api.get('/articles/admin/all'),
  
  create: (data: Partial<Article>) =>
    api.post('/articles', data),
  
  update: (id: number, data: Partial<Article>) =>
    api.put(`/articles/${id}`, data),
  
  delete: (id: number) =>
    api.delete(`/articles/${id}`),
};

// 分类相关 API
export const categoryApi = {
  getList: () =>
    api.get('/categories'),
  
  create: (data: Partial<Category>) =>
    api.post('/categories', data),
  
  update: (id: number, data: Partial<Category>) =>
    api.put(`/categories/${id}`, data),
  
  delete: (id: number) =>
    api.delete(`/categories/${id}`),
};

// 评论相关 API
export const commentApi = {
  getByArticle: (articleId: number) =>
    api.get(`/comments/article/${articleId}`),
  
  create: (articleId: number, data: { nickname: string; email: string; content: string }) =>
    api.post(`/comments/article/${articleId}`, data),
  
  getAll: () =>
    api.get('/comments/admin/all'),
  
  approve: (id: number, approved: boolean) =>
    api.put(`/comments/${id}/approve`, { approved }),
  
  delete: (id: number) =>
    api.delete(`/comments/${id}`),
};

// 认证相关 API
export const authApi = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
  
  getMe: () =>
    api.get('/auth/me'),
};

// 图片上传 API
export const uploadApi = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
