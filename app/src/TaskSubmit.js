import React from 'react';
import { Link, useParams } from 'react-router-dom';

const TaskSubmit = props => {
  const { id: taskId } = useParams();
  const [task, setTask] = React.useState(null);
  const [errors, setErrors] = React.useState(null);
  const [answer, setAnswer] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const response = await fetch(`http://localhost:5000/tasks/${taskId}`);
      const result = await response.json();
      setTask(result.data);
    })();
  }, [taskId]);

  const onChangeAnswer = React.useCallback(event =>
    setAnswer(event.target.value)
  , []);

  const onSubmitAnswer = React.useCallback(event => {
    (async () => {
      setIsSubmitting(true);

      const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: { submitted: true, answer } })
      });
      const result = await response.json();

      if (result.success) {
        setTask(result.data);
      } else {
        setErrors(JSON.stringify(result.errors));
      }

      setIsSubmitting(false);
    })();
  }, [taskId, answer]);

  const isLoading = task === null;
  return isLoading
    ? 'Loading…'
    : (
      <>
        <div>
          <Link to="/">Back</Link>
        </div>
        <div>
          <h1>{task.instructions}</h1>

          {
            task.submitted
              ? (
                <>
                  <h3>Your answer</h3>
                  <hr />
                  <p>{task.answer}</p>
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
            )
          }
        </div>
      </>
    )
};

export default TaskSubmit;
