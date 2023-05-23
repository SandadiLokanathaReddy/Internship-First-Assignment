postgres:
	docker run --name mypostgrescontainer -p 5432:5432 -e POSTGRES_USER=postgresuser -e POSTGRES_PASSWORD=mypassword -d postgres

createdb:
	docker exec -it mypostgrescontainer createdb --username=postgresuser --owner=postgresuser user_db

dropdb:
	docker exec -it mypostgrescontainer dropdb --username=postgresuser user_db

migrateup:
	migrate -path db/migrations -database "postgres://postgresuser:mypassword@localhost:5432/user_db?sslmode=disable" -verbose up

migrationfix: 
	migrate -path db/migrations -database "postgres://postgresuser:mypassword@localhost:5432/user_db?sslmode=disable" force 1

migratedown:
	migrate -path db/migrations -database "postgres://postgresuser:mypassword@localhost:5432/user_db?sslmode=disable" -verbose down

stoppostgrescontainer:
	docker stop mypostgrescontainer

removepostgrescontainer:
	docker rm mypostgrescontainer

runapp:
	go run main.go

endapp:		dropdb	stoppostgrescontainer	removepostgrescontainer