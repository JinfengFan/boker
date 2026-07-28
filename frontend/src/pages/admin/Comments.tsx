import { useState, useEffect } from 'react';
import { commentApi, Comment } from '@/api';

export default function AdminComments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    try {
      const res = await commentApi.getAll();
      setComments(res.data);
    } catch (error) {
      console.error('加载评论失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number, approved: boolean) => {
    try {
      await commentApi.approve(id, approved);
      alert('状态已更新');
      loadComments();
    } catch (error) {
      alert('操作失败');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这条评论吗？')) return;
    try {
      await commentApi.delete(id);
      alert('评论已删除');
      loadComments();
    } catch (error) {
      alert('删除失败');
    }
  };

  if (loading) {
    return <div className="text-center py-12">加载中...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-ios-label mb-6">评论管理</h1>

      {/* 评论列表 - 毛玻璃表格 */}
      <div className="glass rounded-ios-lg shadow-ios overflow-hidden border border-white/50">
        <table className="min-w-full divide-y divide-white/30">
          <thead className="bg-white/40 backdrop-blur-md">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-ios-secondary uppercase">
                评论内容
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-ios-secondary uppercase">
                文章
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-ios-secondary uppercase">
                状态
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-ios-secondary uppercase">
                时间
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-ios-secondary uppercase">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/30">
            {comments.map((comment) => (
              <tr key={comment.id} className="hover:bg-white/40 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm text-ios-label">{comment.content}</div>
                  <div className="text-sm text-ios-secondary">
                    {comment.nickname} ({comment.email})
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-ios-secondary">
                  {comment.article_title || '文章已删除'}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full glass ${
                    comment.approved ? 'bg-ios-systemGreen/20 text-ios-systemGreen' : 'bg-ios-secondary/20 text-ios-secondary'
                  }`}>
                    {comment.approved ? '已通过' : '待审核'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-ios-secondary">
                  {new Date(comment.created_at).toLocaleDateString('zh-CN')}
                </td>
                <td className="px-6 py-4 text-sm font-medium space-x-2">
                  {!comment.approved && (
                    <button
                      onClick={() => handleApprove(comment.id, true)}
                      className="text-ios-systemGreen hover:text-green-700 transition-colors"
                    >
                      通过
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(comment.id)}
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
    </div>
  );
}
