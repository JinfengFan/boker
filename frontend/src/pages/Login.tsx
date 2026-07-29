import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.response?.data?.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #E0E7FF 0%, #FCE7F3 50%, #E0E7FF 100%)',
    }}>
      <div style={{
        width: '400px',
        padding: '40px',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.10)',
      }}>
        {/* 标题区域 */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#1a1a2e',
            margin: '0 0 8px 0',
          }}>
            后台登录
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#888',
            margin: '0',
          }}>
            欢迎回来，请登录你的账号
          </p>
        </div>

        {/* 错误提示 */}
        {error && (
          <div style={{
            marginBottom: '18px',
            padding: '12px',
            backgroundColor: '#fee',
            borderLeft: '4px solid #f44',
            borderRadius: '8px',
          }}>
            <span style={{ color: '#c00', fontSize: '14px' }}>{error}</span>
          </div>
        )}

        {/* 登录表单 */}
        <form onSubmit={handleSubmit}>
          {/* 用户名输入框 */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              color: '#333',
              marginBottom: '4px',
            }}>
              用户名
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                height: '44px',
                padding: '0 0 0 12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box',
                outline: 'none',
              }}
              placeholder="请输入用户名"
              required
            />
          </div>

          {/* 密码输入框 */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              color: '#333',
              marginBottom: '4px',
            }}>
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                height: '44px',
                padding: '0 0 0 12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px',
                boxSizing: 'border-box',
                outline: 'none',
              }}
              placeholder="请输入密码"
              required
            />
          </div>

          {/* 登录按钮 */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              height: '44px',
              backgroundColor: loading ? '#4f6ef7' : '#4f6ef7',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#3b5de7';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#4f6ef7';
              }
            }}
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>


      </div>
    </div>
  );
}
