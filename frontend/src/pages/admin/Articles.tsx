import { useState, useEffect, useRef } from 'react';
import { articleApi, categoryApi, uploadApi, Article, Category } from '@/api';

export default function AdminArticles() {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    cover_image: '',
    category_id: '',
    published: 0,
    custom_date: '',
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>('');

  useEffect(() => {
    loadArticles();
    loadCategories();
  }, []);

  const loadArticles = async () => {
    try {
      const res = await articleApi.getAll();
      setArticles(res.data);
    } catch (error) {
      console.error('加载文章失败:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await categoryApi.getList();
      setCategories(res.data);
    } catch (error) {
      console.error('加载分类失败:', error);
    }
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      content: article.content,
      summary: article.summary || '',
      cover_image: article.cover_image || '',
      category_id: article.category_id?.toString() || '',
      published: article.published,
      custom_date: (article as any).custom_date ? (article as any).custom_date.split('T')[0] : new Date().toISOString().split('T')[0],
    });
    setCoverFile(null);
    setCoverPreview(article.cover_image || '');
    setShowEditor(true);
  };

  const handleCreate = () => {
    setEditingArticle(null);
    setFormData({
      title: '',
      content: '',
      summary: '',
      cover_image: '',
      category_id: '',
      published: 0,
      custom_date: new Date().toISOString().split('T')[0], // 默认为今天
    });
    setCoverFile(null);
    setCoverPreview('');
    setShowEditor(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = formData.cover_image;
      
      // 如果选择了新图片，需要上传
      if (coverFile) {
        const res = await uploadApi.uploadImage(coverFile);
        imageUrl = res.data.url || res.data.path;
      }
      
      const submitData = { 
        ...formData, 
        cover_image: imageUrl,
        category_id: formData.category_id ? parseInt(formData.category_id) : undefined
      };
      
      if (editingArticle) {
        await articleApi.update(editingArticle.id!, submitData);
        alert('文章更新成功');
      } else {
        await articleApi.create(submitData);
        alert('文章创建成功');
      }
      setShowEditor(false);
      loadArticles();
    } catch (error) {
      alert('操作失败');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这篇文章吗？')) return;
    try {
      await articleApi.delete(id);
      alert('文章已删除');
      loadArticles();
    } catch (error) {
      alert('删除失败');
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setModalPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-ios-label">文章管理</h1>
        <button
          onClick={handleCreate}
          style={{
            padding: '12px 28px',
            borderRadius: '12px',
            fontSize: '15px',
            textDecoration: 'none',
            cursor: 'pointer',
            backgroundColor: 'rgba(0, 122, 255, 0.9)',
            color: '#ffffff',
            transition: 'all 0.2s',
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 8px 32px rgba(0, 122, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 86, 204, 0.9)';
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 122, 255, 0.9)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <span>✨</span>
          <span>新建文章</span>
        </button>
      </div>

      {/* 文章列表 - 毛玻璃表格 */}
      <div className="glass rounded-ios-lg shadow-ios overflow-hidden border border-white/50">
        <table className="min-w-full divide-y divide-white/30">
          <thead className="bg-white/40 backdrop-blur-md">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-ios-secondary uppercase">
                标题
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-ios-secondary uppercase">
                分类
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-ios-secondary uppercase">
                状态
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-ios-secondary uppercase">
                阅读量
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-ios-secondary uppercase">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/30">
            {articles.map((article) => (
              <tr key={article.id} className="hover:bg-white/40 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-ios-label">{article.title}</div>
                  <div className="text-sm text-ios-secondary">
                    {(article as any).custom_date 
                      ? new Date((article as any).custom_date).toLocaleDateString('zh-CN')
                      : new Date(article.created_at).toLocaleDateString('zh-CN')
                    }
                    <span className="text-xs text-gray-400 ml-1">(自定义)</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-ios-secondary">
                  {article.category_name || '未分类'}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full glass ${
                    article.published ? 'bg-ios-systemGreen/20 text-ios-systemGreen' : 'bg-ios-secondary/20 text-ios-secondary'
                  }`}>
                    {article.published ? '已发布' : '草稿'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-ios-secondary">{article.views}</td>
                <td className="px-6 py-4 text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleEdit(article)}
                    className="text-ios-primary hover:text-ios-primaryDark transition-colors"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="text-ios-systemRed hover:text-red-700 transition-colors"
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 编辑弹窗 - 毛玻璃效果 */}
      {showEditor && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div 
            ref={modalRef}
            className="glass rounded-ios-lg w-full max-h-[90vh] overflow-y-auto shadow-ios border border-white/50 relative"
            style={{ 
              width: '800px', 
              padding: '48px 56px',
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: `translate(${modalPosition.x}px, ${modalPosition.y}px)`,
              marginLeft: '-400px',
              marginTop: '-50%'
            }}
            onMouseDown={(e) => {
              if (e.target === modalRef.current) {
                setIsDragging(true);
                setDragOffset({
                  x: e.clientX - modalPosition.x,
                  y: e.clientY - modalPosition.y
                });
              }
            }}
          >
            <div 
              className="absolute top-0 left-0 right-0 h-8 cursor-move flex items-center justify-center"
              onMouseDown={(e) => {
                setIsDragging(true);
                setDragOffset({
                  x: e.clientX - modalPosition.x,
                  y: e.clientY - modalPosition.y
                });
              }}
            >
              <div className="w-12 h-1 bg-gray-400/50 rounded-full mt-1"></div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div>
                <label className="block text-sm font-medium text-ios-label mb-1">
                  标题
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-white/50 rounded-ios ios-input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ios-label mb-1">
                  摘要
                </label>
                <textarea
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-white/50 rounded-ios ios-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ios-label mb-1">
                  内容 (Markdown)
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={10}
                  className="w-full px-3 py-2 border border-white/50 rounded-ios ios-input font-mono text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ios-label mb-1">
                  分类
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full px-3 py-2 border border-white/50 rounded-ios ios-input"
                >
                  <option value="">选择分类</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-ios-label mb-1">
                  自定义时间
                </label>
                <input
                  type="date"
                  value={formData.custom_date}
                  onChange={(e) => setFormData({ ...formData, custom_date: e.target.value })}
                  className="w-full px-3 py-2 border border-white/50 rounded-ios ios-input"
                />
                <p className="text-xs text-ios-secondary mt-1">
                  设置文章的自定义展示时间（而非创建时间）
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-ios-label mb-1">
                  封面图片
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setCoverFile(file);
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          setCoverPreview(e.target?.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full px-3 py-2 border border-white/50 rounded-ios ios-input"
                  />
                  {coverPreview && (
                    <div className="mt-2">
                      <img src={coverPreview} alt="封面预览" className="max-w-[200px] h-auto rounded-ios border border-white/50" />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.published === 1}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked ? 1 : 0 })}
                    className="mr-2"
                  />
                  <span className="text-ios-label">发布</span>
                </label>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowEditor(false)}
                  className="px-4 py-2 text-ios-secondary hover:bg-white/60 rounded-ios transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary/90 backdrop-blur-md text-white rounded-ios hover:bg-primaryDark transition-colors border border-white/30"
                >
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
