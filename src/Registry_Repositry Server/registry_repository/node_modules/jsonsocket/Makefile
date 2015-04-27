JSHINT=@jshint
MOCHA=@./node_modules/.bin/mocha

lint:
	 $(JSHINT) lib/ test/ index.js

test: lint
	$(MOCHA)