/**
 * IITian Tattva | Database-Ready Sample PYQ Papers Dataset
 * Curriculum: IIT Madras BS in Data Science & Applications
 * Note: These are sample/demo papers to simulate authentic semester examination conditions.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.IITianPapers = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  return [
    {
      id: "pyq-math1-2025-endterm",
      title: "Mathematics for Data Science I",
      subjectId: "subj-math1",
      subject: "Mathematics for Data Science I",
      year: 2025,
      semester: 1,
      level: "Foundation",
      examType: "End-Term",
      durationMinutes: 45,
      questionCount: 10,
      isDemo: true,
      badge: "DEMO PAPER",
      syllabusScope: "Weeks 1–12 (Calculus, derivatives, matrices, determinants)",
      questionIds: [
        "q-m1-001", "q-m1-002", "q-m1-003", "q-m1-004", "q-m1-005",
        "q-m1-006", "q-m1-007", "q-m1-008", "q-m1-009", "q-m1-010"
      ]
    },
    {
      id: "pyq-python-2025-endterm",
      title: "Programming in Python",
      subjectId: "subj-python",
      subject: "Programming in Python",
      year: 2025,
      semester: 1,
      level: "Foundation",
      examType: "End-Term",
      durationMinutes: 45,
      questionCount: 12,
      isDemo: true,
      badge: "DEMO PAPER",
      syllabusScope: "Weeks 1–12 (Data structures, OOP, functional tools, files)",
      questionIds: [
        "q-py-001", "q-py-002", "q-py-003", "q-py-004", "q-py-005",
        "q-py-006", "q-py-007", "q-py-008", "q-py-009", "q-py-010",
        "q-py-011", "q-py-014"
      ]
    },
    {
      id: "pyq-ct-2025-quiz",
      title: "Computational Thinking",
      subjectId: "subj-ct",
      subject: "Computational Thinking",
      year: 2025,
      semester: 1,
      level: "Foundation",
      examType: "Quiz",
      durationMinutes: 35,
      questionCount: 10,
      isDemo: true,
      badge: "DEMO PAPER",
      syllabusScope: "Weeks 1–4 (Algorithmic logic, flowcharts, recursion, sorting)",
      questionIds: [
        "q-ct-001", "q-ct-002", "q-ct-003", "q-ct-004", "q-ct-005",
        "q-ct-006", "q-ct-007", "q-ct-008", "q-ct-009", "q-ct-010"
      ]
    },
    {
      id: "pyq-stats1-2025-endterm",
      title: "Statistics for Data Science I",
      subjectId: "subj-stats1",
      subject: "Statistics for Data Science I",
      year: 2025,
      semester: 1,
      level: "Foundation",
      examType: "End-Term",
      durationMinutes: 40,
      questionCount: 10,
      isDemo: true,
      badge: "DEMO PAPER",
      syllabusScope: "Weeks 1–12 (Descriptive stats, probability, distributions)",
      questionIds: [
        "q-s1-001", "q-s1-002", "q-s1-003", "q-s1-004", "q-s1-005",
        "q-s1-006", "q-s1-007", "q-s1-008", "q-s1-009", "q-s1-010"
      ]
    },
    {
      id: "pyq-eng1-2024-quiz",
      title: "English I",
      subjectId: "subj-english1",
      subject: "English I",
      year: 2024,
      semester: 1,
      level: "Foundation",
      examType: "Quiz",
      durationMinutes: 25,
      questionCount: 8,
      isDemo: true,
      badge: "DEMO PAPER",
      syllabusScope: "Grammar foundations, punctuation, vocabulary, voice",
      questionIds: [
        "q-eng-001", "q-eng-002", "q-eng-003", "q-eng-004",
        "q-eng-005", "q-eng-006", "q-eng-007", "q-eng-008"
      ]
    },
    {
      id: "pyq-math2-2024-endterm",
      title: "Mathematics for Data Science II",
      subjectId: "subj-math2",
      subject: "Mathematics for Data Science II",
      year: 2024,
      semester: 2,
      level: "Foundation",
      examType: "End-Term",
      durationMinutes: 40,
      questionCount: 8,
      isDemo: true,
      badge: "DEMO PAPER",
      syllabusScope: "Multivariable calculus, gradients, eigenvalues, Hessian",
      questionIds: [
        "q-m2-001", "q-m2-002", "q-m2-003", "q-m2-004",
        "q-m2-005", "q-m2-006", "q-m2-007", "q-m2-008"
      ]
    },
    {
      id: "pyq-stats2-2024-endterm",
      title: "Statistics for Data Science II",
      subjectId: "subj-stats2",
      subject: "Statistics for Data Science II",
      year: 2024,
      semester: 2,
      level: "Foundation",
      examType: "End-Term",
      durationMinutes: 40,
      questionCount: 8,
      isDemo: true,
      badge: "DEMO PAPER",
      syllabusScope: "Normal distribution, hypothesis testing, p-values, covariance",
      questionIds: [
        "q-s2-001", "q-s2-002", "q-s2-003", "q-s2-004",
        "q-s2-005", "q-s2-006", "q-s2-007", "q-s2-008"
      ]
    },
    {
      id: "pyq-pyintro-2025-endterm",
      title: "Introduction to Python",
      subjectId: "subj-python",
      subject: "Programming in Python",
      year: 2025,
      semester: 1,
      level: "Foundation",
      examType: "End-Term",
      durationMinutes: 45,
      questionCount: 10,
      isDemo: true,
      badge: "DEMO PAPER",
      syllabusScope: "Core syntax, indexing, looping, lists & dictionary mechanics",
      questionIds: [
        "q-py-001", "q-py-002", "q-py-003", "q-py-004", "q-py-005",
        "q-py-006", "q-py-008", "q-py-011", "q-py-012", "q-py-013"
      ]
    }
  ];
});
