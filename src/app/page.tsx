"use client"

import { useState } from "react"
import { DriveHeader } from "~/components/drive-header"
import { DriveContent } from "~/components/drive-content"

export type FileSystemItem = {
  id: string
  name: string
  type: "folder" | "file"
  size?: string
  modified: string
  fileUrl?: string
  children?: FileSystemItem[]
}

const mockData: FileSystemItem[] = [
  {
    id: "1",
    name: "Work Projects",
    type: "folder",
    modified: "Oct 15, 2024",
    children: [
      {
        id: "1-1",
        name: "Q4 Presentation.pptx",
        type: "file",
        size: "4.2 MB",
        modified: "Oct 15, 2024",
        fileUrl: "https://example.com/q4-presentation.pptx",
      },
      {
        id: "1-2",
        name: "Budget Proposal.xlsx",
        type: "file",
        size: "856 KB",
        modified: "Oct 12, 2024",
        fileUrl: "https://example.com/budget-proposal.xlsx",
      },
      {
        id: "1-3",
        name: "Client Meeting Notes",
        type: "folder",
        modified: "Oct 10, 2024",
        children: [
          {
            id: "1-3-1",
            name: "Meeting Agenda.docx",
            type: "file",
            size: "124 KB",
            modified: "Oct 10, 2024",
            fileUrl: "https://example.com/meeting-agenda.docx",
          },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Personal",
    type: "folder",
    modified: "Oct 8, 2024",
    children: [
      {
        id: "2-1",
        name: "Vacation Photos",
        type: "folder",
        modified: "Sep 20, 2024",
        children: [
          {
            id: "2-1-1",
            name: "beach.jpg",
            type: "file",
            size: "2.4 MB",
            modified: "Sep 20, 2024",
            fileUrl: "https://example.com/beach.jpg",
          },
          {
            id: "2-1-2",
            name: "sunset.jpg",
            type: "file",
            size: "3.1 MB",
            modified: "Sep 20, 2024",
            fileUrl: "https://example.com/sunset.jpg",
          },
        ],
      },
      {
        id: "2-2",
        name: "Resume.pdf",
        type: "file",
        size: "245 KB",
        modified: "Oct 8, 2024",
        fileUrl: "https://example.com/resume.pdf",
      },
    ],
  },
  {
    id: "3",
    name: "Design Assets.zip",
    type: "file",
    size: "125 MB",
    modified: "Oct 5, 2024",
    fileUrl: "https://example.com/design-assets.zip",
  },
  {
    id: "4",
    name: "Report 2024.pdf",
    type: "file",
    size: "1.8 MB",
    modified: "Sep 28, 2024",
    fileUrl: "https://example.com/report-2024.pdf",
  },
  {
    id: "5",
    name: "Documents",
    type: "folder",
    modified: "Sep 15, 2024",
    children: [
      {
        id: "5-1",
        name: "Contract.pdf",
        type: "file",
        size: "567 KB",
        modified: "Sep 15, 2024",
        fileUrl: "https://example.com/contract.pdf",
      },
      {
        id: "5-2",
        name: "Invoice.pdf",
        type: "file",
        size: "234 KB",
        modified: "Sep 10, 2024",
        fileUrl: "https://example.com/invoice.pdf",
      },
    ],
  },
]

export default function DrivePage() {
  const [currentPath, setCurrentPath] = useState<FileSystemItem[]>([])

  const getCurrentItems = (): FileSystemItem[] => {
    if (currentPath.length === 0) return mockData

    let items = mockData
    for (const pathItem of currentPath) {
      const found = items.find((item) => item.id === pathItem.id)
      if (found?.children) {
        items = found.children
      }
    }
    return items
  }

  const navigateToFolder = (folder: FileSystemItem) => {
    setCurrentPath([...currentPath, folder])
  }

  const navigateUp = () => {
    setCurrentPath(currentPath.slice(0, -1))
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
          onNavigateUp={navigateUp}
          onNavigateToRoot={navigateToRoot}
        />
      </div>
    </div>
  )
}
