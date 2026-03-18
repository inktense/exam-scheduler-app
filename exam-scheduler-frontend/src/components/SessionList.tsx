// AI-GENERATED
import type { Session } from '../types/session';

interface Props {
  sessions: Session[];
  onDelete: (id: string) => Promise<void>;
}

export default function SessionList({ sessions, onDelete }: Props) {
  if (sessions.length === 0) {
    return <p className="empty-msg">No sessions scheduled.</p>;
  }

  return (
    <table className="session-table">
      <thead>
        <tr>
          <th>Exam</th>
          <th>Scheduled At</th>
          <th>Duration</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {sessions.map(session => (
          <tr key={session.id}>
            <td>{session.examName}</td>
            <td>{new Date(session.scheduledAt).toLocaleString()}</td>
            <td>{session.durationMinutes} min</td>
            <td>{session.status}</td>
            <td>
              <button
                className="btn-delete"
                onClick={() => onDelete(session.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
