import express from 'express';
import './externalService';
import { getSessionService } from './libraries/service';

const app = express();
const port = 3000;

app.get('/api/sessions/:sessionId', async (req, res) => {
  try {
    const data = await getSessionService(req.params.sessionId)
    return res.status(200).json(data);
  } catch (error: any) {
    console.error('Error happened', error);
    return res.status(error.response.status).json({ message: error.response.data });
  }
});

app.listen(port, () => {
  console.info(`Service is listening at http://localhost:${port}`);
});
