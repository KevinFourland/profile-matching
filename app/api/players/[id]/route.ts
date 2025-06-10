import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Player from "@/models/Player";

connectDB();

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const player = await Player.findById(id);

        if (!player) {
            return NextResponse.json(
                { success: false, message: "Player not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: player });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to fetch player", error },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const {
            fullName,
            position,
            winRate,
            rank,
            kda,
            tournamentCertificate,
            tournamentExperienceCount,
        } = await req.json();

        const updated = await Player.findByIdAndUpdate(
            id,
            {
                fullName,
                position,
                winRate,
                rank,
                kda,
                tournamentCertificate,
                tournamentExperienceCount,
            },
            { new: true, runValidators: true }
        );

        if (!updated) {
            return NextResponse.json(
                { success: false, message: "Player not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: updated,
            message: "Player updated successfully",
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to update player", error },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const deleted = await Player.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json(
                { success: false, message: "Player not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Player deleted successfully",
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to delete player", error },
            { status: 500 }
        );
    }
}
