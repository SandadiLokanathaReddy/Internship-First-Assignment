BEGIN;

--deleting the 'department' table
drop table if exists userdetails.department;

--deleting the 'userdetails' schema
drop schema if exists userdetails;

COMMIT;