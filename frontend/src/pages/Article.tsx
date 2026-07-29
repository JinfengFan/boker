import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { articleApi, commentApi } from '@/api';
import type { Article, Comment } from '@/api';

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  // 根据分类名称返回对应的颜色样式
  const getCategoryStyle = (categoryName: string) => {
    const category = (categoryName || '未分类').toLowerCase();
    
    // 旅行分类 - 绿色系
    if (category.includes('旅行') || category === 'travel') {
      return {
        backgroundColor: '#e8f5e9',
        color: '#2e7d32',
      };
    }
    
    // 技术分类 - 蓝色系
    if (category.includes('技术') || category === 'tech' || category.includes('编程')) {
      return {
        backgroundColor: '#e3f2fd',
        color: '#1565c0',
      };
    }
    
    // 生活分类 - 橙色系
    if (category.includes('生活') || category === 'life') {
      return {
        backgroundColor: '#fff3e0',
        color: '#e65100',
      };
    }
    
    // 默认分类 - 紫色系
    return {
      backgroundColor: '#f3e5f5',
      color: '#6a1b9a',
    };
  };

  useEffect(() => {
    if (id) {
      loadArticle(id);
      loadComments(id);
    }
  }, [id]);

  const loadArticle = async (articleId: string) => {
    try {
      const res = await articleApi.getDetail(parseInt(articleId));
      setArticle(res.data);
    } catch (error) {
      console.error('加载文章失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async (articleId: string) => {
    try {
      const res = await commentApi.getByArticle(parseInt(articleId));
      setComments(res.data);
    } catch (error) {
      console.error('加载评论失败:', error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !nickname || !email || !content) return;

    try {
      await commentApi.create(parseInt(id), { nickname, email, content });
      setNickname('');
      setEmail('');
      setContent('');
      loadComments(id);
      alert('评论成功！');
    } catch (error) {
      alert('评论失败');
    }
  };

  if (loading) {
    return <div className="text-center py-12">加载中...</div>;
  }

  if (!article) {
    return <div className="text-center py-12">文章不存在</div>;
  }

  return (
    <div className="relative max-w-[1600px] mx-auto px-6">
      {/* 白色背景层 - 向上扩展到页面顶部 */}
      <div className="absolute inset-0 bg-white" style={{ top: '-200px' }}></div>
      
      {/* 返回首页按钮 - 与首页返回后台按钮位置一致 */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '24px',
        zIndex: 10,
      }}>
        <Link
          to="/"
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
          返回首页
        </Link>
      </div>

      {/* 文章头部 - 毛玻璃卡片 */}
      <div className="glass rounded-ios-lg shadow-ios p-[40px] mb-6 border border-white/50">
        <div className="mb-3">
          <span 
            className="inline-block text-[15px] font-semibold px-[16px] py-[6px] rounded-[20px]"
            style={getCategoryStyle(article.category_name || '')}
          >
            {article.category_name || '旅行'}
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-ios-label mb-3 leading-tight">
          {article.title}
        </h1>
        <div className="text-[14px]" style={{ color: '#888' }}>
          <span>{article.author}</span>
          <span className="mx-2">·</span>
          <span>{new Date(article.created_at).toLocaleDateString('zh-CN')}</span>
          <span className="mx-2">·</span>
          <span>{article.views} 次阅读</span>
        </div>
      </div>

      {/* 文章内容 - 毛玻璃卡片 */}
      <article className="glass rounded-ios-lg shadow-ios p-[40px] mb-8 border border-white/50">
        {article.cover_image && (
          <img
            src={article.cover_image}
            alt={article.title}
            style={{
              float: 'left',
              width: '35%',
              height: 'auto',
              borderRadius: '8px',
              marginRight: '24px',
              marginBottom: '24px',
            }}
          />
        )}
        <style>{`
          .markdown-body p {
            text-indent: 2em;
            margin: 1em 0;
          }
        `}</style>
        <div className="markdown-body prose prose-lg max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {article.content}
          </ReactMarkdown>
        </div>
        <div style={{ clear: 'both' }}></div>
      </article>

      {/* 评论区 - 毛玻璃卡片 */}
      <div className="glass rounded-ios-lg shadow-ios p-[40px] border border-white/50">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <span className="w-1 h-8 bg-primary/90 backdrop-blur-md rounded-full mr-3"></span>
          评论 ({comments.length})
        </h2>

        {/* 评论表单 */}
        <form onSubmit={handleSubmitComment} className="mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ios-label mb-2">昵称</label>
              <input
                type="text"
                placeholder="怎么称呼你？"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full px-4 py-2.5 border border-white/50 rounded-ios focus:ring-2 focus:ring-ios-primary focus:border-transparent transition-all ios-input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ios-label mb-2">邮箱</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-white/50 rounded-ios focus:ring-2 focus:ring-ios-primary focus:border-transparent transition-all ios-input"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-ios-label mb-2">评论</label>
            <textarea
              placeholder="写下你的想法..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 border border-white/50 rounded-ios focus:ring-2 focus:ring-ios-primary focus:border-transparent transition-all ios-input"
              required
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-primary/90 backdrop-blur-md text-white rounded-ios hover:bg-primaryDark transition-all font-medium shadow-ios border border-white/30"
          >
            发表评论
          </button>
        </form>

        {/* 评论列表 */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-ios-secondary">
              暂无评论，快来抢沙发吧！
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="glass rounded-ios p-6 hover:bg-white/60 transition-colors border border-white/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/90 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                      <span className="text-white font-bold">
                        {comment.nickname.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-ios-label">{comment.nickname}</span>
                      <p className="text-xs text-ios-secondary">
                        {new Date(comment.created_at).toLocaleDateString('zh-CN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-ios-label leading-relaxed">{comment.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
