# MaxCanvas

A parent-friendly dashboard for tracking your kids' school activities through Canvas LMS, with AI-powered homework help and weekly summaries.

## Features

- **Dashboard** — Course grades, upcoming assignments, announcements at a glance
- **Grades** — Per-course drilldown with assignment scores and missing work alerts
- **Assignments** — Upcoming/overdue assignments across all courses
- **Homework Helper** — AI tutor that guides without giving answers
- **Calendar** — Combined events and due dates in timeline view
- **Parent Catch-Up** — AI-generated weekly summary of what needs attention
- **Announcements, Discussions, Modules, Notifications** — Full Canvas integration

## Tech Stack

- **Next.js 14+** (App Router, Server Components, TypeScript)
- **Tailwind CSS** for styling
- **MCP Canvas LMS Server** via `@modelcontextprotocol/sdk`
- **Claude AI** (Anthropic SDK) for homework help and insights

## Setup

### 1. Prerequisites

- Node.js 18+
- A Canvas LMS account with API access
- Anthropic API key (for AI features)

### 2. Get Canvas API Tokens

For each child:
1. Log into Canvas (as the student or as a parent with Observer role)
2. Go to **Account > Settings**
3. Scroll to **Approved Integrations** and click **+ New Access Token**
4. Copy the generated token

### 3. Install & Configure

```bash
npm install
cp .env.local.example .env.local
```

Edit `.env.local` with your Canvas domain, API tokens, and Anthropic key:

```env
CANVAS_DOMAIN=school.instructure.com
CHILD_1_NAME=Max
CHILD_1_TOKEN=your_token_here
CHILD_2_NAME=Lily
CHILD_2_TOKEN=your_token_here
ANTHROPIC_API_KEY=sk-ant-your-key
```

### 4. Run

```bash
npm run dev
```

This starts both the Canvas MCP server and the Next.js app. Open [http://localhost:3000](http://localhost:3000).

To run just the Next.js app (if MCP server is already running):

```bash
npm run dev:next
```

## Architecture

```
Browser → Next.js (Server Components + API Routes)
              ↓
          MCP Client (streamable-http)
              ↓
          canvas-mcp-server (localhost:3001)
              ↓
          Canvas LMS API
```

All Canvas API tokens stay server-side. The MCP server handles authentication, pagination, and retries.

## Project Structure

```
src/
  app/          # Next.js App Router pages
  lib/          # MCP client, Canvas wrappers, AI helpers
  components/   # React components (layout, dashboard, grades, etc.)
  types/        # TypeScript type definitions
```

## Powered By

- [Canvas MCP Server](https://github.com/DMontgomery40/mcp-canvas-lms) — MCP integration for Canvas LMS
- [Anthropic Claude](https://anthropic.com) — AI-powered homework help and insights
