import ProfileMatchingSettings, {
    ProfileMatchingSettingsDoc,
} from "@/models/ProfileMatchingSettings";

const DEFAULT = {
    coreFactors: ["winRate", "kda", "rank"] as const,
    secondaryFactors: [
        "tournamentCertificate",
        "tournamentExperienceCount",
    ] as const,
    weightCore: 0.6,
    weightSecondary: 0.4,
};

export async function ensureDefaultSettings(): Promise<ProfileMatchingSettingsDoc> {
    let settings = await ProfileMatchingSettings.findOne();
    if (!settings) {
        settings = await ProfileMatchingSettings.create({
            ...DEFAULT,
            updatedAt: new Date(),
        });
    }
    return settings;
}
