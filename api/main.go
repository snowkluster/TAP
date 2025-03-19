package main

import (
	"TAP/api/filehash"
	"TAP/api/ioc"
)

func main() {
	go filehash.Api1runner()
	go ioc.Api2runner()
	select {}
}
