import mongoose, { Schema, model } from "mongoose";

export interface PlayerDocument extends mongoose.Document {
    fullName: string;
    position: string;
    winRate: number;
    rank: number;
    kda: number;
    tournamentCertificate?: string;
    tournamentExperienceCount?: number;
    createdAt: Date;
    updatedAt: Date;
}

const PlayerSchema = new Schema<PlayerDocument>(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        position: {
            type: String,
            required: true,
            trim: true,
        },
        winRate: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
        rank: {
            type: Number,
            required: true,
            min: 0,
        },
        kda: {
            type: Number,
            required: true,
            min: 0,
        },
        tournamentCertificate: {
            type: String,
            trim: true,
        },
        tournamentExperienceCount: {
            type: Number,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Player =
    mongoose.models?.Player || model<PlayerDocument>("Player", PlayerSchema);

export default Player;
