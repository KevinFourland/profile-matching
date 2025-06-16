"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface RankedPlayer {
  _id: string;
  fullName: string;
  position: string;
  scores: {
    core: number;
    secondary: number;
    total: number;
  };
}

export default function RankingPage() {
  const [rankings, setRankings] = useState<RankedPlayer[]>([]);
  const [filtered, setFiltered] = useState<RankedPlayer[]>([]);
  const [positionFilter, setPositionFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"total" | "core" | "secondary">("total");

  const fetchRankings = useCallback(async () => {
    try {
      const res = await fetch("/api/ranking");
      const { data } = await res.json();
      const players: RankedPlayer[] = Array.isArray(data) ? data : [];
      setRankings(players);
    } catch (err) {
      console.error("Failed to fetch rankings:", err);
      setRankings([]);
    }
  }, []);

  useEffect(() => {
    fetchRankings();
  }, [fetchRankings]);

  // Apply filter & sort when rankings, filter, or sort changes
  useEffect(() => {
    let result = [...rankings];

    // Filter by position
    if (positionFilter !== "all") {
      result = result.filter((p) => p.position === positionFilter);
    }

    // Sort by selected score
    result.sort((a, b) => b.scores[sortBy] - a.scores[sortBy]);

    setFiltered(result);
  }, [rankings, positionFilter, sortBy]);

  // Ambil daftar posisi unik
  const positions = Array.from(new Set(rankings.map((p) => p.position)));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Player Rankings</h1>
        {/* Bisa tambahkan tombol download/report jika dibutuhkan */}
      </div>

      {/* Filter Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Filter by Position */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">
            Filter by Position
          </label>
          <Select value={positionFilter} onValueChange={setPositionFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Positions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {positions.map((pos) => (
                <SelectItem key={pos} value={pos}>
                  {pos}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort by Score */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">
            Sort by Score
          </label>
          <Select value={sortBy} onValueChange={(val) => setSortBy(val as any)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="total">Total Score</SelectItem>
              <SelectItem value="core">Core Score</SelectItem>
              <SelectItem value="secondary">Secondary Score</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>


      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Core Score</TableHead>
            <TableHead>Secondary Score</TableHead>
            <TableHead>Total Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((p, i) => (
            <TableRow key={p._id}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{p.fullName}</TableCell>
              <TableCell>{p.position}</TableCell>
              <TableCell>{p.scores.core.toFixed(2)}</TableCell>
              <TableCell>{p.scores.secondary.toFixed(2)}</TableCell>
              <TableCell className="font-bold">{p.scores.total.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
