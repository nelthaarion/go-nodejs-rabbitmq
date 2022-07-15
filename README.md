# go-nodejs-rabbitmq
A simple project for communicating between Go and Nodejs using rabbitmq message broker 


# Run and start
for this example, publisher has written with go and consumer with nodejs 

1 - start rabbitmq service or container 

2 - to start consumer: 
    node consumer/app.js
    
3 - to start publisher: 
    go run publisher/main.go