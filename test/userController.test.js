const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { register, login } = require('../controllers/userController');
const app = express();

app.use(bodyParser.json());
app.post('/register', register);
app.post('/login', login);

// Mock User model methods
jest.mock('../models/user', () => ({
  findOne: jest.fn(),
  save: jest.fn(),
}));

const User = require('../models/user');

describe('User Registration', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('It should register a new user', async () => {
    const username = 'username';
    const email = 'user@example.com';
    const password = 'password';

    User.findOne.mockResolvedValueOnce(null);

    const res = await request(app)
      .post('/register')
      .send({ username, email, password });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'User registered successfully');
  });

  test('It should return an error if the username or email already exists', async () => {
    const username = 'username';
    const email = 'user@example.com';
    const password = 'password';

    User.findOne.mockResolvedValueOnce({});

    const res = await request(app)
      .post('/register')
      .send({ username, email, password });

    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty('message', 'Username or email already exists');
  });
});

describe('User Login', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('It should log in an existing user', async () => {
    const username = 'username';
    const password = 'password';

    User.findOne.mockResolvedValueOnce({ password });

    const res = await request(app)
      .post('/login')
      .send({ username, password });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('It should return an error if the user does not exist', async () => {
    const username = 'username';
    const password = 'password';

    User.findOne.mockResolvedValueOnce(null);

    const res = await request(app)
      .post('/login')
      .send({ username, password });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'User not found');
  });
});
