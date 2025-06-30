import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Player from "@/models/Player";
import { ensureDefaultSettings } from "@/services/profileMatchingSettings";
import { gapToWeight, certToNumber, IDEAL } from "@/lib/profileMatchingUtils";

connectDB();

export async function GET(_req: NextRequest) {
    try {
        const settings = await ensureDefaultSettings();
        const { coreFactors, secondaryFactors, weightCore, weightSecondary } = settings;

        const players = await Player.find().lean();

        const scored = players
            .map((p) => {
                // kumpulkan nilai aktual & ideal
                const rawValues = {
                    winRate: p.winRate,
                    kda: p.kda,
                    rank: p.rank,
                    tournamentCertificate: certToNumber(p.tournamentCertificate),
                    tournamentExperienceCount: p.tournamentExperienceCount ?? 0,
                };
                const idealValues = IDEAL;

                // hitung bobot array; jika empty, default ke 0
                const coreWeights = coreFactors.map((f) =>
                    gapToWeight(rawValues[f] - idealValues[f])
                );
                const secWeights = secondaryFactors.map((f) =>
                    gapToWeight(rawValues[f] - idealValues[f])
                );

                const coreAvg =
                    coreWeights.length > 0
                        ? coreWeights.reduce((s, x) => s + x, 0) / coreWeights.length
                        : 0;
                const secAvg =
                    secWeights.length > 0
                        ? secWeights.reduce((s, x) => s + x, 0) / secWeights.length
                        : 0;

                // Jika kedua kelompok kosong, totalScore=0
                const totalScore =
                    coreFactors.length || secondaryFactors.length
                        ? coreAvg * weightCore + secAvg * weightSecondary
                        : 0;

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
            .sort((a, b) => b.scores.total - a.scores.total);

        return NextResponse.json({ success: true, data: scored });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: "Failed to compute ranking", error },
            { status: 500 }
        );
    }
}
