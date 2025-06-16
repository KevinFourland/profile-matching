import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Player from "@/models/Player";

// Pastikan DB sudah terkoneksi
connectDB();

// 1. Helper: konversi gap ke bobot
function gapToWeight(gap: number): number {
    const absGap = Math.abs(gap);
    const maxGap = 10;     // GAP maksimal yang dianggap masih bernilai
    const maxWeight = 5.0; // Bobot maksimal
    const minWeight = 0.0; // Bobot minimal

    // Jika gap lebih dari batas maksimal, kembalikan bobot minimum
    if (absGap >= maxGap) return minWeight;

    // Hitung bobot secara linear
    const weight = maxWeight - (absGap / maxGap) * maxWeight;
    return Number(weight.toFixed(2)); // dibulatkan 2 desimal
}

// 2. Mapping nilai ideal & bobot
const IDEAL = {
    winRate: 80,
    kda: 5.5,
    rank: 500,
    tournamentExperienceCount: 20,
    tournamentCertificate: 3, // 3 = nasional 
} as const;

const WEIGHTS = {
    core: 0.6,
    secondary: 0.4,
} as const;

// 3. Mapping certificate ke angka
function certToNumber(cert?: string): number {
    if (!cert) return 0;
    switch (cert.toLowerCase()) {
        case "nasional":
            return 3;
        case "provinsi":
            return 2;
        case "kota":
            return 1;
        default:
            return 0;
    }
}

// 4. Handler GET /api/players/ranking
export async function GET(_req: NextRequest) {
    try {
        const players = await Player.find().lean(); 

        const scored = players
            .map((p) => {
                // Core Factor
                const w_winRate = gapToWeight(p.winRate - IDEAL.winRate);
                const w_kda = gapToWeight(p.kda - IDEAL.kda);
                const w_rank = gapToWeight(p.rank - IDEAL.rank);
                const coreAvg = (w_winRate + w_kda + w_rank) / 3;

                // Secondary Factor
                const certNum = certToNumber(p.tournamentCertificate);
                const w_cert = gapToWeight(certNum - IDEAL.tournamentCertificate);
                const expCount = p.tournamentExperienceCount ?? 0;
                const w_exp = gapToWeight(expCount - IDEAL.tournamentExperienceCount);
                const secAvg = (w_cert + w_exp) / 2;

                // Total Score
                const totalScore = coreAvg * WEIGHTS.core + secAvg * WEIGHTS.secondary;

                return {
                    _id: p._id,
                    fullName: p.fullName,
                    position: p.position,
                    scores: {
                        core: Number(coreAvg.toFixed(2)),
                        secondary: Number(secAvg.toFixed(2)),
                        total: Number(totalScore.toFixed(2)),
                    },
                };
            })
            // Urutkan dari tertinggi total score
            .sort((a, b) => b.scores.total - a.scores.total);

        return NextResponse.json({ success: true, data: scored });
    } catch (error) {
        console.error("Ranking Error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to compute ranking", error },
            { status: 500 }
        );
    }
}
