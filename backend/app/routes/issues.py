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
