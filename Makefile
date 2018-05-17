.PHONY: build run
REPORTER ?= spec
CONFIG_FILE ?= "./dev/betcha.json"

build:
	@./node_modules/.bin/babel --presets es2015 -d lib/server/ server/

run: build
	@node ./lib/server/start.js $(CONFIG_FILE)