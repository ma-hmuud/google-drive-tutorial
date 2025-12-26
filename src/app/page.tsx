"use client"

import { useState } from "react"
import { DriveHeader } from "~/components/drive-header"
import { DriveContent } from "~/components/drive-content"

export type File = {
  id: string
  name: string
  type: "file"
  size: string
  modified: string
  fileUrl: string
  parent: string
}

export type Folder = {
  id: string
  name: string
  type: "folder"
  modified: string
  parent: string | null
}

export type Item = File | Folder

const mockFolders: Folder[] = [
  {
    id: "root",
    name: "Root",
    type: "folder",
    modified: "Dec 20, 2024",
    parent: null,
  },
  // Root level folders
  {
    id: "folder-projects",
    name: "Projects",
    type: "folder",
    modified: "Dec 25, 2024",
    parent: "root",
  },
  {
    id: "folder-documents",
    name: "Documents",
    type: "folder",
    modified: "Dec 24, 2024",
    parent: "root",
  },
  {
    id: "folder-photos",
    name: "Photos",
    type: "folder",
    modified: "Dec 22, 2024",
    parent: "root",
  },
  {
    id: "folder-archives",
    name: "Archives",
    type: "folder",
    modified: "Nov 15, 2024",
    parent: "root",
  },
  // Projects subfolders
  {
    id: "folder-web-dev",
    name: "Web Development",
    type: "folder",
    modified: "Dec 25, 2024",
    parent: "folder-projects",
  },
  {
    id: "folder-mobile",
    name: "Mobile Apps",
    type: "folder",
    modified: "Dec 18, 2024",
    parent: "folder-projects",
  },
  {
    id: "folder-design",
    name: "Design Files",
    type: "folder",
    modified: "Dec 10, 2024",
    parent: "folder-projects",
  },
  // Photos subfolders
  {
    id: "folder-vacation",
    name: "Vacation 2024",
    type: "folder",
    modified: "Dec 22, 2024",
    parent: "folder-photos",
  },
  {
    id: "folder-family",
    name: "Family Photos",
    type: "folder",
    modified: "Dec 15, 2024",
    parent: "folder-photos",
  },
]

const mockFiles: File[] = [
  // Root level files
  {
    id: "file-readme",
    name: "README.md",
    type: "file",
    size: "2.4 KB",
    modified: "Dec 26, 2024",
    fileUrl: "https://example.com/readme.md",
    parent: "root",
  },
  {
    id: "file-notes",
    name: "Quick Notes.txt",
    type: "file",
    size: "1.2 KB",
    modified: "Dec 25, 2024",
    fileUrl: "https://example.com/notes.txt",
    parent: "root",
  },
  // Documents folder files
  {
    id: "file-resume",
    name: "Resume_2024.pdf",
    type: "file",
    size: "245 KB",
    modified: "Dec 24, 2024",
    fileUrl: "https://example.com/resume.pdf",
    parent: "folder-documents",
  },
  {
    id: "file-cover-letter",
    name: "Cover_Letter.docx",
    type: "file",
    size: "87 KB",
    modified: "Dec 23, 2024",
    fileUrl: "https://example.com/cover.docx",
    parent: "folder-documents",
  },
  {
    id: "file-budget",
    name: "Budget_2024.xlsx",
    type: "file",
    size: "156 KB",
    modified: "Dec 20, 2024",
    fileUrl: "https://example.com/budget.xlsx",
    parent: "folder-documents",
  },
  {
    id: "file-presentation",
    name: "Q4_Presentation.pptx",
    type: "file",
    size: "3.2 MB",
    modified: "Dec 18, 2024",
    fileUrl: "https://example.com/presentation.pptx",
    parent: "folder-documents",
  },
  // Web Development folder files
  {
    id: "file-portfolio",
    name: "portfolio-design.fig",
    type: "file",
    size: "4.8 MB",
    modified: "Dec 25, 2024",
    fileUrl: "https://example.com/portfolio.fig",
    parent: "folder-web-dev",
  },
  {
    id: "file-api-docs",
    name: "API_Documentation.pdf",
    type: "file",
    size: "892 KB",
    modified: "Dec 24, 2024",
    fileUrl: "https://example.com/api-docs.pdf",
    parent: "folder-web-dev",
  },
  {
    id: "file-wireframes",
    name: "wireframes_v2.sketch",
    type: "file",
    size: "2.1 MB",
    modified: "Dec 22, 2024",
    fileUrl: "https://example.com/wireframes.sketch",
    parent: "folder-web-dev",
  },
  {
    id: "file-mockup",
    name: "homepage_mockup.psd",
    type: "file",
    size: "15.6 MB",
    modified: "Dec 20, 2024",
    fileUrl: "https://example.com/mockup.psd",
    parent: "folder-web-dev",
  },
  // Mobile Apps folder files
  {
    id: "file-app-icon",
    name: "app_icon.png",
    type: "file",
    size: "128 KB",
    modified: "Dec 18, 2024",
    fileUrl: "https://example.com/app-icon.png",
    parent: "folder-mobile",
  },
  {
    id: "file-splash",
    name: "splash_screen.png",
    type: "file",
    size: "456 KB",
    modified: "Dec 17, 2024",
    fileUrl: "https://example.com/splash.png",
    parent: "folder-mobile",
  },
  {
    id: "file-apk",
    name: "app_v1.2.3.apk",
    type: "file",
    size: "28.4 MB",
    modified: "Dec 15, 2024",
    fileUrl: "https://example.com/app.apk",
    parent: "folder-mobile",
  },
  // Design Files folder files
  {
    id: "file-logo",
    name: "company_logo.svg",
    type: "file",
    size: "45 KB",
    modified: "Dec 10, 2024",
    fileUrl: "https://example.com/logo.svg",
    parent: "folder-design",
  },
  {
    id: "file-brand-guide",
    name: "Brand_Guidelines.pdf",
    type: "file",
    size: "5.6 MB",
    modified: "Dec 8, 2024",
    fileUrl: "https://example.com/brand.pdf",
    parent: "folder-design",
  },
  {
    id: "file-color-palette",
    name: "color_palette.ase",
    type: "file",
    size: "12 KB",
    modified: "Dec 5, 2024",
    fileUrl: "https://example.com/colors.ase",
    parent: "folder-design",
  },
  // Vacation Photos folder files
  {
    id: "file-beach1",
    name: "beach_sunset.jpg",
    type: "file",
    size: "3.2 MB",
    modified: "Dec 22, 2024",
    fileUrl: "https://example.com/beach1.jpg",
    parent: "folder-vacation",
  },
  {
    id: "file-beach2",
    name: "ocean_view.jpg",
    type: "file",
    size: "2.8 MB",
    modified: "Dec 22, 2024",
    fileUrl: "https://example.com/beach2.jpg",
    parent: "folder-vacation",
  },
  {
    id: "file-mountain",
    name: "mountain_hike.jpg",
    type: "file",
    size: "4.1 MB",
    modified: "Dec 21, 2024",
    fileUrl: "https://example.com/mountain.jpg",
    parent: "folder-vacation",
  },
  {
    id: "file-city",
    name: "city_lights.jpg",
    type: "file",
    size: "3.5 MB",
    modified: "Dec 20, 2024",
    fileUrl: "https://example.com/city.jpg",
    parent: "folder-vacation",
  },
  // Family Photos folder files
  {
    id: "file-family1",
    name: "christmas_2024.jpg",
    type: "file",
    size: "2.9 MB",
    modified: "Dec 15, 2024",
    fileUrl: "https://example.com/christmas.jpg",
    parent: "folder-family",
  },
  {
    id: "file-family2",
    name: "birthday_party.jpg",
    type: "file",
    size: "3.1 MB",
    modified: "Nov 28, 2024",
    fileUrl: "https://example.com/birthday.jpg",
    parent: "folder-family",
  },
  {
    id: "file-family3",
    name: "thanksgiving.jpg",
    type: "file",
    size: "2.7 MB",
    modified: "Nov 24, 2024",
    fileUrl: "https://example.com/thanksgiving.jpg",
    parent: "folder-family",
  },
  // Archives folder files
  {
    id: "file-backup",
    name: "backup_2024.zip",
    type: "file",
    size: "1.2 GB",
    modified: "Nov 15, 2024",
    fileUrl: "https://example.com/backup.zip",
    parent: "folder-archives",
  },
  {
    id: "file-old-project",
    name: "old_project_files.rar",
    type: "file",
    size: "856 MB",
    modified: "Oct 20, 2024",
    fileUrl: "https://example.com/old-project.rar",
    parent: "folder-archives",
  },
  {
    id: "file-archive",
    name: "archive_2023.7z",
    type: "file",
    size: "2.4 GB",
    modified: "Jan 5, 2024",
    fileUrl: "https://example.com/archive.7z",
    parent: "folder-archives",
  },
]

export default function DrivePage() {
  const [currentPath, setCurrentPath] = useState<Folder[]>([])

  const getCurrentItems = (): Item[] => {
    // Determine the current parent ID
    const currentParentId = currentPath.length === 0
      ? "root"
      : currentPath[currentPath.length - 1]!.id

    // Get folders in current location
    const folders = mockFolders.filter((folder) => folder.parent === currentParentId)

    // Get files in current location
    const files = mockFiles.filter((file) => file.parent === currentParentId)

    // Return combined array with folders first, then files
    return [...folders, ...files] as Item[]
  }

  const navigateToFolder = (folder: Folder) => {
    if (currentPath.find((pathItem) => pathItem.id === folder.id)) {
      setCurrentPath(currentPath.slice(0, currentPath.indexOf(folder) + 1))
    } else {
      setCurrentPath([...currentPath, folder])
    }
  }

  const navigateToRoot = () => {
    setCurrentPath([])
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <DriveHeader />
      <div className="flex flex-1 overflow-hidden">
        <DriveContent
          items={getCurrentItems()}
          currentPath={currentPath}
          onNavigateToFolder={navigateToFolder}
          onNavigateToRoot={navigateToRoot}
        />
      </div>
    </div>
  )
}
