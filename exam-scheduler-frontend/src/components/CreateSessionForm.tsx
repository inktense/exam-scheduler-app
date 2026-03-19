// AI-GENERATED
import { useState, useEffect } from 'react';
import type { Exam, CreateSessionPayload } from '../types/session';
import { getExams } from '../api/exams';

interface Props {
  username: string;
  password: string;
  onCreate: (payload: CreateSessionPayload) => Promise<void>;
}

const TIME_OPTIONS: { label: string; value: string }[] = [];
for (let h = 7; h <= 19; h++) {
  for (const m of [0, 15, 30, 45]) {
    if (h === 19 && m > 0) break;
    const hh = String(h).padStart(2, '0');
    const mm = String(m).padStart(2, '0');
    const suffix = h < 12 ? 'AM' : 'PM';
    const displayH = h <= 12 ? h : h - 12;
    TIME_OPTIONS.push({ label: `${displayH}:${mm} ${suffix}`, value: `${hh}:${mm}` });
  }
}

export default function CreateSessionForm({ username, password, onCreate }: Props) {
  const [exams, setExams] = useState<Exam[]>([]);
  const [examId, setExamId] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getExams(username, password).then(setExams).catch(() => setError('Failed to load exams'));
  }, [username, password]);

  const selectedExam = exams.find(e => e.id === examId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onCreate({
        examId,
        scheduledAt: new Date(`${scheduledDate}T${scheduledTime}`).toISOString(),
      });
      setExamId('');
      setScheduledDate('');
      setScheduledTime('');
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
        Exam
        <select value={examId} onChange={e => setExamId(e.target.value)} required>
          <option value="">Select an exam</option>
          {exams.map(exam => (
            <option key={exam.id} value={exam.id}>{exam.name}</option>
          ))}
        </select>
      </label>
      <label>
        Duration (minutes)
        <input
          type="number"
          value={selectedExam?.durationMinutes ?? ''}
          readOnly
          disabled
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
        <select value={scheduledTime} onChange={e => setScheduledTime(e.target.value)} required>
          <option value="">Select a time</option>
          {TIME_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </label>
      <button type="submit" disabled={loading}>
        {loading ? 'Scheduling…' : 'Schedule Exam'}
      </button>
    </form>
  );
}
