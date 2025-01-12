# Organizational Hierarchy Validator

This project is a web application built with Angular that allows users to upload a CSV file containing organizational hierarchy data and validates it against predefined rules. The application identifies and displays errors for rows that do not conform to the organizational structure rules.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.5.

## Features

#### 1. File Upload Interface

Users can upload a CSV file containing organizational hierarchy data. The file should have rows representing users and their relationships.

#### 2. Validation Logic

The application enforces the following hierarchy rules:

1. Caller: Must report to a manager only. Cannot report to another caller, admin, or root.
2. Manager: Can report to another manager or an admin. Cannot report to root or callers.
3. Admin: Can only report to the root (super admin).
4. Root: Does not report to any other user.
5. Each user must report to exactly one parent user.

#### 3. Error Detection

The application identifies rows in the uploaded CSV file that violate these rules. Errors are displayed clearly, allowing the user to review and correct the data.

## Getting Started

#### Prerequisites

- Node.js (v18.15.0)
- Angular CLI (v15.2.5)

#### Installation

1. Clone the repository

```bash
   git clone https://github.com/divyu-s/joy-ai-assignment.git
```

2. Install dependencies

```bash
npm install
```

3. Run the development server

```bash
ng serve
```

4.  Open the application in your browser

```bash
http://localhost:4200
```

## File Format

```bash
Email,FullName,Role,ReportsTo
mr.goyal@example.com,Mr. Goyal,Root,
akash@example.com,Akash,Admin,mr.goyal@example.com
piyush@example.com,Piyush,Manager,akash@example.com
harsh@example.com,Harsh,Caller,piyush@example.com
rahul@example.com,Rahul,Manager,mr.goyal@example.com
ubaid@example.com,Ubaid,Manager,harsh@example.com
zainab@example.com,Zainab,Caller,mr.goyal@example.com
shivangi@example.com,Shivangi,Caller,piyush@example.com;akash@example.com
mukul@example.com,Mukul,Admin,mr.goyal@example.com
amrit@example.com,Amrit,Manager,mukul@example.com
mr.agarwal@example.com,Mr. Agarwal,Caller,amrit@example.com
mr.puniya@example.com,Mr. Puniya,Caller,mr.agarwal@example.com
mr.taliwal@example.com,Mr. Taliwal,Manager,mr.agarwal@example.com
miss.mirza@example.com,Miss Mirza,Admin,piyush@example.com
miss.gautam@example.com,Miss Gautam,Caller,miss.mirza@example.com
```
