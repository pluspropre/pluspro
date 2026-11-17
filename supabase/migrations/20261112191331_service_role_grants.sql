-- New projects no longer expose public tables to the Data API roles by default.
-- The server-only secret key (service_role) inserts quote requests and runs maintenance scripts:
-- grant it explicit table privileges (it bypasses RLS by design and never reaches the browser).
grant select, insert, update, delete on all tables in schema public to service_role;
grant usage, select on all sequences in schema public to service_role;
alter default privileges in schema public grant select, insert, update, delete on tables to service_role;
