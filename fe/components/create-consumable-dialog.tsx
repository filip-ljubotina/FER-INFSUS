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
import type { Consumable } from "./consumables-table";

interface CreateConsumableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departmentId: string;
  onSubmit: (consumable: Consumable) => void;
}

export function CreateConsumableDialog({
  open,
  onOpenChange,
  departmentId,
  onSubmit,
}: CreateConsumableDialogProps) {
  const [formData, setFormData] = useState<Consumable>({
    idMaterijal: "",
    idOdjel: departmentId,
    naziv: "",
    brand: "",
    namjena: "",
    kolicina: 0,
    minimalnaDozvoljenaKolicina: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "kolicina" || name === "minimalnaDozvoljenaKolicina"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);

    setFormData({
      idMaterijal: "",
      idOdjel: departmentId,
      naziv: "",
      brand: "",
      namjena: "",
      kolicina: 0,
      minimalnaDozvoljenaKolicina: 0,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Consumable</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="naziv">Name</Label>
            <Input
              id="naziv"
              name="naziv"
              value={formData.naziv}
              onChange={handleChange}
              placeholder="Enter consumable name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand">Brand</Label>
            <Input
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="Enter brand name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="namjena">Purpose</Label>
            <Input
              id="namjena"
              name="namjena"
              value={formData.namjena}
              onChange={handleChange}
              placeholder="Enter purpose"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="kolicina">Quantity</Label>
              <Input
                id="kolicina"
                name="kolicina"
                type="number"
                min="0"
                value={formData.kolicina}
                onChange={handleChange}
                placeholder="Enter quantity"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minimalnaDozvoljenaKolicina">
                Minimum Quantity
              </Label>
              <Input
                id="minimalnaDozvoljenaKolicina"
                name="minimalnaDozvoljenaKolicina"
                type="number"
                min="0"
                value={formData.minimalnaDozvoljenaKolicina}
                onChange={handleChange}
                placeholder="Enter minimum quantity"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Add Consumable
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
