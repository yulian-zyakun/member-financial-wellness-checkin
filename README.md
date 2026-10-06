# Interview Starter

A self-contained Laravel + React/MUI starter repo for interview candidates.

**Stack:** PHP 8.4 · Laravel 13 · MySQL 8 · React 19 · MUI 9 · Vite 8 · React Query 5 · React Router 7

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) with Compose v2
- Ports **8000** (app), **8080** (Adminer), **5173** (Vite), and **13306** (MySQL) must be available on your machine

## Setup

```bash
cp .env.example .env
docker compose up -d
```

That's it. The `php` container will automatically:

1. Run `composer install`
2. Run migrations
3. Seed the database with example data

Wait about 10–15 seconds on first boot for MySQL to initialize and migrations to run.

## Service URLs

| Service          | URL                   |
| ---------------- | --------------------- |
| App              | http://localhost:8000 |
| Adminer (DB GUI) | http://localhost:8080 |

**Adminer credentials:**

- Server: `mysql`
- Username: `interview`
- Password: `secret`
- Database: `interview`

> **Note:** MySQL is exposed on host port `13306` (not `3306`) to avoid conflicts. If connecting with an external client use `localhost:13306`.

## API

The example scaffold exposes a full CRUD API for `Task` resources:

| Method | Endpoint          | Description    |
| ------ | ----------------- | -------------- |
| GET    | `/api/tasks`      | List all tasks |
| POST   | `/api/tasks`      | Create a task  |
| GET    | `/api/tasks/{id}` | Get a task     |
| PATCH  | `/api/tasks/{id}` | Update a task  |
| DELETE | `/api/tasks/{id}` | Delete a task  |

A task has `title` (string, required), `description` (text, optional), and `status` (`todo` / `in_progress` / `done`).

## Frontend

The React app is served by Vite with HMR. It loads automatically when you visit http://localhost:8000. The `node` container runs Vite in the background — changes to files in `resources/js/react/` will hot-reload in the browser.

## Project Structure

```
app/
  Enums/TaskStatus.php          # Status enum (todo, in_progress, done)
  Http/
    Controllers/Api/
      TaskController.php        # CRUD endpoints
    Requests/
      StoreTaskRequest.php      # Validation
      UpdateTaskRequest.php
  Models/
    Task.php
    User.php                    # Included if you want to add auth, but not required
database/
  migrations/                   # Includes tasks, users, cache, jobs tables
  seeders/TaskSeeder.php
routes/
  api.php                       # Route::apiResource('tasks', ...)
  web.php                       # SPA catch-all
resources/js/react/
  main.jsx                      # Entry point (QueryClient, ThemeProvider)
  App.jsx                       # AppBar shell + <Outlet />
  lib/api.js                    # fetch wrapper
  pages/Tasks/index.jsx         # Task list page (React Query + MUI Table)
  theme/                        # MUI theme + dark mode
```

## Useful Commands

```bash
# Tail all container logs
docker compose logs -f

# Run artisan commands
docker compose exec php php artisan <command>

# Generate a new migration
docker compose exec php php artisan make:migration create_things_table

# Open a shell in the PHP container
docker compose exec php bash

# Reset the database
docker compose exec php php artisan migrate:fresh --seed

# Stop everything
docker compose down

# Stop and remove the database volume (full reset)
docker compose down -v

# Lint JS with Biome
docker compose exec node sh -c "cd /app && npm run lint"

# Lint + format JS with Biome
docker compose exec node sh -c "cd /app && npm run check"
```

## Adding Things

**New API resource (backend):**

1. `make:migration`, `make:model`, `make:controller --api` via `docker compose exec php php artisan ...`
2. Add `Route::apiResource(...)` to `routes/api.php`

**New page (frontend):**

1. Create `resources/js/react/pages/YourPage/index.jsx`
2. Add a `<Route>` in `resources/js/react/main.jsx`
3. Add a method to `resources/js/react/lib/api.js`

**New API call from React:**
All fetch calls go through `lib/api.js` — add a method there and use `useQuery` / `useMutation` from React Query to call it in your component.

> The `Task` scaffold is just an example to show the pattern — you're not required to build on top of it. Feel free to ignore it and start fresh with your own models and pages.

## Problem/Solution Prompts

These are intentionally open-ended. There's no right answer — pick whichever resonates, interpret the problem however makes sense to you, and build what you think is most valuable. We're more interested in the decisions you make and why than in how much you complete.

### Staff Idea Board

Credit unions run on cooperative principles; member and staff voice matters. Build an internal idea submission board where staff can post improvement suggestions (process, product, member experience), other staff can upvote or comment, and leadership can update the status (Under Review, Planned, Implemented, Declined).

### New Member Journey Tracker

Onboarding a new member well is critical; properly set-up members are far more likely to stay and grow their relationship. Build a tool for branch staff to track where each new member is in their onboarding journey: account opened, e-statements activated, mobile app set up, appropriate product conversation had (e.g. TFSA, FHSA, overdraft protection).

### Member Financial Wellness Check-In

Credit unions differentiate from banks on member wellbeing. Build a tool where a member (or a staff member on their behalf) can log a periodic financial check-in: income, rough monthly expenses by category (housing, food, transport, debt payments), and savings. The tool should surface something useful from that data, whatever makes sense to the candidate.

# Member Financial Wellness Check-In Feature

## Overview

The Member Financial Wellness Check-In is a simple tool for tracking a member's financial situation over time.
Members can record their monthly income, expenses, debt payments, and savings.
The application then summarizes their financial position and highlights useful trends, including remaining money, savings rate, and debt-to-income ratio.
The goal is to provide a lightweight financial wellness snapshot and derive useful insights and metrics.

## Features

### Assumptions

The following assumptions were made to keep the feature focused and within the scope:

- A financial check-in represents one calendar month.
- Each month can have only one check-in.
- The `check in date` represents the month of the check-in and is stored as the first day of that month (for example, `2026-10-01` represents October 2026).
  Formatting of dates is simplified to avoid time zone considerations.
- Financial amounts are entered and displayed as Canadian dollars (CAD).
- Monetary values are stored in the database as integer cents to avoid floating-point precision issues.
- The React UI converts between dollars and cents at the API level.
- Expense categories are intentionally broad:
    - Housing
    - Food
    - Transportation
    - Debt payments
- Savings is tracked separately from expenses.
- Authentication and staff-member entry on behalf of a member were considered outside the scope of this implementation.
- The metrics for financial check-ins are based on the entered data to provide insights instead of giving a financial advice. Also some benchmarks for the savings or DTI rates would be agreat edition but a separate implementation.
- The financial check-in charts are line charts (as an example of visual representation on the page) and a part of the summary to show the metrics in dynamic.
- Can be a subject for improvement of the feature: conversion on the front-end side; layout of the summary and financial history sections on the page; expense structure with a drill down option etc.

### Financial Wellness Features

#### Financial Check-In Management

Members can:

- Create a monthly financial check-in.
- Edit an existing check-in.
- Delete a check-in.
- View their check-in history.
- View trends in charts based on their check-in log history.

#### Financial Summary

The latest check-in provides a summary of:

- Income
- Total expenses
- Remaining money
- Savings rate
- Debt-to-income ratio

#### Financial Calculations

Total expenses: Housing + Food + Transportation + Debt payments

Remaining: Income - Total expenses - Savings

Savings rate: Savings / Income × 100

Debt-to-income ratio: Debt payments / Income × 100

#### Financial Trends

When multiple check-ins are available, the application displays charts showing how the member's financial position changes over time, including:

- Income
- Total expenses
- Remaining money
- Savings rate
- Debt-to-income ratio

This enhancement builds on the historical check-in data to help members identify financial trends in dynamic in addtion to viewing each monthly financial check-in in isolation.
