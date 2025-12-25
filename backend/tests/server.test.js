const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

describe('Backend API Tests', () => {
  // Before all tests, connect to a test DB if needed
  // For simplicity, we just test the health endpoint which doesn't require complex setup
  
  it('should return 200 for health check', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });

  it('should return 401 for unauthorized AI chat access', async () => {
    const res = await request(app)
      .post('/api/ai/chat')
      .send({ message: 'Hello' });
    expect(res.statusCode).toEqual(401);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
