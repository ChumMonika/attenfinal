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

// GET handler to retrieve all schedules
export async function GET() {
  try {
    return NextResponse.json({ schedules });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// POST handler to create a new schedule
export async function POST(request) {
  try {
    const body = await request.json();
    const { courseId, teacherId, day, startTime, endTime } = body;

    if (!courseId || !teacherId || !day || !startTime || !endTime) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const newSchedule = {
      id: `${Date.now()}`,
      courseId,
      teacherId,
      day,
      startTime,
      endTime,
    };

    schedules.push(newSchedule);

    return NextResponse.json({ message: 'Schedule created successfully', schedule: newSchedule }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
