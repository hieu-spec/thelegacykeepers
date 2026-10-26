import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { HistoricalLocation } from '@/types/location';
import { MOCK_LOCATIONS } from '@/data/locations';

const LOCATIONS_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'locations.ts');

// Helper to write updated array back to src/data/locations.ts
async function writeLocationsToFile(locations: HistoricalLocation[]) {
  const fileContent = `import { HistoricalLocation } from '@/types/location';

export const MOCK_LOCATIONS: HistoricalLocation[] = ${JSON.stringify(locations, null, 2)};
`;

  await fs.promises.writeFile(LOCATIONS_FILE_PATH, fileContent, 'utf-8');
}

// GET /api/locations - Fetch all locations
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      locations: MOCK_LOCATIONS,
      count: MOCK_LOCATIONS.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Không thể tải danh sách địa danh' },
      { status: 500 }
    );
  }
}

// POST /api/locations - Create or Update a Location
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, location, locations: batchLocations, id } = body;

    // Handle Batch Save (Full Array Replacement)
    if (action === 'batch' && Array.isArray(batchLocations)) {
      await writeLocationsToFile(batchLocations);
      return NextResponse.json({
        success: true,
        message: `Đã lưu thành công ${batchLocations.length} địa danh vào hệ thống!`,
        locations: batchLocations,
      });
    }

    // Handle Single Location Add or Edit
    if (!location || !location.id || !location.name) {
      return NextResponse.json(
        { success: false, error: 'Thiếu thông tin bắt buộc (ID, Tên địa danh)' },
        { status: 400 }
      );
    }

    // Clone current locations
    let currentList: HistoricalLocation[] = [...MOCK_LOCATIONS];

    // Check if ID already exists
    const existingIndex = currentList.findIndex((loc) => loc.id === location.id);

    if (existingIndex >= 0) {
      // Update existing
      currentList[existingIndex] = {
        ...currentList[existingIndex],
        ...location,
      };
    } else {
      // Add new to beginning of list
      currentList = [location, ...currentList];
    }

    // Write directly to src/data/locations.ts
    await writeLocationsToFile(currentList);

    return NextResponse.json({
      success: true,
      message: existingIndex >= 0
        ? `Đã cập nhật thành công địa danh "${location.name}"!`
        : `Đã thêm mới thành công địa danh "${location.name}"!`,
      location,
      locations: currentList,
    });
  } catch (error: any) {
    console.error('Lỗi khi ghi file locations.ts:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Lỗi hệ thống khi lưu địa danh' },
      { status: 500 }
    );
  }
}

// DELETE /api/locations?id=xxx - Remove a Location
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Thiếu ID địa danh cần xóa' },
        { status: 400 }
      );
    }

    const currentList = MOCK_LOCATIONS.filter((loc) => loc.id !== id);

    if (currentList.length === MOCK_LOCATIONS.length) {
      return NextResponse.json(
        { success: false, error: `Không tìm thấy địa danh với ID: ${id}` },
        { status: 404 }
      );
    }

    await writeLocationsToFile(currentList);

    return NextResponse.json({
      success: true,
      message: `Đã xóa thành công địa danh ${id} khỏi cơ sở dữ liệu!`,
      locations: currentList,
    });
  } catch (error: any) {
    console.error('Lỗi khi xóa địa danh:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Lỗi hệ thống khi xóa địa danh' },
      { status: 500 }
    );
  }
}
