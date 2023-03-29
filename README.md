# Backend template

## Technical Approach

- Programming language: Typescript
- Core: ExpressJS
- Formatter: Prettier
- Code quality scanner: Eslint
- Pre-commit checker: Husky
- Testing: jest, supertest
- API standard: Restful API
- Logger: winston
- ENV manager: config

## Pre-installation

- NVM (MacOS): https://tecadmin.net/install-nvm-macos-with-homebrew/
- NVM (Windows): https://github.com/coreybutler/nvm-windows
- Nodejs: https://nodejs.org/en/download/
- Docker: https://www.docker.com/products/docker-desktop

## Installation

```
nvm i
npm ci
```

## Start server

1. Local

```
npm run start:dev
```

2. Deployment

```
docker-compose up -d app
```

## Test

1. all tests

```
npm test
npm run test:e2e
```

2. coverage

```
npm run test:cov
npm run test:cov:e2e
```

## Release

```
# 1.0.0 -> 1.0.1
npm run release:patch

# 1.0.0 -> 1.1.0
npm run release:minor

# 1.0.0 -> 2.0.0
npm run release:major

# 1.0.0 -> <target>
npm run release:target <target>
```
