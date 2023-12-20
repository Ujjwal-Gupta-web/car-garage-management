package main

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

// CONSIDERATION
// Status : pending, in process, completed
// comments : write anything about car to be done by garage owner
// problem : to be specified by car owner

// Car model
type Car struct {
	NumberPlate string    `json:"numberplate,omitempty" bson:"numberplate,omitempty"`
	Brand       string    `json:"brand,omitempty" bson:"brand,omitempty"`
	Model       string    `json:"model,omitempty" bson:"model,omitempty"`
	EntryTime   time.Time `json:"entry_time,omitempty" bson:"entry_time,omitempty"`
	Status      string    `json:"status,omitempty" bson:"status,omitempty"`
	Problem     string    `json:"problem,omitempty" bson:"problem,omitempty"`
	Comments    []string  `json:"comments,omitempty" bson:"comments,omitempty"`
}

var collection *mongo.Collection

// Initialize MongoDB connection
func initMongo() {
	clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")
	client, err := mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}

	err = client.Ping(context.Background(), nil)
	if err != nil {
		log.Fatal(err)
	}

	collection = client.Database("CarGarageDB").Collection("cars")
}

// AddCarHandler adds a new car entry to the database
func AddCarHandler(c *fiber.Ctx) error {
	var car Car
	if err := c.BodyParser(&car); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Error parsing request body"})
	}

	// Check if NumberPlate is provided
	if car.NumberPlate == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "NumberPlate is required"})
	}

	// Check if NumberPlate is unique
	existingCar := Car{}
	err := collection.FindOne(context.Background(), bson.M{"numberplate": car.NumberPlate}).Decode(&existingCar)
	if err == nil {
		return c.Status(http.StatusConflict).JSON(fiber.Map{"error": "Car with the same NumberPlate already exists"})
	} else if err != mongo.ErrNoDocuments {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Error checking uniqueness"})
	}

	car.EntryTime = time.Now()
	car.Status = "Pending"
	_, err = collection.InsertOne(context.Background(), car)
	if err != nil {
		log.Println("Error:", err)
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Error adding car"})
	}
	
	return c.Status(http.StatusOK).JSON(fiber.Map{"message": "Car Added"})
}

// GetCarsHandler returns the list of cars in the garage
func GetCarsHandler(c *fiber.Ctx) error {
	var cars []Car

	cursor, err := collection.Find(context.Background(), bson.M{})
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Error retrieving cars"})
	}

	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var car Car
		cursor.Decode(&car)
		cars = append(cars, car)
	}

	return c.JSON(cars)
}

// GetCarByNumberPlateHandler returns the list of cars in the garage
func GetCarByNumberPlateHandler(c *fiber.Ctx) error {
	numberPlate := c.Params("numberplate")
	existingCar := Car{}
	err := collection.FindOne(context.Background(), bson.M{"numberplate": numberPlate}).Decode(&existingCar)
	if err != nil {
		// log.Println("Error:", err)
		if len(existingCar.Comments)==0 {
			return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "Car with specified number plate not found"})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Something went wrong"})
	}
	return c.Status(http.StatusOK).JSON(existingCar)
}

// UpdateCarStatusHandler updates the status of a car entry
func UpdateCarStatusHandler(c *fiber.Ctx) error {
    numberPlate := c.Params("numberplate")

    var updateBody map[string]interface{}
    if err := c.BodyParser(&updateBody); err != nil {
        return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Error decoding request body"})
    }

    // Log the received data for debugging
    log.Printf("Received update for car ID %s with data: %+v", numberPlate, updateBody)

    // Ensure that the request body is not empty
    if len(updateBody) == 0 {
        return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Empty update body"})
    }

    update := bson.M{"$set": updateBody}
    result, err := collection.UpdateOne(context.Background(), bson.M{"numberplate": numberPlate}, update)
    if err != nil {
        return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Error updating car"})
    }

    if result.ModifiedCount == 0 {
        return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "No car found with the specified NumberPlate"})
    }
	
	return c.Status(http.StatusOK).JSON(fiber.Map{"message": "Car Status updated"})
}

// UpdateCarStatusHandler updates the status of a car entry
func AddCommentsHandler(c *fiber.Ctx) error {
	numberPlate := c.Params("numberplate")

	var updateBody map[string]string
	if err := c.BodyParser(&updateBody); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Error decoding request body"})
	}

	// Log the received data for debugging
	log.Printf("Received update for car ID %s with data: %+v", numberPlate, updateBody)

	// Ensure that the request body is not empty
	if len(updateBody) == 0 {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Empty update body"})
	}

	// Update the Comments array
	newComment, ok := updateBody["newComment"]
	if !ok {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Missing 'newComment' field in request body"})
	}

	update := bson.M{"$push": bson.M{"comments": newComment}}
	result, err := collection.UpdateOne(context.Background(), bson.M{"numberplate": numberPlate}, update)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Error updating car"})
	}

	if result.ModifiedCount == 0 {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "No car found with the specified NumberPlate"})
	}

	return c.JSON(fiber.Map{"message": "Comment added successfully"})
}


// DeleteCarHandler deletes a car entry from the database
func DeleteCarHandler(c *fiber.Ctx) error {
	numberPlate := c.Params("numberplate")

	_, err := collection.DeleteOne(context.Background(), bson.M{"numberplate": numberPlate})
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Error deleting car"})
	}
	
	return c.Status(http.StatusOK).JSON(fiber.Map{"message": "Car Deleted Successfully"})
}

func main() {
	initMongo()

	app := fiber.New()

	// Initialize default config
	app.Use(cors.New())

// Or extend your config for customization
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders:  "Origin, Content-Type, Accept",
	}))

	app.Post("/cars", AddCarHandler)
	app.Get("/cars", GetCarsHandler)
	app.Get("/cars/:numberplate", GetCarByNumberPlateHandler)
	app.Put("/cars/updateStatus/:numberplate", UpdateCarStatusHandler)
	app.Put("/cars/addComments/:numberplate", AddCommentsHandler)
	app.Delete("/cars/:numberplate", DeleteCarHandler)

	log.Fatal(app.Listen(":8080"))
}