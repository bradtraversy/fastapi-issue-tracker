# FastAPI Crash Course

In this crash course, we will build a mini production-style API using **FastAPI**. We will cover setting up the project, creating endpoints, data validation, and persistence using a JSON file.

## What Is FastAPI?

FastAPI is a modern, fast (high-performance), web framework for building APIs with Python 3.7+. It is built on top of Starlette, which is a lightweight ASGI framework/toolkit. ASGI stands for **Asynchronous Server Gateway Interface**, which we'll talk about in a minute. So Starlette handles the web parts like routing, middleware, and requests/responses, while FastAPI adds a robust layer for building fast APIs.

## Key Features

- **Speed & Performance:** Very high performance, on par with NodeJS and Go (thanks to Starlette and Pydantic). Starlette is ASGI, so it runs asynchronously, which makes it super fast. It's also fast to code, with minimal boilerplate.

- **Automatic Data Validation:** FastAPI uses Pydantic for data validation. You define your data models using Python type hints, and FastAPI automatically validates incoming requests against those models. If the data is invalid, it returns clear error messages. This takes a lot of the pain out of input validation and error handling.

- **Automatic interactive documentation:** FastAPI automatically generates interactive API docs using Swagger UI and ReDoc. You get a web interface to test your API endpoints without writing any extra code. So you don't need to use Postman or curl for testing.

- **Dependency Injection:** FastAPI has a powerful dependency injection system that makes it easy to manage components like database connections, authentication, etc. You can define dependencies as functions and FastAPI will handle their lifecycle.

- **Security Utilities:** FastAPI includes built-in support for common security practices like OAuth2, JWT, and HTTP Basic Auth. It makes it easy to secure your API endpoints.

- **Developer Experience:** FastAPI is designed to be easy to use and learn. You have very little if any boilerplate code. The use of Python type hints makes your code more readable and helps with editor support (like autocompletion).

- **WebSocket Support:** FastAPI has built-in support for WebSockets, allowing you to build real-time applications easily.

## ASGI vs WSGI

**ASGI (Asynchronous Server Gateway Interface)** is the successor to **WSGI (Web Server Gateway Interface)**. WSGI is synchronous and was designed for traditional web applications where each request is handled one at a time. ASGI, on the other hand, is asynchronous and can handle multiple requests concurrently. This makes ASGI more suitable for modern web applications that require real-time features, long-lived connections (like WebSockets), and better performance under high load.

ASGI enables async/await syntax in Python, allowing for non-blocking I/O operations. This means that while waiting for a database query or an external API call, the server can handle other requests, leading to improved throughput and responsiveness.

## Installation

Make sure that you have Python 3 installed:

```bash
python --version
```

Create a folder and a virtual environment:

```bash
mkdir issue-tracker
cd issue-tracker

python -m venv .venv
```

Enable the virtual environment:

```bash
# Windows
.\.venv\Scripts\activate

# MacOS or Linux
source .venv/bin/activate
```

## Auto Format & Indentation

I would suggest using the Python extension if you're using VS Code as well as an auto indent setup for Python. I use the autopep8 extension for formatting. You can install it and add the following to your `settings.json` file:

```json
"[python]": {
  "editor.defaultFormatter": "ms-python.autopep8",
  "editor.formatOnSave": true
}
```

## Install FastAPI

We can now install FastAPI using the **pip** package manager:

```bash
pip install "fastapi[standard]"
```

We use an extra tag `[standard]` to install some additional dependencies that are commonly used with FastAPI, like `uvicorn`, `pydantic`, and others.

## Entry Point

Let's create our main entry point for our API. Create a file called `main.py` with the following code:

```python
from fastapi import FastAPI

app = FastAPI(
    title="Issue Tracker API",
    version="0.1.0",
    description="A mini production-style API built with FastAPI",
)


@app.get("/health")
def health_check():
    return {"status": "ok"}
```

We imported FastAPI and created an instance and stored it in `app`. The title, version, and description are optional metadata that show up in the auto-generated docs at /docs. You could just do `app = FastAPI()` and it would still work.

Then we added a new route with a **decorator**. It tells FastAPI "when someone makes a GET request to `/health`, run the function directly below this." Other HTTP methods would be `@app.post()`, `@app.put()`, `@app.delete()`, etc.

Then we return a Python dictionary. FastAPI automatically converts this to JSON and sends it back with the right headers. The client receives `{"status": "ok"}`.

Run the file with:

```bash
fastapi dev main.py
```

This is a convenience wrapper around uvicorn that FastAPI added in recent versions. Under the hood it still uses uvicorn with hot-reload. Uvicorn is an ASGI server. It listens to HTTP requests and passes them to our app.

Now go to `http://localhost:8000/health` and you should see `{"status": "ok"}`.

You have created your first endpoint with FastAPI.

## Swagger UI Docs

FastAPI automatically generates interactive API docs for you. Go to `http://localhost:8000/docs` to see the Swagger UI docs. You should see your `/health` endpoint there.

## `.gitignore` File

Before you initialize your Git repo, create a `.gitignore` file and add the following:

```
.venv
__pycache__
*.pyc
.env
data/
```

We added `data/` to ignore our JSON data files from version control.

Now you can proceed to make your first commit.

## Creating Routes

Let's look more at creating routes.

Let's create a route for a set of items. I will add items as an array in a variable:

```python
items = [
    {"id": 1, "name": "Issue 1", "status": "open"},
    {"id": 2, "name": "Issue 2", "status": "closed"},
    {"id": 3, "name": "Issue 3", "status": "in progress"},
]
```

### GET Request Examples

Now we can add a route to get all items:

```python
@app.get("/items")
def read_items():
    return items
```

and a route to get a single item:

```python
@app.get("/items/{item_id}")
def read_item(item_id: int):
    for item in items:
        if item["id"] == item_id:
            return item
    return {"error": "Item not found"}
```

### Query Strings

Let's take a look at how we can handle query strings. So if we had something like this:

```
/items?page=2&limit=5
```

We can add the following to the /items route:

```python
@app.get("/items")
def get_items(page: int = 1, limit: int = 10):
    start = (page - 1) * limit
    end = start + limit
    return items[start:end]
```

Now if you add 2 for the page and 2 for the limit, you should see the 3rd item.

### POST Request Example

Let's create a route to make a POST request:

```python
@app.post("/items")
def create_item(item: dict):
    items.append(item)
    return item
```

Now make the request with the following data in the body:

```json
{
  "id": "4",
  "name": "Issue 4",
  "status": "open"
}
```

If you run that, it will work, however, right now we have no data model and no validation. If I add another random field, like say:

```json
"foo": "bar"
```

It will give us a success response.

When creating APIs, you want to have strict models and validation. This is where the Pydantic library comes in. So I'm actually going to get rid of all this item stuff, because it will be in its own routes file anyway. Then we can create a more realistic folder structure.

## API Folder Structure

So we basically have a hello world. Now we need to start to structure our API files and folders.

Create the following structure:

```
issue-tracker/
  main.py
  app/
    __init__.py
    storage.py
    schemas.py
    routes/
      __init__.py
      issues.py
  data/
    issues.json
```

### Structure Explanation

- **main.py** - Stays small and focused on "app startup" and wiring.
- **data/** - Folder containing our JSON data files. Keeps the root directory clean and makes it easy to gitignore all data files. This would actually be created on its own when you add an issue, so you don't really need to create it.
- **data/issues.json** - Our JSON file that persists issue data between server restarts.
- **app/storage.py** - Functions to load and save to and from the JSON file.
- **app/schemas.py** - Contains request/response validation models (Pydantic).
- **app/routes/issues.py** - Contains endpoints related to issues.
- **`__init__.py`** files - If you are new to Python, these files tell Python "This directory is a Python package". It allows us to import using dot notation. Without `__init__.py`, Python would treat those folders as regular directories, not importable packages.

This structure is scalable - when you add more features later (users, projects), you can add `data/users.json`, `app/routes/users.py`, etc.

## API Router

Let's setup our router so that we don't have to put all routes in the `main.py` file.

Open the `routes/issues.py` file and add the following imports:

```python
from fastapi import APIRouter, HTTPException, status
```

What we're importing:

- **APIRouter** - Lets us define routes in separate files instead of putting everything in `main.py`.
- **HTTPException** - Used to return error responses (like 404 Not Found).
- **status** - Constants for HTTP status codes. `status.HTTP_404_NOT_FOUND` is more readable than `404`.
- Our Pydantic models from `schemas.py`.
- Our storage functions from `storage.py`.

### Router Setup

We need to add the router. We can also pass in a prefix. I want to use `/api/v1/issues`. This let's us make it clear that it is an API and which version it is. We can add tags as well, which helps Swagger write better docs.

```python
router = APIRouter(prefix="/api/v1/issues", tags=["Issues"])
```

## GET Issues Route

We still need to add our JSON storage module, but let's create the route to get issues, just so we can test the router.

Add the following:

```python
@router.get("")
def get_issues():
    """Get all issues."""
    return []
```

Since we are using the router and it is in the issues route file, we do not need to put anything in the URL argument because we already added it in the prefix.

This just returns an empty array right now, but it will return all issues.

## Wire the Router

Now we need to wire up the router in `main.py`. Update your `main.py`:

```python
from fastapi import FastAPI
from app.routes.issues import router as issues_router

app = FastAPI(
    title="Issue Tracker API",
    version="0.1.0",
    description="A mini production-style API built with FastAPI",
)


@app.get("/health")
def health_check():
    return {"status": "ok"}


app.include_router(issues_router)
```

The `include_router()` line mounts all the routes from our issues router onto the main app.

## Test The API

Run the app:

```bash
fastapi dev main.py
```

Go to `http://localhost:8000/docs` to see the Swagger UI.

You should see the GET issues route and try it out and just get an empty array for now.

## Create The Storage Module

Before we create our schemas, let's set up our storage module. This keeps our data persistence logic separate from our routes. Open `app/storage.py`:

### Imports

```python
from pathlib import Path
import json
```

- **Path** - Python's modern way to work with file paths.
- **json** - Python's built-in module for reading and writing JSON data.

### Define the Data Directory and File Path

```python
DATA_DIR = Path("data")
DATA_FILE = DATA_DIR / "issues.json"
```

This creates path objects for our data directory and the issues.json file inside it. Using `Path` makes path handling work consistently across Windows, Mac, and Linux.

### Load Data Function

Let's create the function to load the data:

```python
def load_data():
    """Load issues from the JSON file."""
    if DATA_FILE.exists():
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    return []
```

This function checks if the JSON file exists. If it does, it reads and returns the data. If not, it returns an empty list.

### Save Data Function

```python
def save_data(data):
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=2)
```

This writes our data to the JSON file. We call `ensure_data_dir()` first to make sure the folder exists. The `indent=2` makes the file human-readable with nice formatting.

### Complete Storage File

Here's the complete `app/storage.py`:

```python
from pathlib import Path
import json

DATA_DIR = Path("data")
DATA_FILE = DATA_DIR / "issues.json"


def load_data():
    if DATA_FILE.exists():
        with open(DATA_FILE, "r") as f:
            content = f.read()
            if content.strip():
                return json.loads(content)
    return []


def save_data(data):
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=2)

```

## Create The Schemas (Validation Models)

Our schema is what defines our data model. When we send or receive data, it must match up and validate with our schema. Open `app/schemas.py` and let's build it piece by piece.

### Imports

```python
from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field
```

- **Enum** - Allows us to restrict values to a fixed set of strings.
- **Optional** - Type hint that means "this can be None".
- **BaseModel** - The class you inherit from to make a Pydantic model. It's what gives your class all the validation and parsing powers.
- **Field** - For adding validation constraints like `min_length`, `max_length`, etc.

### Priority Enum

```python
class IssuePriority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
```

We are creating an Enum for the priority where the values can be low, medium, or high. The `str` part means each value is also a string, which makes it serialize nicely to JSON and compare easily with strings.

### Status Enum

```python
class IssueStatus(str, Enum):
    open = "open"
    in_progress = "in_progress"
    closed = "closed"
```

Same pattern for status - restricts values to these three options.

### Create Schema (Request Body)

```python
class IssueCreate(BaseModel):
    title: str = Field(min_length=3, max_length=100)
    description: str = Field(min_length=5, max_length=2000)
    priority: IssuePriority = IssuePriority.medium
```

This defines the shape of data the client must send when creating an issue. We have:

- Required `title` with length constraints
- Required `description` with length constraints
- Optional `priority` that defaults to "medium"

`Field()` adds validation constraints and helps generate better docs.

### Update Schema (Partial Updates)

```python
class IssueUpdate(BaseModel):
    title: Optional[str] = Field(default=None, max_length=100)
    description: Optional[str] = Field(
        default=None, min_length=5, max_length=2000)
    priority: Optional[IssuePriority] = None
    status: Optional[IssueStatus] = None
```

For updates, all fields are optional. We set defaults to `None` so clients can update just one field without sending everything. If you're new to Python, `None` is like "null" - an empty value.

### Output Schema (Response Body)

```python
class IssueOut(BaseModel):
    id: str
    title: str
    description: str
    priority: IssuePriority
    status: IssueStatus
```

This defines what we return to clients. Notice `id` is a `str` - we'll be using UUIDs which are string-based unique identifiers.

### Complete Schemas File

Here's the complete `app/schemas.py`:

```python
from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field


class IssuePriority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"


class IssueStatus(str, Enum):
    open = "open"
    in_progress = "in_progress"
    closed = "closed"


class IssueCreate(BaseModel):
    title: str = Field(min_length=3, max_length=100)
    description: str = Field(min_length=5, max_length=2000)
    priority: IssuePriority = IssuePriority.medium


class IssueUpdate(BaseModel):
    title: Optional[str] = Field(default=None, max_length=100)
    description: Optional[str] = Field(
        default=None, min_length=5, max_length=2000)
    priority: Optional[IssuePriority] = None
    status: Optional[IssueStatus] = None


class IssueOut(BaseModel):
    id: str
    title: str
    description: str
    priority: IssuePriority
    status: IssueStatus
```

## Issue Routes

Now we can start on the actual issue routes with the JSON storage.

Add the following imports to the `routes/issues.py` file:

```python
import uuid
from fastapi import APIRouter, HTTPException, status
from app.schemas import IssueCreate, IssueUpdate, IssueOut, IssueStatus
from app.storage import load_data, save_data
```

We are bringing in the Pydantic models that we created as well as the storage module functions and the uuid package to generate IDs.

Let's edit the GET issues route:

### GET All Issues

```python
@router.get("", response_model=list[IssueOut])
def get_issues():
    """Get all issues."""
    issues = load_data()
    return issues
```

This route handles GET requests to `/issues`.

In FastAPI, response_model is a parameter that defines the expected shape of the response data. With `response_model=list[IssueOut]`, we are validating that the response matches the `IssueOut` model. It will serialize the response to JSON and filter out any exrea fields.

We call `load_data()` to read from the JSON file each time - this ensures we always have the latest data.

Now test it out and you should still see an empty array, but that is only because we have no issues yet. So let's add a route to create an issue.

### POST Create Issue

```python
@router.post("", response_model=IssueOut, status_code=status.HTTP_201_CREATED)
def create_issue(payload: IssueCreate):
    """
    Create new issue
    The issue is persisted to data/issues.json
    """
    issues = load_data()

    issue = {
        "id": str(uuid.uuid4()),
        "title": payload.title,
        "description": payload.description,
        "priority": payload.priority.value,
        "status": "open",
    }

    issues.append(issue)
    save_data(issues)

    return issue
```

Let's break this down:

- `payload: IssueCreate` - FastAPI automatically parses the JSON body and validates it.
- `status_code=status.HTTP_201_CREATED` - Returns 201 instead of default 200.
- `uuid.uuid4()` - Generates a unique ID like `"550e8400-e29b-41d4-a716-446655440000"`. No counter needed!
- `.value` on enums - Converts the enum to its string value for JSON storage.
- `save_data(issues)` - Persists to the JSON file immediately.
- Status is hardcoded to **open**

Go ahead and try it out in Swagger and make sure you add the correct fields:

```json
{
  "title": "Issue 1",
  "description": "This is a test issue",
  "priority": "medium"
}
```

You do not need to send the status. It will be set to **open**. You should get a 201 and see your new issue.

Add a second issue and try to add an extra field that is NOT in the schema:

```
{"foo": "bar"}
```

It will not work this time. It will be stripped out.

Now try and add one with `{"status": "test"}`

It will not work. You will get an error because that is not in the enum we set on the **IssueCreate** schema.

This is why Pydantic models are so important.

### GET Single Issue

```python
@router.get("/{issue_id}", response_model=IssueOut)
def get_issue(issue_id: str):
    """Get a single issue by ID."""
    issues = load_data()
    for issue in issues:
        if issue["id"] == issue_id:
            return issue
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Issue not found"
    )
```

This route handles GET requests to `/issues/{issue_id}`. It:

1. Loads all issues from the JSON file
2. Searches for the matching ID
3. Returns the issue if found, or raises a 404 error

The `raise HTTPException` immediately stops execution and returns an error response to the client.

Try to get an issue that does not exist by adding the ID of 1. You will get a 404 error.

### PUT Update Issue

```python
@router.put("/{issue_id}", response_model=IssueOut)
def update_issue(issue_id: str, payload: IssueUpdate):
    """Update an existing issue by ID."""
    issues = load_data()

    for issue in issues:
        if issue["id"] == issue_id:
            if payload.title is not None:
                issue["title"] = payload.title
            if payload.description is not None:
                issue["description"] = payload.description
            if payload.priority is not None:
                issue["priority"] = payload.priority.value
            if payload.status is not None:
                issue["status"] = payload.status.value

            save_data(issues)
            return issue

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Issue not found"
    )
```

This route:

1. Loads issues and finds the matching one
2. Only updates fields that were actually sent (`is not None` check)
3. Saves and returns the updated issue
4. Raises 404 if not found

Go ahead and test it by adding an ID and the update info. I would suggest changing the description by sending this in the body:

```json
{
  "description": "This is an updated issue"
}
```

### DELETE Issue

```python
@router.delete("/{issue_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_issue(issue_id: str):
    """Delete an issue by ID."""
    issues = load_data()

    for i, issue in enumerate(issues):
        if issue["id"] == issue_id:
            issues.pop(i)
            save_data(issues)
            return

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Issue not found"
    )
```

- `status.HTTP_204_NO_CONTENT` - Standard response for successful deletion (no body returned).
- `enumerate(issues)` - Gives us both the index (`i`) and the issue, so we can use `pop(i)` to remove it.

Go ahead and try the delete route with an ID of an issue.

### Complete Routes File

Here's the complete `app/routes/issues.py`:

```python
import uuid
from fastapi import APIRouter, HTTPException, status
from app.schemas import IssueCreate, IssueUpdate, IssueOut
from app.storage import load_data, save_data

router = APIRouter(prefix="/api/v1/issues", tags=["Issues"])


@router.get("", response_model=list[IssueOut])
def get_issues():
    """Get all issues."""
    issues = load_data()
    return issues


@router.get("/{issue_id}", response_model=IssueOut)
def get_issue(issue_id: str):
    """
    Get single issue by ID
    Raises 404 if issue not found
    """
    issues = load_data()
    for issue in issues:
        if issue["id"] == issue_id:
            return issue
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                        detail="Issue not found")


@router.post("", response_model=IssueOut, status_code=status.HTTP_201_CREATED)
def create_issue(payload: IssueCreate):
    """
    Create new issue
    The issue is persisted to data/issues.json
    """
    issues = load_data()

    issue = {
        "id": str(uuid.uuid4()),
        "title": payload.title,
        "description": payload.description,
        "priority": payload.priority.value,
        "status": "open",
    }

    issues.append(issue)
    save_data(issues)

    return issue


@router.put("/{issue_id}", response_model=IssueOut)
def update_issue(issue_id: str, payload: IssueUpdate):
    """Update an existing issue by ID."""
    issues = load_data()

    for issue in issues:
        if issue["id"] == issue_id:
            if payload.title is not None:
                issue["title"] = payload.title
            if payload.description is not None:
                issue["description"] = payload.description
            if payload.priority is not None:
                issue["priority"] = payload.priority.value
            if payload.status is not None:
                issue["status"] = payload.status.value

            save_data(issues)
            return issue

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Issue not found"
    )


@router.delete("/{issue_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_issue(issue_id: str):
    """Delete an issue by ID."""
    issues = load_data()

    for i, issue in enumerate(issues):
        if issue["id"] == issue_id:
            issues.pop(i)
            save_data(issues)
            return

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Issue not found"
    )

```

## Middleware

Just about every backend web framework has the concept of middleware. Middleware is code that runs before and/or after each request. It can modify the request or response, perform logging, handle authentication, etc.

### Timing Header Middleware

Let's add some custom middleware that will add a custom header to each response showing how long the request took to process.

Create a new folder `app/middleware/` and create a file `timing.py` with the following code:

```python
import time
from fastapi import Request

async def timing_middleware(request: Request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    response.headers["X-Process-Time"] = f"{time.perf_counter() - start:.4f}s"
    return response

```

### What This Does

- `request: Request` - The incoming request object.
- `call_next` - A function that, when called, will pass the request to the next middleware or route handler.
- `time.perf_counter()` - High-resolution timer to measure elapsed time.
- We calculate the time taken to process the request and add it as a custom header `X-Process-Time` to the response.

Everything before `await call_next(request)` runs before the request is processed, and everything after runs after the response is generated. That is why we add the header after calling `call_next`. So the request is made, the response is generated, and then we add our custom header before sending it back to the client.

### Add Middleware to Main App

```python
from app.middleware.timing import timing_middleware

# After app is created
app.middleware("http")(timing_middleware)
```

## CORS

You may want to enable CORS (Cross-Origin Resource Sharing) if you plan to call your API from a frontend app running on a different domain or port.

Add the following import to `main.py`:

```python
from fastapi.middleware.cors import CORSMiddleware
```

Then add this code after creating the `app` instance:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to your frontend's origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

This will allow all origins to access your API. In production, you should restrict `allow_origins` to only the domains you trust.

## Deployment

For deploying your FastAPI app, you can use various platforms like Render, Railway, Heroku, AWS, etc. A common approach is to use **Docker** to containerize your application.

I want to keep it simple and use Render, which is a PaaS (Platform as a Service) that makes it easy to deploy web apps. We basically just need to link our GitHub repo and set the build and start commands.

### Generate Requirements File

To generate a `requirements.txt` file that lists all your dependencies, run the following command in your terminal:

```bash
pip freeze > requirements.txt
```

This will create a `requirements.txt` file in your current directory with all the packages installed in your virtual environment. We need this file for Render to know which packages to install.

### Render Deployment Steps

1. Push your code to a GitHub repository.
2. Go to [Render](https://render.com/) and create a new account if you don't have one.
3. Click on "New" and select "Web Service".
4. Connect your GitHub repository.
5. Set the build command to:
   ```bash
   pip install -r requirements.txt
   ```
6. Set the start command to:

   ```bash
    uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

7. Click "Create Web Service" and wait for the deployment to finish.

Your FastAPI app should now be live on Render!

## Authentication

There are a lot of ways to do authentication in FastAPI. I want to show you a common solution using JWT tokens and secure password hashing.

### Install Dependencies

```bash
pip install pyjwt
pip install "pwdlib[argon2]"
```

- **pyjwt** - For encoding and decoding JSON Web Tokens (JWT).
- **pwdlib[argon2]** - For secure password hashing using the Argon2 algorithm.

### Add Auth Schemas

Open `app/schemas.py` and add these models at the bottom:

```python
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


class User(BaseModel):
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    disabled: Optional[bool] = None


class UserInDB(User):
    hashed_password: str
```

- **Token** - What we return after successful login.
- **TokenData** - What we extract from a JWT.
- **User** - Public user info.
- **UserInDB** - User with hashed password (never expose this to clients).

### Create Auth Module

Create `app/auth.py`. Let's build it step by step.

**Imports and configuration:**

```python
from datetime import datetime, timedelta, timezone
from typing import Annotated, Optional

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jwt.exceptions import InvalidTokenError
from pwdlib import PasswordHash

from app.schemas import TokenData, UserInDB
```

**Constants:**

```python
SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
```

In production, use environment variables for `SECRET_KEY`!

**Password hashing and OAuth2 setup:**

```python
password_hash = PasswordHash.recommended()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
```

**Fake user database:**

```python
fake_users_db = {
    "johndoe": {
        "username": "johndoe",
        "full_name": "John Doe",
        "email": "johndoe@example.com",
        "hashed_password": "$argon2id$v=19$m=65536,t=3,p=4$wagCPXjifgvUFBzq4hqe3w$CYaIb8sB+wtD+Vu/P4uod1+Qof8h+1g7bbDlBID48Rc",
        "disabled": False,
    }
}
```

This is the hash of "secret" - that's the password for testing.

**Helper functions:**

```python
def verify_password(plain_password, hashed_password):
    return password_hash.verify(plain_password, hashed_password)


def get_password_hash(password):
    return password_hash.hash(password)


def get_user(db, username: str):
    if username in db:
        user_dict = db[username]
        return UserInDB(**user_dict)


def authenticate_user(fake_db, username: str, password: str):
    user = get_user(fake_db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user
```

**Token creation:**

```python
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
```

**Get current user from token:**

```python
async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except InvalidTokenError:
        raise credentials_exception
    user = get_user(fake_users_db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user
```

**Check if user is active:**

```python
async def get_current_active_user(
    current_user: Annotated[UserInDB, Depends(get_current_user)],
):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user
```

### Complete Auth Module

Here's the complete `app/auth.py`:

```python
from datetime import datetime, timedelta, timezone
from typing import Annotated, Optional

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jwt.exceptions import InvalidTokenError
from pwdlib import PasswordHash

from app.schemas import TokenData, UserInDB

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

password_hash = PasswordHash.recommended()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

fake_users_db = {
    "johndoe": {
        "username": "johndoe",
        "full_name": "John Doe",
        "email": "johndoe@example.com",
        "hashed_password": "$argon2id$v=19$m=65536,t=3,p=4$wagCPXjifgvUFBzq4hqe3w$CYaIb8sB+wtD+Vu/P4uod1+Qof8h+1g7bbDlBID48Rc",
        "disabled": False,
    }
}


def verify_password(plain_password, hashed_password):
    return password_hash.verify(plain_password, hashed_password)


def get_password_hash(password):
    return password_hash.hash(password)


def get_user(db, username: str):
    if username in db:
        user_dict = db[username]
        return UserInDB(**user_dict)


def authenticate_user(fake_db, username: str, password: str):
    user = get_user(fake_db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except InvalidTokenError:
        raise credentials_exception
    user = get_user(fake_users_db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(
    current_user: Annotated[UserInDB, Depends(get_current_user)],
):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user
```

### Create Auth Routes

Create `app/routes/auth.py`:

```python
from datetime import timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from app.auth import (
    authenticate_user,
    create_access_token,
    fake_users_db,
    ACCESS_TOKEN_EXPIRE_MINUTES,
)
from app.schemas import Token

router = APIRouter(tags=["Auth"])


@router.post("/token")
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
) -> Token:
    user = authenticate_user(fake_users_db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")
```

`OAuth2PasswordRequestForm` expects `username` and `password` as form data (not JSON). This is the OAuth2 standard.

### Update main.py

```python
from fastapi import FastAPI
from app.routes.issues import router as issues_router
from app.routes.auth import router as auth_router

app = FastAPI(
    title="Issue Tracker API",
    version="0.1.0",
    description="A mini production-style API built with FastAPI",
)


@app.get("/health")
def health_check():
    return {"status": "ok"}


app.include_router(auth_router)
app.include_router(issues_router)
```

### Protect Routes

To protect a route, add the `get_current_active_user` dependency. Update `app/routes/issues.py`.

First, update your imports at the top of the file:

```python
import uuid
from typing import Annotated
from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas import IssueCreate, IssueUpdate, IssueOut, User
from app.storage import load_data, save_data
from app.auth import get_current_active_user
```

Then add the `current_user` parameter to any route you want to protect:

```python
@router.get("", response_model=list[IssueOut])
def get_issues(current_user: Annotated[User, Depends(get_current_active_user)]):
    """Get all issues."""
    issues = load_data()
    return issues
```

Now requests without a valid token get a 401 Unauthorized response.

To protect all issue routes, add the same `current_user` parameter to each route function:

```python
@router.post("", response_model=IssueOut, status_code=status.HTTP_201_CREATED)
def create_issue(
    payload: IssueCreate,
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    # ... rest of function


@router.get("/{issue_id}", response_model=IssueOut)
def get_issue(
    issue_id: str,
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    # ... rest of function


@router.put("/{issue_id}", response_model=IssueOut)
def update_issue(
    issue_id: str,
    payload: IssueUpdate,
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    # ... rest of function


@router.delete("/{issue_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_issue(
    issue_id: str,
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    # ... rest of function
```

### Test Authentication

1. Go to `http://localhost:8000/docs`
2. Click the "Authorize" button (lock icon at top right)
3. Enter username: `johndoe`, password: `secret`
4. Click "Authorize"
5. Now you can access protected routes!

## Next Steps

- Replace the fake user database with persistent storage
- Add user registration endpoint
- Use environment variables for `SECRET_KEY`
- Consider upgrading to a real database (SQLite, PostgreSQL) for production
