export function gapToWeight(gap: number): number {
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
export const IDEAL = {
    winRate: 80,
    kda: 5.5,
    rank: 500,
    tournamentExperienceCount: 20,
    tournamentCertificate: 3, // 3 = nasional 
} as const;

export const WEIGHTS = {
    core: 0.6,
    secondary: 0.4,
} as const;

// 3. Mapping certificate ke angka
export function certToNumber(cert?: string): number {
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
