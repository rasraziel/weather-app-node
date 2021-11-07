const app = require('./app').app;
let port = process.env.PORT || 80;


const server = app.listen(port, (error) => {
    if (error) {
        console.log(error);
    }
    console.log("Server is running on port", server.address().port);
});

