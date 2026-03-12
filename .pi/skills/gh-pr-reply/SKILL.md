---
name: gh-pr-reply
description: Reply to PR review comments and resolve threads
argument-hint: "<instructions — include PR number, what to reply, whether to resolve>"
---

# Reply to GitHub PR Review Comment Threads

User instructions: $ARGUMENTS

## Step 0: Parse the user's intent

Extract from the user's instructions above:
- **PR number** — REQUIRED. If not provided, infer from current branch via `gh pr view --json number -q .number`. If ambiguous, ask.
- **What to reply** — the user may give exact text, or say "reply explaining X". If unclear, ask.
- **Whether to resolve** — look for "resolve" in instructions. Default: do NOT resolve.
- **Whether to approve** — look for "approve" in instructions. Default: do NOT approve.

Detect OWNER and REPO: `gh repo view --json owner,name -q '.owner.login + "/" + .name'`

## Step 1: Fetch review threads

```
gh api graphql -f query='
query {
  repository(owner: "<OWNER>", name: "<REPO>") {
    pullRequest(number: <PR>) {
      reviewThreads(first: 50) {
        nodes {
          id
          isResolved
          comments(first: 10) {
            nodes {
              databaseId
              path
              body
              author { login }
            }
          }
        }
      }
    }
  }
}'
```

## Step 2: Show threads and confirm

Present each unresolved thread:
- File path
- Comment body (first 2-3 lines)
- REST `databaseId` of the FIRST comment in the thread (needed as URL path segment for the `/replies` endpoint)
- GraphQL `id` (needed for resolving)

Compose replies autonomously based on the user's instructions and conversation context. Do NOT ask for confirmation — just post.

## Step 3: Post replies — WRITE BODY TO FILE FIRST

<critical>
### NEVER inline the reply body in the shell command.

Complex markdown (backticks, quotes, special chars) WILL break shell escaping and cause the reply to silently fail or post to the wrong place.

### Correct procedure — ALWAYS follow this:

1. Write the reply body to a temp file:
   ```bash
   cat > /tmp/pr-reply-body.txt << 'REPLY_EOF'
   Your reply text here. Markdown is fine.
   Backticks `like this` are fine. Quotes "like this" are fine.
   REPLY_EOF
   ```

2. Post using the `/replies` endpoint with `--input -`:
   ```bash
   jq -n --rawfile body /tmp/pr-reply-body.txt '{"body": $body}' \
     | gh api repos/OWNER/REPO/pulls/PR_NUMBER/comments/COMMENT_DATABASE_ID/replies --input -
   ```

3. **Verify the response** — the JSON response MUST contain `"id"` and the correct `"body"` text. Print and check the response. Do NOT use `--silent`.

4. After posting all replies, verify thread placement via GraphQL (the REST GET endpoint for `/replies` does not exist and returns 404):
   ```bash
   gh api graphql -f query='
   query {
     repository(owner: "OWNER", name: "REPO") {
       pullRequest(number: PR_NUMBER) {
         reviewThreads(first: 50) {
           nodes {
             id
             comments(first: 10) {
               nodes { databaseId body author { login } }
             }
           }
         }
       }
     }
   }' | jq '.data.repository.pullRequest.reviewThreads.nodes[] | {id, comments: [.comments.nodes[] | {databaseId, author: .author.login, body: .body[:80]}]}'
   ```
   Confirm your reply appears in the correct thread.

5. Clean up: `rm /tmp/pr-reply-body.txt`

### Rules:
- Endpoint is `pulls/PR_NUMBER/comments/COMMENT_DATABASE_ID/replies` — the databaseId goes in the URL path, NOT as a JSON field
- Body is sent via `jq -n --rawfile body FILE '{"body": $body}' | gh api ... --input -` — this handles all escaping correctly
- `--raw-field body=@file` does NOT work — `gh api` ignores `@` syntax for `--raw-field` and sends the literal string `@/tmp/filename.txt`. NEVER use this pattern.
- A reply needs ONLY `body` in the JSON payload. NEVER supply `in_reply_to`, `commit_id`, `path`, or `position`.
- NEVER use `--silent` — you need to see the response to verify success.
- Verify thread placement via GraphQL after posting — REST GET for replies returns 404.
</critical>

## Step 4: Resolve threads (if requested)

```bash
gh api graphql -f query='mutation { resolveReviewThread(input: {threadId: "THREAD_GRAPHQL_ID"}) { thread { isResolved } } }' --jq '.data.resolveReviewThread.thread.isResolved'
```

## Step 5: Approve PR (if requested)

```bash
gh pr review PR_NUMBER --repo OWNER/REPO --approve --body "LGTM"
```

## Tone guidance

Write replies as a **developer responding to code review** — concise, factual, no fluff:
- For fixed items: "Fixed in <commit-sha>. <1-sentence explanation of what changed>."
- For deferred items: "Acknowledged, deferring. <1-sentence rationale>."
- For disagreements: "Keeping as-is. <1-sentence rationale>."
- No greetings, no "thanks for the review", no emojis.
