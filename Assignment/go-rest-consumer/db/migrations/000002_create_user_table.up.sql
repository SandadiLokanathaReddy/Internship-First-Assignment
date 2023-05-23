BEGIN;


-- creating a sequence object
create sequence if not exists userdetails.user_id_seq 
start 1001
increment 1
no maxvalue ;


-- creating 'user' table
create table if not exists userdetails.user (
    "id" integer not null default nextval('userdetails.user_id_seq') primary key,
    "name" varchar(200) not null,
    "email" varchar(100) not null,
    "phone" varchar(10) not null,
    "user_dept_id" integer not null,
    constraint fk_dept_id
        foreign key (user_dept_id)
            references userdetails.department (dept_id)
            on delete cascade
    
);

-- assigning sequence exclusively to id column
alter sequence userdetails.user_id_seq owned by userdetails.user.id;


-- entering sample data
INSERT INTO userdetails.user ("name", "email", "phone", "user_dept_id") VALUES
('nameOne','one@gmail.com','1111111111', 1),
('nameTwo','two@gmail.com','2222222222', 2),
('nameThree','three@gmail.com','3333333333', 3),
('nameFour','four@gmail.com','4444444444', 4);



COMMIT;