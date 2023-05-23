BEGIN;

create schema if not exists po authorization postgresuser;

-- creating table for mapping supplierid and suppliername
create table if not exists po.supplierdetails (
    "supplierid" varchar(10) not null,
    "suppliername" varchar(50) not null
);
insert into po.supplierdetails ("supplierid", "suppliername")
values ('CR001', 'Carter Rice'),
('JS123', 'John Smith'),
('KT818', 'Kenny Thompson'),
('AR111', 'Andrew Ross');


-- creating a sequence object
create sequence if not exists po.ponumberseq
start 2001
increment 1
no maxvalue ;

-- creating 'poheader' table
create table if not exists po.poheader (
    "ponumber" integer not null default nextval('po.ponumberseq') primary key,
    "poagent" varchar(50) not null,
    "supplierid" varchar(10) not null,
    "suppliername" varchar(50) not null,
    "shipviaservice" varchar(50) not null,
    "contactname" varchar(50) not null,
    "issuedate" date not null
);

-- assigning sequence exclusively to ponumber column
alter sequence po.ponumberseq owned by po.poheader.ponumber;

-- creating 'polineitem' table
create table if not exists po.polineitem (
	"id" serial,  
    "quantity" integer not null,
    "description" varchar(200) not null,
    "materialcode" varchar(20) not null,
    "color" varchar(20) not null,
    "width" decimal not null,
    "length" decimal not null,
    "productid" varchar(20) not null,
    "duedate" date not null,
    "ponumber" integer not null,
    constraint fk_ponumber
        foreign key (ponumber)
            references po.poheader (ponumber)
            on delete cascade
);

COMMIT;