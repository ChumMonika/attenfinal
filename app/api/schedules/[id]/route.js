import { NextResponse } from 'next/server';

// In-memory data store for schedules
let schedules = [
  {
    id: '1',
    courseId: '101',
    teacherId: '3',
    day: 'Monday',
    startTime: '09:00',
    endTime: '11:00',
  },
  {
    id: '2',
    courseId: '102',
    teacherId: '4',
    day: 'Wednesday',
    startTime: '13:00',
    endTime: '15:00',
  },
];

// PUT handler to update a schedule by ID
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { courseId, teacherId, day, startTime, endTime } = body;

    const scheduleIndex = schedules.findIndex((s) => s.id === id);

    if (scheduleIndex === -1) {
      return NextResponse.json({ message: 'Schedule not found' }, { status: 404 });
    }

    schedules[scheduleIndex] = { ...schedules[scheduleIndex], courseId, teacherId, day, startTime, endTime };

    return NextResponse.json({ message: 'Schedule updated successfully', schedule: schedules[scheduleIndex] });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE handler to remove a schedule by ID
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const scheduleIndex = schedules.findIndex((s) => s.id === id);

    if (scheduleIndex === -1) {
      return NextResponse.json({ message: 'Schedule not found' }, { status: 404 });
    }

    schedules.splice(scheduleIndex, 1);

    return NextResponse.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
