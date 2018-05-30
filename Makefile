.PHONY: build run
REPORTER ?= spec
CONFIG_FILE ?= "./dev/betcha.json"

build:
	@npm start
	@./node_modules/.bin/babel -d lib/server/ server/

run: build
	@node ./lib/server/start.js $(CONFIG_FILE)