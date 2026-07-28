import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function Admin() {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const navItems = [
    { path: '/admin', label: '文章管理' },
    { path: '/admin/categories', label: '分类管理' },
    { path: '/admin/comments', label: '评论管理' },
  ];

  return (
    <div className="min-h-screen relative w-full">
      {/* 装饰性背景光晕 */}
      <div className="bg-gradient-orb w-96 h-96 bg-blue-200 top-0 left-0"></div>
      <div className="bg-gradient-orb w-96 h-96 bg-pink-200 bottom-0 right-0"></div>
      
      {/* 顶部导航栏 */}
      <header style={{
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: '60px',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #eee',
        zIndex: 50,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      }}>
        <div style={{
          width: '100%',
          padding: '0 40px',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
        }}>
          {/* 左侧：占位 */}
          <div></div>

          {/* 右侧：操作按钮组 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, justifyContent: 'flex-end' }}>
            {/* 导航菜单按钮 */}
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  padding: '12px 28px',
                  borderRadius: '12px',
                  fontSize: '15px',
                  textDecoration: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: location.pathname === item.path ? '#4f6ef7' : 'rgba(79, 110, 247, 0.08)',
                  color: location.pathname === item.path ? '#ffffff' : '#666',
                  transition: 'all 0.2s',
                  minWidth: '110px',
                  textAlign: 'center',
                  fontWeight: location.pathname === item.path ? '600' : '500',
                }}
                onMouseEnter={(e) => {
                  if (location.pathname !== item.path) {
                    e.currentTarget.style.backgroundColor = 'rgba(79, 110, 247, 0.15)';
                    e.currentTarget.style.color = '#333';
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== item.path) {
                    e.currentTarget.style.backgroundColor = 'rgba(79, 110, 247, 0.08)';
                    e.currentTarget.style.color = '#666';
                  }
                }}
              >
                {item.label}
              </Link>
            ))}

            {/* 返回首页按钮 - 次要按钮 */}
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
                minWidth: '110px',
                textAlign: 'center',
                fontWeight: '500',
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

            {/* 退出按钮 - 次要按钮 */}
            <button
              onClick={handleLogout}
              style={{
                padding: '12px 28px',
                borderRadius: '12px',
                fontSize: '15px',
                textDecoration: 'none',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: 'rgba(255, 59, 48, 0.08)',
                color: '#ff3b30',
                transition: 'all 0.2s',
                minWidth: '110px',
                textAlign: 'center',
                fontWeight: '500',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 59, 48, 0.15)';
                e.currentTarget.style.color = '#cc2f26';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 59, 48, 0.08)';
                e.currentTarget.style.color = '#ff3b30';
              }}
            >
              退出
            </button>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  );
}
