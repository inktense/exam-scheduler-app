// AI-GENERATED
import { useState, useEffect, useCallback } from 'react';
import AuthPage from './components/AuthPage';
import SessionList from './components/SessionList';
import CreateSessionForm from './components/CreateSessionForm';
import { getSessions, createSession, deleteSession } from './api/sessions';
import type { Session, CreateSessionPayload } from './types/session';
import './App.css';

interface Credentials {
  username: string;
  password: string;
}

function App() {
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const logout = useCallback(() => {
    setCredentials(null);
    setSessions([]);
    setError('');
  }, []);

  const fetchSessions = useCallback(async (creds: Credentials) => {
    setLoading(true);
    setError('');
    try {
      const data = await getSessions(creds.username, creds.password);
      setSessions(data);
    } catch (err: any) {
      if (err?.status === 401) {
        logout();
      } else {
        setError('Failed to load sessions');
      }
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    if (credentials) fetchSessions(credentials);
  }, [credentials, fetchSessions]);

  async function handleLogin(username: string, password: string) {
    // Validate credentials by attempting to fetch sessions
    const data = await getSessions(username, password);
    setCredentials({ username, password });
    setSessions(data);
  }

  async function handleCreate(payload: CreateSessionPayload) {
    if (!credentials) return;
    const session = await createSession(credentials.username, credentials.password, payload);
    setSessions(prev => [...prev, session].sort(
      (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
    ));
  }

  async function handleDelete(id: string) {
    if (!credentials) return;
    try {
      await deleteSession(credentials.username, credentials.password, id);
      setSessions(prev => prev.filter(s => s.id !== id));
    } catch (err: any) {
      if (err?.status === 401) {
        logout();
      } else {
        setError('Failed to delete session');
      }
    }
  }

  if (!credentials) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <div className="main-page">
      <header className="main-header">
        <h1>Exam Scheduler</h1>
        <div className="header-right">
          <span className="username">{credentials.username}</span>
          <button className="btn-logout" onClick={logout}>Log out</button>
        </div>
      </header>

      {error && <p className="error-msg">{error}</p>}

      {loading ? (
        <p className="loading-msg">Loading sessions…</p>
      ) : (
        <SessionList sessions={sessions} onDelete={handleDelete} />
      )}

      <CreateSessionForm
        username={credentials.username}
        password={credentials.password}
        onCreate={handleCreate}
      />
    </div>
  );
}

export default App;
