"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Department, User } from "./hospital-dashboard";

interface CreateDepartmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (department: Department) => void;
  users: User[];
}

export function CreateDepartmentDialog({
  open,
  onOpenChange,
  onSubmit,
  users,
}: CreateDepartmentDialogProps) {
  const [formData, setFormData] = useState<Department>({
    idOdjel: "",
    imeOdjela: "",
    kriloBolnice: "",
    idVoditeljOdjela: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleHeadChange = (value: string) => {
    setFormData((prev) => ({ ...prev, idVoditeljOdjela: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit(formData);

    setFormData({
      idOdjel: "",
      imeOdjela: "",
      kriloBolnice: "",
      idVoditeljOdjela: "",
    });
  };

  const currentHead = users.find(
    (user) => user.id === formData.idVoditeljOdjela
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Department</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="imeOdjela">Department Name</Label>
            <Input
              id="imeOdjela"
              name="imeOdjela"
              value={formData.imeOdjela}
              onChange={handleChange}
              placeholder="Enter department name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="kriloBolnice">Hospital Wing</Label>
            <Input
              id="kriloBolnice"
              name="kriloBolnice"
              value={formData.kriloBolnice}
              onChange={handleChange}
              placeholder="Enter hospital wing (e.g., A, B, C)"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="idVoditeljOdjela">Department Head</Label>
            <Select
              value={formData.idVoditeljOdjela}
              onValueChange={handleHeadChange}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department head" />
              </SelectTrigger>
              <SelectContent>
                {users
                  .filter((user) => user.uloga === "voditelj")
                  .map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.ime} {user.prezime}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {currentHead && (
            <div className="bg-muted p-4 rounded-md">
              <h3 className="font-medium mb-2">
                Selected Department Head Details:
              </h3>
              <p>
                <span className="font-medium">Name:</span> {currentHead.ime}{" "}
                {currentHead.prezime}
              </p>
              <p>
                <span className="font-medium">OIB:</span> {currentHead.oib}
              </p>
              <p>
                <span className="font-medium">Role:</span> {currentHead.uloga}
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
