/**
 * IITian Tattva | Database-Ready Subjects Metadata
 * Curriculum: IIT Madras BS in Data Science & Applications (Foundation Level)
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.IITianSubjects = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  return [
    {
      id: "subj-python",
      name: "Programming in Python",
      shortName: "Python",
      level: "Foundation",
      semester: 1,
      code: "BSSE1004",
      category: "Programming",
      description: "Syntax, algorithms, object-oriented principles, and standard data structures in Python 3."
    },
    {
      id: "subj-math1",
      name: "Mathematics for Data Science I",
      shortName: "Maths I",
      level: "Foundation",
      semester: 1,
      code: "BSSE1001",
      category: "Mathematics",
      description: "Single-variable calculus, sequences, linear systems, and matrix fundamentals."
    },
    {
      id: "subj-stats1",
      name: "Statistics for Data Science I",
      shortName: "Stats I",
      level: "Foundation",
      semester: 1,
      code: "BSSE1002",
      category: "Statistics",
      description: "Descriptive statistics, probability rules, discrete distributions, and expectation."
    },
    {
      id: "subj-ct",
      name: "Computational Thinking",
      shortName: "Comp Thinking",
      level: "Foundation",
      semester: 1,
      code: "BSSE1003",
      category: "Foundations",
      description: "Algorithm design, flowcharts, step-by-step logic, pattern matching, and pseudocode."
    },
    {
      id: "subj-english1",
      name: "English I",
      shortName: "English I",
      level: "Foundation",
      semester: 1,
      code: "BSSE1005",
      category: "Communication",
      description: "Grammar, comprehension, sentence structure, and precise technical writing."
    },
    {
      id: "subj-math2",
      name: "Mathematics for Data Science II",
      shortName: "Maths II",
      level: "Foundation",
      semester: 2,
      code: "BSSE1006",
      category: "Mathematics",
      description: "Multivariable calculus, partial derivatives, gradients, vector spaces, and eigenvalues."
    },
    {
      id: "subj-stats2",
      name: "Statistics for Data Science II",
      shortName: "Stats II",
      level: "Foundation",
      semester: 2,
      code: "BSSE1007",
      category: "Statistics",
      description: "Continuous distributions, normal curves, hypothesis testing, sampling, and covariance."
    },
    {
      id: "subj-english2",
      name: "English II",
      shortName: "English II",
      level: "Foundation",
      semester: 2,
      code: "BSSE1008",
      category: "Communication",
      description: "Professional communication, formal argument analysis, and documentation skills."
    }
  ];
});
