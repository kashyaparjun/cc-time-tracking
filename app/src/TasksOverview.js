import React from 'react';
import { Link } from 'react-router-dom';
import { getUrl } from './services/url';

const TasksOverview = (props) => {
  const [tasks, setTasks] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      const response = await fetch(getUrl('TASKS_BASE_URL'));
      const result = await response.json();
      setTasks(result.data);
    })();
  }, []);

  const isLoading = tasks === null;
  return isLoading ? (
    'Loading…'
  ) : (
    <>
      <div className="w-full px-10 flex justify-end">
        <Link to={`/overview`}>My performance overview</Link>
      </div>
      <h1>Tasks</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <Link to={`/${task.id}`}>{task.instructions}</Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default TasksOverview;
