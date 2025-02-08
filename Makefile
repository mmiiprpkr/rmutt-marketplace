build:
	bun run build && bun run start

dev:
	bun run dev

lint:
	bun run lint

lint-fix:
	bun run lint --fix

pm2:
	pm2 start ecosystem.config.js

build-pm2:
	bun run build && pm2 start ecosystem.config.js

prettier:
	bunx prettier ./src --write