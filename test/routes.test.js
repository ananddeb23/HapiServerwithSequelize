const server = require('../src/server.js');
const models = require('../models');

const request = require('request');

describe('200 response should be given by API endpoint for showdetails', () => {
  it('/combine', () => {
    const req = {
      method: 'GET',
      url: '127.0.0.1:4000/showdetails',
    };
    server.inject(req, (res) => {
      expect(res.statusCode).toBe(200);
    });
  });
  it('/200 response should be given by API endpoint for storetails', () => {
    const req = {
      method: 'GET',
      url: '127.0.0.1:4000/storedetails',
    };
    server.inject(req, (res) => {
      expect(res.statusCode).toBe(201);
    });
  });
  it('200 response should be given by API endpoint for route /like/{id}', () => {
    const req = {
      method: 'GET',
      url: '127.0.0.1:4000/like/1',
    };
    server.inject(req, (res) => {
      expect(res.statusCode).toBe(200);
    });
  });
  it('/200 response should be given by API endpoint for route /dislike/{id}', () => {
    const req = {
      method: 'GET',
      url: '127.0.0.1:4000/dislike/1',
    };
    server.inject(req, (res) => {
      expect(res.statusCode).toBe(200);
    });
  });
});
