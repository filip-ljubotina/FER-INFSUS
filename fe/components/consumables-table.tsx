"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { EditConsumableDialog } from "./edit-consumable-dialog";
import { CreateConsumableDialog } from "./create-consumable-dialog";

export type Consumable = {
  idMaterijal: string;
  idOdjel?: string;
  naziv: string;
  brand: string;
  namjena: string;
  kolicina: number;
  minimalnaDozvoljenaKolicina: number;
};

interface ConsumablesTableProps {
  departmentId: string;
  consumables: Consumable[];
  onEditConsumable: (consumable: Consumable) => void;
  onDeleteConsumable: (consumableId: string) => void;
  onCreateConsumable: (consumable: Consumable) => void;
}

export function ConsumablesTable({
  departmentId,
  consumables,
  onEditConsumable,
  onDeleteConsumable,
  onCreateConsumable,
}: ConsumablesTableProps) {
  const [editingConsumable, setEditingConsumable] = useState<Consumable | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleEdit = (consumable: Consumable) => {
    setEditingConsumable(consumable);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (consumableId: string) => {
    if (confirm("Are you sure you want to delete this consumable?")) {
      onDeleteConsumable(consumableId);
    }
  };

  const handleEditSubmit = (updatedConsumable: Consumable) => {
    onEditConsumable(updatedConsumable);
    setIsEditDialogOpen(false);
    setEditingConsumable(null);
  };

  const handleCreateSubmit = (newConsumable: Consumable) => {
    onCreateConsumable(newConsumable);
    setIsCreateDialogOpen(false);
  };

  const filteredConsumables = consumables.filter((consumable) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    return (
      consumable.naziv.toLowerCase().includes(query) ||
      consumable.brand.toLowerCase().includes(query) ||
      consumable.namjena.toLowerCase().includes(query)
    );
  });

  return (
    <div className="mt-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h2 className="text-xl font-semibold">Department Consumables</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Input
              type="text"
              placeholder="Search consumables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Consumable
          </Button>
        </div>
      </div>

      {filteredConsumables.length === 0 ? (
        <div className="bg-muted/20 p-8 text-center rounded-md">
          <p className="text-muted-foreground">
            {searchQuery.trim()
              ? "No consumables found matching your search."
              : "No consumables found for this department."}
          </p>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Min. Quantity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredConsumables.map((consumable) => (
                <TableRow key={consumable.idMaterijal}>
                  <TableCell className="font-medium">
                    {consumable.idMaterijal}
                  </TableCell>
                  <TableCell>{consumable.naziv}</TableCell>
                  <TableCell>{consumable.brand}</TableCell>
                  <TableCell>{consumable.namjena}</TableCell>
                  <TableCell className="text-right">
                    <span
                      className={
                        consumable.kolicina <
                        consumable.minimalnaDozvoljenaKolicina
                          ? "text-red-500 font-bold"
                          : ""
                      }
                    >
                      {consumable.kolicina}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {consumable.minimalnaDozvoljenaKolicina}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(consumable)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-500"
                        onClick={() => handleDelete(consumable.idMaterijal)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {editingConsumable && (
        <EditConsumableDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          consumable={editingConsumable}
          onSubmit={handleEditSubmit}
        />
      )}

      <CreateConsumableDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        departmentId={departmentId}
        onSubmit={handleCreateSubmit}
      />
    </div>
  );
}
