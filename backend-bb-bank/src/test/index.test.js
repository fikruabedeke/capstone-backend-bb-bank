const request = require('supertest')
const app = require('../../app');


describe('Sanity test',()=>{
 test('1 should equal 1', ()=>{
  expect(1).toBe(1);
 });
})

describe('user endpoint', () => {
  test('should return hello world object', async () => {
    const res = await request(app)
      .get('/api/users');
    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual({message: "Hello World"
    })
  })
})