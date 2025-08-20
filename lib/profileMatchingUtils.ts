export function gapToWeight(gap: number): number {
    const absGap = Math.abs(gap);
    const maxGap = 5;     // GAP maksimal yang dianggap masih bernilai
    const maxWeight = 5.0; // Bobot maksimal
    const minWeight = 0.0; // Bobot minimal

    // Jika gap lebih dari batas maksimal, kembalikan bobot minimum
    if (absGap >= maxGap) return minWeight;

    // Hitung bobot secara linear
    const weight = maxWeight - (absGap / maxGap) * maxWeight;
    return Number(weight.toFixed(2));
}

// Win Rate
export function mapWinRateToScore(winRate: number): number {
    if (winRate >= 85) return 5;
    if (winRate >= 80) return 4;
    if (winRate >= 75) return 3;
    if (winRate >= 70) return 2;
    if (winRate >= 65) return 1;
    return 0;
}

// Rank
export function mapRankToScore(rank: number): number {
    if (rank >= 500) return 5;
    if (rank >= 400) return 4;
    if (rank >= 300) return 3;
    if (rank >= 200) return 2;
    if (rank >= 100) return 1;
    return 0;
}

// KDA
export function mapKdaToScore(kda: number): number {
    if (kda >= 5.5) return 5;
    if (kda >= 5.0) return 4;
    if (kda >= 4.6) return 3;
    if (kda >= 4.1) return 2;
    if (kda >= 3.6) return 1;
    return 0;
}

// Experience Count
export function mapExperienceToScore(count: number): number {
    if (count >= 20) return 5;
    if (count >= 15) return 4;
    if (count >= 10) return 3;
    if (count >= 5) return 2;
    if (count >= 1) return 1;
    return 0;
}

// Certificate
export function certToNumber(cert?: string): number {
    if (!cert) return 0;
    switch (cert.toLowerCase()) {
        case "nasional":
            return 5;
        case "provinsi":
            return 4;
        case "kota":
            return 3;
        default:
            return 0;
    }
}

export const IDEAL = {
    winRate: 5,
    kda: 5,
    rank: 5,
    tournamentExperienceCount: 5,
    tournamentCertificate: 5,
} as const;

export const WEIGHTS = {
    core: 0.6,
    secondary: 0.4,
} as const;
