import { Course, Chapter, Lesson, Category, SubjectSlug } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  // Mathematics Categories
  {
    id: 'cat-math-calc',
    subjectSlug: 'mathematics',
    title: 'Calculus & Analysis',
    slug: 'calculus',
    description: 'Limits, derivatives, integrals, infinite series, and vector calculus.',
    iconName: 'Activity'
  },
  {
    id: 'cat-math-linear',
    subjectSlug: 'mathematics',
    title: 'Linear Algebra',
    slug: 'linear-algebra',
    description: 'Vector spaces, linear transformations, matrices, determinants, and eigenvalues.',
    iconName: 'Grid'
  },
  {
    id: 'cat-math-diff',
    subjectSlug: 'mathematics',
    title: 'Differential Equations',
    slug: 'differential-equations',
    description: 'Ordinary and partial differential equations with physical boundary value problems.',
    iconName: 'Waves'
  },
  {
    id: 'cat-math-prob',
    subjectSlug: 'mathematics',
    title: 'Probability & Statistics',
    slug: 'probability-statistics',
    description: 'Random variables, distributions, stochastic processes, and statistical inference.',
    iconName: 'BarChart2'
  },
  {
    id: 'cat-math-geom',
    subjectSlug: 'mathematics',
    title: 'Geometry & Topology',
    slug: 'geometry',
    description: 'Euclidean and differential geometry, manifolds, and topological invariants.',
    iconName: 'Triangle'
  },
  {
    id: 'cat-math-num',
    subjectSlug: 'mathematics',
    title: 'Number Theory & Algebra',
    slug: 'number-theory',
    description: 'Prime numbers, modular arithmetic, groups, rings, and algebraic fields.',
    iconName: 'Hash'
  },

  // Physics Categories
  {
    id: 'cat-phys-mech',
    subjectSlug: 'physics',
    title: 'Classical Mechanics',
    slug: 'mechanics',
    description: 'Kinematics, Newtonian dynamics, conservation laws, oscillations, and Lagrangian formulation.',
    iconName: 'Compass'
  },
  {
    id: 'cat-phys-em',
    subjectSlug: 'physics',
    title: 'Electromagnetism',
    slug: 'electromagnetism',
    description: 'Electrostatics, magnetostatics, electrodynamics, Maxwell’s equations, and radiation.',
    iconName: 'Zap'
  },
  {
    id: 'cat-phys-thermo',
    subjectSlug: 'physics',
    title: 'Thermodynamics & Statistical Physics',
    slug: 'thermodynamics',
    description: 'Laws of thermodynamics, heat engines, entropy, Boltzmann statistics, and ensembles.',
    iconName: 'Flame'
  },
  {
    id: 'cat-phys-quantum',
    subjectSlug: 'physics',
    title: 'Quantum Mechanics',
    slug: 'quantum-mechanics',
    description: 'Wavefunctions, Schrödinger equation, operators, spin, and perturbation theory.',
    iconName: 'Atom'
  },
  {
    id: 'cat-phys-rel',
    subjectSlug: 'physics',
    title: 'Special & General Relativity',
    slug: 'relativity',
    description: 'Lorentz transformations, spacetime geometry, tensors, and Einstein field equations.',
    iconName: 'Orbit'
  },
  {
    id: 'cat-phys-optics',
    subjectSlug: 'physics',
    title: 'Optics & Wave Motion',
    slug: 'optics-waves',
    description: 'Geometric optics, wave interference, diffraction, polarization, and lasers.',
    iconName: 'Eye'
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-calc-1',
    subjectSlug: 'mathematics',
    categorySlug: 'calculus',
    title: 'Calculus I: Differential & Integral Foundations',
    slug: 'calculus-1',
    description: 'A rigorous introduction to single-variable calculus covering limits, continuity, the definition and applications of the derivative, Riemann integration, and the Fundamental Theorem of Calculus.',
    level: 'Introductory',
    authors: ['Prof. Eleanor Vance, Ph.D.', 'Dr. Julian Thorne'],
    contributors: ['M. Al-Farabi', 'Elena Rostova'],
    estimatedHours: 45,
    prerequisites: ['Precalculus', 'Trigonometry', 'High School Algebra'],
    publishedAt: '2025-01-15',
    updatedAt: '2026-02-10',
    coverGradient: 'from-amber-700 via-amber-800 to-stone-900',
    iconName: 'Sigma',
    chaptersCount: 4,
    lessonsCount: 12,
    isFeatured: true
  },
  {
    id: 'course-linear-alg',
    subjectSlug: 'mathematics',
    categorySlug: 'linear-algebra',
    title: 'Linear Algebra: Vector Spaces & Linear Maps',
    slug: 'linear-algebra',
    description: 'Vector spaces, linear transformations, matrices, Gaussian elimination, orthogonality, determinants, eigenvalues, eigenvectors, and the Spectral Theorem.',
    level: 'Intermediate',
    authors: ['Dr. Arthur Pendelton', 'Prof. Sarah Lin'],
    contributors: ['Marcus Aurelius', 'David Hilbert'],
    estimatedHours: 40,
    prerequisites: ['Calculus I', 'Basic Set Theory'],
    publishedAt: '2025-03-20',
    updatedAt: '2026-01-18',
    coverGradient: 'from-emerald-800 via-teal-900 to-stone-900',
    iconName: 'Grid',
    chaptersCount: 3,
    lessonsCount: 8,
    isFeatured: false
  },
  {
    id: 'course-classical-mech',
    subjectSlug: 'physics',
    categorySlug: 'mechanics',
    title: 'Classical Mechanics: Kinematics, Dynamics & Energy',
    slug: 'classical-mechanics',
    description: 'A comprehensive study of motion, forces, momentum, energy conservation, rigid body rotational dynamics, harmonic oscillations, and central force motion.',
    level: 'Introductory',
    authors: ['Prof. Richard Feynman-Hall', 'Dr. Miriam O’Connor'],
    contributors: ['Isaac Newton Group', 'J. Lagrange'],
    estimatedHours: 50,
    prerequisites: ['Single Variable Calculus', 'Vector Basics'],
    publishedAt: '2025-02-01',
    updatedAt: '2026-02-14',
    coverGradient: 'from-blue-900 via-slate-800 to-stone-900',
    iconName: 'Compass',
    chaptersCount: 4,
    lessonsCount: 14,
    isFeatured: true
  },
  {
    id: 'course-electromagnetism',
    subjectSlug: 'physics',
    categorySlug: 'electromagnetism',
    title: 'Electromagnetism & Maxwell’s Equations',
    slug: 'electromagnetism',
    description: 'Electrostatics, Gauss’s Law, electric potential, Laplace equation, magnetostatics, Faraday’s law of induction, Ampère-Maxwell law, and electromagnetic waves in vacuum.',
    level: 'Intermediate',
    authors: ['Prof. James Clerk Bennett', 'Dr. Aris Thorne'],
    contributors: ['Michael Faraday Circle'],
    estimatedHours: 48,
    prerequisites: ['Classical Mechanics', 'Multivariable Calculus'],
    publishedAt: '2025-04-10',
    updatedAt: '2026-01-25',
    coverGradient: 'from-indigo-950 via-slate-900 to-stone-900',
    iconName: 'Zap',
    chaptersCount: 3,
    lessonsCount: 9,
    isFeatured: true
  }
];

export const INITIAL_CHAPTERS: Chapter[] = [
  // --- CALCULUS I CHAPTERS ---
  {
    id: 'ch-calc-1',
    courseId: 'course-calc-1',
    number: 1,
    title: 'Limits & Continuity',
    slug: 'limits-and-continuity',
    description: 'The rigorous foundations of calculus: intuition, formal epsilon-delta definitions, limit laws, squeeze theorem, and the Intermediate Value Theorem.',
    lessons: []
  },
  {
    id: 'ch-calc-2',
    courseId: 'course-calc-1',
    number: 2,
    title: 'The Derivative & Rules of Differentiation',
    slug: 'the-derivative',
    description: 'Geometric interpretation of derivatives as instantaneous rates of change, product and quotient rules, chain rule, and implicit differentiation.',
    lessons: []
  },
  {
    id: 'ch-calc-3',
    courseId: 'course-calc-1',
    number: 3,
    title: 'Applications of the Derivative',
    slug: 'applications-of-derivatives',
    description: 'Critical points, Mean Value Theorem, curve sketching, concavity, optimization problems, and L’Hôpital’s Rule.',
    lessons: []
  },
  {
    id: 'ch-calc-4',
    courseId: 'course-calc-1',
    number: 4,
    title: 'Definite Integrals & Fundamental Theorem',
    slug: 'definite-integrals',
    description: 'Riemann sums, area under a curve, the Fundamental Theorem of Calculus, antiderivatives, and integration by substitution.',
    lessons: []
  },

  // --- CLASSICAL MECHANICS CHAPTERS ---
  {
    id: 'ch-mech-1',
    courseId: 'course-classical-mech',
    number: 1,
    title: 'Kinematics in One & Multiple Dimensions',
    slug: 'kinematics',
    description: 'Coordinate systems, position vector $\\vec{r}(t)$, instantaneous velocity $\\vec{v}(t)$, acceleration $\\vec{a}(t)$, and projectile trajectories.',
    lessons: []
  },
  {
    id: 'ch-mech-2',
    courseId: 'course-classical-mech',
    number: 2,
    title: 'Newton’s Laws of Motion & Force Analysis',
    slug: 'newtons-laws',
    description: 'Inertial reference frames, Newton’s three laws, free-body diagrams, static & kinetic friction, tension, and drag forces.',
    lessons: []
  },
  {
    id: 'ch-mech-3',
    courseId: 'course-classical-mech',
    number: 3,
    title: 'Work, Energy & Conservative Fields',
    slug: 'work-energy',
    description: 'Line integrals of force, the Work-Energy Theorem, conservative forces, potential energy functions, and conservation of mechanical energy.',
    lessons: []
  },
  {
    id: 'ch-mech-4',
    courseId: 'course-classical-mech',
    number: 4,
    title: 'Linear Momentum & System of Particles',
    slug: 'momentum-and-collisions',
    description: 'Impulse, conservation of linear momentum, center of mass coordinates, elastic and inelastic collisions in 2D, and rocket propulsion.',
    lessons: []
  },

  // --- LINEAR ALGEBRA CHAPTERS ---
  {
    id: 'ch-lin-1',
    courseId: 'course-linear-alg',
    number: 1,
    title: 'Linear Systems, Matrices & Elimination',
    slug: 'linear-systems-matrices',
    description: 'Systems of linear equations, augmented matrices, row echelon form, and Gaussian elimination.',
    lessons: []
  },
  {
    id: 'ch-lin-2',
    courseId: 'course-linear-alg',
    number: 2,
    title: 'Vector Spaces, Subspaces & Basis',
    slug: 'vector-spaces-subspaces',
    description: 'Axioms of real vector spaces, span, linear independence, basis, dimension, and fundamental matrix subspaces.',
    lessons: []
  },
  {
    id: 'ch-lin-3',
    courseId: 'course-linear-alg',
    number: 3,
    title: 'Eigenvalues, Eigenvectors & Diagonalization',
    slug: 'eigenvalues-diagonalization',
    description: 'Characteristic polynomials, geometric vs algebraic multiplicity, eigenspaces, and matrix diagonalization.',
    lessons: []
  },

  // --- ELECTROMAGNETISM CHAPTERS ---
  {
    id: 'ch-em-1',
    courseId: 'course-electromagnetism',
    number: 1,
    title: 'Electrostatics & Coulomb’s Law',
    slug: 'electrostatics',
    description: 'Electric charge, Coulomb’s force law, electric field $\\vec{E}$, continuous charge distributions, and field lines.',
    lessons: []
  },
  {
    id: 'ch-em-2',
    courseId: 'course-electromagnetism',
    number: 2,
    title: 'Gauss’s Law & Electric Potential',
    slug: 'gauss-law-potential',
    description: 'Electric flux, Gauss’s theorem in integral and differential forms, electrostatic potential $V$, and Poisson’s equation.',
    lessons: []
  },
  {
    id: 'ch-em-3',
    courseId: 'course-electromagnetism',
    number: 3,
    title: 'Magnetostatics & Ampère’s Law',
    slug: 'magnetostatics',
    description: 'Lorentz force law, Biot-Savart law, vector potential $\\vec{A}$, and Ampère’s circuital law.',
    lessons: []
  }
];

export const INITIAL_LESSONS: Lesson[] = [
  // ==========================================
  // PHYSICS: CLASSICAL MECHANICS LESSONS
  // ==========================================
  {
    id: 'lesson-mech-2-1',
    chapterId: 'ch-mech-2',
    courseId: 'course-classical-mech',
    number: '2.1',
    title: 'Newton’s Laws of Motion & Dynamical Principles',
    slug: 'newtons-laws-of-motion',
    description: 'A thorough treatment of Newton’s three laws of motion, inertial frames of reference, and the vector formulation of classical dynamics.',
    readingTimeMinutes: 18,
    author: 'Prof. Richard Feynman-Hall',
    status: 'published',
    publishedAt: '2025-02-05',
    updatedAt: '2026-02-14',
    tags: ['Mechanics', 'Newton', 'Dynamics', 'Vectors', 'Forces'],
    blocks: [
      {
        id: 'b-mech-1',
        type: 'paragraph',
        text: 'Classical mechanics is founded upon the three laws of motion formulated by Sir Isaac Newton in his *Philosophiae Naturalis Principia Mathematica* (1687). These laws provide the mathematical framework for predicting the trajectory of macroscopic bodies moving at speeds significantly less than the speed of light ($v \\ll c$).'
      },
      {
        id: 'b-mech-2',
        type: 'heading',
        level: 2,
        text: '1. Inertial Reference Frames & The First Law'
      },
      {
        id: 'b-mech-3',
        type: 'definition',
        title: 'Definition 2.1 — Inertial Reference Frame',
        text: 'An **inertial frame of reference** is a coordinate system in which a body subject to no net external force moves with constant velocity along a straight line (or remains at rest). Any frame moving with constant velocity relative to an inertial frame is likewise an inertial frame.'
      },
      {
        id: 'b-mech-4',
        type: 'theorem',
        title: 'Newton’s First Law (Law of Inertia)',
        text: 'In an inertial frame of reference, an object continues in its state of rest, or of uniform motion in a straight line, unless acted upon by a net non-zero external force $\\vec{F}_{\\text{net}}$:\n\n$$\\vec{F}_{\\text{net}} = \\sum_{i} \\vec{F}_i = \\vec{0} \\implies \\frac{d\\vec{v}}{dt} = \\vec{a} = \\vec{0}$$'
      },
      {
        id: 'b-mech-5',
        type: 'heading',
        level: 2,
        text: '2. Mathematical Formulation of Newton’s Second Law'
      },
      {
        id: 'b-mech-6',
        type: 'paragraph',
        text: 'Newton originally formulated his second law in terms of the time rate of change of **linear momentum** $\\vec{p} = m\\vec{v}$. When the mass $m$ of the particle remains constant with respect to time, the derivative simplifies directly to the familiar product of mass and acceleration.'
      },
      {
        id: 'b-mech-7',
        type: 'equation',
        latex: '\\vec{F}_{\\text{net}} = \\frac{d\\vec{p}}{dt} = \\frac{d}{dt}(m\\vec{v}) = m\\frac{d\\vec{v}}{dt} = m\\vec{a} = m\\frac{d^2\\vec{r}}{dt^2}'
      },
      {
        id: 'b-mech-8',
        type: 'paragraph',
        text: 'In Cartesian coordinates $(x, y, z)$, this single vector equation decomposes into a system of three independent scalar second-order differential equations:'
      },
      {
        id: 'b-mech-9',
        type: 'equation',
        latex: '\\begin{cases}\nF_x = m a_x = m \\dfrac{d^2x}{dt^2} \\\\[8pt]\nF_y = m a_y = m \\dfrac{d^2y}{dt^2} \\\\[8pt]\nF_z = m a_z = m \\dfrac{d^2z}{dt^2}\n\\end{cases}'
      },
      {
        id: 'b-mech-diagram-1',
        type: 'diagram',
        diagram: {
          type: 'freebody',
          title: 'Interactive Free-Body Vector Diagram',
          caption: 'Interactive force balance on an inclined surface with gravity mg, normal force N, friction f_k, and external force F.',
          config: {
            angle: 30,
            mass: 5,
            mu: 0.25,
            appliedForce: 40
          }
        }
      },
      {
        id: 'b-mech-10',
        type: 'heading',
        level: 2,
        text: '3. Newton’s Third Law & Conservation of Mutual Momentum'
      },
      {
        id: 'b-mech-11',
        type: 'theorem',
        title: 'Newton’s Third Law (Action & Reaction)',
        text: 'When body $A$ exerts a force $\\vec{F}_{A \\to B}$ on body $B$, body $B$ simultaneously exerts an equal and opposite force $\\vec{F}_{B \\to A}$ on body $A$:'
      },
      {
        id: 'b-mech-12',
        type: 'equation',
        latex: '\\vec{F}_{A \\to B} = -\\vec{F}_{B \\to A} \\iff \\vec{F}_{A \\to B} + \\vec{F}_{B \\to A} = \\vec{0}'
      },
      {
        id: 'b-mech-13',
        type: 'remark',
        title: 'Important Remark on Action-Reaction Pairs',
        text: 'Action and reaction forces **never** act on the same body. Consequently, they do not cancel each other out when analyzing the equations of motion for a single isolated body.'
      },
      {
        id: 'b-mech-14',
        type: 'example',
        title: 'Example 2.1 — Particle on an Inclined Plane with Friction',
        text: 'A block of mass $m$ slides down a rough incline inclined at an angle $\\theta$ with respect to the horizontal. The coefficient of kinetic friction is $\\mu_k$.\n\nResolving forces perpendicular and parallel to the incline:\n$$\\sum F_\\perp = N - mg\\cos\\theta = 0 \\implies N = mg\\cos\\theta$$\n$$\\sum F_\\parallel = mg\\sin\\theta - f_k = m a_x$$\nSince $f_k = \\mu_k N = \\mu_k mg\\cos\\theta$, the net downhill acceleration is:\n$$a_x = g(\\sin\\theta - \\mu_k\\cos\\theta)$$ Note that motion down the plane requires $\\tan\\theta > \\mu_s$.'
      },
      {
        id: 'b-mech-15',
        type: 'heading',
        level: 2,
        text: '4. Chapter Exercises & Solutions'
      },
      {
        id: 'b-mech-ex-1',
        type: 'exercise',
        exercise: {
          id: 'ex-mech-2-1',
          number: 1,
          prompt: 'A particle of mass $m = 2.0\\,\\text{kg}$ is subjected to a time-dependent force $\\vec{F}(t) = (6t\\hat{i} - 12t^2\\hat{j})\\,\\text{N}$. Assuming the particle starts from rest at the origin at $t = 0$, determine the position vector $\\vec{r}(t)$ at time $t = 2.0\\,\\text{s}$.',
          hints: [
            'Use Newton’s second law to find $\\vec{a}(t) = \\frac{1}{m}\\vec{F}(t)$.',
            'Integrate $\\vec{a}(t)$ twice with respect to time, applying initial conditions $\\vec{v}(0)=\\vec{0}$ and $\\vec{r}(0)=\\vec{0}$.'
          ],
          solutionLatex: '\\vec{r}(2) = 4\\hat{i} - 16\\hat{j}\\,\\text{m}',
          solutionExplanation: 'First, find the acceleration vector:\n$$\\vec{a}(t) = \\frac{\\vec{F}(t)}{m} = \\frac{6t\\hat{i} - 12t^2\\hat{j}}{2.0} = 3t\\hat{i} - 6t^2\\hat{j}\\quad [\\text{m/s}^2]$$\n\nIntegrating to find velocity with $\\vec{v}(0) = \\vec{0}$:\n$$\\vec{v}(t) = \\int_0^t \\vec{a}(\\tau)\\,d\\tau = \\left[ \\frac{3}{2}\\tau^2\\hat{i} - 2\\tau^3\\hat{j} \\right]_0^t = \\frac{3}{2}t^2\\hat{i} - 2t^3\\hat{j}\\quad [\\text{m/s}]$$\n\nIntegrating again to obtain position with $\\vec{r}(0) = \\vec{0}$:\n$$\\vec{r}(t) = \\int_0^t \\vec{v}(\\tau)\\,d\\tau = \\left[ \\frac{1}{2}\\tau^3\\hat{i} - \\frac{1}{2}\\tau^4\\hat{j} \\right]_0^t = \\frac{1}{2}t^3\\hat{i} - \\frac{1}{2}t^4\\hat{j}\\quad [\\text{m}]$$\n\nEvaluating at $t = 2.0\\,\\text{s}$:\n$$\\vec{r}(2.0) = \\frac{1}{2}(2.0)^3\\hat{i} - \\frac{1}{2}(2.0)^4\\hat{j} = 4.0\\hat{i} - 8.0\\hat{j}\\,\\text{m}$$'
        }
      },
      {
        id: 'b-mech-ex-2',
        type: 'exercise',
        exercise: {
          id: 'ex-mech-2-2',
          number: 2,
          type: 'multiple_choice',
          prompt: 'Which of the following conditions guarantees that a reference frame $S\'$ is an inertial reference frame, given that $S$ is already known to be an inertial frame?',
          options: [
            '$S\'$ rotates with a constant angular velocity $\\vec{\\omega}$ relative to $S$.',
            '$S\'$ moves with a constant rectilinear velocity $\\vec{u}$ relative to $S$.',
            '$S\'$ accelerates with constant acceleration $\\vec{a}_0$ relative to $S$.',
            '$S\'$ is in free-fall in a uniform gravitational field.'
          ],
          correctOptionIndex: 1,
          solutionExplanation: 'By Galilean relativity, any frame translating with constant rectilinear velocity $\\vec{u}$ ($d\\vec{u}/dt = \\vec{0}$) relative to an inertial frame has zero fictitious forces (centrifugal, Coriolis, or Euler forces) and therefore satisfies Newton’s First Law identically.'
        }
      }
    ]
  },
  {
    id: 'lesson-mech-1-1',
    chapterId: 'ch-mech-1',
    courseId: 'course-classical-mech',
    number: '1.1',
    title: 'Position, Velocity & Vectors in Classical Kinematics',
    slug: 'position-velocity-vectors',
    description: 'Parametric curves in $\\mathbb{R}^3$, position vectors, instantaneous velocity as tangent vector, acceleration, and arc length parameterization.',
    readingTimeMinutes: 15,
    author: 'Prof. Richard Feynman-Hall',
    status: 'published',
    publishedAt: '2025-02-01',
    updatedAt: '2026-02-10',
    tags: ['Kinematics', 'Vectors', 'Calculus', 'Trajectories'],
    blocks: [
      {
        id: 'b-kine-1',
        type: 'paragraph',
        text: 'Kinematics is the branch of classical mechanics that describes the geometry of motion without reference to the forces causing it. We specify the position of a point-like particle in Euclidean 3-space $\\mathbb{E}^3$ by a time-dependent position vector $\\vec{r}(t)$.'
      },
      {
        id: 'b-kine-2',
        type: 'equation',
        latex: '\\vec{r}(t) = x(t)\\hat{i} + y(t)\\hat{j} + z(t)\\hat{k} = \\begin{pmatrix} x(t) \\\\ y(t) \\\\ z(t) \\end{pmatrix}'
      },
      {
        id: 'b-kine-3',
        type: 'heading',
        level: 2,
        text: '1. Velocity & Acceleration Vectors'
      },
      {
        id: 'b-kine-4',
        type: 'definition',
        title: 'Definition 1.1 — Instantaneous Velocity & Acceleration',
        text: 'The **instantaneous velocity** $\\vec{v}(t)$ is the first derivative of the position vector with respect to time $t$, and the **acceleration** $\\vec{a}(t)$ is the second derivative:\n\n$$\\vec{v}(t) = \\lim_{\\Delta t \\to 0} \\frac{\\vec{r}(t+\\Delta t) - \\vec{r}(t)}{\\Delta t} = \\frac{d\\vec{r}}{dt}$$\n\n$$\\vec{a}(t) = \\frac{d\\vec{v}}{dt} = \\frac{d^2\\vec{r}}{dt^2}$$'
      },
      {
        id: 'b-kine-diagram-1',
        type: 'diagram',
        diagram: {
          type: 'projectile',
          title: 'Interactive Projectile Motion Simulation',
          caption: 'Parabolic trajectory governed by initial velocity v0, angle theta, and gravitational acceleration g.',
          config: {
            v0: 25,
            angle: 45,
            g: 9.81
          }
        }
      },
      {
        id: 'b-kine-5',
        type: 'heading',
        level: 2,
        text: '2. Projectile Motion Equations'
      },
      {
        id: 'b-kine-6',
        type: 'paragraph',
        text: 'Under a constant gravitational field $\\vec{g} = -g\\hat{j}$ with negligible air resistance, integrating $\\vec{a} = -g\\hat{j}$ yields the classical trajectory equations:'
      },
      {
        id: 'b-kine-7',
        type: 'equation',
        latex: 'x(t) = v_0 \\cos\\theta \\, t, \\qquad y(t) = v_0 \\sin\\theta \\, t - \\frac{1}{2}g t^2'
      },
      {
        id: 'b-kine-8',
        type: 'paragraph',
        text: 'Eliminating time $t = x / (v_0 \\cos\\theta)$ produces the equation of the parabolic trajectory in the $xy$-plane:'
      },
      {
        id: 'b-kine-9',
        type: 'equation',
        latex: 'y(x) = x \\tan\\theta - \\frac{g}{2 v_0^2 \\cos^2\\theta} x^2'
      }
    ]
  },

  // ==========================================
  // MATHEMATICS: CALCULUS I LESSONS
  // ==========================================
  {
    id: 'lesson-calc-1-1',
    chapterId: 'ch-calc-1',
    courseId: 'course-calc-1',
    number: '1.1',
    title: 'The Formal Epsilon-Delta Definition of a Limit',
    slug: 'epsilon-delta-definition-of-a-limit',
    description: 'Precise topological formulation of real limits, geometric interpretation of bounds, epsilon-delta proofs, and limit uniqueness.',
    readingTimeMinutes: 20,
    author: 'Prof. Eleanor Vance, Ph.D.',
    status: 'published',
    publishedAt: '2025-01-18',
    updatedAt: '2026-02-12',
    tags: ['Calculus', 'Limits', 'Analysis', 'Epsilon-Delta', 'Proofs'],
    blocks: [
      {
        id: 'b-calc-1',
        type: 'paragraph',
        text: 'The concept of a limit is the cornerstone upon which the entirety of modern mathematical analysis is constructed. Before Augustin-Louis Cauchy and Karl Weierstrass formalized the theory in the 19th century, calculus relied on informal notions of "infinitesimals". The rigorous $\\epsilon$-$\\delta$ definition translates geometric proximity into precise logical quantifiers.'
      },
      {
        id: 'b-calc-2',
        type: 'heading',
        level: 2,
        text: '1. The Formal Definition'
      },
      {
        id: 'b-calc-3',
        type: 'definition',
        title: 'Definition 1.1 — Limit of a Real Function (Weierstrass)',
        text: 'Let $f: D \\to \\mathbb{R}$ be a function defined on an open interval containing $c$, except possibly at $c$ itself. We write\n\n$$\\lim_{x \\to c} f(x) = L$$\n\nif and only if for every real number $\\epsilon > 0$, there exists a real number $\\delta > 0$ such that for all $x \\in D$:\n\n$$0 < |x - c| < \\delta \\implies |f(x) - L| < \\epsilon$$'
      },
      {
        id: 'b-calc-4',
        type: 'paragraph',
        text: 'In predicate logic notation, this statement is concisely represented as:'
      },
      {
        id: 'b-calc-5',
        type: 'equation',
        latex: '\\forall \\epsilon > 0, \\; \\exists \\delta > 0 \\; \\text{such that} \\; \\forall x \\in D, \\; (0 < |x - c| < \\delta \\implies |f(x) - L| < \\epsilon)'
      },
      {
        id: 'b-calc-diagram-1',
        type: 'diagram',
        diagram: {
          type: 'plot',
          title: 'Interactive Epsilon-Delta Tolerance Window',
          caption: 'Visual demonstration showing how selecting epsilon controls the required delta neighborhood around x = c.',
          config: {
            func: '2*x + 1',
            c: 2,
            L: 5,
            epsilon: 0.8
          }
        }
      },
      {
        id: 'b-calc-6',
        type: 'heading',
        level: 2,
        text: '2. Uniqueness of the Limit'
      },
      {
        id: 'b-calc-7',
        type: 'theorem',
        title: 'Theorem 1.1 — Uniqueness of Limits',
        text: 'If $\\lim_{x \\to c} f(x) = L_1$ and $\\lim_{x \\to c} f(x) = L_2$, then $L_1 = L_2$.'
      },
      {
        id: 'b-calc-8',
        type: 'proof',
        title: 'Proof of Theorem 1.1',
        text: 'Suppose for the sake of contradiction that $L_1 \\neq L_2$. Set $\\epsilon = \\frac{|L_1 - L_2|}{2} > 0$.\n\nBy the definition of a limit:\n- There exists $\\delta_1 > 0$ such that $0 < |x - c| < \\delta_1 \\implies |f(x) - L_1| < \\epsilon$.\n- There exists $\\delta_2 > 0$ such that $0 < |x - c| < \\delta_2 \\implies |f(x) - L_2| < \\epsilon$.\n\nLet $\\delta = \\min(\\delta_1, \\delta_2) > 0$. For any $x$ satisfying $0 < |x - c| < \\delta$, applying the Triangle Inequality yields:\n\n$$\\begin{aligned}\n|L_1 - L_2| &= |(L_1 - f(x)) + (f(x) - L_2)| \\\\[4pt]\n&\\le |f(x) - L_1| + |f(x) - L_2| \\\\[4pt]\n&< \\epsilon + \\epsilon = 2\\epsilon = |L_1 - L_2|\n\\end{aligned}$$\n\nThis gives $|L_1 - L_2| < |L_1 - L_2|$, an impossible contradiction ($a < a$). Hence, $L_1 = L_2$. $\\blacksquare$'
      },
      {
        id: 'b-calc-9',
        type: 'heading',
        level: 2,
        text: '3. Step-by-Step Epsilon-Delta Example'
      },
      {
        id: 'b-calc-10',
        type: 'example',
        title: 'Example 1.1 — Rigorous Proof that $\\lim_{x \\to 3} (4x - 5) = 7$',
        text: '**Scratchwork:** We desire $|(4x - 5) - 7| < \\epsilon$.\nSimplifying: $|4x - 12| < \\epsilon \\iff 4|x - 3| < \\epsilon \\iff |x - 3| < \\frac{\\epsilon}{4}$.\n\n**Formal Proof:**\nLet $\\epsilon > 0$ be given. Choose $\\delta = \\frac{\\epsilon}{4} > 0$. If $0 < |x - 3| < \\delta$, then:\n$$|(4x - 5) - 7| = |4x - 12| = 4|x - 3| < 4\\delta = 4\\left(\\frac{\\epsilon}{4}\\right) = \\epsilon$$\nThis satisfies the definition, completing the proof.'
      },
      {
        id: 'b-calc-11',
        type: 'heading',
        level: 2,
        text: '4. Practice Exercises'
      },
      {
        id: 'b-calc-ex-1',
        type: 'exercise',
        exercise: {
          id: 'ex-calc-1-1',
          number: 1,
          prompt: 'For the limit $\\lim_{x \\to 2} (3x + 4) = 10$, find the largest value of $\\delta > 0$ corresponding to $\\epsilon = 0.06$.',
          hints: [
            'Express $|(3x + 4) - 10|$ in terms of $|x - 2|$.',
            'Find the algebraic relationship between $\\delta$ and $\\epsilon$.'
          ],
          solutionLatex: '\\delta = \\frac{\\epsilon}{3} = \\frac{0.06}{3} = 0.02',
          solutionExplanation: 'We require $|(3x + 4) - 10| < \\epsilon$ whenever $0 < |x - 2| < \\delta$.\n$$|3x - 6| < \\epsilon \\iff 3|x - 2| < \\epsilon \\iff |x - 2| < \\frac{\\epsilon}{3}$$\nSubstituting $\\epsilon = 0.06$:\n$$\\delta = \\frac{0.06}{3} = 0.02$$'
        }
      }
    ]
  },
  {
    id: 'lesson-calc-2-1',
    chapterId: 'ch-calc-2',
    courseId: 'course-calc-1',
    number: '2.1',
    title: 'The Derivative as a Function & Tangent Slope',
    slug: 'the-derivative-definition',
    description: 'Difference quotients, instantaneous rate of change, differentiability implies continuity, and algebraic rules for differentiation.',
    readingTimeMinutes: 22,
    author: 'Prof. Eleanor Vance, Ph.D.',
    status: 'published',
    publishedAt: '2025-01-25',
    updatedAt: '2026-02-10',
    tags: ['Calculus', 'Derivatives', 'Differentiability', 'Analysis'],
    blocks: [
      {
        id: 'b-der-1',
        type: 'paragraph',
        text: 'The derivative represents the exact instantaneous rate of change of a quantity and the geometric slope of the tangent line to the graph of a function. It is defined as the limit of secant line slopes over vanishingly small intervals.'
      },
      {
        id: 'b-der-2',
        type: 'heading',
        level: 2,
        text: '1. The Difference Quotient Definition'
      },
      {
        id: 'b-der-3',
        type: 'definition',
        title: 'Definition 2.1 — The Derivative',
        text: 'Let $f$ be a function defined on an open interval containing $x$. The **derivative of $f$ at $x$**, denoted $f\'(x)$ or $\\frac{df}{dx}$, is defined by:\n\n$$f\'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$$\n\nprovided this limit exists. If the limit exists, $f$ is said to be **differentiable** at $x$.'
      },
      {
        id: 'b-der-4',
        type: 'theorem',
        title: 'Theorem 2.1 — Differentiability Implies Continuity',
        text: 'If $f$ is differentiable at $x = c$, then $f$ is continuous at $x = c$. (Note that the converse is false, as demonstrated by $f(x) = |x|$ at $x = 0$.)'
      },
      {
        id: 'b-der-5',
        type: 'proof',
        title: 'Proof of Theorem 2.1',
        text: 'To prove continuity at $c$, we must demonstrate that $\\lim_{x \\to c} (f(x) - f(c)) = 0$.\n\nFor $x \\neq c$, we multiply and divide by $(x - c)$:\n$$f(x) - f(c) = \\frac{f(x) - f(c)}{x - c} \\cdot (x - c)$$\nTaking the limit as $x \\to c$ and applying the product rule for limits:\n$$\\begin{aligned}\n\\lim_{x \\to c} [f(x) - f(c)] &= \\lim_{x \\to c} \\left( \\frac{f(x) - f(c)}{x - c} \\right) \\cdot \\lim_{x \\to c} (x - c) \\\\[6pt]\n&= f\'(c) \\cdot 0 = 0\n\\end{aligned}$$\nThus $\\lim_{x \\to c} f(x) = f(c)$, which establishes that $f$ is continuous at $c$. $\\blacksquare$'
      },
      {
        id: 'b-der-6',
        type: 'heading',
        level: 2,
        text: '2. Fundamental Differentiation Formulas'
      },
      {
        id: 'b-der-7',
        type: 'equation',
        latex: '\\begin{aligned}\n\\frac{d}{dx}[x^n] &= n x^{n-1} \\qquad (n \\in \\mathbb{R}) \\\\[6pt]\n\\frac{d}{dx}[e^x] &= e^x \\\\[6pt]\n\\frac{d}{dx}[\\sin x] &= \\cos x, \\qquad \\frac{d}{dx}[\\cos x] = -\\sin x \\\\[6pt]\n\\frac{d}{dx}[\\ln x] &= \\frac{1}{x} \\qquad (x > 0)\n\\end{aligned}'
      }
    ]
  },
  {
    id: 'lesson-calc-4-1',
    chapterId: 'ch-calc-4',
    courseId: 'course-calc-1',
    number: '4.1',
    title: 'The Fundamental Theorem of Calculus',
    slug: 'fundamental-theorem-of-calculus',
    description: 'Connecting differential and integral calculus: Part 1 (derivative of an integral) and Part 2 (evaluation formula), with full analytic proofs.',
    readingTimeMinutes: 24,
    author: 'Prof. Eleanor Vance, Ph.D.',
    status: 'published',
    publishedAt: '2025-02-10',
    updatedAt: '2026-02-14',
    tags: ['Calculus', 'Integration', 'FTC', 'Analysis', 'Riemann'],
    blocks: [
      {
        id: 'b-ftc-1',
        type: 'paragraph',
        text: 'The Fundamental Theorem of Calculus (FTC) is one of the grandest achievements of mathematics, unifying the two seemingly disparate branches of calculus: differential calculus (tangent lines, instantaneous rates) and integral calculus (accumulated area, Riemann sums).'
      },
      {
        id: 'b-ftc-2',
        type: 'heading',
        level: 2,
        text: '1. The Fundamental Theorem (Part 1)'
      },
      {
        id: 'b-ftc-3',
        type: 'theorem',
        title: 'Theorem 4.1 — FTC Part 1 (Derivative of Accumulation Function)',
        text: 'Let $f$ be continuous on a closed interval $[a, b]$, and define the area accumulator function $g(x)$ by:\n\n$$g(x) = \\int_a^x f(t)\\,dt \\quad \\text{for } x \\in [a, b]$$\n\nThen $g(x)$ is continuous on $[a, b]$, differentiable on $(a, b)$, and its derivative is:\n\n$$g\'(x) = \\frac{d}{dx}\\left( \\int_a^x f(t)\\,dt \\right) = f(x)$$ In other words, differentiation inverts integration.'
      },
      {
        id: 'b-ftc-4',
        type: 'heading',
        level: 2,
        text: '2. The Fundamental Theorem (Part 2 — Evaluation Theorem)'
      },
      {
        id: 'b-ftc-5',
        type: 'theorem',
        title: 'Theorem 4.2 — FTC Part 2 (Evaluation of Definite Integrals)',
        text: 'If $f$ is continuous on $[a, b]$ and $F$ is any antiderivative of $f$ on $[a, b]$ (that is, $F\'(x) = f(x)$), then:\n\n$$\\int_a^b f(x)\\,dx = F(b) - F(a) = \\Big[ F(x) \\Big]_a^b$$'
      },
      {
        id: 'b-ftc-6',
        type: 'example',
        title: 'Example 4.1 — Definite Integral with Trigonometric & Polynomial Terms',
        text: 'Evaluate $\\int_0^{\\pi/2} (3x^2 + 4\\sin x)\\,dx$.\n\n**Solution:** An antiderivative is $F(x) = x^3 - 4\\cos x$.\n$$\\begin{aligned}\n\\int_0^{\\pi/2} (3x^2 + 4\\sin x)\\,dx &= \\Big[ x^3 - 4\\cos x \\Big]_0^{\\pi/2} \\\\[6pt]\n&= \\left( \\left(\\frac{\\pi}{2}\\right)^3 - 4\\cos\\left(\\frac{\\pi}{2}\\right) \\right) - (0^3 - 4\\cos(0)) \\\\[6pt]\n&= \\left( \\frac{\\pi^3}{8} - 0 \\right) - (-4) = \\frac{\\pi^3}{8} + 4\n\\end{aligned}$$'
      }
    ]
  }
];
