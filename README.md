---
owner: 'Client Tools'
description: 'JavaScript BE/FS test task.'
status: 'development'
criticality: 'none'
type: 'candidate test task'
---

<div id="top"></div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
        <a href="#about-the-test-task">About the test task</a>
        <ul>
            <li><a href="#background">Background</a></li>
            <li><a href="#specification">Specification</a></li>
            <li><a href="#additional-notes">Additional notes</a></li>
            <li><a href="#technologies-we-use">Technologies we use</a></li>
        </ul>
    </li>
    <li>
        <a href="#getting-started">Getting started</a>
        <ul>
            <li><a href="#prerequisites">Prerequisites</a></li>
            <li><a href="#installation">Installation</a></li>
            <li><a href="#testing">Testing</a></li>
        </ul>
    </li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

## About the test task

The aim of this test task is to measure the technical capabilities of a candidate on building well structured RESTful
APIs using best practices and well known patterns.

### Background
Say we have a verification flow where the user is asked to upload both sides of the document. For each step in the
verification flow a different part of the document is asked to be uploaded.

* In the first step it is asked to upload an image containing the front side of the document, as a result `document-front`
  context is being set.
* In the second step it is asked to upload an image containing the back side of the document, as a result `document-back`
  context is being set.

Now there is an imperfection in the flow, if the user decides to upload the image of the **document back** in the
**first step**, there will be a misalignment of the uploaded image of the document side and the context. Also, so it
could happen that the user accidentally uploads the image of their knee or a keyboard. Fortunately we have an
automation to help us to identify the correct document side.

We have three service endpoints to use.

1. Session details endpoint `GET https://api.veriff.internal/sessions/:sessionId`
    ```javascript
    {
      id: '90d61876-b99a-443e-994c-ba882c8558b6', // UUID v4
      status: 'internal_manual_review'            // Status
    }
    ```
2. Session media endpoint `GET https://api.veriff.internal/sessions/:sessionId/media`
    ```javascript
    [
        {
          id: '7f2dcbd8-5b5f-4f1a-bfa4-016ddf4dd662', // UUID v4
          mimeType: 'image/png',                      // Media mime type
          context: 'document-front'                   // Media context type
        }
   ]
    ```
3. Media context endpoint `GET https://api.veriff.internal/media-context/:sessionId`
    ```javascript
    [
         {
            id: 'a4338068-d99b-416b-9b2d-ee8eae906eea',      // UUID v4
            mediaId: 'a6c90b4f-ddfc-49eb-89ad-05b7f1274f96', // UUID v4 related to media
            context: 'back',                                 // Detected media context type (front, back, none - in case the image is irrelevant)
            probability: 0.9739324                           // Probability value
          }
   ]
    ```

### Specification

The acceptance criteria for the required feature would be to create a RESTful GET endpoint that returns the session
and media with combined details relevant to the consumer of the API.

The structure of the RESTful GET endpoint would be defined by you, but it should meet the following criteria:
1. Fix the media context in the response using `/sessions/:sessionId/media` and `/media-context/:sessionId` endpoints to
   have only relevant and corrected media as a result
2. Group media by the context type
3. Irrelevant media must be filtered out
4. Media list must be sorted by probability descending
5. Implement at least one test, which must pass on every run

### Additional notes

1. We kindly ask you to use `sessionId` `90d61876-b99a-443e-994c-ba882c8558b6` as an input for the endpoints.
2. Change files, project structure as you see fit, but please make sure the initial logic itself in `externalService.ts` is intact.
3. If you feel that you lack some of the types or interfaces from a given files, you can introduce them as well.
4. Please use git while working on the test task, this is important for us to understand how you approach to the solution. While creating zip package with your test task solution, make sure to include `.git` folder.
5. We would not set a deadline for when to complete the task, but we would want you to give us the time estimate of how long the test task will take. Kindly noting that we appreciate the quality over the speed of delivery.

### Technologies we use

Here is the list of the technologies we use in our services daily:
* [TypeScript](https://www.typescriptlang.org)
* [Express](https://expressjs.com/)
  * [NestJS](https://nestjs.com)
* [Jest](https://jestjs.io)
* [PostgreSQL](https://www.postgresql.org)
* [Redis](https://redis.io)
* [RabbitMQ](https://www.rabbitmq.com)
* [CircleCI](https://circleci.com)
* [Docker](https://www.docker.com)

<p align="right">(<a href="#top">back to top</a>)</p>

## Getting started

### Prerequisites
This project is set up with NodeJS LTS version 14 in mind https://nodejs.org/download/release/latest-v14.x with a
default packaged NPM

### Installation
1. Install the dependencies
   ```sh
   npm install
   ```
2. Run the service
   ```sh
   npm start
   ```
   
### Testing
1. Run the tests
   ```sh
   npm test
   ```

<p align="right">(<a href="#top">back to top</a>)</p>

## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>
