# MA Drive Tutorial

Google Drive–style application built with the modern Next.js stack. It demonstrates how to combine Clerk auth, UploadThing uploads, and Drizzle ORM into a cohesive drive experience with folders, files, and responsive UI.

## Overview

- **Framework**: Next.js App Router with React Server Components and client islands where needed.
- **Auth**: Clerk secures every server action and exposes user context.
- **Database**: Drizzle ORM + SQL database to persist folders/files with parent-child relations.
- **Uploads**: UploadThing handles browser-to-cloud transfers and returns shareable URLs.
- **UI**: Tailwind CSS, shadcn/ui primitives, and lucide-react icons for a polished interface.
- **Feedback**: react-hot-toast notifies users about create/edit/delete/upload flows.

## Features

- Hierarchical folder tree stored in the database with per-user ownership.
- Upload files into any folder and render metadata (size, modified date).
- Delete folders (with their files) or individual files.
- Create and rename folders through validated server actions.
- Responsive drive view: table layout on desktop, cards on mobile.
- Toast-driven UX that mirrors Google Drive interactions.

## Getting Started

1. **Install dependencies**
   ```bash
   pnpm install
   ```
2. **Configure environment variables**
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
   - `UPLOADTHING_TOKEN`
   - `DATABASE_URL`
   - `SINGLESTORE_HOST`, `SINGLESTORE_USER`, `SINGLESTORE_PASSWORD`, `SINGLESTORE_PORT`, `SINGLESTORE_DB_NAME`
3. **Run database migrations**
   ```bash
   pnpm drizzle-kit push
   ```
4. **Start the dev server**
   ```bash
   pnpm dev
   ```

## Todo / Roadmap

- [x] Setup the database schema
- [x] Move folder state into the URL
- [x] Add authentication (Clerk)
- [x] Implement file uploads (UploadThing)
- [x] Upload files to folders
- [x] Delete files
- [x] Build the drive home page
- [x] Create folders
- [x] Update folder names
- [x] Delete folders and their files
- [x] Toast notifications for upload/create/edit/delete
- [x] Client-side handling of folder success responses
- [x] Responsive drive layout (table + mobile cards)
- [x] Add searching and filtering
- [x] Enhanced Styling & Glassmorphism UI
- [ ] Bulk selection + multi-delete
- [ ] Share links / collaboration
