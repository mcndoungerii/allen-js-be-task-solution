import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
import nock from 'nock';

axios.defaults.adapter = httpAdapter;

const SESSION_UUID = '90d61876-b99a-443e-994c-ba882c8558b6';

const getResponse = (code, data) => {
  const random = Math.floor(Math.random() * 10) + 1;
  if (random > 8) {
    return [500, 'There is something wrong with the service'];
  }

  return [code, data];
}

const findMatch = (haystack, needle = SESSION_UUID) => {
  return haystack.indexOf(needle) !== -1;
}

nock('https://api.veriff.internal')
  .persist()
  .get(/\/sessions\/[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)
  .reply((uri) => {
    if (!findMatch(uri)) {
      return getResponse(
        404,
        'Resource not found'
      );
    }

    return getResponse(
      200,
      {
        id: '90d61876-b99a-443e-994c-ba882c8558b6',
        status: 'internal_manual_review',
      }
    );
  });

nock('https://api.veriff.internal')
  .persist()
  .get(/\/sessions\/[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}\/media/i)
  .delay(1000)
  .reply((uri) =>
    getResponse(
      200,
      findMatch(uri) ? [
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
      ] : []
    )
  );

nock('https://api.veriff.internal')
  .persist()
  .get(/\/media-context\/[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)
  .delay(1000)
    .reply((uri) =>
      getResponse(
        200,
        findMatch(uri) ? [
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
            id: '5da01045-6baf-482c-9913-5ce069bbec96',
            mediaId: '7f2dcbd8-5b5f-4f1a-bfa4-016ddf4dd662',
            context: 'front',
            probability: 0.8734357
          },
          {
            id: '2ab2e6fe-6727-4a04-bbdf-9f012569bce9',
            mediaId: '40851916-3e86-45cd-b8ce-0e948a8a7751',
            context: 'front',
            probability: 0.9264236
          }
        ] : []
      )
    );
