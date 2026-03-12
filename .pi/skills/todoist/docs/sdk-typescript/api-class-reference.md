Scraping: https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi
[Skip to main content](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#__docusaurus_skipToContent_fallback)

[![Todoist Logo](https://doist.github.io/todoist-api-typescript/img/todoist-logo.svg)\\
**Todoist API TypeScript Client**](https://doist.github.io/todoist-api-typescript/) [Docs](https://doist.github.io/todoist-api-typescript/)

[GitHub](https://github.com/Doist/todoist-api-typescript)

- [About](https://doist.github.io/todoist-api-typescript/)
- [Authorization](https://doist.github.io/todoist-api-typescript/authorization)
- API Reference

  - [Classes](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#)

    - [TodoistApi](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi)
    - [TodoistRequestError](https://doist.github.io/todoist-api-typescript/api/classes/TodoistRequestError)
  - [Functions](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#)

  - [Types](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#)

- [Home page](https://doist.github.io/todoist-api-typescript/)
- API Reference
- Classes
- TodoistApi

On this page

# TodoistApi

## Constructors [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#constructors "Direct link to Constructors")

### Constructor [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#constructor "Direct link to Constructor")

```ts
new TodoistApi(authToken: string, baseUrl: string): TodoistApi;
```

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters "Direct link to Parameters")

| Parameter | Type |
| --- | --- |
| `authToken` | `string` |
| `baseUrl` | `string` |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns "Direct link to Returns")

`TodoistApi`

#### Deprecated [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#deprecated "Direct link to Deprecated")

Use options object instead: new TodoistApi(token, { baseUrl, customFetch })

### Constructor [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#constructor-1 "Direct link to Constructor")

```ts
new TodoistApi(authToken: string): TodoistApi;
```

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-1 "Direct link to Parameters")

| Parameter | Type |
| --- | --- |
| `authToken` | `string` |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-1 "Direct link to Returns")

`TodoistApi`

### Constructor [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#constructor-2 "Direct link to Constructor")

```ts
new TodoistApi(authToken: string, options?: TodoistApiOptions): TodoistApi;
```

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-2 "Direct link to Parameters")

| Parameter | Type |
| --- | --- |
| `authToken` | `string` |
| `options?` | [`TodoistApiOptions`](https://doist.github.io/todoist-api-typescript/api/type-aliases/TodoistApiOptions) |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-2 "Direct link to Returns")

`TodoistApi`

## Methods [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#methods "Direct link to Methods")

### acceptWorkspaceInvitation() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#acceptworkspaceinvitation "Direct link to acceptWorkspaceInvitation()")

```ts
acceptWorkspaceInvitation(args: WorkspaceInvitationActionArgs, requestId?: string): Promise<{
  id: string;
  inviterId: string;
  isExistingUser: boolean;
  role: "ADMIN" | "MEMBER" | "GUEST";
  userEmail: string;
  workspaceId: string;
}>;
```

Accepts a workspace invitation.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-3 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `args` | [`WorkspaceInvitationActionArgs`](https://doist.github.io/todoist-api-typescript/api/type-aliases/WorkspaceInvitationActionArgs) | Arguments including invite code. |
| `requestId?` | `string` | Optional request ID for idempotency. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-3 "Direct link to Returns")

`Promise`<{
`id`: `string`;
`inviterId`: `string`;
`isExistingUser`: `boolean`;
`role`: `"ADMIN"` \| `"MEMBER"` \| `"GUEST"`;
`userEmail`: `string`;
`workspaceId`: `string`;
}>

The accepted invitation.

* * *

### addComment() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#addcomment "Direct link to addComment()")

```ts
addComment(args: AddCommentArgs, requestId?: string): Promise<{
  content: string;
  fileAttachment:   | {
     fileDuration?: number | null;
     fileName?: string | null;
     fileSize?: number | null;
     fileType?: string | null;
     fileUrl?: string | null;
     image?: string | null;
     imageHeight?: number | null;
     imageWidth?: number | null;
     resourceType: string;
     title?: string | null;
     uploadState?: "pending" | "completed" | null;
     url?: string | null;
   }
     | null;
  id: string;
  isDeleted: boolean;
  postedAt: string;
  postedUid: string;
  projectId?: string;
  reactions: Record<string, string[]> | null;
  taskId: string | undefined;
  uidsToNotify: string[] | null;
}>;
```

Adds a comment to a task or project.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-4 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `args` | [`AddCommentArgs`](https://doist.github.io/todoist-api-typescript/api/type-aliases/AddCommentArgs) | Parameters for creating the comment, such as content and the target task or project ID. |
| `requestId?` | `string` | Optional custom identifier for the request. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-4 "Direct link to Returns")

`Promise`<{
`content`: `string`;
`fileAttachment`: \| {
`fileDuration?`: `number` \| `null`;
`fileName?`: `string` \| `null`;
`fileSize?`: `number` \| `null`;
`fileType?`: `string` \| `null`;
`fileUrl?`: `string` \| `null`;
`image?`: `string` \| `null`;
`imageHeight?`: `number` \| `null`;
`imageWidth?`: `number` \| `null`;
`resourceType`: `string`;
`title?`: `string` \| `null`;
`uploadState?`: `"pending"` \| `"completed"` \| `null`;
`url?`: `string` \| `null`;
}
\| `null`;
`id`: `string`;
`isDeleted`: `boolean`;
`postedAt`: `string`;
`postedUid`: `string`;
`projectId?`: `string`;
`reactions`: `Record`<`string`, `string`\[\]\> \| `null`;
`taskId`: `string` \| `undefined`;
`uidsToNotify`: `string`\[\] \| `null`;
}>

A promise that resolves to the created comment.

* * *

### addLabel() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#addlabel "Direct link to addLabel()")

```ts
addLabel(args: AddLabelArgs, requestId?: string): Promise<{
  color: string;
  id: string;
  isFavorite: boolean;
  name: string;
  order: number | null;
}>;
```

Adds a new label.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-5 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `args` | [`AddLabelArgs`](https://doist.github.io/todoist-api-typescript/api/type-aliases/AddLabelArgs) | Label creation parameters such as name. |
| `requestId?` | `string` | Optional custom identifier for the request. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-5 "Direct link to Returns")

`Promise`<{
`color`: `string`;
`id`: `string`;
`isFavorite`: `boolean`;
`name`: `string`;
`order`: `number` \| `null`;
}>

A promise that resolves to the created label.

* * *

### addProject() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#addproject "Direct link to addProject()")

```ts
addProject(args: AddProjectArgs, requestId?: string): Promise<
  | {
  canAssignTasks: boolean;
  childOrder: number;
  color: string;
  createdAt: string | null;
  defaultOrder: number;
  description: string;
  id: string;
  inboxProject: boolean;
  isArchived: boolean;
  isCollapsed: boolean;
  isDeleted: boolean;
  isFavorite: boolean;
  isFrozen: boolean;
  isShared: boolean;
  name: string;
  parentId: string | null;
  updatedAt: string | null;
  url: string;
  viewStyle: string;
}
  | {
  access?: {
     visibility: "restricted" | "team" | "public";
  };
  canAssignTasks: boolean;
  childOrder: number;
  collaboratorRoleDefault: string;
  color: string;
  createdAt: string | null;
  defaultOrder: number;
  description: string;
  folderId: string | null;
  id: string;
  isArchived: boolean;
  isCollapsed: boolean;
  isDeleted: boolean;
  isFavorite: boolean;
  isFrozen: boolean;
  isInviteOnly: boolean | null;
  isLinkSharingEnabled: boolean;
  isShared: boolean;
  name: string;
  role: string | null;
  status: string;
  updatedAt: string | null;
  url: string;
  viewStyle: string;
  workspaceId: string;
}>;
```

Creates a new project with the provided parameters.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-6 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `args` | [`AddProjectArgs`](https://doist.github.io/todoist-api-typescript/api/type-aliases/AddProjectArgs) | Project creation parameters such as name or color. |
| `requestId?` | `string` | Optional custom identifier for the request. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-6 "Direct link to Returns")

`Promise`<
\| {
`canAssignTasks`: `boolean`;
`childOrder`: `number`;
`color`: `string`;
`createdAt`: `string` \| `null`;
`defaultOrder`: `number`;
`description`: `string`;
`id`: `string`;
`inboxProject`: `boolean`;
`isArchived`: `boolean`;
`isCollapsed`: `boolean`;
`isDeleted`: `boolean`;
`isFavorite`: `boolean`;
`isFrozen`: `boolean`;
`isShared`: `boolean`;
`name`: `string`;
`parentId`: `string` \| `null`;
`updatedAt`: `string` \| `null`;
`url`: `string`;
`viewStyle`: `string`;
}
\| {
`access?`: {
`visibility`: `"restricted"` \| `"team"` \| `"public"`;
};
`canAssignTasks`: `boolean`;
`childOrder`: `number`;
`collaboratorRoleDefault`: `string`;
`color`: `string`;
`createdAt`: `string` \| `null`;
`defaultOrder`: `number`;
`description`: `string`;
`folderId`: `string` \| `null`;
`id`: `string`;
`isArchived`: `boolean`;
`isCollapsed`: `boolean`;
`isDeleted`: `boolean`;
`isFavorite`: `boolean`;
`isFrozen`: `boolean`;
`isInviteOnly`: `boolean` \| `null`;
`isLinkSharingEnabled`: `boolean`;
`isShared`: `boolean`;
`name`: `string`;
`role`: `string` \| `null`;
`status`: `string`;
`updatedAt`: `string` \| `null`;
`url`: `string`;
`viewStyle`: `string`;
`workspaceId`: `string`;
}>

A promise that resolves to the created project.

* * *

### addSection() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#addsection "Direct link to addSection()")

```ts
addSection(args: AddSectionArgs, requestId?: string): Promise<{
  addedAt: string;
  archivedAt: string | null;
  id: string;
  isArchived: boolean;
  isCollapsed: boolean;
  isDeleted: boolean;
  name: string;
  projectId: string;
  sectionOrder: number;
  updatedAt: string;
  url: string;
  userId: string;
}>;
```

Creates a new section within a project.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-7 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `args` | [`AddSectionArgs`](https://doist.github.io/todoist-api-typescript/api/type-aliases/AddSectionArgs) | Section creation parameters such as name or project ID. |
| `requestId?` | `string` | Optional custom identifier for the request. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-7 "Direct link to Returns")

`Promise`<{
`addedAt`: `string`;
`archivedAt`: `string` \| `null`;
`id`: `string`;
`isArchived`: `boolean`;
`isCollapsed`: `boolean`;
`isDeleted`: `boolean`;
`name`: `string`;
`projectId`: `string`;
`sectionOrder`: `number`;
`updatedAt`: `string`;
`url`: `string`;
`userId`: `string`;
}>

A promise that resolves to the created section.

* * *

### addTask() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#addtask "Direct link to addTask()")

```ts
addTask(args: AddTaskArgs, requestId?: string): Promise<{
  addedAt: string | null;
  addedByUid: string | null;
  assignedByUid: string | null;
  checked: boolean;
  childOrder: number;
  completedAt: string | null;
  content: string;
  dayOrder: number;
  deadline:   | {
     date: string;
     lang: string;
   }
     | null;
  description: string;
  due:   | {
     date: string;
     datetime?: string | null;
     isRecurring: boolean;
     lang?: string | null;
     string: string;
     timezone?: string | null;
   }
     | null;
  duration:   | {
     amount: number;
     unit: "minute" | "day";
   }
     | null;
  id: string;
  isCollapsed: boolean;
  isDeleted: boolean;
  isUncompletable: boolean;
  labels: string[];
  noteCount: number;
  parentId: string | null;
  priority: number;
  projectId: string;
  responsibleUid: string | null;
  sectionId: string | null;
  updatedAt: string | null;
  url: string;
  userId: string;
}>;
```

Creates a new task with the provided parameters.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-8 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `args` | [`AddTaskArgs`](https://doist.github.io/todoist-api-typescript/api/type-aliases/AddTaskArgs) | Task creation parameters such as content, due date, or priority. |
| `requestId?` | `string` | Optional custom identifier for the request. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-8 "Direct link to Returns")

`Promise`<{
`addedAt`: `string` \| `null`;
`addedByUid`: `string` \| `null`;
`assignedByUid`: `string` \| `null`;
`checked`: `boolean`;
`childOrder`: `number`;
`completedAt`: `string` \| `null`;
`content`: `string`;
`dayOrder`: `number`;
`deadline`: \| {
`date`: `string`;
`lang`: `string`;
}
\| `null`;
`description`: `string`;
`due`: \| {
`date`: `string`;
`datetime?`: `string` \| `null`;
`isRecurring`: `boolean`;
`lang?`: `string` \| `null`;
`string`: `string`;
`timezone?`: `string` \| `null`;
}
\| `null`;
`duration`: \| {
`amount`: `number`;
`unit`: `"minute"` \| `"day"`;
}
\| `null`;
`id`: `string`;
`isCollapsed`: `boolean`;
`isDeleted`: `boolean`;
`isUncompletable`: `boolean`;
`labels`: `string`\[\];
`noteCount`: `number`;
`parentId`: `string` \| `null`;
`priority`: `number`;
`projectId`: `string`;
`responsibleUid`: `string` \| `null`;
`sectionId`: `string` \| `null`;
`updatedAt`: `string` \| `null`;
`url`: `string`;
`userId`: `string`;
}>

A promise that resolves to the created task.

* * *

### archiveProject() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#archiveproject "Direct link to archiveProject()")

```ts
archiveProject(id: string, requestId?: string): Promise<
  | {
  canAssignTasks: boolean;
  childOrder: number;
  color: string;
  createdAt: string | null;
  defaultOrder: number;
  description: string;
  id: string;
  inboxProject: boolean;
  isArchived: boolean;
  isCollapsed: boolean;
  isDeleted: boolean;
  isFavorite: boolean;
  isFrozen: boolean;
  isShared: boolean;
  name: string;
  parentId: string | null;
  updatedAt: string | null;
  url: string;
  viewStyle: string;
}
  | {
  access?: {
     visibility: "restricted" | "team" | "public";
  };
  canAssignTasks: boolean;
  childOrder: number;
  collaboratorRoleDefault: string;
  color: string;
  createdAt: string | null;
  defaultOrder: number;
  description: string;
  folderId: string | null;
  id: string;
  isArchived: boolean;
  isCollapsed: boolean;
  isDeleted: boolean;
  isFavorite: boolean;
  isFrozen: boolean;
  isInviteOnly: boolean | null;
  isLinkSharingEnabled: boolean;
  isShared: boolean;
  name: string;
  role: string | null;
  status: string;
  updatedAt: string | null;
  url: string;
  viewStyle: string;
  workspaceId: string;
}>;
```

Archives a project by its ID.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-9 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `id` | `string` | The unique identifier of the project to archive. |
| `requestId?` | `string` | Optional custom identifier for the request. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-9 "Direct link to Returns")

`Promise`<
\| {
`canAssignTasks`: `boolean`;
`childOrder`: `number`;
`color`: `string`;
`createdAt`: `string` \| `null`;
`defaultOrder`: `number`;
`description`: `string`;
`id`: `string`;
`inboxProject`: `boolean`;
`isArchived`: `boolean`;
`isCollapsed`: `boolean`;
`isDeleted`: `boolean`;
`isFavorite`: `boolean`;
`isFrozen`: `boolean`;
`isShared`: `boolean`;
`name`: `string`;
`parentId`: `string` \| `null`;
`updatedAt`: `string` \| `null`;
`url`: `string`;
`viewStyle`: `string`;
}
\| {
`access?`: {
`visibility`: `"restricted"` \| `"team"` \| `"public"`;
};
`canAssignTasks`: `boolean`;
`childOrder`: `number`;
`collaboratorRoleDefault`: `string`;
`color`: `string`;
`createdAt`: `string` \| `null`;
`defaultOrder`: `number`;
`description`: `string`;
`folderId`: `string` \| `null`;
`id`: `string`;
`isArchived`: `boolean`;
`isCollapsed`: `boolean`;
`isDeleted`: `boolean`;
`isFavorite`: `boolean`;
`isFrozen`: `boolean`;
`isInviteOnly`: `boolean` \| `null`;
`isLinkSharingEnabled`: `boolean`;
`isShared`: `boolean`;
`name`: `string`;
`role`: `string` \| `null`;
`status`: `string`;
`updatedAt`: `string` \| `null`;
`url`: `string`;
`viewStyle`: `string`;
`workspaceId`: `string`;
}>

A promise that resolves to the updated project.

* * *

### closeTask() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#closetask "Direct link to closeTask()")

```ts
closeTask(id: string, requestId?: string): Promise<boolean>;
```

Closes (completes) a task by its ID.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-10 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `id` | `string` | The unique identifier of the task to close. |
| `requestId?` | `string` | Optional custom identifier for the request. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-10 "Direct link to Returns")

`Promise`<`boolean`>

A promise that resolves to `true` if successful.

* * *

### deleteComment() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#deletecomment "Direct link to deleteComment()")

```ts
deleteComment(id: string, requestId?: string): Promise<boolean>;
```

Deletes a comment by its ID.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-11 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `id` | `string` | The unique identifier of the comment to delete. |
| `requestId?` | `string` | Optional custom identifier for the request. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-11 "Direct link to Returns")

`Promise`<`boolean`>

A promise that resolves to `true` if successful.

* * *

### deleteLabel() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#deletelabel "Direct link to deleteLabel()")

```ts
deleteLabel(id: string, requestId?: string): Promise<boolean>;
```

Deletes a label by its ID.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-12 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `id` | `string` | The unique identifier of the label to delete. |
| `requestId?` | `string` | Optional custom identifier for the request. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-12 "Direct link to Returns")

`Promise`<`boolean`>

A promise that resolves to `true` if successful.

* * *

### deleteProject() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#deleteproject "Direct link to deleteProject()")

```ts
deleteProject(id: string, requestId?: string): Promise<boolean>;
```

Deletes a project by its ID.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-13 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `id` | `string` | The unique identifier of the project to delete. |
| `requestId?` | `string` | Optional custom identifier for the request. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-13 "Direct link to Returns")

`Promise`<`boolean`>

A promise that resolves to `true` if successful.

* * *

### deleteSection() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#deletesection "Direct link to deleteSection()")

```ts
deleteSection(id: string, requestId?: string): Promise<boolean>;
```

Deletes a section by its ID.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-14 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `id` | `string` | The unique identifier of the section to delete. |
| `requestId?` | `string` | Optional custom identifier for the request. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-14 "Direct link to Returns")

`Promise`<`boolean`>

A promise that resolves to `true` if successful.

* * *

### deleteTask() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#deletetask "Direct link to deleteTask()")

```ts
deleteTask(id: string, requestId?: string): Promise<boolean>;
```

Deletes a task by its ID.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-15 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `id` | `string` | The unique identifier of the task to delete. |
| `requestId?` | `string` | Optional custom identifier for the request. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-15 "Direct link to Returns")

`Promise`<`boolean`>

A promise that resolves to `true` if successful.

* * *

### deleteUpload() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#deleteupload "Direct link to deleteUpload()")

```ts
deleteUpload(args: DeleteUploadArgs, requestId?: string): Promise<boolean>;
```

Deletes an uploaded file by its URL.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-16 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `args` | [`DeleteUploadArgs`](https://doist.github.io/todoist-api-typescript/api/type-aliases/DeleteUploadArgs) | The file URL to delete. |
| `requestId?` | `string` | Optional custom identifier for the request. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-16 "Direct link to Returns")

`Promise`<`boolean`>

A promise that resolves to `true` if deletion was successful.

#### Example [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#example "Direct link to Example")

```typescript
await api.deleteUpload({
  fileUrl: 'https://cdn.todoist.com/...'
})
```

* * *

### deleteWorkspaceInvitation() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#deleteworkspaceinvitation "Direct link to deleteWorkspaceInvitation()")

```ts
deleteWorkspaceInvitation(args: DeleteWorkspaceInvitationArgs, requestId?: string): Promise<{
  id: string;
  inviterId: string;
  isExistingUser: boolean;
  role: "ADMIN" | "MEMBER" | "GUEST";
  userEmail: string;
  workspaceId: string;
}>;
```

Deletes a workspace invitation (admin only).

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-17 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `args` | [`DeleteWorkspaceInvitationArgs`](https://doist.github.io/todoist-api-typescript/api/type-aliases/DeleteWorkspaceInvitationArgs) | Arguments including workspace ID and user email. |
| `requestId?` | `string` | Optional request ID for idempotency. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-17 "Direct link to Returns")

`Promise`<{
`id`: `string`;
`inviterId`: `string`;
`isExistingUser`: `boolean`;
`role`: `"ADMIN"` \| `"MEMBER"` \| `"GUEST"`;
`userEmail`: `string`;
`workspaceId`: `string`;
}>

The deleted invitation.

* * *

### getActivityLogs() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#getactivitylogs "Direct link to getActivityLogs()")

```ts
getActivityLogs(args?: GetActivityLogsArgs): Promise<GetActivityLogsResponse>;
```

Retrieves activity logs with optional filters.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-18 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `args` | [`GetActivityLogsArgs`](https://doist.github.io/todoist-api-typescript/api/type-aliases/GetActivityLogsArgs) | Optional filter parameters for activity logs. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-18 "Direct link to Returns")

`Promise`< [`GetActivityLogsResponse`](https://doist.github.io/todoist-api-typescript/api/type-aliases/GetActivityLogsResponse) >

A promise that resolves to a paginated response of activity events.

* * *

### getAllWorkspaceInvitations() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#getallworkspaceinvitations "Direct link to getAllWorkspaceInvitations()")

```ts
getAllWorkspaceInvitations(args?: {
  workspaceId?: number;
}, requestId?: string): Promise<AllWorkspaceInvitationsResponse>;
```

Gets all workspace invitations (admin only).

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-19 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `args` | { `workspaceId?`: `number`; } | - |
| `args.workspaceId?` | `number` | - |
| `requestId?` | `string` | Optional request ID for idempotency. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-19 "Direct link to Returns")

`Promise`< [`AllWorkspaceInvitationsResponse`](https://doist.github.io/todoist-api-typescript/api/type-aliases/AllWorkspaceInvitationsResponse) >

Array of email addresses with pending invitations.

* * *

### getArchivedProjects() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#getarchivedprojects "Direct link to getArchivedProjects()")

```ts
getArchivedProjects(args?: GetArchivedProjectsArgs): Promise<GetArchivedProjectsResponse>;
```

Retrieves all archived projects with optional filters.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-20 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `args` | [`GetArchivedProjectsArgs`](https://doist.github.io/todoist-api-typescript/api/type-aliases/GetArchivedProjectsArgs) | Optional filters for retrieving archived projects. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-20 "Direct link to Returns")

`Promise`< [`GetArchivedProjectsResponse`](https://doist.github.io/todoist-api-typescript/api/type-aliases/GetArchivedProjectsResponse) >

A promise that resolves to an array of archived projects.

* * *

### getComment() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#getcomment "Direct link to getComment()")

```ts
getComment(id: string): Promise<{
  content: string;
  fileAttachment:   | {
     fileDuration?: number | null;
     fileName?: string | null;
     fileSize?: number | null;
     fileType?: string | null;
     fileUrl?: string | null;
     image?: string | null;
     imageHeight?: number | null;
     imageWidth?: number | null;
     resourceType: string;
     title?: string | null;
     uploadState?: "pending" | "completed" | null;
     url?: string | null;
   }
     | null;
  id: string;
  isDeleted: boolean;
  postedAt: string;
  postedUid: string;
  projectId?: string;
  reactions: Record<string, string[]> | null;
  taskId: string | undefined;
  uidsToNotify: string[] | null;
}>;
```

Retrieves a specific comment by its ID.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-21 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `id` | `string` | The unique identifier of the comment to retrieve. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-21 "Direct link to Returns")

`Promise`<{
`content`: `string`;
`fileAttachment`: \| {
`fileDuration?`: `number` \| `null`;
`fileName?`: `string` \| `null`;
`fileSize?`: `number` \| `null`;
`fileType?`: `string` \| `null`;
`fileUrl?`: `string` \| `null`;
`image?`: `string` \| `null`;
`imageHeight?`: `number` \| `null`;
`imageWidth?`: `number` \| `null`;
`resourceType`: `string`;
`title?`: `string` \| `null`;
`uploadState?`: `"pending"` \| `"completed"` \| `null`;
`url?`: `string` \| `null`;
}
\| `null`;
`id`: `string`;
`isDeleted`: `boolean`;
`postedAt`: `string`;
`postedUid`: `string`;
`projectId?`: `string`;
`reactions`: `Record`<`string`, `string`\[\]\> \| `null`;
`taskId`: `string` \| `undefined`;
`uidsToNotify`: `string`\[\] \| `null`;
}>

A promise that resolves to the requested comment.

* * *

### getComments() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#getcomments "Direct link to getComments()")

```ts
getComments(args:
  | GetTaskCommentsArgs
| GetProjectCommentsArgs): Promise<GetCommentsResponse>;
```

Retrieves all comments associated with a task or project.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-22 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `args` | \| [`GetTaskCommentsArgs`](https://doist.github.io/todoist-api-typescript/api/type-aliases/GetTaskCommentsArgs) \| [`GetProjectCommentsArgs`](https://doist.github.io/todoist-api-typescript/api/type-aliases/GetProjectCommentsArgs) | Parameters for retrieving comments, such as task ID or project ID. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-22 "Direct link to Returns")

`Promise`< [`GetCommentsResponse`](https://doist.github.io/todoist-api-typescript/api/type-aliases/GetCommentsResponse) >

A promise that resolves to an array of comments.

* * *

### getCompletedTasksByCompletionDate() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#getcompletedtasksbycompletiondate "Direct link to getCompletedTasksByCompletionDate()")

```ts
getCompletedTasksByCompletionDate(args: GetCompletedTasksByCompletionDateArgs): Promise<GetCompletedTasksResponse>;
```

Retrieves completed tasks by completion date.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-23 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `args` | [`GetCompletedTasksByCompletionDateArgs`](https://doist.github.io/todoist-api-typescript/api/type-aliases/GetCompletedTasksByCompletionDateArgs) | Parameters for filtering, including required since, until. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-23 "Direct link to Returns")

`Promise`< [`GetCompletedTasksResponse`](https://doist.github.io/todoist-api-typescript/api/type-aliases/GetCompletedTasksResponse) >

A promise that resolves to a paginated response of completed tasks.

* * *

### getCompletedTasksByDueDate() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#getcompletedtasksbyduedate "Direct link to getCompletedTasksByDueDate()")

```ts
getCompletedTasksByDueDate(args: GetCompletedTasksByDueDateArgs): Promise<GetCompletedTasksResponse>;
```

Retrieves completed tasks by due date.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-24 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `args` | [`GetCompletedTasksByDueDateArgs`](https://doist.github.io/todoist-api-typescript/api/type-aliases/GetCompletedTasksByDueDateArgs) | Parameters for filtering, including required since, until. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-24 "Direct link to Returns")

`Promise`< [`GetCompletedTasksResponse`](https://doist.github.io/todoist-api-typescript/api/type-aliases/GetCompletedTasksResponse) >

A promise that resolves to a paginated response of completed tasks.

* * *

### getLabel() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#getlabel "Direct link to getLabel()")

```ts
getLabel(id: string): Promise<{
  color: string;
  id: string;
  isFavorite: boolean;
  name: string;
  order: number | null;
}>;
```

Retrieves a label by its ID.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-25 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `id` | `string` | The unique identifier of the label. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-25 "Direct link to Returns")

`Promise`<{
`color`: `string`;
`id`: `string`;
`isFavorite`: `boolean`;
`name`: `string`;
`order`: `number` \| `null`;
}>

A promise that resolves to the requested label.

* * *

### getLabels() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#getlabels "Direct link to getLabels()")

```ts
getLabels(args?: GetLabelsArgs): Promise<GetLabelsResponse>;
```

Retrieves all labels.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-26 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `args` | [`GetLabelsArgs`](https://doist.github.io/todoist-api-typescript/api/type-aliases/GetLabelsArgs) | Optional filter parameters. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-26 "Direct link to Returns")

`Promise`< [`GetLabelsResponse`](https://doist.github.io/todoist-api-typescript/api/type-aliases/GetLabelsResponse) >

A promise that resolves to an array of labels.

* * *

### getProductivityStats() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#getproductivitystats "Direct link to getProductivityStats()")

```ts
getProductivityStats(): Promise<{
  completedCount: number;
  daysItems: {
     date: string;
     items: {
        completed: number;
        id: string;
     }[];
     totalCompleted: number;
  }[];
  goals: {
     currentDailyStreak: {
        count: number;
        end: string;
        start: string;
     };
     currentWeeklyStreak: {
        count: number;
        end: string;
        start: string;
     };
     dailyGoal: number;
     ignoreDays: number[];
     karmaDisabled: number;
     lastDailyStreak: {
        count: number;
        end: string;
        start: string;
     };
     lastWeeklyStreak: {
        count: number;
        end: string;
        start: string;
     };
     maxDailyStreak: {
        count: number;
        end: string;
        start: string;
     };
     maxWeeklyStreak: {
        count: number;
        end: string;
        start: string;
     };
     user: string;
     userId: string;
     vacationMode: number;
     weeklyGoal: number;
  };
  karma: number;
  karmaGraphData: {
     date: string;
     karmaAvg: number;
  }[];
  karmaLastUpdate: number;
  karmaTrend: string;
  karmaUpdateReasons: {
     negativeKarma: number;
     negativeKarmaReasons: any[];
     newKarma: number;
     positiveKarma: number;
     positiveKarmaReasons: any[];
     time: string;
  }[];
  projectColors: Record<string, string>;
  weekItems: {
     from: string;
     items: {
        completed: number;
        id: string;
     }[];
     to: string;
     totalCompleted: number;
  }[];
}>;
```

Retrieves productivity stats for the authenticated user.

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-27 "Direct link to Returns")

`Promise`<{
`completedCount`: `number`;
`daysItems`: {
`date`: `string`;
`items`: {
`completed`: `number`;
`id`: `string`;
}\[\];
`totalCompleted`: `number`;
}\[\];
`goals`: {
`currentDailyStreak`: {
`count`: `number`;
`end`: `string`;
`start`: `string`;
};
`currentWeeklyStreak`: {
`count`: `number`;
`end`: `string`;
`start`: `string`;
};
`dailyGoal`: `number`;
`ignoreDays`: `number`\[\];
`karmaDisabled`: `number`;
`lastDailyStreak`: {
`count`: `number`;
`end`: `string`;
`start`: `string`;
};
`lastWeeklyStreak`: {
`count`: `number`;
`end`: `string`;
`start`: `string`;
};
`maxDailyStreak`: {
`count`: `number`;
`end`: `string`;
`start`: `string`;
};
`maxWeeklyStreak`: {
`count`: `number`;
`end`: `string`;
`start`: `string`;
};
`user`: `string`;
`userId`: `string`;
`vacationMode`: `number`;
`weeklyGoal`: `number`;
};
`karma`: `number`;
`karmaGraphData`: {
`date`: `string`;
`karmaAvg`: `number`;
}\[\];
`karmaLastUpdate`: `number`;
`karmaTrend`: `string`;
`karmaUpdateReasons`: {
`negativeKarma`: `number`;
`negativeKarmaReasons`: `any`\[\];
`newKarma`: `number`;
`positiveKarma`: `number`;
`positiveKarmaReasons`: `any`\[\];
`time`: `string`;
}\[\];
`projectColors`: `Record`<`string`, `string`>;
`weekItems`: {
`from`: `string`;
`items`: {
`completed`: `number`;
`id`: `string`;
}\[\];
`to`: `string`;
`totalCompleted`: `number`;
}\[\];
}>

A promise that resolves to the productivity stats.

* * *

### getProject() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#getproject "Direct link to getProject()")

```ts
getProject(id: string): Promise<
  | {
  canAssignTasks: boolean;
  childOrder: number;
  color: string;
  createdAt: string | null;
  defaultOrder: number;
  description: string;
  id: string;
  inboxProject: boolean;
  isArchived: boolean;
  isCollapsed: boolean;
  isDeleted: boolean;
  isFavorite: boolean;
  isFrozen: boolean;
  isShared: boolean;
  name: string;
  parentId: string | null;
  updatedAt: string | null;
  url: string;
  viewStyle: string;
}
  | {
  access?: {
     visibility: "restricted" | "team" | "public";
  };
  canAssignTasks: boolean;
  childOrder: number;
  collaboratorRoleDefault: string;
  color: string;
  createdAt: string | null;
  defaultOrder: number;
  description: string;
  folderId: string | null;
  id: string;
  isArchived: boolean;
  isCollapsed: boolean;
  isDeleted: boolean;
  isFavorite: boolean;
  isFrozen: boolean;
  isInviteOnly: boolean | null;
  isLinkSharingEnabled: boolean;
  isShared: boolean;
  name: string;
  role: string | null;
  status: string;
  updatedAt: string | null;
  url: string;
  viewStyle: string;
  workspaceId: string;
}>;
```

Retrieves a project by its ID.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-27 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `id` | `string` | The unique identifier of the project. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-28 "Direct link to Returns")

`Promise`<
\| {
`canAssignTasks`: `boolean`;
`childOrder`: `number`;
`color`: `string`;
`createdAt`: `string` \| `null`;
`defaultOrder`: `number`;
`description`: `string`;
`id`: `string`;
`inboxProject`: `boolean`;
`isArchived`: `boolean`;
`isCollapsed`: `boolean`;
`isDeleted`: `boolean`;
`isFavorite`: `boolean`;
`isFrozen`: `boolean`;
`isShared`: `boolean`;
`name`: `string`;
`parentId`: `string` \| `null`;
`updatedAt`: `string` \| `null`;
`url`: `string`;
`viewStyle`: `string`;
}
\| {
`access?`: {
`visibility`: `"restricted"` \| `"team"` \| `"public"`;
};
`canAssignTasks`: `boolean`;
`childOrder`: `number`;
`collaboratorRoleDefault`: `string`;
`color`: `string`;
`createdAt`: `string` \| `null`;
`defaultOrder`: `number`;
`description`: `string`;
`folderId`: `string` \| `null`;
`id`: `string`;
`isArchived`: `boolean`;
`isCollapsed`: `boolean`;
`isDeleted`: `boolean`;
`isFavorite`: `boolean`;
`isFrozen`: `boolean`;
`isInviteOnly`: `boolean` \| `null`;
`isLinkSharingEnabled`: `boolean`;
`isShared`: `boolean`;
`name`: `string`;
`role`: `string` \| `null`;
`status`: `string`;
`updatedAt`: `string` \| `null`;
`url`: `string`;
`viewStyle`: `string`;
`workspaceId`: `string`;
}>

A promise that resolves to the requested project.

* * *

### getProjectCollaborators() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#getprojectcollaborators "Direct link to getProjectCollaborators()")

```ts
getProjectCollaborators(projectId: string, args?: GetProjectCollaboratorsArgs): Promise<GetProjectCollaboratorsResponse>;
```

Retrieves a list of collaborators for a specific project.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-28 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `projectId` | `string` | The unique identifier of the project. |
| `args` | [`GetProjectCollaboratorsArgs`](https://doist.github.io/todoist-api-typescript/api/type-aliases/GetProjectCollaboratorsArgs) | Optional parameters to filter collaborators. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-29 "Direct link to Returns")

`Promise`< [`GetProjectCollaboratorsResponse`](https://doist.github.io/todoist-api-typescript/api/type-aliases/GetProjectCollaboratorsResponse) >

A promise that resolves to an array of collaborators for the project.

* * *

### getProjects() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#getprojects "Direct link to getProjects()")

```ts
getProjects(args?: GetProjectsArgs): Promise<GetProjectsResponse>;
```

Retrieves all projects with optional filters.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-29 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `args` | [`GetProjectsArgs`](https://doist.github.io/todoist-api-typescript/api/type-aliases/GetProjectsArgs) | Optional filters for retrieving projects. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-30 "Direct link to Returns")

`Promise`< [`GetProjectsResponse`](https://doist.github.io/todoist-api-typescript/api/type-aliases/GetProjectsResponse) >

A promise that resolves to an array of projects.

* * *

### getSection() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#getsection "Direct link to getSection()")

```ts
getSection(id: string): Promise<{
  addedAt: string;
  archivedAt: string | null;
  id: string;
  isArchived: boolean;
  isCollapsed: boolean;
  isDeleted: boolean;
  name: string;
  projectId: string;
  sectionOrder: number;
  updatedAt: string;
  url: string;
  userId: string;
}>;
```

Retrieves a single section by its ID.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-30 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `id` | `string` | The unique identifier of the section. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-31 "Direct link to Returns")

`Promise`<{
`addedAt`: `string`;
`archivedAt`: `string` \| `null`;
`id`: `string`;
`isArchived`: `boolean`;
`isCollapsed`: `boolean`;
`isDeleted`: `boolean`;
`name`: `string`;
`projectId`: `string`;
`sectionOrder`: `number`;
`updatedAt`: `string`;
`url`: `string`;
`userId`: `string`;
}>

A promise that resolves to the requested section.

* * *

### getSections() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#getsections "Direct link to getSections()")

```ts
getSections(args?: GetSectionsArgs): Promise<GetSectionsResponse>;
```

Retrieves all sections within a specific project or matching criteria.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-31 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `args?` | [`GetSectionsArgs`](https://doist.github.io/todoist-api-typescript/api/type-aliases/GetSectionsArgs) | Filter parameters such as project ID. If no projectId is provided, all sections are returned. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-32 "Direct link to Returns")

`Promise`< [`GetSectionsResponse`](https://doist.github.io/todoist-api-typescript/api/type-aliases/GetSectionsResponse) >

A promise that resolves to an array of sections.

* * *

### getSharedLabels() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#getsharedlabels "Direct link to getSharedLabels()")

```ts
getSharedLabels(args?: GetSharedLabelsArgs): Promise<GetSharedLabelsResponse>;
```

Retrieves a list of shared labels.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-32 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `args?` | [`GetSharedLabelsArgs`](https://doist.github.io/todoist-api-typescript/api/type-aliases/GetSharedLabelsArgs) | Optional parameters to filter shared labels. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-33 "Direct link to Returns")

`Promise`< [`GetSharedLabelsResponse`](https://doist.github.io/todoist-api-typescript/api/type-aliases/GetSharedLabelsResponse) >

A promise that resolves to an array of shared labels.

* * *

### getTask() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#gettask "Direct link to getTask()")

```ts
getTask(id: string): Promise<{
  addedAt: string | null;
  addedByUid: string | null;
  assignedByUid: string | null;
  checked: boolean;
  childOrder: number;
  completedAt: string | null;
  content: string;
  dayOrder: number;
  deadline:   | {
     date: string;
     lang: string;
   }
     | null;
  description: string;
  due:   | {
     date: string;
     datetime?: string | null;
     isRecurring: boolean;
     lang?: string | null;
     string: string;
     timezone?: string | null;
   }
     | null;
  duration:   | {
     amount: number;
     unit: "minute" | "day";
   }
     | null;
  id: string;
  isCollapsed: boolean;
  isDeleted: boolean;
  isUncompletable: boolean;
  labels: string[];
  noteCount: number;
  parentId: string | null;
  priority: number;
  projectId: string;
  responsibleUid: string | null;
  sectionId: string | null;
  updatedAt: string | null;
  url: string;
  userId: string;
}>;
```

Retrieves a single active (non-completed) task by its ID.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-33 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `id` | `string` | The unique identifier of the task. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-34 "Direct link to Returns")

`Promise`<{
`addedAt`: `string` \| `null`;
`addedByUid`: `string` \| `null`;
`assignedByUid`: `string` \| `null`;
`checked`: `boolean`;
`childOrder`: `number`;
`completedAt`: `string` \| `null`;
`content`: `string`;
`dayOrder`: `number`;
`deadline`: \| {
`date`: `string`;
`lang`: `string`;
}
\| `null`;
`description`: `string`;
`due`: \| {
`date`: `string`;
`datetime?`: `string` \| `null`;
`isRecurring`: `boolean`;
`lang?`: `string` \| `null`;
`string`: `string`;
`timezone?`: `string` \| `null`;
}
\| `null`;
`duration`: \| {
`amount`: `number`;
`unit`: `"minute"` \| `"day"`;
}
\| `null`;
`id`: `string`;
`isCollapsed`: `boolean`;
`isDeleted`: `boolean`;
`isUncompletable`: `boolean`;
`labels`: `string`\[\];
`noteCount`: `number`;
`parentId`: `string` \| `null`;
`priority`: `number`;
`projectId`: `string`;
`responsibleUid`: `string` \| `null`;
`sectionId`: `string` \| `null`;
`updatedAt`: `string` \| `null`;
`url`: `string`;
`userId`: `string`;
}>

A promise that resolves to the requested task.

* * *

### getTasks() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#gettasks "Direct link to getTasks()")

```ts
getTasks(args?: GetTasksArgs): Promise<GetTasksResponse>;
```

Retrieves a list of active tasks filtered by specific parameters.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-34 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `args` | [`GetTasksArgs`](https://doist.github.io/todoist-api-typescript/api/type-aliases/GetTasksArgs) | Filter parameters such as project ID, label ID, or due date. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-35 "Direct link to Returns")

`Promise`< [`GetTasksResponse`](https://doist.github.io/todoist-api-typescript/api/type-aliases/GetTasksResponse) >

A promise that resolves to an array of tasks.

* * *

### getTasksByFilter() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#gettasksbyfilter "Direct link to getTasksByFilter()")

```ts
getTasksByFilter(args: GetTasksByFilterArgs): Promise<GetTasksResponse>;
```

Retrieves tasks filtered by a filter string.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-35 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `args` | [`GetTasksByFilterArgs`](https://doist.github.io/todoist-api-typescript/api/type-aliases/GetTasksByFilterArgs) | Parameters for filtering tasks, including the query string and optional language. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-36 "Direct link to Returns")

`Promise`< [`GetTasksResponse`](https://doist.github.io/todoist-api-typescript/api/type-aliases/GetTasksResponse) >

A promise that resolves to a paginated response of tasks.

* * *

### getUser() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#getuser "Direct link to getUser()")

```ts
getUser(): Promise<{
  avatarBig?: string | null;
  avatarMedium?: string | null;
  avatarS640?: string | null;
  avatarSmall?: string | null;
  businessAccountId: string | null;
  completedCount: number;
  completedToday: number;
  dailyGoal: number;
  dateFormat: number;
  daysOff: number[];
  email: string;
  fullName: string;
  id: string;
  inboxProjectId: string;
  isPremium: boolean;
  karma: number;
  karmaTrend: string;
  lang: string;
  nextWeek: number;
  premiumStatus:   | "not_premium"
     | "current_personal_plan"
     | "legacy_personal_plan"
     | "teams_business_member";
  startDay: number;
  startPage: string;
  timeFormat: number;
  tzInfo: {
     gmtString: string;
     hours: number;
     isDst: number;
     minutes: number;
     timezone: string;
  };
  weekendStartDay: number;
  weeklyGoal: number;
}>;
```

Retrieves information about the authenticated user.

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-37 "Direct link to Returns")

`Promise`<{
`avatarBig?`: `string` \| `null`;
`avatarMedium?`: `string` \| `null`;
`avatarS640?`: `string` \| `null`;
`avatarSmall?`: `string` \| `null`;
`businessAccountId`: `string` \| `null`;
`completedCount`: `number`;
`completedToday`: `number`;
`dailyGoal`: `number`;
`dateFormat`: `number`;
`daysOff`: `number`\[\];
`email`: `string`;
`fullName`: `string`;
`id`: `string`;
`inboxProjectId`: `string`;
`isPremium`: `boolean`;
`karma`: `number`;
`karmaTrend`: `string`;
`lang`: `string`;
`nextWeek`: `number`;
`premiumStatus`: \| `"not_premium"`
\| `"current_personal_plan"`
\| `"legacy_personal_plan"`
\| `"teams_business_member"`;
`startDay`: `number`;
`startPage`: `string`;
`timeFormat`: `number`;
`tzInfo`: {
`gmtString`: `string`;
`hours`: `number`;
`isDst`: `number`;
`minutes`: `number`;
`timezone`: `string`;
};
`weekendStartDay`: `number`;
`weeklyGoal`: `number`;
}>

A promise that resolves to the current user's information.

* * *

### getWorkspaceActiveProjects() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#getworkspaceactiveprojects "Direct link to getWorkspaceActiveProjects()")

```ts
getWorkspaceActiveProjects(args: GetWorkspaceProjectsArgs, requestId?: string): Promise<GetProjectsResponse>;
```

Gets active projects in a workspace with pagination.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-36 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `args` | [`GetWorkspaceProjectsArgs`](https://doist.github.io/todoist-api-typescript/api/type-aliases/GetWorkspaceProjectsArgs) | Arguments including workspace ID, cursor, and limit. |
| `requestId?` | `string` | Optional request ID for idempotency. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-38 "Direct link to Returns")

`Promise`< [`GetProjectsResponse`](https://doist.github.io/todoist-api-typescript/api/type-aliases/GetProjectsResponse) >

Paginated list of active workspace projects.

* * *

### getWorkspaceArchivedProjects() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#getworkspacearchivedprojects "Direct link to getWorkspaceArchivedProjects()")

```ts
getWorkspaceArchivedProjects(args: GetWorkspaceProjectsArgs, requestId?: string): Promise<GetProjectsResponse>;
```

Gets archived projects in a workspace with pagination.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-37 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `args` | [`GetWorkspaceProjectsArgs`](https://doist.github.io/todoist-api-typescript/api/type-aliases/GetWorkspaceProjectsArgs) | Arguments including workspace ID, cursor, and limit. |
| `requestId?` | `string` | Optional request ID for idempotency. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-39 "Direct link to Returns")

`Promise`< [`GetProjectsResponse`](https://doist.github.io/todoist-api-typescript/api/type-aliases/GetProjectsResponse) >

Paginated list of archived workspace projects.

* * *

### getWorkspaceInvitations() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#getworkspaceinvitations "Direct link to getWorkspaceInvitations()")

```ts
getWorkspaceInvitations(args: GetWorkspaceInvitationsArgs, requestId?: string): Promise<WorkspaceInvitationsResponse>;
```

Gets pending invitations for a workspace.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-38 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `args` | [`GetWorkspaceInvitationsArgs`](https://doist.github.io/todoist-api-typescript/api/type-aliases/GetWorkspaceInvitationsArgs) | Arguments including workspace ID. |
| `requestId?` | `string` | Optional request ID for idempotency. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-40 "Direct link to Returns")

`Promise`< [`WorkspaceInvitationsResponse`](https://doist.github.io/todoist-api-typescript/api/type-aliases/WorkspaceInvitationsResponse) >

Array of email addresses with pending invitations.

* * *

### getWorkspacePlanDetails() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#getworkspaceplandetails "Direct link to getWorkspacePlanDetails()")

```ts
getWorkspacePlanDetails(args: GetWorkspacePlanDetailsArgs, requestId?: string): Promise<{
  cancelAtPeriodEnd: boolean;
  currentActiveProjects: number;
  currentMemberCount: number;
  currentPlan: "Business" | "Starter";
  currentPlanStatus: "Active" | "Downgraded" | "Cancelled" | "NeverSubscribed";
  downgradeAt: string | null;
  hasBillingPortal: boolean;
  hasBillingPortalSwitchToAnnual: boolean;
  hasTrialed: boolean;
  isTrialing: boolean;
  maximumActiveProjects: number;
  planPrice:   | {
     amount: string | number;
     currency: string;
     interval?: string;
   }
     | null;
  priceList: {
     amount?: number;
     currency?: string;
     formatted?: string;
     interval?: string;
  }[];
  trialEndsAt: string | null;
  workspaceId: number;
}>;
```

Gets workspace plan and billing details.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-39 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `args` | [`GetWorkspacePlanDetailsArgs`](https://doist.github.io/todoist-api-typescript/api/type-aliases/GetWorkspacePlanDetailsArgs) | Arguments including workspace ID. |
| `requestId?` | `string` | Optional request ID for idempotency. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-41 "Direct link to Returns")

`Promise`<{
`cancelAtPeriodEnd`: `boolean`;
`currentActiveProjects`: `number`;
`currentMemberCount`: `number`;
`currentPlan`: `"Business"` \| `"Starter"`;
`currentPlanStatus`: `"Active"` \| `"Downgraded"` \| `"Cancelled"` \| `"NeverSubscribed"`;
`downgradeAt`: `string` \| `null`;
`hasBillingPortal`: `boolean`;
`hasBillingPortalSwitchToAnnual`: `boolean`;
`hasTrialed`: `boolean`;
`isTrialing`: `boolean`;
`maximumActiveProjects`: `number`;
`planPrice`: \| {
`amount`: `string` \| `number`;
`currency`: `string`;
`interval?`: `string`;
}
\| `null`;
`priceList`: {
`amount?`: `number`;
`currency?`: `string`;
`formatted?`: `string`;
`interval?`: `string`;
}\[\];
`trialEndsAt`: `string` \| `null`;
`workspaceId`: `number`;
}>

Workspace plan details.

* * *

### getWorkspaces() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#getworkspaces "Direct link to getWorkspaces()")

```ts
getWorkspaces(requestId?: string): Promise<{
  createdAt: string;
  creatorId: string;
  id: string;
  inviteCode: string;
  isGuestAllowed: boolean;
  isLinkSharingEnabled: boolean;
  limits: {
   [key: string]: any;
     current: Record<string, any> | null;
     next: Record<string, any> | null;
  };
  logoBig?: string | null;
  logoMedium?: string | null;
  logoS640?: string | null;
  logoSmall?: string | null;
  name: string;
  plan: "STARTER" | "BUSINESS";
  properties: Record<string, unknown>;
  role: "ADMIN" | "MEMBER" | "GUEST";
}[]>;
```

Retrieves all workspaces for the authenticated user.

Uses the Sync API internally to fetch workspace data.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-40 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `requestId?` | `string` | Optional custom identifier for the request. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-42 "Direct link to Returns")

`Promise`<{
`createdAt`: `string`;
`creatorId`: `string`;
`id`: `string`;
`inviteCode`: `string`;
`isGuestAllowed`: `boolean`;
`isLinkSharingEnabled`: `boolean`;
`limits`: {
\[`key`: `string`\]: `any`;
`current`: `Record`<`string`, `any`\> \| `null`;
`next`: `Record`<`string`, `any`\> \| `null`;
};
`logoBig?`: `string` \| `null`;
`logoMedium?`: `string` \| `null`;
`logoS640?`: `string` \| `null`;
`logoSmall?`: `string` \| `null`;
`name`: `string`;
`plan`: `"STARTER"` \| `"BUSINESS"`;
`properties`: `Record`<`string`, `unknown`>;
`role`: `"ADMIN"` \| `"MEMBER"` \| `"GUEST"`;
}\[\]>

A promise that resolves to an array of workspaces.

#### Example [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#example-1 "Direct link to Example")

```typescript
const workspaces = await api.getWorkspaces()
workspaces.forEach(workspace => {
  console.log(`${workspace.name} (${workspace.plan}) - Role: ${workspace.role}`)
})
```

* * *

### getWorkspaceUsers() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#getworkspaceusers "Direct link to getWorkspaceUsers()")

```ts
getWorkspaceUsers(args?: GetWorkspaceUsersArgs, requestId?: string): Promise<GetWorkspaceUsersResponse>;
```

Gets workspace users with pagination.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-41 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `args` | [`GetWorkspaceUsersArgs`](https://doist.github.io/todoist-api-typescript/api/type-aliases/GetWorkspaceUsersArgs) | Arguments including optional workspace ID, cursor, and limit. |
| `requestId?` | `string` | Optional request ID for idempotency. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-43 "Direct link to Returns")

`Promise`< [`GetWorkspaceUsersResponse`](https://doist.github.io/todoist-api-typescript/api/type-aliases/GetWorkspaceUsersResponse) >

Paginated list of workspace users.

* * *

### joinWorkspace() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#joinworkspace "Direct link to joinWorkspace()")

```ts
joinWorkspace(args: JoinWorkspaceArgs, requestId?: string): Promise<{
  customSortingApplied: boolean;
  projectSortPreference: string;
  role: "ADMIN" | "MEMBER" | "GUEST";
  userId: string;
  workspaceId: string;
}>;
```

Joins a workspace via invitation link or domain auto-join.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-42 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `args` | [`JoinWorkspaceArgs`](https://doist.github.io/todoist-api-typescript/api/type-aliases/JoinWorkspaceArgs) | Arguments including invite code or workspace ID. |
| `requestId?` | `string` | Optional request ID for idempotency. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-44 "Direct link to Returns")

`Promise`<{
`customSortingApplied`: `boolean`;
`projectSortPreference`: `string`;
`role`: `"ADMIN"` \| `"MEMBER"` \| `"GUEST"`;
`userId`: `string`;
`workspaceId`: `string`;
}>

Workspace user information.

* * *

### moveProjectToPersonal() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#moveprojecttopersonal "Direct link to moveProjectToPersonal()")

```ts
moveProjectToPersonal(args: MoveProjectToPersonalArgs, requestId?: string): Promise<
  | {
  canAssignTasks: boolean;
  childOrder: number;
  color: string;
  createdAt: string | null;
  defaultOrder: number;
  description: string;
  id: string;
  inboxProject: boolean;
  isArchived: boolean;
  isCollapsed: boolean;
  isDeleted: boolean;
  isFavorite: boolean;
  isFrozen: boolean;
  isShared: boolean;
  name: string;
  parentId: string | null;
  updatedAt: string | null;
  url: string;
  viewStyle: string;
}
  | {
  access?: {
     visibility: "restricted" | "team" | "public";
  };
  canAssignTasks: boolean;
  childOrder: number;
  collaboratorRoleDefault: string;
  color: string;
  createdAt: string | null;
  defaultOrder: number;
  description: string;
  folderId: string | null;
  id: string;
  isArchived: boolean;
  isCollapsed: boolean;
  isDeleted: boolean;
  isFavorite: boolean;
  isFrozen: boolean;
  isInviteOnly: boolean | null;
  isLinkSharingEnabled: boolean;
  isShared: boolean;
  name: string;
  role: string | null;
  status: string;
  updatedAt: string | null;
  url: string;
  viewStyle: string;
  workspaceId: string;
}>;
```

Moves a project to personal.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-43 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `args` | [`MoveProjectToPersonalArgs`](https://doist.github.io/todoist-api-typescript/api/type-aliases/MoveProjectToPersonalArgs) | The arguments for moving the project. |
| `requestId?` | `string` | Optional custom identifier for the request. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-45 "Direct link to Returns")

`Promise`<
\| {
`canAssignTasks`: `boolean`;
`childOrder`: `number`;
`color`: `string`;
`createdAt`: `string` \| `null`;
`defaultOrder`: `number`;
`description`: `string`;
`id`: `string`;
`inboxProject`: `boolean`;
`isArchived`: `boolean`;
`isCollapsed`: `boolean`;
`isDeleted`: `boolean`;
`isFavorite`: `boolean`;
`isFrozen`: `boolean`;
`isShared`: `boolean`;
`name`: `string`;
`parentId`: `string` \| `null`;
`updatedAt`: `string` \| `null`;
`url`: `string`;
`viewStyle`: `string`;
}
\| {
`access?`: {
`visibility`: `"restricted"` \| `"team"` \| `"public"`;
};
`canAssignTasks`: `boolean`;
`childOrder`: `number`;
`collaboratorRoleDefault`: `string`;
`color`: `string`;
`createdAt`: `string` \| `null`;
`defaultOrder`: `number`;
`description`: `string`;
`folderId`: `string` \| `null`;
`id`: `string`;
`isArchived`: `boolean`;
`isCollapsed`: `boolean`;
`isDeleted`: `boolean`;
`isFavorite`: `boolean`;
`isFrozen`: `boolean`;
`isInviteOnly`: `boolean` \| `null`;
`isLinkSharingEnabled`: `boolean`;
`isShared`: `boolean`;
`name`: `string`;
`role`: `string` \| `null`;
`status`: `string`;
`updatedAt`: `string` \| `null`;
`url`: `string`;
`viewStyle`: `string`;
`workspaceId`: `string`;
}>

A promise that resolves to the moved project.

* * *

### moveProjectToWorkspace() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#moveprojecttoworkspace "Direct link to moveProjectToWorkspace()")

```ts
moveProjectToWorkspace(args: MoveProjectToWorkspaceArgs, requestId?: string): Promise<
  | {
  canAssignTasks: boolean;
  childOrder: number;
  color: string;
  createdAt: string | null;
  defaultOrder: number;
  description: string;
  id: string;
  inboxProject: boolean;
  isArchived: boolean;
  isCollapsed: boolean;
  isDeleted: boolean;
  isFavorite: boolean;
  isFrozen: boolean;
  isShared: boolean;
  name: string;
  parentId: string | null;
  updatedAt: string | null;
  url: string;
  viewStyle: string;
}
  | {
  access?: {
     visibility: "restricted" | "team" | "public";
  };
  canAssignTasks: boolean;
  childOrder: number;
  collaboratorRoleDefault: string;
  color: string;
  createdAt: string | null;
  defaultOrder: number;
  description: string;
  folderId: string | null;
  id: string;
  isArchived: boolean;
  isCollapsed: boolean;
  isDeleted: boolean;
  isFavorite: boolean;
  isFrozen: boolean;
  isInviteOnly: boolean | null;
  isLinkSharingEnabled: boolean;
  isShared: boolean;
  name: string;
  role: string | null;
  status: string;
  updatedAt: string | null;
  url: string;
  viewStyle: string;
  workspaceId: string;
}>;
```

Moves a project to a workspace.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-44 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `args` | [`MoveProjectToWorkspaceArgs`](https://doist.github.io/todoist-api-typescript/api/type-aliases/MoveProjectToWorkspaceArgs) | The arguments for moving the project. |
| `requestId?` | `string` | Optional custom identifier for the request. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-46 "Direct link to Returns")

`Promise`<
\| {
`canAssignTasks`: `boolean`;
`childOrder`: `number`;
`color`: `string`;
`createdAt`: `string` \| `null`;
`defaultOrder`: `number`;
`description`: `string`;
`id`: `string`;
`inboxProject`: `boolean`;
`isArchived`: `boolean`;
`isCollapsed`: `boolean`;
`isDeleted`: `boolean`;
`isFavorite`: `boolean`;
`isFrozen`: `boolean`;
`isShared`: `boolean`;
`name`: `string`;
`parentId`: `string` \| `null`;
`updatedAt`: `string` \| `null`;
`url`: `string`;
`viewStyle`: `string`;
}
\| {
`access?`: {
`visibility`: `"restricted"` \| `"team"` \| `"public"`;
};
`canAssignTasks`: `boolean`;
`childOrder`: `number`;
`collaboratorRoleDefault`: `string`;
`color`: `string`;
`createdAt`: `string` \| `null`;
`defaultOrder`: `number`;
`description`: `string`;
`folderId`: `string` \| `null`;
`id`: `string`;
`isArchived`: `boolean`;
`isCollapsed`: `boolean`;
`isDeleted`: `boolean`;
`isFavorite`: `boolean`;
`isFrozen`: `boolean`;
`isInviteOnly`: `boolean` \| `null`;
`isLinkSharingEnabled`: `boolean`;
`isShared`: `boolean`;
`name`: `string`;
`role`: `string` \| `null`;
`status`: `string`;
`updatedAt`: `string` \| `null`;
`url`: `string`;
`viewStyle`: `string`;
`workspaceId`: `string`;
}>

A promise that resolves to the moved project.

* * *

### moveTask() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#movetask "Direct link to moveTask()")

```ts
moveTask(
   id: string,
   args: _RequireExactlyOne,
   requestId?: string): Promise<{
  addedAt: string | null;
  addedByUid: string | null;
  assignedByUid: string | null;
  checked: boolean;
  childOrder: number;
  completedAt: string | null;
  content: string;
  dayOrder: number;
  deadline:   | {
     date: string;
     lang: string;
   }
     | null;
  description: string;
  due:   | {
     date: string;
     datetime?: string | null;
     isRecurring: boolean;
     lang?: string | null;
     string: string;
     timezone?: string | null;
   }
     | null;
  duration:   | {
     amount: number;
     unit: "minute" | "day";
   }
     | null;
  id: string;
  isCollapsed: boolean;
  isDeleted: boolean;
  isUncompletable: boolean;
  labels: string[];
  noteCount: number;
  parentId: string | null;
  priority: number;
  projectId: string;
  responsibleUid: string | null;
  sectionId: string | null;
  updatedAt: string | null;
  url: string;
  userId: string;
}>;
```

Moves a task by its ID to either a different parent/section/project.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-45 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `id` | `string` | The unique identifier of the task to be moved. |
| `args` | `_RequireExactlyOne` | The parameters that should contain exactly one of projectId, sectionId, or parentId |
| `requestId?` | `string` | Optional custom identifier for the request. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-47 "Direct link to Returns")

`Promise`<{
`addedAt`: `string` \| `null`;
`addedByUid`: `string` \| `null`;
`assignedByUid`: `string` \| `null`;
`checked`: `boolean`;
`childOrder`: `number`;
`completedAt`: `string` \| `null`;
`content`: `string`;
`dayOrder`: `number`;
`deadline`: \| {
`date`: `string`;
`lang`: `string`;
}
\| `null`;
`description`: `string`;
`due`: \| {
`date`: `string`;
`datetime?`: `string` \| `null`;
`isRecurring`: `boolean`;
`lang?`: `string` \| `null`;
`string`: `string`;
`timezone?`: `string` \| `null`;
}
\| `null`;
`duration`: \| {
`amount`: `number`;
`unit`: `"minute"` \| `"day"`;
}
\| `null`;
`id`: `string`;
`isCollapsed`: `boolean`;
`isDeleted`: `boolean`;
`isUncompletable`: `boolean`;
`labels`: `string`\[\];
`noteCount`: `number`;
`parentId`: `string` \| `null`;
`priority`: `number`;
`projectId`: `string`;
`responsibleUid`: `string` \| `null`;
`sectionId`: `string` \| `null`;
`updatedAt`: `string` \| `null`;
`url`: `string`;
`userId`: `string`;
}>

A promise that resolves to the updated task.

* * *

### ~~moveTasks()~~ [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#movetasks "Direct link to movetasks")

```ts
moveTasks(
   ids: string[],
   args: _RequireExactlyOne,
   requestId?: string): Promise<{
  addedAt: string | null;
  addedByUid: string | null;
  assignedByUid: string | null;
  checked: boolean;
  childOrder: number;
  completedAt: string | null;
  content: string;
  dayOrder: number;
  deadline:   | {
     date: string;
     lang: string;
   }
     | null;
  description: string;
  due:   | {
     date: string;
     datetime?: string | null;
     isRecurring: boolean;
     lang?: string | null;
     string: string;
     timezone?: string | null;
   }
     | null;
  duration:   | {
     amount: number;
     unit: "minute" | "day";
   }
     | null;
  id: string;
  isCollapsed: boolean;
  isDeleted: boolean;
  isUncompletable: boolean;
  labels: string[];
  noteCount: number;
  parentId: string | null;
  priority: number;
  projectId: string;
  responsibleUid: string | null;
  sectionId: string | null;
  updatedAt: string | null;
  url: string;
  userId: string;
}[]>;
```

Moves existing tasks by their ID to either a different parent/section/project.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-46 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `ids` | `string`\[\] | The unique identifier of the tasks to be moved. |
| `args` | `_RequireExactlyOne` | The paramets that should contain only one of projectId, sectionId, or parentId |
| `requestId?` | `string` | Optional custom identifier for the request. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-48 "Direct link to Returns")

`Promise`<{
`addedAt`: `string` \| `null`;
`addedByUid`: `string` \| `null`;
`assignedByUid`: `string` \| `null`;
`checked`: `boolean`;
`childOrder`: `number`;
`completedAt`: `string` \| `null`;
`content`: `string`;
`dayOrder`: `number`;
`deadline`: \| {
`date`: `string`;
`lang`: `string`;
}
\| `null`;
`description`: `string`;
`due`: \| {
`date`: `string`;
`datetime?`: `string` \| `null`;
`isRecurring`: `boolean`;
`lang?`: `string` \| `null`;
`string`: `string`;
`timezone?`: `string` \| `null`;
}
\| `null`;
`duration`: \| {
`amount`: `number`;
`unit`: `"minute"` \| `"day"`;
}
\| `null`;
`id`: `string`;
`isCollapsed`: `boolean`;
`isDeleted`: `boolean`;
`isUncompletable`: `boolean`;
`labels`: `string`\[\];
`noteCount`: `number`;
`parentId`: `string` \| `null`;
`priority`: `number`;
`projectId`: `string`;
`responsibleUid`: `string` \| `null`;
`sectionId`: `string` \| `null`;
`updatedAt`: `string` \| `null`;
`url`: `string`;
`userId`: `string`;
}\[\]>

- A promise that resolves to an array of the updated tasks.

#### Deprecated [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#deprecated-1 "Direct link to Deprecated")

Use `moveTask` for single task operations. This method uses the Sync API and may be removed in a future version.

* * *

### quickAddTask() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#quickaddtask "Direct link to quickAddTask()")

```ts
quickAddTask(args: QuickAddTaskArgs): Promise<{
  addedAt: string | null;
  addedByUid: string | null;
  assignedByUid: string | null;
  checked: boolean;
  childOrder: number;
  completedAt: string | null;
  content: string;
  dayOrder: number;
  deadline:   | {
     date: string;
     lang: string;
   }
     | null;
  description: string;
  due:   | {
     date: string;
     datetime?: string | null;
     isRecurring: boolean;
     lang?: string | null;
     string: string;
     timezone?: string | null;
   }
     | null;
  duration:   | {
     amount: number;
     unit: "minute" | "day";
   }
     | null;
  id: string;
  isCollapsed: boolean;
  isDeleted: boolean;
  isUncompletable: boolean;
  labels: string[];
  noteCount: number;
  parentId: string | null;
  priority: number;
  projectId: string;
  responsibleUid: string | null;
  sectionId: string | null;
  updatedAt: string | null;
  url: string;
  userId: string;
}>;
```

Quickly adds a task using natural language processing for due dates.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-47 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `args` | [`QuickAddTaskArgs`](https://doist.github.io/todoist-api-typescript/api/type-aliases/QuickAddTaskArgs) | Quick add task parameters, including content and due date. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-49 "Direct link to Returns")

`Promise`<{
`addedAt`: `string` \| `null`;
`addedByUid`: `string` \| `null`;
`assignedByUid`: `string` \| `null`;
`checked`: `boolean`;
`childOrder`: `number`;
`completedAt`: `string` \| `null`;
`content`: `string`;
`dayOrder`: `number`;
`deadline`: \| {
`date`: `string`;
`lang`: `string`;
}
\| `null`;
`description`: `string`;
`due`: \| {
`date`: `string`;
`datetime?`: `string` \| `null`;
`isRecurring`: `boolean`;
`lang?`: `string` \| `null`;
`string`: `string`;
`timezone?`: `string` \| `null`;
}
\| `null`;
`duration`: \| {
`amount`: `number`;
`unit`: `"minute"` \| `"day"`;
}
\| `null`;
`id`: `string`;
`isCollapsed`: `boolean`;
`isDeleted`: `boolean`;
`isUncompletable`: `boolean`;
`labels`: `string`\[\];
`noteCount`: `number`;
`parentId`: `string` \| `null`;
`priority`: `number`;
`projectId`: `string`;
`responsibleUid`: `string` \| `null`;
`sectionId`: `string` \| `null`;
`updatedAt`: `string` \| `null`;
`url`: `string`;
`userId`: `string`;
}>

A promise that resolves to the created task.

* * *

### rejectWorkspaceInvitation() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#rejectworkspaceinvitation "Direct link to rejectWorkspaceInvitation()")

```ts
rejectWorkspaceInvitation(args: WorkspaceInvitationActionArgs, requestId?: string): Promise<{
  id: string;
  inviterId: string;
  isExistingUser: boolean;
  role: "ADMIN" | "MEMBER" | "GUEST";
  userEmail: string;
  workspaceId: string;
}>;
```

Rejects a workspace invitation.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-48 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `args` | [`WorkspaceInvitationActionArgs`](https://doist.github.io/todoist-api-typescript/api/type-aliases/WorkspaceInvitationActionArgs) | Arguments including invite code. |
| `requestId?` | `string` | Optional request ID for idempotency. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-50 "Direct link to Returns")

`Promise`<{
`id`: `string`;
`inviterId`: `string`;
`isExistingUser`: `boolean`;
`role`: `"ADMIN"` \| `"MEMBER"` \| `"GUEST"`;
`userEmail`: `string`;
`workspaceId`: `string`;
}>

The rejected invitation.

* * *

### removeSharedLabel() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#removesharedlabel "Direct link to removeSharedLabel()")

```ts
removeSharedLabel(args: RemoveSharedLabelArgs): Promise<boolean>;
```

Removes a shared label.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-49 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `args` | [`RemoveSharedLabelArgs`](https://doist.github.io/todoist-api-typescript/api/type-aliases/RemoveSharedLabelArgs) | Parameters for removing the shared label. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-51 "Direct link to Returns")

`Promise`<`boolean`>

A promise that resolves to `true` if successful.

* * *

### renameSharedLabel() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#renamesharedlabel "Direct link to renameSharedLabel()")

```ts
renameSharedLabel(args: RenameSharedLabelArgs): Promise<boolean>;
```

Renames an existing shared label.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-50 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `args` | [`RenameSharedLabelArgs`](https://doist.github.io/todoist-api-typescript/api/type-aliases/RenameSharedLabelArgs) | Parameters for renaming the shared label, including the current and new name. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-52 "Direct link to Returns")

`Promise`<`boolean`>

A promise that resolves to `true` if successful.

* * *

### reopenTask() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#reopentask "Direct link to reopenTask()")

```ts
reopenTask(id: string, requestId?: string): Promise<boolean>;
```

Reopens a previously closed (completed) task by its ID.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-51 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `id` | `string` | The unique identifier of the task to reopen. |
| `requestId?` | `string` | Optional custom identifier for the request. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-53 "Direct link to Returns")

`Promise`<`boolean`>

A promise that resolves to `true` if successful.

* * *

### searchCompletedTasks() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#searchcompletedtasks "Direct link to searchCompletedTasks()")

```ts
searchCompletedTasks(args: SearchCompletedTasksArgs): Promise<GetCompletedTasksResponse>;
```

Searches completed tasks by query string.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-52 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `args` | [`SearchCompletedTasksArgs`](https://doist.github.io/todoist-api-typescript/api/type-aliases/SearchCompletedTasksArgs) | Parameters for searching, including the query string. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-54 "Direct link to Returns")

`Promise`< [`GetCompletedTasksResponse`](https://doist.github.io/todoist-api-typescript/api/type-aliases/GetCompletedTasksResponse) >

A promise that resolves to a paginated response of completed tasks.

* * *

### searchLabels() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#searchlabels "Direct link to searchLabels()")

```ts
searchLabels(args: SearchArgs): Promise<GetLabelsResponse>;
```

Searches labels by name.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-53 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `args` | `SearchArgs` | Search parameters including the query string. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-55 "Direct link to Returns")

`Promise`< [`GetLabelsResponse`](https://doist.github.io/todoist-api-typescript/api/type-aliases/GetLabelsResponse) >

A promise that resolves to a paginated response of labels.

* * *

### searchProjects() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#searchprojects "Direct link to searchProjects()")

```ts
searchProjects(args: SearchArgs): Promise<GetProjectsResponse>;
```

Searches projects by name.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-54 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `args` | `SearchArgs` | Search parameters including the query string. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-56 "Direct link to Returns")

`Promise`< [`GetProjectsResponse`](https://doist.github.io/todoist-api-typescript/api/type-aliases/GetProjectsResponse) >

A promise that resolves to a paginated response of projects.

* * *

### searchSections() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#searchsections "Direct link to searchSections()")

```ts
searchSections(args: SearchSectionsArgs): Promise<GetSectionsResponse>;
```

Searches sections by name.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-55 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `args` | [`SearchSectionsArgs`](https://doist.github.io/todoist-api-typescript/api/type-aliases/SearchSectionsArgs) | Search parameters including the query string. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-57 "Direct link to Returns")

`Promise`< [`GetSectionsResponse`](https://doist.github.io/todoist-api-typescript/api/type-aliases/GetSectionsResponse) >

A promise that resolves to a paginated response of sections.

* * *

### sync() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#sync "Direct link to sync()")

```ts
sync(syncRequest: SyncRequest, requestId?: string): Promise<SyncResponse>;
```

Executes a raw Sync API request.

This method provides direct access to the Sync API, allowing you to send
strongly-typed commands and request specific resource types.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-56 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `syncRequest` | [`SyncRequest`](https://doist.github.io/todoist-api-typescript/api/type-aliases/SyncRequest) | - |
| `requestId?` | `string` | Optional custom identifier for the request. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-58 "Direct link to Returns")

`Promise`< [`SyncResponse`](https://doist.github.io/todoist-api-typescript/api/type-aliases/SyncResponse) >

A promise that resolves to the sync response.

#### Throws [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#throws "Direct link to Throws")

TodoistRequestError if the sync status contains errors.

#### Example [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#example-2 "Direct link to Example")

```typescript
import { createCommand } from '@doist/todoist-api-typescript'

const response = await api.sync({
    commands: [\
        createCommand('item_add', { content: 'Buy milk' }),\
    ],
    resourceTypes: ['items'],
    syncToken: '*',
})
```

* * *

### unarchiveProject() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#unarchiveproject "Direct link to unarchiveProject()")

```ts
unarchiveProject(id: string, requestId?: string): Promise<
  | {
  canAssignTasks: boolean;
  childOrder: number;
  color: string;
  createdAt: string | null;
  defaultOrder: number;
  description: string;
  id: string;
  inboxProject: boolean;
  isArchived: boolean;
  isCollapsed: boolean;
  isDeleted: boolean;
  isFavorite: boolean;
  isFrozen: boolean;
  isShared: boolean;
  name: string;
  parentId: string | null;
  updatedAt: string | null;
  url: string;
  viewStyle: string;
}
  | {
  access?: {
     visibility: "restricted" | "team" | "public";
  };
  canAssignTasks: boolean;
  childOrder: number;
  collaboratorRoleDefault: string;
  color: string;
  createdAt: string | null;
  defaultOrder: number;
  description: string;
  folderId: string | null;
  id: string;
  isArchived: boolean;
  isCollapsed: boolean;
  isDeleted: boolean;
  isFavorite: boolean;
  isFrozen: boolean;
  isInviteOnly: boolean | null;
  isLinkSharingEnabled: boolean;
  isShared: boolean;
  name: string;
  role: string | null;
  status: string;
  updatedAt: string | null;
  url: string;
  viewStyle: string;
  workspaceId: string;
}>;
```

Unarchives a project by its ID.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-57 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `id` | `string` | The unique identifier of the project to unarchive. |
| `requestId?` | `string` | Optional custom identifier for the request. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-59 "Direct link to Returns")

`Promise`<
\| {
`canAssignTasks`: `boolean`;
`childOrder`: `number`;
`color`: `string`;
`createdAt`: `string` \| `null`;
`defaultOrder`: `number`;
`description`: `string`;
`id`: `string`;
`inboxProject`: `boolean`;
`isArchived`: `boolean`;
`isCollapsed`: `boolean`;
`isDeleted`: `boolean`;
`isFavorite`: `boolean`;
`isFrozen`: `boolean`;
`isShared`: `boolean`;
`name`: `string`;
`parentId`: `string` \| `null`;
`updatedAt`: `string` \| `null`;
`url`: `string`;
`viewStyle`: `string`;
}
\| {
`access?`: {
`visibility`: `"restricted"` \| `"team"` \| `"public"`;
};
`canAssignTasks`: `boolean`;
`childOrder`: `number`;
`collaboratorRoleDefault`: `string`;
`color`: `string`;
`createdAt`: `string` \| `null`;
`defaultOrder`: `number`;
`description`: `string`;
`folderId`: `string` \| `null`;
`id`: `string`;
`isArchived`: `boolean`;
`isCollapsed`: `boolean`;
`isDeleted`: `boolean`;
`isFavorite`: `boolean`;
`isFrozen`: `boolean`;
`isInviteOnly`: `boolean` \| `null`;
`isLinkSharingEnabled`: `boolean`;
`isShared`: `boolean`;
`name`: `string`;
`role`: `string` \| `null`;
`status`: `string`;
`updatedAt`: `string` \| `null`;
`url`: `string`;
`viewStyle`: `string`;
`workspaceId`: `string`;
}>

A promise that resolves to the updated project.

* * *

### updateComment() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#updatecomment "Direct link to updateComment()")

```ts
updateComment(
   id: string,
   args: UpdateCommentArgs,
   requestId?: string): Promise<{
  content: string;
  fileAttachment:   | {
     fileDuration?: number | null;
     fileName?: string | null;
     fileSize?: number | null;
     fileType?: string | null;
     fileUrl?: string | null;
     image?: string | null;
     imageHeight?: number | null;
     imageWidth?: number | null;
     resourceType: string;
     title?: string | null;
     uploadState?: "pending" | "completed" | null;
     url?: string | null;
   }
     | null;
  id: string;
  isDeleted: boolean;
  postedAt: string;
  postedUid: string;
  projectId?: string;
  reactions: Record<string, string[]> | null;
  taskId: string | undefined;
  uidsToNotify: string[] | null;
}>;
```

Updates an existing comment by its ID.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-58 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `id` | `string` | The unique identifier of the comment to update. |
| `args` | [`UpdateCommentArgs`](https://doist.github.io/todoist-api-typescript/api/type-aliases/UpdateCommentArgs) | Update parameters such as new content. |
| `requestId?` | `string` | Optional custom identifier for the request. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-60 "Direct link to Returns")

`Promise`<{
`content`: `string`;
`fileAttachment`: \| {
`fileDuration?`: `number` \| `null`;
`fileName?`: `string` \| `null`;
`fileSize?`: `number` \| `null`;
`fileType?`: `string` \| `null`;
`fileUrl?`: `string` \| `null`;
`image?`: `string` \| `null`;
`imageHeight?`: `number` \| `null`;
`imageWidth?`: `number` \| `null`;
`resourceType`: `string`;
`title?`: `string` \| `null`;
`uploadState?`: `"pending"` \| `"completed"` \| `null`;
`url?`: `string` \| `null`;
}
\| `null`;
`id`: `string`;
`isDeleted`: `boolean`;
`postedAt`: `string`;
`postedUid`: `string`;
`projectId?`: `string`;
`reactions`: `Record`<`string`, `string`\[\]\> \| `null`;
`taskId`: `string` \| `undefined`;
`uidsToNotify`: `string`\[\] \| `null`;
}>

A promise that resolves to the updated comment.

* * *

### updateLabel() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#updatelabel "Direct link to updateLabel()")

```ts
updateLabel(
   id: string,
   args: UpdateLabelArgs,
   requestId?: string): Promise<{
  color: string;
  id: string;
  isFavorite: boolean;
  name: string;
  order: number | null;
}>;
```

Updates an existing label by its ID.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-59 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `id` | `string` | The unique identifier of the label to update. |
| `args` | [`UpdateLabelArgs`](https://doist.github.io/todoist-api-typescript/api/type-aliases/UpdateLabelArgs) | Update parameters such as name or color. |
| `requestId?` | `string` | Optional custom identifier for the request. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-61 "Direct link to Returns")

`Promise`<{
`color`: `string`;
`id`: `string`;
`isFavorite`: `boolean`;
`name`: `string`;
`order`: `number` \| `null`;
}>

A promise that resolves to the updated label.

* * *

### updateProject() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#updateproject "Direct link to updateProject()")

```ts
updateProject(
   id: string,
   args: UpdateProjectArgs,
   requestId?: string): Promise<
  | {
  canAssignTasks: boolean;
  childOrder: number;
  color: string;
  createdAt: string | null;
  defaultOrder: number;
  description: string;
  id: string;
  inboxProject: boolean;
  isArchived: boolean;
  isCollapsed: boolean;
  isDeleted: boolean;
  isFavorite: boolean;
  isFrozen: boolean;
  isShared: boolean;
  name: string;
  parentId: string | null;
  updatedAt: string | null;
  url: string;
  viewStyle: string;
}
  | {
  access?: {
     visibility: "restricted" | "team" | "public";
  };
  canAssignTasks: boolean;
  childOrder: number;
  collaboratorRoleDefault: string;
  color: string;
  createdAt: string | null;
  defaultOrder: number;
  description: string;
  folderId: string | null;
  id: string;
  isArchived: boolean;
  isCollapsed: boolean;
  isDeleted: boolean;
  isFavorite: boolean;
  isFrozen: boolean;
  isInviteOnly: boolean | null;
  isLinkSharingEnabled: boolean;
  isShared: boolean;
  name: string;
  role: string | null;
  status: string;
  updatedAt: string | null;
  url: string;
  viewStyle: string;
  workspaceId: string;
}>;
```

Updates an existing project by its ID with the provided parameters.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-60 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `id` | `string` | The unique identifier of the project to update. |
| `args` | [`UpdateProjectArgs`](https://doist.github.io/todoist-api-typescript/api/type-aliases/UpdateProjectArgs) | Update parameters such as name or color. |
| `requestId?` | `string` | Optional custom identifier for the request. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-62 "Direct link to Returns")

`Promise`<
\| {
`canAssignTasks`: `boolean`;
`childOrder`: `number`;
`color`: `string`;
`createdAt`: `string` \| `null`;
`defaultOrder`: `number`;
`description`: `string`;
`id`: `string`;
`inboxProject`: `boolean`;
`isArchived`: `boolean`;
`isCollapsed`: `boolean`;
`isDeleted`: `boolean`;
`isFavorite`: `boolean`;
`isFrozen`: `boolean`;
`isShared`: `boolean`;
`name`: `string`;
`parentId`: `string` \| `null`;
`updatedAt`: `string` \| `null`;
`url`: `string`;
`viewStyle`: `string`;
}
\| {
`access?`: {
`visibility`: `"restricted"` \| `"team"` \| `"public"`;
};
`canAssignTasks`: `boolean`;
`childOrder`: `number`;
`collaboratorRoleDefault`: `string`;
`color`: `string`;
`createdAt`: `string` \| `null`;
`defaultOrder`: `number`;
`description`: `string`;
`folderId`: `string` \| `null`;
`id`: `string`;
`isArchived`: `boolean`;
`isCollapsed`: `boolean`;
`isDeleted`: `boolean`;
`isFavorite`: `boolean`;
`isFrozen`: `boolean`;
`isInviteOnly`: `boolean` \| `null`;
`isLinkSharingEnabled`: `boolean`;
`isShared`: `boolean`;
`name`: `string`;
`role`: `string` \| `null`;
`status`: `string`;
`updatedAt`: `string` \| `null`;
`url`: `string`;
`viewStyle`: `string`;
`workspaceId`: `string`;
}>

A promise that resolves to the updated project.

* * *

### updateSection() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#updatesection "Direct link to updateSection()")

```ts
updateSection(
   id: string,
   args: UpdateSectionArgs,
   requestId?: string): Promise<{
  addedAt: string;
  archivedAt: string | null;
  id: string;
  isArchived: boolean;
  isCollapsed: boolean;
  isDeleted: boolean;
  name: string;
  projectId: string;
  sectionOrder: number;
  updatedAt: string;
  url: string;
  userId: string;
}>;
```

Updates a section by its ID with the provided parameters.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-61 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `id` | `string` | The unique identifier of the section to update. |
| `args` | [`UpdateSectionArgs`](https://doist.github.io/todoist-api-typescript/api/type-aliases/UpdateSectionArgs) | Update parameters such as name or project ID. |
| `requestId?` | `string` | Optional custom identifier for the request. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-63 "Direct link to Returns")

`Promise`<{
`addedAt`: `string`;
`archivedAt`: `string` \| `null`;
`id`: `string`;
`isArchived`: `boolean`;
`isCollapsed`: `boolean`;
`isDeleted`: `boolean`;
`name`: `string`;
`projectId`: `string`;
`sectionOrder`: `number`;
`updatedAt`: `string`;
`url`: `string`;
`userId`: `string`;
}>

A promise that resolves to the updated section.

* * *

### updateTask() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#updatetask "Direct link to updateTask()")

```ts
updateTask(
   id: string,
   args: UpdateTaskArgs,
   requestId?: string): Promise<{
  addedAt: string | null;
  addedByUid: string | null;
  assignedByUid: string | null;
  checked: boolean;
  childOrder: number;
  completedAt: string | null;
  content: string;
  dayOrder: number;
  deadline:   | {
     date: string;
     lang: string;
   }
     | null;
  description: string;
  due:   | {
     date: string;
     datetime?: string | null;
     isRecurring: boolean;
     lang?: string | null;
     string: string;
     timezone?: string | null;
   }
     | null;
  duration:   | {
     amount: number;
     unit: "minute" | "day";
   }
     | null;
  id: string;
  isCollapsed: boolean;
  isDeleted: boolean;
  isUncompletable: boolean;
  labels: string[];
  noteCount: number;
  parentId: string | null;
  priority: number;
  projectId: string;
  responsibleUid: string | null;
  sectionId: string | null;
  updatedAt: string | null;
  url: string;
  userId: string;
}>;
```

Updates an existing task by its ID with the provided parameters.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-62 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `id` | `string` | The unique identifier of the task to update. |
| `args` | [`UpdateTaskArgs`](https://doist.github.io/todoist-api-typescript/api/type-aliases/UpdateTaskArgs) | Update parameters such as content, priority, or due date. |
| `requestId?` | `string` | Optional custom identifier for the request. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-64 "Direct link to Returns")

`Promise`<{
`addedAt`: `string` \| `null`;
`addedByUid`: `string` \| `null`;
`assignedByUid`: `string` \| `null`;
`checked`: `boolean`;
`childOrder`: `number`;
`completedAt`: `string` \| `null`;
`content`: `string`;
`dayOrder`: `number`;
`deadline`: \| {
`date`: `string`;
`lang`: `string`;
}
\| `null`;
`description`: `string`;
`due`: \| {
`date`: `string`;
`datetime?`: `string` \| `null`;
`isRecurring`: `boolean`;
`lang?`: `string` \| `null`;
`string`: `string`;
`timezone?`: `string` \| `null`;
}
\| `null`;
`duration`: \| {
`amount`: `number`;
`unit`: `"minute"` \| `"day"`;
}
\| `null`;
`id`: `string`;
`isCollapsed`: `boolean`;
`isDeleted`: `boolean`;
`isUncompletable`: `boolean`;
`labels`: `string`\[\];
`noteCount`: `number`;
`parentId`: `string` \| `null`;
`priority`: `number`;
`projectId`: `string`;
`responsibleUid`: `string` \| `null`;
`sectionId`: `string` \| `null`;
`updatedAt`: `string` \| `null`;
`url`: `string`;
`userId`: `string`;
}>

A promise that resolves to the updated task.

* * *

### uploadFile() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#uploadfile "Direct link to uploadFile()")

```ts
uploadFile(args: UploadFileArgs, requestId?: string): Promise<{
  fileDuration?: number | null;
  fileName?: string | null;
  fileSize?: number | null;
  fileType?: string | null;
  fileUrl?: string | null;
  image?: string | null;
  imageHeight?: number | null;
  imageWidth?: number | null;
  resourceType: string;
  title?: string | null;
  uploadState?: "pending" | "completed" | null;
  url?: string | null;
}>;
```

Uploads a file and returns attachment metadata.
This creates an upload record that can be referenced in tasks or comments.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-63 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `args` | [`UploadFileArgs`](https://doist.github.io/todoist-api-typescript/api/type-aliases/UploadFileArgs) | Upload parameters including file content, filename, and optional project ID. |
| `requestId?` | `string` | Optional custom identifier for the request. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-65 "Direct link to Returns")

`Promise`<{
`fileDuration?`: `number` \| `null`;
`fileName?`: `string` \| `null`;
`fileSize?`: `number` \| `null`;
`fileType?`: `string` \| `null`;
`fileUrl?`: `string` \| `null`;
`image?`: `string` \| `null`;
`imageHeight?`: `number` \| `null`;
`imageWidth?`: `number` \| `null`;
`resourceType`: `string`;
`title?`: `string` \| `null`;
`uploadState?`: `"pending"` \| `"completed"` \| `null`;
`url?`: `string` \| `null`;
}>

A promise that resolves to the uploaded file's attachment metadata.

#### Example [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#example-3 "Direct link to Example")

```typescript
// Upload from a file path
const upload = await api.uploadFile({
  file: '/path/to/document.pdf',
  projectId: '12345'
})

// Upload from a Buffer
const buffer = fs.readFileSync('/path/to/document.pdf')
const upload = await api.uploadFile({
  file: buffer,
  fileName: 'document.pdf',  // Required for Buffer/Stream
  projectId: '12345'
})

// Use the returned fileUrl in a comment
await api.addComment({
  content: 'See attached document',
  taskId: '67890',
  attachment: {
    fileUrl: upload.fileUrl,
    fileName: upload.fileName,
    fileType: upload.fileType,
    resourceType: upload.resourceType
  }
})
```

* * *

### uploadWorkspaceLogo() [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#uploadworkspacelogo "Direct link to uploadWorkspaceLogo()")

```ts
uploadWorkspaceLogo(args: WorkspaceLogoArgs, requestId?: string): Promise<WorkspaceLogoResponse>;
```

Uploads or updates a workspace logo.

#### Parameters [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#parameters-64 "Direct link to Parameters")

| Parameter | Type | Description |
| --- | --- | --- |
| `args` | [`WorkspaceLogoArgs`](https://doist.github.io/todoist-api-typescript/api/type-aliases/WorkspaceLogoArgs) | Arguments including workspace ID, file, and options. |
| `requestId?` | `string` | Optional request ID for idempotency. |

#### Returns [​](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/\#returns-66 "Direct link to Returns")

`Promise`< [`WorkspaceLogoResponse`](https://doist.github.io/todoist-api-typescript/api/type-aliases/WorkspaceLogoResponse) >

Logo information or null if deleted.

[Previous\\
\\
Authorization](https://doist.github.io/todoist-api-typescript/authorization) [Next\\
\\
TodoistRequestError](https://doist.github.io/todoist-api-typescript/api/classes/TodoistRequestError)

- [Constructors](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#constructors)
  - [Constructor](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#constructor)
  - [Constructor](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#constructor-1)
  - [Constructor](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#constructor-2)
- [Methods](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#methods)
  - [acceptWorkspaceInvitation()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#acceptworkspaceinvitation)
  - [addComment()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#addcomment)
  - [addLabel()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#addlabel)
  - [addProject()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#addproject)
  - [addSection()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#addsection)
  - [addTask()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#addtask)
  - [archiveProject()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#archiveproject)
  - [closeTask()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#closetask)
  - [deleteComment()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#deletecomment)
  - [deleteLabel()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#deletelabel)
  - [deleteProject()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#deleteproject)
  - [deleteSection()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#deletesection)
  - [deleteTask()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#deletetask)
  - [deleteUpload()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#deleteupload)
  - [deleteWorkspaceInvitation()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#deleteworkspaceinvitation)
  - [getActivityLogs()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#getactivitylogs)
  - [getAllWorkspaceInvitations()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#getallworkspaceinvitations)
  - [getArchivedProjects()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#getarchivedprojects)
  - [getComment()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#getcomment)
  - [getComments()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#getcomments)
  - [getCompletedTasksByCompletionDate()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#getcompletedtasksbycompletiondate)
  - [getCompletedTasksByDueDate()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#getcompletedtasksbyduedate)
  - [getLabel()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#getlabel)
  - [getLabels()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#getlabels)
  - [getProductivityStats()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#getproductivitystats)
  - [getProject()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#getproject)
  - [getProjectCollaborators()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#getprojectcollaborators)
  - [getProjects()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#getprojects)
  - [getSection()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#getsection)
  - [getSections()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#getsections)
  - [getSharedLabels()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#getsharedlabels)
  - [getTask()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#gettask)
  - [getTasks()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#gettasks)
  - [getTasksByFilter()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#gettasksbyfilter)
  - [getUser()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#getuser)
  - [getWorkspaceActiveProjects()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#getworkspaceactiveprojects)
  - [getWorkspaceArchivedProjects()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#getworkspacearchivedprojects)
  - [getWorkspaceInvitations()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#getworkspaceinvitations)
  - [getWorkspacePlanDetails()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#getworkspaceplandetails)
  - [getWorkspaces()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#getworkspaces)
  - [getWorkspaceUsers()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#getworkspaceusers)
  - [joinWorkspace()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#joinworkspace)
  - [moveProjectToPersonal()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#moveprojecttopersonal)
  - [moveProjectToWorkspace()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#moveprojecttoworkspace)
  - [moveTask()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#movetask)
  - [~~moveTasks()~~](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#movetasks)
  - [quickAddTask()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#quickaddtask)
  - [rejectWorkspaceInvitation()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#rejectworkspaceinvitation)
  - [removeSharedLabel()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#removesharedlabel)
  - [renameSharedLabel()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#renamesharedlabel)
  - [reopenTask()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#reopentask)
  - [searchCompletedTasks()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#searchcompletedtasks)
  - [searchLabels()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#searchlabels)
  - [searchProjects()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#searchprojects)
  - [searchSections()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#searchsections)
  - [sync()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#sync)
  - [unarchiveProject()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#unarchiveproject)
  - [updateComment()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#updatecomment)
  - [updateLabel()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#updatelabel)
  - [updateProject()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#updateproject)
  - [updateSection()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#updatesection)
  - [updateTask()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#updatetask)
  - [uploadFile()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#uploadfile)
  - [uploadWorkspaceLogo()](https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi/#uploadworkspacelogo)

Docs

- [About](https://doist.github.io/todoist-api-typescript/)
- [Authorization](https://doist.github.io/todoist-api-typescript/authorization)

More

- [Engineering at Doist](https://doist.dev/)
- [GitHub](https://github.com/Doist/todoist-api-typescript)

Title: TodoistApi | Todoist API TypeScript Client
Description: Constructors...
