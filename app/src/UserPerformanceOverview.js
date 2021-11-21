import React from 'react';
import { Link } from 'react-router-dom';
import { getSessionDataForUser } from './services/session';

function UserPerformanceOverview(props) {
  const [sessions, setSessions] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      const response = await getSessionDataForUser();
      setSessions(response.data);
    })();
  }, []);

  const isLoading = sessions === null;
  return isLoading ? (
    'Loading...'
  ) : (
    <div className="mt-24">
      <div>
        <Link to="/">Back</Link>
      </div>
      <p>
        Tasks completed: {sessions.tasks_completed}/{sessions.total_tasks}
      </p>
      <p>
        Total Time:
        {sessions.total_time.hours > 0
          ? ` ${sessions.total_time.hours} hour(s)`
          : ''}
        {sessions.total_time.minutes > 0
          ? ` ${sessions.total_time.minutes} minute(s)`
          : ''}
      </p>
      <p>
        Avg. time taken per task:
        {sessions.avg_time_per_task.hours > 0
          ? ` ${sessions.avg_time_per_task.hours} hour(s)`
          : ''}
        {sessions.avg_time_per_task.minutes > 0
          ? ` ${sessions.avg_time_per_task.minutes} minute(s)`
          : ''}
      </p>
      <p>
        Avg. session length:
        {sessions.avg_session_time.hours > 0
          ? ` ${sessions.avg_session_time.hours} hour(s)`
          : ''}
        {sessions.avg_session_time.minutes > 0
          ? ` ${sessions.avg_session_time.minutes} minute(s)`
          : ''}
      </p>
    </div>
  );
}

export default UserPerformanceOverview;
