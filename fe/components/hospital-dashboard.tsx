"use client";

import { useState, useEffect } from "react";
import { DepartmentSidebar } from "./department-sidebar";
import { DepartmentForm } from "./department-form";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import type { Consumable } from "./consumables-table";

export type User = {
  id: string;
  ime: string;
  prezime: string;
  oib: string;
  uloga: string;
};

export type Department = {
  idOdjel: string;
  imeOdjela: string;
  kriloBolnice: string;
  idVoditeljOdjela: string;
  ime?: string;
  prezime?: string;
  oib?: string;
  uloga?: string;
};

export function HospitalDashboard() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [consumables, setConsumables] = useState<Record<string, Consumable[]>>(
    {}
  );
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [departmentsRes, usersRes, consumablesRes] = await Promise.all([
          fetch("http://localhost:8080/odjel"),
          fetch("http://localhost:8080/korisnici"),
          fetch("http://localhost:8080/materijaliZaOdjel"),
        ]);

        if (!departmentsRes.ok || !usersRes.ok || !consumablesRes.ok) {
          throw new Error("Failed to fetch one or more resources");
        }

        const departments: Department[] = await departmentsRes.json();
        const users: User[] = await usersRes.json();
        const consumables: Record<string, Consumable[]> =
          await consumablesRes.json();
        setDepartments(departments);
        setUsers(users);
        setConsumables(consumables);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelectDepartment = (department: Department) => {
    setSelectedDepartment(department);
  };

  const handleUpdateDepartment = async (updatedDepartment: Department) => {
    try {
      const payload = {
        ...updatedDepartment,
        idOdjel: Number(updatedDepartment.idOdjel),
        idVoditeljOdjela:
          updatedDepartment.idVoditeljOdjela !== undefined
            ? Number(updatedDepartment.idVoditeljOdjela)
            : undefined,
      };

      const response = await fetch("http://localhost:8080/odjel", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update department");
      }

      const updatedData = await response.json();

      setDepartments((prevDepartments) =>
        prevDepartments.map((dept) =>
          dept.idOdjel === updatedData.idOdjel ? updatedData : dept
        )
      );

      setSelectedDepartment(updatedData);

      alert("Department updated successfully!");
    } catch (error) {
      console.error("Error updating department:", error);
      alert("Failed to update department. Please try again.");
    }
  };

  const handleCreateDepartment = async (newDepartment: Department) => {
    try {
      const response = await fetch("http://localhost:8080/odjel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imeOdjela: newDepartment.imeOdjela,
          kriloBolnice: newDepartment.kriloBolnice,
          idVoditeljOdjela: Number(newDepartment.idVoditeljOdjela) || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || "Failed to create department");
      }

      const createdDepartment: Department = await response.json();

      setDepartments((prevDepartments) => [
        ...prevDepartments,
        createdDepartment,
      ]);

      setConsumables((prev) => ({
        ...prev,
        [createdDepartment.idOdjel]: [],
      }));

      setSelectedDepartment(createdDepartment);

      alert("Department created successfully!");
    } catch (error) {
      console.error("Error creating department:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to create department. Please try again."
      );
    }
  };

  const handleUpdateConsumable = async (updatedConsumable: Consumable) => {
    try {
      const payload = {
        ...updatedConsumable,
        idOdjel: Number(updatedConsumable.idOdjel),
      };
      const response = await fetch("http://localhost:8080/azurirajMaterijal", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update consumable");
      }

      const updatedData = await response.json();
      if (selectedDepartment) {
        setConsumables((prev) => ({
          ...prev,
          [selectedDepartment.idOdjel]: prev[selectedDepartment.idOdjel].map(
            (item) =>
              item.idMaterijal === updatedConsumable.idMaterijal
                ? updatedData
                : item
          ),
        }));
      }

      alert("Consumable updated successfully!");
    } catch (error) {
      console.error("Error updating consumable:", error);
      alert("Failed to update consumable. Please try again.");
    }
  };

  const handleDeleteConsumable = async (consumableId: string) => {
    try {
      if (!selectedDepartment) return;

      const idOdjela = selectedDepartment.idOdjel;

      const response = await fetch(
        `http://localhost:8080/obrisiPotrosniMaterijal?idOdjela=${idOdjela}&idMaterijala=${consumableId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete consumable");
      }

      setConsumables((prev) => ({
        ...prev,
        [idOdjela]: prev[idOdjela].filter(
          (item) => item.idMaterijal !== consumableId
        ),
      }));

      alert("Consumable deleted successfully!");
    } catch (error) {
      console.error("Error deleting consumable:", error);
      alert("Failed to delete consumable. Please try again.");
    }
  };

  const handleCreateConsumable = async (newConsumable: Consumable) => {
    try {
      const payload = {
        ...newConsumable, 
        idOdjel: Number(newConsumable.idOdjel),
      };
      console.log("Creating consumable with payload:", payload);
      const response = await fetch(
        `http://localhost:8080/noviPotrosniMaterijal`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idOdjela: payload.idOdjel,
            naziv: payload.naziv,
            brand: payload.brand,
            namjena: payload.namjena,
            kolicina: payload.kolicina,
            minimalnaDozvoljenaKolicina: payload.minimalnaDozvoljenaKolicina,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create consumable");
      }
      const responseData = await response.json();

      if (selectedDepartment) {
        setConsumables((prev) => ({
          ...prev,
          [selectedDepartment.idOdjel]: [
            ...prev[selectedDepartment.idOdjel],
            responseData,
          ],
        }));
      }

      alert("Consumable added successfully!");
    } catch (error) {
      console.error("Error creating consumable:", error);
      alert("Failed to add consumable. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <SidebarProvider>
      <DepartmentSidebar
        departments={departments}
        onSelectDepartment={handleSelectDepartment}
        selectedDepartmentId={selectedDepartment?.idOdjel}
        onCreateDepartment={handleCreateDepartment}
        users={users}
      />
      <SidebarInset>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">
            Hospital Department Management
          </h1>
          {selectedDepartment ? (
            <DepartmentForm
              department={selectedDepartment}
              users={users}
              onSubmit={handleUpdateDepartment}
              consumables={consumables[selectedDepartment.idOdjel] || []}
              onUpdateConsumable={handleUpdateConsumable}
              onDeleteConsumable={handleDeleteConsumable}
              onCreateConsumable={handleCreateConsumable}
            />
          ) : (
            <div className="flex items-center justify-center h-64 bg-muted/20 rounded-lg">
              <p className="text-muted-foreground">
                Select a department from the sidebar to edit its details
              </p>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
