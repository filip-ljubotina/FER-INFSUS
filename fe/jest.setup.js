"use client";

import "@testing-library/jest-dom";

// Mock the SidebarProvider and other components that might cause issues in tests
jest.mock("@/components/ui/sidebar", () => ({
  SidebarProvider: ({ children }) => <div>{children}</div>,
  SidebarInset: ({ children }) => <div>{children}</div>,
  Sidebar: ({ children }) => <div>{children}</div>,
  SidebarContent: ({ children }) => <div>{children}</div>,
  SidebarHeader: ({ children }) => <div>{children}</div>,
  SidebarMenu: ({ children }) => <div>{children}</div>,
  SidebarMenuItem: ({ children }) => <div>{children}</div>,
  SidebarMenuButton: ({ children, onClick }) => (
    <button onClick={onClick}>{children}</button>
  ),
  SidebarFooter: ({ children }) => <div>{children}</div>,
  SidebarRail: () => null,
}));

// Mock the Dialog component
jest.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children, open }) => (open ? <div>{children}</div> : null),
  DialogContent: ({ children }) => <div>{children}</div>,
  DialogHeader: ({ children }) => <div>{children}</div>,
  DialogTitle: ({ children }) => <h2>{children}</h2>,
}));

// Mock the Select component
jest.mock("@/components/ui/select", () => ({
  Select: ({ children, value, onValueChange }) => (
    <div>
      {children}
      <select
        value={value}
        onChange={(e) => onValueChange && onValueChange(e.target.value)}
        data-testid="select"
      >
        <option value="">Select an option</option>
        <option value="101">Ana Marić</option>
        <option value="102">Ivan Kovač</option>
        <option value="103">Marija Novak</option>
        <option value="104">Petar Horvat</option>
        <option value="105">Josipa Jurić</option>
      </select>
    </div>
  ),
  SelectTrigger: ({ children }) => <div>{children}</div>,
  SelectValue: ({ children, placeholder }) => (
    <div>{children || placeholder}</div>
  ),
  SelectContent: ({ children }) => <div>{children}</div>,
  SelectItem: ({ children, value }) => <div data-value={value}>{children}</div>,
}));

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock window.alert
window.alert = jest.fn();
