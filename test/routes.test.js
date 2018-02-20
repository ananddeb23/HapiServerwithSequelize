const server = require('../src/server.js');


describe('corretc HTTP response should be given  for ', () => {
  it('/path showdetials must return response of 200', () => {
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
