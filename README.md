# To run this Project you will need to have Node.js v14.15.1 or later installed
https://nodejs.org/en/

In the project directory, you will need to run:

### `npm install`
### `npm start`

Runs the app in the development mode.\
Open [http://localhost/](http://localhost/) to view it in the browser.
Also deployed on Render Cloud:
Open [https://weather-app-node.onrender.com](https://weather-app-node.onrender.com) to view it in the browser.
Bear in mind that the Render deployment goes into sleep-mode when no requests are sent as I'm using the free dynos.
It takes roughly 20 seconds to load on the browser, after which it works normally and goes back to sleep after 30 minutes of inactivity.

You can send GET requests direcly if on localhost e.g.

http://localhost/?city=Frederiksberg

http://localhost/?city=Valby

Or if you want to use the heroku deployment:

https://weather-app-node.onrender.com/?city=Frederiksberg

https://weather-app-node.onrender.com/?city=Valby


Finally you can also use the UI of the deployed frontend React app: Open https://weather-app-react-xaht.onrender.com/ to view it in the browser.
If Javascript is disabled you will be redirected to the Node backend app automatically.

It can be used as a widget with iframe.
Just add the iframe tag to your html eg.
<iframe src="https://weather-app-node.onrender.com/?city=Copenhagen" width="450" height="450"></iframe>

## Other Available Scripts

In the project directory, you can run:

### `npm test`

Launches the Jest Unit Tests

### `npm run test_start`

Launches the Jest Unit Tests and then starts the application
