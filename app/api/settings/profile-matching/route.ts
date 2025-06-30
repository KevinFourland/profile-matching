import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ProfileMatchingSettings from "@/models/ProfileMatchingSettings";
import { ensureDefaultSettings } from "@/services/profileMatchingSettings";

connectDB();

export async function GET(_req: NextRequest) {
    try {
        const settings = await ensureDefaultSettings();
        return NextResponse.json({ success: true, data: settings });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { success: false, message: "Failed to fetch settings" },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { coreFactors, secondaryFactors, weightCore, weightSecondary } = body;

        // Validasi dasar
        if (
            !Array.isArray(coreFactors) ||
            !Array.isArray(secondaryFactors) ||
            coreFactors.some((f) => secondaryFactors.includes(f)) ||
            Math.abs((weightCore ?? 0) + (weightSecondary ?? 0) - 1) > 1e-6
        ) {
            return NextResponse.json(
                { success: false, message: "Invalid payload" },
                { status: 400 }
            );
        }

        const settings = await ensureDefaultSettings();
        settings.coreFactors = coreFactors;
        settings.secondaryFactors = secondaryFactors;
        if (weightCore !== undefined) settings.weightCore = weightCore;
        if (weightSecondary !== undefined) settings.weightSecondary = weightSecondary;
        settings.updatedAt = new Date();
        await settings.save();

        return NextResponse.json({ success: true, data: settings });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { success: false, message: "Failed to update settings" },
            { status: 500 }
        );
    }
}
