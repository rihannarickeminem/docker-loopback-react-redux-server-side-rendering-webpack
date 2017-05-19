REPORTER = list

start: yarn_install
	NODE_REPL_ASSIGN_UNDERSCORE=false npm run dev

start_debug_security: npm_install
	NODE_REPL_ASSIGN_UNDERSCORE=false DEBUG=loopback:security:* slc run ./server

production: npm_install
	pm2 start ./server/server.js		&& pm2 logs server

npm_install:
	npm install || echo "npm install error"

yarn_install:
	yarn

start_dev:
	NODE_REPL_ASSIGN_UNDERSCORE=false npm run dev

test:
	NODE_ENV=test \
					 ./node_modules/.bin/mocha \
					 --reporter $(REPORTER) \
					 ./tests/*.js
lint:
	./node_modules/standard/bin/cmd.js --verboze | ./node_modules/snazzy/bin/cmd.js

