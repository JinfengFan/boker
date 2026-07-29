import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { articleApi, categoryApi } from '@/api';
import type { Article, Category } from '@/api';

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  const loadData = async () => {
    try {
      const [articlesRes, categoriesRes] = await Promise.all([
        articleApi.getList(1, 20, selectedCategory || undefined),
        categoryApi.getList(),
      ]);
      setArticles(articlesRes.data.articles);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  if (loading) {
    return <div className="text-center py-12">加载中...</div>;
  }

  return (
    <div>
      {/* 返回后台按钮 */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '24px',
        zIndex: 10,
      }}>
        <Link
          to="/admin"
          style={{
            padding: '12px 28px',
            borderRadius: '12px',
            fontSize: '15px',
            textDecoration: 'none',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: 'rgba(142, 142, 147, 0.08)',
            color: '#666',
            transition: 'all 0.2s',
            fontWeight: '500',
            display: 'inline-block',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(142, 142, 147, 0.15)';
            e.currentTarget.style.color = '#333';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(142, 142, 147, 0.08)';
            e.currentTarget.style.color = '#666';
          }}
        >
          返回后台
        </Link>
      </div>

      {/* 页面标题 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-ios-label mb-4">
          探索精彩文章
        </h1>
        <p className="text-ios-secondary text-lg">
          发现有趣的内容，分享知识的乐趣
        </p>
      </div>

      {/* 分类筛选 */}
      <div className="mb-8" style={{ marginTop: '32px', padding: '0 40px' }}>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => handleCategorySelect('')}
            style={{
              padding: '6px 18px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: 500,
              backgroundColor: selectedCategory === '' ? '#4f6ef7' : '#f0f2f5',
              color: selectedCategory === '' ? '#ffffff' : '#555',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            📚 全部 ({categories.reduce((sum, cat) => sum + (cat.article_count || 0), 0)})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id.toString())}
              style={{
                padding: '6px 18px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 500,
                backgroundColor: selectedCategory === cat.id.toString() ? '#4f6ef7' : '#f0f2f5',
                color: selectedCategory === cat.id.toString() ? '#ffffff' : '#555',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {cat.name} ({cat.article_count})
            </button>
          ))}
        </div>
      </div>

      {/* 文章列表 */}
      <div className="max-w-7xl mx-auto" style={{ marginTop: '32px', marginBottom: '48px', padding: '0 40px' }}>
        <div className="grid grid-cols-3" style={{ gap: '40px 32px' }}>
          {articles.length === 0 ? (
            <div style={{
              minHeight: '200px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px 20px',
              gridColumn: '1 / -1',
            }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '16px' }}>
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              <p style={{
                fontSize: '20px',
                color: '#aaa',
                margin: 0,
              }}>
                暂无文章
              </p>
              <p style={{
                fontSize: '14px',
                color: '#ccc',
                marginTop: '8px',
                marginBottom: 0,
              }}>
                还没有文章，快去写一篇吧！
              </p>
            </div>
          ) : (
            articles.map((article) => (
              <article
                key={article.id}
                className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
                style={{
                  borderRadius: '12px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                  backgroundColor: '#ffffff',
                }}
              >
                <Link to={`/article/${article.id}`} className="block h-full flex flex-col" style={{ textDecoration: 'none' }}>
                  {article.cover_image && (
                    <div className="overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
                      <img
                        src={article.cover_image}
                        alt={article.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="flex-1 flex flex-col" style={{ backgroundColor: '#ffffff', padding: '16px 20px' }}>
                    <div className="flex items-baseline text-xs text-gray-500 mb-3">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded font-medium text-xs" style={{ lineHeight: '1.5' }}>
                        {article.category_name || '未分类'}
                      </span>
                      <span className="flex-shrink-0 mx-3" style={{ lineHeight: '1.5' }}>•</span>
                      <span className="flex-shrink-0" style={{ lineHeight: '1.5' }}>
                        {(article as any).custom_date 
                          ? new Date((article as any).custom_date).toLocaleDateString('zh-CN')
                          : new Date(article.created_at).toLocaleDateString('zh-CN')
                        }
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {article.title}
                    </h2>
                    <p className="text-gray-600 mb-3 line-clamp-2 leading-relaxed flex-1">
                      {article.summary || article.content.substring(0, 150)}...
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="inline-flex items-center gap-1.5 text-gray-500 text-sm">
                        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        <span className="flex-shrink-0">{article.views}</span>
                      </span>
                      <span className="text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">
                        阅读全文
                        <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
