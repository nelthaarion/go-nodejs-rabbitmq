package main

import (
	"encoding/json"
	"log"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
)

func main() {
	conn := connectToBroker()
	channel, err := conn.Channel()
	if err != nil {
		log.Println(err)
	}
	err = channel.ExchangeDeclare("my_exchange", "topic", true, false, false, false, nil)
	if err != nil {
		log.Println(err)
	}
	counter := 1
	for {
		data, _ := json.Marshal(map[string]int{"number": counter})
		err := channel.Publish("my_exchange", "AMQP.TEST", false, false, amqp.Publishing{
			Body:        data,
			ContentType: "application/json",
		})
		if err != nil {
			log.Fatal(err)
		}
		counter++
		time.Sleep(time.Second * 3)
	}
}

func connectToBroker() *amqp.Connection {
	counter := 0
	URL := "amqp://guest:guest@localhost:5672"
	for {
		conn, err := amqp.Dial(URL)
		if err != nil {
			log.Println(err)
			time.Sleep(2 * time.Second)
			counter++
		} else {
			return conn
		}
		if counter > 10 {
			log.Panicln("connection failed!")
		} else {
			log.Println("retying connection...")
			continue
		}
	}
}
