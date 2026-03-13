# Issue
## Title
Use Specific Types for Request and Response

## Description
The current implementation uses `any` for the request (`req`) and response (`res`) objects in the handler function. This can lead to potential type safety issues and runtime errors that are not caught during development. Using more specific types will improve the robustness and maintainability of the code.

## Affected Files
- api/dashboard.ts

## Severity
High

## Suggested Fix
Replace `any` with more specific types for `req` and `res`. For example, use `NextApiRequest` and `NextApiResponse` from `next` if this is a Next.js project, or appropriate types from the framework being used.