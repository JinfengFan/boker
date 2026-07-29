import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function Layout() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* 装饰性背景光晕 */}
      <div className="bg-gradient-orb w-96 h-96 bg-blue-200 top-0 left-0"></div>
      <div className="bg-gradient-orb w-96 h-96 bg-pink-200 bottom-0 right-0"></div>
      
      <div className="relative z-10 flex flex-col flex-1">
        {/* 导航栏 - iOS 毛玻璃效果 */}
        <nav className="glass sticky top-0 z-50 border-b border-white/50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <div className="hidden md:flex ml-10 space-x-8">
                  <Link to="/" className="text-ios-secondary hover:text-ios-primary font-medium transition-colors relative group">
                    首页
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-ios-primary group-hover:w-full transition-all"></span>
                  </Link>
                  <Link to="/?category=all" className="text-ios-secondary hover:text-ios-primary font-medium transition-colors relative group">
                    文章
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-ios-primary group-hover:w-full transition-all"></span>
                  </Link>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {isAuthenticated && (
                  <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 glass-light rounded-full">
                    <div className="w-2 h-2 bg-ios-systemGreen rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-ios-label">{user?.username}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* 主内容区 */}
        <main className="max-w-6xl mx-auto px-4 pb-8 flex-1" style={{ paddingTop: '40px' }}>
          <Outlet />
        </main>

        {/* 页脚 - 毛玻璃效果 */}
        <footer className="glass border-t border-white/50 mt-auto" style={{ borderTop: '1px solid #eee' }}>
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="text-center">
              <p style={{
                fontSize: '13px',
                color: '#999',
                marginBottom: '6px',
              }}>
                © 2026 我的博客。All rights reserved.
              </p>
              <p style={{
                fontSize: '13px',
                color: '#999',
                margin: 0,
              }}>
                用 ❤️ 构建 · 记录美好生活
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
