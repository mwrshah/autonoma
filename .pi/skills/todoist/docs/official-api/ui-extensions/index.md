Scraping: https://developer.todoist.com/ui-extensions
[![](https://developer.todoist.com/images/td_logo-4f2a90df.svg)](https://developer.todoist.com/)

- [Guides](https://developer.todoist.com/guides/)
- [REST API](https://developer.todoist.com/rest/v2)
- [Sync API](https://developer.todoist.com/sync/v9)
- [UI Extensions](https://developer.todoist.com/ui-extensions)
- [Manage App](https://app.todoist.com/app/settings/integrations/app-management)
- [Submit App](https://developer.todoist.com/submissions.html)

[NAV\\
 ![](https://developer.todoist.com/images/navbar-6c2f9478.png)](https://developer.todoist.com/ui-extensions#)

- [Guides](https://developer.todoist.com/guides/)
- [REST API](https://developer.todoist.com/rest/)
- [Sync API](https://developer.todoist.com/sync/)
- [UI Extensions](https://developer.todoist.com/ui-extensions)
- [Manage App](https://app.todoist.com/app/settings/integrations/app-management)
- [Submit App](https://developer.todoist.com/submissions.html)

- [Introduction](https://developer.todoist.com/ui-extensions#introduction)  - [What are UI Extensions?](https://developer.todoist.com/ui-extensions#what-are-ui-extensions)
  - [How do they work?](https://developer.todoist.com/ui-extensions#how-do-they-work)    - [Cards](https://developer.todoist.com/ui-extensions#cards)
    - [Bridges](https://developer.todoist.com/ui-extensions#bridges)
  - [What kinds of UI Extensions are there?](https://developer.todoist.com/ui-extensions#what-kinds-of-ui-extensions-are-there)    - [Context Menu Extensions](https://developer.todoist.com/ui-extensions#context-menu-extensions)
    - [Composer Extensions](https://developer.todoist.com/ui-extensions#composer-extensions)
    - [Settings Extensions](https://developer.todoist.com/ui-extensions#settings-extensions)
  - [Extension lifecycle example](https://developer.todoist.com/ui-extensions#extension-lifecycle-example)
- [🚀 Getting started](https://developer.todoist.com/ui-extensions#getting-started)  - [Setup your local project](https://developer.todoist.com/ui-extensions#setup-your-local-project)
  - [Create your own integrations service](https://developer.todoist.com/ui-extensions#create-your-own-integrations-service)
  - [Run your integration service](https://developer.todoist.com/ui-extensions#run-your-integration-service)
  - [Expose your localhost](https://developer.todoist.com/ui-extensions#expose-your-localhost)
  - [Create a Todoist App](https://developer.todoist.com/ui-extensions#create-a-todoist-app)
  - [Use your UI Extension](https://developer.todoist.com/ui-extensions#use-your-ui-extension)
  - [Iterate](https://developer.todoist.com/ui-extensions#iterate)
  - [Code Examples](https://developer.todoist.com/ui-extensions#code-examples)
  - [Next steps](https://developer.todoist.com/ui-extensions#next-steps)
- [Handling User Requests](https://developer.todoist.com/ui-extensions#handling-user-requests)  - [Client and User Information](https://developer.todoist.com/ui-extensions#client-and-user-information)    - [Extension Type](https://developer.todoist.com/ui-extensions#extension-type)
    - [Context](https://developer.todoist.com/ui-extensions#context)
    - [Action](https://developer.todoist.com/ui-extensions#action)
    - [Maximum Doist Card Version](https://developer.todoist.com/ui-extensions#maximum-doist-card-version)
  - [Security](https://developer.todoist.com/ui-extensions#security)
  - [Full Client Request Example](https://developer.todoist.com/ui-extensions#full-client-request-example)    - [Context Menu Extension](https://developer.todoist.com/ui-extensions#context-menu-extension)
    - [Composer Extension](https://developer.todoist.com/ui-extensions#composer-extension)
    - [Settings Extension](https://developer.todoist.com/ui-extensions#settings-extension)
- [Returning UIs and Action Bridges](https://developer.todoist.com/ui-extensions#returning-uis-and-action-bridges)  - [UI](https://developer.todoist.com/ui-extensions#ui)
  - [Client-side Actions](https://developer.todoist.com/ui-extensions#client-side-actions)    - [Display Notification](https://developer.todoist.com/ui-extensions#display-notification)
    - [Append to Composer](https://developer.todoist.com/ui-extensions#append-to-composer)
    - [Request Todoist Sync](https://developer.todoist.com/ui-extensions#request-todoist-sync)
    - [Extension has finished](https://developer.todoist.com/ui-extensions#extension-has-finished)
  - [Full Server Response Example](https://developer.todoist.com/ui-extensions#full-server-response-example)
- [Adding a UI Extension](https://developer.todoist.com/ui-extensions#adding-a-ui-extension)  - [Context Menu and Composer Extensions Menu](https://developer.todoist.com/ui-extensions#context-menu-and-composer-extensions-menu)
  - [Settings Extensions](https://developer.todoist.com/ui-extensions#settings-extensions)
- [Short-lived Tokens](https://developer.todoist.com/ui-extensions#short-lived-tokens)  - [Enabling Short-lived Tokens](https://developer.todoist.com/ui-extensions#enabling-short-lived-tokens)
- [Doist Cards](https://developer.todoist.com/ui-extensions#doist-cards)  - [Doist Cards Versions](https://developer.todoist.com/ui-extensions#doist-cards-versions)
  - [How to Use](https://developer.todoist.com/ui-extensions#how-to-use)
  - [Card](https://developer.todoist.com/ui-extensions#card)
  - [Element](https://developer.todoist.com/ui-extensions#element)
  - [Card Elements](https://developer.todoist.com/ui-extensions#card-elements)    - [TextBlock](https://developer.todoist.com/ui-extensions#textblock)
    - [Image](https://developer.todoist.com/ui-extensions#image)
    - [RichTextBlock](https://developer.todoist.com/ui-extensions#richtextblock)
    - [Inline](https://developer.todoist.com/ui-extensions#inline)
    - [TextRun](https://developer.todoist.com/ui-extensions#textrun)
  - [Containers](https://developer.todoist.com/ui-extensions#containers)    - [ActionSet](https://developer.todoist.com/ui-extensions#actionset)
    - [Container](https://developer.todoist.com/ui-extensions#container)
    - [ColumnSet](https://developer.todoist.com/ui-extensions#columnset)
    - [Column](https://developer.todoist.com/ui-extensions#column)
  - [Actions](https://developer.todoist.com/ui-extensions#actions)    - [Action.Submit](https://developer.todoist.com/ui-extensions#action-submit)
    - [Action.OpenUrl](https://developer.todoist.com/ui-extensions#action-openurl)
    - [Action.Clipboard](https://developer.todoist.com/ui-extensions#action-clipboard)
  - [Inputs](https://developer.todoist.com/ui-extensions#inputs)    - [Input.Text](https://developer.todoist.com/ui-extensions#input-text)
    - [Input.Date](https://developer.todoist.com/ui-extensions#input-date)
    - [Input.Time](https://developer.todoist.com/ui-extensions#input-time)
    - [Input.ChoiceSet](https://developer.todoist.com/ui-extensions#input-choiceset)
    - [Input.Toggle](https://developer.todoist.com/ui-extensions#input-toggle)
  - [Types](https://developer.todoist.com/ui-extensions#types)    - [BackgroundImage](https://developer.todoist.com/ui-extensions#backgroundimage)
  - [Enums](https://developer.todoist.com/ui-extensions#enums)    - [Spacing](https://developer.todoist.com/ui-extensions#spacing)
    - [HorizontalAlignment](https://developer.todoist.com/ui-extensions#horizontalalignment)
    - [VerticalContentAlignment](https://developer.todoist.com/ui-extensions#verticalcontentalignment)
    - [FontWeight](https://developer.todoist.com/ui-extensions#fontweight)
    - [FontSize](https://developer.todoist.com/ui-extensions#fontsize)
    - [Color](https://developer.todoist.com/ui-extensions#color)
    - [ImageFillMode](https://developer.todoist.com/ui-extensions#imagefillmode)
    - [ActionStyle](https://developer.todoist.com/ui-extensions#actionstyle)
    - [InputStyle](https://developer.todoist.com/ui-extensions#inputstyle)
    - [ImageSize](https://developer.todoist.com/ui-extensions#imagesize)
    - [ChoiceInputStyle](https://developer.todoist.com/ui-extensions#choiceinputstyle)
    - [Orientation](https://developer.todoist.com/ui-extensions#orientation)
    - [AssociatedInput](https://developer.todoist.com/ui-extensions#associatedinput)

Please note: This documentation is preliminary and subject to change.

# Introduction

**💡 Tip! If you want to jump right into writing some code as soon as possible, skip ahead to our [Getting Started](https://developer.todoist.com/ui-extensions#getting-started) guide.**

## What are UI Extensions?

UI Extensions are modules that can be added to an integration to extend the Todoist UI with additional functionality.

UI Extensions are currently only supported on Todoist web and Todoist desktop apps. They are not yet available on mobile apps, altough support will be added soon.

## How do they work?

UI Extensions work via a turn-based model. When a UI Extension is invoked:

1. A modal is opened in the Todoist client
2. The Todoist client sends an initial request to the integration service
3. The integration service receives the request, performs some operations (like querying some APIs or performing some calculations), and responds with a UI and/or requests for the client to execute a/some specific action(s)
4. The client renders the UI and executes the requested actions
5. The user interacts with the UI and the Todoist clients sends another request (with some instructions) to the integration service
6. As in Step 3, the integration service processes the request and the cycle continues until the user closes the modal or the integration service responds with a request to close the integration modal

More specifically, a _request_ from the client includes:

- An `action` (optionally with some parameters)
- The `context` (details about the client and the task or project it's invoked on)

A _response_ from the integration service includes a **card**, instructions to render a certain UI, and/or **bridges**, requests for the client to perform some action, like firing a notification or adding some text to a composer.

![Simple Extension Flow](https://developer.todoist.com/images/ui_extensions/simple_extension_flow-44f7cf54.png)

### Cards

> Doist card example

```
{
  "card": {
    "type": "AdaptiveCard",
    "body": [{\
        "text": "Welcome, my friend!",\
        "type": "TextBlock"\
    }],
    {...}
  }
}
```

UI Extensions return UIs in the form of [Doist Cards](https://developer.todoist.com/ui-extensions#doist-cards), which are returned in the response from the extension and which the Todoist client will render for the user. Doist Cards are based on [Adaptive Cards](https://adaptivecards.io/).

### Bridges

> Bridge example

```
{
  "bridges": [\
    {\
      "bridgeActionType": "display.notification",\
      "notification": {\
        "text": "Hello, user!",\
        "type": "success"\
      }\
    }\
  ]
}
```

UI Extensions can also return [Bridges](https://developer.todoist.com/ui-extensions#returning-uis-and-action-bridges). These are requests for client-side actions and they instruct the client to do specific actions on the extension' behalf, such as injecting text into the composer or displaying a notification.

## What kinds of UI Extensions are there?

We currently support three types of UI Extensions:

- [Context Menu Extensions](https://developer.todoist.com/ui-extensions#context-menu-extensions)
- [Composer Extensions](https://developer.todoist.com/ui-extensions#composer-extensions)
- [Settings Extensions](https://developer.todoist.com/ui-extensions#settings-extensions)

![UI Extensions Types](https://developer.todoist.com/images/ui_extensions/ui_extensions_types-4c0c3258.png)

### Context Menu Extensions

Installed context menu extensions are shown in the project or task context menu. When triggered, they query your integration's server for UI to render or action(s) to perform.

![Context Menu Extension](https://developer.todoist.com/images/ui_extensions/context_menu_extension-4c20b1db.gif)

[Templates](https://app.todoist.com/app/settings/integrations/browse/templates), [Google Sheets](https://app.todoist.com/app/settings/integrations/browse/export-google-sheets) and [Conversation Starters](https://app.todoist.com/app/settings/integrations/browse/conversation-starters) are all examples of integrations with Context Menu extensions.

For example, the [Templates](https://app.todoist.com/app/settings/integrations/browse/templates) integration has 2 project context menu extensions. When a user selects one of these extensions from a project's context menu, a UI is rendered that displays templates that the user can import into their project. When a user interacts with the UI, the integration reacts by creating tasks in the project.

![Templates Context Menu Extension](https://developer.todoist.com/images/ui_extensions/templates_context_menu_extension-9d22c4e7.gif)

### Composer Extensions

Installed composer extensions are shown in the composer extensions menu, which the user can access while adding tasks, sub-tasks or comments. Like context menu extensions, they query your integration's server for UI to render or action(s) to perform. Composer extensions have the ability to append text to a task name, description, or comments.

![Composer Extension](https://developer.todoist.com/images/ui_extensions/composer_extension-14f5aca0.gif)

### Settings Extensions

Settings extensions appear in the Integration Settings within Todoist. Like context menu extensions, they can render UI and communicate with your integration's server. An integration can have only one settings extension.

For example, the [Habit Tracker](https://app.todoist.com/app/settings/integrations/browse/habit-tracker) integration has a Settings extension. When the settings for the Habit Tracker integration are opened, the Settings extension renders a UI with integration-specific settings that the user can change.

![Settings Extension](https://developer.todoist.com/images/ui_extensions/settings_extension-f51b6f3c.gif)

## Extension lifecycle example

Below, you can see the "Import from Template" extension flow (part of [Templates](https://app.todoist.com/app/settings/integrations/browse/templates)), from beginning to end.

When a user selects the extensions from a project's context menu, the following flow gets triggered:

1. The Todoist client sends an initial request to the integration service
2. The integrations service responds with a UI (in the form of a `card`)
3. The client renders the UI (displays templates that the user can import into their project)
4. When the user interacts with the UI by searching for templates, the client sends a new request to the integration service
5. The integration service processes the request and the cycle continues until the user settles on a template to import or exits the extension

   - If the user issues the request to add a template to their current project, the integration reacts by creating tasks in the project and returning 2 `bridges` to the client:


     - `finished` meaning that the extension should be closed
     - `display.notification` meaning that a toast message should be displayed to the user
6. Finally, the client renders the notification, closes the modal and the interaction is finished

If you'd like to see the complete payloads, you can install and use the Templates extension in Todoist and inspect the traffic occurring when interacting with the extension.

[![UI Extensions overview](https://developer.todoist.com/images/ui_extensions/extension_flow-35b97428.svg)](https://developer.todoist.com/images/ui_extensions/extension_flow-35b97428.svg)

# 🚀 Getting started

**This quick-start guide will show you how to get a simple Todoist UI Extension running in no time.**

We will build a simple context menu Extension that displays a button which, upon clicking, displays a notification for the user. Let’s get started!

## Setup your local project

You can write UI Extensions in any language and framework you like, but for this demo, we will be writing a **TypeScript** app (powered by [express](https://expressjs.com/)) and using our UI Extensions SDK. If you don't have `Node.js` and `npm` installed yet, please follow the [installation guide](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/) first.

```
npm init -y
npm install express nodemon ts-node typescript @doist/ui-extensions-core
npm install @types/express @types/node --save-dev
```

Let's start by installing some packages (see here, on the right):

## Create your own integrations service

> app.ts

```
import { DoistCard, SubmitAction, TextBlock } from '@doist/ui-extensions-core'
import express, { Request, Response, NextFunction } from 'express'

const port = 3000
const app = express()

const processRequest = async function (
    request: Request, response: Response, next: NextFunction
) {
    // Prepare the Adaptive Card with the response
    // (it's going to be a form with some text and a button)
    const card = new DoistCard()
    card.addItem(TextBlock.from({
        text: 'Hello, my friend!',
    }))
    card.addAction(
        SubmitAction.from({
            id: 'Action.Submit',
            title: 'Click me!',
            style: 'positive',
        }),
    )

    // Send the Adaptive Card to the renderer
    response.status(200).json({card: card})
}

app.post('/process', processRequest)

app.listen(port, () => {
    console.log(`UI Extension server running on port ${port}.`)
});
```

Now, onto our favorite IDE and let's create an `app.ts` file that will act as our controller, answering all incoming requests and replying to them.

Note that our controller listens on port `3000` and replies to requests to the `/process` endpoint, but you can change these if you want.

Our newly created controller returns a [Doist Card](https://developer.todoist.com/ui-extensions#doist-cards) with some text (`'Hello, my friend!'`) and a button with some text (`'Click me!'`) that triggers another action (`Action.Submit`).

## Run your integration service

```
"scripts": {
    "dev": "nodemon app.ts"
},
```

Add a simple script to your `package.json`:

```
npm run dev
```

Now you're ready to run a single command in your terminal:

## Expose your localhost

Now, in order for Todoist to be able to communicate with your integration, we need to expose your service to the internet. There are a couple of tools available to create this kind of tunnel:

- [`ngrok`](https://ngrok.com/)
- [`localtunnel`](https://www.npmjs.com/package/localtunnel)
- [`Cloudflare Tunnels`](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/)

```
ngrok http 3000
```

For example, if you choose to use `ngrok`, you'll be running some variation of the following command (we chose to listen on port 3000):

Take note of the URL exposed by your tool of choice, as you'll need it in the next step (i.e. `https://my-extension-service`).

## Create a Todoist App

> ![Getting started add UI extension](https://developer.todoist.com/images/ui_extensions/getting_started_add_extension-13fc4e91.png)

Finally, we want to create a Todoist App:

1. Visit the [App Management Console](https://developer.todoist.com/appconsole.html) (you'll be prompted to log in if you're not already)
2. Click "Create a new App" and insert a name in the "App name" field (i.e. "My first app")
3. In the `UI Extensions` section, click "Add a new UI extension" (it should look like the screenshot on the right):


   - Give it a name (i.e. "Greet me!")
   - Select "Context menu" as the "Extension type" (and "Project" as the "Context type")
   - Point "Data exchange endpoint URL" to your service URL followed by `/process` (or the endpoint name you chose when [creating your own integrations service](https://developer.todoist.com/ui-extensions#create-your-own-integrations-service)). This value in this field might look something like `https://my-extension-service/process`
4. In the `Installation` section, click on the `Install for me` button

## Use your UI Extension

Now, for the fun part!

1. Visit [Todoist](https://www.todoist.com/)
2. Select any of your Todoist projects (or create a new one)
3. Click on the context menu icon of that project, select "Integrations" and finally select your UI Extension from the list (i.e. "Greet me!")

![Getting Started v1](https://developer.todoist.com/images/ui_extensions/getting_started_v1-10eaa23b.gif)

Congratulations, you just built and used your first Todoist UI Extension! 🎉

## Iterate

> app.ts

```
import { DoistCard, DoistCardRequest, SubmitAction, TextBlock }
from '@doist/ui-extensions-core'
import express, { Request, Response, NextFunction } from 'express'

const port = 3000
const app = express()
app.use(express.json())

const processRequest = async function (
    request: Request, response: Response, next: NextFunction
) {
    const doistRequest: DoistCardRequest = request.body as DoistCardRequest
    const { action } = doistRequest

    if (action.actionType === 'initial') {
        // Initial call to the UI Extension,
        // triggered by the user launching the extension

        // Prepare the Adaptive Card with the response
        // (it's going to be a form with some text and a button)
        const card = new DoistCard()
        card.addItem(TextBlock.from({
            text: 'Hello, my friend!',
        }))
        card.addAction(
            SubmitAction.from({
                id: 'Action.Submit',
                title: 'Click me!',
                style: 'positive',
            }),
        )

        // Send the Adaptive Card to the renderer
        response.status(200).json({card: card})

    } else if (action.actionType === 'submit'
            && action.actionId === 'Action.Submit') {
        // Subsequent call to the UI Extension,
        // triggered by clicking the 'Click me!' button

        // Prepare the response
        // (this time it won't be an Adaptive Card, but two bridges)
        const bridges = [\
            {\
                bridgeActionType: 'display.notification',\
                notification: {\
                    type: 'success',\
                    text: 'You clicked that button, congrats!',\
                }\
            },\
            {\
                bridgeActionType: 'finished',\
            },\
        ]

        // Send the bridges to the rendederer
        response.status(200).json({bridges: bridges})

    } else {
        // Throw an error
        throw Error('Request is not valid')
    }
}

app.post('/process', processRequest)

app.listen(port, () => {
    console.log(`UI Extension server running on port ${port}.`)
});
```

Err, our new button doesn't really do much, does it? Well, let's change that.

This time we're going to check the `actionType` (and `actionId`) that's part of the incoming request:

- If it's the initial request to our UI Extension, then we want to display the simple text and then button
- If it's a subsequent request (triggered by clicking on the button), then we want to return a notification to the user and terminate the extension flow

To communicate to the renderer that we want to display a notification, we return a list of `bridges`, which are requests to execute a specific action on the client-side. In this case, we choose to return a `display.notification``bridge` and a `finished``bridge`, since we want to display a notification message to the user and also terminate the extension flow.

After making a few code changes, you can test your extension again and be delighted by the notification that pops up once you click on your button:

![Getting Started v2](https://developer.todoist.com/images/ui_extensions/getting_started_v2-f6dd1046.gif)

## Code Examples

- You can find the code we just wrote at [Getting Started Extension](https://github.com/Doist/todoist-integration-examples/tree/main/getting-started-ui-extension).

- If you want to browse (and run) an integration with more extensive functionality, including receiving and using Todoist API tokens and creating different types of UI extensions, check out our [Lorem Ipsum Extension](https://github.com/Doist/todoist-integration-examples/tree/main/lorem-ipsum-ui-extension).

- At Doist, we use [NestJS](https://docs.nestjs.com/) for our UI Extensions, as it allows us to efficiently build new integrations. We have [an open-source SDK](https://github.com/Doist/ui-extensions-server) with NestJS-specific modules that you can use to develop your own UI Extensions. We have open sourced our [Export to Google Sheets integration](https://github.com/Doist/todoist-google-sheets) so that you can see how we use this SDK.

- If you're missing a sample for the problem you're trying to solve, please [contact us](https://www.todoist.com/contact/login?returnTo=%2Fcontact) (select "Something else" and then "Integrations Development") to let us know! Alternatively, consider creating a pull request with the sample against our [repo](https://github.com/Doist/todoist-integration-examples/pulls), we're (gladly) accepting contributions.


## Next steps

- If you jumped straight to this section, you can go back and review our [Introduction](https://developer.todoist.com/ui-extensions#introduction) and learn about the basics of UI Extensions
- If you want to do more than displaying buttons and notification, learn more about [Returning UIs and Action bridges](https://developer.todoist.com/ui-extensions#returning-uis-and-action-bridges)
- If you want to make sure the incoming request is from Todoist (and not a third-party application), check out [Security](https://developer.todoist.com/ui-extensions#security)
- If you want to add other types of UI Extensions (i.e. Composer, Settings), take a look at [Adding a UI Extension](https://developer.todoist.com/ui-extensions#adding-a-ui-extension)

# Handling User Requests

## Client and User Information

> Request skeleton

```
{
    "extensionType": "context-menu",
    "context": {
        "theme": "light",
        "user": {...},
        "todoist": {...},
        "platform": "desktop"
    },
    "action": {
        "actionType": "initial",
        "params": {...}
    },
    "maximumDoistCardVersion": 0.6,
}
```

Each request made from the Todoist client to your extension will contain information about the client that sent the data, as well as information about the user who triggered the request.

This is called the **Data Exchange Format** and establishes what the integration service can expect in the client request:

- [**Extension Type (`extensionType`)**](https://developer.todoist.com/ui-extensions#extension-type) \- Identifies the type of the extension (`context-menu`, `composer` or `settings`).
- [**Context (`context`)**](https://developer.todoist.com/ui-extensions#context) \- Information about the environment and the user that's using the extension.
- [**Action (`action`)**](https://developer.todoist.com/ui-extensions#action) \- Identifies the type of action the user has executed on the client.
- [**Maximum Doist Card Version (`maximumDoistCardVersion`)**](https://developer.todoist.com/ui-extensions#maximum-doist-card-version) \- Identifies the maximum [Doist Card version](https://developer.todoist.com/ui-extensions#doist-cards-versions) that the client can support. This can allow your extension to send back differing UI elements based on what the client supports.

### Extension Type

> Extension type example

```
{
    "extensionType": "context-menu"
}
```

The extension type depends on where the user has invoked said extension. Supported values are:

- [Context Menu](https://developer.todoist.com/ui-extensions#context-menu) (`context-menu`)
- [Composer](https://developer.todoist.com/ui-extensions#composer) (`composer`)
- [Settings](https://developer.todoist.com/ui-extensions#settings) (`settings`)

#### Context Menu

The user can access these integrations from the context menu of a project or task. Developers can specify if their context menu extension should appear in the context menu of either a project or task when creating a new [Adding a UI Extension](https://developer.todoist.com/ui-extensions#adding-a-ui-extension), acting of the `Context type` field.

Context menu extensions also provide some additional data, like the `source` in the `action.params` field (see [action](https://developer.todoist.com/ui-extensions#action)).

#### Composer

The user can access these integrations from the composer extensions menu of a task or comment. Developers can specify if their composer extension should appear in the composer extension menu of either a task or comment when creating a new [Adding a UI Extension](https://developer.todoist.com/ui-extensions#adding-a-ui-extension), acting of the `Composer type` field.

#### Settings

If the extension type is `settings` this means it has been triggered from within Todoist's in-app settings. Developers can choose to display there any settings the user can change for the current extension.

A settings extension is great for occasions where there's no other place to put your extension's settings. One example are extensions that don't have any user interface.

While each integration can have more than one context menu and composer extension, it can only have one settings extension.

### Context

> Context example

```
{
    "context": {
        "theme": "light",
        "user": {
            "email": "janedoe@doist.com",
            "timezone": "Europe/Rome",
            "id": 1234567,
            "name": "Jane Doe",
            "first_name": "Jane",
            "short_name": "Jane",
            "lang": "en"
        },
        "todoist": {
            "project": {
                "id": "2302004695",
                "name": "Knit a sweater"
            },
            "additionalUserContext": {
                "isPro": false
            }
        },
        "platform": "desktop"
    }
}
```

We send context information with every request to the integration service. It contains:

- [Theme](https://developer.todoist.com/ui-extensions#theme) (`theme`)
- [User](https://developer.todoist.com/ui-extensions#user) (`user`)
- [Todoist](https://developer.todoist.com/ui-extensions#todoist) (`todoist`)
- [Platform](https://developer.todoist.com/ui-extensions#platform) (`platform`)

#### Theme

This will be the theme of the calling application, either `light` or `dark`.

#### User

It contains the current user that invoked the integration.

A subset of Todoist's [user fields](https://developer.todoist.com/sync/v9/#user):

- `short_name`
- `timezone`
- `id`
- `lang`
- `first_name`
- `name`
- `email`

#### Platform

This will be the platform that the client is making the request from and can be used by the integrations to tailor their UI to the platform requesting. This is an optional field and can be either `desktop` or `mobile`.

#### Todoist

Todoist-specific context items. These are information about where in Todoist the request was made.

##### Project

> Project example

```
{
    "project": {
        "id": "2302004695",
        "name": "Knit a sweater"
    },
}
```

It contains the current project from which the user has triggered the extension. It will be populated only if the user invoked the extension from a project view.

A subset of Todoist's [project fields](https://developer.todoist.com/sync/v9/#projects):

- `id`
- `name`

##### Filter

> Filter example

```
{
    "filter": {
        "id": "2333088149",
        "name": "Due next week"
    }
}
```

It contains the current filter from which the user has triggered the extension. It will be populated only if the user invoked the extension from a filter view.

A subset of Todoist's [filter fields](https://developer.todoist.com/sync/v9/#filters):

- `id`
- `name`

##### Label

> Label example

```
{
    "label": {
        "id": "2162893832",
        "name": "Knitting"
    }
}
```

It contains the current label from which the user has triggered the extension. It will be populated only if the user invoked the extension from a label view.

A subset of Todoist's [label fields](https://developer.todoist.com/sync/v9/#labels):

- `id`
- `name`

##### AdditionalUserContext

Additional context about the user who triggered the request:

- `isPro`: `true` if the user is on a Todoist Pro plan, `false` otherwise

### Action

We use the action to signal to the server what kind of interaction does the user expects.

We support the following types of interactions:

- [Initial](https://developer.todoist.com/ui-extensions#initial) (`initial`)
- [Submit](https://developer.todoist.com/ui-extensions#submit) (`submit`)

Other than the mandatory `actionType`, the `action` object can contain various different fields, depending on the type of the action.

#### Initial

> Initial Action example (without `params`)

```
{
  "actionType": "initial"
}
```

> Initial Action example (with `params`)

```
{
   "actionType": "initial",
   "params": {
      "source": "task",
      "sourceId": "6124677943",
      "url": "https://app.todoist.com/app/task/6124677943",
      "content": "Knit a sweater",
      "contentPlain": "Knit a sweater"
   }
}
```

The `initial` action type tells the server that the user has just opened the integration and expects to see the first screen in the workflow.

In the case of context menu extensions, there will be additional data being sent as part of the initial request, which will live in the `params` field.

##### Params

| Name | Description |
| --- | --- |
| source _String_ | This will be either `project` or `task`. |
| url _String_ | This will be the deep link url to the project/task. |
| sourceId _String_ | This is the id of the project/task. |
| content _String_ | For the following, this will be: <br>- Project: The project's name<br>- Task: The task's content |
| contentPlain _String_ | This will be a stripped-down version of the content, with all markdown formatting removed. |

#### Submit

> Submit Action Example

```
{
  "actionType": "submit",
  "actionId": "Action.Search",
  "inputs": {
    "Input.Search": "cute cats",
  },
  "data": {
    "slug": "cutest-cat-ever"
  }
}
```

Whenever a user presses a button, for example, Todoist will send all the fields the user has filled out, checked or interacted with, back to the server, using the [Action.Submit](https://adaptivecards.io/explorer/Action.Submit.html) action.

Whenever a user executes an action via the [Action.Submit](https://adaptivecards.io/explorer/Action.Submit.html) action on the form; the following will be sent to your integration:

- All `Input.*` fields in the form of `{"inputId": "inputValue"}`
- All `data` properties of the Submit element

An `actionId` should be supplied with the request as the `submit` action on its own may not be very clear as to the action's intended consequence.

### Maximum Doist Card Version

This is the maximum [version of Doist Card](https://developer.todoist.com/ui-extensions#doist-cards-versions) that the requesting client can support. The client will send this field to requests cards that can be successfully displayed on the client itself.

An example of why this is needed is if a user hasn't been able to update to the latest version of Todoist that supports the latest version of Doist Card. In this case, the extension can send back a card that will be supported by that version of the client application. Should the extension not support a lower version of Doist Card, the extension should set the `Minimum Doist Card version` when creating their extension in the [App Management Console](https://developer.todoist.com/appconsole.html):

![Minimum Doist Card version](https://developer.todoist.com/images/ui_extensions/minimum_doist_card-ba39be5e.png)

## Security

In order for your extension to confirm that the request was made from Todoist and not from a potentially malicious actor, each request will include an additional header: `x-todoist-hmac-sha256`.

This is a SHA256 HMAC generated using the integration's verification token as the encryption key and the whole request payload as the message to be encrypted. The resulting HMAC would be encoded in a base64 string.

To verify that the request is from a trusted source (Todoist) you need to compare it with the `verification token` value of your integration, which you can get from your app settings in the [App Management Console](https://developer.todoist.com/appconsole.html).

> Header validation example

```
function isRequestValid(
    verificationToken: string,
    requestHeaders: IncomingHttpHeaders,
    requestBody: Buffer
): boolean {
    if (!requestBody) {
        return false
    }

    const hashedHeader = requestHeaders['x-todoist-hmac-sha256']
    if (!hashedHeader) {
        return false
    }

    const hashedRequest = CryptoJS.HmacSHA256(
        requestBody.toString('utf-8'), verificationToken.trim()
    ).toString(CryptoJS.enc.Base64)

    return hashedHeader === hashedRequest
}
```

Here on the right you can see a simplified example of how you can validate this header, where:

- `verificationToken` (`string`) is your verification token from App Console
- `requestHeaders` (`http.IncomingHttpHeaders`) are the headers from the incoming request
- `requestBody` (`Buffer`) is the raw body of the incoming request

You can also see this code in action in our [Lorem Ipsum Extension](https://github.com/Doist/todoist-integration-examples).

## Full Client Request Example

The full request that the client makes to the server can look as follows.

### Context Menu Extension

```
{
   "context":{
      "theme":"light",
      "user":{
         "email":"janedoe@doist.com",
         "timezone":"Europe/Rome",
         "id":4939878,
         "name":"Jane Doe",
         "first_name":"Jane",
         "short_name":"Jane",
         "lang":"en"
      },
      "todoist":{
         "project":{
            "id":"2299753711",
            "name":"Test project"
         },
         "additionalUserContext":{
            "isPro":true
         }
      },
      "platform":"desktop"
   },
   "action":{
      "actionType":"initial",
      "params":{
         "content":"Test project",
         "sourceId":"2299753711",
         "source":"project",
         "url":"https://app.todoist.com/app/project/2299753711",
         "contentPlain":"Test project"
      }
   },
   "extensionType":"context-menu",
   "maximumDoistCardVersion":0.6
}
```

### Composer Extension

```
{
   "context":{
      "theme":"light",
      "user":{
         "email":"janedoe@doist.com",
         "timezone":"Europe/Rome",
         "id":4939878,
         "name":"Jane Doe",
         "first_name":"Jane",
         "short_name":"Jane",
         "lang":"en"
      },
      "todoist":{
         "project":{
            "id":"2299753711",
            "name":"Test project"
         },
         "additionalUserContext":{
            "isPro":true
         }
      },
      "platform":"desktop"
   },
   "action":{
      "actionType":"initial"
   },
   "extensionType":"composer",
   "maximumDoistCardVersion":0.6
}
```

### Settings Extension

```
{
   "context":{
      "theme":"light",
      "user":{
         "email":"janedoe@doist.com",
         "timezone":"Europe/Rome",
         "id":4939878,
         "name":"Jane Doe",
         "first_name":"Jane",
         "short_name":"Jane",
         "lang":"en"
      },
      "platform":"desktop"
   },
   "action":{
      "actionType":"initial"
   },
   "extensionType":"settings",
   "maximumDoistCardVersion":0.6
}
```

# Returning UIs and Action Bridges

When the integration service responds to the client requests, it needs to send several vital pieces of information:

- [**UI (`card`)**](https://developer.todoist.com/ui-extensions#ui) \- The `card` is what contains the UI JSON that the Todoist client will render for the user.
- [**Client-side Actions (`bridges`)**](https://developer.todoist.com/ui-extensions#client-side-actions) \- This field is an array of `bridges` (request for the client to perform specific actions on the extensions' behalf, such as inject text into the composer or display a notification). The bridges will be executed in the order in which they appear in the array.

Note that both properties (`card` and `bridges`) can present at the same time, but at least one must always be filled out.

## UI

> Card example

```
{
  "card": {
    "type": "AdaptiveCard",
    "body": [{\
        "text": "Welcome, my friend!",\
        "type": "TextBlock"\
    }],
    {...}
  }
}
```

In most cases, the extension will instruct the client to display a UI rendered as a [Doist Card](https://developer.todoist.com/ui-extensions#doist-card).

## Client-side Actions

> Bridges example

```
{
  "bridges": [\
    {\
      "bridgeActionType": "composer.append",\
      "text": "My Text to Append"\
    },\
    {\
      "bridgeActionType": "finished"\
    }\
  ]
}
```

In some cases, the extension also need to ask the client to execute actions within the app itself. These requests for actions are called `bridges`.

Currently, we support the following bridge action types (`bridgeActionType`):

- [Display Notification (`display.notification`)](https://developer.todoist.com/ui-extensions#display-notification)
- [Append Text to Composer (`composer.append`)](https://developer.todoist.com/ui-extensions#append-text-to-composer)
- [Trigger a Todoist sync (`request.sync`)](https://developer.todoist.com/ui-extensions#request-sync)
- [Extension has finished (`finished`)](https://developer.todoist.com/ui-extensions#extension-has-finished)

An extension can send multiple bridges as part of the response and the client will execute each bridge in order. See the example on the right of an extension that is instructing the client to add text to the composer and then to close the extension:

### Display Notification

> Display Notification Bridge

```
{
  "bridgeActionType": "display.notification",
  "notification": {
    "text": "The task has been added to your inbox",
    "type": "success",
    "action": "https://app.todoist.com/app/task/123456789",
    "actionText": "Open task"
  }
}
```

Extensions can issue requests to display a **lightweight notification** as an alternative to a full card. This is a great choice for quick messages. In this case, the response will include the following property:

- `notification`: [notification](https://developer.todoist.com/ui-extensions#notification) that will be displayed to the user

#### Notification

**Properties**

| Name | Description |
| --- | --- |
| text _String_ | This is the text to appear in the notification. This should be plain text, Markdown is _not_ supported here. |
| type _String_ | This will be either `info`, `success` or `error`. |
| actionUrl _String_ | (Optional) This is the action URL that will be opened if `actionText` is clicked. |
| actionText _String_ | (Optional) This is the text to be displayed for the action. This should be plain text, Markdown is _not_ supported here. |

**Note**: For the notification to display an action, _both_`actionUrl` and `actionText` must be provided.

### Append to Composer

> Composer Append Bridge

```
{
  "bridgeActionType": "composer.append",
  "text": "My Text to Append"
}
```

Upon receiving a `composer.append` action bridge, the client will append the specified text into the Todoist text composer:

- `text`: text to append at the end of the current message

### Request Todoist Sync

> Request Sync Bridge

```
{
  "bridgeActionType": "request.sync",
  "onSuccessNotification": {
    "text": "Your tasks are now up to date.",
    "type": "success",
    "action": "https://app.todoist.com/app/project/2288958626",
    "actionText": "Open project"
  },
  "onErrorNotification": {
    "text": "Whoops! Something went wrong.",
    "type": "error",
    "action": "https://www.todoist.com/contact",
    "actionText": "Contact support"
  }
}
```

When the extension issues a `request.sync`, the client will perform a Todoist sync. In this case, the supported properties are:

- `onSuccessNotification`: [notification](https://developer.todoist.com/ui-extensions#notification) that will be displayed to the user in case the Todoist sync is successful
- `onErrorNotification`: [notification](https://developer.todoist.com/ui-extensions#notification) that will be displayed to the user in case the Todoist sync is not successful

### Extension has finished

> Finished Bridge

```
{
  "bridgeActionType": "finished"
}
```

When the `finished` bridge is sent back, it's a way for the extension to tell to the client that the extension has finished its lifecycle and it should be closed.

## Full Server Response Example

> Server Response Example

```
{
   "card":{
      "$schema":"http://adaptivecards.io/schemas/adaptive-card.json",
      "adaptiveCardistVersion":"0.6",
      "body":[\
         {\
            "columns":[\
               {\
                  "items":[\
                     {\
                        "id":"title",\
                        "size":"large",\
                        "text":"Export **Test project**",\
                        "type":"TextBlock"\
                     }\
                  ],\
                  "type":"Column",\
                  "verticalContentAlignment":"center",\
                  "width":"stretch"\
               },\
               {\
                  "items":[\
                     {\
                        "columns":[\
                           {\
                              "items":[\
                                 {\
                                    "altText":"View Settings",\
                                    "height":"24px",\
                                    "selectAction":{\
                                       "id":"Action.Settings",\
                                       "type":"Action.Submit"\
                                    },\
                                    "type":"Image",\
                                    "url":"https://td-sheets.todoist.net/images/shared/Settings-light.png",\
                                    "width":"24px"\
                                 }\
                              ],\
                              "type":"Column",\
                              "width":"auto"\
                           }\
                        ],\
                        "type":"ColumnSet"\
                     }\
                  ],\
                  "type":"Column",\
                  "width":"auto"\
               }\
            ],\
            "spacing":"medium",\
            "type":"ColumnSet"\
         },\
         {\
            "items":[\
               {\
                  "id":"options-header",\
                  "isSubtle":true,\
                  "text":"Choose which fields you want to export.",\
                  "type":"TextBlock"\
               },\
               {\
                  "columns":[\
                     {\
                        "items":[\
                           {\
                              "id":"Input.completed",\
                              "title":"Is completed",\
                              "type":"Input.Toggle",\
                              "value":"true"\
                           },\
                           {\
                              "id":"Input.due",\
                              "title":"Due date",\
                              "type":"Input.Toggle",\
                              "value":"true"\
                           },\
                           {\
                              "id":"Input.priority",\
                              "title":"Priority",\
                              "type":"Input.Toggle",\
                              "value":"true"\
                           },\
                           {\
                              "id":"Input.description",\
                              "title":"Description",\
                              "type":"Input.Toggle",\
                              "value":"true"\
                           }\
                        ],\
                        "type":"Column",\
                        "width":"stretch"\
                     },\
                     {\
                        "items":[\
                           {\
                              "id":"Input.parentTask",\
                              "title":"Parent task",\
                              "type":"Input.Toggle",\
                              "value":"true"\
                           },\
                           {\
                              "id":"Input.section",\
                              "title":"Section",\
                              "type":"Input.Toggle",\
                              "value":"true"\
                           },\
                           {\
                              "id":"Input.assignee",\
                              "title":"Assignee",\
                              "type":"Input.Toggle",\
                              "value":"true"\
                           },\
                           {\
                              "id":"Input.createdDate",\
                              "title":"Created date",\
                              "type":"Input.Toggle",\
                              "value":"true"\
                           }\
                        ],\
                        "type":"Column",\
                        "width":"stretch"\
                     }\
                  ],\
                  "type":"ColumnSet"\
               },\
               {\
                  "isSubtle":true,\
                  "text":"The following fields are always exported: Task Id, Task Name, Section Id, and Parent Task Id.",\
                  "type":"TextBlock",\
                  "wrap":true\
               }\
            ],\
            "spacing":"medium",\
            "type":"Container"\
         },\
         {\
            "columns":[\
               {\
                  "items":[\
                     {\
                        "actions":[\
                           {\
                              "id":"Action.Export",\
                              "style":"positive",\
                              "title":"Export",\
                              "type":"Action.Submit"\
                           }\
                        ],\
                        "type":"ActionSet"\
                     }\
                  ],\
                  "type":"Column",\
                  "width":"auto"\
               }\
            ],\
            "horizontalAlignment":"right",\
            "spacing":"medium",\
            "type":"ColumnSet"\
         }\
      ],
      "doistCardVersion":"0.6",
      "type":"AdaptiveCard",
      "version":"1.4"
   }
}
```

# Adding a UI Extension

Extensions can be added to integrations in the [App Management Console](https://developer.todoist.com/appconsole.html). An integration can have multiple UI extensions added to it. More specifically, multiple context menu extensions and composer extensions are allowed, however an integration can only have _one_ settings extension.

Users cannot show/hide specific extensions for an integration.

To add an extension, you need to create a new App first:

![Add UI Extension](https://developer.todoist.com/images/ui_extensions/new_app-52c887f0.png)

Then from the UI Extensions section, click on "UI Extensions":

![Add UI Extension](https://developer.todoist.com/images/ui_extensions/add_ui_extension-fbc1aa26.png)

## Context Menu and Composer Extensions Menu

If you're looking to create an extension that appears in the [context menu or composer extensions menu](https://developer.todoist.com/ui-extensions#extension-type), click the "Add a new UI extension" button. Then, enter the details of your extension.

It is recommended to have an extension name with fewer than 29 characters to avoid truncation within Todoist's context menu.

Once you create an extension, you can also add an icon to it. This icon will be the image that appears in the context menu or composer extensions menu and _not_ the integration's image (as you can have multiple extensions, you might want different icons for each of the extensions).

![New UI Extension](https://developer.todoist.com/images/ui_extensions/new_ui_extension-83d30823.png)

**Properties**

| Name | Description |
| --- | --- |
| Name | The name for your UI Extension, it will appear in the context menu or composer extensions menu. |
| Description | This will appear as the sub-text in the composer extensions menu if the extension is a composer extension. |
| Extension type | Either `Composer` or `Context menu`. |
| Context type | Displayed only if Extension type is `Context menu`. Either `Project` or `Task`. |
| Composer type | Displayed only if Extension type is `Composer`. Either `Task` or `Comment`. |
| Data Exchange Format version | The version of the Data Exchange Format your extension accepts. See [ref](https://developer.todoist.com/ui-extensions#client-and-user-information). |
| Data exchange endpoint URL | The url for your integration service and where the requests will be sent from Todoist. |
| Minimum Doist Card version | The minimum Doist Card version your extension supports. For example, some older mobile clients might not support all the features required by the latest Doist Card version and will leverage this field to decide if the extension should be displayed for the user or not. |

## Settings Extensions

Use the "Add a settings extension" button to add a settings extension. Remember: an integration can only have _one_ of these.

![New Settings UI Extension](https://developer.todoist.com/images/ui_extensions/new_settings_extension-8a491a34.png)

**Properties**

| Name | Description |
| --- | --- |
| Data Exchange Format version | The version of the Data Exchange Format your extension accepts. See [ref](https://developer.todoist.com/ui-extensions#client-and-user-information). |
| Data exchange endpoint URL | The url for your integration service and where the requests will be sent from Todoist. |
| Minimum Doist Card version | The minimum Doist Card version your extension supports. For example, some older mobile clients might not support all the features required by the latest Doist Card version and will leverage this field to decide if the extension should be displayed for the user or not. |

# Short-lived Tokens

If your integration service has a need to call the Todoist [REST API](https://developer.todoist.com/rest) or [Sync API](https://developer.todoist.com/sync) during the UI Extension lifecycle, you don't need to implement the OAuth flow in your extension.

Instead, you can configure Todoist to include a short-lived access token in the requests sent to your integration service, which you can then use in the same way you would use an access token obtained through the [OAuth flow](https://developer.todoist.com/guides/#oauth).

These tokens have a limited lifetime, on the span of a few minutes.

If you wish to use the Todoist API to query or manipulate user data outside the UI Extension lifecycle, you must implement the OAuth flow into your extension.

## Enabling Short-lived Tokens

You can enable these tokens by selecting the authorization scopes needed by your integration in the UI Extensions section of your app in the [App Console](https://developer.todoist.com/appconsole.html):

![Short-lived Token Scopes](https://developer.todoist.com/images/ui_extensions/short_lived_tokens_scopes-d4818dd7.png)

Once enabled, users who install your integration (and users who use your integration for the first time after scopes are changed) will be presented with a consent flow:

![Short-lived Token Consent Flow](https://developer.todoist.com/images/ui_extensions/short_lived_tokens_consent_flow-adf5f9f0.png)

Once the user has consented to those scopes, the token will be included in the `x-todoist-apptoken` header in all requests sent to your integration service.

You can learn more about Authorization scopes in the [Authorization Guide](https://developer.todoist.com/guides/#authorization).

# Doist Cards

[Doist Cards](https://developer.todoist.com/ui-extensions#doist-cards), which are returned in the response from the extension and rendered by the Todoist client for the user, are based on [Adaptive Cards](https://adaptivecards.io/).

The [Doist Cards schema](https://github.com/Doist/ui-extensions/blob/main/schemas/0.6/doist-card.json) is based on the _Adaptive Cards_ schema and provides the elements currently supported in the Todoist clients. We aim for all current versions of Todoist clients to support the latest version of the _Doist Cards_ schema.

## Doist Cards Versions

| Doist Cards Version | Notes |
| --- | --- |
| 0.6 | Latest |

## How to Use

The spec below loosely follows the official [Schema Explorer](https://adaptivecards.io/explorer/). It lists all the elements supported in Doist Cards SDKs. The _Version_ column is the [Doist Cards Version](https://developer.todoist.com/ui-extensions#doist-cards-versions), not the Adaptive Cards version.

## Card

| Property | Required | Description | Version |
| --- | --- | --- | --- |
| type _String_ | Yes | Must be `"AdaptiveCard"`. | 0.6 |
| $schema _String_ | Yes | Must be `"http://adaptivecards.io/schemas/adaptive-card.json".` | 0.6 |
| doistCardVersion _String_ | Yes | Declares compatibility with a specific version of Doist Cards. It is set to `0.6` on the latest Doist Card version. | 0.6 |
| version _String_ | Yes | The Adaptive Card schema version. It is set to `1.4` on the latest Doist Card version. | 0.6 |
| body _List of [Elements](https://developer.todoist.com/ui-extensions#element)_ | Yes | The card elements to show in the primary card region. | 0.6 |
| actions _List of [Actions](https://developer.todoist.com/ui-extensions#actions)_ | No | The actions to show in the card's bottom action bar. | 0.6 |
| autoFocusId _String_ | No | The ID of the input the card wishes to get focus when the card is rendered. | 0.6 |

## Element

All [Card Elements](https://developer.todoist.com/ui-extensions#card-elements), [Containers](https://developer.todoist.com/ui-extensions#containers), and [Inputs](https://developer.todoist.com/ui-extensions#inputs) extend `Element` and support the below properties.

| Property | Required | Description | Version |
| --- | --- | --- | --- |
| id _String_ | No | A unique identifier associated with the item. | 0.6 |
| spacing _[Spacing](https://developer.todoist.com/ui-extensions#spacing)_ | No | The amount of spacing between this element and the preceding element. | 0.6 |
| separator _Boolean_ | No | When true, draw a separating line between this element and the preceding element. | 0.6 |

## Card Elements

### TextBlock

| Property | Required | Description | Version |
| --- | --- | --- | --- |
| type _String_ | Yes | Must be `"TextBlock"`. | 0.6 |
| text _String_ | Yes | Text to display. | 0.6 |
| size _[FontSize](https://developer.todoist.com/ui-extensions#fontsize)_ | No | Font size of the rendered text. | 0.6 |
| isSubtle _Boolean_ | No | If `true`, displays text slightly toned down to appear less prominent. | 0.6 |
| horizontalAlignment _[HorizontalAlignment](https://developer.todoist.com/ui-extensions#horizontalalignment)_ | No | The horizontal alignment of the TextBlock. | 0.6 |
| weight _[FontWeight](https://developer.todoist.com/ui-extensions#fontweight)_ | No | Controls the weight of the TextBlock element. | 0.6 |
| color _[Color](https://developer.todoist.com/ui-extensions#color)_ | No | Controls the foreground color of the TextBlock element. | 0.6 |
| wrap _Boolean_ | No | If true, allow text to wrap. Otherwise, text is clipped. | 0.6 |

### Image

| Property | Required | Description | Version |
| --- | --- | --- | --- |
| type _String_ | Yes | Must be `"Image"`. | 0.6 |
| url _String_ | Yes | The URL to the image. | 0.6 |
| selectAction _[Action](https://developer.todoist.com/ui-extensions#actions)_ | No | An Action that will be invoked when the Image is tapped or selected. | 0.6 |
| width _String_ | No | The desired on-screen width of the image, ending in `px`. E.g., `50px`. | 0.6 |
| height _String_ | No | The desired height of the image. If specified as a pixel value, ending in `px`, E.g., `50px`, the image will distort to fit that exact height. | 0.6 |
| altText _String_ | No | Alternate text describing the image. | 0.6 |
| aspectRatio _Number_ | No | The aspect ratio of the image if height/width are known. | 0.6 |
| size _[ImageSize](https://developer.todoist.com/ui-extensions#imagesize)_ | No | Controls the approximate size of the image. The physical dimensions will vary per host. | 0.6 |

### RichTextBlock

| Property | Required | Description | Version |
| --- | --- | --- | --- |
| type _String_ | Yes | Must be `"RichTextBlock"`. | 0.6 |
| inlines _List of [Inlines](https://developer.todoist.com/ui-extensions#inline)_ | Yes | The array of inlines. | 0.6 |
| horizontalAlignment _[HorizontalAlignment](https://developer.todoist.com/ui-extensions#horizontalalignment)_ | No | The horizontal alignment of the RichTextBlock. | 0.6 |

### Inline

Inline can be of type _String_ or [TextRun](https://developer.todoist.com/ui-extensions#textrun).

### TextRun

| Property | Required | Description | Version |
| --- | --- | --- | --- |
| type _String_ | Yes | Must be `"TextRun"`. | 0.6 |
| text _String_ | Yes | Text to display. | 0.6 |
| color _[Color](https://developer.todoist.com/ui-extensions#color)_ | No | Controls the foreground color of the TextBlock element. | 0.6 |
| size _[FontSize](https://developer.todoist.com/ui-extensions#fontsize)_ | No | Font size of the rendered text. | 0.6 |
| isSubtle _Boolean_ | No | If `true`, displays text slightly toned down to appear less prominent. | 0.6 |
| weight _[FontWeight](https://developer.todoist.com/ui-extensions#fontweight)_ | No | Controls the weight of the TextBlock element. | 0.6 |
| selectAction _[Action](https://developer.todoist.com/ui-extensions#actions)_ | No | Action to invoke when the TextRun is clicked. Visually changes the text run into a hyperlink. | 0.6 |

## Containers

### ActionSet

| Property | Required | Description | Version |
| --- | --- | --- | --- |
| type _String_ | Yes | Must be `"ActionSet"`. | 0.6 |
| actions _List of [Actions](https://developer.todoist.com/ui-extensions#actions)_ | Yes | The array of Action elements to show. | 0.6 |
| horizontalAlignment _[HorizontalAlignment](https://developer.todoist.com/ui-extensions#horizontalalignment)_ | No | The horizontal alignment of the ActionSet. | 0.6 |

### Container

| Property | Required | Description | Version |
| --- | --- | --- | --- |
| type _String_ | Yes | Must be `"Container"`. | 0.6 |
| items _List of [Elements](https://developer.todoist.com/ui-extensions#element)_ | No | The card elements to render inside the Container. | 0.6 |
| selectAction _[Action](https://developer.todoist.com/ui-extensions#actions)_ | No | An Action that will be invoked when the Container is tapped or selected. | 0.6 |
| minHeight _String_ | No | Specifies the minimum height of the container in pixels, like "80px". | 0.6 |
| backgroundImage _[BackgroundImage](https://developer.todoist.com/ui-extensions#backgroundimage)_ | No | Specifies the background image. Acceptable formats are PNG, JPEG, and GIF. | 0.6 |
| verticalContentAlignment _[VerticalContentAlignment](https://developer.todoist.com/ui-extensions#verticalcontentalignment)_ | No | Defines how the content should be aligned vertically within the container. If not specified `"top"` is the default. | 0.6 |
| bleed _Boolean_ | No | Determines whether the element should bleed through its parent's padding. | 0.6 |

### ColumnSet

| Property | Required | Description | Version |
| --- | --- | --- | --- |
| type _String_ | Yes | Must be `"ColumnSet"`. | 0.6 |
| columns _List of [Columns](https://developer.todoist.com/ui-extensions#column)_ | No | The array of `Column` to divide the region into. | 0.6 |
| horizontalAlignment _[HorizontalAlignment](https://developer.todoist.com/ui-extensions#horizontalalignment)_ | No | The horizontal alignment of the ColumnSet. | 0.6 |

### Column

| Property | Required | Description | Version |
| --- | --- | --- | --- |
| type _String_ | Yes | Must be `"Column"`. | 0.6 |
| items _List of [Elements](https://developer.todoist.com/ui-extensions#element)_ | No | The card elements to render inside the Column. | 0.6 |
| verticalContentAlignment _[VerticalContentAlignment](https://developer.todoist.com/ui-extensions#verticalcontentalignment)_ | No | Defines how the content should be aligned vertically within the column. | 0.6 |
| width _String_ | No | Either `"auto"` or `"stretch"`. Note that `"3px"` format might be supported in future versions of Doist Cards. | 0.6 |
| selectAction _[Action](https://developer.todoist.com/ui-extensions#actions)_ | No | An Action that will be invoked when the Column is tapped. | 0.6 |

## Actions

All `Actions` support the following properties:

| Property | Required | Description | Version |
| --- | --- | --- | --- |
| id _String_ | No | A unique identifier associated with the item. | 0.6 |
| title _String_ | No | Label for button or link that represents this action. | 0.6 |
| iconUrl _String_ | No | Optional icon to be shown on the action in conjunction with the title. Supports data URI. | 0.6 |
| style _[ActionStyle](https://developer.todoist.com/ui-extensions#actionstyle)_ | No | Appearance of the action. | 0.6 |

### Action.Submit

| Property | Required | Description | Version |
| --- | --- | --- | --- |
| type _String_ | Yes | Must be `"Action.Submit"`. | 0.6 |
| data _String or Object_ | No | Initial data that input fields will be combined with. These are essentially "hidden" properties. | 0.6 |
| associatedInputs _[AssociatedInput](https://developer.todoist.com/ui-extensions#associatedinput)_ | No | Controls which inputs are associated with the submit action. _Default is "Auto"._ | 0.6 |

### Action.OpenUrl

| Property | Required | Description | Version |
| --- | --- | --- | --- |
| type _String_ | Yes | Must be `"Action.OpenUrl"`. | 0.6 |
| url _String_ | Yes | The URL that will be opened when the action is invoked. | 0.6 |

### Action.Clipboard

| Property | Required | Description | Version |
| --- | --- | --- | --- |
| type _String_ | Yes | Must be `"Action.Clipboard"`. | 0.6 |
| text _String_ | Yes | The text that will be copied to the clipboard when the action is invoked. | 0.6 |

## Inputs

### Input.Text

| Property | Required | Description | Version |
| --- | --- | --- | --- |
| type _String_ | Yes | Must be `"Input.Text"`. | 0.6 |
| placeholder _String_ | No | Description of the input desired. Displayed when no text has been input. | 0.6 |
| inlineAction _[Action](https://developer.todoist.com/ui-extensions#actions)_ | No | The inline action for the input. Typically displayed to the right of the input. It is strongly recommended to provide an icon on the action (which will be displayed instead of the title of the action). | 0.6 |
| label _String_ | No | Label for this input. | 0.6 |
| isRequired _Boolean_ | No | Whether or not this input is required. | 0.6 |
| errorMessage _String_ | No | Error message to display when entered input is invalid. | 0.6 |
| rows _Number_ | No | The number of rows a multi-line text input should display. | 0.6 |
| inputStyle _[InputStyle](https://developer.todoist.com/ui-extensions#inputstyle)_ | No | The style the text input should display as. | 0.6 |
| value _String_ | No | The initial value for this field. | 0.6 |
| regex _String_ | No | Regular expression indicating the required format of this text input. | 0.6 |

### Input.Date

| Property | Required | Description | Version |
| --- | --- | --- | --- |
| type _String_ | Yes | Must be `"Input.Date"`. | 0.6 |
| label _String_ | No | Label for this input. | 0.6 |
| isRequired _Boolean_ | No | Whether or not this input is required. | 0.6 |
| errorMessage _String_ | No | Error message to display when entered input is invalid. | 0.6 |
| value _String_ | No | The initial value for this field, in the format `YYYY-MM-DD`. | 0.6 |
| min _String_ | No | The minimum inclusive value for the field, in the format `YYYY-MM-DD`. | 0.6 |
| max _String_ | No | The maximum inclusive value for the field, in the format `YYYY-MM-DD`. | 0.6 |

### Input.Time

| Property | Required | Description | Version |
| --- | --- | --- | --- |
| type _String_ | Yes | Must be `"Input.Time"`. | 0.6 |
| label _String_ | No | Label for this input. | 0.6 |
| isRequired _Boolean_ | No | Whether or not this input is required. | 0.6 |
| errorMessage _String_ | No | Error message to display when entered input is invalid. | 0.6 |
| value _String_ | No | The initial value for this field, in the format `HH:mm`. | 0.6 |

### Input.ChoiceSet

| Property | Required | Description | Version |
| --- | --- | --- | --- |
| type _String_ | Yes | Must be `"Input.ChoiceSet"`. | 0.6 |
| label _String_ | No | Label for this input. | 0.6 |
| isRequired _Boolean_ | No | Whether or not this input is required. | 0.6 |
| errorMessage _String_ | No | Error message to display when entered input is invalid. | 0.6 |
| value _String_ | No | The _value_ of the initial choice. | 0.6 |
| choices _Object_ | Yes | An array of [Choices](https://developer.todoist.com/ui-extensions#choice) | 0.6 |
| selectAction _[Action](https://developer.todoist.com/ui-extensions#actions)_ | No | An Action that will be invoked when the selection is changed. | 0.6 |
| isSearchable _Boolean_ | No | Sets whether this list of choices is searchable and the text value can be free-form. | 0.6 |
| style _[ChoiceInputStyle](https://developer.todoist.com/ui-extensions#choiceinputstyle)_ | No | Sets what style the ChoiceSet should use. Default is `compact`. | 0.6 |
| orientation _[Orientation](https://developer.todoist.com/ui-extensions#orientation)_ | No | Sets what style the ChoiceSet should use. Default is `compact`. | 0.6 |

#### Choice

Describes a choice for use in a ChoiceSet.

| Property | Required | Description | Version |
| --- | --- | --- | --- |
| title _String_ | Yes | Text to display. | 0.6 |
| value _String_ | No | The raw value of the choice. | 0.6 |
| disabled _Boolean_ | No | If `true`, the option will render as disabled. | 0.6 |

### Input.Toggle

| Property | Required | Description | Version |
| --- | --- | --- | --- |
| type _String_ | Yes | Must be `"Input.Toggle"`. | 0.6 |
| title _String_ | Yes | Title for the toggle. | 0.6 |
| id _String_ | Yes | Unique identifier for the value. Used to identify collected input when the Submit action is performed. | 0.6 |
| value _String_ | No | The initial selected value. This will return `"true"` or `"false"`. If you want the toggle to be initially on, set this to `"true"`. | 0.6 |
| wrap _Boolean_ | No | If `true`, allw text to wrap, otherwise text is clipped. | 0.6 |
| label _String_ | No | Label for this input. | 0.6 |
| isRequired _Boolean_ | No | Whether or not this input is required. | 0.6 |
| errorMessage _String_ | No | Error message to display when entered input is invalid. | 0.6 |
| selectAction _[Action](https://developer.todoist.com/ui-extensions#actions)_ | No | An Action that will be invoked when the checked status is changed. | 0.6 |

## Types

### BackgroundImage

| Value | Required | Description | Version |
| --- | --- | --- | --- |
| url _String_ | Yes | URL of the background image. | 0.6 |
| fillMode _[ImageFillMode](https://developer.todoist.com/ui-extensions#imagefillmode)_ | No | Describes how the image should fill the area. If none specified, `cover` is applied. | 0.6 |

## Enums

### Spacing

_Please note: The values sent for this are case insensitive_

| Value | Version |
| --- | --- |
| default | 0.6 |
| none | 0.6 |
| small | 0.6 |
| medium | 0.6 |
| large | 0.6 |

### HorizontalAlignment

_Please note: The values sent for this are case insensitive_

| Value | Version |
| --- | --- |
| left | 0.6 |
| center | 0.6 |
| right | 0.6 |

### VerticalContentAlignment

_Please note: The values sent for this are case insensitive_

| Value | Version |
| --- | --- |
| top | 0.6 |
| center | 0.6 |
| bottom | 0.6 |

### FontWeight

_Please note: The values sent for this are case insensitive_

| Value | Version |
| --- | --- |
| lighter | 0.6 |
| default | 0.6 |
| bolder | 0.6 |

### FontSize

_Please note: The values sent for this are case insensitive_

| Value | Version |
| --- | --- |
| default | 0.6 |
| small | 0.6 |
| medium | 0.6 |
| large | 0.6 |
| extraLarge | 0.6 |

### Color

_Please note: The values sent for this are case insensitive_

| Value | Version |
| --- | --- |
| default | 0.6 |
| dark | 0.6 |
| light | 0.6 |
| accent | 0.6 |
| good | 0.6 |
| warning | 0.6 |
| attention | 0.6 |

### ImageFillMode

_Please note: The values sent for this are case insensitive_

| Value | Description | Version |
| --- | --- | --- |
| cover | The background image covers the entire width of the container. Its aspect ratio is preserved. Content may be clipped if the aspect ratio of the image doesn't match the aspect ratio of the container. `verticalAlignment` is respected (`horizontalAlignment` is meaningless since it's stretched width). This is the default mode and is the equivalent to the current model. | 0.6 |
| repeat | The background image isn't stretched. It is repeated first in the x axis then in the y axis as many times as necessary to cover the entire container. Both `horizontalAlignment` and `verticalAlignment` are honored (defaults are left and top). | 0.6 |

### ActionStyle

_Please note: The values sent for this are case insensitive_

| Value | Description | Version |
| --- | --- | --- |
| default | Action is displayed as normal. | 0.6 |
| positive | Action is displayed with a positive style (typically the button becomes accent color). | 0.6 |
| destructive | Action is displayed with a destructive style (typically a red, warning-like design). | 0.6 |

### InputStyle

_Please note: The values sent for this are case insensitive_

| Value | Description | Version |
| --- | --- | --- |
| text | This is a regular text input. | 0.6 |
| tel | This is a number (eg, telephone) input. | 0.6 |
| email | This is an email input. | 0.6 |
| url | This is a URL input. | 0.6 |
| search | This is a search box input. | 0.6 |

### ImageSize

_Please note: The values sent for this are case insensitive_

| Value | Description | Version |
| --- | --- | --- |
| auto | Image will scale down to fit if needed, but will not scale up to fill the area. | 0.6 |
| stretch | Image with both scale down and up to fit as needed. | 0.6 |
| small | Image is displayed with a fixed small width, where the width is determined by the host. | 0.6 |
| medium | Image is displayed with a fixed medium width, where the width is determined by the host. | 0.6 |
| large | Image is displayed with a fixed large width, where the width is determined by the host. | 0.6 |

### ChoiceInputStyle

| Value | Description | Version |
| --- | --- | --- |
| compact | This will make the choices appear as a dropdown. | 0.6 |
| expanded | This will make the choices appear as radio buttons, only applies if `isMultiSelect` is false. | 0.6 |

### Orientation

| Value | Description | Version |
| --- | --- | --- |
| vertical | Has a vertical orientation. | 0.6 |
| horizontal | Has a horizontal orientation. | 0.6 |

### AssociatedInput

| Value | Description | Version |
| --- | --- | --- |
| auto | Inputs on the current card and any parent cards will be validated and submitted for this Action. | 0.6 |
| none | None of the inputs will be validated or submitted for this Action. | 0.6 |
| ignorevalidation | Ignores any validation but still submits the input values for the Action. | 0.6 |

Title: Introduction – UI Extensions | Todoist Developer
