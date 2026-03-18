// AI-GENERATED
import { useState } from 'react';
import type { CreateSessionPayload } from '../types/session';

interface Props {
  onCreate: (payload: CreateSessionPayload) => Promise<void>;
}

export default function CreateSessionForm({ onCreate }: Props) {
  const [examName, setExamName] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onCreate({
        examName,
        scheduledAt: new Date(scheduledAt).toISOString(),
        durationMinutes: Number(durationMinutes),
      });
      setExamName('');
      setScheduledAt('');
      setDurationMinutes('');
    } catch (err: any) {
      setError(err?.message ?? 'Failed to create session');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="create-form">
      <h2>Schedule New Exam</h2>
      {error && <p className="error-msg">{error}</p>}
      <label>
        Exam Name
        <input
          type="text"
          value={examName}
          onChange={e => setExamName(e.target.value)}
          required
        />
      </label>
      <label>
        Scheduled At
        <input
          type="datetime-local"
          value={scheduledAt}
          onChange={e => setScheduledAt(e.target.value)}
          required
        />
      </label>
      <label>
        Duration (minutes)
        <input
          type="number"
          value={durationMinutes}
          onChange={e => setDurationMinutes(e.target.value)}
          required
          min={1}
        />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? 'Scheduling…' : 'Schedule Exam'}
      </button>
    </form>
  );
}
