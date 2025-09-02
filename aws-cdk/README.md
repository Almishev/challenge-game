# AWS CDK (TypeScript) for Challenges App

## Структура
```
aws-cdk/
├── bin/
│  └── challenges-app-cdk.ts        # Entry point
├── lib/
│  └── challenges-app-stack.ts      # CDK Stack: DynamoDB, Lambda, API Gateway
├── lambda/
│  ├── get_categories/index.ts
│  ├── get_challenges/index.ts
│  ├── create_challenge/index.ts
│  ├── update_challenge/index.ts
│  └── delete_challenge/index.ts
├── package.json
├── tsconfig.json
└── cdk.json
```

## Инсталация
```bash
cd aws-cdk
npm install
```

## AWS креденшъли
```bash
setx AWS_ACCESS_KEY_ID "<your_key>"
setx AWS_SECRET_ACCESS_KEY "<your_secret>"
setx AWS_REGION "eu-central-1"
```

## Команди
```bash
npm run build
npm run synth
npm run deploy
npm run destroy
```

## API endpoints
- GET /categories
- GET /challenges
- GET /challenges/{category}
- POST /challenges
- PUT /challenges/{category}/{id}
- DELETE /challenges/{category}/{id}

## Бележки
- Таблиците са PAY_PER_REQUEST
- API има CORS
- Lambda runtime: Node.js 18
