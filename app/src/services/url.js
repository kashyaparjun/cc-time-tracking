const urlFactory = {
  TASKS_BASE_URL: {
    methods: ['GET', 'PUT'],
    dev: '',
    prod: 'http://localhost:5000/tasks',
  },
  SESSIONS_BASE_URL: {
    method: ['GET', 'POST', 'PUT'],
    dev: '',
    prod: 'http://localhost:5000/sessions',
  },
};

const env = process.env.ENV || 'prod';

const getUrl = (key) => {
  try {
    return urlFactory[key][env];
  } catch (err) {
    return null;
  }
};

export { getUrl };
