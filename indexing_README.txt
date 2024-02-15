

Data type for primary keys:

https://supabase.com/blog/choosing-a-postgres-primary-key

- Usually serial is the most efficient but it is not considered ideal for several reasons.

- UUID is often used but it suffers from severe problems when data size grows too large, esp indexes.
  Since uuid (v4) are all random, the index tree has no order. So when the index grows too large, inserts can be
  very heavy operations because each insert can cause a reorder of alrge portions of the tree.

- There are many type of ids available that are sequential (monotonic). Some of them follow uuid spec too.
https://supabase.com/blog/choosing-a-postgres-primary-key

Sequential ids are sortable, that means that most of inserts (if not all) happen at tree leaf nodes. Inserts are efficient, 
so is the index itself.

 - ulid spec is a good candidate (https://github.com/ulid/spec). It is also a UUID itself.
 - There is also 'xid' https://github.com/rs/xid but it is a Go library. (Very efficient and performant though)
 - ulid is availabe as a js library and plsql script also. (But the pl one is not monotonic for the same milisecond value
   and the js one loses monotonicity with multiple servers/nodes)
-- https://github.com/geckoboard/pgulid/blob/master/pgulid.sql
-- https://github.com/ulid/javascript

NOTE: Any uuid type (eg. UUIDv4, ulid) should be stored as the UUID data type of pg. Storing them as a string column loses 
all the benefits. UUID pg data type is a binary data type. When you pass a string, pg converts it into the binary form 
before storing.

NOTE: Pg hash index for simple == queries, Default b-tree for == and all the <, >, >= etc

Our use case: [pay instance + user id + > date or unpaid etc] (composite index only supports b-tree)


uuidv7 addresses these issue, it has all ulid features. But it is still a draft so long time before pg natively supports.
But we can use js libraries to create v7 and store them in pg UUID field, until it is natively supported
(or until we have a stable plsql function available for v7)

https://github.com/LiosK/uuidv7  (multiple nodes will still lose monotonicity for same ms, but it's ok for now I guess)

Since go auth also uses library for UUID (and not pg default functions) it can also be replaced with a v7 go library.




