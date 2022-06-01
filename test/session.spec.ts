import axios from 'axios';

describe('GET http://localhost:3000/api/sessions/:sessionId', () => {
  it.skip('should return session with media', async () => {
    const response = await axios.get('http://localhost:3000/api/sessions/90d61876-b99a-443e-994c-ba882c8558b6');
    expect(response.status).toEqual(200);
    expect(response.data).toMatchObject({ implement: 'me' });
  });
});
