Scraping: https://doist.github.io/todoist-api-python/models/
[Skip to content](https://doist.github.io/todoist-api-python/models/#models)

[![logo](https://doist.github.io/todoist-api-python/assets/logo.svg)](https://doist.github.io/todoist-api-python/ "Todoist Python SDK")

Todoist Python SDK



Models



Type to start searching

[GitHub\\
\\
\\
- 237\\
- 34](https://github.com/Doist/todoist-api-python/ "Go to repository")

[![logo](https://doist.github.io/todoist-api-python/assets/logo.svg)](https://doist.github.io/todoist-api-python/ "Todoist Python SDK")
Todoist Python SDK


[GitHub\\
\\
\\
- 237\\
- 34](https://github.com/Doist/todoist-api-python/ "Go to repository")

- [Overview](https://doist.github.io/todoist-api-python/)
- [Authentication](https://doist.github.io/todoist-api-python/authentication/)
- [API Client](https://doist.github.io/todoist-api-python/api/)
- [API Client (async)](https://doist.github.io/todoist-api-python/api_async/)
- [ ]
Models

[Models](https://doist.github.io/todoist-api-python/models/)
Table of contents


  - [`` models](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models)
  - [`` ApiDate](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.ApiDate)
  - [`` ApiDue](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.ApiDue)
  - [`` DurationUnit](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.DurationUnit)
  - [`` ViewStyle](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.ViewStyle)
  - [`` Attachment](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Attachment)

    - [`` file\_duration](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Attachment.file_duration)
    - [`` file\_name](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Attachment.file_name)
    - [`` file\_size](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Attachment.file_size)
    - [`` file\_type](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Attachment.file_type)
    - [`` file\_url](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Attachment.file_url)
    - [`` image](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Attachment.image)
    - [`` image\_height](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Attachment.image_height)
    - [`` image\_width](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Attachment.image_width)
    - [`` resource\_type](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Attachment.resource_type)
    - [`` title](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Attachment.title)
    - [`` upload\_state](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Attachment.upload_state)
    - [`` url](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Attachment.url)

  - [`` AuthResult](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.AuthResult)

    - [`` access\_token](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.AuthResult.access_token)
    - [`` state](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.AuthResult.state)

  - [`` Collaborator](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Collaborator)

    - [`` email](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Collaborator.email)
    - [`` id](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Collaborator.id)
    - [`` name](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Collaborator.name)

  - [`` Comment](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Comment)

    - [`` attachment](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Comment.attachment)
    - [`` content](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Comment.content)
    - [`` id](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Comment.id)
    - [`` posted\_at](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Comment.posted_at)
    - [`` poster\_id](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Comment.poster_id)
    - [`` project\_id](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Comment.project_id)
    - [`` task\_id](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Comment.task_id)

  - [`` Deadline](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Deadline)

    - [`` date](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Deadline.date)
    - [`` lang](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Deadline.lang)

  - [`` Due](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Due)

    - [`` date](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Due.date)
    - [`` is\_recurring](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Due.is_recurring)
    - [`` lang](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Due.lang)
    - [`` string](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Due.string)
    - [`` timezone](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Due.timezone)

  - [`` Duration](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Duration)

    - [`` amount](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Duration.amount)
    - [`` unit](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Duration.unit)

  - [`` Label](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Label)

    - [`` color](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Label.color)
    - [`` id](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Label.id)
    - [`` is\_favorite](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Label.is_favorite)
    - [`` name](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Label.name)
    - [`` order](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Label.order)

  - [`` Meta](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Meta)

    - [`` assignee](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Meta.assignee)
    - [`` deadline](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Meta.deadline)
    - [`` due](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Meta.due)
    - [`` labels](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Meta.labels)
    - [`` project](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Meta.project)
    - [`` section](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Meta.section)

  - [`` Project](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Project)

    - [`` can\_assign\_tasks](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Project.can_assign_tasks)
    - [`` color](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Project.color)
    - [`` created\_at](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Project.created_at)
    - [`` description](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Project.description)
    - [`` folder\_id](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Project.folder_id)
    - [`` id](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Project.id)
    - [`` is\_archived](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Project.is_archived)
    - [`` is\_collapsed](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Project.is_collapsed)
    - [`` is\_favorite](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Project.is_favorite)
    - [`` is\_inbox\_project](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Project.is_inbox_project)
    - [`` is\_shared](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Project.is_shared)
    - [`` name](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Project.name)
    - [`` order](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Project.order)
    - [`` parent\_id](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Project.parent_id)
    - [`` updated\_at](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Project.updated_at)
    - [`` url](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Project.url)
    - [`` view\_style](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Project.view_style)
    - [`` workspace\_id](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Project.workspace_id)

  - [`` Section](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Section)

    - [`` id](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Section.id)
    - [`` is\_collapsed](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Section.is_collapsed)
    - [`` name](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Section.name)
    - [`` order](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Section.order)
    - [`` project\_id](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Section.project_id)

  - [`` Task](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Task)

    - [`` assignee\_id](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Task.assignee_id)
    - [`` assigner\_id](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Task.assigner_id)
    - [`` completed\_at](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Task.completed_at)
    - [`` content](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Task.content)
    - [`` created\_at](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Task.created_at)
    - [`` creator\_id](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Task.creator_id)
    - [`` deadline](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Task.deadline)
    - [`` description](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Task.description)
    - [`` due](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Task.due)
    - [`` duration](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Task.duration)
    - [`` id](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Task.id)
    - [`` is\_collapsed](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Task.is_collapsed)
    - [`` is\_completed](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Task.is_completed)
    - [`` labels](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Task.labels)
    - [`` meta](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Task.meta)
    - [`` order](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Task.order)
    - [`` parent\_id](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Task.parent_id)
    - [`` priority](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Task.priority)
    - [`` project\_id](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Task.project_id)
    - [`` section\_id](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Task.section_id)
    - [`` updated\_at](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Task.updated_at)
    - [`` url](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Task.url)

- [Changelog](https://doist.github.io/todoist-api-python/changelog/)

Table of contents


- [`` models](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models)
- [`` ApiDate](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.ApiDate)
- [`` ApiDue](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.ApiDue)
- [`` DurationUnit](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.DurationUnit)
- [`` ViewStyle](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.ViewStyle)
- [`` Attachment](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Attachment)

  - [`` file\_duration](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Attachment.file_duration)
  - [`` file\_name](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Attachment.file_name)
  - [`` file\_size](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Attachment.file_size)
  - [`` file\_type](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Attachment.file_type)
  - [`` file\_url](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Attachment.file_url)
  - [`` image](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Attachment.image)
  - [`` image\_height](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Attachment.image_height)
  - [`` image\_width](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Attachment.image_width)
  - [`` resource\_type](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Attachment.resource_type)
  - [`` title](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Attachment.title)
  - [`` upload\_state](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Attachment.upload_state)
  - [`` url](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Attachment.url)

- [`` AuthResult](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.AuthResult)

  - [`` access\_token](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.AuthResult.access_token)
  - [`` state](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.AuthResult.state)

- [`` Collaborator](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Collaborator)

  - [`` email](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Collaborator.email)
  - [`` id](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Collaborator.id)
  - [`` name](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Collaborator.name)

- [`` Comment](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Comment)

  - [`` attachment](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Comment.attachment)
  - [`` content](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Comment.content)
  - [`` id](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Comment.id)
  - [`` posted\_at](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Comment.posted_at)
  - [`` poster\_id](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Comment.poster_id)
  - [`` project\_id](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Comment.project_id)
  - [`` task\_id](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Comment.task_id)

- [`` Deadline](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Deadline)

  - [`` date](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Deadline.date)
  - [`` lang](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Deadline.lang)

- [`` Due](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Due)

  - [`` date](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Due.date)
  - [`` is\_recurring](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Due.is_recurring)
  - [`` lang](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Due.lang)
  - [`` string](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Due.string)
  - [`` timezone](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Due.timezone)

- [`` Duration](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Duration)

  - [`` amount](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Duration.amount)
  - [`` unit](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Duration.unit)

- [`` Label](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Label)

  - [`` color](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Label.color)
  - [`` id](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Label.id)
  - [`` is\_favorite](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Label.is_favorite)
  - [`` name](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Label.name)
  - [`` order](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Label.order)

- [`` Meta](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Meta)

  - [`` assignee](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Meta.assignee)
  - [`` deadline](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Meta.deadline)
  - [`` due](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Meta.due)
  - [`` labels](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Meta.labels)
  - [`` project](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Meta.project)
  - [`` section](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Meta.section)

- [`` Project](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Project)

  - [`` can\_assign\_tasks](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Project.can_assign_tasks)
  - [`` color](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Project.color)
  - [`` created\_at](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Project.created_at)
  - [`` description](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Project.description)
  - [`` folder\_id](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Project.folder_id)
  - [`` id](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Project.id)
  - [`` is\_archived](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Project.is_archived)
  - [`` is\_collapsed](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Project.is_collapsed)
  - [`` is\_favorite](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Project.is_favorite)
  - [`` is\_inbox\_project](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Project.is_inbox_project)
  - [`` is\_shared](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Project.is_shared)
  - [`` name](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Project.name)
  - [`` order](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Project.order)
  - [`` parent\_id](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Project.parent_id)
  - [`` updated\_at](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Project.updated_at)
  - [`` url](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Project.url)
  - [`` view\_style](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Project.view_style)
  - [`` workspace\_id](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Project.workspace_id)

- [`` Section](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Section)

  - [`` id](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Section.id)
  - [`` is\_collapsed](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Section.is_collapsed)
  - [`` name](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Section.name)
  - [`` order](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Section.order)
  - [`` project\_id](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Section.project_id)

- [`` Task](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Task)

  - [`` assignee\_id](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Task.assignee_id)
  - [`` assigner\_id](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Task.assigner_id)
  - [`` completed\_at](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Task.completed_at)
  - [`` content](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Task.content)
  - [`` created\_at](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Task.created_at)
  - [`` creator\_id](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Task.creator_id)
  - [`` deadline](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Task.deadline)
  - [`` description](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Task.description)
  - [`` due](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Task.due)
  - [`` duration](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Task.duration)
  - [`` id](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Task.id)
  - [`` is\_collapsed](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Task.is_collapsed)
  - [`` is\_completed](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Task.is_completed)
  - [`` labels](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Task.labels)
  - [`` meta](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Task.meta)
  - [`` order](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Task.order)
  - [`` parent\_id](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Task.parent_id)
  - [`` priority](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Task.priority)
  - [`` project\_id](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Task.project_id)
  - [`` section\_id](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Task.section_id)
  - [`` updated\_at](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Task.updated_at)
  - [`` url](https://doist.github.io/todoist-api-python/models/#todoist_api_python.models.Task.url)

# Models

## `ApiDate = UTCDateTimePattern['%FT%T.%fZ']`

## `ApiDue = Union[DatePattern['%F'], DateTimePattern['%FT%T'], UTCDateTimePattern['%FT%TZ']]`

## `DurationUnit = Literal['minute', 'day']`

## `ViewStyle = Literal['list', 'board', 'calendar']`

## `Attachment`

Bases: `JSONPyWizard`

Source code in `todoist_api_python/models.py`

|     |     |
| --- | --- |
| ```<br>146<br>147<br>148<br>149<br>150<br>151<br>152<br>153<br>154<br>155<br>156<br>157<br>158<br>159<br>160<br>161<br>162<br>163<br>164<br>165<br>``` | ```<br>@dataclass<br>class Attachment(JSONPyWizard):<br>    class _(JSONPyWizard.Meta):  # noqa:N801<br>        v1 = True<br>    resource_type: str | None = None<br>    file_name: str | None = None<br>    file_size: int | None = None<br>    file_type: str | None = None<br>    file_url: str | None = None<br>    file_duration: int | None = None<br>    upload_state: str | None = None<br>    image: str | None = None<br>    image_width: int | None = None<br>    image_height: int | None = None<br>    url: str | None = None<br>    title: str | None = None<br>``` |

### `file_duration = None`

### `file_name = None`

### `file_size = None`

### `file_type = None`

### `file_url = None`

### `image = None`

### `image_height = None`

### `image_width = None`

### `resource_type = None`

### `title = None`

### `upload_state = None`

### `url = None`

## `AuthResult`

Bases: `JSONPyWizard`

Source code in `todoist_api_python/models.py`

|     |     |
| --- | --- |
| ```<br>205<br>206<br>207<br>208<br>209<br>210<br>211<br>``` | ```<br>@dataclass<br>class AuthResult(JSONPyWizard):<br>    class _(JSONPyWizard.Meta):  # noqa:N801<br>        v1 = True<br>    access_token: str<br>    state: str | None<br>``` |

### `access_token`

### `state`

## `Collaborator`

Bases: `JSONPyWizard`

Source code in `todoist_api_python/models.py`

|     |     |
| --- | --- |
| ```<br>136<br>137<br>138<br>139<br>140<br>141<br>142<br>143<br>``` | ```<br>@dataclass<br>class Collaborator(JSONPyWizard):<br>    class _(JSONPyWizard.Meta):  # noqa:N801<br>        v1 = True<br>    id: str<br>    email: str<br>    name: str<br>``` |

### `email`

### `id`

### `name`

## `Comment`

Bases: `JSONPyWizard`

Source code in `todoist_api_python/models.py`

|     |     |
| --- | --- |
| ```<br>168<br>169<br>170<br>171<br>172<br>173<br>174<br>175<br>176<br>177<br>178<br>179<br>180<br>181<br>182<br>183<br>184<br>185<br>186<br>187<br>188<br>189<br>190<br>``` | ```<br>@dataclass<br>class Comment(JSONPyWizard):<br>    class _(JSONPyWizard.Meta):  # noqa:N801<br>        v1 = True<br>    id: str<br>    content: str<br>    poster_id: Annotated[str, Alias(load=("posted_uid", "poster_id"))]<br>    posted_at: ApiDate<br>    task_id: Annotated[str | None, Alias(load=("item_id", "task_id"))] = None<br>    project_id: str | None = None<br>    attachment: Annotated[<br>        Attachment | None, Alias(load=("file_attachment", "attachment"))<br>    ] = None<br>    def __post_init__(self) -> None:<br>        """<br>        Finish initialization of the Comment object.<br>        :raises ValueError: If neither `task_id` nor `project_id` is specified.<br>        """<br>        if self.task_id is None and self.project_id is None:<br>            raise ValueError("Must specify `task_id` or `project_id`")<br>``` |

### `attachment = None`

### `content`

### `id`

### `posted_at`

### `poster_id`

### `project_id = None`

### `task_id = None`

## `Deadline`

Bases: `JSONPyWizard`

Source code in `todoist_api_python/models.py`

|     |     |
| --- | --- |
| ```<br>78<br>79<br>80<br>81<br>82<br>83<br>84<br>``` | ```<br>@dataclass<br>class Deadline(JSONPyWizard):<br>    class _(JSONPyWizard.Meta):  # noqa:N801<br>        v1 = True<br>    date: ApiDue<br>    lang: str = "en"<br>``` |

### `date`

### `lang = 'en'`

## `Due`

Bases: `JSONPyWizard`

Source code in `todoist_api_python/models.py`

|     |     |
| --- | --- |
| ```<br>66<br>67<br>68<br>69<br>70<br>71<br>72<br>73<br>74<br>75<br>``` | ```<br>@dataclass<br>class Due(JSONPyWizard):<br>    class _(JSONPyWizard.Meta):  # noqa:N801<br>        v1 = True<br>    date: ApiDue<br>    string: str<br>    lang: str = "en"<br>    is_recurring: bool = False<br>    timezone: str | None = None<br>``` |

### `date`

### `is_recurring = False`

### `lang = 'en'`

### `string`

### `timezone = None`

## `Duration`

Bases: `JSONPyWizard`

Source code in `todoist_api_python/models.py`

|     |     |
| --- | --- |
| ```<br>214<br>215<br>216<br>217<br>218<br>219<br>220<br>``` | ```<br>@dataclass<br>class Duration(JSONPyWizard):<br>    class _(JSONPyWizard.Meta):  # noqa:N801<br>        v1 = True<br>    amount: int<br>    unit: DurationUnit<br>``` |

### `amount`

### `unit`

## `Label`

Bases: `JSONPyWizard`

Source code in `todoist_api_python/models.py`

|     |     |
| --- | --- |
| ```<br>193<br>194<br>195<br>196<br>197<br>198<br>199<br>200<br>201<br>202<br>``` | ```<br>@dataclass<br>class Label(JSONPyWizard):<br>    class _(JSONPyWizard.Meta):  # noqa:N801<br>        v1 = True<br>    id: str<br>    name: str<br>    color: str<br>    order: int<br>    is_favorite: bool<br>``` |

### `color`

### `id`

### `is_favorite`

### `name`

### `order`

## `Meta`

Bases: `JSONPyWizard`

Source code in `todoist_api_python/models.py`

|     |     |
| --- | --- |
| ```<br>87<br>88<br>89<br>90<br>91<br>92<br>93<br>94<br>95<br>96<br>97<br>``` | ```<br>@dataclass<br>class Meta(JSONPyWizard):<br>    class _(JSONPyWizard.Meta):  # noqa:N801<br>        v1 = True<br>    project: tuple[str | None, str | None]<br>    section: tuple[str | None, str | None]<br>    assignee: tuple[str | None, str | None]<br>    labels: dict[int, str]<br>    due: Due | None<br>    deadline: Deadline | None<br>``` |

### `assignee`

### `deadline`

### `due`

### `labels`

### `project`

### `section`

## `Project`

Bases: `JSONPyWizard`

Source code in `todoist_api_python/models.py`

|     |     |
| --- | --- |
| ```<br>20<br>21<br>22<br>23<br>24<br>25<br>26<br>27<br>28<br>29<br>30<br>31<br>32<br>33<br>34<br>35<br>36<br>37<br>38<br>39<br>40<br>41<br>42<br>43<br>44<br>45<br>46<br>47<br>48<br>49<br>50<br>51<br>``` | ```<br>@dataclass<br>class Project(JSONPyWizard):<br>    class _(JSONPyWizard.Meta):  # noqa:N801<br>        v1 = True<br>    id: str<br>    name: str<br>    description: str<br>    order: Annotated[int, Alias(load=("child_order", "order"))]<br>    color: str<br>    is_collapsed: Annotated[bool, Alias(load=("collapsed", "is_collapsed"))]<br>    is_shared: Annotated[bool, Alias(load=("shared", "is_shared"))]<br>    is_favorite: bool<br>    is_archived: bool<br>    can_assign_tasks: bool<br>    view_style: ViewStyle<br>    created_at: ApiDate<br>    updated_at: ApiDate<br>    parent_id: str | None = None<br>    is_inbox_project: Annotated[<br>        bool | None, Alias(load=("inbox_project", "is_inbox_project"))<br>    ] = None<br>    workspace_id: str | None = None<br>    folder_id: str | None = None<br>    @property<br>    def url(self) -> str:<br>        if self.is_inbox_project:<br>            return INBOX_URL<br>        return get_project_url(self.id, self.name)<br>``` |

### `can_assign_tasks`

### `color`

### `created_at`

### `description`

### `folder_id = None`

### `id`

### `is_archived`

### `is_collapsed`

### `is_favorite`

### `is_inbox_project = None`

### `is_shared`

### `name`

### `order`

### `parent_id = None`

### `updated_at`

### `url`

### `view_style`

### `workspace_id = None`

## `Section`

Bases: `JSONPyWizard`

Source code in `todoist_api_python/models.py`

|     |     |
| --- | --- |
| ```<br>54<br>55<br>56<br>57<br>58<br>59<br>60<br>61<br>62<br>63<br>``` | ```<br>@dataclass<br>class Section(JSONPyWizard):<br>    class _(JSONPyWizard.Meta):  # noqa:N801<br>        v1 = True<br>    id: str<br>    name: str<br>    project_id: str<br>    is_collapsed: Annotated[bool, Alias(load=("collapsed", "is_collapsed"))]<br>    order: Annotated[int, Alias(load=("section_order", "order"))]<br>``` |

### `id`

### `is_collapsed`

### `name`

### `order`

### `project_id`

## `Task`

Bases: `JSONPyWizard`

Source code in `todoist_api_python/models.py`

|     |     |
| --- | --- |
| ```<br>100<br>101<br>102<br>103<br>104<br>105<br>106<br>107<br>108<br>109<br>110<br>111<br>112<br>113<br>114<br>115<br>116<br>117<br>118<br>119<br>120<br>121<br>122<br>123<br>124<br>125<br>126<br>127<br>128<br>129<br>130<br>131<br>132<br>133<br>``` | ```<br>@dataclass<br>class Task(JSONPyWizard):<br>    class _(JSONPyWizard.Meta):  # noqa:N801<br>        v1 = True<br>    id: str<br>    content: str<br>    description: str<br>    project_id: str<br>    section_id: str | None<br>    parent_id: str | None<br>    labels: list[str] | None<br>    priority: int<br>    due: Due | None<br>    deadline: Deadline | None<br>    duration: Duration | None<br>    is_collapsed: Annotated[bool, Alias(load=("collapsed", "is_collapsed"))]<br>    order: Annotated[int, Alias(load=("child_order", "order"))]<br>    assignee_id: Annotated[str | None, Alias(load=("responsible_uid", "assignee_id"))]<br>    assigner_id: Annotated[str | None, Alias(load=("assigned_by_uid", "assigner_id"))]<br>    completed_at: Optional[ApiDate]  # noqa: UP007 # https://github.com/rnag/dataclass-wizard/issues/189<br>    creator_id: Annotated[str, Alias(load=("added_by_uid", "creator_id"))]<br>    created_at: Annotated[ApiDate, Alias(load=("added_at", "created_at"))]<br>    updated_at: ApiDate<br>    meta: Meta | None = None<br>    @property<br>    def url(self) -> str:<br>        return get_task_url(self.id, self.content)<br>    @property<br>    def is_completed(self) -> bool:<br>        return self.completed_at is not None<br>``` |

### `assignee_id`

### `assigner_id`

### `completed_at`

### `content`

### `created_at`

### `creator_id`

### `deadline`

### `description`

### `due`

### `duration`

### `id`

### `is_collapsed`

### `is_completed`

### `labels`

### `meta = None`

### `order`

### `parent_id`

### `priority`

### `project_id`

### `section_id`

### `updated_at`

### `url`

[Previous\\
\\
\\
API Client (async)](https://doist.github.io/todoist-api-python/api_async/) [Next\\
\\
\\
Changelog](https://doist.github.io/todoist-api-python/changelog/)



Made with
[Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)

[x.com](https://x.com/doistdevs "x.com")[github.com](https://github.com/doist "github.com")

Title: Models - Todoist Python SDK
