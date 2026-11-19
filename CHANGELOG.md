# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Add ability to delete tasks via soft-delete mechanism
  - New `deleted_at` column in tasks table for soft-delete tracking
  - `DELETE /tasks/:id` API endpoint that soft-deletes tasks and returns 404 if task doesn't exist
  - Delete button in frontend UI for each task
  - `deleteTask()` server action to wire up delete functionality
