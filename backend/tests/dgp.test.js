const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const DGPAsset = require('../models/DGPAsset');
const jwt = require('jsonwebtoken');

let token;
let userId;

beforeAll(async () => {
  // Use a test MongoDB URI if provided, otherwise localhost
  await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/hostamar_test');
  
  // Create a test user
  const user = new User({ username: 'testuser', password: 'password123' });
  await user.save();
  userId = user._id;
  
  token = jwt.sign({ id: userId, username: 'testuser' }, 'production_secret_key');
});

afterAll(async () => {
  await DGPAsset.deleteMany({});
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe('DGP Asset CRUD API', () => {
  let assetId;

  it('should create a new DGP asset', async () => {
    const res = await request(app)
      .post('/api/dgp')
      .set('Authorization', `Bearer ${token}`)
      .send({
        symbol: 'TEST1',
        name: 'Test Asset 1',
        price: 100.50
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('symbol', 'TEST1');
    assetId = res.body._id;
  });

  it('should read all DGP assets', async () => {
    const res = await request(app)
      .get('/api/dgp')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should update a DGP asset', async () => {
    const res = await request(app)
      .put(`/api/dgp/${assetId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        price: 150.75,
        status: 'locked'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('price', 150.75);
    expect(res.body).toHaveProperty('status', 'locked');
  });

  it('should delete a DGP asset', async () => {
    const res = await request(app)
      .delete(`/api/dgp/${assetId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Asset deleted successfully');
  });
});
