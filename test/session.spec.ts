import axios from 'axios';
import {VerificationFlow} from "../src/libraries/repository"
import {MediaType,MediaContextType} from "../src/libraries/interface"

const mediaMockData: MediaType[] = [
  {
    id: '7f2dcbd8-5b5f-4f1a-bfa4-016ddf4dd662',
    mimeType: 'image/png',
    context: 'document-front'
  },
  {
    id: '663ae1db-32b6-4a4e-a828-98e3e94ca11e',
    mimeType: 'image/png',
    context: 'document-back'
  },
  {
    id: '40f1e462-6db8-4313-ace3-83e4f5619c56',
    mimeType: 'image/png',
    context: 'document-back'
  },
  {
    id: 'a6c90b4f-ddfc-49eb-89ad-05b7f1274f96',
    mimeType: 'image/png',
    context: 'document-front'
  },
  {
    id: '40851916-3e86-45cd-b8ce-0e948a8a7751',
    mimeType: 'image/png',
    context: 'document-front'
  }
]
const mediaContextMockData: MediaContextType[] =[
  {
    id: 'a4338068-d99b-416b-9b2d-ee8eae906eea',
    mediaId: 'a6c90b4f-ddfc-49eb-89ad-05b7f1274f96',
    context: 'back',
    probability: 0.9739324
  },
  {
    id: '93d1a76b-b133-41cc-ae85-aa8b80d93f57',
    mediaId: '40f1e462-6db8-4313-ace3-83e4f5619c56',
    context: 'front',
    probability: 0.2931033
  },
  {
    id: '2277b909-f74e-4dc0-b152-328713948ec5',
    mediaId: '663ae1db-32b6-4a4e-a828-98e3e94ca11e',
    context: 'none',
    probability: 0.9253487
  },
  {
    id: '2277b909-f74e-4dc0-b152-328713948ec5',
    mediaId: '7f2dcbd8-5b5f-4f1a-bfa4-016ddf4dd662',
    context: 'front',
    probability: 0.8734357
  },
  {
    id: '2277b909-f74e-4dc0-b152-328713948ec5',
    mediaId: '40851916-3e86-45cd-b8ce-0e948a8a7751',
    context: 'front',
    probability: 0.9264236
  }
]

describe('GET http://localhost:3000/api/sessions/:sessionId', () => {
  it.skip('should return session with media', async () => {
    const response = await axios.get('http://localhost:3000/api/sessions/90d61876-b99a-443e-994c-ba882c8558b6');
    expect(response.status).toEqual(200);
    expect(response.data).toMatchObject({ implement: 'me' });
  });

  it('should return media grouped by their context type', async() => {
    const response = await axios.get('http://localhost:3000/api/sessions/90d61876-b99a-443e-994c-ba882c8558b6');
    expect(response.status).toEqual(200);
    expect(response.data).toMatchObject({
      front: expect.any(Array),
      back: expect.any(Array)
    })
  })

  it('should return media with front context type', async() => {
    const media = new VerificationFlow(mediaContextMockData,mediaMockData);

    const frontContext = media.isFore().beyondProbability(.2).run();

    expect(frontContext.length).toBe(3)
  })

  it('should return media with back context type',async() => {
    const media = new VerificationFlow(mediaContextMockData,mediaMockData);

    const backContext = media.isRear().beyondProbability(.2).run();

    expect(backContext.length).toBe(1)
  })


  it('Irrelevant media must be filtered out (i.e none context)',async() => {
    const media = new VerificationFlow(mediaContextMockData,mediaMockData);

    const frontContext = media.isFore().beyondProbability(.2).run();
    const backContext = media.isRear().beyondProbability(.2).run();

    expect(frontContext.length).toBe(3)
    expect(backContext.length).toBe(1)
  })

  it('should return a media list ordered by probability in descending order', async() => {
    const media = new VerificationFlow(mediaContextMockData,mediaMockData);

    const frontContext = media.isFore().beyondProbability(.2).sorter('desc').run();
    //const backContext = media.isRear().beyondProbability(.2).run();
    const firstImage = frontContext[0];
    const secondImage = frontContext[1];
    const thirdImage = frontContext[2];

    expect(firstImage.probability).toBeGreaterThan(secondImage.probability);
    expect(secondImage.probability).toBeGreaterThan(thirdImage.probability);
  })

  it('should return a media list ordered by probability in ascending order', async() => {
    const media = new VerificationFlow(mediaContextMockData,mediaMockData);

    const frontContext = media.isFore().beyondProbability(.2).sorter('asc').run();
    const firstImage = frontContext[0];
    const secondImage = frontContext[1];
    const thirdImage = frontContext[2];

    expect(firstImage.probability).toBeLessThan(secondImage.probability);
    expect(secondImage.probability).toBeLessThan(thirdImage.probability);
  })
});
