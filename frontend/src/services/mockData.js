// ============================================================================
// MOCK DATA SERVICE
// ============================================================================
export const mockData = {
  students: [
    {
      id: 's1',
      name: 'Alice Chen',
      email: 'alice.student@university.edu',
      overallScore: 87,
      evaluationsGiven: 12,
      evaluationsReceived: 15,
      feedbackQuality: 92,
      participationRate: 92,
      sentimentTrend: [
        { week: 'W1', score: 78 },
        { week: 'W2', score: 82 },
        { week: 'W3', score: 85 },
        { week: 'W4', score: 87 }
      ],
      pendingReviews: 3,
      aiSummary: 'Consistently provides constructive and detailed feedback.',
      feedbackSummary: {
        strengths: 'Exceptional leadership and communication skills',
        weaknesses: 'Could improve time management',
        themes: ['Collaborative', 'Creative', 'Detail-oriented']
      }
    },
    {
      id: 's2',
      name: 'Bob Martinez',
      email: 'bob.student@university.edu',
      overallScore: 76,
      evaluationsGiven: 8,
      evaluationsReceived: 10,
      feedbackQuality: 68,
      participationRate: 85,
      sentimentTrend: [
        { week: 'W1', score: 72 },
        { week: 'W2', score: 74 },
        { week: 'W3', score: 75 },
        { week: 'W4', score: 76 }
      ],
      pendingReviews: 5,
      aiSummary: 'Needs improvement in providing specific examples.',
      feedbackSummary: {
        strengths: 'Strong technical skills and problem-solving',
        weaknesses: 'Needs to be more vocal in team discussions',
        themes: ['Technical', 'Reliable', 'Independent']
      }
    },
    {
      id: 's3',
      name: 'Carol Zhang',
      email: 'carol.student@university.edu',
      overallScore: 94,
      evaluationsGiven: 18,
      evaluationsReceived: 16,
      feedbackQuality: 96,
      participationRate: 95,
      sentimentTrend: [
        { week: 'W1', score: 90 },
        { week: 'W2', score: 92 },
        { week: 'W3', score: 93 },
        { week: 'W4', score: 94 }
      ],
      pendingReviews: 1,
      aiSummary: 'Exceptional feedback quality with balanced tone.',
      feedbackSummary: {
        strengths: 'Outstanding analytical thinking and presentation skills',
        weaknesses: 'Could delegate more effectively',
        themes: ['Analytical', 'Organized', 'Proactive']
      }
    },
    {
      id: 's4',
      name: 'David Kim',
      email: 'david.student@university.edu',
      overallScore: 81,
      evaluationsGiven: 10,
      evaluationsReceived: 12,
      feedbackQuality: 79,
      participationRate: 80,
      isBiased: true,
      biasScore: 2.3,
      sentimentTrend: [
        { week: 'W1', score: 79 },
        { week: 'W2', score: 80 },
        { week: 'W3', score: 82 },
        { week: 'W4', score: 81 }
      ],
      pendingReviews: 4,
      aiSummary: 'Shows signs of grade inflation in peer reviews.',
      feedbackSummary: {
        strengths: 'Good team player and reliable contributor',
        weaknesses: 'Tends to inflate peer scores',
        themes: ['Supportive', 'Friendly', 'Generous']
      }
    },
    {
      id: 's5',
      name: 'Emma Wilson',
      email: 'emma.student@university.edu',
      overallScore: 89,
      evaluationsGiven: 14,
      evaluationsReceived: 14,
      feedbackQuality: 88,
      participationRate: 90,
      sentimentTrend: [
        { week: 'W1', score: 84 },
        { week: 'W2', score: 86 },
        { week: 'W3', score: 88 },
        { week: 'W4', score: 89 }
      ],
      pendingReviews: 2,
      aiSummary: 'Well-balanced evaluations with helpful suggestions.',
      feedbackSummary: {
        strengths: 'Excellent communication and balanced feedback',
        weaknesses: 'Could provide more technical depth',
        themes: ['Balanced', 'Thoughtful', 'Constructive']
      }
    }
  ],
  rubrics: [
    {
      id: 'r1',
      name: 'Team Collaboration',
      criteria: [
        { id: 'c1', name: 'Communication', weight: 30, maxScore: 5 },
        { id: 'c2', name: 'Contribution', weight: 40, maxScore: 5 },
        { id: 'c3', name: 'Reliability', weight: 30, maxScore: 5 }
      ]
    },
    {
      id: 'r2',
      name: 'Code Quality',
      criteria: [
        { id: 'c4', name: 'Clean Code', weight: 35, maxScore: 5 },
        { id: 'c5', name: 'Documentation', weight: 25, maxScore: 5 },
        { id: 'c6', name: 'Testing', weight: 40, maxScore: 5 }
      ]
    },
    {
      id: 'r3',
      name: 'Presentation Skills',
      criteria: [
        { id: 'c7', name: 'Clarity', weight: 40, maxScore: 5 },
        { id: 'c8', name: 'Engagement', weight: 30, maxScore: 5 },
        { id: 'c9', name: 'Content', weight: 30, maxScore: 5 }
      ]
    }
  ],
  activities: [
    {
      id: 'a1',
      name: 'Sprint 1 Evaluation',
      rubricId: 'r1',
      dueDate: '2025-01-15',
      status: 'active',
      participants: 25
    },
    {
      id: 'a2',
      name: 'Midterm Project Review',
      rubricId: 'r2',
      dueDate: '2025-01-20',
      status: 'active',
      participants: 28
    }
  ],
  classData: {
    name: 'CS401 - Software Engineering',
    totalStudents: 30,
    averageScore: 84.2,
    classAverage: 84.2,
    submissionRate: 88,
    biasFlags: 3,
    flaggedStudents: [
      { id: 's4', name: 'David Kim', reason: 'Score deviation > 2.5σ', severity: 'HIGH' }
    ]
  },
  users: [
    { id: 's1', name: 'Alice Chen', email: 'alice.student@university.edu', role: 'Student', status: 'Active' },
    { id: 's2', name: 'Bob Martinez', email: 'bob.student@university.edu', role: 'Student', status: 'Active' },
    { id: 's3', name: 'Carol Zhang', email: 'carol.student@university.edu', role: 'Student', status: 'Active' },
    { id: 's4', name: 'David Kim', email: 'david.student@university.edu', role: 'Student', status: 'Active' },
    { id: 's5', name: 'Emma Wilson', email: 'emma.student@university.edu', role: 'Student', status: 'Active' },
    { id: 't1', name: 'Prof. Smith', email: 'smith.teacher@university.edu', role: 'Teacher', status: 'Active' }
  ]
};

