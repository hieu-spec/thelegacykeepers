// src/app/api/locations/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { MOCK_LOCATIONS, HistoricalLocation } from "@/data/mockLocations";
import { verifyAdminRequest } from "@/lib/auth";

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "locations.db.json");

async function readLocationsDB(): Promise<HistoricalLocation[]> {
  try {
    const raw = await fs.readFile(DB_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {
    // Khởi tạo file lần đầu từ MOCK_LOCATIONS
    try {
      await fs.mkdir(DB_DIR, { recursive: true });
      await fs.writeFile(DB_FILE, JSON.stringify(MOCK_LOCATIONS, null, 2), "utf-8");
    } catch {}
  }
  return MOCK_LOCATIONS;
}

async function writeLocationsDB(locations: HistoricalLocation[]): Promise<void> {
  await fs.mkdir(DB_DIR, { recursive: true });
  await fs.writeFile(DB_FILE, JSON.stringify(locations, null, 2), "utf-8");
}

export async function GET() {
  const locations = await readLocationsDB();
  return NextResponse.json({
    success: true,
    locations,
    data: locations,
    total: locations.length,
    count: locations.length,
  });
}

export async function POST(req: NextRequest) {
  const isAdmin = await verifyAdminRequest(req);
  if (!isAdmin) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Yêu cầu quyền Quản trị viên" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const locations = await readLocationsDB();

    // Hỗ trợ đồng bộ hàng loạt (Batch save)
    if (body.action === "batch" && Array.isArray(body.locations)) {
      await writeLocationsDB(body.locations);
      return NextResponse.json({
        success: true,
        message: `Đã lưu thành công ${body.locations.length} địa danh vào ổ đĩa!`,
        locations: body.locations,
        data: body.locations,
        synced: true,
      });
    }

    if (Array.isArray(body.locations)) {
      await writeLocationsDB(body.locations);
      return NextResponse.json({
        success: true,
        locations: body.locations,
        data: body.locations,
        synced: true,
      });
    }

    // Nhận diện dữ liệu đơn lẻ (tương thích cả payload dạng { location: ... } và truyền trực tiếp)
    const targetLocation: HistoricalLocation = body.location || (body.id ? body : null);

    if (!targetLocation || !targetLocation.id || !targetLocation.name) {
      return NextResponse.json(
        { success: false, error: "Dữ liệu di tích không hợp lệ (thiếu ID hoặc Tên di tích)" },
        { status: 400 }
      );
    }

    const existingIndex = locations.findIndex((l) => l.id === targetLocation.id);
    let updated: HistoricalLocation[];
    if (existingIndex >= 0) {
      updated = [...locations];
      updated[existingIndex] = { ...updated[existingIndex], ...targetLocation };
    } else {
      updated = [targetLocation, ...locations];
    }

    await writeLocationsDB(updated);

    return NextResponse.json({
      success: true,
      message: existingIndex >= 0
        ? `Đã cập nhật thành công địa danh "${targetLocation.name}"!`
        : `Đã thêm mới thành công địa danh "${targetLocation.name}"!`,
      location: targetLocation,
      data: targetLocation,
      locations: updated,
    });
  } catch (error: any) {
    console.error("Lỗi khi lưu địa danh:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Lỗi hệ thống khi lưu địa danh" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const isAdmin = await verifyAdminRequest(req);
  if (!isAdmin) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Yêu cầu quyền Quản trị viên" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });
    }

    const locations = await readLocationsDB();
    const filtered = locations.filter((l) => l.id !== id);
    await writeLocationsDB(filtered);

    return NextResponse.json({
      success: true,
      message: `Đã xóa địa danh có ID "${id}" thành công!`,
      deleted: id,
      locations: filtered,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Lỗi khi xóa địa danh" },
      { status: 500 }
    );
  }
}
