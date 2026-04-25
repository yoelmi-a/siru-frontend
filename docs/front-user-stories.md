# Frontend User Stories — SIRUS SPA

## 1. Overview

This document contains the user story backlog for the SIRUS Angular SPA. Stories are organized by module and include acceptance criteria, priority, and dependencies.

> **Foundation story FE-00 must be completed first.** All other stories depend on the infrastructure it establishes (authentication, routing, API service). Developers should treat FE-00 as a prerequisite and implement it before starting any other story.

---

## 2. Story Conventions

- **ID:** `FE-NN`
- **Priority:** High | Medium | Low
- **Estimation:** Story points (Fibonacci: 1, 2, 3, 5, 8, 13)
- **Depends on:** Other stories that must be completed first

---

## 3. Foundation

---

### FE-00 — Project Foundation & Authentication Infrastructure

**As** the frontend development team,
**We want** to set up the Angular project with all core infrastructure,
**So that** developers can work on feature stories independently afterward.

**Priority:** High
**Estimate:** 8 SP
**Depends on:** Nothing (foundation story)

**Acceptance Criteria:**

- [x] Angular 21 project created with `ng new sirus-spa --routing --style=css`
- [x] Tailwind CSS and daisyUI installed and configured
- [x] `environment.ts` configured with `apiUrl = 'http://localhost:5000/api'`
- [x] TypeScript interfaces created in `core/models/` matching all DTOs from `api-reference.md`:
  - `vacancy.models.ts`: `VacantDto`, `SaveVacantDto`, `UpdateVacantDto`, `VacancyApplicationDto`, `VacancyApplicationResultDto`
  - `candidate.models.ts`: `CandidateDto`, `CandidateInsertDto`, `CandidateUpdateDto`
  - `employee.models.ts`: `EmployeeDto`, `EmployeeListDto`, `EmployeeInsertDto`, `EmployeeUpdateDto`, `EmployeeHistoryDto`, `EmployeePositionInsertDto`, `EmployeePositionDto`
  - `position.models.ts`: `PositionDto`, `PositionInsertDto`, `PositionUpdateDto`
  - `department.models.ts`: `DepartmentDto`, `DepartmentInsertDto`, `DepartmentUpdateDto`
  - `evaluation.models.ts`: `EvaluationDto`, `EvaluationInsertDto`, `EvaluationDetailDto`, `EvaluationHistoryDto`, `EvaluationCriterionInsertDto`, `CriterionDto`
  - `report.models.ts`: `HiringTimeReportDto`, `DepartmentPerformanceDto`, `EmployeeReportDto`
  - `auth.models.ts`: `AuthDto`, `JwtPayload`, `UserSessionDto`, `GetAccountDto`, `PaginatedResponse<T>`, `Pagination`
- [x] `AuthService` implemented in `core/services/auth.service.ts` with:
  - `login(email, password)` — calls `POST /api/v1/auth/login`, stores access token and refresh token in `localStorage`
  - `logout()` — calls `POST /api/v1/auth/logout`, clears localStorage and cookies, redirects to `/auth/login`
  - `refreshToken()` — calls `POST /api/v1/auth/refresh` with current access token + refresh token cookie
  - `getCurrentUser()` — decodes stored access token using `jwtDecode`, returns a signal with `JwtPayload`
  - `hasRole(role)` — checks if the decoded token contains the specified role
  - `isAuthenticated()` — returns `true` if a non-expired token exists in localStorage
  - `JwtPayload` interface with: `sub`, `uid`, `jti`, `email`, `fullName`, `roles: string[]`, `exp`
- [x] `AuthInterceptor` (`core/interceptors/auth.interceptor.ts`) attaches `Authorization: Bearer <token>` header to all HTTP requests
- [x] Interceptor handles `401` responses globally: clears tokens and redirects to `/auth/login`
- [x] `AuthGuard` (`core/guards/auth.guard.ts`) — protects routes, redirects unauthenticated users to `/auth/login`
- [x] `AdminGuard` (`core/guards/admin.guard.ts`) — restricts to Admin role only, redirects to `/` otherwise
- [x] `SupervisorGuard` (`core/guards/supervisor.guard.ts`) — restricts to Supervisor or Admin role, redirects to `/` otherwise
- [x] `ApiService` (`core/services/api.service.ts`) wrapping `HttpClient` with typed methods for all endpoints
- [x] `ToastService` (`core/services/toast.service.ts`) wrapping daisyUI toast notifications
- [x] Route configuration with lazy-loaded feature modules and route guards applied
- [x] `LoginComponent` (`features/auth/login.component.ts`) with email/password form
  - Submit calls `AuthService.login()`, on success redirects to `/` (dashboard)
  - Shows error toast on `401`, `423` responses
  - Links to "Forgot Password" page
- [x] `MainLayoutComponent` with sidebar navigation and top header bar showing logged-in user's `fullName` from JWT
- [x] `PublicLayoutComponent` with minimal header for public pages
- [x] `AuthLayoutComponent` for centered login card layout
- [x] All layout components use daisyUI navbar, sidebar, and utility classes
- [x] Application redirects to `/auth/login` if user is not authenticated when accessing a protected route
- [x] Application redirects to `/vacancies` after successful login

**Linked Requirements:** `api-reference.md` Section 2.5, Section 3.9, Section 3.10

---

## 4. Module 1 — Public Vacancy Pages

---

### FE-01 — Vacancy Listing & Detail (Public)

**As** a candidate,
**I want** to browse all open vacancies and view their details,
**So that** I can find positions I am interested in.

**Priority:** High
**Estimate:** 3 SP
**Depends on:** FE-00

**Acceptance Criteria:**

- [ ] `GET /api/vacancies` is called on page load
- [ ] Vacancy list page (`/vacancies`) displays all vacancies in a daisyUI table
- [ ] Each row shows: title, status badge, publication date
- [ ] Clicking a row navigates to `/vacancies/:id`
- [ ] Vacancy detail page (`/vacancies/:id`) shows: title, description, profile, status, publication date
- [ ] "Apply Now" button visible if vacancy status is `Open`
- [ ] "Apply Now" button navigates to `/vacancies/:id/apply`
- [ ] Page uses `PublicLayoutComponent` (no auth required)

**Linked Requirements:** `api-reference.md` Section 3.1, `VacantDto`

---

### FE-02 — Candidate Application Form (Public)

**As** a candidate,
**I want** to fill out a form and upload my CV,
**So that** I can apply for a vacancy.

**Priority:** High
**Estimate:** 5 SP
**Depends on:** FE-00, FE-01

**Acceptance Criteria:**

- [ ] Route: `GET /vacancies/:id/apply`
- [ ] Form fields: first name, last name, email, phone number, CV file upload
- [ ] CV file field accepts only `.pdf` files (client-side validation)
- [ ] File size client-side check: max 10 MB
- [ ] `POST /api/vacancies/:vacancyId/applications` is called with `multipart/form-data`
- [ ] Loading spinner during upload
- [ ] On `201 Created`: show success toast with "Application submitted successfully!", redirect to vacancy detail
- [ ] On `400`: show validation error messages from `detail`
- [ ] On `404`: show "Vacancy not found" toast, redirect to vacancy list
- [ ] On `409`: show conflict message from `detail`
- [ ] Page uses `PublicLayoutComponent`

**Linked Requirements:** `api-reference.md` Section 3.1, `VacancyApplicationDto`, `VacancyApplicationResultDto`

---

## 5. Module 2 — HR Admin Dashboard

---

### FE-03 — HR Admin Dashboard

**As** an HR Administrator,
**I want** to see an overview of key metrics,
**So that** I can quickly assess the current state of the organization.

**Priority:** Medium
**Estimate:** 3 SP
**Depends on:** FE-00

**Acceptance Criteria:**

- [ ] Route: `GET /` (dashboard home after login)
- [ ] Requires `AdminGuard` — only Admin role can access
- [ ] Dashboard displays:
  - Total open vacancies count (from `GET /api/vacancies`, filter by `Open` status)
  - Total active employees count (from `GET /api/employees`, filtered by `isActive=true`)
  - Average hiring time from `GET /api/reports/hiring-time`
  - Top 5 recent candidates who applied (from `GET /api/vacancies/:id/applications` for each open vacancy — pick 5 most recent)
- [ ] Each metric card links to the relevant management page
- [ ] Dashboard uses `MainLayoutComponent`

**Linked Requirements:** `api-reference.md` Section 3.1, Section 3.3, Section 3.8

---

## 6. Module 3 — Vacancy Management

---

### FE-04 — Vacancy Management (Admin)

**As** an HR Administrator,
**I want** to create, edit, and delete vacancies,
**So that** I can manage the recruitment pipeline.

**Priority:** High
**Estimate:** 5 SP
**Depends on:** FE-00

**Acceptance Criteria:**

- [x] Route: `GET /vacancies/manage` — list of all vacancies with status filter tabs (All / Open / Closed / Cancelled)
- [x] Requires `AdminGuard`
- [x] `GET /api/vacancies` called to populate the list
- [x] daisyUI table with columns: Title, Status badge, Publication Date, Actions
- [x] "Create Vacancy" button navigates to `/vacancies/manage/new`
- [x] "Edit" button navigates to `/vacancies/manage/:id/edit`
- [x] "Delete" button opens daisyUI modal confirmation, then calls `DELETE /api/vacancies/:id`
- [x] Vacancy create/edit form (`/vacancies/manage/new`, `/vacancies/manage/:id/edit`):
  - Fields: title, description, profile, status (dropdown: Open/Closed/Cancelled), position (dropdown from `GET /api/positions`)
  - `POST /api/vacancies` for create, `PUT /api/vacancies/:id` for edit
  - Cancel button navigates back to list
  - Validation errors shown per field from backend `400` response `detail`
- [x] Success toast on create/edit/delete
- [x] Uses `MainLayoutComponent`

**Linked Requirements:** `api-reference.md` Section 3.1, `SaveVacantDto`, `UpdateVacantDto`

---

## 7. Module 4 — Candidate Management

---

### FE-05 — Candidate Management (Admin)

**As** an HR Administrator,
**I want** to view all candidates and their applications,
**So that** I can track the recruitment pipeline.

**Priority:** High
**Estimate:** 3 SP
**Depends on:** FE-00

**Acceptance Criteria:**

- [x] Route: `GET /candidates`
- [x] Requires `AdminGuard`
- [x] `GET /api/candidates` called to list all candidates
- [x] daisyUI table with columns: Names, Last Names, Email, Phone, CV link, Actions
- [ ] Clicking a candidate row expands to show all their applications (from `GET /api/vacancies/:id/applications` for each vacancy they applied to)
- [x] "View CV" button opens the CV URL in a new tab
- [x] "Delete" candidate (soft delete via `DELETE /api/candidates/:id`)
- [x] Pagination on the candidates list (10 per page)
- [x] Uses `MainLayoutComponent`

**Linked Requirements:** `api-reference.md` Section 3.2, `CandidateDto`

---

## 8. Module 5 — Employee Management

---

### FE-06 — Employee Management (Admin)

**As** an HR Administrator,
**I want** to register, edit, deactivate employees, view their history and evaluations,
**So that** I can manage the organization's workforce.

**Priority:** High
**Estimate:** 8 SP
**Depends on:** FE-00

**Acceptance Criteria:**

- [ ] Route: `GET /employees`
- [ ] Requires `AdminGuard`
- [ ] `GET /api/employees?page=1&pageSize=10&isActive=true|false|null` for paginated list
- [ ] daisyUI table: Full Name, Cedula, Phone, Status badge, Actions
- [ ] Filter tabs: All / Active / Inactive
- [ ] Pagination controls (page, pageSize)
- [ ] "Register Employee" button → `/employees/new`
- [ ] "Edit" button → `/employees/:id/edit`
- [ ] "View" button → `/employees/:id` (detail page)
- [ ] Employee detail page (`/employees/:id`):
  - Shows all `EmployeeDto` fields
  - Tabs: "Work History" and "Evaluations"
  - Work History tab: `GET /api/employees/:id/history` displayed as timeline list
  - Evaluations tab: `GET /api/employees/:id/evaluations` displayed as evaluation cards with score badges
  - "Assign Position" button opens modal form
    - Dropdown: position (from `GET /api/positions`)
    - Start date picker
    - `POST /api/employees/:id/positions`
- [ ] Employee form (`/employees/new`, `/employees/:id/edit`):
  - Fields: firstName, lastName, address, cedula, phoneNumber, dateOfBirth, email
  - `POST /api/employees` / `PUT /api/employees/:id`
  - Validation errors per field
- [ ] "Deactivate" button (delete): `DELETE /api/employees/:id` (soft delete, sets `IsActive = false`)
- [ ] Uses `MainLayoutComponent`

**Linked Requirements:** `api-reference.md` Section 3.3, `EmployeeDto`, `EmployeeListDto`, `EmployeeHistoryDto`, `EmployeePositionDto`, `EvaluationHistoryDto`

---

## 9. Module 6 — Positions & Departments

---

### FE-07 — Position & Department Management (Admin)

**As** an HR Administrator,
**I want** to manage positions and departments,
**So that** I can maintain the organizational structure.

**Priority:** High
**Estimate:** 5 SP
**Depends on:** FE-00

**Acceptance Criteria:**

- [x] Route: `GET /positions`
- [x] Requires `AdminGuard`
- [x] Two tabs: "Positions" and "Departments"
- [x] **Positions tab**:
  - `GET /api/positions` list in daisyUI table: Name, Salary, Department, Actions
  - "Create Position" button → modal or form
    - Fields: name, salary (>= 1), department (dropdown from `GET /api/departments`)
    - `POST /api/positions`
  - "Edit" position → modal with `PUT /api/positions/:id`
  - "Delete" position → confirmation dialog → `DELETE /api/positions/:id`
  - Delete blocked if `409` returned (position has employee history) — show error toast
- [x] **Departments tab**:
  - `GET /api/departments` list in daisyUI table: ID, Name, Actions
  - "Create Department" button → modal
    - Field: name (unique)
    - `POST /api/departments`
  - "Edit" department → modal with `PUT /api/departments/:id`
  - "Delete" department → confirmation → `DELETE /api/departments/:id`
  - Delete blocked if `409` returned (department has positions) — show error toast
- [x] Success/error toasts on all operations
- [x] Uses `MainLayoutComponent`

**Linked Requirements:** `api-reference.md` Section 3.4, Section 3.5, `PositionDto`, `DepartmentDto`

---

## 10. Module 7 — Evaluation Criteria

---

### FE-08 — Evaluation Criteria Management (Admin)

**As** an HR Administrator,
**I want** to define and manage evaluation criteria,
**So that** supervisors can use them to create structured evaluations.

**Priority:** High
**Estimate:** 3 SP
**Depends on:** FE-00

**Acceptance Criteria:**

- [ ] Route: `GET /evaluation-criteria`
- [ ] Requires `AdminGuard`
- [ ] `GET /api/evaluation-criteria` to list all criteria
- [ ] daisyUI table: ID, Name, Actions
- [ ] "Add Criterion" button → modal
  - Field: name (unique)
  - `POST /api/evaluation-criteria`
  - Duplicate name → `409` error shown in toast
- [ ] "Edit" button → modal with `PUT /api/evaluation-criteria/:id`
- [ ] "Delete" button → confirmation → `DELETE /api/evaluation-criteria/:id`
  - Blocked if `409` returned (criterion used in evaluations) — show error toast
- [ ] Uses `MainLayoutComponent`

**Linked Requirements:** `api-reference.md` Section 3.7, `CriterionDto`

---

## 11. Module 8 — Evaluations

---

### FE-09 — Create Evaluation (Supervisor / Admin)

**As** a Supervisor,
**I want** to register a performance evaluation for an employee,
**So that** performance can be measured objectively.

**Priority:** High
**Estimate:** 5 SP
**Depends on:** FE-00, FE-08

**Acceptance Criteria:**

- [ ] Route: `GET /evaluations/create`
- [ ] Requires `SupervisorGuard` (Supervisor or Admin)
- [ ] Form fields:
  - Employee (searchable dropdown — `GET /api/employees` filtered by active)
  - Evaluation date (date picker)
  - Criteria entries (dynamic list):
    - Each entry: criterion (dropdown from `GET /api/evaluation-criteria`), score (number 0.0–5.0), observation (optional text)
    - "Add criterion" button to add more rows
    - At least one criterion required
    - Score validation: must be between 0.0 and 5.0
  - Score preview: show computed average as user enters scores
- [ ] `POST /api/evaluations` with `EvaluationInsertDto`
- [ ] On `201`: show success toast with "Evaluation created successfully!", redirect to history
- [ ] On `400`: show validation errors
- [ ] On `404`: show "Employee not found" toast
- [ ] Uses `MainLayoutComponent`

**Linked Requirements:** `api-reference.md` Section 3.6, `EvaluationInsertDto`, `EvaluationDto`

---

### FE-10 — View Evaluation History (Supervisor / Admin)

**As** a Supervisor or HR Administrator,
**I want** to see all evaluations for an employee,
**So that** I can analyze their performance over time.

**Priority:** Medium
**Estimate:** 3 SP
**Depends on:** FE-00, FE-08

**Acceptance Criteria:**

- [ ] Route: `GET /evaluations/history`
- [ ] Requires `SupervisorGuard`
- [ ] Employee selector (dropdown from `GET /api/employees` filtered by active)
- [ ] On employee selection: `GET /api/employees/:id/evaluations`
- [ ] Evaluations displayed as cards in reverse chronological order
- [ ] Each card shows: date, average score badge, position name, criteria breakdown
- [ ] Criteria shown as list: name, score (0.0–5.0 with color badge), observation text
- [ ] Uses `MainLayoutComponent`

**Linked Requirements:** `api-reference.md` Section 3.3 (GET /api/employees/:id/evaluations), `EvaluationHistoryDto`

---

## 12. Module 9 — Reports

---

### FE-11 — Reports & PDF Export (Admin)

**As** an HR Administrator,
**I want** to view reports and export them as PDF,
**So that** I can share organizational data with management.

**Priority:** Medium
**Estimate:** 5 SP
**Depends on:** FE-00

**Acceptance Criteria:**

- [ ] Route: `GET /reports`
- [ ] Requires `AdminGuard`
- [ ] Three report sections displayed on one page:
- [ ] **Hiring Time Report** section:
  - `GET /api/reports/hiring-time` displays averageDays and totalClosedVacancies
  - "Export PDF" button → `GET /api/reports/hiring-time/export` triggers PDF download as blob
  - Downloaded file named `hiring-time-report.pdf`
- [ ] **Performance by Department** section:
  - `GET /api/reports/performance-by-department` displays table: Department, Average Score, Employee Count
  - Sorted by average score descending
  - "Export PDF" button → `GET /api/reports/performance-by-department/export`
  - Downloaded file named `performance-by-department-report.pdf`
- [ ] **Employee Report** section:
  - `GET /api/reports/employees?page=1&pageSize=10&isActive=null` paginated list
  - Table: Full Name, Cedula, Position, Department, Status
  - Pagination controls
  - "Export PDF" button → `GET /api/reports/employees/export`
  - Downloaded file named `employees-report.pdf`
- [ ] On `500`: show error toast with message from `detail`
- [ ] PDF export uses `HttpClient` with `responseType: 'blob'`, triggers browser download
- [ ] Uses `MainLayoutComponent`

**Linked Requirements:** `api-reference.md` Section 3.8, `HiringTimeReportDto`, `DepartmentPerformanceDto`, `EmployeeReportDto`

---

## 13. Sprint Planning Suggestion

| Sprint | Stories | Theme |
|--------|---------|-------|
| **Sprint 1** | FE-00 | Foundation — Auth, routing, guards, services, layouts |
| **Sprint 2** | FE-01, FE-02, FE-03 | Public vacancy pages + Admin dashboard |
| **Sprint 3** | FE-04, FE-05, FE-07 | Vacancy CRUD, Candidates, Positions/Departments |
| **Sprint 4** | FE-06, FE-08, FE-09, FE-10 | Employee management, Evaluations |
| **Sprint 5** | FE-11 | Reports + PDF Export |
