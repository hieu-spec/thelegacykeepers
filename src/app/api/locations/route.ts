// src/app/api/locations/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { MOCK_LOCATIONS } from '@/data/locations';
import { HistoricalLocation } from '@/types/location';
import { verifyAdminRequest } from '@/lib/auth';

// Bộ nhớ đệm trên Server (kết nối Supabase / PostgreSQL khi có DATABASE_URL)
let serverLocationsStore: HistoricalLocation[] = [...MOCK_LOCATIONS];

// GET /api/locations - Lấy danh sách địa danh
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      locations: serverLocationsStore,
      data: serverLocationsStore,
      count: serverLocationsStore.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Không thể tải danh sách địa danh' },
      { status: 500 }
    );
  }
}

// POST /api/locations - Thêm mới hoặc cập nhật địa danh
export async function POST(req: NextRequest) {
  // Kiểm tra quyền Admin trước khi cho phép thêm/sửa
  const isAdmin = await verifyAdminRequest(req);
  if (!isAdmin) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Yêu cầu quyền Quản trị viên' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { action, locations: batchLocations } = body;

    // Xử lý lưu hàng loạt (Batch save)
    if (action === 'batch' && Array.isArray(batchLocations)) {
      serverLocationsStore = batchLocations;
      return NextResponse.json({
        success: true,
        message: `Đã lưu thành công ${batchLocations.length} địa danh vào bộ nhớ máy chủ!`,
        locations: serverLocationsStore,
        data: serverLocationsStore,
      });
    }

    // Nhận diện dữ liệu đơn lẻ (tương thích cả payload dạng { location: ... } và truyền trực tiếp)
    const targetLocation: HistoricalLocation = body.location || (body.id ? body : null);

    if (!targetLocation || !targetLocation.id || !targetLocation.name) {
      return NextResponse.json(
        { success: false, error: 'Dữ liệu di tích không hợp lệ (thiếu ID hoặc Tên di tích)' },
        { status: 400 }
      );
    }

    const existingIndex = serverLocationsStore.findIndex((loc) => loc.id === targetLocation.id);
    if (existingIndex >= 0) {
      serverLocationsStore[existingIndex] = {
        ...serverLocationsStore[existingIndex],
        ...targetLocation,
      };
    } else {
      serverLocationsStore = [targetLocation, ...serverLocationsStore];
    }

    return NextResponse.json({
      success: true,
      message: existingIndex >= 0
        ? `Đã cập nhật thành công địa danh "${targetLocation.name}"!`
        : `Đã thêm mới thành công địa danh "${targetLocation.name}"!`,
      location: targetLocation,
      data: targetLocation,
      locations: serverLocationsStore,
    });
  } catch (error: any) {
    console.error('Lỗi khi lưu địa danh:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Lỗi hệ thống khi lưu địa danh' },
      { status: 500 }
    );
  }
}

// DELETE /api/locations?id=xxx - Xóa địa danh
export async function DELETE(req: NextRequest) {
  const isAdmin = await verifyAdminRequest(req);
  if (!isAdmin) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Yêu cầu quyền Quản trị viên' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Thiếu ID di tích cần xóa' },
        { status: 400 }
      );
    }

    const initialLength = serverLocationsStore.length;
    serverLocationsStore = serverLocationsStore.filter((loc) => loc.id !== id);

    if (serverLocationsStore.length === initialLength) {
      return NextResponse.json(
        { success: false, error: `Không tìm thấy địa danh với ID: ${id}` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Đã xóa thành công địa danh ${id} khỏi cơ sở dữ liệu!`,
      locations: serverLocationsStore,
      data: serverLocationsStore,
    });
  } catch (error: any) {
    console.error('Lỗi khi xóa địa danh:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Lỗi hệ thống khi xóa địa danh' },
      { status: 500 }
    );
  }
}
