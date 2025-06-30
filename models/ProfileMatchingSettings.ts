import mongoose, { Schema, Document, model } from "mongoose";

export type FactorKey =
    | "winRate"
    | "kda"
    | "rank"
    | "tournamentCertificate"
    | "tournamentExperienceCount";

export interface ProfileMatchingSettingsDoc extends Document {
    coreFactors: FactorKey[];
    secondaryFactors: FactorKey[];
    weightCore: number;
    weightSecondary: number;
    updatedAt: Date;
}

const SettingsSchema = new Schema<ProfileMatchingSettingsDoc>({
    coreFactors: {
        type: [String],
        enum: [
            "winRate",
            "kda",
            "rank",
            "tournamentCertificate",
            "tournamentExperienceCount",
        ],
        required: true,
    },
    secondaryFactors: {
        type: [String],
        enum: [
            "winRate",
            "kda",
            "rank",
            "tournamentCertificate",
            "tournamentExperienceCount",
        ],
        required: true,
    },
    weightCore: {
        type: Number,
        default: 0.6,
    },
    weightSecondary: {
        type: Number,
        default: 0.4,
    },
    updatedAt: {
        type: Date,
        default: () => new Date(),
    },
});

// Jika model sudah ada, pakai yang lama
export default mongoose.models.ProfileMatchingSettings ||
    model<ProfileMatchingSettingsDoc>(
        "ProfileMatchingSettings",
        SettingsSchema
    );
