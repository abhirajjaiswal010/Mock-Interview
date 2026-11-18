import { phase1Data } from './phase1Data.js';
import { phase2Data } from './phase2Data.js';
import { phase3Data } from './phase3Data.js';
import { phase4Data } from './phase4Data.js';
import { phase5Data } from './phase5Data.js';
import { phase6Data } from './phase6Data.js';
import { phase7Data } from './phase7Data.js';
import { phase8Data } from './phase8Data.js';

export const allPhases = [
  {
    id: 1,
    title: "Phase 1: Python Fundamentals",
    shortTitle: "Phase 1",
    subtitle: "200 Questions across 14 Topics",
    description: "Python basics, Variables, Data Types, Operators, Loops, Functions, Recursion & Comprehensions.",
    questionCount: 200,
    topicCount: 14,
    status: "available",
    data: phase1Data
  },
  {
    id: 2,
    title: "Phase 2: Data Structures & Collections",
    shortTitle: "Phase 2",
    subtitle: "200 Questions across 11 Topics",
    description: "Strings, Lists, Tuples, Sets, Dictionaries, Collections Module, Iteration, Sorting & Copying.",
    questionCount: 200,
    topicCount: 11,
    status: "available",
    data: phase2Data
  },
  {
    id: 3,
    title: "Phase 3: Functions & Advanced Concepts",
    shortTitle: "Phase 3",
    subtitle: "240 Questions across 14 Topics",
    description: "Scope, LEGB, Closures, Decorators, Recursion, Type Hints, Functional Programming & Tricky Outputs.",
    questionCount: 240,
    topicCount: 14,
    status: "available",
    data: phase3Data
  },
  {
    id: 4,
    title: "Phase 4: Object-Oriented Programming (OOP)",
    shortTitle: "Phase 4",
    subtitle: "275 Questions across 16 Topics",
    description: "Classes, Objects, Constructors, Methods, Encapsulation, Inheritance, Polymorphism, Abstraction, MRO & super(), Magic Methods, Memory Management, Output Challenges & SDE Architecture.",
    questionCount: 275,
    topicCount: 16,
    status: "available",
    data: phase4Data
  },
  {
    id: 5,
    title: "Phase 5: Exception Handling",
    shortTitle: "Phase 5",
    subtitle: "232 Questions across 15 Topics",
    description: "try-except-else-finally, raise, Custom Exceptions, Exception Hierarchy, Chaining, Assertions, Context Managers, Tricky Outputs & SDE Scenarios.",
    questionCount: 232,
    topicCount: 15,
    status: "available",
    data: phase5Data
  },
  {
    id: 6,
    title: "Phase 6: File Handling and Modules",
    shortTitle: "Phase 6",
    subtitle: "240 Questions across 11 Topics",
    description: "File Handling, File Modes, Context Managers, Serialization (JSON & Pickle), Modules, Packages, Python Import System, Virtual Environments, Dependencies & SDE-2 Scenarios.",
    questionCount: 240,
    topicCount: 11,
    status: "available",
    data: phase6Data
  },
  {
    id: 7,
    title: "Phase 7: Advanced Python",
    shortTitle: "Phase 7",
    subtitle: "212 Questions across 14 Topics",
    description: "Iterators, Generators, Decorators, Context Managers, Descriptors, Metaclasses, Dynamic Code, Type Hints, Pattern Matching & Async Generators.",
    questionCount: 212,
    topicCount: 14,
    status: "available",
    data: phase7Data
  },
  {
    id: 8,
    title: "Phase 8: Memory Management & Python Internals",
    shortTitle: "Phase 8",
    subtitle: "240 Questions across 14 Topics",
    description: "Stack vs Heap, PyObject_HEAD, References & Aliasing, Mutability, Cyclic Garbage Collection, pymalloc & Arenas, String Interning, GIL & Multithreading, Bytecode & AST, and Profiling.",
    questionCount: 240,
    topicCount: 14,
    status: "available",
    data: phase8Data
  }
];
