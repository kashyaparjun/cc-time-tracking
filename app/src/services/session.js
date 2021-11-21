import { getUrl } from './url';

const createNewSession = async (taskId) => {
  const response = await fetch(getUrl('SESSIONS_BASE_URL'), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ task_id: taskId, start: new Date().toUTCString() }),
  });
  const result = await response.json();
  return result;
};

const updateCurrentSession = async (sessionId, taskId) => {
  const response = await fetch(`${getUrl('SESSIONS_BASE_URL')}/${sessionId}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ task_id: taskId, end: new Date().toUTCString() }),
  });
  const result = await response.json();
  return result;
};

const getSessionDataForTask = async (taskId) => {
  const response = await fetch(`${getUrl('SESSIONS_BASE_URL')}/${taskId}`);
  const result = await response.json();
  return result;
};

const getSessionDataForUser = async () => {
  const response = await fetch(getUrl('SESSIONS_BASE_URL'));
  const result = await response.json();
  return result;
};

export {
  createNewSession,
  updateCurrentSession,
  getSessionDataForTask,
  getSessionDataForUser,
};
