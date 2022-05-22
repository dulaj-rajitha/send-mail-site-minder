# Email Sender
This application has multiple send mail providers. If one provider failed, it'll keep on trying to perform the intended action.

Application use a abstracted email sending provider pool. In the email service, we can define an array of email providers who have the functionality 
of sending email by given parameters.

We can consider them as child classes (implementations) of the parent class (TS interface) which will do just a sending and email (and sending an email only)

## Notes
### SendGrid Provider
* For sendGrid API, API key is only validated with email address for from as: `dulajrajitha@gmail.com`
* For other `from` input emails, it'll exceed the max attempts
* All the emails were marked as SPAM, so you may have to check on the SPAM folder too


# Deployment
* Deployed on Heroku: 
  * [Swagger API Docs](https://email-sender-dulaj.herokuapp.com/api-docs/#/default/post_email_)

# Deployment steps
* This app has a Heroku remote, and it'll deploy from there. 
  * **Notes**
    * Had an authentication issue with my git account connection with Heroku and therefore the GitHub remote it not auto deploying the changes
```
$ git add .
$ git commit -am "make it better"
$ git push heroku master
```

# Start Locally
### Start Service
Set up the .env file with correct values, then run the following
```shell
npm start
```
* The application is written on top of Express framework, 
* but the application's business logic is isolated in a service and, therefore we have the flexibility on changing the web framework at any time.
* for the API documentation used swagger generation library and, it's defined at the individual routes level
* for the logs I added `log4js` as a wrapper, so this can be removed or changed to a different logger (since it's wrapped, only the logger class implementation to be changed)

#### To view the Swagger UI:
open : [swagger](http://localhost:8080/api-docs)

# Run tests
Tests are running using nyc and mocha 
```shell
npm run test
```

# Core Concept
* At the mailer service, it has multiple mailer providers (as a service provider resource pool)
* The mailer service will select a provider from the pool using simple round-robin manner.
* If the selected provider failed to successfully send the email, an error will be thrown and if so
  * then it'll recursively try for the next provider and keep on trying
  * I added a maximum retry attempts value so that if the maximum retries are exceeded (10 attempts configurable by ENV), the FE will receive max attempts reached error

# Project Layers

All the HTTP requests will be following the path as 
`routes-> middlewares -> controllers -> services -> resources`

## `app.js`
* This is the main entry point to the app. staring app using the 

## `api` folder
* The main source folder
  * This has subdirectories based on the functionality levels 

### `api/configs` folder
* static configurations (hardcoded configs) and
* dynamic run time configs that are defined by the environment variables are here
  * in the GIT, the .env is ignored so that the sensitive information will not be stored there. (sample template file added just to identify the keys being used)
  * The environment values are set at the Heroku configs as Config Vars (including `NODE_ENV`)

#### `validations` folder
  * The schema validations are stored in this folder. Used the Joi library for validate the request schema and added a middleware to handle input validations before hit the controller layers

## `api/routes` folder
* All the request route definitions are defined here (routes pattern and the applicable middlewares)

## `middlewares` folder
* error handler: all the run time errors/ exceptions will be handled here. 
  * We can do some enhancements to handle custom errors (define custom errors to be thrown from the services and define a custom error code associated there), 
    * then we can capture the error and send a proper HTTP response based on the error

## `controllers` folder
* will do the main request response handling here. if any error occured on a async function call, send the error to the `next()` so that it'll be handled in the middleware

## `services` folder
* application business logic is here. It'll have the application logics and it has access to any resources and utils/ helpers.
* If there is any custom error, we can throw them in this layer so that it'll be automatically send to the FE

## `resources` folder
* parent class(interface like) to define the main functionality of a email provider
* 2 implementations for the SendGrid and MailGun email providers

# Enhancements
* ### TypeScript Code
  * The app written with cjs style with javascript, but it's better to write the application using typescript and 
  create interface and implementations for the mail provider
    * I did not go with ts due time limitations and only mocked a functionality of a extended interface, but if it was ts, we can define the service provider poll with correct type and it's guaranteed that oll the elements will have the same functionality implemented 

* ### Service Mesh with Fail-over policies. 
  * We can use a service mesh with defined fail-over policies.
  * We can create multiple services and each one just to send the email by a email provider (specific email provider)
  * Then these services will be part of a service mesh representing a single microservice.
  * Then all the load balancing and if a service fails, retry with different service logic will be handled by the service mesh.
    * With Linkerd and Istio, I remember that this functionality is possible
    * Then the application logic is not needed to handle this, it'll be handled entirely and our code will be much simpler
  * Not fully sure on the technical feasibility of this solution, but worth a try to offload those logics from the application code

* ### use a request queue for calling the mail providers
  * Currently, from the app, the load on the mail provider is not handled. So this'll create a backpressure on the mail server APIs.
  * But we can create individual request queue for each provider (in memory or in a DB) and until a request completed, we can wait on not to send a request.
  * Since the application is witten on top of a interface, we can add this queue handing to a parent class
    * Mail provider will poll from the queue and send email
    * if queue is empty, will do nothing
    * mail service will distribute the load (push mail requests) for service provider queues (using weighted round-robin)
    * if a provider flied to send the email, service will know that
      * Then mail service can send the same request to a different queue

* ### Integrate DB layer like redis to keep provider metadata
  * keep the success status of a service provider that'll be invalidated over time
  * keep the number of pending jobs for a provider (based on that, can distribute next request using a weighted round-robin manner)

* ### Introduce some persistence layer and worker-threads for the requests if the service providers are slow
  * If the application error rate and load it getting larger, it may be some extra time to send emails.
  * Therefore, we can introduce a DB level persistence with the request state
    * As transaction stats, we can immediately send the status to the FE as transaction started (accepted response). Then we can return a request ID (uuid) as a reference.
    * Then we can create another API to get the transaction status
    * #### Worker Threads
      * If the service providers are slow or if we need to leverage more performance, we can use worker threads
      * Then main thread won't be used for the HTTP requests handling of email providers, it'll be taken care by parallel worker thread pool.
      * Conceptually, this should be more effective
    * Scaling: the app can be horizontally scalable as well, but still we have the bottleneck of the service provider


* ### Heroku GitHub integration
  * My GitHub account connection with Heroku keep on failing with internal server error. 
    * Since I'm new to Heroku, did not spent more time on it, so I manually deployed using the Heroku cli instead of the github auto deploy 

* ### Setting up full CICD pipeline with multiple deployment environments
  * Possible CICD stages
    * build 
    * test - run unit and any e2e tests
    * static code analysis and code vulnerability scan
    * deploy

* ### Authentication
  * Added an empty middleware to handle the authentication. to implement the bearer and basic/ key based authentications as per new requirements

* ### Testing
  * Added some unit tests only to cover the services and there are more branches to cover

* ### Not fully completed the API integration with SengGrid and MailGun
  * TODO: completed before submission
