"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

export default function DashboardPage() {
  const [rankings, setRankings] = useState<RankedPlayer[]>([]);

  const fetchRankings = useCallback(async () => {
    try {
      const res = await fetch("/api/ranking");
      const { data } = await res.json();
      setRankings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch rankings:", err);
      setRankings([]);
    }
  }, []);

  useEffect(() => {
    fetchRankings();
  }, [fetchRankings]);

  const totalPlayers = rankings.length;

  const avgCoreScore =
    totalPlayers > 0
      ? rankings.reduce((sum, p) => sum + p.scores.core, 0) / totalPlayers
      : 0;

  const avgSecondaryScore =
    totalPlayers > 0
      ? rankings.reduce((sum, p) => sum + p.scores.secondary, 0) / totalPlayers
      : 0;

  const topPlayer = rankings[0];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Ringkasan Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Pemain</p>
            <p className="text-2xl font-bold">{totalPlayers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Rata-rata Core Score</p>
            <p className="text-2xl font-bold">{avgCoreScore.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Rata-rata Secondary</p>
            <p className="text-2xl font-bold">{avgSecondaryScore.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Top Player</p>
            <p className="text-lg font-bold">{topPlayer?.fullName ?? "-"}</p>
            <p className="text-xs text-muted-foreground">
              Skor: {topPlayer?.scores.total.toFixed(2) ?? "-"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top 5 Pemain */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold">Top 5 Pemain</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Posisi</TableHead>
              <TableHead>Skor Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rankings.slice(0, 5).map((p, i) => (
              <TableRow key={p._id}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{p.fullName}</TableCell>
                <TableCell>{p.position}</TableCell>
                <TableCell className="font-medium">{p.scores.total.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
