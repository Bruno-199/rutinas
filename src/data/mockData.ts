import { Routine } from '../types';

export const mockRoutines: Routine[] = [
  {
    id: '1',
    name: 'Full Body Workout',
    description: 'Complete full body workout for strength and conditioning',
    exercises: [
      {
        id: '101',
        name: 'Squats',
        sets: 3,
        reps: 12,
        weight: 60,
        notes: 'Focus on form and depth'
      },
      {
        id: '102',
        name: 'Bench Press',
        sets: 4,
        reps: 8,
        weight: 70,
        notes: 'Keep elbows tucked'
      },
      {
        id: '103',
        name: 'Deadlifts',
        sets: 3,
        reps: 10,
        weight: 100,
        notes: 'Maintain neutral spine'
      },
      {
        id: '104',
        name: 'Pull-ups',
        sets: 3,
        reps: 8,
        notes: 'Use assistance if needed'
      }
    ],
    createdAt: '2023-05-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Upper Body Focus',
    description: 'Targeting chest, back, shoulders and arms',
    exercises: [
      {
        id: '201',
        name: 'Dumbbell Press',
        sets: 3,
        reps: 12,
        weight: 20,
        notes: 'Full range of motion'
      },
      {
        id: '202',
        name: 'Bent Over Rows',
        sets: 3,
        reps: 10,
        weight: 50,
        notes: 'Squeeze shoulder blades'
      },
      {
        id: '203',
        name: 'Shoulder Press',
        sets: 3,
        reps: 10,
        weight: 15,
        notes: 'Don\'t lock elbows'
      },
      {
        id: '204',
        name: 'Bicep Curls',
        sets: 3,
        reps: 12,
        weight: 15,
        notes: 'Control the movement'
      }
    ],
    createdAt: '2023-05-18T14:30:00Z'
  },
  {
    id: '3',
    name: 'Lower Body Day',
    description: 'Focus on legs and core strength',
    exercises: [
      {
        id: '301',
        name: 'Leg Press',
        sets: 4,
        reps: 12,
        weight: 120,
        notes: 'Don\'t lock knees'
      },
      {
        id: '302',
        name: 'Romanian Deadlifts',
        sets: 3,
        reps: 10,
        weight: 60,
        notes: 'Feel the hamstrings stretch'
      },
      {
        id: '303',
        name: 'Calf Raises',
        sets: 4,
        reps: 15,
        weight: 40,
        notes: 'Full extension'
      },
      {
        id: '304',
        name: 'Planks',
        sets: 3,
        duration: 60,
        notes: 'Hold for 60 seconds'
      }
    ],
    createdAt: '2023-05-20T09:15:00Z'
  }
];