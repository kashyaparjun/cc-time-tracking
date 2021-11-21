import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { getUrl } from './services/url';
import {
  createNewSession,
  updateCurrentSession,
  getSessionDataForTask,
} from './services/session';

const TaskSubmit = (props) => {
  const { id: taskId } = useParams();
  const [task, setTask] = React.useState(null);
  const [errors, setErrors] = React.useState(null);
  const [answer, setAnswer] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [sessionId, setSessionId] = React.useState(null);
  const [session, setSession] = React.useState(null);
  const [inFocus, setInFocus] = React.useState(true);

  const PING_INTERVAL = 60000;
  let timer = React.useRef();

  React.useEffect(() => {
    window.addEventListener('focus', onFocus);
    window.addEventListener('blur', onBlur);

    loadCurrentTask();

    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('blur', onBlur);
    };
  }, [taskId]);

  React.useEffect(() => {
    if (sessionId) {
      timer.current = setInterval(async () => {
        await updateCurrentSession(sessionId, taskId);
      }, PING_INTERVAL);
    } else {
      clearInterval(timer.current);
    }

    return () => {
      clearInterval(timer.current);
    };
  }, [sessionId, taskId]);

  React.useEffect(() => {
    if (inFocus && task && !task.submitted) {
      startSession();
    } else if (!inFocus) {
      setSessionId(null);
    }
  }, [inFocus, task]);

  const startSession = React.useCallback(() => {
    (async () => {
      const session = await createNewSession(taskId);
      if (session.success) {
        setSessionId(session.data.id);
      } else {
        setErrors(session.errors);
      }
    })();
  }, [taskId]);

  const loadCurrentTask = React.useCallback(() => {
    (async () => {
      const response = await fetch(`${getUrl('TASKS_BASE_URL')}/${taskId}`);
      const result = await response.json();

      const session = await getSessionDataForTask(taskId);
      if (session.success) {
        setSession(session.data[0]);
      } else {
        setErrors(session.errors);
      }

      setTask(result.data);
    })();
  }, [taskId, setTask, setSession, setErrors]);

  const onFocus = () => {
    setInFocus(true);
  };

  const onBlur = () => {
    setInFocus(false);
  };

  const onChangeAnswer = React.useCallback(
    (event) => setAnswer(event.target.value),
    []
  );

  const onSubmitAnswer = React.useCallback(
    (event) => {
      (async () => {
        setIsSubmitting(true);
        clearInterval(timer.current);
        setSessionId(null);

        const response = await fetch(`${getUrl('TASKS_BASE_URL')}/${taskId}`, {
          method: 'put',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task: { submitted: true, answer } }),
        });
        const result = await response.json();

        if (result.success) {
          const session = await getSessionDataForTask(taskId);
          if (session.success) {
            setSession(session.data[0]);
          } else {
            setErrors(session.errors);
          }
          setTask(result.data);
        } else {
          setErrors(JSON.stringify(result.errors));
          startSession();
        }

        setIsSubmitting(false);
      })();
    },
    [taskId, answer, startSession, setSessionId, setTask, setErrors, setSession]
  );

  const isLoading = task === null;
  return isLoading ? (
    'Loading…'
  ) : (
    <>
      <div>
        <Link to="/">Back</Link>
      </div>
      <div>
        <h1>{task.instructions}</h1>

        {task.submitted ? (
          <>
            <h3>Your answer</h3>
            <hr />
            <p>{task.answer}</p>
            {session && (
              <div className="session-area-task">
                <p>Total time taken for task:</p>
                <p className="text-lg text-bold">
                  {session.session_length_hm.hours > 0
                    ? `${session.session_length_hm.hours} hour(s)`
                    : ''}
                  {session.session_length_hm.minutes > 0
                    ? ` ${session.session_length_hm.minutes} minute(s)`
                    : ''}
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            <p>Submit your answer:</p>
            <textarea
              rows="20"
              style={{ display: 'block', width: '80%' }}
              onChange={onChangeAnswer}
              value={answer}
            />
            {errors ? <p>{errors}</p> : null}
            <button onClick={onSubmitAnswer} disabled={isSubmitting}>
              Submit
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default TaskSubmit;
