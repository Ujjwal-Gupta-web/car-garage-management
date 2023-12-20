# Car Garage Manegement

## Technologies Used

- **Frontend:**

  - React JS : A javascript library for frontend development
  - Tailwind CSS (Flowbite) : A utility-first CSS framework for styling.

- **Backend:**
  - Go : programming language
  - MongoDB: NoSQL database for storing user data.

## Getting Started

### Prerequisites

- go installed on your machine
- Node.js, npm, mongo installed on your machine.

### Installation

1. Clone the repository:

   ```bash
   git clone 
   ```

2. Running the app

   ```bash
    cd ./CarGarageManagement
   go mod tidy
   go run main.go

   cd ../frontend
   npm install
   npm start
   ```

3. Access the application at [http://localhost:3000](http://localhost:3000).


## Project Structure

```
root/
|-- CarGarageManagement/          # GO backend
|-- frontend/                     # React.js frontend
|-- README.md                     # Project documentation
```

## APIs

```
|-- http://localhost:8080/cars                                 # POST API, add cars, send car details in body
|-- http://localhost:8080/cars                                 # GET API, to get all cars
|-- http://localhost:8080/cars/:numberplate                    # GET API, to get car by numberplate
|-- http://localhost:8080/cars/updateStatus/:numberplate       # PUT API, update car status, send status in body
|-- http://localhost:8080/cars/addComments/:numberplate        # PUT API, add new comment to car, send newComment in body
|-- http://localhost:8080/cars/:numberplate                    # DELETE API, to delete car by numberplate
```

## Project Features

- add car entry
- delete car entry
- car has three status (Pending , In Process, Completed)
- toggle among statuses
- add comments (during car's repair, the mechanic will add some comments which will be helpful in cost calculation)
- search by number plate

## Postman Link

[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://god.gw.postman.com/run-collection/21508608-a3fcddd2-55dd-4353-a490-42d073bbe0a5?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D21508608-a3fcddd2-55dd-4353-a490-42d073bbe0a5%26entityType%3Dcollection%26workspaceId%3D5acda12c-aec6-4862-af41-6b0c0e124fcb)

