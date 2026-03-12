Scraping: https://doist.github.io/todoist-api-python/api_async/
[Skip to content](https://doist.github.io/todoist-api-python/api_async/#api-client-async)

[![logo](https://doist.github.io/todoist-api-python/assets/logo.svg)](https://doist.github.io/todoist-api-python/ "Todoist Python SDK")

Todoist Python SDK



API Client (async)



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
- [ ]
API Client (async)

[API Client (async)](https://doist.github.io/todoist-api-python/api_async/)
Table of contents


  - [`` TodoistAPIAsync](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync)
  - [`` add\_comment](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.add_comment)
  - [`` add\_label](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.add_label)
  - [`` add\_project](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.add_project)
  - [`` add\_section](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.add_section)
  - [`` add\_task](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.add_task)
  - [`` add\_task\_quick](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.add_task_quick)
  - [`` archive\_project](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.archive_project)
  - [`` close](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.close)
  - [`` complete\_task](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.complete_task)
  - [`` delete\_comment](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.delete_comment)
  - [`` delete\_label](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.delete_label)
  - [`` delete\_project](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.delete_project)
  - [`` delete\_section](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.delete_section)
  - [`` delete\_task](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.delete_task)
  - [`` filter\_tasks](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.filter_tasks)
  - [`` get\_collaborators](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.get_collaborators)
  - [`` get\_comment](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.get_comment)
  - [`` get\_comments](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.get_comments)
  - [`` get\_completed\_tasks\_by\_completion\_date](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.get_completed_tasks_by_completion_date)
  - [`` get\_completed\_tasks\_by\_due\_date](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.get_completed_tasks_by_due_date)
  - [`` get\_label](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.get_label)
  - [`` get\_labels](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.get_labels)
  - [`` get\_project](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.get_project)
  - [`` get\_projects](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.get_projects)
  - [`` get\_section](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.get_section)
  - [`` get\_sections](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.get_sections)
  - [`` get\_shared\_labels](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.get_shared_labels)
  - [`` get\_task](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.get_task)
  - [`` get\_tasks](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.get_tasks)
  - [`` move\_task](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.move_task)
  - [`` remove\_shared\_label](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.remove_shared_label)
  - [`` rename\_shared\_label](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.rename_shared_label)
  - [`` search\_labels](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.search_labels)
  - [`` search\_projects](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.search_projects)
  - [`` search\_sections](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.search_sections)
  - [`` unarchive\_project](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.unarchive_project)
  - [`` uncomplete\_task](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.uncomplete_task)
  - [`` update\_comment](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.update_comment)
  - [`` update\_label](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.update_label)
  - [`` update\_project](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.update_project)
  - [`` update\_section](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.update_section)
  - [`` update\_task](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.update_task)

- [Models](https://doist.github.io/todoist-api-python/models/)
- [Changelog](https://doist.github.io/todoist-api-python/changelog/)

Table of contents


- [`` TodoistAPIAsync](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync)
- [`` add\_comment](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.add_comment)
- [`` add\_label](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.add_label)
- [`` add\_project](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.add_project)
- [`` add\_section](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.add_section)
- [`` add\_task](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.add_task)
- [`` add\_task\_quick](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.add_task_quick)
- [`` archive\_project](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.archive_project)
- [`` close](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.close)
- [`` complete\_task](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.complete_task)
- [`` delete\_comment](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.delete_comment)
- [`` delete\_label](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.delete_label)
- [`` delete\_project](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.delete_project)
- [`` delete\_section](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.delete_section)
- [`` delete\_task](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.delete_task)
- [`` filter\_tasks](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.filter_tasks)
- [`` get\_collaborators](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.get_collaborators)
- [`` get\_comment](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.get_comment)
- [`` get\_comments](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.get_comments)
- [`` get\_completed\_tasks\_by\_completion\_date](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.get_completed_tasks_by_completion_date)
- [`` get\_completed\_tasks\_by\_due\_date](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.get_completed_tasks_by_due_date)
- [`` get\_label](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.get_label)
- [`` get\_labels](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.get_labels)
- [`` get\_project](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.get_project)
- [`` get\_projects](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.get_projects)
- [`` get\_section](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.get_section)
- [`` get\_sections](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.get_sections)
- [`` get\_shared\_labels](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.get_shared_labels)
- [`` get\_task](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.get_task)
- [`` get\_tasks](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.get_tasks)
- [`` move\_task](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.move_task)
- [`` remove\_shared\_label](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.remove_shared_label)
- [`` rename\_shared\_label](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.rename_shared_label)
- [`` search\_labels](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.search_labels)
- [`` search\_projects](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.search_projects)
- [`` search\_sections](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.search_sections)
- [`` unarchive\_project](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.unarchive_project)
- [`` uncomplete\_task](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.uncomplete_task)
- [`` update\_comment](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.update_comment)
- [`` update\_label](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.update_label)
- [`` update\_project](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.update_project)
- [`` update\_section](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.update_section)
- [`` update\_task](https://doist.github.io/todoist-api-python/api_async/#todoist_api_python.api_async.TodoistAPIAsync.update_task)

# API Client (async)

Async client for the Todoist API.

Provides asynchronous methods for interacting with Todoist resources like
tasks, projects, labels, comments, etc.

Manages an HTTP client and handles authentication.

Prefer using this class as an async context manager to ensure the underlying
`httpx.AsyncClient` is always closed. If you do not use `async with`, call
`await close()` explicitly.

Source code in `todoist_api_python/api_async.py`

|     |     |
| --- | --- |
| ```<br>  66<br>  67<br>  68<br>  69<br>  70<br>  71<br>  72<br>  73<br>  74<br>  75<br>  76<br>  77<br>  78<br>  79<br>  80<br>  81<br>  82<br>  83<br>  84<br>  85<br>  86<br>  87<br>  88<br>  89<br>  90<br>  91<br>  92<br>  93<br>  94<br>  95<br>  96<br>  97<br>  98<br>  99<br> 100<br> 101<br> 102<br> 103<br> 104<br> 105<br> 106<br> 107<br> 108<br> 109<br> 110<br> 111<br> 112<br> 113<br> 114<br> 115<br> 116<br> 117<br> 118<br> 119<br> 120<br> 121<br> 122<br> 123<br> 124<br> 125<br> 126<br> 127<br> 128<br> 129<br> 130<br> 131<br> 132<br> 133<br> 134<br> 135<br> 136<br> 137<br> 138<br> 139<br> 140<br> 141<br> 142<br> 143<br> 144<br> 145<br> 146<br> 147<br> 148<br> 149<br> 150<br> 151<br> 152<br> 153<br> 154<br> 155<br> 156<br> 157<br> 158<br> 159<br> 160<br> 161<br> 162<br> 163<br> 164<br> 165<br> 166<br> 167<br> 168<br> 169<br> 170<br> 171<br> 172<br> 173<br> 174<br> 175<br> 176<br> 177<br> 178<br> 179<br> 180<br> 181<br> 182<br> 183<br> 184<br> 185<br> 186<br> 187<br> 188<br> 189<br> 190<br> 191<br> 192<br> 193<br> 194<br> 195<br> 196<br> 197<br> 198<br> 199<br> 200<br> 201<br> 202<br> 203<br> 204<br> 205<br> 206<br> 207<br> 208<br> 209<br> 210<br> 211<br> 212<br> 213<br> 214<br> 215<br> 216<br> 217<br> 218<br> 219<br> 220<br> 221<br> 222<br> 223<br> 224<br> 225<br> 226<br> 227<br> 228<br> 229<br> 230<br> 231<br> 232<br> 233<br> 234<br> 235<br> 236<br> 237<br> 238<br> 239<br> 240<br> 241<br> 242<br> 243<br> 244<br> 245<br> 246<br> 247<br> 248<br> 249<br> 250<br> 251<br> 252<br> 253<br> 254<br> 255<br> 256<br> 257<br> 258<br> 259<br> 260<br> 261<br> 262<br> 263<br> 264<br> 265<br> 266<br> 267<br> 268<br> 269<br> 270<br> 271<br> 272<br> 273<br> 274<br> 275<br> 276<br> 277<br> 278<br> 279<br> 280<br> 281<br> 282<br> 283<br> 284<br> 285<br> 286<br> 287<br> 288<br> 289<br> 290<br> 291<br> 292<br> 293<br> 294<br> 295<br> 296<br> 297<br> 298<br> 299<br> 300<br> 301<br> 302<br> 303<br> 304<br> 305<br> 306<br> 307<br> 308<br> 309<br> 310<br> 311<br> 312<br> 313<br> 314<br> 315<br> 316<br> 317<br> 318<br> 319<br> 320<br> 321<br> 322<br> 323<br> 324<br> 325<br> 326<br> 327<br> 328<br> 329<br> 330<br> 331<br> 332<br> 333<br> 334<br> 335<br> 336<br> 337<br> 338<br> 339<br> 340<br> 341<br> 342<br> 343<br> 344<br> 345<br> 346<br> 347<br> 348<br> 349<br> 350<br> 351<br> 352<br> 353<br> 354<br> 355<br> 356<br> 357<br> 358<br> 359<br> 360<br> 361<br> 362<br> 363<br> 364<br> 365<br> 366<br> 367<br> 368<br> 369<br> 370<br> 371<br> 372<br> 373<br> 374<br> 375<br> 376<br> 377<br> 378<br> 379<br> 380<br> 381<br> 382<br> 383<br> 384<br> 385<br> 386<br> 387<br> 388<br> 389<br> 390<br> 391<br> 392<br> 393<br> 394<br> 395<br> 396<br> 397<br> 398<br> 399<br> 400<br> 401<br> 402<br> 403<br> 404<br> 405<br> 406<br> 407<br> 408<br> 409<br> 410<br> 411<br> 412<br> 413<br> 414<br> 415<br> 416<br> 417<br> 418<br> 419<br> 420<br> 421<br> 422<br> 423<br> 424<br> 425<br> 426<br> 427<br> 428<br> 429<br> 430<br> 431<br> 432<br> 433<br> 434<br> 435<br> 436<br> 437<br> 438<br> 439<br> 440<br> 441<br> 442<br> 443<br> 444<br> 445<br> 446<br> 447<br> 448<br> 449<br> 450<br> 451<br> 452<br> 453<br> 454<br> 455<br> 456<br> 457<br> 458<br> 459<br> 460<br> 461<br> 462<br> 463<br> 464<br> 465<br> 466<br> 467<br> 468<br> 469<br> 470<br> 471<br> 472<br> 473<br> 474<br> 475<br> 476<br> 477<br> 478<br> 479<br> 480<br> 481<br> 482<br> 483<br> 484<br> 485<br> 486<br> 487<br> 488<br> 489<br> 490<br> 491<br> 492<br> 493<br> 494<br> 495<br> 496<br> 497<br> 498<br> 499<br> 500<br> 501<br> 502<br> 503<br> 504<br> 505<br> 506<br> 507<br> 508<br> 509<br> 510<br> 511<br> 512<br> 513<br> 514<br> 515<br> 516<br> 517<br> 518<br> 519<br> 520<br> 521<br> 522<br> 523<br> 524<br> 525<br> 526<br> 527<br> 528<br> 529<br> 530<br> 531<br> 532<br> 533<br> 534<br> 535<br> 536<br> 537<br> 538<br> 539<br> 540<br> 541<br> 542<br> 543<br> 544<br> 545<br> 546<br> 547<br> 548<br> 549<br> 550<br> 551<br> 552<br> 553<br> 554<br> 555<br> 556<br> 557<br> 558<br> 559<br> 560<br> 561<br> 562<br> 563<br> 564<br> 565<br> 566<br> 567<br> 568<br> 569<br> 570<br> 571<br> 572<br> 573<br> 574<br> 575<br> 576<br> 577<br> 578<br> 579<br> 580<br> 581<br> 582<br> 583<br> 584<br> 585<br> 586<br> 587<br> 588<br> 589<br> 590<br> 591<br> 592<br> 593<br> 594<br> 595<br> 596<br> 597<br> 598<br> 599<br> 600<br> 601<br> 602<br> 603<br> 604<br> 605<br> 606<br> 607<br> 608<br> 609<br> 610<br> 611<br> 612<br> 613<br> 614<br> 615<br> 616<br> 617<br> 618<br> 619<br> 620<br> 621<br> 622<br> 623<br> 624<br> 625<br> 626<br> 627<br> 628<br> 629<br> 630<br> 631<br> 632<br> 633<br> 634<br> 635<br> 636<br> 637<br> 638<br> 639<br> 640<br> 641<br> 642<br> 643<br> 644<br> 645<br> 646<br> 647<br> 648<br> 649<br> 650<br> 651<br> 652<br> 653<br> 654<br> 655<br> 656<br> 657<br> 658<br> 659<br> 660<br> 661<br> 662<br> 663<br> 664<br> 665<br> 666<br> 667<br> 668<br> 669<br> 670<br> 671<br> 672<br> 673<br> 674<br> 675<br> 676<br> 677<br> 678<br> 679<br> 680<br> 681<br> 682<br> 683<br> 684<br> 685<br> 686<br> 687<br> 688<br> 689<br> 690<br> 691<br> 692<br> 693<br> 694<br> 695<br> 696<br> 697<br> 698<br> 699<br> 700<br> 701<br> 702<br> 703<br> 704<br> 705<br> 706<br> 707<br> 708<br> 709<br> 710<br> 711<br> 712<br> 713<br> 714<br> 715<br> 716<br> 717<br> 718<br> 719<br> 720<br> 721<br> 722<br> 723<br> 724<br> 725<br> 726<br> 727<br> 728<br> 729<br> 730<br> 731<br> 732<br> 733<br> 734<br> 735<br> 736<br> 737<br> 738<br> 739<br> 740<br> 741<br> 742<br> 743<br> 744<br> 745<br> 746<br> 747<br> 748<br> 749<br> 750<br> 751<br> 752<br> 753<br> 754<br> 755<br> 756<br> 757<br> 758<br> 759<br> 760<br> 761<br> 762<br> 763<br> 764<br> 765<br> 766<br> 767<br> 768<br> 769<br> 770<br> 771<br> 772<br> 773<br> 774<br> 775<br> 776<br> 777<br> 778<br> 779<br> 780<br> 781<br> 782<br> 783<br> 784<br> 785<br> 786<br> 787<br> 788<br> 789<br> 790<br> 791<br> 792<br> 793<br> 794<br> 795<br> 796<br> 797<br> 798<br> 799<br> 800<br> 801<br> 802<br> 803<br> 804<br> 805<br> 806<br> 807<br> 808<br> 809<br> 810<br> 811<br> 812<br> 813<br> 814<br> 815<br> 816<br> 817<br> 818<br> 819<br> 820<br> 821<br> 822<br> 823<br> 824<br> 825<br> 826<br> 827<br> 828<br> 829<br> 830<br> 831<br> 832<br> 833<br> 834<br> 835<br> 836<br> 837<br> 838<br> 839<br> 840<br> 841<br> 842<br> 843<br> 844<br> 845<br> 846<br> 847<br> 848<br> 849<br> 850<br> 851<br> 852<br> 853<br> 854<br> 855<br> 856<br> 857<br> 858<br> 859<br> 860<br> 861<br> 862<br> 863<br> 864<br> 865<br> 866<br> 867<br> 868<br> 869<br> 870<br> 871<br> 872<br> 873<br> 874<br> 875<br> 876<br> 877<br> 878<br> 879<br> 880<br> 881<br> 882<br> 883<br> 884<br> 885<br> 886<br> 887<br> 888<br> 889<br> 890<br> 891<br> 892<br> 893<br> 894<br> 895<br> 896<br> 897<br> 898<br> 899<br> 900<br> 901<br> 902<br> 903<br> 904<br> 905<br> 906<br> 907<br> 908<br> 909<br> 910<br> 911<br> 912<br> 913<br> 914<br> 915<br> 916<br> 917<br> 918<br> 919<br> 920<br> 921<br> 922<br> 923<br> 924<br> 925<br> 926<br> 927<br> 928<br> 929<br> 930<br> 931<br> 932<br> 933<br> 934<br> 935<br> 936<br> 937<br> 938<br> 939<br> 940<br> 941<br> 942<br> 943<br> 944<br> 945<br> 946<br> 947<br> 948<br> 949<br> 950<br> 951<br> 952<br> 953<br> 954<br> 955<br> 956<br> 957<br> 958<br> 959<br> 960<br> 961<br> 962<br> 963<br> 964<br> 965<br> 966<br> 967<br> 968<br> 969<br> 970<br> 971<br> 972<br> 973<br> 974<br> 975<br> 976<br> 977<br> 978<br> 979<br> 980<br> 981<br> 982<br> 983<br> 984<br> 985<br> 986<br> 987<br> 988<br> 989<br> 990<br> 991<br> 992<br> 993<br> 994<br> 995<br> 996<br> 997<br> 998<br> 999<br>1000<br>1001<br>1002<br>1003<br>1004<br>1005<br>1006<br>1007<br>1008<br>1009<br>1010<br>1011<br>1012<br>1013<br>1014<br>1015<br>1016<br>1017<br>1018<br>1019<br>1020<br>1021<br>1022<br>1023<br>1024<br>1025<br>1026<br>1027<br>1028<br>1029<br>1030<br>1031<br>1032<br>1033<br>1034<br>1035<br>1036<br>1037<br>1038<br>1039<br>1040<br>1041<br>1042<br>1043<br>1044<br>1045<br>1046<br>1047<br>1048<br>1049<br>1050<br>1051<br>1052<br>1053<br>1054<br>1055<br>1056<br>1057<br>1058<br>1059<br>1060<br>1061<br>1062<br>1063<br>1064<br>1065<br>1066<br>1067<br>1068<br>1069<br>1070<br>1071<br>1072<br>1073<br>1074<br>1075<br>1076<br>1077<br>1078<br>1079<br>1080<br>1081<br>1082<br>1083<br>1084<br>1085<br>1086<br>1087<br>1088<br>1089<br>1090<br>1091<br>1092<br>1093<br>1094<br>1095<br>1096<br>1097<br>1098<br>1099<br>1100<br>1101<br>1102<br>1103<br>1104<br>1105<br>1106<br>1107<br>1108<br>1109<br>1110<br>1111<br>1112<br>1113<br>1114<br>1115<br>1116<br>1117<br>1118<br>1119<br>1120<br>1121<br>1122<br>1123<br>1124<br>1125<br>1126<br>1127<br>1128<br>1129<br>1130<br>1131<br>1132<br>1133<br>1134<br>1135<br>1136<br>1137<br>1138<br>1139<br>1140<br>1141<br>1142<br>1143<br>1144<br>1145<br>1146<br>1147<br>1148<br>1149<br>1150<br>1151<br>1152<br>1153<br>1154<br>1155<br>1156<br>1157<br>1158<br>1159<br>1160<br>1161<br>1162<br>1163<br>1164<br>1165<br>1166<br>1167<br>1168<br>1169<br>1170<br>1171<br>1172<br>1173<br>1174<br>1175<br>1176<br>1177<br>1178<br>1179<br>1180<br>1181<br>1182<br>1183<br>1184<br>1185<br>1186<br>1187<br>1188<br>1189<br>1190<br>1191<br>1192<br>1193<br>1194<br>1195<br>1196<br>1197<br>1198<br>1199<br>1200<br>1201<br>1202<br>1203<br>1204<br>1205<br>1206<br>1207<br>1208<br>1209<br>1210<br>1211<br>1212<br>1213<br>1214<br>1215<br>1216<br>1217<br>1218<br>1219<br>1220<br>1221<br>1222<br>1223<br>1224<br>1225<br>1226<br>1227<br>1228<br>1229<br>1230<br>1231<br>1232<br>1233<br>1234<br>1235<br>1236<br>1237<br>1238<br>1239<br>1240<br>1241<br>1242<br>1243<br>1244<br>1245<br>1246<br>1247<br>1248<br>1249<br>1250<br>1251<br>1252<br>1253<br>1254<br>1255<br>1256<br>1257<br>1258<br>1259<br>1260<br>1261<br>1262<br>1263<br>1264<br>1265<br>1266<br>1267<br>1268<br>1269<br>1270<br>1271<br>1272<br>1273<br>1274<br>1275<br>1276<br>1277<br>1278<br>1279<br>1280<br>1281<br>1282<br>1283<br>1284<br>1285<br>1286<br>1287<br>1288<br>1289<br>1290<br>1291<br>1292<br>1293<br>1294<br>1295<br>1296<br>1297<br>1298<br>1299<br>1300<br>1301<br>1302<br>1303<br>1304<br>1305<br>1306<br>1307<br>1308<br>1309<br>1310<br>1311<br>1312<br>1313<br>1314<br>1315<br>1316<br>1317<br>1318<br>1319<br>1320<br>1321<br>1322<br>1323<br>1324<br>1325<br>1326<br>1327<br>1328<br>1329<br>1330<br>1331<br>1332<br>1333<br>1334<br>1335<br>1336<br>1337<br>1338<br>1339<br>1340<br>1341<br>1342<br>1343<br>1344<br>1345<br>1346<br>1347<br>1348<br>1349<br>1350<br>1351<br>1352<br>1353<br>1354<br>1355<br>1356<br>1357<br>1358<br>1359<br>1360<br>1361<br>1362<br>1363<br>1364<br>1365<br>1366<br>1367<br>1368<br>1369<br>1370<br>1371<br>1372<br>1373<br>1374<br>1375<br>1376<br>1377<br>1378<br>1379<br>1380<br>1381<br>1382<br>1383<br>1384<br>1385<br>1386<br>1387<br>1388<br>1389<br>1390<br>1391<br>1392<br>1393<br>1394<br>1395<br>1396<br>1397<br>1398<br>1399<br>1400<br>1401<br>1402<br>1403<br>1404<br>1405<br>1406<br>1407<br>1408<br>1409<br>1410<br>1411<br>1412<br>1413<br>1414<br>1415<br>1416<br>1417<br>1418<br>1419<br>1420<br>1421<br>1422<br>1423<br>1424<br>1425<br>1426<br>1427<br>1428<br>1429<br>1430<br>1431<br>1432<br>1433<br>1434<br>1435<br>1436<br>1437<br>1438<br>1439<br>1440<br>1441<br>1442<br>1443<br>1444<br>1445<br>1446<br>1447<br>1448<br>1449<br>1450<br>1451<br>1452<br>1453<br>1454<br>1455<br>1456<br>1457<br>1458<br>1459<br>1460<br>1461<br>1462<br>1463<br>1464<br>1465<br>1466<br>1467<br>1468<br>1469<br>1470<br>1471<br>1472<br>1473<br>1474<br>1475<br>1476<br>1477<br>1478<br>1479<br>1480<br>1481<br>1482<br>1483<br>1484<br>1485<br>1486<br>1487<br>1488<br>1489<br>1490<br>1491<br>1492<br>1493<br>1494<br>1495<br>1496<br>1497<br>1498<br>1499<br>1500<br>1501<br>1502<br>1503<br>1504<br>1505<br>1506<br>1507<br>1508<br>1509<br>1510<br>1511<br>``` | ```<br>class TodoistAPIAsync:<br>    """<br>    Async client for the Todoist API.<br>    Provides asynchronous methods for interacting with Todoist resources like<br>    tasks, projects, labels, comments, etc.<br>    Manages an HTTP client and handles authentication.<br>    Prefer using this class as an async context manager to ensure the underlying<br>    `httpx.AsyncClient` is always closed. If you do not use `async with`, call<br>    `await close()` explicitly.<br>    """<br>    def __init__(<br>        self,<br>        token: str,<br>        request_id_fn: Callable[[], str] | None = default_request_id_fn,<br>        client: httpx.AsyncClient | None = None,<br>    ) -> None:<br>        """<br>        Initialize the TodoistAPIAsync client.<br>        :param token: Authentication token for the Todoist API.<br>        :param request_id_fn: Generator of request IDs for the `X-Request-ID` header.<br>        :param client: An optional pre-configured `httpx.AsyncClient` object, to be<br>            fully managed by `TodoistAPIAsync`.<br>        """<br>        self._token = token<br>        self._request_id_fn = request_id_fn<br>        self._client = client or httpx.AsyncClient()<br>    async def __aenter__(self) -> Self:<br>        """<br>        Enters the runtime context related to this object.<br>        The with statement will bind this method's return value to the target(s)<br>        specified in the as clause of the statement, if any.<br>        :return: This TodoistAPIAsync instance.<br>        """<br>        return self<br>    async def __aexit__(<br>        self,<br>        exc_type: type[BaseException] | None,<br>        exc_value: BaseException | None,<br>        traceback: TracebackType | None,<br>    ) -> None:<br>        """Exit the async runtime context and close the underlying httpx client."""<br>        await self.close()<br>    async def close(self) -> None:<br>        """Close the underlying `httpx.AsyncClient`."""<br>        await self._client.aclose()<br>    def __del__(self) -> None:<br>        """Warn when the async client was not explicitly closed."""<br>        client = getattr(self, "_client", None)<br>        if client is None or client.is_closed:<br>            return<br>        warnings.warn(<br>            "TodoistAPIAsync client was not closed. "<br>            "Use `async with TodoistAPIAsync(...)` or call `await api.close()`.",<br>            ResourceWarning,<br>            stacklevel=2,<br>        )<br>    async def get_task(self, task_id: str) -> Task:<br>        """<br>        Get a specific task by its ID.<br>        :param task_id: The ID of the task to retrieve.<br>        :return: The requested task.<br>        :raises httpx.HTTPStatusError: If the API request fails.<br>        :raises TypeError: If the API response is not a valid Task dictionary.<br>        """<br>        endpoint = get_api_url(f"{TASKS_PATH}/{task_id}")<br>        response = await get_async(<br>            self._client,<br>            endpoint,<br>            self._token,<br>            self._request_id_fn() if self._request_id_fn else None,<br>        )<br>        data = response_json_dict(response)<br>        return Task.from_dict(data)<br>    async def get_tasks(<br>        self,<br>        *,<br>        project_id: str | None = None,<br>        section_id: str | None = None,<br>        parent_id: str | None = None,<br>        label: str | None = None,<br>        ids: list[str] | None = None,<br>        limit: Annotated[int, Ge(1), Le(200)] | None = None,<br>    ) -> AsyncIterator[list[Task]]:<br>        """<br>        Get an iterable of lists of active tasks.<br>        The response is an iterable of lists of active tasks matching the criteria.<br>        Be aware that each iteration fires off a network request to the Todoist API,<br>        and may result in rate limiting or other API restrictions.<br>        :param project_id: Filter tasks by project ID.<br>        :param section_id: Filter tasks by section ID.<br>        :param parent_id: Filter tasks by parent task ID.<br>        :param label: Filter tasks by label name.<br>        :param ids: A list of the IDs of the tasks to retrieve.<br>        :param limit: Maximum number of tasks per page.<br>        :return: An iterable of lists of tasks.<br>        :raises httpx.HTTPStatusError: If the API request fails.<br>        :raises TypeError: If the API response structure is unexpected.<br>        """<br>        endpoint = get_api_url(TASKS_PATH)<br>        params = kwargs_without_none(<br>            project_id=project_id,<br>            section_id=section_id,<br>            parent_id=parent_id,<br>            label=label,<br>            ids=",".join(str(i) for i in ids) if ids is not None else None,<br>            limit=limit,<br>        )<br>        return AsyncResultsPaginator(<br>            self._client,<br>            endpoint,<br>            "results",<br>            Task.from_dict,<br>            self._token,<br>            self._request_id_fn,<br>            params,<br>        )<br>    async def filter_tasks(<br>        self,<br>        *,<br>        query: Annotated[str, MaxLen(1024)] | None = None,<br>        lang: str | None = None,<br>        limit: Annotated[int, Ge(1), Le(200)] | None = None,<br>    ) -> AsyncIterator[list[Task]]:<br>        """<br>        Get an iterable of lists of active tasks matching the filter.<br>        The response is an iterable of lists of active tasks matching the criteria.<br>        Be aware that each iteration fires off a network request to the Todoist API,<br>        and may result in rate limiting or other API restrictions.<br>        :param query: Query tasks using Todoist's filter language.<br>        :param lang: Language for task content (e.g., 'en').<br>        :param limit: Maximum number of tasks per page.<br>        :return: An iterable of lists of tasks.<br>        :raises httpx.HTTPStatusError: If the API request fails.<br>        :raises TypeError: If the API response structure is unexpected.<br>        """<br>        endpoint = get_api_url(TASKS_FILTER_PATH)<br>        params = kwargs_without_none(query=query, lang=lang, limit=limit)<br>        return AsyncResultsPaginator(<br>            self._client,<br>            endpoint,<br>            "results",<br>            Task.from_dict,<br>            self._token,<br>            self._request_id_fn,<br>            params,<br>        )<br>    async def add_task(<br>        self,<br>        content: Annotated[str, MinLen(1), MaxLen(500)],<br>        *,<br>        description: Annotated[str, MaxLen(16383)] | None = None,<br>        project_id: str | None = None,<br>        section_id: str | None = None,<br>        parent_id: str | None = None,<br>        labels: list[Annotated[str, MaxLen(100)]] | None = None,<br>        priority: Annotated[int, Ge(1), Le(4)] | None = None,<br>        due_string: Annotated[str, MaxLen(150)] | None = None,<br>        due_lang: LanguageCode | None = None,<br>        due_date: date | None = None,<br>        due_datetime: datetime | None = None,<br>        assignee_id: str | None = None,<br>        order: int | None = None,<br>        auto_reminder: bool | None = None,<br>        auto_parse_labels: bool | None = None,<br>        duration: Annotated[int, Ge(1)] | None = None,<br>        duration_unit: Literal["minute", "day"] | None = None,<br>        deadline_date: date | None = None,<br>        deadline_lang: LanguageCode | None = None,<br>    ) -> Task:<br>        """<br>        Create a new task.<br>        :param content: The text content of the task.<br>        :param project_id: The ID of the project to add the task to.<br>        :param section_id: The ID of the section to add the task to.<br>        :param parent_id: The ID of the parent task.<br>        :param labels: The task's labels (a list of names).<br>        :param priority: The priority of the task (4 for very urgent).<br>        :param due_string: The due date in natural language format.<br>        :param due_lang: Language for parsing the due date (e.g., 'en').<br>        :param due_date: The due date as a date object.<br>        :param due_datetime: The due date and time as a datetime object.<br>        :param assignee_id: User ID to whom the task is assigned.<br>        :param description: Description for the task.<br>        :param order: The order of task in the project or section.<br>        :param auto_reminder: Whether to add default reminder if date with time is set.<br>        :param auto_parse_labels: Whether to parse labels from task content.<br>        :param duration: The amount of time the task will take.<br>        :param duration_unit: The unit of time for duration.<br>        :param deadline_date: The deadline date as a date object.<br>        :param deadline_lang: Language for parsing the deadline date.<br>        :return: The newly created task.<br>        :raises httpx.HTTPStatusError: If the API request fails.<br>        :raises TypeError: If the API response is not a valid Task dictionary.<br>        """<br>        endpoint = get_api_url(TASKS_PATH)<br>        data = kwargs_without_none(<br>            content=content,<br>            description=description,<br>            project_id=project_id,<br>            section_id=section_id,<br>            parent_id=parent_id,<br>            labels=labels,<br>            priority=priority,<br>            due_string=due_string,<br>            due_lang=due_lang,<br>            due_date=format_date(due_date) if due_date is not None else None,<br>            due_datetime=(<br>                format_datetime(due_datetime) if due_datetime is not None else None<br>            ),<br>            assignee_id=assignee_id,<br>            order=order,<br>            auto_reminder=auto_reminder,<br>            auto_parse_labels=auto_parse_labels,<br>            duration=duration,<br>            duration_unit=duration_unit,<br>            deadline_date=(<br>                format_date(deadline_date) if deadline_date is not None else None<br>            ),<br>            deadline_lang=deadline_lang,<br>        )<br>        response = await post_async(<br>            self._client,<br>            endpoint,<br>            self._token,<br>            self._request_id_fn() if self._request_id_fn else None,<br>            data=data,<br>        )<br>        data = response_json_dict(response)<br>        return Task.from_dict(data)<br>    async def add_task_quick(<br>        self,<br>        text: str,<br>        *,<br>        note: str | None = None,<br>        reminder: str | None = None,<br>        auto_reminder: bool = True,<br>    ) -> Task:<br>        """<br>        Create a new task using Todoist's Quick Add syntax.<br>        This automatically parses dates, deadlines, projects, labels, priorities, etc,<br>        from the provided text (e.g., "Buy milk #Shopping @groceries tomorrow p1").<br>        :param text: The task text using Quick Add syntax.<br>        :param note: Optional note to be added to the task.<br>        :param reminder: Optional reminder date in free form text.<br>        :param auto_reminder: Whether to add default reminder if date with time is set.<br>        :return: A result object containing the parsed task data and metadata.<br>        :raises httpx.HTTPStatusError: If the API request fails.<br>        :raises TypeError: If the API response cannot be parsed into a QuickAddResult.<br>        """<br>        endpoint = get_api_url(TASKS_QUICK_ADD_PATH)<br>        data = kwargs_without_none(<br>            meta=True,<br>            text=text,<br>            auto_reminder=auto_reminder,<br>            note=note,<br>            reminder=reminder,<br>        )<br>        response = await post_async(<br>            self._client,<br>            endpoint,<br>            self._token,<br>            self._request_id_fn() if self._request_id_fn else None,<br>            data=data,<br>        )<br>        data = response_json_dict(response)<br>        return Task.from_dict(data)<br>    async def update_task(<br>        self,<br>        task_id: str,<br>        *,<br>        content: Annotated[str, MinLen(1), MaxLen(500)] | None = None,<br>        description: Annotated[str, MaxLen(16383)] | None = None,<br>        labels: list[Annotated[str, MaxLen(60)]] | None = None,<br>        priority: Annotated[int, Ge(1), Le(4)] | None = None,<br>        due_string: Annotated[str, MaxLen(150)] | None = None,<br>        due_lang: LanguageCode | None = None,<br>        due_date: date | None = None,<br>        due_datetime: datetime | None = None,<br>        assignee_id: str | None = None,<br>        order: int | None = None,<br>        day_order: int | None = None,<br>        collapsed: bool | None = None,<br>        duration: Annotated[int, Ge(1)] | None = None,<br>        duration_unit: Literal["minute", "day"] | None = None,<br>        deadline_date: date | None = None,<br>        deadline_lang: LanguageCode | None = None,<br>    ) -> Task:<br>        """<br>        Update an existing task.<br>        Only the fields to be updated need to be provided.<br>        :param task_id: The ID of the task to update.<br>        :param content: The text content of the task.<br>        :param description: Description for the task.<br>        :param labels: The task's labels (a list of names).<br>        :param priority: The priority of the task (4 for very urgent).<br>        :param due_string: The due date in natural language format.<br>        :param due_lang: Language for parsing the due date (e.g., 'en').<br>        :param due_date: The due date as a date object.<br>        :param due_datetime: The due date and time as a datetime object.<br>        :param assignee_id: User ID to whom the task is assigned.<br>        :param order: The order of task in the project or section.<br>        :param day_order: The order of the task inside Today or Next 7 days view.<br>        :param collapsed: Whether the task's sub-tasks are collapsed.<br>        :param duration: The amount of time the task will take.<br>        :param duration_unit: The unit of time for duration.<br>        :param deadline_date: The deadline date as a date object.<br>        :param deadline_lang: Language for parsing the deadline date.<br>        :return: the updated Task.<br>        :raises httpx.HTTPStatusError: If the API request fails.<br>        """<br>        endpoint = get_api_url(f"{TASKS_PATH}/{task_id}")<br>        data = kwargs_without_none(<br>            content=content,<br>            description=description,<br>            labels=labels,<br>            priority=priority,<br>            due_string=due_string,<br>            due_lang=due_lang,<br>            due_date=format_date(due_date) if due_date is not None else None,<br>            due_datetime=(<br>                format_datetime(due_datetime) if due_datetime is not None else None<br>            ),<br>            assignee_id=assignee_id,<br>            order=order,<br>            day_order=day_order,<br>            collapsed=collapsed,<br>            duration=duration,<br>            duration_unit=duration_unit,<br>            deadline_date=(<br>                format_date(deadline_date) if deadline_date is not None else None<br>            ),<br>            deadline_lang=deadline_lang,<br>        )<br>        response = await post_async(<br>            self._client,<br>            endpoint,<br>            self._token,<br>            self._request_id_fn() if self._request_id_fn else None,<br>            data=data,<br>        )<br>        data = response_json_dict(response)<br>        return Task.from_dict(data)<br>    async def complete_task(self, task_id: str) -> bool:<br>        """<br>        Complete a task.<br>        For recurring tasks, this schedules the next occurrence.<br>        For non-recurring tasks, it marks them as completed.<br>        :param task_id: The ID of the task to close.<br>        :return: True if the task was closed successfully,<br>                 False otherwise (possibly raise `HTTPError` instead).<br>        :raises httpx.HTTPStatusError: If the API request fails.<br>        """<br>        endpoint = get_api_url(f"{TASKS_PATH}/{task_id}/close")<br>        response = await post_async(<br>            self._client,<br>            endpoint,<br>            self._token,<br>            self._request_id_fn() if self._request_id_fn else None,<br>        )<br>        return response.is_success<br>    async def uncomplete_task(self, task_id: str) -> bool:<br>        """<br>        Uncomplete a (completed) task.<br>        Any parent tasks or sections will also be uncompleted.<br>        :param task_id: The ID of the task to reopen.<br>        :return: True if the task was uncompleted successfully,<br>                 False otherwise (possibly raise `HTTPError` instead).<br>        :raises httpx.HTTPStatusError: If the API request fails.<br>        """<br>        endpoint = get_api_url(f"{TASKS_PATH}/{task_id}/reopen")<br>        response = await post_async(<br>            self._client,<br>            endpoint,<br>            self._token,<br>            self._request_id_fn() if self._request_id_fn else None,<br>        )<br>        return response.is_success<br>    async def move_task(<br>        self,<br>        task_id: str,<br>        project_id: str | None = None,<br>        section_id: str | None = None,<br>        parent_id: str | None = None,<br>    ) -> bool:<br>        """<br>        Move a task to a different project, section, or parent task.<br>        `project_id` takes predence, followed by<br>        `section_id` (which also updates `project_id`),<br>        and then `parent_id` (which also updates `section_id` and `project_id`).<br>        :param task_id: The ID of the task to move.<br>        :param project_id: The ID of the project to move the task to.<br>        :param section_id: The ID of the section to move the task to.<br>        :param parent_id: The ID of the parent to move the task to.<br>        :return: True if the task was moved successfully,<br>                 False otherwise (possibly raise `HTTPError` instead).<br>        :raises httpx.HTTPStatusError: If the API request fails.<br>        :raises ValueError: If neither `project_id`, `section_id`,<br>                nor `parent_id` is provided.<br>        """<br>        if project_id is None and section_id is None and parent_id is None:<br>            raise ValueError(<br>                "Either `project_id`, `section_id`, or `parent_id` must be provided."<br>            )<br>        data = kwargs_without_none(<br>            project_id=project_id,<br>            section_id=section_id,<br>            parent_id=parent_id,<br>        )<br>        endpoint = get_api_url(f"{TASKS_PATH}/{task_id}/move")<br>        response = await post_async(<br>            self._client,<br>            endpoint,<br>            self._token,<br>            self._request_id_fn() if self._request_id_fn else None,<br>            data=data,<br>        )<br>        return response.is_success<br>    async def delete_task(self, task_id: str) -> bool:<br>        """<br>        Delete a task.<br>        :param task_id: The ID of the task to delete.<br>        :return: True if the task was deleted successfully,<br>                 False otherwise (possibly raise `HTTPError` instead).<br>        :raises httpx.HTTPStatusError: If the API request fails.<br>        """<br>        endpoint = get_api_url(f"{TASKS_PATH}/{task_id}")<br>        response = await delete_async(<br>            self._client,<br>            endpoint,<br>            self._token,<br>            self._request_id_fn() if self._request_id_fn else None,<br>        )<br>        return response.is_success<br>    async def get_completed_tasks_by_due_date(<br>        self,<br>        *,<br>        since: datetime,<br>        until: datetime,<br>        workspace_id: str | None = None,<br>        project_id: str | None = None,<br>        section_id: str | None = None,<br>        parent_id: str | None = None,<br>        filter_query: str | None = None,<br>        filter_lang: str | None = None,<br>        limit: Annotated[int, Ge(1), Le(200)] | None = None,<br>    ) -> AsyncIterator[list[Task]]:<br>        """<br>        Get an iterable of lists of completed tasks within a due date range.<br>        Retrieves tasks completed within a specific due date range (up to 6 weeks).<br>        Supports filtering by workspace, project, section, parent task, or a query.<br>        The response is an iterable of lists of completed tasks. Be aware that each<br>        iteration fires off a network request to the Todoist API, and may result in<br>        rate limiting or other API restrictions.<br>        :param since: Start of the date range (inclusive).<br>        :param until: End of the date range (inclusive).<br>        :param workspace_id: Filter by workspace ID.<br>        :param project_id: Filter by project ID.<br>        :param section_id: Filter by section ID.<br>        :param parent_id: Filter by parent task ID.<br>        :param filter_query: Filter by a query string.<br>        :param filter_lang: Language for the filter query (e.g., 'en').<br>        :param limit: Maximum number of tasks per page (default 50).<br>        :return: An iterable of lists of completed tasks.<br>        :raises httpx.HTTPStatusError: If the API request fails.<br>        :raises TypeError: If the API response structure is unexpected.<br>        """<br>        endpoint = get_api_url(TASKS_COMPLETED_BY_DUE_DATE_PATH)<br>        params = kwargs_without_none(<br>            since=format_datetime(since),<br>            until=format_datetime(until),<br>            workspace_id=workspace_id,<br>            project_id=project_id,<br>            section_id=section_id,<br>            parent_id=parent_id,<br>            filter_query=filter_query,<br>            filter_lang=filter_lang,<br>            limit=limit,<br>        )<br>        return AsyncResultsPaginator(<br>            self._client,<br>            endpoint,<br>            "items",<br>            Task.from_dict,<br>            self._token,<br>            self._request_id_fn,<br>            params,<br>        )<br>    async def get_completed_tasks_by_completion_date(<br>        self,<br>        *,<br>        since: datetime,<br>        until: datetime,<br>        workspace_id: str | None = None,<br>        filter_query: str | None = None,<br>        filter_lang: str | None = None,<br>        limit: Annotated[int, Ge(1), Le(200)] | None = None,<br>    ) -> AsyncIterator[list[Task]]:<br>        """<br>        Get an iterable of lists of completed tasks within a date range.<br>        Retrieves tasks completed within a specific date range (up to 3 months).<br>        Supports filtering by workspace or a filter query.<br>        The response is an iterable of lists of completed tasks. Be aware that each<br>        iteration fires off a network request to the Todoist API, and may result in<br>        rate limiting or other API restrictions.<br>        :param since: Start of the date range (inclusive).<br>        :param until: End of the date range (inclusive).<br>        :param workspace_id: Filter by workspace ID.<br>        :param filter_query: Filter by a query string.<br>        :param filter_lang: Language for the filter query (e.g., 'en').<br>        :param limit: Maximum number of tasks per page (default 50).<br>        :return: An iterable of lists of completed tasks.<br>        :raises httpx.HTTPStatusError: If the API request fails.<br>        :raises TypeError: If the API response structure is unexpected.<br>        """<br>        endpoint = get_api_url(TASKS_COMPLETED_BY_COMPLETION_DATE_PATH)<br>        params = kwargs_without_none(<br>            since=format_datetime(since),<br>            until=format_datetime(until),<br>            workspace_id=workspace_id,<br>            filter_query=filter_query,<br>            filter_lang=filter_lang,<br>            limit=limit,<br>        )<br>        return AsyncResultsPaginator(<br>            self._client,<br>            endpoint,<br>            "items",<br>            Task.from_dict,<br>            self._token,<br>            self._request_id_fn,<br>            params,<br>        )<br>    async def get_project(self, project_id: str) -> Project:<br>        """<br>        Get a project by its ID.<br>        :param project_id: The ID of the project to retrieve.<br>        :return: The requested project.<br>        :raises httpx.HTTPStatusError: If the API request fails.<br>        :raises TypeError: If the API response is not a valid Project dictionary.<br>        """<br>        endpoint = get_api_url(f"{PROJECTS_PATH}/{project_id}")<br>        response = await get_async(<br>            self._client,<br>            endpoint,<br>            self._token,<br>            self._request_id_fn() if self._request_id_fn else None,<br>        )<br>        data = response_json_dict(response)<br>        return Project.from_dict(data)<br>    async def get_projects(<br>        self,<br>        limit: Annotated[int, Ge(1), Le(200)] | None = None,<br>    ) -> AsyncIterator[list[Project]]:<br>        """<br>        Get an iterable of lists of active projects.<br>        The response is an iterable of lists of active projects.<br>        Be aware that each iteration fires off a network request to the Todoist API,<br>        and may result in rate limiting or other API restrictions.<br>        :param limit: Maximum number of projects per page.<br>        :return: An iterable of lists of projects.<br>        :raises httpx.HTTPStatusError: If the API request fails.<br>        :raises TypeError: If the API response structure is unexpected.<br>        """<br>        endpoint = get_api_url(PROJECTS_PATH)<br>        params = kwargs_without_none(limit=limit)<br>        return AsyncResultsPaginator(<br>            self._client,<br>            endpoint,<br>            "results",<br>            Project.from_dict,<br>            self._token,<br>            self._request_id_fn,<br>            params,<br>        )<br>    async def search_projects(<br>        self,<br>        query: Annotated[str, MinLen(1), MaxLen(1024)],<br>        *,<br>        limit: Annotated[int, Ge(1), Le(200)] | None = None,<br>    ) -> AsyncIterator[list[Project]]:<br>        """<br>        Search active projects by name.<br>        The response is an iterable of lists of projects matching the query.<br>        Be aware that each iteration fires off a network request to the Todoist API,<br>        and may result in rate limiting or other API restrictions.<br>        :param query: Query string for project names.<br>        :param limit: Maximum number of projects per page.<br>        :return: An iterable of lists of projects.<br>        :raises httpx.HTTPStatusError: If the API request fails.<br>        :raises TypeError: If the API response structure is unexpected.<br>        """<br>        endpoint = get_api_url(f"{PROJECTS_PATH}/{PROJECTS_SEARCH_PATH_SUFFIX}")<br>        params = kwargs_without_none(query=query, limit=limit)<br>        return AsyncResultsPaginator(<br>            self._client,<br>            endpoint,<br>            "results",<br>            Project.from_dict,<br>            self._token,<br>            self._request_id_fn,<br>            params,<br>        )<br>    async def add_project(<br>        self,<br>        name: Annotated[str, MinLen(1), MaxLen(120)],<br>        *,<br>        description: Annotated[str, MaxLen(16383)] | None = None,<br>        parent_id: str | None = None,<br>        color: ColorString | None = None,<br>        is_favorite: bool | None = None,<br>        view_style: ViewStyle | None = None,<br>    ) -> Project:<br>        """<br>        Create a new project.<br>        :param name: The name of the project.<br>        :param description: Description for the project (up to 1024 characters).<br>        :param parent_id: The ID of the parent project. Set to null for root projects.<br>        :param color: The color of the project icon.<br>        :param is_favorite: Whether the project is a favorite.<br>        :param view_style: A string value (either 'list' or 'board', default is 'list').<br>        :return: The newly created project.<br>        :raises httpx.HTTPStatusError: If the API request fails.<br>        :raises TypeError: If the API response is not a valid Project dictionary.<br>        """<br>        endpoint = get_api_url(PROJECTS_PATH)<br>        data = kwargs_without_none(<br>            name=name,<br>            parent_id=parent_id,<br>            description=description,<br>            color=color,<br>            is_favorite=is_favorite,<br>            view_style=view_style,<br>        )<br>        response = await post_async(<br>            self._client,<br>            endpoint,<br>            self._token,<br>            self._request_id_fn() if self._request_id_fn else None,<br>            data=data,<br>        )<br>        data = response_json_dict(response)<br>        return Project.from_dict(data)<br>    async def update_project(<br>        self,<br>        project_id: str,<br>        *,<br>        name: Annotated[str, MinLen(1), MaxLen(120)] | None = None,<br>        description: Annotated[str, MaxLen(16383)] | None = None,<br>        color: ColorString | None = None,<br>        is_favorite: bool | None = None,<br>        view_style: ViewStyle | None = None,<br>    ) -> Project:<br>        """<br>        Update an existing project.<br>        Only the fields to be updated need to be provided as keyword arguments.<br>        :param project_id: The ID of the project to update.<br>        :param name: The name of the project.<br>        :param description: Description for the project (up to 1024 characters).<br>        :param color: The color of the project icon.<br>        :param is_favorite: Whether the project is a favorite.<br>        :param view_style: A string value (either 'list' or 'board').<br>        :return: the updated Project.<br>        :raises httpx.HTTPStatusError: If the API request fails.<br>        """<br>        endpoint = get_api_url(f"{PROJECTS_PATH}/{project_id}")<br>        data = kwargs_without_none(<br>            name=name,<br>            description=description,<br>            color=color,<br>            is_favorite=is_favorite,<br>            view_style=view_style,<br>        )<br>        response = await post_async(<br>            self._client,<br>            endpoint,<br>            self._token,<br>            self._request_id_fn() if self._request_id_fn else None,<br>            data=data,<br>        )<br>        data = response_json_dict(response)<br>        return Project.from_dict(data)<br>    async def archive_project(self, project_id: str) -> Project:<br>        """<br>        Archive a project.<br>        For personal projects, archives it only for the user.<br>        For workspace projects, archives it for all members.<br>        :param project_id: The ID of the project to archive.<br>        :return: The archived project object.<br>        :raises httpx.HTTPStatusError: If the API request fails.<br>        :raises TypeError: If the API response is not a valid Project dictionary.<br>        """<br>        endpoint = get_api_url(<br>            f"{PROJECTS_PATH}/{project_id}/{PROJECT_ARCHIVE_PATH_SUFFIX}"<br>        )<br>        response = await post_async(<br>            self._client,<br>            endpoint,<br>            self._token,<br>            self._request_id_fn() if self._request_id_fn else None,<br>        )<br>        data = response_json_dict(response)<br>        return Project.from_dict(data)<br>    async def unarchive_project(self, project_id: str) -> Project:<br>        """<br>        Unarchive a project.<br>        Restores a previously archived project.<br>        :param project_id: The ID of the project to unarchive.<br>        :return: The unarchived project object.<br>        :raises httpx.HTTPStatusError: If the API request fails.<br>        :raises TypeError: If the API response is not a valid Project dictionary.<br>        """<br>        endpoint = get_api_url(<br>            f"{PROJECTS_PATH}/{project_id}/{PROJECT_UNARCHIVE_PATH_SUFFIX}"<br>        )<br>        response = await post_async(<br>            self._client,<br>            endpoint,<br>            self._token,<br>            self._request_id_fn() if self._request_id_fn else None,<br>        )<br>        data = response_json_dict(response)<br>        return Project.from_dict(data)<br>    async def delete_project(self, project_id: str) -> bool:<br>        """<br>        Delete a project.<br>        All nested sections and tasks will also be deleted.<br>        :param project_id: The ID of the project to delete.<br>        :return: True if the project was deleted successfully,<br>                 False otherwise (possibly raise `HTTPError` instead).<br>        :raises httpx.HTTPStatusError: If the API request fails.<br>        """<br>        endpoint = get_api_url(f"{PROJECTS_PATH}/{project_id}")<br>        response = await delete_async(<br>            self._client,<br>            endpoint,<br>            self._token,<br>            self._request_id_fn() if self._request_id_fn else None,<br>        )<br>        return response.is_success<br>    async def get_collaborators(<br>        self,<br>        project_id: str,<br>        limit: Annotated[int, Ge(1), Le(200)] | None = None,<br>    ) -> AsyncIterator[list[Collaborator]]:<br>        """<br>        Get an iterable of lists of collaborators in shared projects.<br>        The response is an iterable of lists of collaborators in shared projects,<br>        Be aware that each iteration fires off a network request to the Todoist API,<br>        and may result in rate limiting or other API restrictions.<br>        :param project_id: The ID of the project.<br>        :param limit: Maximum number of collaborators per page.<br>        :return: An iterable of lists of collaborators.<br>        :raises httpx.HTTPStatusError: If the API request fails.<br>        :raises TypeError: If the API response structure is unexpected.<br>        """<br>        endpoint = get_api_url(f"{PROJECTS_PATH}/{project_id}/{COLLABORATORS_PATH}")<br>        params = kwargs_without_none(limit=limit)<br>        return AsyncResultsPaginator(<br>            self._client,<br>            endpoint,<br>            "results",<br>            Collaborator.from_dict,<br>            self._token,<br>            self._request_id_fn,<br>            params,<br>        )<br>    async def get_section(self, section_id: str) -> Section:<br>        """<br>        Get a specific section by its ID.<br>        :param section_id: The ID of the section to retrieve.<br>        :return: The requested section.<br>        :raises httpx.HTTPStatusError: If the API request fails.<br>        :raises TypeError: If the API response is not a valid Section dictionary.<br>        """<br>        endpoint = get_api_url(f"{SECTIONS_PATH}/{section_id}")<br>        response = await get_async(<br>            self._client,<br>            endpoint,<br>            self._token,<br>            self._request_id_fn() if self._request_id_fn else None,<br>        )<br>        data = response_json_dict(response)<br>        return Section.from_dict(data)<br>    async def get_sections(<br>        self,<br>        project_id: str | None = None,<br>        *,<br>        limit: Annotated[int, Ge(1), Le(200)] | None = None,<br>    ) -> AsyncIterator[list[Section]]:<br>        """<br>        Get an iterable of lists of active sections.<br>        Supports filtering by `project_id` and pagination arguments.<br>        The response is an iterable of lists of active sections.<br>        Be aware that each iteration fires off a network request to the Todoist API,<br>        and may result in rate limiting or other API restrictions.<br>        :param project_id: Filter sections by project ID.<br>        :param limit: Maximum number of sections per page.<br>        :return: An iterable of lists of sections.<br>        :raises httpx.HTTPStatusError: If the API request fails.<br>        :raises TypeError: If the API response structure is unexpected.<br>        """<br>        endpoint = get_api_url(SECTIONS_PATH)<br>        params = kwargs_without_none(project_id=project_id, limit=limit)<br>        return AsyncResultsPaginator(<br>            self._client,<br>            endpoint,<br>            "results",<br>            Section.from_dict,<br>            self._token,<br>            self._request_id_fn,<br>            params,<br>        )<br>    async def search_sections(<br>        self,<br>        query: Annotated[str, MinLen(1), MaxLen(1024)],<br>        *,<br>        project_id: str | None = None,<br>        limit: Annotated[int, Ge(1), Le(200)] | None = None,<br>    ) -> AsyncIterator[list[Section]]:<br>        """<br>        Search active sections by name.<br>        The response is an iterable of lists of sections matching the query.<br>        Be aware that each iteration fires off a network request to the Todoist API,<br>        and may result in rate limiting or other API restrictions.<br>        :param query: Query string for section names.<br>        :param project_id: If set, search sections within the given project only.<br>        :param limit: Maximum number of sections per page.<br>        :return: An iterable of lists of sections.<br>        :raises httpx.HTTPStatusError: If the API request fails.<br>        :raises TypeError: If the API response structure is unexpected.<br>        """<br>        endpoint = get_api_url(f"{SECTIONS_PATH}/{SECTIONS_SEARCH_PATH_SUFFIX}")<br>        params = kwargs_without_none(query=query, project_id=project_id, limit=limit)<br>        return AsyncResultsPaginator(<br>            self._client,<br>            endpoint,<br>            "results",<br>            Section.from_dict,<br>            self._token,<br>            self._request_id_fn,<br>            params,<br>        )<br>    async def add_section(<br>        self,<br>        name: Annotated[str, MinLen(1), MaxLen(2048)],<br>        project_id: str,<br>        *,<br>        order: int | None = None,<br>    ) -> Section:<br>        """<br>        Create a new section within a project.<br>        :param name: The name of the section.<br>        :param project_id: The ID of the project to add the section to.<br>        :param order: The order of the section among all sections in the project.<br>        :return: The newly created section.<br>        :raises httpx.HTTPStatusError: If the API request fails.<br>        :raises TypeError: If the API response is not a valid Section dictionary.<br>        """<br>        endpoint = get_api_url(SECTIONS_PATH)<br>        data = kwargs_without_none(name=name, project_id=project_id, order=order)<br>        response = await post_async(<br>            self._client,<br>            endpoint,<br>            self._token,<br>            self._request_id_fn() if self._request_id_fn else None,<br>            data=data,<br>        )<br>        data = response_json_dict(response)<br>        return Section.from_dict(data)<br>    async def update_section(<br>        self,<br>        section_id: str,<br>        name: Annotated[str, MinLen(1), MaxLen(2048)],<br>    ) -> Section:<br>        """<br>        Update an existing section.<br>        Currently, only `name` can be updated.<br>        :param section_id: The ID of the section to update.<br>        :param name: The new name for the section.<br>        :return: the updated Section.<br>        :raises httpx.HTTPStatusError: If the API request fails.<br>        """<br>        endpoint = get_api_url(f"{SECTIONS_PATH}/{section_id}")<br>        response = await post_async(<br>            self._client,<br>            endpoint,<br>            self._token,<br>            self._request_id_fn() if self._request_id_fn else None,<br>            data={"name": name},<br>        )<br>        data = response_json_dict(response)<br>        return Section.from_dict(data)<br>    async def delete_section(self, section_id: str) -> bool:<br>        """<br>        Delete a section.<br>        All tasks within the section will also be deleted.<br>        :param section_id: The ID of the section to delete.<br>        :return: True if the section was deleted successfully,<br>                 False otherwise (possibly raise `HTTPError` instead).<br>        :raises httpx.HTTPStatusError: If the API request fails.<br>        """<br>        endpoint = get_api_url(f"{SECTIONS_PATH}/{section_id}")<br>        response = await delete_async(<br>            self._client,<br>            endpoint,<br>            self._token,<br>            self._request_id_fn() if self._request_id_fn else None,<br>        )<br>        return response.is_success<br>    async def get_comment(self, comment_id: str) -> Comment:<br>        """<br>        Get a specific comment by its ID.<br>        :param comment_id: The ID of the comment to retrieve.<br>        :return: The requested comment.<br>        :raises httpx.HTTPStatusError: If the API request fails.<br>        :raises TypeError: If the API response is not a valid Comment dictionary.<br>        """<br>        endpoint = get_api_url(f"{COMMENTS_PATH}/{comment_id}")<br>        response = await get_async(<br>            self._client,<br>            endpoint,<br>            self._token,<br>            self._request_id_fn() if self._request_id_fn else None,<br>        )<br>        data = response_json_dict(response)<br>        return Comment.from_dict(data)<br>    async def get_comments(<br>        self,<br>        *,<br>        project_id: str | None = None,<br>        task_id: str | None = None,<br>        limit: Annotated[int, Ge(1), Le(200)] | None = None,<br>    ) -> AsyncIterator[list[Comment]]:<br>        """<br>        Get an iterable of lists of comments for a task or project.<br>        Requires either `project_id` or `task_id` to be set.<br>        The response is an iterable of lists of comments.<br>        Be aware that each iteration fires off a network request to the Todoist API,<br>        and may result in rate limiting or other API restrictions.<br>        :param project_id: The ID of the project to retrieve comments for.<br>        :param task_id: The ID of the task to retrieve comments for.<br>        :param limit: Maximum number of comments per page.<br>        :return: An iterable of lists of comments.<br>        :raises ValueError: If neither `project_id` nor `task_id` is provided.<br>        :raises httpx.HTTPStatusError: If the API request fails.<br>        :raises TypeError: If the API response structure is unexpected.<br>        """<br>        if project_id is None and task_id is None:<br>            raise ValueError("Either `project_id` or `task_id` must be provided.")<br>        endpoint = get_api_url(COMMENTS_PATH)<br>        params = kwargs_without_none(<br>            project_id=project_id,<br>            task_id=task_id,<br>            limit=limit,<br>        )<br>        return AsyncResultsPaginator(<br>            self._client,<br>            endpoint,<br>            "results",<br>            Comment.from_dict,<br>            self._token,<br>            self._request_id_fn,<br>            params,<br>        )<br>    async def add_comment(<br>        self,<br>        content: Annotated[str, MaxLen(15000)],<br>        *,<br>        project_id: str | None = None,<br>        task_id: str | None = None,<br>        attachment: Attachment | None = None,<br>        uids_to_notify: list[str] | None = None,<br>    ) -> Comment:<br>        """<br>        Create a new comment on a task or project.<br>        Requires either `project_id` or `task_id` to be set,<br>        and can optionally include an `attachment` object.<br>        :param content: The text content of the comment (supports Markdown).<br>        :param project_id: The ID of the project to add the comment to.<br>        :param task_id: The ID of the task to add the comment to.<br>        :param attachment: The attachment object to include with the comment.<br>        :param uids_to_notify: A list of user IDs to notify.<br>        :return: The newly created comment.<br>        :raises ValueError: If neither `project_id` nor `task_id` is provided.<br>        :raises httpx.HTTPStatusError: If the API request fails.<br>        :raises TypeError: If the API response is not a valid Comment dictionary.<br>        """<br>        if project_id is None and task_id is None:<br>            raise ValueError("Either `project_id` or `task_id` must be provided.")<br>        endpoint = get_api_url(COMMENTS_PATH)<br>        data = kwargs_without_none(<br>            content=content,<br>            project_id=project_id,<br>            task_id=task_id,<br>            attachment=attachment.to_dict() if attachment is not None else None,<br>            uids_to_notify=uids_to_notify,<br>        )<br>        response = await post_async(<br>            self._client,<br>            endpoint,<br>            self._token,<br>            self._request_id_fn() if self._request_id_fn else None,<br>            data=data,<br>        )<br>        data = response_json_dict(response)<br>        return Comment.from_dict(data)<br>    async def update_comment(<br>        self, comment_id: str, content: Annotated[str, MaxLen(15000)]<br>    ) -> Comment:<br>        """<br>        Update an existing comment.<br>        Currently, only `content` can be updated.<br>        :param comment_id: The ID of the comment to update.<br>        :param content: The new text content for the comment.<br>        :return: the updated Comment.<br>        :raises httpx.HTTPStatusError: If the API request fails.<br>        """<br>        endpoint = get_api_url(f"{COMMENTS_PATH}/{comment_id}")<br>        response = await post_async(<br>            self._client,<br>            endpoint,<br>            self._token,<br>            self._request_id_fn() if self._request_id_fn else None,<br>            data={"content": content},<br>        )<br>        data = response_json_dict(response)<br>        return Comment.from_dict(data)<br>    async def delete_comment(self, comment_id: str) -> bool:<br>        """<br>        Delete a comment.<br>        :param comment_id: The ID of the comment to delete.<br>        :return: True if the comment was deleted successfully,<br>                 False otherwise (possibly raise `HTTPError` instead).<br>        :raises httpx.HTTPStatusError: If the API request fails.<br>        """<br>        endpoint = get_api_url(f"{COMMENTS_PATH}/{comment_id}")<br>        response = await delete_async(<br>            self._client,<br>            endpoint,<br>            self._token,<br>            self._request_id_fn() if self._request_id_fn else None,<br>        )<br>        return response.is_success<br>    async def get_label(self, label_id: str) -> Label:<br>        """<br>        Get a specific personal label by its ID.<br>        :param label_id: The ID of the label to retrieve.<br>        :return: The requested label.<br>        :raises httpx.HTTPStatusError: If the API request fails.<br>        :raises TypeError: If the API response is not a valid Label dictionary.<br>        """<br>        endpoint = get_api_url(f"{LABELS_PATH}/{label_id}")<br>        response = await get_async(<br>            self._client,<br>            endpoint,<br>            self._token,<br>            self._request_id_fn() if self._request_id_fn else None,<br>        )<br>        data = response_json_dict(response)<br>        return Label.from_dict(data)<br>    async def get_labels(<br>        self,<br>        *,<br>        limit: Annotated[int, Ge(1), Le(200)] | None = None,<br>    ) -> AsyncIterator[list[Label]]:<br>        """<br>        Get an iterable of lists of personal labels.<br>        Supports pagination arguments.<br>        The response is an iterable of lists of personal labels.<br>        Be aware that each iteration fires off a network request to the Todoist API,<br>        and may result in rate limiting or other API restrictions.<br>        :param limit: Maximum number of labels per page.<br>        :return: An iterable of lists of personal labels.<br>        :raises httpx.HTTPStatusError: If the API request fails.<br>        :raises TypeError: If the API response structure is unexpected.<br>        """<br>        endpoint = get_api_url(LABELS_PATH)<br>        params = kwargs_without_none(limit=limit)<br>        return AsyncResultsPaginator(<br>            self._client,<br>            endpoint,<br>            "results",<br>            Label.from_dict,<br>            self._token,<br>            self._request_id_fn,<br>            params,<br>        )<br>    async def search_labels(<br>        self,<br>        query: Annotated[str, MinLen(1), MaxLen(1024)],<br>        *,<br>        limit: Annotated[int, Ge(1), Le(200)] | None = None,<br>    ) -> AsyncIterator[list[Label]]:<br>        """<br>        Search personal labels by name.<br>        The response is an iterable of lists of labels matching the query.<br>        Be aware that each iteration fires off a network request to the Todoist API,<br>        and may result in rate limiting or other API restrictions.<br>        :param query: Query string for label names.<br>        :param limit: Maximum number of labels per page.<br>        :return: An iterable of lists of labels.<br>        :raises httpx.HTTPStatusError: If the API request fails.<br>        :raises TypeError: If the API response structure is unexpected.<br>        """<br>        endpoint = get_api_url(f"{LABELS_PATH}/{LABELS_SEARCH_PATH_SUFFIX}")<br>        params = kwargs_without_none(query=query, limit=limit)<br>        return AsyncResultsPaginator(<br>            self._client,<br>            endpoint,<br>            "results",<br>            Label.from_dict,<br>            self._token,<br>            self._request_id_fn,<br>            params,<br>        )<br>    async def add_label(<br>        self,<br>        name: Annotated[str, MinLen(1), MaxLen(60)],<br>        *,<br>        color: ColorString | None = None,<br>        item_order: int | None = None,<br>        is_favorite: bool | None = None,<br>    ) -> Label:<br>        """<br>        Create a new personal label.<br>        :param name: The name of the label.<br>        :param color: The color of the label icon.<br>        :param item_order: Label's order in the label list.<br>        :param is_favorite: Whether the label is a favorite.<br>        :return: The newly created label.<br>        :raises httpx.HTTPStatusError: If the API request fails.<br>        :raises TypeError: If the API response is not a valid Label dictionary.<br>        """<br>        endpoint = get_api_url(LABELS_PATH)<br>        data = kwargs_without_none(<br>            name=name,<br>            color=color,<br>            item_order=item_order,<br>            is_favorite=is_favorite,<br>        )<br>        response = await post_async(<br>            self._client,<br>            endpoint,<br>            self._token,<br>            self._request_id_fn() if self._request_id_fn else None,<br>            data=data,<br>        )<br>        data = response_json_dict(response)<br>        return Label.from_dict(data)<br>    async def update_label(<br>        self,<br>        label_id: str,<br>        *,<br>        name: Annotated[str, MinLen(1), MaxLen(60)] | None = None,<br>        color: ColorString | None = None,<br>        item_order: int | None = None,<br>        is_favorite: bool | None = None,<br>    ) -> Label:<br>        """<br>        Update a personal label.<br>        Only the fields to be updated need to be provided as keyword arguments.<br>        :param label_id: The ID of the label.<br>        :param name: The name of the label.<br>        :param color: The color of the label icon.<br>        :param item_order: Label's order in the label list.<br>        :param is_favorite: Whether the label is a favorite.<br>        :return: the updated Label.<br>        :raises httpx.HTTPStatusError: If the API request fails.<br>        """<br>        endpoint = get_api_url(f"{LABELS_PATH}/{label_id}")<br>        data = kwargs_without_none(<br>            name=name,<br>            color=color,<br>            item_order=item_order,<br>            is_favorite=is_favorite,<br>        )<br>        response = await post_async(<br>            self._client,<br>            endpoint,<br>            self._token,<br>            self._request_id_fn() if self._request_id_fn else None,<br>            data=data,<br>        )<br>        data = response_json_dict(response)<br>        return Label.from_dict(data)<br>    async def delete_label(self, label_id: str) -> bool:<br>        """<br>        Delete a personal label.<br>        Instances of the label will be removed from tasks.<br>        :param label_id: The ID of the label to delete.<br>        :return: True if the label was deleted successfully,<br>                 False otherwise (possibly raise `HTTPError` instead).<br>        :raises httpx.HTTPStatusError: If the API request fails.<br>        """<br>        endpoint = get_api_url(f"{LABELS_PATH}/{label_id}")<br>        response = await delete_async(<br>            self._client,<br>            endpoint,<br>            self._token,<br>            self._request_id_fn() if self._request_id_fn else None,<br>        )<br>        return response.is_success<br>    async def get_shared_labels(<br>        self,<br>        *,<br>        omit_personal: bool = False,<br>        limit: Annotated[int, Ge(1), Le(200)] | None = None,<br>    ) -> AsyncIterator[list[str]]:<br>        """<br>        Get an iterable of lists of shared label names.<br>        Includes labels from collaborators on shared projects that are not in the<br>        user's personal labels. Can optionally exclude personal label names using<br>        `omit_personal=True`. Supports pagination arguments.<br>        The response is an iterable of lists of shared label names.<br>        Be aware that each iteration fires off a network request to the Todoist API,<br>        and may result in rate limiting or other API restrictions.<br>        :param omit_personal: Optional boolean flag to omit personal label names.<br>        :param limit: Maximum number of labels per page.<br>        :return: An iterable of lists of shared label names (strings).<br>        :raises httpx.HTTPStatusError: If the API request fails.<br>        :raises TypeError: If the API response structure is unexpected.<br>        """<br>        endpoint = get_api_url(SHARED_LABELS_PATH)<br>        params = kwargs_without_none(omit_personal=omit_personal, limit=limit)<br>        return AsyncResultsPaginator(<br>            self._client,<br>            endpoint,<br>            "results",<br>            str,<br>            self._token,<br>            self._request_id_fn,<br>            params,<br>        )<br>    async def rename_shared_label(<br>        self,<br>        name: Annotated[str, MaxLen(60)],<br>        new_name: Annotated[str, MinLen(1), MaxLen(60)],<br>    ) -> bool:<br>        """<br>        Rename all occurrences of a shared label across all projects.<br>        :param name: The current name of the shared label to rename.<br>        :param new_name: The new name for the shared label.<br>        :return: True if the rename was successful,<br>                 False otherwise (possibly raise `HTTPError` instead).<br>        :raises httpx.HTTPStatusError: If the API request fails.<br>        """<br>        endpoint = get_api_url(SHARED_LABELS_RENAME_PATH)<br>        response = await post_async(<br>            self._client,<br>            endpoint,<br>            self._token,<br>            self._request_id_fn() if self._request_id_fn else None,<br>            params={"name": name},<br>            data={"new_name": new_name},<br>        )<br>        return response.is_success<br>    async def remove_shared_label(self, name: Annotated[str, MaxLen(60)]) -> bool:<br>        """<br>        Remove all occurrences of a shared label across all projects.<br>        This action removes the label string from all tasks where it appears.<br>        :param name: The name of the shared label to remove.<br>        :return: True if the removal was successful,<br>        :raises httpx.HTTPStatusError: If the API request fails.<br>        """<br>        endpoint = get_api_url(SHARED_LABELS_REMOVE_PATH)<br>        data = {"name": name}<br>        response = await post_async(<br>            self._client,<br>            endpoint,<br>            self._token,<br>            self._request_id_fn() if self._request_id_fn else None,<br>            data=data,<br>        )<br>        return response.is_success<br>``` |

## `add_comment(content, *, project_id=None, task_id=None, attachment=None, uids_to_notify=None)``async`

Create a new comment on a task or project.

Requires either `project_id` or `task_id` to be set,
and can optionally include an `attachment` object.

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `content` | `str` | The text content of the comment (supports Markdown). | _required_ |
| `project_id` | `str | None` | The ID of the project to add the comment to. | `None` |
| `task_id` | `str | None` | The ID of the task to add the comment to. | `None` |
| `attachment` | `Attachment | None` | The attachment object to include with the comment. | `None` |
| `uids_to_notify` | `list[str] | None` | A list of user IDs to notify. | `None` |

Returns:

| Type | Description |
| --- | --- |
| `Comment` | The newly created comment. |

Raises:

| Type | Description |
| --- | --- |
| `ValueError` | If neither `project_id` nor `task_id` is provided. |
| `httpx.HTTPStatusError` | If the API request fails. |
| `TypeError` | If the API response is not a valid Comment dictionary. |

Source code in `todoist_api_python/api_async.py`

|     |     |
| --- | --- |
| ```<br>1156<br>1157<br>1158<br>1159<br>1160<br>1161<br>1162<br>1163<br>1164<br>1165<br>1166<br>1167<br>1168<br>1169<br>1170<br>1171<br>1172<br>1173<br>1174<br>1175<br>1176<br>1177<br>1178<br>1179<br>1180<br>1181<br>1182<br>1183<br>1184<br>1185<br>1186<br>1187<br>1188<br>1189<br>1190<br>1191<br>1192<br>1193<br>1194<br>1195<br>1196<br>1197<br>1198<br>1199<br>1200<br>1201<br>1202<br>``` | ```<br>async def add_comment(<br>    self,<br>    content: Annotated[str, MaxLen(15000)],<br>    *,<br>    project_id: str | None = None,<br>    task_id: str | None = None,<br>    attachment: Attachment | None = None,<br>    uids_to_notify: list[str] | None = None,<br>) -> Comment:<br>    """<br>    Create a new comment on a task or project.<br>    Requires either `project_id` or `task_id` to be set,<br>    and can optionally include an `attachment` object.<br>    :param content: The text content of the comment (supports Markdown).<br>    :param project_id: The ID of the project to add the comment to.<br>    :param task_id: The ID of the task to add the comment to.<br>    :param attachment: The attachment object to include with the comment.<br>    :param uids_to_notify: A list of user IDs to notify.<br>    :return: The newly created comment.<br>    :raises ValueError: If neither `project_id` nor `task_id` is provided.<br>    :raises httpx.HTTPStatusError: If the API request fails.<br>    :raises TypeError: If the API response is not a valid Comment dictionary.<br>    """<br>    if project_id is None and task_id is None:<br>        raise ValueError("Either `project_id` or `task_id` must be provided.")<br>    endpoint = get_api_url(COMMENTS_PATH)<br>    data = kwargs_without_none(<br>        content=content,<br>        project_id=project_id,<br>        task_id=task_id,<br>        attachment=attachment.to_dict() if attachment is not None else None,<br>        uids_to_notify=uids_to_notify,<br>    )<br>    response = await post_async(<br>        self._client,<br>        endpoint,<br>        self._token,<br>        self._request_id_fn() if self._request_id_fn else None,<br>        data=data,<br>    )<br>    data = response_json_dict(response)<br>    return Comment.from_dict(data)<br>``` |

## `add_label(name, *, color=None, item_order=None, is_favorite=None)``async`

Create a new personal label.

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `name` | `str` | The name of the label. | _required_ |
| `color` | `ColorString | None` | The color of the label icon. | `None` |
| `item_order` | `int | None` | Label's order in the label list. | `None` |
| `is_favorite` | `bool | None` | Whether the label is a favorite. | `None` |

Returns:

| Type | Description |
| --- | --- |
| `Label` | The newly created label. |

Raises:

| Type | Description |
| --- | --- |
| `httpx.HTTPStatusError` | If the API request fails. |
| `TypeError` | If the API response is not a valid Label dictionary. |

Source code in `todoist_api_python/api_async.py`

|     |     |
| --- | --- |
| ```<br>1331<br>1332<br>1333<br>1334<br>1335<br>1336<br>1337<br>1338<br>1339<br>1340<br>1341<br>1342<br>1343<br>1344<br>1345<br>1346<br>1347<br>1348<br>1349<br>1350<br>1351<br>1352<br>1353<br>1354<br>1355<br>1356<br>1357<br>1358<br>1359<br>1360<br>1361<br>1362<br>1363<br>1364<br>1365<br>1366<br>1367<br>``` | ```<br>async def add_label(<br>    self,<br>    name: Annotated[str, MinLen(1), MaxLen(60)],<br>    *,<br>    color: ColorString | None = None,<br>    item_order: int | None = None,<br>    is_favorite: bool | None = None,<br>) -> Label:<br>    """<br>    Create a new personal label.<br>    :param name: The name of the label.<br>    :param color: The color of the label icon.<br>    :param item_order: Label's order in the label list.<br>    :param is_favorite: Whether the label is a favorite.<br>    :return: The newly created label.<br>    :raises httpx.HTTPStatusError: If the API request fails.<br>    :raises TypeError: If the API response is not a valid Label dictionary.<br>    """<br>    endpoint = get_api_url(LABELS_PATH)<br>    data = kwargs_without_none(<br>        name=name,<br>        color=color,<br>        item_order=item_order,<br>        is_favorite=is_favorite,<br>    )<br>    response = await post_async(<br>        self._client,<br>        endpoint,<br>        self._token,<br>        self._request_id_fn() if self._request_id_fn else None,<br>        data=data,<br>    )<br>    data = response_json_dict(response)<br>    return Label.from_dict(data)<br>``` |

## `add_project(name, *, description=None, parent_id=None, color=None, is_favorite=None, view_style=None)``async`

Create a new project.

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `name` | `str` | The name of the project. | _required_ |
| `description` | `str | None` | Description for the project (up to 1024 characters). | `None` |
| `parent_id` | `str | None` | The ID of the parent project. Set to null for root projects. | `None` |
| `color` | `ColorString | None` | The color of the project icon. | `None` |
| `is_favorite` | `bool | None` | Whether the project is a favorite. | `None` |
| `view_style` | `ViewStyle | None` | A string value (either 'list' or 'board', default is 'list'). | `None` |

Returns:

| Type | Description |
| --- | --- |
| `Project` | The newly created project. |

Raises:

| Type | Description |
| --- | --- |
| `httpx.HTTPStatusError` | If the API request fails. |
| `TypeError` | If the API response is not a valid Project dictionary. |

Source code in `todoist_api_python/api_async.py`

|     |     |
| --- | --- |
| ```<br>741<br>742<br>743<br>744<br>745<br>746<br>747<br>748<br>749<br>750<br>751<br>752<br>753<br>754<br>755<br>756<br>757<br>758<br>759<br>760<br>761<br>762<br>763<br>764<br>765<br>766<br>767<br>768<br>769<br>770<br>771<br>772<br>773<br>774<br>775<br>776<br>777<br>778<br>779<br>780<br>781<br>782<br>783<br>``` | ```<br>async def add_project(<br>    self,<br>    name: Annotated[str, MinLen(1), MaxLen(120)],<br>    *,<br>    description: Annotated[str, MaxLen(16383)] | None = None,<br>    parent_id: str | None = None,<br>    color: ColorString | None = None,<br>    is_favorite: bool | None = None,<br>    view_style: ViewStyle | None = None,<br>) -> Project:<br>    """<br>    Create a new project.<br>    :param name: The name of the project.<br>    :param description: Description for the project (up to 1024 characters).<br>    :param parent_id: The ID of the parent project. Set to null for root projects.<br>    :param color: The color of the project icon.<br>    :param is_favorite: Whether the project is a favorite.<br>    :param view_style: A string value (either 'list' or 'board', default is 'list').<br>    :return: The newly created project.<br>    :raises httpx.HTTPStatusError: If the API request fails.<br>    :raises TypeError: If the API response is not a valid Project dictionary.<br>    """<br>    endpoint = get_api_url(PROJECTS_PATH)<br>    data = kwargs_without_none(<br>        name=name,<br>        parent_id=parent_id,<br>        description=description,<br>        color=color,<br>        is_favorite=is_favorite,<br>        view_style=view_style,<br>    )<br>    response = await post_async(<br>        self._client,<br>        endpoint,<br>        self._token,<br>        self._request_id_fn() if self._request_id_fn else None,<br>        data=data,<br>    )<br>    data = response_json_dict(response)<br>    return Project.from_dict(data)<br>``` |

## `add_section(name, project_id, *, order=None)``async`

Create a new section within a project.

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `name` | `str` | The name of the section. | _required_ |
| `project_id` | `str` | The ID of the project to add the section to. | _required_ |
| `order` | `int | None` | The order of the section among all sections in the project. | `None` |

Returns:

| Type | Description |
| --- | --- |
| `Section` | The newly created section. |

Raises:

| Type | Description |
| --- | --- |
| `httpx.HTTPStatusError` | If the API request fails. |
| `TypeError` | If the API response is not a valid Section dictionary. |

Source code in `todoist_api_python/api_async.py`

|     |     |
| --- | --- |
| ```<br>1015<br>1016<br>1017<br>1018<br>1019<br>1020<br>1021<br>1022<br>1023<br>1024<br>1025<br>1026<br>1027<br>1028<br>1029<br>1030<br>1031<br>1032<br>1033<br>1034<br>1035<br>1036<br>1037<br>1038<br>1039<br>1040<br>1041<br>1042<br>1043<br>1044<br>``` | ```<br>async def add_section(<br>    self,<br>    name: Annotated[str, MinLen(1), MaxLen(2048)],<br>    project_id: str,<br>    *,<br>    order: int | None = None,<br>) -> Section:<br>    """<br>    Create a new section within a project.<br>    :param name: The name of the section.<br>    :param project_id: The ID of the project to add the section to.<br>    :param order: The order of the section among all sections in the project.<br>    :return: The newly created section.<br>    :raises httpx.HTTPStatusError: If the API request fails.<br>    :raises TypeError: If the API response is not a valid Section dictionary.<br>    """<br>    endpoint = get_api_url(SECTIONS_PATH)<br>    data = kwargs_without_none(name=name, project_id=project_id, order=order)<br>    response = await post_async(<br>        self._client,<br>        endpoint,<br>        self._token,<br>        self._request_id_fn() if self._request_id_fn else None,<br>        data=data,<br>    )<br>    data = response_json_dict(response)<br>    return Section.from_dict(data)<br>``` |

## `add_task(content, *, description=None, project_id=None, section_id=None, parent_id=None, labels=None, priority=None, due_string=None, due_lang=None, due_date=None, due_datetime=None, assignee_id=None, order=None, auto_reminder=None, auto_parse_labels=None, duration=None, duration_unit=None, deadline_date=None, deadline_lang=None)``async`

Create a new task.

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `content` | `str` | The text content of the task. | _required_ |
| `project_id` | `str | None` | The ID of the project to add the task to. | `None` |
| `section_id` | `str | None` | The ID of the section to add the task to. | `None` |
| `parent_id` | `str | None` | The ID of the parent task. | `None` |
| `labels` | `list[str] | None` | The task's labels (a list of names). | `None` |
| `priority` | `int | None` | The priority of the task (4 for very urgent). | `None` |
| `due_string` | `str | None` | The due date in natural language format. | `None` |
| `due_lang` | `LanguageCode | None` | Language for parsing the due date (e.g., 'en'). | `None` |
| `due_date` | `date | None` | The due date as a date object. | `None` |
| `due_datetime` | `datetime | None` | The due date and time as a datetime object. | `None` |
| `assignee_id` | `str | None` | User ID to whom the task is assigned. | `None` |
| `description` | `str | None` | Description for the task. | `None` |
| `order` | `int | None` | The order of task in the project or section. | `None` |
| `auto_reminder` | `bool | None` | Whether to add default reminder if date with time is set. | `None` |
| `auto_parse_labels` | `bool | None` | Whether to parse labels from task content. | `None` |
| `duration` | `int | None` | The amount of time the task will take. | `None` |
| `duration_unit` | `Literal['minute', 'day'] | None` | The unit of time for duration. | `None` |
| `deadline_date` | `date | None` | The deadline date as a date object. | `None` |
| `deadline_lang` | `LanguageCode | None` | Language for parsing the deadline date. | `None` |

Returns:

| Type | Description |
| --- | --- |
| `Task` | The newly created task. |

Raises:

| Type | Description |
| --- | --- |
| `httpx.HTTPStatusError` | If the API request fails. |
| `TypeError` | If the API response is not a valid Task dictionary. |

Source code in `todoist_api_python/api_async.py`

|     |     |
| --- | --- |
| ```<br>237<br>238<br>239<br>240<br>241<br>242<br>243<br>244<br>245<br>246<br>247<br>248<br>249<br>250<br>251<br>252<br>253<br>254<br>255<br>256<br>257<br>258<br>259<br>260<br>261<br>262<br>263<br>264<br>265<br>266<br>267<br>268<br>269<br>270<br>271<br>272<br>273<br>274<br>275<br>276<br>277<br>278<br>279<br>280<br>281<br>282<br>283<br>284<br>285<br>286<br>287<br>288<br>289<br>290<br>291<br>292<br>293<br>294<br>295<br>296<br>297<br>298<br>299<br>300<br>301<br>302<br>303<br>304<br>305<br>306<br>307<br>308<br>309<br>310<br>311<br>312<br>313<br>314<br>315<br>316<br>317<br>318<br>319<br>320<br>321<br>322<br>``` | ```<br>async def add_task(<br>    self,<br>    content: Annotated[str, MinLen(1), MaxLen(500)],<br>    *,<br>    description: Annotated[str, MaxLen(16383)] | None = None,<br>    project_id: str | None = None,<br>    section_id: str | None = None,<br>    parent_id: str | None = None,<br>    labels: list[Annotated[str, MaxLen(100)]] | None = None,<br>    priority: Annotated[int, Ge(1), Le(4)] | None = None,<br>    due_string: Annotated[str, MaxLen(150)] | None = None,<br>    due_lang: LanguageCode | None = None,<br>    due_date: date | None = None,<br>    due_datetime: datetime | None = None,<br>    assignee_id: str | None = None,<br>    order: int | None = None,<br>    auto_reminder: bool | None = None,<br>    auto_parse_labels: bool | None = None,<br>    duration: Annotated[int, Ge(1)] | None = None,<br>    duration_unit: Literal["minute", "day"] | None = None,<br>    deadline_date: date | None = None,<br>    deadline_lang: LanguageCode | None = None,<br>) -> Task:<br>    """<br>    Create a new task.<br>    :param content: The text content of the task.<br>    :param project_id: The ID of the project to add the task to.<br>    :param section_id: The ID of the section to add the task to.<br>    :param parent_id: The ID of the parent task.<br>    :param labels: The task's labels (a list of names).<br>    :param priority: The priority of the task (4 for very urgent).<br>    :param due_string: The due date in natural language format.<br>    :param due_lang: Language for parsing the due date (e.g., 'en').<br>    :param due_date: The due date as a date object.<br>    :param due_datetime: The due date and time as a datetime object.<br>    :param assignee_id: User ID to whom the task is assigned.<br>    :param description: Description for the task.<br>    :param order: The order of task in the project or section.<br>    :param auto_reminder: Whether to add default reminder if date with time is set.<br>    :param auto_parse_labels: Whether to parse labels from task content.<br>    :param duration: The amount of time the task will take.<br>    :param duration_unit: The unit of time for duration.<br>    :param deadline_date: The deadline date as a date object.<br>    :param deadline_lang: Language for parsing the deadline date.<br>    :return: The newly created task.<br>    :raises httpx.HTTPStatusError: If the API request fails.<br>    :raises TypeError: If the API response is not a valid Task dictionary.<br>    """<br>    endpoint = get_api_url(TASKS_PATH)<br>    data = kwargs_without_none(<br>        content=content,<br>        description=description,<br>        project_id=project_id,<br>        section_id=section_id,<br>        parent_id=parent_id,<br>        labels=labels,<br>        priority=priority,<br>        due_string=due_string,<br>        due_lang=due_lang,<br>        due_date=format_date(due_date) if due_date is not None else None,<br>        due_datetime=(<br>            format_datetime(due_datetime) if due_datetime is not None else None<br>        ),<br>        assignee_id=assignee_id,<br>        order=order,<br>        auto_reminder=auto_reminder,<br>        auto_parse_labels=auto_parse_labels,<br>        duration=duration,<br>        duration_unit=duration_unit,<br>        deadline_date=(<br>            format_date(deadline_date) if deadline_date is not None else None<br>        ),<br>        deadline_lang=deadline_lang,<br>    )<br>    response = await post_async(<br>        self._client,<br>        endpoint,<br>        self._token,<br>        self._request_id_fn() if self._request_id_fn else None,<br>        data=data,<br>    )<br>    data = response_json_dict(response)<br>    return Task.from_dict(data)<br>``` |

## `add_task_quick(text, *, note=None, reminder=None, auto_reminder=True)``async`

Create a new task using Todoist's Quick Add syntax.

This automatically parses dates, deadlines, projects, labels, priorities, etc,
from the provided text (e.g., "Buy milk #Shopping @groceries tomorrow p1").

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `text` | `str` | The task text using Quick Add syntax. | _required_ |
| `note` | `str | None` | Optional note to be added to the task. | `None` |
| `reminder` | `str | None` | Optional reminder date in free form text. | `None` |
| `auto_reminder` | `bool` | Whether to add default reminder if date with time is set. | `True` |

Returns:

| Type | Description |
| --- | --- |
| `Task` | A result object containing the parsed task data and metadata. |

Raises:

| Type | Description |
| --- | --- |
| `httpx.HTTPStatusError` | If the API request fails. |
| `TypeError` | If the API response cannot be parsed into a QuickAddResult. |

Source code in `todoist_api_python/api_async.py`

|     |     |
| --- | --- |
| ```<br>324<br>325<br>326<br>327<br>328<br>329<br>330<br>331<br>332<br>333<br>334<br>335<br>336<br>337<br>338<br>339<br>340<br>341<br>342<br>343<br>344<br>345<br>346<br>347<br>348<br>349<br>350<br>351<br>352<br>353<br>354<br>355<br>356<br>357<br>358<br>359<br>360<br>361<br>362<br>363<br>364<br>``` | ```<br>async def add_task_quick(<br>    self,<br>    text: str,<br>    *,<br>    note: str | None = None,<br>    reminder: str | None = None,<br>    auto_reminder: bool = True,<br>) -> Task:<br>    """<br>    Create a new task using Todoist's Quick Add syntax.<br>    This automatically parses dates, deadlines, projects, labels, priorities, etc,<br>    from the provided text (e.g., "Buy milk #Shopping @groceries tomorrow p1").<br>    :param text: The task text using Quick Add syntax.<br>    :param note: Optional note to be added to the task.<br>    :param reminder: Optional reminder date in free form text.<br>    :param auto_reminder: Whether to add default reminder if date with time is set.<br>    :return: A result object containing the parsed task data and metadata.<br>    :raises httpx.HTTPStatusError: If the API request fails.<br>    :raises TypeError: If the API response cannot be parsed into a QuickAddResult.<br>    """<br>    endpoint = get_api_url(TASKS_QUICK_ADD_PATH)<br>    data = kwargs_without_none(<br>        meta=True,<br>        text=text,<br>        auto_reminder=auto_reminder,<br>        note=note,<br>        reminder=reminder,<br>    )<br>    response = await post_async(<br>        self._client,<br>        endpoint,<br>        self._token,<br>        self._request_id_fn() if self._request_id_fn else None,<br>        data=data,<br>    )<br>    data = response_json_dict(response)<br>    return Task.from_dict(data)<br>``` |

## `archive_project(project_id)``async`

Archive a project.

For personal projects, archives it only for the user.
For workspace projects, archives it for all members.

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `project_id` | `str` | The ID of the project to archive. | _required_ |

Returns:

| Type | Description |
| --- | --- |
| `Project` | The archived project object. |

Raises:

| Type | Description |
| --- | --- |
| `httpx.HTTPStatusError` | If the API request fails. |
| `TypeError` | If the API response is not a valid Project dictionary. |

Source code in `todoist_api_python/api_async.py`

|     |     |
| --- | --- |
| ```<br>829<br>830<br>831<br>832<br>833<br>834<br>835<br>836<br>837<br>838<br>839<br>840<br>841<br>842<br>843<br>844<br>845<br>846<br>847<br>848<br>849<br>850<br>851<br>``` | ```<br>async def archive_project(self, project_id: str) -> Project:<br>    """<br>    Archive a project.<br>    For personal projects, archives it only for the user.<br>    For workspace projects, archives it for all members.<br>    :param project_id: The ID of the project to archive.<br>    :return: The archived project object.<br>    :raises httpx.HTTPStatusError: If the API request fails.<br>    :raises TypeError: If the API response is not a valid Project dictionary.<br>    """<br>    endpoint = get_api_url(<br>        f"{PROJECTS_PATH}/{project_id}/{PROJECT_ARCHIVE_PATH_SUFFIX}"<br>    )<br>    response = await post_async(<br>        self._client,<br>        endpoint,<br>        self._token,<br>        self._request_id_fn() if self._request_id_fn else None,<br>    )<br>    data = response_json_dict(response)<br>    return Project.from_dict(data)<br>``` |

## `close()``async`

Close the underlying `httpx.AsyncClient`.

Source code in `todoist_api_python/api_async.py`

|     |     |
| --- | --- |
| ```<br>118<br>119<br>120<br>``` | ```<br>async def close(self) -> None:<br>    """Close the underlying `httpx.AsyncClient`."""<br>    await self._client.aclose()<br>``` |

## `complete_task(task_id)``async`

Complete a task.

For recurring tasks, this schedules the next occurrence.
For non-recurring tasks, it marks them as completed.

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `task_id` | `str` | The ID of the task to close. | _required_ |

Returns:

| Type | Description |
| --- | --- |
| `bool` | True if the task was closed successfully, False otherwise (possibly raise `HTTPError` instead). |

Raises:

| Type | Description |
| --- | --- |
| `httpx.HTTPStatusError` | If the API request fails. |

Source code in `todoist_api_python/api_async.py`

|     |     |
| --- | --- |
| ```<br>447<br>448<br>449<br>450<br>451<br>452<br>453<br>454<br>455<br>456<br>457<br>458<br>459<br>460<br>461<br>462<br>463<br>464<br>465<br>466<br>``` | ```<br>async def complete_task(self, task_id: str) -> bool:<br>    """<br>    Complete a task.<br>    For recurring tasks, this schedules the next occurrence.<br>    For non-recurring tasks, it marks them as completed.<br>    :param task_id: The ID of the task to close.<br>    :return: True if the task was closed successfully,<br>             False otherwise (possibly raise `HTTPError` instead).<br>    :raises httpx.HTTPStatusError: If the API request fails.<br>    """<br>    endpoint = get_api_url(f"{TASKS_PATH}/{task_id}/close")<br>    response = await post_async(<br>        self._client,<br>        endpoint,<br>        self._token,<br>        self._request_id_fn() if self._request_id_fn else None,<br>    )<br>    return response.is_success<br>``` |

## `delete_comment(comment_id)``async`

Delete a comment.

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `comment_id` | `str` | The ID of the comment to delete. | _required_ |

Returns:

| Type | Description |
| --- | --- |
| `bool` | True if the comment was deleted successfully, False otherwise (possibly raise `HTTPError` instead). |

Raises:

| Type | Description |
| --- | --- |
| `httpx.HTTPStatusError` | If the API request fails. |

Source code in `todoist_api_python/api_async.py`

|     |     |
| --- | --- |
| ```<br>1228<br>1229<br>1230<br>1231<br>1232<br>1233<br>1234<br>1235<br>1236<br>1237<br>1238<br>1239<br>1240<br>1241<br>1242<br>1243<br>1244<br>``` | ```<br>async def delete_comment(self, comment_id: str) -> bool:<br>    """<br>    Delete a comment.<br>    :param comment_id: The ID of the comment to delete.<br>    :return: True if the comment was deleted successfully,<br>             False otherwise (possibly raise `HTTPError` instead).<br>    :raises httpx.HTTPStatusError: If the API request fails.<br>    """<br>    endpoint = get_api_url(f"{COMMENTS_PATH}/{comment_id}")<br>    response = await delete_async(<br>        self._client,<br>        endpoint,<br>        self._token,<br>        self._request_id_fn() if self._request_id_fn else None,<br>    )<br>    return response.is_success<br>``` |

## `delete_label(label_id)``async`

Delete a personal label.

Instances of the label will be removed from tasks.

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `label_id` | `str` | The ID of the label to delete. | _required_ |

Returns:

| Type | Description |
| --- | --- |
| `bool` | True if the label was deleted successfully, False otherwise (possibly raise `HTTPError` instead). |

Raises:

| Type | Description |
| --- | --- |
| `httpx.HTTPStatusError` | If the API request fails. |

Source code in `todoist_api_python/api_async.py`

|     |     |
| --- | --- |
| ```<br>1410<br>1411<br>1412<br>1413<br>1414<br>1415<br>1416<br>1417<br>1418<br>1419<br>1420<br>1421<br>1422<br>1423<br>1424<br>1425<br>1426<br>1427<br>1428<br>``` | ```<br>async def delete_label(self, label_id: str) -> bool:<br>    """<br>    Delete a personal label.<br>    Instances of the label will be removed from tasks.<br>    :param label_id: The ID of the label to delete.<br>    :return: True if the label was deleted successfully,<br>             False otherwise (possibly raise `HTTPError` instead).<br>    :raises httpx.HTTPStatusError: If the API request fails.<br>    """<br>    endpoint = get_api_url(f"{LABELS_PATH}/{label_id}")<br>    response = await delete_async(<br>        self._client,<br>        endpoint,<br>        self._token,<br>        self._request_id_fn() if self._request_id_fn else None,<br>    )<br>    return response.is_success<br>``` |

## `delete_project(project_id)``async`

Delete a project.

All nested sections and tasks will also be deleted.

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `project_id` | `str` | The ID of the project to delete. | _required_ |

Returns:

| Type | Description |
| --- | --- |
| `bool` | True if the project was deleted successfully, False otherwise (possibly raise `HTTPError` instead). |

Raises:

| Type | Description |
| --- | --- |
| `httpx.HTTPStatusError` | If the API request fails. |

Source code in `todoist_api_python/api_async.py`

|     |     |
| --- | --- |
| ```<br>876<br>877<br>878<br>879<br>880<br>881<br>882<br>883<br>884<br>885<br>886<br>887<br>888<br>889<br>890<br>891<br>892<br>893<br>894<br>``` | ```<br>async def delete_project(self, project_id: str) -> bool:<br>    """<br>    Delete a project.<br>    All nested sections and tasks will also be deleted.<br>    :param project_id: The ID of the project to delete.<br>    :return: True if the project was deleted successfully,<br>             False otherwise (possibly raise `HTTPError` instead).<br>    :raises httpx.HTTPStatusError: If the API request fails.<br>    """<br>    endpoint = get_api_url(f"{PROJECTS_PATH}/{project_id}")<br>    response = await delete_async(<br>        self._client,<br>        endpoint,<br>        self._token,<br>        self._request_id_fn() if self._request_id_fn else None,<br>    )<br>    return response.is_success<br>``` |

## `delete_section(section_id)``async`

Delete a section.

All tasks within the section will also be deleted.

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `section_id` | `str` | The ID of the section to delete. | _required_ |

Returns:

| Type | Description |
| --- | --- |
| `bool` | True if the section was deleted successfully, False otherwise (possibly raise `HTTPError` instead). |

Raises:

| Type | Description |
| --- | --- |
| `httpx.HTTPStatusError` | If the API request fails. |

Source code in `todoist_api_python/api_async.py`

|     |     |
| --- | --- |
| ```<br>1072<br>1073<br>1074<br>1075<br>1076<br>1077<br>1078<br>1079<br>1080<br>1081<br>1082<br>1083<br>1084<br>1085<br>1086<br>1087<br>1088<br>1089<br>1090<br>``` | ```<br>async def delete_section(self, section_id: str) -> bool:<br>    """<br>    Delete a section.<br>    All tasks within the section will also be deleted.<br>    :param section_id: The ID of the section to delete.<br>    :return: True if the section was deleted successfully,<br>             False otherwise (possibly raise `HTTPError` instead).<br>    :raises httpx.HTTPStatusError: If the API request fails.<br>    """<br>    endpoint = get_api_url(f"{SECTIONS_PATH}/{section_id}")<br>    response = await delete_async(<br>        self._client,<br>        endpoint,<br>        self._token,<br>        self._request_id_fn() if self._request_id_fn else None,<br>    )<br>    return response.is_success<br>``` |

## `delete_task(task_id)``async`

Delete a task.

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `task_id` | `str` | The ID of the task to delete. | _required_ |

Returns:

| Type | Description |
| --- | --- |
| `bool` | True if the task was deleted successfully, False otherwise (possibly raise `HTTPError` instead). |

Raises:

| Type | Description |
| --- | --- |
| `httpx.HTTPStatusError` | If the API request fails. |

Source code in `todoist_api_python/api_async.py`

|     |     |
| --- | --- |
| ```<br>532<br>533<br>534<br>535<br>536<br>537<br>538<br>539<br>540<br>541<br>542<br>543<br>544<br>545<br>546<br>547<br>548<br>``` | ```<br>async def delete_task(self, task_id: str) -> bool:<br>    """<br>    Delete a task.<br>    :param task_id: The ID of the task to delete.<br>    :return: True if the task was deleted successfully,<br>             False otherwise (possibly raise `HTTPError` instead).<br>    :raises httpx.HTTPStatusError: If the API request fails.<br>    """<br>    endpoint = get_api_url(f"{TASKS_PATH}/{task_id}")<br>    response = await delete_async(<br>        self._client,<br>        endpoint,<br>        self._token,<br>        self._request_id_fn() if self._request_id_fn else None,<br>    )<br>    return response.is_success<br>``` |

## `filter_tasks(*, query=None, lang=None, limit=None)``async`

Get an iterable of lists of active tasks matching the filter.

The response is an iterable of lists of active tasks matching the criteria.
Be aware that each iteration fires off a network request to the Todoist API,
and may result in rate limiting or other API restrictions.

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `query` | `str | None` | Query tasks using Todoist's filter language. | `None` |
| `lang` | `str | None` | Language for task content (e.g., 'en'). | `None` |
| `limit` | `int | None` | Maximum number of tasks per page. | `None` |

Returns:

| Type | Description |
| --- | --- |
| `AsyncIterator[list[Task]]` | An iterable of lists of tasks. |

Raises:

| Type | Description |
| --- | --- |
| `httpx.HTTPStatusError` | If the API request fails. |
| `TypeError` | If the API response structure is unexpected. |

Source code in `todoist_api_python/api_async.py`

|     |     |
| --- | --- |
| ```<br>202<br>203<br>204<br>205<br>206<br>207<br>208<br>209<br>210<br>211<br>212<br>213<br>214<br>215<br>216<br>217<br>218<br>219<br>220<br>221<br>222<br>223<br>224<br>225<br>226<br>227<br>228<br>229<br>230<br>231<br>232<br>233<br>234<br>235<br>``` | ```<br>async def filter_tasks(<br>    self,<br>    *,<br>    query: Annotated[str, MaxLen(1024)] | None = None,<br>    lang: str | None = None,<br>    limit: Annotated[int, Ge(1), Le(200)] | None = None,<br>) -> AsyncIterator[list[Task]]:<br>    """<br>    Get an iterable of lists of active tasks matching the filter.<br>    The response is an iterable of lists of active tasks matching the criteria.<br>    Be aware that each iteration fires off a network request to the Todoist API,<br>    and may result in rate limiting or other API restrictions.<br>    :param query: Query tasks using Todoist's filter language.<br>    :param lang: Language for task content (e.g., 'en').<br>    :param limit: Maximum number of tasks per page.<br>    :return: An iterable of lists of tasks.<br>    :raises httpx.HTTPStatusError: If the API request fails.<br>    :raises TypeError: If the API response structure is unexpected.<br>    """<br>    endpoint = get_api_url(TASKS_FILTER_PATH)<br>    params = kwargs_without_none(query=query, lang=lang, limit=limit)<br>    return AsyncResultsPaginator(<br>        self._client,<br>        endpoint,<br>        "results",<br>        Task.from_dict,<br>        self._token,<br>        self._request_id_fn,<br>        params,<br>    )<br>``` |

## `get_collaborators(project_id, limit=None)``async`

Get an iterable of lists of collaborators in shared projects.

The response is an iterable of lists of collaborators in shared projects,
Be aware that each iteration fires off a network request to the Todoist API,
and may result in rate limiting or other API restrictions.

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `project_id` | `str` | The ID of the project. | _required_ |
| `limit` | `int | None` | Maximum number of collaborators per page. | `None` |

Returns:

| Type | Description |
| --- | --- |
| `AsyncIterator[list[Collaborator]]` | An iterable of lists of collaborators. |

Raises:

| Type | Description |
| --- | --- |
| `httpx.HTTPStatusError` | If the API request fails. |
| `TypeError` | If the API response structure is unexpected. |

Source code in `todoist_api_python/api_async.py`

|     |     |
| --- | --- |
| ```<br>896<br>897<br>898<br>899<br>900<br>901<br>902<br>903<br>904<br>905<br>906<br>907<br>908<br>909<br>910<br>911<br>912<br>913<br>914<br>915<br>916<br>917<br>918<br>919<br>920<br>921<br>922<br>923<br>924<br>``` | ```<br>async def get_collaborators(<br>    self,<br>    project_id: str,<br>    limit: Annotated[int, Ge(1), Le(200)] | None = None,<br>) -> AsyncIterator[list[Collaborator]]:<br>    """<br>    Get an iterable of lists of collaborators in shared projects.<br>    The response is an iterable of lists of collaborators in shared projects,<br>    Be aware that each iteration fires off a network request to the Todoist API,<br>    and may result in rate limiting or other API restrictions.<br>    :param project_id: The ID of the project.<br>    :param limit: Maximum number of collaborators per page.<br>    :return: An iterable of lists of collaborators.<br>    :raises httpx.HTTPStatusError: If the API request fails.<br>    :raises TypeError: If the API response structure is unexpected.<br>    """<br>    endpoint = get_api_url(f"{PROJECTS_PATH}/{project_id}/{COLLABORATORS_PATH}")<br>    params = kwargs_without_none(limit=limit)<br>    return AsyncResultsPaginator(<br>        self._client,<br>        endpoint,<br>        "results",<br>        Collaborator.from_dict,<br>        self._token,<br>        self._request_id_fn,<br>        params,<br>    )<br>``` |

## `get_comment(comment_id)``async`

Get a specific comment by its ID.

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `comment_id` | `str` | The ID of the comment to retrieve. | _required_ |

Returns:

| Type | Description |
| --- | --- |
| `Comment` | The requested comment. |

Raises:

| Type | Description |
| --- | --- |
| `httpx.HTTPStatusError` | If the API request fails. |
| `TypeError` | If the API response is not a valid Comment dictionary. |

Source code in `todoist_api_python/api_async.py`

|     |     |
| --- | --- |
| ```<br>1092<br>1093<br>1094<br>1095<br>1096<br>1097<br>1098<br>1099<br>1100<br>1101<br>1102<br>1103<br>1104<br>1105<br>1106<br>1107<br>1108<br>1109<br>``` | ```<br>async def get_comment(self, comment_id: str) -> Comment:<br>    """<br>    Get a specific comment by its ID.<br>    :param comment_id: The ID of the comment to retrieve.<br>    :return: The requested comment.<br>    :raises httpx.HTTPStatusError: If the API request fails.<br>    :raises TypeError: If the API response is not a valid Comment dictionary.<br>    """<br>    endpoint = get_api_url(f"{COMMENTS_PATH}/{comment_id}")<br>    response = await get_async(<br>        self._client,<br>        endpoint,<br>        self._token,<br>        self._request_id_fn() if self._request_id_fn else None,<br>    )<br>    data = response_json_dict(response)<br>    return Comment.from_dict(data)<br>``` |

## `get_comments(*, project_id=None, task_id=None, limit=None)``async`

Get an iterable of lists of comments for a task or project.

Requires either `project_id` or `task_id` to be set.

The response is an iterable of lists of comments.
Be aware that each iteration fires off a network request to the Todoist API,
and may result in rate limiting or other API restrictions.

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `project_id` | `str | None` | The ID of the project to retrieve comments for. | `None` |
| `task_id` | `str | None` | The ID of the task to retrieve comments for. | `None` |
| `limit` | `int | None` | Maximum number of comments per page. | `None` |

Returns:

| Type | Description |
| --- | --- |
| `AsyncIterator[list[Comment]]` | An iterable of lists of comments. |

Raises:

| Type | Description |
| --- | --- |
| `ValueError` | If neither `project_id` nor `task_id` is provided. |
| `httpx.HTTPStatusError` | If the API request fails. |
| `TypeError` | If the API response structure is unexpected. |

Source code in `todoist_api_python/api_async.py`

|     |     |
| --- | --- |
| ```<br>1111<br>1112<br>1113<br>1114<br>1115<br>1116<br>1117<br>1118<br>1119<br>1120<br>1121<br>1122<br>1123<br>1124<br>1125<br>1126<br>1127<br>1128<br>1129<br>1130<br>1131<br>1132<br>1133<br>1134<br>1135<br>1136<br>1137<br>1138<br>1139<br>1140<br>1141<br>1142<br>1143<br>1144<br>1145<br>1146<br>1147<br>1148<br>1149<br>1150<br>1151<br>1152<br>1153<br>1154<br>``` | ```<br>async def get_comments(<br>    self,<br>    *,<br>    project_id: str | None = None,<br>    task_id: str | None = None,<br>    limit: Annotated[int, Ge(1), Le(200)] | None = None,<br>) -> AsyncIterator[list[Comment]]:<br>    """<br>    Get an iterable of lists of comments for a task or project.<br>    Requires either `project_id` or `task_id` to be set.<br>    The response is an iterable of lists of comments.<br>    Be aware that each iteration fires off a network request to the Todoist API,<br>    and may result in rate limiting or other API restrictions.<br>    :param project_id: The ID of the project to retrieve comments for.<br>    :param task_id: The ID of the task to retrieve comments for.<br>    :param limit: Maximum number of comments per page.<br>    :return: An iterable of lists of comments.<br>    :raises ValueError: If neither `project_id` nor `task_id` is provided.<br>    :raises httpx.HTTPStatusError: If the API request fails.<br>    :raises TypeError: If the API response structure is unexpected.<br>    """<br>    if project_id is None and task_id is None:<br>        raise ValueError("Either `project_id` or `task_id` must be provided.")<br>    endpoint = get_api_url(COMMENTS_PATH)<br>    params = kwargs_without_none(<br>        project_id=project_id,<br>        task_id=task_id,<br>        limit=limit,<br>    )<br>    return AsyncResultsPaginator(<br>        self._client,<br>        endpoint,<br>        "results",<br>        Comment.from_dict,<br>        self._token,<br>        self._request_id_fn,<br>        params,<br>    )<br>``` |

## `get_completed_tasks_by_completion_date(*, since, until, workspace_id=None, filter_query=None, filter_lang=None, limit=None)``async`

Get an iterable of lists of completed tasks within a date range.

Retrieves tasks completed within a specific date range (up to 3 months).
Supports filtering by workspace or a filter query.

The response is an iterable of lists of completed tasks. Be aware that each
iteration fires off a network request to the Todoist API, and may result in
rate limiting or other API restrictions.

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `since` | `datetime` | Start of the date range (inclusive). | _required_ |
| `until` | `datetime` | End of the date range (inclusive). | _required_ |
| `workspace_id` | `str | None` | Filter by workspace ID. | `None` |
| `filter_query` | `str | None` | Filter by a query string. | `None` |
| `filter_lang` | `str | None` | Language for the filter query (e.g., 'en'). | `None` |
| `limit` | `int | None` | Maximum number of tasks per page (default 50). | `None` |

Returns:

| Type | Description |
| --- | --- |
| `AsyncIterator[list[Task]]` | An iterable of lists of completed tasks. |

Raises:

| Type | Description |
| --- | --- |
| `httpx.HTTPStatusError` | If the API request fails. |
| `TypeError` | If the API response structure is unexpected. |

Source code in `todoist_api_python/api_async.py`

|     |     |
| --- | --- |
| ```<br>610<br>611<br>612<br>613<br>614<br>615<br>616<br>617<br>618<br>619<br>620<br>621<br>622<br>623<br>624<br>625<br>626<br>627<br>628<br>629<br>630<br>631<br>632<br>633<br>634<br>635<br>636<br>637<br>638<br>639<br>640<br>641<br>642<br>643<br>644<br>645<br>646<br>647<br>648<br>649<br>650<br>651<br>652<br>653<br>654<br>655<br>656<br>657<br>658<br>659<br>``` | ```<br>async def get_completed_tasks_by_completion_date(<br>    self,<br>    *,<br>    since: datetime,<br>    until: datetime,<br>    workspace_id: str | None = None,<br>    filter_query: str | None = None,<br>    filter_lang: str | None = None,<br>    limit: Annotated[int, Ge(1), Le(200)] | None = None,<br>) -> AsyncIterator[list[Task]]:<br>    """<br>    Get an iterable of lists of completed tasks within a date range.<br>    Retrieves tasks completed within a specific date range (up to 3 months).<br>    Supports filtering by workspace or a filter query.<br>    The response is an iterable of lists of completed tasks. Be aware that each<br>    iteration fires off a network request to the Todoist API, and may result in<br>    rate limiting or other API restrictions.<br>    :param since: Start of the date range (inclusive).<br>    :param until: End of the date range (inclusive).<br>    :param workspace_id: Filter by workspace ID.<br>    :param filter_query: Filter by a query string.<br>    :param filter_lang: Language for the filter query (e.g., 'en').<br>    :param limit: Maximum number of tasks per page (default 50).<br>    :return: An iterable of lists of completed tasks.<br>    :raises httpx.HTTPStatusError: If the API request fails.<br>    :raises TypeError: If the API response structure is unexpected.<br>    """<br>    endpoint = get_api_url(TASKS_COMPLETED_BY_COMPLETION_DATE_PATH)<br>    params = kwargs_without_none(<br>        since=format_datetime(since),<br>        until=format_datetime(until),<br>        workspace_id=workspace_id,<br>        filter_query=filter_query,<br>        filter_lang=filter_lang,<br>        limit=limit,<br>    )<br>    return AsyncResultsPaginator(<br>        self._client,<br>        endpoint,<br>        "items",<br>        Task.from_dict,<br>        self._token,<br>        self._request_id_fn,<br>        params,<br>    )<br>``` |

## `get_completed_tasks_by_due_date(*, since, until, workspace_id=None, project_id=None, section_id=None, parent_id=None, filter_query=None, filter_lang=None, limit=None)``async`

Get an iterable of lists of completed tasks within a due date range.

Retrieves tasks completed within a specific due date range (up to 6 weeks).
Supports filtering by workspace, project, section, parent task, or a query.

The response is an iterable of lists of completed tasks. Be aware that each
iteration fires off a network request to the Todoist API, and may result in
rate limiting or other API restrictions.

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `since` | `datetime` | Start of the date range (inclusive). | _required_ |
| `until` | `datetime` | End of the date range (inclusive). | _required_ |
| `workspace_id` | `str | None` | Filter by workspace ID. | `None` |
| `project_id` | `str | None` | Filter by project ID. | `None` |
| `section_id` | `str | None` | Filter by section ID. | `None` |
| `parent_id` | `str | None` | Filter by parent task ID. | `None` |
| `filter_query` | `str | None` | Filter by a query string. | `None` |
| `filter_lang` | `str | None` | Language for the filter query (e.g., 'en'). | `None` |
| `limit` | `int | None` | Maximum number of tasks per page (default 50). | `None` |

Returns:

| Type | Description |
| --- | --- |
| `AsyncIterator[list[Task]]` | An iterable of lists of completed tasks. |

Raises:

| Type | Description |
| --- | --- |
| `httpx.HTTPStatusError` | If the API request fails. |
| `TypeError` | If the API response structure is unexpected. |

Source code in `todoist_api_python/api_async.py`

|     |     |
| --- | --- |
| ```<br>550<br>551<br>552<br>553<br>554<br>555<br>556<br>557<br>558<br>559<br>560<br>561<br>562<br>563<br>564<br>565<br>566<br>567<br>568<br>569<br>570<br>571<br>572<br>573<br>574<br>575<br>576<br>577<br>578<br>579<br>580<br>581<br>582<br>583<br>584<br>585<br>586<br>587<br>588<br>589<br>590<br>591<br>592<br>593<br>594<br>595<br>596<br>597<br>598<br>599<br>600<br>601<br>602<br>603<br>604<br>605<br>606<br>607<br>608<br>``` | ```<br>async def get_completed_tasks_by_due_date(<br>    self,<br>    *,<br>    since: datetime,<br>    until: datetime,<br>    workspace_id: str | None = None,<br>    project_id: str | None = None,<br>    section_id: str | None = None,<br>    parent_id: str | None = None,<br>    filter_query: str | None = None,<br>    filter_lang: str | None = None,<br>    limit: Annotated[int, Ge(1), Le(200)] | None = None,<br>) -> AsyncIterator[list[Task]]:<br>    """<br>    Get an iterable of lists of completed tasks within a due date range.<br>    Retrieves tasks completed within a specific due date range (up to 6 weeks).<br>    Supports filtering by workspace, project, section, parent task, or a query.<br>    The response is an iterable of lists of completed tasks. Be aware that each<br>    iteration fires off a network request to the Todoist API, and may result in<br>    rate limiting or other API restrictions.<br>    :param since: Start of the date range (inclusive).<br>    :param until: End of the date range (inclusive).<br>    :param workspace_id: Filter by workspace ID.<br>    :param project_id: Filter by project ID.<br>    :param section_id: Filter by section ID.<br>    :param parent_id: Filter by parent task ID.<br>    :param filter_query: Filter by a query string.<br>    :param filter_lang: Language for the filter query (e.g., 'en').<br>    :param limit: Maximum number of tasks per page (default 50).<br>    :return: An iterable of lists of completed tasks.<br>    :raises httpx.HTTPStatusError: If the API request fails.<br>    :raises TypeError: If the API response structure is unexpected.<br>    """<br>    endpoint = get_api_url(TASKS_COMPLETED_BY_DUE_DATE_PATH)<br>    params = kwargs_without_none(<br>        since=format_datetime(since),<br>        until=format_datetime(until),<br>        workspace_id=workspace_id,<br>        project_id=project_id,<br>        section_id=section_id,<br>        parent_id=parent_id,<br>        filter_query=filter_query,<br>        filter_lang=filter_lang,<br>        limit=limit,<br>    )<br>    return AsyncResultsPaginator(<br>        self._client,<br>        endpoint,<br>        "items",<br>        Task.from_dict,<br>        self._token,<br>        self._request_id_fn,<br>        params,<br>    )<br>``` |

## `get_label(label_id)``async`

Get a specific personal label by its ID.

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `label_id` | `str` | The ID of the label to retrieve. | _required_ |

Returns:

| Type | Description |
| --- | --- |
| `Label` | The requested label. |

Raises:

| Type | Description |
| --- | --- |
| `httpx.HTTPStatusError` | If the API request fails. |
| `TypeError` | If the API response is not a valid Label dictionary. |

Source code in `todoist_api_python/api_async.py`

|     |     |
| --- | --- |
| ```<br>1246<br>1247<br>1248<br>1249<br>1250<br>1251<br>1252<br>1253<br>1254<br>1255<br>1256<br>1257<br>1258<br>1259<br>1260<br>1261<br>1262<br>1263<br>``` | ```<br>async def get_label(self, label_id: str) -> Label:<br>    """<br>    Get a specific personal label by its ID.<br>    :param label_id: The ID of the label to retrieve.<br>    :return: The requested label.<br>    :raises httpx.HTTPStatusError: If the API request fails.<br>    :raises TypeError: If the API response is not a valid Label dictionary.<br>    """<br>    endpoint = get_api_url(f"{LABELS_PATH}/{label_id}")<br>    response = await get_async(<br>        self._client,<br>        endpoint,<br>        self._token,<br>        self._request_id_fn() if self._request_id_fn else None,<br>    )<br>    data = response_json_dict(response)<br>    return Label.from_dict(data)<br>``` |

## `get_labels(*, limit=None)``async`

Get an iterable of lists of personal labels.

Supports pagination arguments.

The response is an iterable of lists of personal labels.
Be aware that each iteration fires off a network request to the Todoist API,
and may result in rate limiting or other API restrictions.

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `limit` | `int | None` | Maximum number of labels per page. | `None` |

Returns:

| Type | Description |
| --- | --- |
| `AsyncIterator[list[Label]]` | An iterable of lists of personal labels. |

Raises:

| Type | Description |
| --- | --- |
| `httpx.HTTPStatusError` | If the API request fails. |
| `TypeError` | If the API response structure is unexpected. |

Source code in `todoist_api_python/api_async.py`

|     |     |
| --- | --- |
| ```<br>1265<br>1266<br>1267<br>1268<br>1269<br>1270<br>1271<br>1272<br>1273<br>1274<br>1275<br>1276<br>1277<br>1278<br>1279<br>1280<br>1281<br>1282<br>1283<br>1284<br>1285<br>1286<br>1287<br>1288<br>1289<br>1290<br>1291<br>1292<br>1293<br>1294<br>1295<br>1296<br>``` | ```<br>async def get_labels(<br>    self,<br>    *,<br>    limit: Annotated[int, Ge(1), Le(200)] | None = None,<br>) -> AsyncIterator[list[Label]]:<br>    """<br>    Get an iterable of lists of personal labels.<br>    Supports pagination arguments.<br>    The response is an iterable of lists of personal labels.<br>    Be aware that each iteration fires off a network request to the Todoist API,<br>    and may result in rate limiting or other API restrictions.<br>    :param limit: Maximum number of labels per page.<br>    :return: An iterable of lists of personal labels.<br>    :raises httpx.HTTPStatusError: If the API request fails.<br>    :raises TypeError: If the API response structure is unexpected.<br>    """<br>    endpoint = get_api_url(LABELS_PATH)<br>    params = kwargs_without_none(limit=limit)<br>    return AsyncResultsPaginator(<br>        self._client,<br>        endpoint,<br>        "results",<br>        Label.from_dict,<br>        self._token,<br>        self._request_id_fn,<br>        params,<br>    )<br>``` |

## `get_project(project_id)``async`

Get a project by its ID.

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `project_id` | `str` | The ID of the project to retrieve. | _required_ |

Returns:

| Type | Description |
| --- | --- |
| `Project` | The requested project. |

Raises:

| Type | Description |
| --- | --- |
| `httpx.HTTPStatusError` | If the API request fails. |
| `TypeError` | If the API response is not a valid Project dictionary. |

Source code in `todoist_api_python/api_async.py`

|     |     |
| --- | --- |
| ```<br>661<br>662<br>663<br>664<br>665<br>666<br>667<br>668<br>669<br>670<br>671<br>672<br>673<br>674<br>675<br>676<br>677<br>678<br>``` | ```<br>async def get_project(self, project_id: str) -> Project:<br>    """<br>    Get a project by its ID.<br>    :param project_id: The ID of the project to retrieve.<br>    :return: The requested project.<br>    :raises httpx.HTTPStatusError: If the API request fails.<br>    :raises TypeError: If the API response is not a valid Project dictionary.<br>    """<br>    endpoint = get_api_url(f"{PROJECTS_PATH}/{project_id}")<br>    response = await get_async(<br>        self._client,<br>        endpoint,<br>        self._token,<br>        self._request_id_fn() if self._request_id_fn else None,<br>    )<br>    data = response_json_dict(response)<br>    return Project.from_dict(data)<br>``` |

## `get_projects(limit=None)``async`

Get an iterable of lists of active projects.

The response is an iterable of lists of active projects.
Be aware that each iteration fires off a network request to the Todoist API,
and may result in rate limiting or other API restrictions.

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `limit` | `int | None` | Maximum number of projects per page. | `None` |

Returns:

| Type | Description |
| --- | --- |
| `AsyncIterator[list[Project]]` | An iterable of lists of projects. |

Raises:

| Type | Description |
| --- | --- |
| `httpx.HTTPStatusError` | If the API request fails. |
| `TypeError` | If the API response structure is unexpected. |

Source code in `todoist_api_python/api_async.py`

|     |     |
| --- | --- |
| ```<br>680<br>681<br>682<br>683<br>684<br>685<br>686<br>687<br>688<br>689<br>690<br>691<br>692<br>693<br>694<br>695<br>696<br>697<br>698<br>699<br>700<br>701<br>702<br>703<br>704<br>705<br>706<br>``` | ```<br>async def get_projects(<br>    self,<br>    limit: Annotated[int, Ge(1), Le(200)] | None = None,<br>) -> AsyncIterator[list[Project]]:<br>    """<br>    Get an iterable of lists of active projects.<br>    The response is an iterable of lists of active projects.<br>    Be aware that each iteration fires off a network request to the Todoist API,<br>    and may result in rate limiting or other API restrictions.<br>    :param limit: Maximum number of projects per page.<br>    :return: An iterable of lists of projects.<br>    :raises httpx.HTTPStatusError: If the API request fails.<br>    :raises TypeError: If the API response structure is unexpected.<br>    """<br>    endpoint = get_api_url(PROJECTS_PATH)<br>    params = kwargs_without_none(limit=limit)<br>    return AsyncResultsPaginator(<br>        self._client,<br>        endpoint,<br>        "results",<br>        Project.from_dict,<br>        self._token,<br>        self._request_id_fn,<br>        params,<br>    )<br>``` |

## `get_section(section_id)``async`

Get a specific section by its ID.

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `section_id` | `str` | The ID of the section to retrieve. | _required_ |

Returns:

| Type | Description |
| --- | --- |
| `Section` | The requested section. |

Raises:

| Type | Description |
| --- | --- |
| `httpx.HTTPStatusError` | If the API request fails. |
| `TypeError` | If the API response is not a valid Section dictionary. |

Source code in `todoist_api_python/api_async.py`

|     |     |
| --- | --- |
| ```<br>926<br>927<br>928<br>929<br>930<br>931<br>932<br>933<br>934<br>935<br>936<br>937<br>938<br>939<br>940<br>941<br>942<br>943<br>``` | ```<br>async def get_section(self, section_id: str) -> Section:<br>    """<br>    Get a specific section by its ID.<br>    :param section_id: The ID of the section to retrieve.<br>    :return: The requested section.<br>    :raises httpx.HTTPStatusError: If the API request fails.<br>    :raises TypeError: If the API response is not a valid Section dictionary.<br>    """<br>    endpoint = get_api_url(f"{SECTIONS_PATH}/{section_id}")<br>    response = await get_async(<br>        self._client,<br>        endpoint,<br>        self._token,<br>        self._request_id_fn() if self._request_id_fn else None,<br>    )<br>    data = response_json_dict(response)<br>    return Section.from_dict(data)<br>``` |

## `get_sections(project_id=None, *, limit=None)``async`

Get an iterable of lists of active sections.

Supports filtering by `project_id` and pagination arguments.

The response is an iterable of lists of active sections.
Be aware that each iteration fires off a network request to the Todoist API,
and may result in rate limiting or other API restrictions.

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `project_id` | `str | None` | Filter sections by project ID. | `None` |
| `limit` | `int | None` | Maximum number of sections per page. | `None` |

Returns:

| Type | Description |
| --- | --- |
| `AsyncIterator[list[Section]]` | An iterable of lists of sections. |

Raises:

| Type | Description |
| --- | --- |
| `httpx.HTTPStatusError` | If the API request fails. |
| `TypeError` | If the API response structure is unexpected. |

Source code in `todoist_api_python/api_async.py`

|     |     |
| --- | --- |
| ```<br>945<br>946<br>947<br>948<br>949<br>950<br>951<br>952<br>953<br>954<br>955<br>956<br>957<br>958<br>959<br>960<br>961<br>962<br>963<br>964<br>965<br>966<br>967<br>968<br>969<br>970<br>971<br>972<br>973<br>974<br>975<br>976<br>977<br>978<br>``` | ```<br>async def get_sections(<br>    self,<br>    project_id: str | None = None,<br>    *,<br>    limit: Annotated[int, Ge(1), Le(200)] | None = None,<br>) -> AsyncIterator[list[Section]]:<br>    """<br>    Get an iterable of lists of active sections.<br>    Supports filtering by `project_id` and pagination arguments.<br>    The response is an iterable of lists of active sections.<br>    Be aware that each iteration fires off a network request to the Todoist API,<br>    and may result in rate limiting or other API restrictions.<br>    :param project_id: Filter sections by project ID.<br>    :param limit: Maximum number of sections per page.<br>    :return: An iterable of lists of sections.<br>    :raises httpx.HTTPStatusError: If the API request fails.<br>    :raises TypeError: If the API response structure is unexpected.<br>    """<br>    endpoint = get_api_url(SECTIONS_PATH)<br>    params = kwargs_without_none(project_id=project_id, limit=limit)<br>    return AsyncResultsPaginator(<br>        self._client,<br>        endpoint,<br>        "results",<br>        Section.from_dict,<br>        self._token,<br>        self._request_id_fn,<br>        params,<br>    )<br>``` |

## `get_shared_labels(*, omit_personal=False, limit=None)``async`

Get an iterable of lists of shared label names.

Includes labels from collaborators on shared projects that are not in the
user's personal labels. Can optionally exclude personal label names using
`omit_personal=True`. Supports pagination arguments.

The response is an iterable of lists of shared label names.
Be aware that each iteration fires off a network request to the Todoist API,
and may result in rate limiting or other API restrictions.

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `omit_personal` | `bool` | Optional boolean flag to omit personal label names. | `False` |
| `limit` | `int | None` | Maximum number of labels per page. | `None` |

Returns:

| Type | Description |
| --- | --- |
| `AsyncIterator[list[str]]` | An iterable of lists of shared label names (strings). |

Raises:

| Type | Description |
| --- | --- |
| `httpx.HTTPStatusError` | If the API request fails. |
| `TypeError` | If the API response structure is unexpected. |

Source code in `todoist_api_python/api_async.py`

|     |     |
| --- | --- |
| ```<br>1430<br>1431<br>1432<br>1433<br>1434<br>1435<br>1436<br>1437<br>1438<br>1439<br>1440<br>1441<br>1442<br>1443<br>1444<br>1445<br>1446<br>1447<br>1448<br>1449<br>1450<br>1451<br>1452<br>1453<br>1454<br>1455<br>1456<br>1457<br>1458<br>1459<br>1460<br>1461<br>1462<br>1463<br>1464<br>1465<br>``` | ```<br>async def get_shared_labels(<br>    self,<br>    *,<br>    omit_personal: bool = False,<br>    limit: Annotated[int, Ge(1), Le(200)] | None = None,<br>) -> AsyncIterator[list[str]]:<br>    """<br>    Get an iterable of lists of shared label names.<br>    Includes labels from collaborators on shared projects that are not in the<br>    user's personal labels. Can optionally exclude personal label names using<br>    `omit_personal=True`. Supports pagination arguments.<br>    The response is an iterable of lists of shared label names.<br>    Be aware that each iteration fires off a network request to the Todoist API,<br>    and may result in rate limiting or other API restrictions.<br>    :param omit_personal: Optional boolean flag to omit personal label names.<br>    :param limit: Maximum number of labels per page.<br>    :return: An iterable of lists of shared label names (strings).<br>    :raises httpx.HTTPStatusError: If the API request fails.<br>    :raises TypeError: If the API response structure is unexpected.<br>    """<br>    endpoint = get_api_url(SHARED_LABELS_PATH)<br>    params = kwargs_without_none(omit_personal=omit_personal, limit=limit)<br>    return AsyncResultsPaginator(<br>        self._client,<br>        endpoint,<br>        "results",<br>        str,<br>        self._token,<br>        self._request_id_fn,<br>        params,<br>    )<br>``` |

## `get_task(task_id)``async`

Get a specific task by its ID.

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `task_id` | `str` | The ID of the task to retrieve. | _required_ |

Returns:

| Type | Description |
| --- | --- |
| `Task` | The requested task. |

Raises:

| Type | Description |
| --- | --- |
| `httpx.HTTPStatusError` | If the API request fails. |
| `TypeError` | If the API response is not a valid Task dictionary. |

Source code in `todoist_api_python/api_async.py`

|     |     |
| --- | --- |
| ```<br>135<br>136<br>137<br>138<br>139<br>140<br>141<br>142<br>143<br>144<br>145<br>146<br>147<br>148<br>149<br>150<br>151<br>152<br>``` | ```<br>async def get_task(self, task_id: str) -> Task:<br>    """<br>    Get a specific task by its ID.<br>    :param task_id: The ID of the task to retrieve.<br>    :return: The requested task.<br>    :raises httpx.HTTPStatusError: If the API request fails.<br>    :raises TypeError: If the API response is not a valid Task dictionary.<br>    """<br>    endpoint = get_api_url(f"{TASKS_PATH}/{task_id}")<br>    response = await get_async(<br>        self._client,<br>        endpoint,<br>        self._token,<br>        self._request_id_fn() if self._request_id_fn else None,<br>    )<br>    data = response_json_dict(response)<br>    return Task.from_dict(data)<br>``` |

## `get_tasks(*, project_id=None, section_id=None, parent_id=None, label=None, ids=None, limit=None)``async`

Get an iterable of lists of active tasks.

The response is an iterable of lists of active tasks matching the criteria.
Be aware that each iteration fires off a network request to the Todoist API,
and may result in rate limiting or other API restrictions.

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `project_id` | `str | None` | Filter tasks by project ID. | `None` |
| `section_id` | `str | None` | Filter tasks by section ID. | `None` |
| `parent_id` | `str | None` | Filter tasks by parent task ID. | `None` |
| `label` | `str | None` | Filter tasks by label name. | `None` |
| `ids` | `list[str] | None` | A list of the IDs of the tasks to retrieve. | `None` |
| `limit` | `int | None` | Maximum number of tasks per page. | `None` |

Returns:

| Type | Description |
| --- | --- |
| `AsyncIterator[list[Task]]` | An iterable of lists of tasks. |

Raises:

| Type | Description |
| --- | --- |
| `httpx.HTTPStatusError` | If the API request fails. |
| `TypeError` | If the API response structure is unexpected. |

Source code in `todoist_api_python/api_async.py`

|     |     |
| --- | --- |
| ```<br>154<br>155<br>156<br>157<br>158<br>159<br>160<br>161<br>162<br>163<br>164<br>165<br>166<br>167<br>168<br>169<br>170<br>171<br>172<br>173<br>174<br>175<br>176<br>177<br>178<br>179<br>180<br>181<br>182<br>183<br>184<br>185<br>186<br>187<br>188<br>189<br>190<br>191<br>192<br>193<br>194<br>195<br>196<br>197<br>198<br>199<br>200<br>``` | ```<br>async def get_tasks(<br>    self,<br>    *,<br>    project_id: str | None = None,<br>    section_id: str | None = None,<br>    parent_id: str | None = None,<br>    label: str | None = None,<br>    ids: list[str] | None = None,<br>    limit: Annotated[int, Ge(1), Le(200)] | None = None,<br>) -> AsyncIterator[list[Task]]:<br>    """<br>    Get an iterable of lists of active tasks.<br>    The response is an iterable of lists of active tasks matching the criteria.<br>    Be aware that each iteration fires off a network request to the Todoist API,<br>    and may result in rate limiting or other API restrictions.<br>    :param project_id: Filter tasks by project ID.<br>    :param section_id: Filter tasks by section ID.<br>    :param parent_id: Filter tasks by parent task ID.<br>    :param label: Filter tasks by label name.<br>    :param ids: A list of the IDs of the tasks to retrieve.<br>    :param limit: Maximum number of tasks per page.<br>    :return: An iterable of lists of tasks.<br>    :raises httpx.HTTPStatusError: If the API request fails.<br>    :raises TypeError: If the API response structure is unexpected.<br>    """<br>    endpoint = get_api_url(TASKS_PATH)<br>    params = kwargs_without_none(<br>        project_id=project_id,<br>        section_id=section_id,<br>        parent_id=parent_id,<br>        label=label,<br>        ids=",".join(str(i) for i in ids) if ids is not None else None,<br>        limit=limit,<br>    )<br>    return AsyncResultsPaginator(<br>        self._client,<br>        endpoint,<br>        "results",<br>        Task.from_dict,<br>        self._token,<br>        self._request_id_fn,<br>        params,<br>    )<br>``` |

## `move_task(task_id, project_id=None, section_id=None, parent_id=None)``async`

Move a task to a different project, section, or parent task.

`project_id` takes predence, followed by
`section_id` (which also updates `project_id`),
and then `parent_id` (which also updates `section_id` and `project_id`).

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `task_id` | `str` | The ID of the task to move. | _required_ |
| `project_id` | `str | None` | The ID of the project to move the task to. | `None` |
| `section_id` | `str | None` | The ID of the section to move the task to. | `None` |
| `parent_id` | `str | None` | The ID of the parent to move the task to. | `None` |

Returns:

| Type | Description |
| --- | --- |
| `bool` | True if the task was moved successfully, False otherwise (possibly raise `HTTPError` instead). |

Raises:

| Type | Description |
| --- | --- |
| `httpx.HTTPStatusError` | If the API request fails. |
| `ValueError` | If neither `project_id`, `section_id`, nor `parent_id` is provided. |

Source code in `todoist_api_python/api_async.py`

|     |     |
| --- | --- |
| ```<br>488<br>489<br>490<br>491<br>492<br>493<br>494<br>495<br>496<br>497<br>498<br>499<br>500<br>501<br>502<br>503<br>504<br>505<br>506<br>507<br>508<br>509<br>510<br>511<br>512<br>513<br>514<br>515<br>516<br>517<br>518<br>519<br>520<br>521<br>522<br>523<br>524<br>525<br>526<br>527<br>528<br>529<br>530<br>``` | ```<br>async def move_task(<br>    self,<br>    task_id: str,<br>    project_id: str | None = None,<br>    section_id: str | None = None,<br>    parent_id: str | None = None,<br>) -> bool:<br>    """<br>    Move a task to a different project, section, or parent task.<br>    `project_id` takes predence, followed by<br>    `section_id` (which also updates `project_id`),<br>    and then `parent_id` (which also updates `section_id` and `project_id`).<br>    :param task_id: The ID of the task to move.<br>    :param project_id: The ID of the project to move the task to.<br>    :param section_id: The ID of the section to move the task to.<br>    :param parent_id: The ID of the parent to move the task to.<br>    :return: True if the task was moved successfully,<br>             False otherwise (possibly raise `HTTPError` instead).<br>    :raises httpx.HTTPStatusError: If the API request fails.<br>    :raises ValueError: If neither `project_id`, `section_id`,<br>            nor `parent_id` is provided.<br>    """<br>    if project_id is None and section_id is None and parent_id is None:<br>        raise ValueError(<br>            "Either `project_id`, `section_id`, or `parent_id` must be provided."<br>        )<br>    data = kwargs_without_none(<br>        project_id=project_id,<br>        section_id=section_id,<br>        parent_id=parent_id,<br>    )<br>    endpoint = get_api_url(f"{TASKS_PATH}/{task_id}/move")<br>    response = await post_async(<br>        self._client,<br>        endpoint,<br>        self._token,<br>        self._request_id_fn() if self._request_id_fn else None,<br>        data=data,<br>    )<br>    return response.is_success<br>``` |

## `remove_shared_label(name)``async`

Remove all occurrences of a shared label across all projects.

This action removes the label string from all tasks where it appears.

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `name` | `str` | The name of the shared label to remove. | _required_ |

Returns:

| Type | Description |
| --- | --- |
| `bool` | True if the removal was successful, |

Raises:

| Type | Description |
| --- | --- |
| `httpx.HTTPStatusError` | If the API request fails. |

Source code in `todoist_api_python/api_async.py`

|     |     |
| --- | --- |
| ```<br>1492<br>1493<br>1494<br>1495<br>1496<br>1497<br>1498<br>1499<br>1500<br>1501<br>1502<br>1503<br>1504<br>1505<br>1506<br>1507<br>1508<br>1509<br>1510<br>1511<br>``` | ```<br>async def remove_shared_label(self, name: Annotated[str, MaxLen(60)]) -> bool:<br>    """<br>    Remove all occurrences of a shared label across all projects.<br>    This action removes the label string from all tasks where it appears.<br>    :param name: The name of the shared label to remove.<br>    :return: True if the removal was successful,<br>    :raises httpx.HTTPStatusError: If the API request fails.<br>    """<br>    endpoint = get_api_url(SHARED_LABELS_REMOVE_PATH)<br>    data = {"name": name}<br>    response = await post_async(<br>        self._client,<br>        endpoint,<br>        self._token,<br>        self._request_id_fn() if self._request_id_fn else None,<br>        data=data,<br>    )<br>    return response.is_success<br>``` |

## `rename_shared_label(name, new_name)``async`

Rename all occurrences of a shared label across all projects.

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `name` | `str` | The current name of the shared label to rename. | _required_ |
| `new_name` | `str` | The new name for the shared label. | _required_ |

Returns:

| Type | Description |
| --- | --- |
| `bool` | True if the rename was successful, False otherwise (possibly raise `HTTPError` instead). |

Raises:

| Type | Description |
| --- | --- |
| `httpx.HTTPStatusError` | If the API request fails. |

Source code in `todoist_api_python/api_async.py`

|     |     |
| --- | --- |
| ```<br>1467<br>1468<br>1469<br>1470<br>1471<br>1472<br>1473<br>1474<br>1475<br>1476<br>1477<br>1478<br>1479<br>1480<br>1481<br>1482<br>1483<br>1484<br>1485<br>1486<br>1487<br>1488<br>1489<br>1490<br>``` | ```<br>async def rename_shared_label(<br>    self,<br>    name: Annotated[str, MaxLen(60)],<br>    new_name: Annotated[str, MinLen(1), MaxLen(60)],<br>) -> bool:<br>    """<br>    Rename all occurrences of a shared label across all projects.<br>    :param name: The current name of the shared label to rename.<br>    :param new_name: The new name for the shared label.<br>    :return: True if the rename was successful,<br>             False otherwise (possibly raise `HTTPError` instead).<br>    :raises httpx.HTTPStatusError: If the API request fails.<br>    """<br>    endpoint = get_api_url(SHARED_LABELS_RENAME_PATH)<br>    response = await post_async(<br>        self._client,<br>        endpoint,<br>        self._token,<br>        self._request_id_fn() if self._request_id_fn else None,<br>        params={"name": name},<br>        data={"new_name": new_name},<br>    )<br>    return response.is_success<br>``` |

## `search_labels(query, *, limit=None)``async`

Search personal labels by name.

The response is an iterable of lists of labels matching the query.
Be aware that each iteration fires off a network request to the Todoist API,
and may result in rate limiting or other API restrictions.

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `query` | `str` | Query string for label names. | _required_ |
| `limit` | `int | None` | Maximum number of labels per page. | `None` |

Returns:

| Type | Description |
| --- | --- |
| `AsyncIterator[list[Label]]` | An iterable of lists of labels. |

Raises:

| Type | Description |
| --- | --- |
| `httpx.HTTPStatusError` | If the API request fails. |
| `TypeError` | If the API response structure is unexpected. |

Source code in `todoist_api_python/api_async.py`

|     |     |
| --- | --- |
| ```<br>1298<br>1299<br>1300<br>1301<br>1302<br>1303<br>1304<br>1305<br>1306<br>1307<br>1308<br>1309<br>1310<br>1311<br>1312<br>1313<br>1314<br>1315<br>1316<br>1317<br>1318<br>1319<br>1320<br>1321<br>1322<br>1323<br>1324<br>1325<br>1326<br>1327<br>1328<br>1329<br>``` | ```<br>async def search_labels(<br>    self,<br>    query: Annotated[str, MinLen(1), MaxLen(1024)],<br>    *,<br>    limit: Annotated[int, Ge(1), Le(200)] | None = None,<br>) -> AsyncIterator[list[Label]]:<br>    """<br>    Search personal labels by name.<br>    The response is an iterable of lists of labels matching the query.<br>    Be aware that each iteration fires off a network request to the Todoist API,<br>    and may result in rate limiting or other API restrictions.<br>    :param query: Query string for label names.<br>    :param limit: Maximum number of labels per page.<br>    :return: An iterable of lists of labels.<br>    :raises httpx.HTTPStatusError: If the API request fails.<br>    :raises TypeError: If the API response structure is unexpected.<br>    """<br>    endpoint = get_api_url(f"{LABELS_PATH}/{LABELS_SEARCH_PATH_SUFFIX}")<br>    params = kwargs_without_none(query=query, limit=limit)<br>    return AsyncResultsPaginator(<br>        self._client,<br>        endpoint,<br>        "results",<br>        Label.from_dict,<br>        self._token,<br>        self._request_id_fn,<br>        params,<br>    )<br>``` |

## `search_projects(query, *, limit=None)``async`

Search active projects by name.

The response is an iterable of lists of projects matching the query.
Be aware that each iteration fires off a network request to the Todoist API,
and may result in rate limiting or other API restrictions.

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `query` | `str` | Query string for project names. | _required_ |
| `limit` | `int | None` | Maximum number of projects per page. | `None` |

Returns:

| Type | Description |
| --- | --- |
| `AsyncIterator[list[Project]]` | An iterable of lists of projects. |

Raises:

| Type | Description |
| --- | --- |
| `httpx.HTTPStatusError` | If the API request fails. |
| `TypeError` | If the API response structure is unexpected. |

Source code in `todoist_api_python/api_async.py`

|     |     |
| --- | --- |
| ```<br>708<br>709<br>710<br>711<br>712<br>713<br>714<br>715<br>716<br>717<br>718<br>719<br>720<br>721<br>722<br>723<br>724<br>725<br>726<br>727<br>728<br>729<br>730<br>731<br>732<br>733<br>734<br>735<br>736<br>737<br>738<br>739<br>``` | ```<br>async def search_projects(<br>    self,<br>    query: Annotated[str, MinLen(1), MaxLen(1024)],<br>    *,<br>    limit: Annotated[int, Ge(1), Le(200)] | None = None,<br>) -> AsyncIterator[list[Project]]:<br>    """<br>    Search active projects by name.<br>    The response is an iterable of lists of projects matching the query.<br>    Be aware that each iteration fires off a network request to the Todoist API,<br>    and may result in rate limiting or other API restrictions.<br>    :param query: Query string for project names.<br>    :param limit: Maximum number of projects per page.<br>    :return: An iterable of lists of projects.<br>    :raises httpx.HTTPStatusError: If the API request fails.<br>    :raises TypeError: If the API response structure is unexpected.<br>    """<br>    endpoint = get_api_url(f"{PROJECTS_PATH}/{PROJECTS_SEARCH_PATH_SUFFIX}")<br>    params = kwargs_without_none(query=query, limit=limit)<br>    return AsyncResultsPaginator(<br>        self._client,<br>        endpoint,<br>        "results",<br>        Project.from_dict,<br>        self._token,<br>        self._request_id_fn,<br>        params,<br>    )<br>``` |

## `search_sections(query, *, project_id=None, limit=None)``async`

Search active sections by name.

The response is an iterable of lists of sections matching the query.
Be aware that each iteration fires off a network request to the Todoist API,
and may result in rate limiting or other API restrictions.

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `query` | `str` | Query string for section names. | _required_ |
| `project_id` | `str | None` | If set, search sections within the given project only. | `None` |
| `limit` | `int | None` | Maximum number of sections per page. | `None` |

Returns:

| Type | Description |
| --- | --- |
| `AsyncIterator[list[Section]]` | An iterable of lists of sections. |

Raises:

| Type | Description |
| --- | --- |
| `httpx.HTTPStatusError` | If the API request fails. |
| `TypeError` | If the API response structure is unexpected. |

Source code in `todoist_api_python/api_async.py`

|     |     |
| --- | --- |
| ```<br> 980<br> 981<br> 982<br> 983<br> 984<br> 985<br> 986<br> 987<br> 988<br> 989<br> 990<br> 991<br> 992<br> 993<br> 994<br> 995<br> 996<br> 997<br> 998<br> 999<br>1000<br>1001<br>1002<br>1003<br>1004<br>1005<br>1006<br>1007<br>1008<br>1009<br>1010<br>1011<br>1012<br>1013<br>``` | ```<br>async def search_sections(<br>    self,<br>    query: Annotated[str, MinLen(1), MaxLen(1024)],<br>    *,<br>    project_id: str | None = None,<br>    limit: Annotated[int, Ge(1), Le(200)] | None = None,<br>) -> AsyncIterator[list[Section]]:<br>    """<br>    Search active sections by name.<br>    The response is an iterable of lists of sections matching the query.<br>    Be aware that each iteration fires off a network request to the Todoist API,<br>    and may result in rate limiting or other API restrictions.<br>    :param query: Query string for section names.<br>    :param project_id: If set, search sections within the given project only.<br>    :param limit: Maximum number of sections per page.<br>    :return: An iterable of lists of sections.<br>    :raises httpx.HTTPStatusError: If the API request fails.<br>    :raises TypeError: If the API response structure is unexpected.<br>    """<br>    endpoint = get_api_url(f"{SECTIONS_PATH}/{SECTIONS_SEARCH_PATH_SUFFIX}")<br>    params = kwargs_without_none(query=query, project_id=project_id, limit=limit)<br>    return AsyncResultsPaginator(<br>        self._client,<br>        endpoint,<br>        "results",<br>        Section.from_dict,<br>        self._token,<br>        self._request_id_fn,<br>        params,<br>    )<br>``` |

## `unarchive_project(project_id)``async`

Unarchive a project.

Restores a previously archived project.

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `project_id` | `str` | The ID of the project to unarchive. | _required_ |

Returns:

| Type | Description |
| --- | --- |
| `Project` | The unarchived project object. |

Raises:

| Type | Description |
| --- | --- |
| `httpx.HTTPStatusError` | If the API request fails. |
| `TypeError` | If the API response is not a valid Project dictionary. |

Source code in `todoist_api_python/api_async.py`

|     |     |
| --- | --- |
| ```<br>853<br>854<br>855<br>856<br>857<br>858<br>859<br>860<br>861<br>862<br>863<br>864<br>865<br>866<br>867<br>868<br>869<br>870<br>871<br>872<br>873<br>874<br>``` | ```<br>async def unarchive_project(self, project_id: str) -> Project:<br>    """<br>    Unarchive a project.<br>    Restores a previously archived project.<br>    :param project_id: The ID of the project to unarchive.<br>    :return: The unarchived project object.<br>    :raises httpx.HTTPStatusError: If the API request fails.<br>    :raises TypeError: If the API response is not a valid Project dictionary.<br>    """<br>    endpoint = get_api_url(<br>        f"{PROJECTS_PATH}/{project_id}/{PROJECT_UNARCHIVE_PATH_SUFFIX}"<br>    )<br>    response = await post_async(<br>        self._client,<br>        endpoint,<br>        self._token,<br>        self._request_id_fn() if self._request_id_fn else None,<br>    )<br>    data = response_json_dict(response)<br>    return Project.from_dict(data)<br>``` |

## `uncomplete_task(task_id)``async`

Uncomplete a (completed) task.

Any parent tasks or sections will also be uncompleted.

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `task_id` | `str` | The ID of the task to reopen. | _required_ |

Returns:

| Type | Description |
| --- | --- |
| `bool` | True if the task was uncompleted successfully, False otherwise (possibly raise `HTTPError` instead). |

Raises:

| Type | Description |
| --- | --- |
| `httpx.HTTPStatusError` | If the API request fails. |

Source code in `todoist_api_python/api_async.py`

|     |     |
| --- | --- |
| ```<br>468<br>469<br>470<br>471<br>472<br>473<br>474<br>475<br>476<br>477<br>478<br>479<br>480<br>481<br>482<br>483<br>484<br>485<br>486<br>``` | ```<br>async def uncomplete_task(self, task_id: str) -> bool:<br>    """<br>    Uncomplete a (completed) task.<br>    Any parent tasks or sections will also be uncompleted.<br>    :param task_id: The ID of the task to reopen.<br>    :return: True if the task was uncompleted successfully,<br>             False otherwise (possibly raise `HTTPError` instead).<br>    :raises httpx.HTTPStatusError: If the API request fails.<br>    """<br>    endpoint = get_api_url(f"{TASKS_PATH}/{task_id}/reopen")<br>    response = await post_async(<br>        self._client,<br>        endpoint,<br>        self._token,<br>        self._request_id_fn() if self._request_id_fn else None,<br>    )<br>    return response.is_success<br>``` |

## `update_comment(comment_id, content)``async`

Update an existing comment.

Currently, only `content` can be updated.

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `comment_id` | `str` | The ID of the comment to update. | _required_ |
| `content` | `str` | The new text content for the comment. | _required_ |

Returns:

| Type | Description |
| --- | --- |
| `Comment` | the updated Comment. |

Raises:

| Type | Description |
| --- | --- |
| `httpx.HTTPStatusError` | If the API request fails. |

Source code in `todoist_api_python/api_async.py`

|     |     |
| --- | --- |
| ```<br>1204<br>1205<br>1206<br>1207<br>1208<br>1209<br>1210<br>1211<br>1212<br>1213<br>1214<br>1215<br>1216<br>1217<br>1218<br>1219<br>1220<br>1221<br>1222<br>1223<br>1224<br>1225<br>1226<br>``` | ```<br>async def update_comment(<br>    self, comment_id: str, content: Annotated[str, MaxLen(15000)]<br>) -> Comment:<br>    """<br>    Update an existing comment.<br>    Currently, only `content` can be updated.<br>    :param comment_id: The ID of the comment to update.<br>    :param content: The new text content for the comment.<br>    :return: the updated Comment.<br>    :raises httpx.HTTPStatusError: If the API request fails.<br>    """<br>    endpoint = get_api_url(f"{COMMENTS_PATH}/{comment_id}")<br>    response = await post_async(<br>        self._client,<br>        endpoint,<br>        self._token,<br>        self._request_id_fn() if self._request_id_fn else None,<br>        data={"content": content},<br>    )<br>    data = response_json_dict(response)<br>    return Comment.from_dict(data)<br>``` |

## `update_label(label_id, *, name=None, color=None, item_order=None, is_favorite=None)``async`

Update a personal label.

Only the fields to be updated need to be provided as keyword arguments.

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `label_id` | `str` | The ID of the label. | _required_ |
| `name` | `str | None` | The name of the label. | `None` |
| `color` | `ColorString | None` | The color of the label icon. | `None` |
| `item_order` | `int | None` | Label's order in the label list. | `None` |
| `is_favorite` | `bool | None` | Whether the label is a favorite. | `None` |

Returns:

| Type | Description |
| --- | --- |
| `Label` | the updated Label. |

Raises:

| Type | Description |
| --- | --- |
| `httpx.HTTPStatusError` | If the API request fails. |

Source code in `todoist_api_python/api_async.py`

|     |     |
| --- | --- |
| ```<br>1369<br>1370<br>1371<br>1372<br>1373<br>1374<br>1375<br>1376<br>1377<br>1378<br>1379<br>1380<br>1381<br>1382<br>1383<br>1384<br>1385<br>1386<br>1387<br>1388<br>1389<br>1390<br>1391<br>1392<br>1393<br>1394<br>1395<br>1396<br>1397<br>1398<br>1399<br>1400<br>1401<br>1402<br>1403<br>1404<br>1405<br>1406<br>1407<br>1408<br>``` | ```<br>async def update_label(<br>    self,<br>    label_id: str,<br>    *,<br>    name: Annotated[str, MinLen(1), MaxLen(60)] | None = None,<br>    color: ColorString | None = None,<br>    item_order: int | None = None,<br>    is_favorite: bool | None = None,<br>) -> Label:<br>    """<br>    Update a personal label.<br>    Only the fields to be updated need to be provided as keyword arguments.<br>    :param label_id: The ID of the label.<br>    :param name: The name of the label.<br>    :param color: The color of the label icon.<br>    :param item_order: Label's order in the label list.<br>    :param is_favorite: Whether the label is a favorite.<br>    :return: the updated Label.<br>    :raises httpx.HTTPStatusError: If the API request fails.<br>    """<br>    endpoint = get_api_url(f"{LABELS_PATH}/{label_id}")<br>    data = kwargs_without_none(<br>        name=name,<br>        color=color,<br>        item_order=item_order,<br>        is_favorite=is_favorite,<br>    )<br>    response = await post_async(<br>        self._client,<br>        endpoint,<br>        self._token,<br>        self._request_id_fn() if self._request_id_fn else None,<br>        data=data,<br>    )<br>    data = response_json_dict(response)<br>    return Label.from_dict(data)<br>``` |

## `update_project(project_id, *, name=None, description=None, color=None, is_favorite=None, view_style=None)``async`

Update an existing project.

Only the fields to be updated need to be provided as keyword arguments.

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `project_id` | `str` | The ID of the project to update. | _required_ |
| `name` | `str | None` | The name of the project. | `None` |
| `description` | `str | None` | Description for the project (up to 1024 characters). | `None` |
| `color` | `ColorString | None` | The color of the project icon. | `None` |
| `is_favorite` | `bool | None` | Whether the project is a favorite. | `None` |
| `view_style` | `ViewStyle | None` | A string value (either 'list' or 'board'). | `None` |

Returns:

| Type | Description |
| --- | --- |
| `Project` | the updated Project. |

Raises:

| Type | Description |
| --- | --- |
| `httpx.HTTPStatusError` | If the API request fails. |

Source code in `todoist_api_python/api_async.py`

|     |     |
| --- | --- |
| ```<br>785<br>786<br>787<br>788<br>789<br>790<br>791<br>792<br>793<br>794<br>795<br>796<br>797<br>798<br>799<br>800<br>801<br>802<br>803<br>804<br>805<br>806<br>807<br>808<br>809<br>810<br>811<br>812<br>813<br>814<br>815<br>816<br>817<br>818<br>819<br>820<br>821<br>822<br>823<br>824<br>825<br>826<br>827<br>``` | ```<br>async def update_project(<br>    self,<br>    project_id: str,<br>    *,<br>    name: Annotated[str, MinLen(1), MaxLen(120)] | None = None,<br>    description: Annotated[str, MaxLen(16383)] | None = None,<br>    color: ColorString | None = None,<br>    is_favorite: bool | None = None,<br>    view_style: ViewStyle | None = None,<br>) -> Project:<br>    """<br>    Update an existing project.<br>    Only the fields to be updated need to be provided as keyword arguments.<br>    :param project_id: The ID of the project to update.<br>    :param name: The name of the project.<br>    :param description: Description for the project (up to 1024 characters).<br>    :param color: The color of the project icon.<br>    :param is_favorite: Whether the project is a favorite.<br>    :param view_style: A string value (either 'list' or 'board').<br>    :return: the updated Project.<br>    :raises httpx.HTTPStatusError: If the API request fails.<br>    """<br>    endpoint = get_api_url(f"{PROJECTS_PATH}/{project_id}")<br>    data = kwargs_without_none(<br>        name=name,<br>        description=description,<br>        color=color,<br>        is_favorite=is_favorite,<br>        view_style=view_style,<br>    )<br>    response = await post_async(<br>        self._client,<br>        endpoint,<br>        self._token,<br>        self._request_id_fn() if self._request_id_fn else None,<br>        data=data,<br>    )<br>    data = response_json_dict(response)<br>    return Project.from_dict(data)<br>``` |

## `update_section(section_id, name)``async`

Update an existing section.

Currently, only `name` can be updated.

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `section_id` | `str` | The ID of the section to update. | _required_ |
| `name` | `str` | The new name for the section. | _required_ |

Returns:

| Type | Description |
| --- | --- |
| `Section` | the updated Section. |

Raises:

| Type | Description |
| --- | --- |
| `httpx.HTTPStatusError` | If the API request fails. |

Source code in `todoist_api_python/api_async.py`

|     |     |
| --- | --- |
| ```<br>1046<br>1047<br>1048<br>1049<br>1050<br>1051<br>1052<br>1053<br>1054<br>1055<br>1056<br>1057<br>1058<br>1059<br>1060<br>1061<br>1062<br>1063<br>1064<br>1065<br>1066<br>1067<br>1068<br>1069<br>1070<br>``` | ```<br>async def update_section(<br>    self,<br>    section_id: str,<br>    name: Annotated[str, MinLen(1), MaxLen(2048)],<br>) -> Section:<br>    """<br>    Update an existing section.<br>    Currently, only `name` can be updated.<br>    :param section_id: The ID of the section to update.<br>    :param name: The new name for the section.<br>    :return: the updated Section.<br>    :raises httpx.HTTPStatusError: If the API request fails.<br>    """<br>    endpoint = get_api_url(f"{SECTIONS_PATH}/{section_id}")<br>    response = await post_async(<br>        self._client,<br>        endpoint,<br>        self._token,<br>        self._request_id_fn() if self._request_id_fn else None,<br>        data={"name": name},<br>    )<br>    data = response_json_dict(response)<br>    return Section.from_dict(data)<br>``` |

## `update_task(task_id, *, content=None, description=None, labels=None, priority=None, due_string=None, due_lang=None, due_date=None, due_datetime=None, assignee_id=None, order=None, day_order=None, collapsed=None, duration=None, duration_unit=None, deadline_date=None, deadline_lang=None)``async`

Update an existing task.

Only the fields to be updated need to be provided.

Parameters:

| Name | Type | Description | Default |
| --- | --- | --- | --- |
| `task_id` | `str` | The ID of the task to update. | _required_ |
| `content` | `str | None` | The text content of the task. | `None` |
| `description` | `str | None` | Description for the task. | `None` |
| `labels` | `list[str] | None` | The task's labels (a list of names). | `None` |
| `priority` | `int | None` | The priority of the task (4 for very urgent). | `None` |
| `due_string` | `str | None` | The due date in natural language format. | `None` |
| `due_lang` | `LanguageCode | None` | Language for parsing the due date (e.g., 'en'). | `None` |
| `due_date` | `date | None` | The due date as a date object. | `None` |
| `due_datetime` | `datetime | None` | The due date and time as a datetime object. | `None` |
| `assignee_id` | `str | None` | User ID to whom the task is assigned. | `None` |
| `order` | `int | None` | The order of task in the project or section. | `None` |
| `day_order` | `int | None` | The order of the task inside Today or Next 7 days view. | `None` |
| `collapsed` | `bool | None` | Whether the task's sub-tasks are collapsed. | `None` |
| `duration` | `int | None` | The amount of time the task will take. | `None` |
| `duration_unit` | `Literal['minute', 'day'] | None` | The unit of time for duration. | `None` |
| `deadline_date` | `date | None` | The deadline date as a date object. | `None` |
| `deadline_lang` | `LanguageCode | None` | Language for parsing the deadline date. | `None` |

Returns:

| Type | Description |
| --- | --- |
| `Task` | the updated Task. |

Raises:

| Type | Description |
| --- | --- |
| `httpx.HTTPStatusError` | If the API request fails. |

Source code in `todoist_api_python/api_async.py`

|     |     |
| --- | --- |
| ```<br>366<br>367<br>368<br>369<br>370<br>371<br>372<br>373<br>374<br>375<br>376<br>377<br>378<br>379<br>380<br>381<br>382<br>383<br>384<br>385<br>386<br>387<br>388<br>389<br>390<br>391<br>392<br>393<br>394<br>395<br>396<br>397<br>398<br>399<br>400<br>401<br>402<br>403<br>404<br>405<br>406<br>407<br>408<br>409<br>410<br>411<br>412<br>413<br>414<br>415<br>416<br>417<br>418<br>419<br>420<br>421<br>422<br>423<br>424<br>425<br>426<br>427<br>428<br>429<br>430<br>431<br>432<br>433<br>434<br>435<br>436<br>437<br>438<br>439<br>440<br>441<br>442<br>443<br>444<br>445<br>``` | ```<br>async def update_task(<br>    self,<br>    task_id: str,<br>    *,<br>    content: Annotated[str, MinLen(1), MaxLen(500)] | None = None,<br>    description: Annotated[str, MaxLen(16383)] | None = None,<br>    labels: list[Annotated[str, MaxLen(60)]] | None = None,<br>    priority: Annotated[int, Ge(1), Le(4)] | None = None,<br>    due_string: Annotated[str, MaxLen(150)] | None = None,<br>    due_lang: LanguageCode | None = None,<br>    due_date: date | None = None,<br>    due_datetime: datetime | None = None,<br>    assignee_id: str | None = None,<br>    order: int | None = None,<br>    day_order: int | None = None,<br>    collapsed: bool | None = None,<br>    duration: Annotated[int, Ge(1)] | None = None,<br>    duration_unit: Literal["minute", "day"] | None = None,<br>    deadline_date: date | None = None,<br>    deadline_lang: LanguageCode | None = None,<br>) -> Task:<br>    """<br>    Update an existing task.<br>    Only the fields to be updated need to be provided.<br>    :param task_id: The ID of the task to update.<br>    :param content: The text content of the task.<br>    :param description: Description for the task.<br>    :param labels: The task's labels (a list of names).<br>    :param priority: The priority of the task (4 for very urgent).<br>    :param due_string: The due date in natural language format.<br>    :param due_lang: Language for parsing the due date (e.g., 'en').<br>    :param due_date: The due date as a date object.<br>    :param due_datetime: The due date and time as a datetime object.<br>    :param assignee_id: User ID to whom the task is assigned.<br>    :param order: The order of task in the project or section.<br>    :param day_order: The order of the task inside Today or Next 7 days view.<br>    :param collapsed: Whether the task's sub-tasks are collapsed.<br>    :param duration: The amount of time the task will take.<br>    :param duration_unit: The unit of time for duration.<br>    :param deadline_date: The deadline date as a date object.<br>    :param deadline_lang: Language for parsing the deadline date.<br>    :return: the updated Task.<br>    :raises httpx.HTTPStatusError: If the API request fails.<br>    """<br>    endpoint = get_api_url(f"{TASKS_PATH}/{task_id}")<br>    data = kwargs_without_none(<br>        content=content,<br>        description=description,<br>        labels=labels,<br>        priority=priority,<br>        due_string=due_string,<br>        due_lang=due_lang,<br>        due_date=format_date(due_date) if due_date is not None else None,<br>        due_datetime=(<br>            format_datetime(due_datetime) if due_datetime is not None else None<br>        ),<br>        assignee_id=assignee_id,<br>        order=order,<br>        day_order=day_order,<br>        collapsed=collapsed,<br>        duration=duration,<br>        duration_unit=duration_unit,<br>        deadline_date=(<br>            format_date(deadline_date) if deadline_date is not None else None<br>        ),<br>        deadline_lang=deadline_lang,<br>    )<br>    response = await post_async(<br>        self._client,<br>        endpoint,<br>        self._token,<br>        self._request_id_fn() if self._request_id_fn else None,<br>        data=data,<br>    )<br>    data = response_json_dict(response)<br>    return Task.from_dict(data)<br>``` |

[Previous\\
\\
\\
API Client](https://doist.github.io/todoist-api-python/api/) [Next\\
\\
\\
Models](https://doist.github.io/todoist-api-python/models/)



Made with
[Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)

[x.com](https://x.com/doistdevs "x.com")[github.com](https://github.com/doist "github.com")

Title: API Client (async) - Todoist Python SDK
