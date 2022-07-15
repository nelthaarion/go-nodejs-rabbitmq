const serve = async ()=> {
    const amqp = require("amqplib")
    
    let conn = await amqp.connect("amqp://guest:guest@localhost:5672")

    let channel = await conn.createChannel()
    
    let mainExchange = await channel.assertExchange("my_exchange", "topic", {
        durable: true,
        autoDelete: false
    })
    let deadLetterExchange = await channel.assertExchange("my_exchange_dlx", "topic" )


    let mainQueue = await channel.assertQueue("test_messages", {
        deadLetterExchange: deadLetterExchange.exchange,
        durable: true,
        messageTtl: 1000000 ,
        
    })
    let dlxQueue = await channel.assertQueue("test_messages_dlx" , {messageTtl: 100000})

    channel.bindQueue(
        mainQueue.queue,
        mainExchange.exchange,
        "AMQP.*"
    )
    channel.bindQueue(dlxQueue.queue, deadLetterExchange.exchange , "AMQP.*")

    channel.consume(mainQueue.queue, msg => {
        let data = JSON.parse(msg.content.toString())
       
        if (data.number % 3 == 0) 
            {   
                channel.nack(msg , false , false)
            }
        else 
        {    
            console.log(` message => ${ data.number }       rejected => ${data.number % 3 == 0}         exchange => ${mainExchange.exchange}`);

            channel.ack(msg) 
         }
    })

    channel.consume(dlxQueue.queue, msg => {
        let data = JSON.parse(msg.content.toString())
        console.log(` message => ${ data.number }       rejected => true        exchange => ${deadLetterExchange.exchange}`);
        channel.ack(msg)
    })

    channel.on("error" , console.log)
    channel.on("close", () => {
        console.log("CLOSED")
    })
    
} 
serve()