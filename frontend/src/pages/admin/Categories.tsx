import { useState, useEffect } from 'react';
import { categoryApi, Category } from '@/api';

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await categoryApi.getList();
      setCategories(res.data);
    } catch (error) {
      console.error('加载分类失败:', error);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, description: category.description || '' });
    setShowEditor(true);
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setShowEditor(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoryApi.update(editingCategory.id, formData);
        alert('分类更新成功');
      } else {
        await categoryApi.create(formData);
        alert('分类创建成功');
      }
      setShowEditor(false);
      loadCategories();
    } catch (error: any) {
      alert(error.response?.data?.message || '操作失败');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个分类吗？')) return;
    try {
      await categoryApi.delete(id);
      alert('分类已删除');
      loadCategories();
    } catch (error) {
      alert('删除失败');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-ios-label">分类管理</h1>
        <button
          onClick={handleCreate}
          style={{
            padding: '12px 28px',
            borderRadius: '12px',
            fontSize: '15px',
            textDecoration: 'none',
            border: 'none',
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
          <span>📁</span>
          <span>新建分类</span>
        </button>
      </div>

      {/* 分类列表 - 毛玻璃表格 */}
      <div className="glass rounded-ios-lg shadow-ios overflow-hidden border border-white/50">
        <table className="min-w-full divide-y divide-white/30">
          <thead className="bg-white/40 backdrop-blur-md">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-ios-secondary uppercase">
                名称
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-ios-secondary uppercase">
                描述
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-ios-secondary uppercase">
                文章数
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-ios-secondary uppercase">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/30">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-white/40 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-ios-label">
                  {category.name}
                </td>
                <td className="px-6 py-4 text-sm text-ios-secondary">
                  {category.description || '-'}
                </td>
                <td className="px-6 py-4 text-sm text-ios-secondary">
                  {category.article_count}
                </td>
                <td className="px-6 py-4 text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="text-ios-primary hover:text-ios-primaryDark transition-colors"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
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
          <div className="glass rounded-ios-lg w-full max-h-[90vh] overflow-y-auto shadow-ios border border-white/50" style={{ width: '800px', padding: '48px 56px' }}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ios-label mb-1">
                  分类名称
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-white/50 rounded-ios ios-input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ios-label mb-1">
                  描述
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-white/50 rounded-ios ios-input"
                />
              </div>
              <div className="flex justify-end space-x-2 mt-8">
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
