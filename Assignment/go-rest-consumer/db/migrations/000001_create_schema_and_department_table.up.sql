BEGIN;

--creating new schema called 'userdetails'
create schema if not exists userdetails authorization postgresuser;

--creating 'department' table
create table if not exists userdetails.department (
    "dept_id" integer not null primary key,
    "dept_name" varchar(20) not null 
);
--insert values into department table
insert into userdetails.department ("dept_id", "dept_name") values 
    (1, 'brands'),
    (2, 'crm'),
    (3, 'datascience'),
    (4, 'hr')
;

COMMIT;
