package filehash

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

var API_KEY string

func init() {
	// Load environment variables
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file")
	}
	API_KEY = os.Getenv("VIRUS_API_KEY")
	if API_KEY == "" {
		log.Fatal("VIRUS_API_KEY is not set in .env file")
	}
}

func Api1runner() {
	// Create a Gin router
	r := gin.Default()

	// CORS middleware
	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "http://localhost:5173")
		c.Header("Access-Control-Allow-Origin", "http://portal.localhost")
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Header("Access-Control-Allow-Methods", "*")
		c.Header("Access-Control-Allow-Headers", "*")
		c.Next()
	})

	// Define the endpoint to check the file hash
	r.GET("/check/:file_hash", func(c *gin.Context) {
		fileHash := c.Param("file_hash")
		url := fmt.Sprintf("https://www.virustotal.com/api/v3/files/%s", fileHash)

		// Create a new request
		req, err := http.NewRequest("GET", url, nil)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": fmt.Sprintf("Error creating request: %s", err.Error()),
			})
			return
		}

		// Set headers
		req.Header.Set("accept", "application/json")
		req.Header.Set("x-apikey", API_KEY)

		// Make the HTTP request
		client := &http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": fmt.Sprintf("Network error: %s", err.Error()),
			})
			return
		}
		defer resp.Body.Close()

		// Check if the response status is OK
		if resp.StatusCode != http.StatusOK {
			c.JSON(resp.StatusCode, gin.H{
				"error": fmt.Sprintf("VirusTotal API error: %s", resp.Status),
			})
			return
		}

		// Decode the response JSON
		var data map[string]interface{}
		err = json.NewDecoder(resp.Body).Decode(&data)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": fmt.Sprintf("Error parsing response: %s", err.Error()),
			})
			return
		}

		// Extract and filter the data from the response
		attributes := data["data"].(map[string]interface{})["attributes"].(map[string]interface{})
		filteredData := gin.H{
			"type":               attributes["type"],
			"type_tags":          attributes["type_tags"],
			"size":               attributes["size"],
			"meaningful_name":    attributes["meaningful_name"],
			"reputation":         attributes["reputation"],
			"md5":                attributes["md5"],
			"sha1":               attributes["sha1"],
			"last_analysis_stats": attributes["last_analysis_stats"],
		}

		// Return filtered data as JSON
		c.JSON(http.StatusOK, filteredData)
	})

	// Start the Gin server
	r.Run(":8006")
}
