## Getting Started

Load-Excel-API 
API for Excel file upload with format validation and processing notification

### Prerequisites
- Node 14+
- Npm 7+
- Docker 17.12.0+

### Installing

Start by cloning.

```
$ git clone https://github.com/jeisonca96/load-excel-api.git
```

The next thing will be to install all the dependencies of the project.

```
npm i
npm run start
```

Run with docker.

```
npm run start:docker
OR
docker-compose up -d
```

## Environment configuration

The application uses environment variables.
You have a option to configure your environment variables for local development:
### env files:

Copy the `.env.example` file to a new `.env`.

## Port Configuration

By default apps run in these ports:

| App                    | Port variable name           | Default value |
| ---------------------- | ---------------------------- | ------------ |
| **api**                | `API_PORT`                   | 3000         |
| **api**                | `DATABASES_MONGO_URL`                   | mongodb://dev:test@mongodb/load-excel?authSource=admin         |

if you want to run in a different port you can modify the port variable in your env file.

## Running tests

Running unit test and calculating code coverage

```
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Docs

API docs (swagger) at http://{{host}}/api and postman collection at the main route.

```
# local docs
http://localhost:3000/api
```

# REST API

The REST API to the example app is described below.

## Make a request with excel file

### Request

`POST /load-excel-files`

    curl --location --request POST 'http://localhost:3000/load-excel-files' \
    --form 'file=@"/Users/jeisonaparicio/Documents/book-test.xlsx"'

### Response

    HTTP/1.1 201 Created
    Date: Mon, 30 Jan 2023 09:59:13 GMT
    Status: 201 Created
    Content-Type: application/json
    Content-Length: 40

    {
      "requestId": "63d794f1a9396a7b98baa992"
    }

## Get saved data from excel file

### Request

`POST /load-excel-files/{{requestId}}`

    curl --location --request POST 'http://localhost:3000/load-excel-files' \
    --form 'file=@"/Users/jeisonaparicio/Documents/book-test.xlsx"'

### Response

    HTTP/1.1 200 OK
    Date: Mon, 30 Jan 2023 09:59:13 GMT
    Status: 200 OK
    Content-Type: application/json
    Content-Length: 165

    {
      "requestId": "63d79657a9396a7b98baa9a4",
      "status": "done",
      "errors": [],
      "countRows": 2,
      "data": [
          {
              "name": "Esteban",
              "age": 30
          },
          {
              "name": "Maria",
              "age": 40
          }
      ],
      "processTime": "3ms"
    }
