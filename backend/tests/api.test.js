import { test, describe, before } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../server.js';

process.env.NODE_ENV = 'test';

describe('Nexus RESTful API Test Suite', () => {
  let authToken = '';
  let createdPostId = '';
  const testUser = {
    username: `testuser_${Date.now()}`,
    email: `test_${Date.now()}@nexus.dev`,
    password: 'password123',
  };

  test('1. Health Check Endpoint (GET /api/health)', async () => {
    const res = await request(app).get('/api/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'online');
    assert.ok(res.body.service);
  });

  test('2. User Registration (POST /api/auth/register)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.ok(res.body.token);
    assert.equal(res.body.user.username, testUser.username);
  });

  test('3. User Registration Duplicate Rejection (POST /api/auth/register)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
  });

  test('4. User Login (POST /api/auth/login)', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.token);
    authToken = res.body.token; // Save for protected tests
  });

  test('5. User Login Invalid Password Rejection (POST /api/auth/login)', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'wrongpassword',
      });

    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
  });

  test('6. Fetch Current User Profile (GET /api/auth/me)', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${authToken}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.user.username, testUser.username);
  });

  test('7. Protected Route Rejects Missing Token (GET /api/auth/me)', async () => {
    const res = await request(app).get('/api/auth/me');
    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
  });

  test('8. Fetch Public Posts Feed (GET /api/posts)', async () => {
    const res = await request(app).get('/api/posts');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
  });

  test('9. Create New Post (POST /api/posts)', async () => {
    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        content: 'Automated test post from Week 3 backend test runner! 🚀',
      });

    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data._id);
    createdPostId = res.body.data._id;
  });

  test('10. Fetch Single Post by ID (GET /api/posts/:id)', async () => {
    const res = await request(app).get(`/api/posts/${createdPostId}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data._id, createdPostId);
  });

  test('11. Toggle Like on Post (POST /api/posts/:id/like)', async () => {
    const res = await request(app)
      .post(`/api/posts/${createdPostId}/like`)
      .set('Authorization', `Bearer ${authToken}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.liked, true);
  });

  test('12. Add Comment to Post (POST /api/posts/:postId/comments)', async () => {
    const res = await request(app)
      .post(`/api/posts/${createdPostId}/comments`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        text: 'This is a verified test comment.',
      });

    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.text, 'This is a verified test comment.');
  });

  test('13. Get Post Comments (GET /api/posts/:postId/comments)', async () => {
    const res = await request(app).get(`/api/posts/${createdPostId}/comments`);
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
    assert.ok(res.body.data.length >= 1);
  });

  test('14. Fetch Public User Profile by Username (GET /api/users/:username)', async () => {
    const res = await request(app).get(`/api/users/${testUser.username}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.user.username, testUser.username);
  });

  test('15. Update User Profile (PUT /api/users/profile)', async () => {
    const res = await request(app)
      .put('/api/users/profile')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        bio: 'Updated bio during automated verification test.',
      });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.user.bio, 'Updated bio during automated verification test.');
  });

  test('16. Fetch Suggested Users (GET /api/users/suggestions)', async () => {
    const res = await request(app).get('/api/users/suggestions');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
  });
});
