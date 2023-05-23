package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"syscall"
	"time"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"

	"github.com/apache/pulsar-client-go/pulsar"
	"github.com/julienschmidt/httprouter"
	_ "github.com/lib/pq"
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
// type POLineItem struct {
// 	Id string `json:"id"`
// 	Quantity string `json:"quantity"`
// 	Description string `json:"description"`
// 	MaterialCode string `json:"materialcode"`
// 	Color string `json:"color"`
// 	Width string `json:"width"`
// 	Length string `json:"length"`
// 	ProductId string `json:"productid"`
// 	DueDate string `json:"duedate"`
// 	PONumber string `json:"ponumber"` 
// }
type POLineItem struct {
	Id string `json:"id"`
	Quantity string `json:"quantity"`
	Description string `json:"description"`
	MaterialCode string `json:"materialcode"`
	Color string `json:"color"`
	Width string `json:"width"`
	Length string `json:"length"`
	ProductId string `json:"productid"`
	DueDate string `json:"duedate"`
	PONumber string `json:"ponumber"` 
}





var db *sql.DB
const (
	host = "localhost"
	port = "5432"
	dbuser = "postgresuser"
	password = "mypassword"
	dbname = "user_db"
)
func openConnection() *sql.DB {
	psqlInfo := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable", host, port, dbuser, password, dbname)
	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		log.Fatalf("Failed to create a database connection: %v\n", err)
	}
	err = db.Ping()
	if err != nil {
		log.Fatalf("Failed(at ping) to create a database connection: %v\n", err)
	}
	fmt.Println("Db connection success")
	return db
}

var m *migrate.Migrate
func initializeAndRunUpMigrations(migrationPathURL string, dbURL string) {
	var err error
	m, err = migrate.New(migrationPathURL, dbURL)
	if err != nil {
		log.Fatal("Failed to create new migrate instance:", err)
	}
	err = m.Up();
	if err != nil && err != migrate.ErrNoChange{
		log.Fatal("Failed to run migrate Up:", err)
	}
	fmt.Println("Executed migrate Up Successfully.")
}
func runDownMigrations() {
	err := m.Down()
	if err != nil {
		log.Fatal("Failed to run migrate Down:", err)
	}
	fmt.Println("Executed migrate Down Successfully. ")
}



func getUsingId(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	fmt.Println("Entering getUsingId")
	var givenId = ps.ByName("id")
	userId, err := strconv.ParseInt(givenId, 10, 32)
	if err != nil {
		errorResponse(w, "Cannot convert string id to int id", http.StatusInternalServerError)
		fmt.Println("Cannot convert string id to int id\nExiting getUsingId")
		return
	}
	if ! isValidUserId(db, int(userId)) {
		errorResponse(w, "No User Found With The Specified Id", http.StatusNotFound)
		fmt.Println("No User Found With The Specified Id\nExiting getUsingId")
		return
	}
	var reqUser UserWithId
	var user_dept_id int
	searchStatement := `select "name", "email", "phone", "user_dept_id" from userdetails.user where "id"=$1`
	e := db.QueryRow(searchStatement, userId).Scan(&reqUser.Name, &reqUser.Email, &reqUser.Phone, &user_dept_id)
	if e != nil {
		errorResponse(w, "Failed to fetch user data (in getUsingId)", http.StatusInternalServerError)
		fmt.Println("Failed to fetch user data (in getUsingId):", err,"\nExiting getUsingId")
		return
	}
	reqUser.Id = givenId
	
	// get dept_name from "department" table
	var dept_name string
	queryStatement := `select "dept_name" from userdetails.department where "dept_id"=$1`
	err2 := db.QueryRow(queryStatement, user_dept_id).Scan(&dept_name)
	if err2 != nil {
		errorResponse(w, "Failed to fetch the user department name in the getUsingId", http.StatusInternalServerError)
		fmt.Println("Failed to fetch the user department name in the getUsingId\nExiting getUsingId")
		return
	}
	reqUser.Dept = dept_name
	fmt.Println("requested user is:",reqUser)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(reqUser)
	fmt.Println("Exiting getUsingId")
}



func getUsingName(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	fmt.Println("Entering getUsingName")
	var name = ps.ByName("name")
	var reqUser UserWithId
	var user_dept_id int

	searchStatement := `select * from userdetails.user where "name"=$1`
	rows, err := db.Query(searchStatement, name)
	if err != nil {
		errorResponse(w, "Failed to fetch user data (in getUsingName):", http.StatusInternalServerError)
		fmt.Println("Failed to fetch user data (in getUsingName):", err, "\nExiting getUsingName")
		return
	}
	if rows.Next() {
		rows.Scan(&reqUser.Id, &reqUser.Name, &reqUser.Email, &reqUser.Phone, &user_dept_id)
	} else {
		errorResponse(w, "No User Found With The Specified Name", http.StatusNotFound)
		fmt.Println("No User Found With The Specified Name\nExiting getUsingName")
		return
	}
	// get dept_name from "department" table
	queryStatement := `select * from userdetails.department where "dept_id"=$1`
	row := db.QueryRow(queryStatement, user_dept_id)
	var dept_name string
	var dept_id int
	err2 := row.Scan(&dept_id, &dept_name)
	if err2 != nil {
		errorResponse(w, "Failed to fetch the user department name in the getUsingName function", http.StatusInternalServerError)
		fmt.Println("Failed to fetch the user department name in the getUsingName\nExiting getUsingName")
		return
	}
	reqUser.Dept = dept_name
	fmt.Println("requested user is:",reqUser)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(reqUser)
	fmt.Println("Exiting getUsingName")
}




func createUser(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	fmt.Println("Entering createUser")
	var newUser User
	err := json.NewDecoder(r.Body).Decode(&newUser)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		fmt.Println("Failed at decoding request body")
		fmt.Println("Exiting createUser")
		return
	}
	w.Header().Set("Content-Type", "application/json")
	resp := make(map[string]string)

	dept_id, err2 := getDeptId(db, newUser.Dept)
	if err2 != nil {
		errorResponse(w, "Error while fetching dept_id, check whether dept_name is proper or not", http.StatusBadRequest)
		fmt.Println("Error while fetching dept_id, check whether dept_name is proper or not\nExiting createUser")
		return
	}

	// Now, insert the details into the "user" table
	insertStatement := `insert into userdetails.user ("name", "email", "phone", "user_dept_id") values ($1, $2, $3, $4) returning id;`
	var id int
	err3 := db.QueryRow(insertStatement, newUser.Name, newUser.Email, newUser.Phone, dept_id).Scan(&id)
	if err3 != nil {
		http.Error(w, "Unable to perform insert operation", http.StatusInternalServerError)
		fmt.Println("Unable to perform insert operation:", err3, "\nExiting createUser")
		return
	}
	w.WriteHeader(http.StatusOK)
	resp["message"] = "User Details Added Successfully"
	resp["id"] = strconv.Itoa(id)
	json.NewEncoder(w).Encode(resp)
	fmt.Println(newUser, "User Details Stored In DB With Id", id)
	
	fmt.Println("Exiting createUser")

}


func getDeptId(db *sql.DB, dep string) (int, error) {
	var dept_id int
	st := `select "dept_id" from userdetails.department where "dept_name"=$1 ;`
	err := db.QueryRow(st, dep).Scan(&dept_id)
	if err != nil {
		fmt.Println("Error in getDeptId:", err)
		return -1, err
	}
	return dept_id, nil
}


func getOldDetails(db *sql.DB, id int) (UserWithId, int) {
	var user UserWithId
	var deptId int
	searchStatement := `select "name", "email", "phone", "user_dept_id" from userdetails.user where "id"=$1 ;`
	err := db.QueryRow(searchStatement, id).Scan(&user.Name, &user.Email, &user.Phone, &deptId)
	if err != nil {
		log.Fatal("Failed to fetch user data (in getNewDetails):", err)
	}
	user.Id = strconv.Itoa(id)
	return user, deptId
}



var updateUserCnl chan pulsar.ConsumerMessage = make(chan pulsar.ConsumerMessage)
func consumerListenForUserUpdate(client pulsar.Client, topic string, db *sql.DB) {
	fmt.Println("Entering consumerListenForUserUpdate")
	consumer, err := client.Subscribe(pulsar.ConsumerOptions{
		Name: "User Update Consumer",
		Topic : topic,
		SubscriptionName: "Sub",
		Type: pulsar.Exclusive,
		MessageChannel: updateUserCnl,
	})
	if err != nil {
		log.Fatalf("Failed to create Consumer for updating user details: %v", err)
	}
	defer consumer.Close()
	// updateConsumer Listening
	for cm := range updateUserCnl {
		fmt.Println("Inside consumerListenForUserUpdate loop")
		msg, cns := cm.Message, cm.Consumer
		
		var user UserWithId
		err := json.Unmarshal(msg.Payload(), &user)
		if err != nil {
			fmt.Printf("Improper user details: %v\n", user)
			fmt.Println("Failed at unmarshal step. Re-enter the details")
			cns.AckID(msg.ID())
			continue
		}
		
		userId, _ := strconv.ParseInt(user.Id, 10, 64)
		if ! isValidUserId(db, int(userId)) {
			fmt.Println("Provided user id doesn't exist. No changes will be made in the DB")
			cns.AckID(msg.ID())
			continue
		}
		userDeptId := -1
		newUser, oldDeptId := getOldDetails(db, int(userId))
		fmt.Println("before ops, newUser is:", newUser)

		if user.Name != "" {
			newUser.Name = user.Name
		}
		if user.Email != "" {
			newUser.Email = user.Email
		}
		if user.Phone != "" {
			newUser.Phone = user.Phone
		}
		if user.Dept != "" {
			userDeptId, err = getDeptId(db, user.Dept)
			if err != nil {
				fmt.Println("(inside updateConsumer loop) Error while fetching dept_id, check whether dept_name is proper or not. Re-enter details")
				cns.AckID(msg.ID())
				continue
			}
		} else {
			userDeptId = oldDeptId
		}
		fmt.Println("after ops, newUser is:", newUser)

		updateStatement := `update userdetails.user set "name"=$1, "email"=$2, "phone"=$3, "user_dept_id"=$4 where "id"=$5 ;`
		_, e := db.Exec(updateStatement, newUser.Name, newUser.Email, newUser.Phone, userDeptId, userId)
		if e != nil {
			log.Fatalf("Unable to perform user update operation: %v\n", e)
		} else {
			cns.AckID(msg.ID())
			fmt.Printf("User(%v) details updated in db\n", userId)
		}
	}	
	fmt.Println("\nExiting consumerListenForUserUpdate")
}


func isValidUserId(db *sql.DB, id int) bool {
	var deptId int
	searchStatement := `select "user_dept_id" from userdetails.user where "id"=$1 ;`
	err := db.QueryRow(searchStatement, id).Scan(&deptId)
	return err == nil
}





var cnl chan pulsar.ConsumerMessage = make(chan pulsar.ConsumerMessage)
func consumerListen(client pulsar.Client, topic string, db *sql.DB) {
	// Consumer Listening
	consumer, err := client.Subscribe(pulsar.ConsumerOptions{
		Name: "Consumer One",
		Topic : topic,
		SubscriptionName: "Sub",
		Type: pulsar.Exclusive,
		MessageChannel: cnl,
	})
	if err != nil {
		log.Fatalf("Failed to create Consumer: %v", err)
	}
	defer consumer.Close()

	for cm := range cnl {
		// fmt.Println("inside consumer channel for range loop")
		msg, cns := cm.Message, cm.Consumer
		cns.AckID(msg.ID())
		
		var user User
		err := json.Unmarshal(msg.Payload(), &user)
		if err != nil {
			log.Fatalf("Improper user details: %v\n", user)
			panic(err)
		}
		insertStatement := `insert into userdetails.user ("name", "email", "phone") values ($1, $2, $3) returning id;`
		var id int
		e := db.QueryRow(insertStatement, user.Name, user.Email, user.Phone).Scan(&id)
		if e != nil {
			log.Fatalf("Unable to perform insert operation: %v\n", e)
		} else {
			// cns.AckID(msg.ID())
			fmt.Println(user, "User Details stored in db with id", id)
		}
	}	
	fmt.Println("\nExiting consumerListen")
}


func errorResponse(w http.ResponseWriter, message string, httpStatusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(httpStatusCode)
	resp := make(map[string]string)
	resp["message"] = message
	jsonResp, _ := json.Marshal(resp)
	w.Write(jsonResp)
}



// functions for po

func createPOHeader(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	fmt.Println("Entering createPoHeader")
	var newPoHeader POHeader
	err := json.NewDecoder(r.Body).Decode(&newPoHeader)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		fmt.Println("Failed at decoding request body\nExiting createPOHeader")
		return
	}
	w.Header().Set("Content-Type", "application/json")
	resp := make(map[string]string)

	// get suppliername using supplierid
	suppName, err := getSupplierName(db, newPoHeader.SupplierId)
	if err != nil {
		errorResponse(w, "No supplier found with given supplierid", http.StatusInternalServerError)
		fmt.Println("No supplier found with given supplierid (Error in getSupplierName)\nExiting createPOHeader")
		return
	}
	newPoHeader.SupplierName = suppName

	// Now, insert the details into the "poheader" table
	insertStatement := `insert into po.poheader ("poagent", "supplierid", "suppliername", "shipviaservice", "contactname", "issuedate") values ($1, $2, $3, $4, $5, $6) returning ponumber;`
	var ponumber int
	err1 := db.QueryRow(insertStatement, newPoHeader.POAgent, newPoHeader.SupplierId, newPoHeader.SupplierName, newPoHeader.ShipViaService, newPoHeader.ContactName, newPoHeader.IssueDate).Scan(&ponumber)
	if err1 != nil {
		http.Error(w, "Unable to perform insert operation", http.StatusInternalServerError)
		fmt.Println("Unable to perform insert operation:", err1, "\nExiting createPOHeader")
		return
	}

	w.WriteHeader(http.StatusOK)
	resp["message"] = "PO Header Details Added Successfully"
	resp["ponumber"] = strconv.Itoa(ponumber)
	json.NewEncoder(w).Encode(resp)
	fmt.Println(newPoHeader, "PO Header Details Stored In DB With PoNumber", ponumber)
	
	fmt.Println("Exiting createPOHeader")

}

func createPOLineItem(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	fmt.Println("Entering createPoLineItem")
	var newPoLineItem POLineItem
	err := json.NewDecoder(r.Body).Decode(&newPoLineItem)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		fmt.Println("Failed at decoding request body\nExiting createPoLineItem")
		return
	}
	w.Header().Set("Content-Type", "application/json")
	resp := make(map[string]string)

	// check whether provided "ponumber" exists or not
	poNum, err := strconv.ParseInt(newPoLineItem.PONumber, 10, 32)
	if err != nil {
		errorResponse(w, "Cannot convert string PO Number to int", http.StatusInternalServerError)
		fmt.Println("Cannot convert string PO Number to int id\nExiting createPoLineItem")
		return
	}
	if !isValidPoNumber(db, int(poNum)) {
		errorResponse(w, "No PO Found With The Specified PO Number", http.StatusNotFound)
		fmt.Println("No PO Found With The Specified PO Number\nExiting createPoLineItem")
		return
	}

	// Now, insert the details into the "poheader" table
	insertStatement := `insert into po.polineitem ("quantity", "description", "materialcode", "color", "width", "length", "productid", "duedate", "ponumber") values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning id;`
	var id int
	err1 := db.QueryRow(insertStatement, newPoLineItem.Quantity, newPoLineItem.Description, newPoLineItem.MaterialCode, newPoLineItem.Color, newPoLineItem.Width, newPoLineItem.Length, newPoLineItem.ProductId, newPoLineItem.DueDate, newPoLineItem.PONumber).Scan(&id)
	if err1 != nil {
		http.Error(w, "Unable to perform insert operation", http.StatusInternalServerError)
		fmt.Println("Unable to perform insert operation:", err1, "\nExiting createPoLineItem")
		return
	}

	w.WriteHeader(http.StatusOK)
	resp["message"] = "PO LineItem Details Added Successfully"
	resp["id"] = strconv.Itoa(id)
	json.NewEncoder(w).Encode(resp)
	fmt.Println(newPoLineItem, "PO LineItem Details Stored In DB With Id", id)
	
	fmt.Println("Exiting createPoLineItem")

}

func getSupplierName(db *sql.DB, supplierid string) (string, error) {
	var suppliername string
	st := `select "suppliername" from po.supplierdetails where "supplierid"=$1 ;`
	err := db.QueryRow(st, supplierid).Scan(&suppliername)
	if err != nil {
		fmt.Println("Error in getSupplierName:", err)
		return "-1", err
	}
	return suppliername, nil
}

func isValidPoNumber(db *sql.DB, ponumber int) bool {
	var num int
	searchStatement := `select "ponumber" from po.poheader where "ponumber"=$1 ;`
	err := db.QueryRow(searchStatement, ponumber).Scan(&num)
	return err == nil
}

func getUsingPONumber(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	fmt.Println("Entering getUsingPONumber")
	var givenPONumber = ps.ByName("ponumber")
	poNum, err := strconv.ParseInt(givenPONumber, 10, 32)
	if err != nil {
		errorResponse(w, "Cannot convert string poNumber to int", http.StatusInternalServerError)
		fmt.Println("Cannot convert string poNumber to int\nExiting getUsingId")
		return
	}
	if !isValidPoNumber(db, int(poNum)) {
		errorResponse(w, "No PO Found With The Specified PO Number", http.StatusNotFound)
		fmt.Println("No PO Found With The Specified PO Number\nExiting getUsingPONumber")
		return
	}
	var poHeader POHeader
	searchStatement := `select "ponumber", "poagent", "supplierid", "suppliername", "shipviaservice", "contactname", "issuedate" from po.poheader where "ponumber"=$1`
	e := db.QueryRow(searchStatement, poNum).Scan(&poHeader.PONumber, &poHeader.POAgent, &poHeader.SupplierId, &poHeader.SupplierName, &poHeader.ShipViaService, &poHeader.ContactName, &poHeader.IssueDate)
	if e != nil {
		errorResponse(w, "Failed to fetch POHeader details (in getUsingPONumber)", http.StatusInternalServerError)
		fmt.Println("Failed to fetch POHeader details (in getUsingPONumber)", err,"\nExiting getUsingId")
		return
	}
	poHeader.IssueDate = poHeader.IssueDate[:10]
	fmt.Println(poHeader)
	
	lineItems := []POLineItem{}
	searchStatement = `select "id", "quantity", "description", "materialcode", "color", "width", "length", "productid", "duedate", "ponumber" from po.polineitem where "ponumber"=$1`
	rows, err := db.Query(searchStatement, poHeader.PONumber)
	if err != nil {
		errorResponse(w, "Failed to fetch PO LineItems (in getUsingPONumber):", http.StatusInternalServerError)
		fmt.Println("Failed to fetch PO LineItems (in getUsingPONumber):", err, "\nExiting getUsingName")
		return
	}
	var poli POLineItem
	for rows.Next() {
		rows.Scan(&poli.Id, &poli.Quantity, &poli.Description, &poli.MaterialCode, &poli.Color, &poli.Width, &poli.Length, &poli.ProductId, &poli.DueDate, &poli.PONumber)
		poli.DueDate = poli.DueDate[:10]
		lineItems = append(lineItems, poli)
	}
	fmt.Println(lineItems)

	data := map[string]any{
		"poHeader" : poHeader,
		"poLineItems" : lineItems,
	}
	jsonRes, _ := json.Marshal(data)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonRes)


	fmt.Println("Exiting getUSingPONumber")
}

func updatePOLineItem(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	fmt.Println("Entering updatePOLineItem")
	w.Header().Set("Content-Type", "application/json")
	resp := make(map[string]string)
	var poli POLineItem
	err := json.NewDecoder(r.Body).Decode(&poli)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		fmt.Println("Failed at decoding request body\nExiting updatePOLineItem")
		return
	}
	qt, _ := strconv.ParseInt(poli.Quantity, 10, 32)
	wd, _ := strconv.ParseFloat(poli.Width, 64)
	lt, _ := strconv.ParseFloat(poli.Length, 64)
	updateStatement := `update po.polineitem set "quantity"=$1, "description"=$2, "materialcode"=$3, "color"=$4, "width"=$5, "length"=$6, "productid"=$7, "duedate"=$8 where "id"=$9 ;`
	_, e := db.Exec(updateStatement, qt, poli.Description, poli.MaterialCode, poli.Color, wd, lt, poli.ProductId, poli.DueDate, poli.Id)
	if e != nil {
		http.Error(w, e.Error(), http.StatusInternalServerError)
		fmt.Printf("Unable to perform updatePOLineItem operation: %v\nExiting updatePOLineItem\n", e)
		return
	}
	fmt.Println("PO LineItem details updated successfully")
	w.WriteHeader(http.StatusOK)
	resp["message"] = "PO LineItem details updated successfully"
	jsonRes, _ := json.Marshal(resp)
	w.Write(jsonRes)

	fmt.Println("Exiting updatePOLineItem")
}


var updatePOHCnl chan pulsar.ConsumerMessage = make(chan pulsar.ConsumerMessage)
func consumerListenForPOHeaderUpdate(client pulsar.Client, topic string, db *sql.DB) {
	fmt.Println("Entering consumerListenForPOHUpdate")
	consumer, err := client.Subscribe(pulsar.ConsumerOptions{
		Name: "Update POH Consumer",
		Topic : topic,
		SubscriptionName: "Sub",
		Type: pulsar.Exclusive,
		MessageChannel: updatePOHCnl,
	})
	if err != nil {
		log.Fatalf("Failed to create Consumer for updating po header details: %v", err)
	}
	defer consumer.Close()
	// updateConsumer Listening
	for cm := range updatePOHCnl {
		fmt.Println("Inside consumerListenForPOHeaderUpdate loop")
		msg, cns := cm.Message, cm.Consumer
		
		var poh POHeader
		err := json.Unmarshal(msg.Payload(), &poh)
		if err != nil {
			fmt.Printf("Improper po header details: %v\n", poh)
			fmt.Println("Failed at unmarshal step. Re-enter the details")
			cns.AckID(msg.ID())
			continue
		}

		// checking whether po number is valid or not
		ponum, _ := strconv.ParseInt(poh.PONumber, 10, 64)
		if ! isValidPoNumber(db, int(ponum)) {
			fmt.Println("Provided po number doesn't exist. No changes will be made in the DB")
			cns.AckID(msg.ID())
			continue
		}

		// get suppliername using supplierid
		suppName, err := getSupplierName(db, poh.SupplierId)
		if err != nil {
			fmt.Println("No supplier found with given supplierid (Error in getSupplierName). Cannot update po header details")
			continue
		}
		poh.SupplierName = suppName

		updateStatement := `update po.poheader set "poagent"=$1, "supplierid"=$2, "suppliername"=$3, "shipviaservice"=$4, "contactname"=$5, "issuedate"=$6 where "ponumber"=$7 ;`
		_, e := db.Exec(updateStatement, poh.POAgent, poh.SupplierId, poh.SupplierName, poh.ShipViaService, poh.ContactName, poh.IssueDate, poh.PONumber)
		if e != nil {
			log.Fatalf("Unable to perform update po header operation: %v\n", e)
		} else {
			cns.AckID(msg.ID())
			fmt.Printf("PO Header(%v) details updated in DB\n", poh.PONumber)
		}
	}	
	fmt.Println("\nExiting consumerListenForPOHeaderUpdate")
}







func main() {

	


	pulsarUrl := "pulsar://localhost:6650"
	topicUser := "update-user-topic"
	topicPOHeader := "update-POH-topic"


	// create a pulsar client
	client, err := pulsar.NewClient(pulsar.ClientOptions{
		URL  : pulsarUrl,
		OperationTimeout: 30 * time.Second,
		ConnectionTimeout: 30 * time.Second,
	})
	if err != nil {
		log.Fatalf("Could not instantiate Pulsar client : %v", err)
	}
	defer client.Close()



	// We use Ctrl+C to close server
	// So, catch the signal and perform cleanup before terminating
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt, syscall.SIGTERM)   
	go func () {
		<-c
		// close(cnl)    // closing the channel that listens to messages, by this that routine ends
		close(updateUserCnl)
		close(updatePOHCnl)
		client.Close()  // closing the pulsar client (automatically closes the consumer as well)
		// deleteTables(db)  // deleting the tables and schema created
		db.Close()     // closing the db connection     // try defer!
		runDownMigrations()
		m.Close()
		// defer will not work here, bcoz log.Fatal immediately terminates the program
		log.Fatal("Server closed due to interruption (Ctrl+C)")
	}()


	
	// Initialize db connection
	db = openConnection()
	defer db.Close()
	// Call to create tables (initial setup)
	// createTables(db)

	// running UP migrations for initial setup
	migrationPathURL := "file://db/migrations"
	dbURL := "postgres://postgresuser:mypassword@localhost:5432/user_db?sslmode=disable"
	initializeAndRunUpMigrations(migrationPathURL, dbURL);
	



	// routine in which consumer keeps listening to pulsar topic that contains user data to update
	go consumerListenForUserUpdate(client, topicUser, db)

	// routine in which consumer keeps listening to pulsar topic that contains user data to update
	go consumerListenForPOHeaderUpdate(client, topicPOHeader, db)



	
	// routine in which consumer keeps listening to pulsar topic that contains user data to post (ui post request to producer)
	// go consumerListen(client, topic, db)



	router := httprouter.New()
	router.GlobalOPTIONS = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Access-Control-Allow-Origin", "http://localhost:3000")
    	w.Header().Add("Access-Control-Allow-Credentials", "true")
    	w.Header().Add("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
    	w.Header().Add("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, PATCH")

		if r.Method == "OPTIONS" {    
			http.Error(w, "No Content", http.StatusNoContent)
			return
		}
	})


	// endpoints for user interaction
	router.GET("/user/:name", getUsingName)
	router.GET("/userid/:id", getUsingId)
	router.POST("/newuser", createUser)

	// endpoints for po
	router.POST("/newpoheader", createPOHeader)
	router.POST("/newpolineitem", createPOLineItem)
	router.GET("/ponumber/:ponumber", getUsingPONumber)
	router.PUT("/updatepolineitem", updatePOLineItem)
	


	log.Fatal(http.ListenAndServe(":5050", router))


	

}
