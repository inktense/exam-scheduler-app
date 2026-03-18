// AI-GENERATED
import { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

type Tab = 'login' | 'register';

interface Props {
  onLogin: (username: string, password: string) => Promise<void>;
}

export default function AuthPage({ onLogin }: Props) {
  const [tab, setTab] = useState<Tab>('login');
  const [successMessage, setSuccessMessage] = useState('');

  function handleRegisterSuccess() {
    setSuccessMessage('Account created — please log in');
    setTab('login');
  }

  return (
    <div className="auth-page">
      <h1>Exam Scheduler</h1>
      <div className="auth-card">
        <div className="tab-bar">
          <button
            className={tab === 'login' ? 'tab active' : 'tab'}
            onClick={() => { setTab('login'); setSuccessMessage(''); }}
          >
            Log in
          </button>
          <button
            className={tab === 'register' ? 'tab active' : 'tab'}
            onClick={() => { setTab('register'); setSuccessMessage(''); }}
          >
            Register
          </button>
        </div>

        {tab === 'login' ? (
          <LoginForm onLogin={onLogin} successMessage={successMessage} />
        ) : (
          <RegisterForm onSuccess={handleRegisterSuccess} />
        )}
      </div>
    </div>
  );
}
