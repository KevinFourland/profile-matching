"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AlertDialogDelete } from "@/components/alert-dialog-delete";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Player {
  _id?: string;
  fullName: string;
  position: string;
  winRate: number;
  rank: number;
  kda: number;
  tournamentCertificate?: string;
  tournamentExperienceCount?: number;
}

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [search, setSearch] = useState("");

  // Form & dialog states
  const [form, setForm] = useState<Player>({
    fullName: "",
    position: "",
    winRate: 0,
    rank: 0,
    kda: 0,
    tournamentCertificate: "",
    tournamentExperienceCount: 0,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Delete confirmation
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletedId, setDeletedId] = useState<string>("");

  const fetchPlayers = useCallback(async () => {
    try {
      const res = await fetch("/api/players");
      const { data } = await res.json();
      setPlayers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch players:", err);
      setPlayers([]);
    }
  }, []);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  // Search filter
  const filtered = players.filter((p) =>
    p.fullName.toLowerCase().includes(search.toLowerCase()) ||
    p.position.toLowerCase().includes(search.toLowerCase())
  );

  // Form handlers
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "winRate" ||
          name === "rank" ||
          name === "kda" ||
          name === "tournamentExperienceCount"
          ? Number(value)
          : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const method = isEditing && form._id ? "PUT" : "POST";
    const url =
      isEditing && form._id
        ? `/api/players/${form._id}`
        : "/api/players";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save player");

      toast.success(isEditing ? "Player updated!" : "Player added!");
      setIsDialogOpen(false);
      setIsEditing(false);
      setForm({
        fullName: "",
        position: "",
        winRate: 0,
        rank: 0,
        kda: 0,
        tournamentCertificate: "",
        tournamentExperienceCount: 0,
      });
      fetchPlayers();
    } catch (err) {
      console.error(err);
      toast.error("An error occurred!");
    }
  }

  // Delete handler
  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/players/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Player deleted!");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed!");
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletedId("");
      fetchPlayers();
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Players</h1>
        <Button
          variant="default"
          onClick={() => {
            setIsEditing(false);
            setForm({
              fullName: "",
              position: "",
              winRate: 0,
              rank: 0,
              kda: 0,
              tournamentCertificate: "",
              tournamentExperienceCount: 0,
            });
            setIsDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Player
        </Button>
      </div>

      {/* Search */}
      <Input
        placeholder="Search by name or position..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Win Rate</TableHead>
            <TableHead>Rank</TableHead>
            <TableHead>KDA</TableHead>
            <TableHead>Certificate</TableHead>
            <TableHead>Experience</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((p) => (
            <TableRow key={p._id}>
              <TableCell>{p.fullName}</TableCell>
              <TableCell>{p.position}</TableCell>
              <TableCell>{p.winRate.toFixed(1)}</TableCell>
              <TableCell>{p.rank}</TableCell>
              <TableCell>{p.kda.toFixed(1)}</TableCell>
              <TableCell>{p.tournamentCertificate || "-"}</TableCell>
              <TableCell>{p.tournamentExperienceCount ?? "-"}</TableCell>
              <TableCell className="flex justify-end space-x-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(true);
                    setForm(p);
                    setIsDialogOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => {
                    if (p._id) {
                      setDeletedId(p._id);
                      setIsDeleteDialogOpen(true);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Create / Update Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Player" : "Add Player"}
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <Label>Full Name</Label>
              <Input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-1">
              <Label>Position</Label>
              <Select
                value={form.position || ""}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, position: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Jungler">Jungler</SelectItem>
                  <SelectItem value="Roamer">Roamer</SelectItem>
                  <SelectItem value="Mid Lane">Mid Lane</SelectItem>
                  <SelectItem value="EXP Lane">EXP Lane</SelectItem>
                  <SelectItem value="Gold Lane">Gold Lane</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Win Rate (%)</Label>
              <Input
                name="winRate"
                type="number"
                step="0.1"
                value={form.winRate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-1">
              <Label>Rank</Label>
              <Input
                name="rank"
                type="number"
                value={form.rank}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-1">
              <Label>KDA</Label>
              <Input
                name="kda"
                type="number"
                step="0.1"
                value={form.kda}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-1">
              <Label>Tournament Certificate</Label>
              <Select
                value={form.tournamentCertificate || ""}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, tournamentCertificate: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select certificate level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nasional">Nasional</SelectItem>
                  <SelectItem value="Provinsi">Provinsi</SelectItem>
                  <SelectItem value="Kota">Kota</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Tournament Experience Count</Label>
              <Input
                name="tournamentExperienceCount"
                type="number"
                value={form.tournamentExperienceCount}
                onChange={handleChange}
              />
            </div>
            <Button type="submit" className="w-full">
              {isEditing ? "Update" : "Save"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialogDelete
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        onConfirm={() => handleDelete(deletedId)}
      />
    </div>
  );
}
