import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Player from "@/models/Player";

connectDB();

export async function GET() {
  try {
    const players = await Player.find();
    return NextResponse.json({ success: true, data: players });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch players", error },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      fullName,
      position,
      winRate,
      rank,
      kda,
      tournamentCertificate,
      tournamentExperienceCount,
    } = await req.json();

    // Validasi field wajib
    if (
      !fullName ||
      !position ||
      winRate === undefined ||
      rank === undefined ||
      kda === undefined
    ) {
      return NextResponse.json(
        { success: false, message: "fullName, position, winRate, rank, and kda are required" },
        { status: 400 }
      );
    }

    const newPlayer = new Player({
      fullName,
      position,
      winRate,
      rank,
      kda,
      // kedua field berikut bersifat optional
      tournamentCertificate,
      tournamentExperienceCount,
    });

    await newPlayer.save();
    return NextResponse.json({
      success: true,
      data: newPlayer,
      message: "Player added successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to add player", error },
      { status: 500 }
    );
  }
}
