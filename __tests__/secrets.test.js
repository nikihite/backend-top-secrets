const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const mockUser = {
  email: 'niki@hite.com',
  password: 'august3'
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;
  
  const agent = request.agent(app);
  const user = await UserService.create({ ...mockUser, ...userProps });
  console.log(user);
  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
};
describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('/get secrets should return secrets for authenticated users', async () => {
    // const [agent] = await registerAndLogin();
    const agent = request.agent(app);
    await agent.post('/api/v1/users').send(mockUser);
    let res = await agent
      .post('/api/v1/users/sessions')
      .send({ email: 'niki@hite.com', password: 'august3' });
    res = await agent.get('/api/v1/secrets');
    console.log(res.body);
    expect(res.status).toBe(200);
  });
  afterAll(() => {
    pool.end();
  });
});
