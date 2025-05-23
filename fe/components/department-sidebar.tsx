"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Building2, Plus } from "lucide-react";
import type { Department, User } from "./hospital-dashboard";
import { Button } from "@/components/ui/button";
import { CreateDepartmentDialog } from "./create-department-dialog";
import { useState } from "react";

interface DepartmentSidebarProps {
  departments: Department[];
  onSelectDepartment: (department: Department) => void;
  selectedDepartmentId?: string;
  onCreateDepartment?: (department: Department) => void;
  users?: User[];
}

export function DepartmentSidebar({
  departments,
  onSelectDepartment,
  selectedDepartmentId,
  onCreateDepartment,
  users = [],
}: DepartmentSidebarProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateDepartment = (department: Department) => {
    if (onCreateDepartment) {
      onCreateDepartment(department);
    }
    setIsDialogOpen(false);
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-green-600 text-white">
                <Building2 className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">Hospital Management</span>
                <span className="text-xs">Departments</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent >
        <SidebarMenu>
          {departments.map((department) => (
            <SidebarMenuItem key={department.idOdjel}>
              <SidebarMenuButton
                asChild
                isActive={department.idOdjel === selectedDepartmentId}
                onClick={() => onSelectDepartment(department)}
              >
                <span className="flex justify-between w-full">
                  <span>{department.imeOdjela}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    Wing {department.kriloBolnice}
                  </span>
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Button
          className="w-full bg-green-600 hover:bg-green-700"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> Create Department
        </Button>
      </SidebarFooter>
      <SidebarRail />

      <CreateDepartmentDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleCreateDepartment}
        users={users}
      />
    </Sidebar>
  );
}
