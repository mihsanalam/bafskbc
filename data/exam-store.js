/**
 * IITian Tattva | Centralized Exam Store & Query Engine
 * Provides clean database abstraction methods for PYQs and Custom Practice Tests.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    const subjects = require('./subjects');
    const papers = require('./papers');
    const questions = require('./questions');
    module.exports = factory(subjects, papers, questions);
  } else {
    root.IITianExamStore = factory(
      root.IITianSubjects || [],
      root.IITianPapers || [],
      root.IITianQuestions || []
    );
  }
})(typeof self !== 'undefined' ? self : this, function (subjects, papers, questions) {

  // Fallback in-memory stores if globals aren't yet populated
  let _subjects = subjects || [];
  let _papers = papers || [];
  let _questions = questions || [];

  function syncWithGlobals() {
    if (typeof window !== 'undefined') {
      if ((!_subjects || _subjects.length === 0) && window.IITianSubjects) _subjects = window.IITianSubjects;
      if ((!_papers || _papers.length === 0) && window.IITianPapers) _papers = window.IITianPapers;
      if ((!_questions || _questions.length === 0) && window.IITianQuestions) _questions = window.IITianQuestions;
    }
  }

  function setStoreData(s, p, q) {
    if (s) _subjects = s;
    if (p) _papers = p;
    if (q) _questions = q;
  }

  /**
   * Get all active academic subjects
   */
  function getSubjects() {
    syncWithGlobals();
    return [..._subjects];
  }

  /**
   * Filter PYQ papers by multiple criteria
   */
  function getPapers(filters = {}) {
    syncWithGlobals();
    let result = [..._papers];

    if (filters.level && filters.level !== 'all') {
      result = result.filter(p => p.level.toLowerCase() === filters.level.toLowerCase());
    }

    if (filters.semester && filters.semester !== 'all') {
      result = result.filter(p => String(p.semester) === String(filters.semester));
    }

    if (filters.subjectId && filters.subjectId !== 'all') {
      result = result.filter(p => p.subjectId === filters.subjectId);
    }

    if (filters.examType && filters.examType !== 'all') {
      result = result.filter(p => p.examType.toLowerCase() === filters.examType.toLowerCase());
    }

    if (filters.year && filters.year !== 'all') {
      result = result.filter(p => String(p.year) === String(filters.year));
    }

    if (filters.search && filters.search.trim() !== '') {
      const q = filters.search.trim().toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.subject.toLowerCase().includes(q) ||
        (p.syllabusScope && p.syllabusScope.toLowerCase().includes(q))
      );
    }

    return result;
  }

  /**
   * Get a single paper by its ID
   */
  function getPaperById(paperId) {
    syncWithGlobals();
    return _papers.find(p => p.id === paperId) || null;
  }

  /**
   * Get resolved question objects for a paper
   */
  function getQuestionsForPaper(paperId) {
    syncWithGlobals();
    const paper = getPaperById(paperId);
    if (!paper || !paper.questionIds) return [];

    const questionMap = new Map(_questions.map(q => [q.id, q]));
    const resolved = [];

    for (const qid of paper.questionIds) {
      if (questionMap.has(qid)) {
        resolved.push(questionMap.get(qid));
      }
    }
    return resolved;
  }

  /**
   * Fisher-Yates array shuffle helper
   */
  function shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  /**
   * Generate a custom practice test session
   * @param {number} requestedCount - 15, 25, or 45
   * @param {string} subjectId - 'all' or specific subjectId
   */
  function generatePracticeTest(requestedCount, subjectId = 'all') {
    syncWithGlobals();
    let pool = [..._questions];

    if (subjectId && subjectId !== 'all') {
      pool = pool.filter(q => q.subjectId === subjectId);
    }

    if (pool.length < requestedCount) {
      return {
        error: 'NOT_ENOUGH_QUESTIONS',
        available: pool.length,
        requested: requestedCount,
        message: `We currently have ${pool.length} questions available for this selection, which is less than the requested ${requestedCount}. Please choose a smaller test size or select 'All Subjects'.`
      };
    }

    const shuffled = shuffleArray(pool);
    const selectedQuestions = shuffled.slice(0, requestedCount);

    // Map test duration
    let durationMinutes = 30;
    if (requestedCount === 25) durationMinutes = 50;
    else if (requestedCount === 45) durationMinutes = 90;

    return {
      sessionId: 'sess-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
      type: 'practice',
      title: subjectId === 'all' ? 'All Subjects Practice Assessment' : (_subjects.find(s => s.id === subjectId)?.name || 'Custom Practice'),
      subjectId: subjectId,
      questionCount: requestedCount,
      durationMinutes: durationMinutes,
      durationSeconds: durationMinutes * 60,
      startedAt: Date.now(),
      questions: selectedQuestions
    };
  }

  /**
   * Grade user answers and calculate results
   * @param {Array} questions - questions array
   * @param {Object} userAnswers - map of questionIndex => selectedOptionIndex
   * @param {number} timeElapsedSeconds - time taken
   */
  function gradeSubmission(questions, userAnswers, timeElapsedSeconds = 0) {
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    const breakdown = questions.map((q, idx) => {
      const selected = userAnswers[idx];
      const isAnswered = selected !== undefined && selected !== null;
      const isCorrect = isAnswered && selected === q.correctAnswer;

      if (!isAnswered) {
        unansweredCount++;
      } else if (isCorrect) {
        correctCount++;
      } else {
        incorrectCount++;
      }

      return {
        questionIndex: idx,
        questionId: q.id,
        questionText: q.question,
        subject: q.subject,
        topic: q.topic,
        difficulty: q.difficulty,
        options: q.options,
        userAnswerIndex: isAnswered ? selected : null,
        correctAnswerIndex: q.correctAnswer,
        userAnswerText: isAnswered ? q.options[selected] : null,
        correctAnswerText: q.options[q.correctAnswer],
        isCorrect: isCorrect,
        isAnswered: isAnswered,
        explanation: q.explanation
      };
    });

    const totalQuestions = questions.length;
    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    return {
      totalQuestions,
      correctCount,
      incorrectCount,
      unansweredCount,
      score: correctCount,
      percentage,
      timeElapsedSeconds,
      submittedAt: Date.now(),
      breakdown
    };
  }

  return {
    setStoreData,
    getSubjects,
    getPapers,
    getPaperById,
    getQuestionsForPaper,
    generatePracticeTest,
    gradeSubmission
  };
});
