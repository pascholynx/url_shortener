const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { shortenUrl, customUrl, redirectUrl, urlAnalytics, generalAnalytics, history } = require('../controllers/urlController');
const app = express();

app.use(bodyParser.json());
app.use('/shortenUrl', shortenUrl);
app.use('/customUrl', customUrl);
app.use('/redirectUrl/:code', redirectUrl);
app.use('/urlAnalytics/:code', urlAnalytics);
app.use('/generalAnalytics', generalAnalytics);
app.use('/history', history);

// Mock Url model methods
jest.mock('../models/url', () => ({
  findOne: jest.fn(),
  updateOne: jest.fn(),
  find: jest.fn(),
}));

const Url = require('../models/Url');

describe('URL Shortening API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('It should shorten a URL', async () => {
    const url = 'https://example.com';
    const urlCode = 'shortId';
    const userId = 'userId';
    const originalUrl = 'https://example.com';

    Url.findOne.mockResolvedValueOnce(null);
    Url.findOne.mockResolvedValueOnce(null);

    const res = await request(app)
      .post('/shortenUrl')
      .send({ url, userId });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('originalUrl', originalUrl);
    expect(res.body).toHaveProperty('shortUrl', `http://localhost:3000/${urlCode}`);
  });

  test('It should return an error for an invalid URL', async () => {
    const url = 'not a url';
    const userId = 'userId';

    const res = await request(app)
      .post('/shortenUrl')
      .send({ url, userId });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid URL');
  });

  test('It should return an error if custom URL code is already in use', async () => {
    const url = 'https://example.com';
    const customCode = 'customCode';
    const userId = 'userId';

    Url.findOne.mockResolvedValueOnce(null);
    Url.findOne.mockResolvedValueOnce({});

    const res = await request(app)
      .post('/shortenUrl')
      .send({ url, customCode, userId });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Custom URL code already in use');
  });

  test('It should redirect to the original URL', async () => {
    const urlCode = 'shortId';
    const originalUrl = 'https://example.com';

    Url.findOne.mockResolvedValueOnce({ originalUrl });

    const res = await request(app)
      .get(`/redirectUrl/${urlCode}`);

    expect(res.statusCode).toBe(302);
    expect(res.headers).toHaveProperty('location', originalUrl);
  });


  test('It should return URL analytics', async () => {
   const urlCode = 'shortId';
   const originalUrl = 'https://example.com';
   const clicks = 5;
   const createdAt = new Date().toISOString();

   Url.findOne.mockResolvedValueOnce({ originalUrl, urlCode, clicks, createdAt });

   const res = await request(app)
     .get(`/urlAnalytics/${urlCode}`);

   expect(res.statusCode).toBe(200);
   expect(res.body).toHaveProperty('originalUrl', originalUrl);
   expect(res.body).toHaveProperty('shortUrl', `http://localhost:3000/${urlCode}`);
   expect(res.body).toHaveProperty('clicks', clicks);
   expect(res.body).toHaveProperty('createdAt', createdAt);
  });

  test('It should return 404 for non-existent URL in analytics', async () => {
   const urlCode = 'nonexistent';

   Url.findOne.mockResolvedValueOnce(null);

   const res = await request(app)
     .get(`/urlAnalytics/${urlCode}`);

   expect(res.statusCode).toBe(404);
   expect(res.body).toHaveProperty('message', 'No URL found');
  });

  test('It should return general analytics', async () => {
   const slug = 'shortId';
   const clicks = 5;
   const clickDetails = [{ /*...*/ }];

   Url.findOne.mockResolvedValueOnce({ clicks, clickDetails });

   const res = await request(app)
     .get(`/generalAnalytics`)
     .query({ slug });

   expect(res.statusCode).toBe(200);
   expect(res.body).toHaveProperty('clickCount', clicks);
   expect(res.body).toHaveProperty('clickDetails', clickDetails);
  });

  test('It should return URL history for user', async () => {
   const userId = 'userId';
   const urls = [{ /*...*/ }];

   Url.find.mockResolvedValueOnce(urls);

   const res = await request(app)
     .get(`/history`)
     .set('Cookie', [`userId=${userId}`]);

   expect(res.statusCode).toBe(200);
   expect(res.body).toHaveProperty('urls', urls);
  });

});

