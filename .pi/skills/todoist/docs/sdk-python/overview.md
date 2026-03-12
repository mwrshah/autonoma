# Todoist Python SDK - Overview
Source: https://doist.github.io/todoist-api-python/

## Installation
pip install todoist-api-python

## Usage
```python
from todoist_api_python.api import TodoistAPI
api = TodoistAPI("YOUR_API_TOKEN")
task = api.get_task("6X4Vw2Hfmg73Q2XR")
```

### Async usage
```python
from todoist_api_python.api_async import TodoistAPIAsync
async with TodoistAPIAsync("YOUR_API_TOKEN") as api:
    task = await api.get_task("6X4Vw2Hfmg73Q2XR")
```

## Pages
- Authentication: authentication.md
- API Client: api-client.md
- API Client (async): api-client-async.md
- Models: models.md

## GitHub
https://github.com/Doist/todoist-api-python
