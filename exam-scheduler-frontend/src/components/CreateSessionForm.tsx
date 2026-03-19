// AI-GENERATED
import { useState } from 'react';
import type { CreateSessionPayload } from '../types/session';

interface Props {
  onCreate: (payload: CreateSessionPayload) => Promise<void>;
}

const TIME_OPTIONS: { label: string; value: string }[] = [];
for (let h = 7; h <= 19; h++) {
  for (const m of [0, 15, 30, 45]) {
    if (h === 19 && m > 0) break;
    const hh = String(h).padStart(2, '0');
    const mm = String(m).padStart(2, '0');
    const suffix = h < 12 ? 'AM' : h === 12 ? 'PM' : 'PM';
    const displayH = h <= 12 ? h : h - 12;
    TIME_OPTIONS.push({ label: `${displayH}:${mm} ${suffix}`, value: `${hh}:${mm}` });
  }
}

export default function CreateSessionForm({ onCreate }: Props) {
  const [examName, setExamName] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
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
        scheduledAt: new Date(`${scheduledDate}T${scheduledTime}`).toISOString(),
        durationMinutes: Number(durationMinutes),
      });
      setExamName('');
      setScheduledDate('');
      setScheduledTime('');
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
        Date
        <input
          type="date"
          value={scheduledDate}
          onChange={e => setScheduledDate(e.target.value)}
          required
        />
      </label>
      <label>
        Time
        <select
          value={scheduledTime}
          onChange={e => setScheduledTime(e.target.value)}
          required
        >
          <option value="">Select a time</option>
          {TIME_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
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
