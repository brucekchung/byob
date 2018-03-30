#BYOB Database (PSQL)

##repositories for public users:

POST/api/authenticate

```
Request:
{
  name: <name>,
  email: <email>
}

Response:
status: 201
jwt: (returned with 201)

```

GET/api/v1/people
```
Response:
status: 201
```

GET/api/v1/strengths
```
Response:
status: 201
```

GET/api/v1/people/:id
```
Request: 
{
  id: <id>
}

Response:
status: 201
```

GET/api/v1/strengths/:id
```
Request:
{
  id: <id>
}

Response:
status: 201
```


##repositories for authenticated users:
POST/api/v1/people/:people_id/strengths

```
Request:
{
  people_id: 5,
  strength: "Strategic",
  token: <token>
}

Response:
status: 201
id: <id>
```

POST/api/v1/people
```
Request:
{
  name: "Robbie",
  token: <token>
}

Response:
status: 201
id: <id>
name: <name>
```
DELETE/api/v1/people
```
Request:
{
  id:12, 
  token: <token>
}

Response:
status: 202
"Deleted"
```
  
DELETE/api/v1/strengths

```
Request:
{
  id:12, 
  token: <token>
}

Response:
status: 202
"Deleted"
```

PATCH/api/v1/people/:id
```
Request:
{
  id:12, 
  name: "not robbie",
  token: <token>
}

Response:
status: 202
"Edited"
```

PATCH/api/v1/strengths/:id
```
Request:
{
  id:12, 
  name: "different strength",
  token: <token>
}

Response:
status: 202
"Edited"
```

