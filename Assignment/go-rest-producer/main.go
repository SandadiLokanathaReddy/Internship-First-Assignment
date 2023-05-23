package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/apache/pulsar-client-go/pulsar" // pulsar
	"github.com/julienschmidt/httprouter"       // httprouter
)





type User struct {
	Name string `json:"name"`
	Email string `json:"email"`
	Phone string `json:"phone"`
	Dept string `json:"dept"`
}
type UserWithId struct {
	Id string `json:"id"`
	Name string `json:"name"`
	Email string `json:"email"`
	Phone string `json:"phone"`
	Dept string `json:"dept"`
}
type POHeader struct {
	PONumber string `json:"ponumber"`
	POAgent string `json:"poagent"`
	SupplierId string `json:"supplierid"`
	SupplierName string `json:"suppliername"`
	ShipViaService string `json:"shipviaservice"`
	ContactName string `json:"contactname"`
	IssueDate string `json:"issuedate"`
}


// 
var client pulsar.Client
var producerForUser, producerForPOHeader pulsar.Producer
var (
    userSchemaDef = "{\"type\":\"record\",\"name\":\"User_Producer_Schema\",\"namespace\":\"test\"," +
    "\"fields\":[{\"name\":\"Id\",\"type\":\"string\"},{\"name\":\"Name\",\"type\":\"string\"},{\"name\":\"Email\",\"type\":\"string\"},"+
	"{\"name\":\"Phone\",\"type\":\"string\"},{\"name\":\"Dept\",\"type\":\"string\"}]}"
)
var (
	poHeaderSchemaDef = "{\"type\":\"record\",\"name\":\"POHeader_Producer_Schema\",\"namespace\":\"test\"," +
    "\"fields\":[{\"name\":\"PONumber\",\"type\":\"string\"},{\"name\":\"POAgent\",\"type\":\"string\"},{\"name\":\"SupplierId\",\"type\":\"string\"},{\"name\":\"SupplierName\",\"type\":\"string\"},"+
	"{\"name\":\"ShipViaService\",\"type\":\"string\"},{\"name\":\"ContactName\",\"type\":\"string\"},{\"name\":\"IssueDate\",\"type\":\"string\"}]}"

)


func instantiateClient(url string) {
	var err error
	client, err = pulsar.NewClient(pulsar.ClientOptions{
		URL : url,
		OperationTimeout: 30 * time.Second,
		ConnectionTimeout: 30 * time.Second,
	})
	if err != nil {
		log.Fatalf("Could not instantiate Pulsar client : %v", err)
	} else {
		fmt.Println("Pulsar Client instantiated successfully")
	}
}
func instantiateProducer(topic string, producerName string, sch string) pulsar.Producer {
	properties := make(map[string]string)
	properties["name"] = "schema for " + producerName
	schema := pulsar.NewJSONSchema(sch, properties)
	var err error
	producer, err := client.CreateProducer(pulsar.ProducerOptions{
		Topic: topic,
		Name: producerName,
		Schema: schema,
	}) 
	if err != nil {
		log.Fatalf("Failed to create Producer : %v", err)
	} else {
		fmt.Println(producerName +" created successfully")
	}
	return producer
}



func updateuser(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	fmt.Println("Entering updateUser")
	var user UserWithId
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		fmt.Println("Failed at decoding user info")
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	mesgId, err := producerForUser.Send(context.Background(), &pulsar.ProducerMessage{
		Value : &user,
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		fmt.Println("Failed to publish message to user update topic:", err)
	} else {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		resp := make(map[string]string)
		resp["message"] = "User Details Published To Pulsar Successfully"
		json.NewEncoder(w).Encode(resp)
		fmt.Println("Message (updateUser) has been published with id:", mesgId)
	}
	fmt.Println("Exiting updateUser")
}



func updatePOHeader(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	fmt.Println("Entering updatePOHeader")
	var poh POHeader
	err := json.NewDecoder(r.Body).Decode(&poh)
	if err != nil {
		fmt.Println("Failed at decoding po header details")
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	mesgId, err := producerForPOHeader.Send(context.Background(), &pulsar.ProducerMessage{
		Value : &poh,
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		fmt.Println("Failed to publish message to po header update topic:", err)
	} else {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		resp := make(map[string]string)
		resp["message"] = "PO Header Details Published To Pulsar Successfully"
		json.NewEncoder(w).Encode(resp)
		fmt.Println("Message (updatePOHeader) has been published with id:", mesgId)
	}
	fmt.Println("Exiting updatePOHeader");
}






func createUser(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	fmt.Println("Entering createUser")
	var newUser User
	err := json.NewDecoder(r.Body).Decode(&newUser)
	if err != nil {
		fmt.Println("Failed at decoding user info")
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	resp := make(map[string]string)
	resp["message"] = "customer added successfully"
	json.NewEncoder(w).Encode(resp) // later, pass resp here


	// publishing newUser to pulsar
	mesgId, err := producerForUser.Send(context.Background(), &pulsar.ProducerMessage{
		Value : &newUser,
	})
	if err != nil {
		fmt.Println("Failed to publish message:", err)
	} else {
		fmt.Println("Message has been published with id:", mesgId)
	}

	// errorResponse(w, "customer added successfully", http.StatusOK)
	fmt.Println("Exiting createUser")
}




// func errorResponse(w http.ResponseWriter, message string, httpStatusCode int) {
// 	w.Header().Set("Content-Type", "application/json")
// 	w.WriteHeader(httpStatusCode)
// 	resp := make(map[string]string)
// 	resp["message"] = message
// 	jsonResp, _ := json.Marshal(resp)
// 	w.Write(jsonResp)
// }





func main() {

	router := httprouter.New()
	

	router.GlobalOPTIONS = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Access-Control-Allow-Origin", "http://localhost:3000")
    	w.Header().Add("Access-Control-Allow-Credentials", "true")
    	w.Header().Add("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
    	w.Header().Add("Access-Control-Allow-Methods", "PATCH, POST, GET, OPTIONS, PUT, DELETE")

		if r.Method == "OPTIONS" {
			http.Error(w, "No Content", http.StatusNoContent)
			return
		}
	})


	// Initializing Client and Producer
	pulsarUrl := "pulsar://localhost:6650"
	topicUser := "update-user-topic"
	topicPOHeader := "update-POH-topic"

	instantiateClient(pulsarUrl)
	producerForUser = instantiateProducer(topicUser, "Producer For user", userSchemaDef)
	producerForPOHeader = instantiateProducer(topicPOHeader, "Producer For PO Header", poHeaderSchemaDef)
	defer client.Close()
	defer producerForUser.Close()
	defer producerForPOHeader.Close()



	
	// We use Ctrl+C to close server
	// So, catch the signal and perform cleanup before terminating
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt, syscall.SIGTERM)
	go func () {
		<-c
		producerForUser.Close()
		producerForPOHeader.Close()
		client.Close()
		log.Fatal("Server closed due to interruption (Ctrl+C)")
	}()



	// router.POST("/newuser", createUser)
	// for updating user details (publish to pulsar)
	router.PUT("/updateuser", updateuser)

	// for updating po header (publish to pulsar)
	router.PUT("/updatepoheader", updatePOHeader)


	log.Fatal(http.ListenAndServe(":5000", router))


	
}



