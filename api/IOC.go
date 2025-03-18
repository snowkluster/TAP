package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

var API_KEY string

type FileData struct {
	SHA3_384Hash  string   `json:"sha3_384_hash"`
	SHA256Hash    string   `json:"sha256_hash"`
	SHA1Hash      string   `json:"sha1_hash"`
	MD5Hash       string   `json:"md5_hash"`
	FirstSeen     string   `json:"first_seen"`
	OriginCountry string   `json:"origin_country"`
	FileSize      int64    `json:"file_size"`
	FileTypeMime  string   `json:"file_type_mime"`
	Intelligence  string   `json:"intelligence"`
	Tags          []string `json:"tags"`
	FileName      string   `json:"file_name"`
	Signature     string   `json:"signature"`
}

func processFile(fileData FileData) map[string]interface{} {
	requiredKeys := []string{"sha3_384_hash", "sha256_hash", "sha1_hash", "md5_hash", "first_seen", "origin_country", "file_size", "file_type_mime", "intelligence", "tags", "file_name"}
	newData := make(map[string]interface{})

	for _, key := range requiredKeys {
		switch key {
		case "sha3_384_hash":
			newData[key] = fileData.SHA3_384Hash
		case "sha256_hash":
			newData[key] = fileData.SHA256Hash
		case "sha1_hash":
			newData[key] = fileData.SHA1Hash
		case "md5_hash":
			newData[key] = fileData.MD5Hash
		case "first_seen":
			newData[key] = fileData.FirstSeen
		case "origin_country":
			newData[key] = fileData.OriginCountry
		case "file_size":
			newData[key] = fileData.FileSize
		case "file_type_mime":
			newData[key] = fileData.FileTypeMime
		case "intelligence":
			newData[key] = fileData.Intelligence
		case "tags":
			newData[key] = fileData.Tags
		case "file_name":
			newData[key] = fileData.FileName
		}
	}

	var fileName string
	if fileData.Signature != "" && !strings.Contains("sh exe elf", fileData.Signature) {
		fileName = fileData.Signature
	} else if len(fileData.Tags) > 0 {
		filteredTags := []string{}
		for _, tag := range fileData.Tags {
			if !strings.Contains("sh exe elf", tag) {
				filteredTags = append(filteredTags, tag)
			}
		}
		if len(filteredTags) > 0 {
			fileName = filteredTags[0]
		} else {
			fileName = "UNKNOWN"
		}
	} else {
		fileName = "UNKNOWN"
	}

	newData["IOC Name"] = fileName
	return newData
}

func fetchAndProcessData() ([]map[string]interface{}, error) {
	url := "https://mb-api.abuse.ch/api/v1/"
	data := "query=get_recent&selector=time"

	client := &http.Client{}

	req, err := http.NewRequest("POST", url, strings.NewReader(data))
	if err != nil {
		return nil, fmt.Errorf("failed to create HTTP request: %v", err)
	}

	req.Header.Set("Auth-Key", API_KEY)
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to send HTTP request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to fetch data, status code: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %v", err)
	}

	var resultData map[string]interface{}
	err = json.Unmarshal(body, &resultData)
	if err != nil {
		return nil, fmt.Errorf("failed to unmarshal response: %v", err)
	}

	dataField, ok := resultData["data"].([]interface{})
	if !ok {
		return nil, fmt.Errorf("expected 'data' to be a list, but got: %T", resultData["data"])
	}

	seenHashes := make(map[string]bool)
	var allData []map[string]interface{}

	for _, item := range dataField {
		fileData, ok := item.(map[string]interface{})
		if !ok {
			continue
		}

		var file FileData

		file.SHA3_384Hash, _ = fileData["sha3_384_hash"].(string)
		file.SHA256Hash, _ = fileData["sha256_hash"].(string)
		file.SHA1Hash, _ = fileData["sha1_hash"].(string)
		file.MD5Hash, _ = fileData["md5_hash"].(string)
		file.FirstSeen, _ = fileData["first_seen"].(string)
		file.OriginCountry, _ = fileData["origin_country"].(string)
		file.FileSize, _ = fileData["file_size"].(int64)
		file.FileTypeMime, _ = fileData["file_type_mime"].(string)
		file.Intelligence, _ = fileData["intelligence"].(string)
		file.Tags, _ = fileData["tags"].([]string)
		file.FileName, _ = fileData["file_name"].(string)
		file.Signature, _ = fileData["signature"].(string)

		if file.SHA256Hash != "" && !seenHashes[file.SHA256Hash] {
			seenHashes[file.SHA256Hash] = true
			newData := processFile(file)
			allData = append(allData, newData)
		}
	}

	return allData, nil
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	API_KEY = os.Getenv("ABUSE_API_KEY")
	if API_KEY == "" {
		log.Fatal("API_KEY is missing. Please set the 'ABUSE_API_KEY' in the .env file.")
	}

	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()

	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	})

	r.GET("/", func(c *gin.Context) {
		data, err := fetchAndProcessData()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, data)
	})
	r.Run(":8008")
}
