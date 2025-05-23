"use client";

import type React from "react";

import { useState, useEffect } from "react";
import type { Department, User } from "./hospital-dashboard";
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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ConsumablesTable, type Consumable } from "./consumables-table";

interface DepartmentFormProps {
  department: Department;
  users: User[];
  onSubmit: (department: Department) => void;
  consumables?: Consumable[];
  onUpdateConsumable?: (consumable: Consumable) => void;
  onDeleteConsumable?: (consumableId: string) => void;
  onCreateConsumable?: (consumable: Consumable) => void;
}

export function DepartmentForm({
  department,
  users,
  onSubmit,
  consumables = [],
  onUpdateConsumable = () => {},
  onDeleteConsumable = () => {},
  onCreateConsumable = () => {},
}: DepartmentFormProps) {
  const [formData, setFormData] = useState<Department>({
    idOdjel: "",
    imeOdjela: "",
    kriloBolnice: "",
    idVoditeljOdjela: "",
  });

  useEffect(() => {
    setFormData({
      idOdjel: department.idOdjel,
      imeOdjela: department.imeOdjela,
      kriloBolnice: department.kriloBolnice,
      idVoditeljOdjela: department.idVoditeljOdjela,
    });
  }, [department]);

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
  };

  const handleDelete = async () => {
    const confirmed = confirm(
      "Are you sure you want to delete this department?"
    );
    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:8080/odjel?idOdjela=${department.idOdjel}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || "Failed to delete department");
      }

      alert("Department deleted successfully!");
      window.location.reload(); 
    } catch (error) {
      console.error("Error deleting department:", error);
      alert(
        error instanceof Error ? error.message : "Failed to delete department."
      );
    }
  };

  const currentHead = users.find(
    (user) => user.id === formData.idVoditeljOdjela
  );

  return (
    <div className="space-y-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Department: {department.imeOdjela}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="imeOdjela">Department Name</Label>
              <Input
                id="imeOdjela"
                name="imeOdjela"
                value={formData.imeOdjela}
                onChange={handleChange}
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
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="idVoditeljOdjela">Department Head</Label>
              <Select
                value={formData.idVoditeljOdjela}
                onValueChange={handleHeadChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department head">
                    {currentHead
                      ? `${currentHead.ime} ${currentHead.prezime}`
                      : "Select department head"}
                  </SelectValue>
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
              <div className="bg-muted p-4 rounded-md mt-4">
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
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              type="button"
              onClick={() =>
                setFormData({
                  idOdjel: department.idOdjel,
                  imeOdjela: department.imeOdjela,
                  kriloBolnice: department.kriloBolnice,
                  idVoditeljOdjela: department.idVoditeljOdjela,
                })
              }
            >
              Reset
            </Button>
            <div className="space-x-2">
              <Button
                variant="destructive"
                type="button"
                onClick={handleDelete}
              >
                Delete
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Save
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>

      <Separator className="my-8" />

      <ConsumablesTable
        departmentId={department.idOdjel}
        consumables={consumables}
        onEditConsumable={onUpdateConsumable}
        onDeleteConsumable={onDeleteConsumable}
        onCreateConsumable={onCreateConsumable}
      />
    </div>
  );
}
