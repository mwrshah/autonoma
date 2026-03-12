# Todoist TypeScript SDK - Overview
Source: https://doist.github.io/todoist-api-typescript/

## Installation
npm install @doist/todoist-api-typescript

## Basic Usage
```typescript
import { TodoistApi } from '@doist/todoist-api-typescript'
const api = new TodoistApi('YOUR_API_TOKEN')
api.getTask('6X4Vw2Hfmg73Q2XR')
    .then((task) => console.log(task))
    .catch((error) => console.log(error))
```

## Pages
- Authorization: authorization.md
- TodoistApi class: api-class-reference.md
- TodoistRequestError class: error-class.md

## GitHub
https://github.com/Doist/todoist-api-typescript
