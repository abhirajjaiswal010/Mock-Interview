export const category1 = {
    id: 201,
    title: "1. Programming Language Fundamentals",
    shortTitle: "Category 1",
    subtitle: "20 Core Concepts: Parameter Passing, Mutability, Copying, Typing & Evaluation",
    description: "Deep dive into universal computer science and programming fundamentals: Call by Value vs Reference vs Sharing, Shallow vs Deep Copy, Mutable vs Immutable, Typing systems, Scope vs Lifetime, Binding, and Functional concepts.",
    questionCount: 20,
    topicCount: 8,
    status: "available",
    data: {
      phase: "1. Programming Language Fundamentals",
      totalQuestions: 20,
      topics: [
        {
          id: 1,
          name: "Parameter Passing & Call Semantics",
          range: [1, 2],
          count: 3
        },
        {
          id: 2,
          name: "Memory, Copying & Mutability",
          range: [3, 4],
          count: 3
        },
        {
          id: 3,
          name: "Type Systems & Conversions",
          range: [5, 8],
          count: 4
        },
        {
          id: 4,
          name: "Compilation & Runtime Execution",
          range: [9, 9],
          count: 1
        },
        {
          id: 5,
          name: "Variables, Scope & Lifetime",
          range: [11, 13],
          count: 3
        },
        {
          id: 6,
          name: "Binding Mechanisms",
          range: [15, 16],
          count: 2
        },
        {
          id: 7,
          name: "Evaluation Strategies",
          range: [17, 18],
          count: 2
        },
        {
          id: 8,
          name: "Functional Programming Paradigms",
          range: [19, 20],
          count: 2
        }
      ],
      questions: [
        {
          id: 1,
          title: "Call by Value vs Call by Reference",
          topicId: 1,
          topicName: "Parameter Passing & Call Semantics",
          level: "Core Concept",
          answer: "\"In Call by Value, the function receives an independent copy of the actual argument's value in a separate memory slot. Any changes made to the parameter inside the function remain isolated to the function's local frame and never alter the caller's variable.\n\nIn Call by Reference, the function receives the actual memory reference (alias or memory address) of the variable passed by the caller. Any mutation or reassignment directly affects the caller's original variable in memory.\"\n\n| Feature | Call by Value | Call by Reference |\n| --- | --- | --- |\n| **Passed Entity** | An independent copy of the value/data | An alias / direct memory reference to the variable |\n| **Caller Variable Impact** | Cannot be modified through parameter assignment | Directly modified when parameter is reassigned or altered |\n| **Memory Overhead** | Requires memory allocation to store duplicate copy | Minimal overhead; passes only memory reference/pointer |\n| **Side Effects & Safety** | Safe against unintended side effects | High risk of unintended mutations in caller state |\n| **Primary Languages** | C (default), Go (default), Java (primitives) | C++ (via `&`), C# (via `ref`/`out`), Pascal (`var`) |\n\nIn modern programming, true Call by Reference is relatively rare; many modern languages use Call by Value where the value passed is an object reference (often termed Call by Sharing).",
          keyConcepts: "Value duplication, Memory alias, Isolated stack frames, Mutation side-effects, C++ reference syntax",
          code: "# Call by Value behavior demonstration (immutable primitive):\ndef update_number(n):\n    n = n + 10\n    print(f\"Inside function: n = {n}\")\n\nval = 5\nupdate_number(val)\nprint(f\"Outside function: val = {val} (unchanged)\")",
          output: "Inside function: n = 15\nOutside function: val = 5 (unchanged)"
        },
        {
          id: 2,
          title: "Call by Sharing / Object Reference",
          topicId: 1,
          topicName: "Parameter Passing & Call Semantics",
          level: "Core Concept",
          answer: "\"Call by Sharing (also known as Call by Object Reference or Pass by Assignment) is the parameter passing model used by Python, JavaScript, Java (for objects), and Ruby.\n\nUnder Call by Sharing, the function parameter receives a copy of the reference pointing to the object in heap memory. Because both the caller variable and the parameter point to the identical object:\n• In-place mutations (e.g. `list.append()`) mutate the caller's object.\n• Reassignments (e.g. `param = new_obj`) only rebind the local parameter variable and leave the caller's variable untouched.\"\n\n| Feature | Call by Value | Call by Reference | Call by Sharing (Object Reference) |\n| --- | --- | --- | --- |\n| **What is Passed?** | Copy of actual value | Memory alias of variable | Copy of object reference (pointer) |\n| **In-place Mutation** | Impossible (isolated copy) | Mutates caller variable | Mutates caller object (if mutable) |\n| **Reassignment Impact**| Affects local copy only | Mutates caller variable | Rebinds local name only; caller unaffected |\n| **Languages** | C, Go, Java primitives | C++ (`&`), C# (`ref`) | Python, JavaScript, Java (objects), Ruby |\n\nThis explains why in Python passing a list and appending modifies the original list, but assigning a new list inside the function does not change the caller's variable.",
          keyConcepts: "Pass by assignment, Reference copying, Heap aliasing, In-place mutation vs Rebinding, Python evaluation model",
          code: "def test_sharing(items, count):\n    items.append(99)       # In-place mutation -> reflects in caller!\n    items = [1, 2, 3]      # Reassignment -> only rebinds local parameter\n    count = 100            # Reassignment of immutable -> local only\n\nmy_list = [10, 20]\nmy_count = 5\ntest_sharing(my_list, my_count)\nprint(\"my_list:\", my_list)\nprint(\"my_count:\", my_count)",
          output: "my_list: [10, 20, 99]\nmy_count: 5"
        },
        {
          id: 3,
          title: "Shallow Copy vs Deep Copy",
          topicId: 2,
          topicName: "Memory, Copying & Mutability",
          level: "Core Concept",
          answer: "\"A Shallow Copy creates a brand-new outer container object, but populates it with references to the exact child elements found in the original compound structure. If a nested child is mutable, mutating it through either copy affects both.\n\nA Deep Copy creates a new container and recursively clones every nested object inside it down the entire object graph, resulting in two entirely independent structures in memory.\"\n\n| Feature | Shallow Copy | Deep Copy |\n| --- | --- | --- |\n| **Outer Container** | New object allocated | New object allocated |\n| **Nested Elements** | References to original child objects are copied | Child objects are recursively cloned |\n| **Nested Mutation** | Affects BOTH original and copied structures | Original remains completely unaffected |\n| **Time & Memory** | O(N) where N is top-level element count (very fast) | O(Total Nodes); traverses entire object graph |\n| **Cyclic References** | Handled natively (only copies top pointers) | Requires internal memo dictionary to prevent infinite recursion |\n| **Python Creation** | `copy.copy()`, `list.copy()`, `[:]`, `dict.copy()` | `copy.deepcopy()` |\n\nAlways use Deep Copy when dealing with nested mutable data structures (like matrices or JSON configs) that need independent modification.",
          keyConcepts: "copy.copy vs copy.deepcopy, Recursive cloning, Nested mutability, Memo dictionary, Object identity id()",
          code: "import copy\n\nmatrix = [[1, 2], [3, 4]]\nshallow = copy.copy(matrix)\ndeep = copy.deepcopy(matrix)\n\n# Mutate nested child list:\nmatrix[0].append(99)\n\nprint(\"Original: \", matrix)\nprint(\"Shallow:  \", shallow)  # Reflects nested mutation!\nprint(\"Deep:     \", deep)     # Completely independent!",
          output: "Original:  [[1, 2, 99], [3, 4]]\nShallow:   [[1, 2, 99], [3, 4]]\nDeep:      [[1, 2], [3, 4]]"
        },
        {
          id: 4,
          title: "Mutable vs Immutable",
          topicId: 2,
          topicName: "Memory, Copying & Mutability",
          level: "Core Concept",
          answer: "\"A Mutable object can have its internal state, contents, or elements modified after creation while maintaining its unique memory address (identity).\n\nAn Immutable object cannot be altered once created. Any operation that appears to modify an immutable object allocates and returns a completely new object in memory with a distinct memory address.\"\n\n| Feature | Mutable | Immutable |\n| --- | --- | --- |\n| **In-place Mutation** | Permitted (state changes in-place) | Prohibited (state cannot change) |\n| **Memory Address (`id`)**| Remains identical across mutations | Changes on modification (new allocation) |\n| **Thread Safety** | Inherently thread-unsafe; requires synchronization locks | Inherently thread-safe (read-only shared state) |\n| **Dictionary Keys & Sets**| Cannot be hashed (Unhashable) | Hashable if all internal elements are immutable |\n| **Python Types** | `list`, `dict`, `set`, `bytearray` | `int`, `float`, `str`, `tuple`, `frozenset`, `bytes` |\n| **Performance Trade-off**| Fast in-place updates without reallocation | Incurs allocation overhead for large string concatenations |\n\nImmutability eliminates side effects, makes concurrency trivial, and guarantees reliable dictionary lookups.",
          keyConcepts: "Object identity, In-place modification, Hashability __hash__, Thread safety, String interning",
          code: "# Mutable:\nlst = [1, 2]\norig_id = id(lst)\nlst.append(3)\nprint(f\"List mutated in-place: id changed? {id(lst) != orig_id}\")\n\n# Immutable:\ns = \"hello\"\norig_s_id = id(s)\ns += \" world\"\nprint(f\"String modified: id changed? {id(s) != orig_s_id}\")",
          output: "List mutated in-place: id changed? False\nString modified: id changed? True"
        },
        {
          id: 5,
          title: "Static vs Dynamic Typing",
          topicId: 3,
          topicName: "Type Systems & Conversions",
          level: "Core Concept",
          answer: "\"Static Typing means data types are checked and verified at compile-time before code execution. Variable types are fixed upon declaration or inference, and assigning incompatible types causes a compilation failure.\n\nDynamic Typing means data types are verified at runtime as expressions execute. Variables are simply symbolic names bound to values, and types belong to the runtime values rather than the variable names themselves.\"\n\n| Feature | Static Typing | Dynamic Typing |\n| --- | --- | --- |\n| **Type Checking Phase** | Compile-time | Runtime |\n| **Variable Binding** | Bound to a fixed type (e.g. `int x = 5;`) | Bound to any value (`x = 5`, then `x = 'hi'`) |\n| **Bug Detection** | Type mismatch bugs detected immediately by compiler | Type mismatch bugs surface as runtime exceptions |\n| **Execution Speed** | Faster; compiler optimizes machine layout & avoids checks | Slower; runtime type lookups and boxing/unboxing |\n| **Refactoring & Tooling** | Excellent IDE code analysis, navigation & autocompletion | Requires comprehensive test suites to catch type regressions |\n| **Languages** | Java, C, C++, Rust, Go, TypeScript | Python, JavaScript, Ruby, PHP |\n\nLanguages like Python now offer type hints (`typing` module) to provide static analysis via tools like mypy while retaining dynamic execution.",
          keyConcepts: "Compile-time validation, Runtime type tags, Polymorphism, Machine code optimization, Type hints",
          code: "# Dynamic Typing in Python: variable type changes freely\nx = 42\nprint(f\"x is {type(x).__name__}: {x}\")\n\nx = \"Interview Ready\"\nprint(f\"x is now {type(x).__name__}: {x}\")\n\nx = [\"apple\", \"banana\"]\nprint(f\"x is now {type(x).__name__}: {x}\")",
          output: "x is int: 42\nx is now str: Interview Ready\nx is now list: ['apple', 'banana']"
        },
        {
          id: 6,
          title: "Strong vs Weak Typing",
          topicId: 3,
          topicName: "Type Systems & Conversions",
          level: "Core Concept",
          answer: "\"Strong Typing strictly enforces type boundaries and forbids implicit operations between incompatible types. If an operation violates type compatibility, the runtime or compiler throws an explicit type error.\n\nWeak Typing allows implicit type coercion across disparate types to fulfill an expression (e.g., automatically converting a number to a string to perform addition/concatenation).\n\n*Note:* Strong/Weak is orthogonal to Static/Dynamic! Python is dynamic AND strongly typed; JavaScript is dynamic AND weakly typed; C is static AND weakly typed.\"\n\n| Feature | Strong Typing | Weak Typing |\n| --- | --- | --- |\n| **Type Enforcement** | Strict; rejects implicit coercion between mismatched types | Lenient; silently coerces types to satisfy operations |\n| `'5' + 5` Result | Raises explicit `TypeError` | Evaluates to `'55'` (silently coerces int to string) |\n| **Type Safety** | High; minimizes unintended silent conversions | Lower; silent type conversions can cause subtle bugs |\n| **Bug Visibility** | Fails fast with clear stack trace | May produce unintended values that propagate silently |\n| **Languages** | Python, Java, Rust, Haskell, Ruby | JavaScript, C, PHP, Perl |\n\nIn Python, you must explicitly convert types: `int('5') + 5` or `'5' + str(5)`.",
          keyConcepts: "Type safety, Implicit coercion, Silent bugs vs Fast failure, Orthogonality to static/dynamic",
          code: "# Python enforces strong typing:\ntry:\n    result = \"Score: \" + 100\nexcept TypeError as e:\n    print(f\"TypeError caught: {e}\")\n\n# Explicit conversion required:\nresult = \"Score: \" + str(100)\nprint(f\"Explicit conversion: {result}\")",
          output: "TypeError caught: can only concatenate str (not \"int\") to str\nExplicit conversion: Score: 100"
        },
        {
          id: 7,
          title: "Implicit vs Explicit Type Conversion",
          topicId: 3,
          topicName: "Type Systems & Conversions",
          level: "Core Concept",
          answer: "\"Implicit Type Conversion (also known as automatic conversion or widening) occurs automatically when the language compiler or interpreter converts an operand to a compatible type without any developer intervention.\n\nExplicit Type Conversion (type casting) requires the programmer to manually invoke a conversion function or casting syntax to change a value's data type.\"\n\n| Feature | Implicit Conversion | Explicit Conversion |\n| --- | --- | --- |\n| **Initiated By** | Language runtime / compiler automatically | Developer manually in source code |\n| **Intent & Clarity** | Hidden; happens behind the scenes | Intentional, clear, and visible in code reviews |\n| **Data Loss Risk** | Low (widening: `int` promoted to `float`) | Possible truncation (e.g. converting `float` to `int` drops decimals) |\n| **Syntax** | Normal operators (e.g. `10 + 2.5`) | Conversion functions (e.g. `int('42')`, `float(10)`) |\n| **Example** | `5 + 3.2` automatically produces `8.2` | `int(9.99)` explicitly yields `9` |\n\nExplicit conversion is preferred for readability and avoiding subtle precision loss.",
          keyConcepts: "Type promotion, Widening vs Narrowing, Truncation, Explicit casting functions, Precision",
          code: "# Implicit: Python automatically promotes int to float:\na = 7\nb = 2.5\nsum_val = a + b\nprint(f\"Implicit: {a} + {b} = {sum_val} (Type: {type(sum_val).__name__})\")\n\n# Explicit: Programmer explicitly casts float to int (truncating decimal):\nflt = 9.99\ncasted_int = int(flt)\nprint(f\"Explicit: int({flt}) = {casted_int} (Type: {type(casted_int).__name__})\")",
          output: "Implicit: 7 + 2.5 = 9.5 (Type: float)\nExplicit: int(9.99) = 9 (Type: int)"
        },
        {
          id: 8,
          title: "Type Casting vs Type Coercion",
          topicId: 3,
          topicName: "Type Systems & Conversions",
          level: "Core Concept",
          answer: "\"While often used interchangeably in everyday conversation, they have precise computer science definitions:\n\nType Casting refers to explicit, developer-directed conversion where code is written to convert an entity from one type to another (e.g. `(int)x` or `Number('12')`).\n\nType Coercion refers to implicit, compiler- or runtime-directed conversion where the language automatically converts an unexpected type to an expected type during expression evaluation.\"\n\n| Feature | Type Casting | Type Coercion |\n| --- | --- | --- |\n| **Nature** | Explicit (manual) | Implicit (automatic) |\n| **Control** | Full developer control and intent | Language runtime / interpreter rules |\n| **Transparency** | Highly visible in code | Implicit; occurs behind the scenes |\n| **Debugging** | Traceable; developer specified the conversion | Can introduce subtle bugs when coercion rules surprise developers |\n| **Examples** | `int('100')`, `str(25)`, `(double)4` | `\"Value: \" + 10` in JavaScript or `5 + 2.0` in Python |\n\nType casting is intentional and explicit; type coercion is automatic and implicit.",
          keyConcepts: "Explicit casting, Implicit coercion, Language coercion rules, Type reinterpretation",
          code: "# Type Casting (explicit):\nraw_input = \"450\"\nparsed_int = int(raw_input)\nprint(f\"Type Casting: casted '{raw_input}' to {parsed_int} ({type(parsed_int).__name__})\")\n\n# Type Coercion (implicit promotion):\ncoerced = 100 + 0.5  # 100 coerced to float 100.0\nprint(f\"Type Coercion: 100 promoted to {coerced} ({type(coerced).__name__})\")",
          output: "Type Casting: casted '450' to 450 (int)\nType Coercion: 100 promoted to 100.5 (float)"
        },
        {
          id: 9,
          title: "Compile-time vs Runtime",
          topicId: 4,
          topicName: "Compilation & Runtime Execution",
          level: "Core Concept",
          answer: "\"Compile-time is the phase before program execution where source code is analyzed, syntax-checked, statically typed, and translated into machine instructions or intermediate bytecode.\n\nRuntime is the active execution phase where the compiled instructions or bytecode run in memory on the CPU or virtual machine (such as the JVM or Python PVM).\"\n\n| Feature | Compile-time | Runtime |\n| --- | --- | --- |\n| **Phase** | Source code translation prior to execution | Active program execution in system memory |\n| **Errors Detected** | Syntax errors, static type mismatches, missing imports | ZeroDivisionError, IndexError, NullPointer, Network timeouts |\n| **Environment** | Compiler (`javac`, `gcc`, `rustc`, Python byte-compiler) | CPU / Virtual Machine / Interpreter (JVM, Python PVM, V8) |\n| **Memory Allocation**| Static data layout, constant tables | Dynamic heap allocation, call stack frames, OS handles |\n| **Performance Impact**| One-time build overhead | Real-time performance experienced by end users |\n\nIn Python, compilation to bytecode (`.pyc`) occurs automatically before execution begins in the Python Virtual Machine.",
          keyConcepts: "Compilation phase, Execution phase, Bytecode, Virtual machine, Syntax errors vs Exceptions",
          code: "import dis\n\ndef calculate(a, b):\n    return (a * 2) + b\n\n# Compile-time output: Bytecode disassembly\nprint(\"=== Bytecode (Compiled Ahead of Execution) ===\")\ndis.dis(calculate)\n\n# Runtime execution:\nprint(\"\\n=== Runtime Execution ===\")\nprint(\"calculate(3, 4) =\", calculate(3, 4))",
          output: "=== Bytecode (Compiled Ahead of Execution) ===\n  2           0 LOAD_FAST                0 (a)\n              2 LOAD_CONST               1 (2)\n              4 BINARY_MULTIPLY\n              6 LOAD_FAST                1 (b)\n              8 BINARY_ADD\n             10 RETURN_VALUE\n\n=== Runtime Execution ===\ncalculate(3, 4) = 10"
        },
        {
          id: 10,
          title: "Pass by Value vs Pass by Pointer",
          topicId: 1,
          topicName: "Parameter Passing & Call Semantics",
          level: "Core Concept",
          answer: "\"Pass by Value passes a complete duplicate copy of the argument data to the function. Any modification affects only the function's local stack frame and never alters the caller's variable.\n\nPass by Pointer passes a copy of the variable's memory address. By dereferencing the pointer (`*ptr`), the function can directly read and mutate the exact memory cell where the caller's variable is stored.\"\n\n| Feature | Pass by Value | Pass by Pointer |\n| --- | --- | --- |\n| **Argument Passed** | A full copy of the value/struct | A memory address pointer (typically 4 or 8 bytes) |\n| **Dereferencing** | Not applicable | Required (`*p`) to access/modify underlying memory |\n| **Caller Mutation** | Caller variable remains protected | Caller variable can be mutated through dereference |\n| **Nullability** | Cannot be null | Pointers can be `NULL`/`nil`, requiring null checks |\n| **Performance** | Expensive for large structs (copies all bytes) | Extremely fast; copies only pointer address |\n| **Languages** | C, Go, Java primitives | C, C++, Go |\n\nIn Go and C, passing large structs by pointer avoids heavy copying overhead while allowing functions to modify caller state.",
          keyConcepts: "Pointer dereferencing, Memory addresses, Stack copying overhead, Null safety, Go/C semantics",
          code: "# Python simulates pass-by-pointer using a single-element list wrapper:\ndef pass_by_value(x):\n    x = 999  # Local reassignment only\n\ndef pass_by_pointer_sim(ptr_cell):\n    ptr_cell[0] = 999  # Dereferencing / modifying target memory cell\n\nnum = 10\npass_by_value(num)\nprint(\"After pass_by_value:          \", num)\n\ncell = [10]  # Simulates memory pointer box\npass_by_pointer_sim(cell)\nprint(\"After pass_by_pointer_sim:    \", cell[0])",
          output: "After pass_by_value:           10\nAfter pass_by_pointer_sim:     999"
        },
        {
          id: 11,
          title: "Variable vs Constant",
          topicId: 5,
          topicName: "Variables, Scope & Lifetime",
          level: "Core Concept",
          answer: "\"A Variable is a named storage location whose bound value can be modified or reassigned multiple times during program execution.\n\nA Constant is an identifier bound to a fixed value that cannot be altered or reassigned after its initial definition. Compilers can optimize constants through constant folding, inlining, and dead-code elimination.\"\n\n| Feature | Variable | Constant |\n| --- | --- | --- |\n| **Reassignment** | Can be reassigned anytime | Immutable after initialization; cannot be reassigned |\n| **Intent** | Represents evolving state | Represents fixed invariants (e.g. `PI`, `MAX_RETRIES`) |\n| **Compiler Optimization** | Limited (must account for mutations) | High (constant folding, immediate values in assembly) |\n| **Naming Convention** | lowercase or camelCase (e.g. `user_count`) | UPPER_SNAKE_CASE (e.g. `MAX_BUFFER_SIZE`) |\n| **Enforcement** | Modifiable in all languages | Enforced by compiler (`const`, `final`) or convention (Python) |\n\nIn Python, PEP 8 uppercase naming (`MAX_RETRIES = 5`) and `typing.Final` communicate constant semantics to linters and type checkers.",
          keyConcepts: "Invariant values, State mutability, Constant folding, typing.Final, PEP 8 uppercase convention",
          code: "from typing import Final\n\n# Variable: changes during execution\nscore = 10\nscore += 5\nprint(f\"Variable score: {score}\")\n\n# Constant: invariant value indicated by Final hint & convention\nMAX_CONNECTIONS: Final = 100\nprint(f\"Constant MAX_CONNECTIONS: {MAX_CONNECTIONS}\")",
          output: "Variable score: 15\nConstant MAX_CONNECTIONS: 100"
        },
        {
          id: 12,
          title: "Local vs Global vs Instance Variables",
          topicId: 5,
          topicName: "Variables, Scope & Lifetime",
          level: "Core Concept",
          answer: "\"Variables differ fundamentally based on where they are declared, how long they live, and what parts of the system can access them:\n\n• Local Variable: Declared inside a function or block; accessible only within that block; destroyed when the block finishes.\n• Global Variable: Declared at top module level; accessible throughout the entire file/module; lives for the duration of the process.\n• Instance Variable: Bound to a specific instance of a class (`self.x`); unique to each object; lives as long as the object instance exists in heap memory.\"\n\n| Feature | Local Variable | Global Variable | Instance Variable |\n| --- | --- | --- | --- |\n| **Scope** | Function / block only | Entire module / program | Bound to object instance (`self`) |\n| **Lifetime** | Duration of function execution | Duration of program execution | Lifetime of object in heap |\n| **Memory Location**| Call stack frame | Module global namespace | Heap memory inside object dictionary |\n| **Coupling & Risk**| Zero; perfectly encapsulated | High; hidden coupling and race conditions | Low; encapsulated within class boundary |\n| **Syntax** | `x = 10` (inside def) | `global_x = 10` (top level) | `self.x = 10` (inside class) |\n\nBest practice: Prefer local and instance variables; avoid global mutable state.",
          keyConcepts: "Call stack vs Heap, Module namespace, Encapsulation, Object attributes, Shared state risks",
          code: "APP_ENV = \"production\"  # Global variable\n\nclass DatabaseService:\n    def __init__(self, host):\n        self.host = host  # Instance variable\n\n    def connect(self):\n        port = 5432  # Local variable\n        print(f\"Connecting to {self.host}:{port} in {APP_ENV} mode\")\n\nsrv1 = DatabaseService(\"db1.internal\")\nsrv2 = DatabaseService(\"db2.internal\")\nsrv1.connect()\nsrv2.connect()",
          output: "Connecting to db1.internal:5432 in production mode\nConnecting to db2.internal:5432 in production mode"
        },
        {
          id: 13,
          title: "Scope vs Lifetime",
          topicId: 5,
          topicName: "Variables, Scope & Lifetime",
          level: "Core Concept",
          answer: "\"Scope (visibility) is a textual/spatial property of source code determining where an identifier can be referenced.\n\nLifetime (extent/duration) is a temporal/runtime property determining the actual time period during which a variable exists in memory.\n\n*Critical Distinction:* A variable can be out of scope while still alive in memory! For example, when a function invokes another function, or in closures where an inner function captures an outer variable that has gone out of scope.\"\n\n| Feature | Scope | Lifetime |\n| --- | --- | --- |\n| **Nature** | Spatial (code text region of visibility) | Temporal (duration of existence in memory) |\n| **Defined By** | Blocks, functions, lexical scoping rules | Allocation until deallocation / Garbage Collection |\n| **Perspective** | Compile-time / Lexical analysis | Runtime memory management |\n| **Classic Example**| Closures: outer local variable leaves scope, but its lifetime is preserved in the closure cell |\n| **Rules** | LEGB (Local, Enclosing, Global, Builtin) | Stack unwinding, Reference counting, GC cycle tracing |\n\nClosures prove that scope and lifetime are separate concepts in programming languages.",
          keyConcepts: "Lexical scoping, Runtime lifetime, Closures, Garbage collection, Enclosing scope",
          code: "def make_multiplier(factor):\n    # 'factor' scope is strictly inside make_multiplier\n    def multiply(x):\n        return x * factor  # 'factor' lifetime extended via closure!\n    return multiply\n\ndouble = make_multiplier(2)\n# make_multiplier has finished execution! 'factor' is OUT OF SCOPE here.\n# But 'factor' is still ALIVE inside double's closure!\nprint(\"double(5) =\", double(5))\nprint(\"double(12) =\", double(12))",
          output: "double(5) = 10\ndouble(12) = 24"
        },
        {
          id: 14,
          title: "Value Types vs Reference Types",
          topicId: 2,
          topicName: "Memory, Copying & Mutability",
          level: "Core Concept",
          answer: "\"Value Types store their actual data value directly in the variable's memory space (usually on the call stack). Assigning a value type to another variable creates an independent copy of the data.\n\nReference Types store a memory reference (address pointer) that points to the actual data located on the heap. Assigning a reference type copies only the pointer, meaning both variables reference the identical underlying heap object.\"\n\n| Feature | Value Types | Reference Types |\n| --- | --- | --- |\n| **Storage Location** | Stack (direct memory slot) | Heap (variable on stack stores heap address) |\n| **Assignment** | Copies actual value (independent) | Copies pointer reference (shared target) |\n| **Mutation Impact** | Modifying one never affects the other | Modifying the object affects all references |\n| **Memory Deallocation**| Popped off stack automatically on return | Managed by Garbage Collector / Ref Counting |\n| **Examples (C#/Java)** | `int`, `float`, `bool`, `char`, `struct` | `class`, `String`, `Array`, `List`, `object` |\n\nIn Python, all variables hold object references, but immutable objects mimic value-type behavior because modifications rebind new references.",
          keyConcepts: "Stack vs Heap allocation, Reference aliasing, Garbage collection, Copy semantics",
          code: "# Simulating Value vs Reference behavior in Python:\n\n# 1. Mimics Value Type (Immutable rebinding):\na = 100\nb = a\nb += 50\nprint(f\"Value-like: a = {a}, b = {b} (Independent)\")\n\n# 2. Reference Type (Shared heap object):\nlist_a = [1, 2, 3]\nlist_b = list_a  # Copies reference only!\nlist_b.append(4)\nprint(f\"Reference: list_a = {list_a}, list_b = {list_b} (Shared memory)\")",
          output: "Value-like: a = 100, b = 150 (Independent)\nReference: list_a = [1, 2, 3, 4], list_b = [1, 2, 3, 4] (Shared memory)"
        },
        {
          id: 15,
          title: "Early Binding vs Late Binding",
          topicId: 6,
          topicName: "Binding Mechanisms",
          level: "Core Concept",
          answer: "\"Binding refers to associating an identifier (such as a method call or variable name) with its corresponding implementation or memory address.\n\nEarly Binding (Static Binding) resolves the method or function call at compile-time before execution begins.\n\nLate Binding (Dynamic Binding) delays method resolution until runtime, determining which method implementation to execute based on the actual object type at execution time.\"\n\n| Feature | Early Binding | Late Binding |\n| --- | --- | --- |\n| **Resolution Time** | Compile-time | Runtime |\n| **Performance** | Faster (direct jumps, inlining possible) | Slight overhead (lookup tables, dynamic dispatch) |\n| **Flexibility** | Rigid; bound to fixed types | Highly flexible; enables runtime polymorphism & duck typing |\n| **Error Detection** | Missing methods caught at compile-time | Missing methods raise runtime exceptions (`AttributeError`) |\n| **Mechanism** | Static addresses, direct symbol linking | Virtual method tables (vtables), dictionary dispatch |\n\nPython uses late binding for almost everything, including attribute lookups and closures.",
          keyConcepts: "Dynamic dispatch, Vtables, Compile-time linking, Duck typing, Runtime resolution",
          code: "class Dog:\n    def speak(self):\n        return \"Woof!\"\n\nclass Cat:\n    def speak(self):\n        return \"Meow!\"\n\n# Late Binding: animal.speak() is resolved dynamically at runtime:\ndef animal_sound(animal):\n    return animal.speak()\n\nprint(\"Dog:\", animal_sound(Dog()))\nprint(\"Cat:\", animal_sound(Cat()))",
          output: "Dog: Woof!\nCat: Meow!"
        },
        {
          id: 16,
          title: "Static Binding vs Dynamic Binding",
          topicId: 6,
          topicName: "Binding Mechanisms",
          level: "Core Concept",
          answer: "\"Static Binding occurs when the compiler binds a method call directly to code based on the declared static type of the reference variable (e.g. `final`, `private`, or `static` methods in Java/C++).\n\nDynamic Binding occurs when the method call is resolved at runtime based on the actual instantiated object's class rather than the declared reference type, enabling true object-oriented polymorphism.\"\n\n| Feature | Static Binding | Dynamic Binding |\n| --- | --- | --- |\n| **Bound By** | Declared compile-time reference type | Actual instantiated runtime object |\n| **Polymorphism** | Compile-time polymorphism (overloading) | Runtime polymorphism (overriding) |\n| **Keywords** | `static`, `final`, `private` (Java) | `virtual`, `override` (C++/C#) |\n| **Lookup Speed** | Direct call (zero lookup overhead) | Vtable / dispatch table lookup |\n| **Extensibility** | Fixed at build-time | Extensible via subclasses and plugins |\n\nDynamic binding is what allows a base class reference `Shape s = new Circle()` to correctly call `Circle.draw()`.",
          keyConcepts: "Method overriding vs overloading, Virtual method tables, Runtime polymorphism, Static type vs Runtime object",
          code: "class Base:\n    def show(self):\n        return \"Base show method\"\n\nclass Derived(Base):\n    def show(self):\n        return \"Derived overridden show method (Dynamic Binding)\"\n\n# Dynamic binding in action:\nobj: Base = Derived()\nprint(obj.show())",
          output: "Derived overridden show method (Dynamic Binding)"
        },
        {
          id: 17,
          title: "Short-circuit vs Normal Evaluation",
          topicId: 7,
          topicName: "Evaluation Strategies",
          level: "Core Concept",
          answer: "\"Short-circuit Evaluation stops evaluating boolean expressions as soon as the outcome is deterministically known:\n• In `A and B`: If `A` is false, `B` is never evaluated because the result must be false.\n• In `A or B`: If `A` is true, `B` is never evaluated because the result must be true.\n\nNormal (Full/Eager) Evaluation evaluates every operand unconditionally, regardless of whether preceding operands already determine the overall result.\"\n\n| Feature | Short-circuit Evaluation | Normal / Eager Evaluation |\n| --- | --- | --- |\n| **Evaluation Rule** | Halts as soon as boolean outcome is guaranteed | Evaluates every operand unconditionally |\n| **Safety Pattern** | Essential for guard checks: `obj and obj.run()` | Would crash on null dereference / division by zero |\n| **Performance** | Skips expensive function calls and queries | Incurs performance cost of every operand |\n| **Operators** | `and`, `or`, `&&`, `||` | `&`, `|` (bitwise or eager boolean operators) |\n\nShort-circuit evaluation is commonly used as a safe guard against `None`/`null` errors.",
          keyConcepts: "Guard clauses, Boolean logic, Lazy operand evaluation, Null checks, Bitwise vs Logical operators",
          code: "def expensive_db_check():\n    print(\"Running heavy database check...\")\n    return True\n\n# 1. Short-circuit: first operand is False, expensive_db_check NEVER runs!\nprint(\"--- Test 1 (False and ...) ---\")\nres1 = False and expensive_db_check()\nprint(\"Result 1:\", res1)\n\n# 2. Short-circuit: first operand is True, expensive_db_check NEVER runs!\nprint(\"\\n--- Test 2 (True or ...) ---\")\nres2 = True or expensive_db_check()\nprint(\"Result 2:\", res2)",
          output: "--- Test 1 (False and ...) ---\nResult 1: False\n\n--- Test 2 (True or ...) ---\nResult 2: True"
        },
        {
          id: 18,
          title: "Eager vs Lazy Evaluation",
          topicId: 7,
          topicName: "Evaluation Strategies",
          level: "Core Concept",
          answer: "\"Eager Evaluation (strict evaluation) computes an expression and allocates its memory as soon as it is bound to a variable or statement.\n\nLazy Evaluation (call-by-need / deferred execution) postpones computing an expression until its value is explicitly consumed or requested by the program.\"\n\n| Feature | Eager Evaluation | Lazy Evaluation |\n| --- | --- | --- |\n| **Computation Time** | Computed immediately upon declaration | Deferred until value is explicitly consumed |\n| **Memory Consumption**| High; holds entire computed dataset in memory | Minimal; computes and retains one item at a time |\n| **Infinite Sequences** | Impossible (causes infinite loops / OutOfMemory) | Fully supported (computes elements on demand) |\n| **Unused Computations**| Wasted CPU work if values are never used | Zero waste; never computes unused values |\n| **Python Examples** | List comprehensions `[x for x in r]` | Generator expressions `(x for x in r)`, `range()` |\n\nLazy evaluation is critical for big data processing, streaming pipelines, and infinite sequences.",
          keyConcepts: "Generators, Deferred execution, Memory optimization, Infinite data streams, Stream processing",
          code: "import sys\n\n# Eager evaluation: computes all 1,000,000 numbers in memory immediately\neager_list = [x for x in range(1_000_000)]\nprint(f\"Eager list memory: {sys.getsizeof(eager_list):,} bytes\")\n\n# Lazy evaluation: generator computes items one by one on demand\nlazy_gen = (x for x in range(1_000_000))\nprint(f\"Lazy generator memory: {sys.getsizeof(lazy_gen):,} bytes\")\nprint(\"First value generated:\", next(lazy_gen))\nprint(\"Second value generated:\", next(lazy_gen))",
          output: "Eager list memory: 8,448,728 bytes\nLazy generator memory: 200 bytes\nFirst value generated: 0\nSecond value generated: 1"
        },
        {
          id: 19,
          title: "Side Effects vs Pure Functions",
          topicId: 8,
          topicName: "Functional Programming Paradigms",
          level: "Core Concept",
          answer: "\"A Pure Function is a function that satisfies two core functional programming principles:\n1. Deterministic: Given the exact same inputs, it always returns the exact same output.\n2. No Side Effects: It does not read or mutate any state outside its local scope (no mutating globals, no altering input arguments, no file/network I/O, no console output).\n\nA Side Effect is any observable interaction with the outside environment beyond computing and returning a value (e.g. modifying global state, writing to a database, updating a passed mutable parameter).\"\n\n| Feature | Pure Function | Function with Side Effects |\n| --- | --- | --- |\n| **Determinism** | 100% deterministic (`f(x)` always yields same result) | May yield different results based on external state |\n| **External State Mutation**| Never mutates external variables or arguments | Modifies globals, input parameters, or files |\n| **Memoization / Caching** | Completely safe to cache results | Unsafe to cache (state changes would be missed) |\n| **Testability** | Trivially easy to unit test without mocks | Requires mocking databases, files, and global state |\n| **Thread Safety** | Inherently thread-safe (no shared mutable state) | Prone to race conditions and concurrency deadlocks |\n\nFunctional architectures isolate side effects to the boundaries of the system while keeping business logic pure.",
          keyConcepts: "Referential transparency, Determinism, External state mutation, Thread safety, Memoization",
          code: "# Pure Function: purely calculates result based on arguments\ndef add_pure(a, b):\n    return a + b\n\n# Impure Function: alters external state (side effect)\ntotal = 0\ndef add_impure(val):\n    global total\n    total += val  # Side effect: mutating global variable\n    return total\n\nprint(\"Pure call 1:  \", add_pure(5, 10))\nprint(\"Pure call 2:  \", add_pure(5, 10))  # Exactly identical\n\nprint(\"Impure call 1:\", add_impure(5))\nprint(\"Impure call 2:\", add_impure(5))  # Returns 10 (different output!)",
          output: "Pure call 1:   15\nPure call 2:   15\nImpure call 1: 5\nImpure call 2: 10"
        },
        {
          id: 20,
          title: "First-class Functions vs Higher-order Functions",
          topicId: 8,
          topicName: "Functional Programming Paradigms",
          level: "Core Concept",
          answer: "\"First-class Functions is a programming language property where functions are treated as first-class citizens. They can be assigned to variables, stored in data structures, passed as arguments, and returned from other functions just like numbers or strings.\n\nHigher-order Functions is a specific function classification: a function is higher-order if it accepts one or more functions as arguments, returns a function as its result, or both.\n\n*Summary:* Having first-class functions in a language is what makes higher-order functions possible!\"\n\n| Feature | First-class Functions | Higher-order Functions |\n| --- | --- | --- |\n| **Concept Type** | Language feature / capability | Function design pattern |\n| **Definition** | Functions treated as ordinary values | Functions that take or return other functions |\n| **Capabilities** | Assign to variables, pass into lists, return from defs | Compose behaviors, decorate, filter, and map |\n| **Examples in Python** | Assigning `f = print`, storing funcs in dict | `map()`, `filter()`, `sorted(key=...)`, decorators |\n\nIn Python, functions are full objects instances of `function`, making Python both a first-class function language and rich in higher-order function capabilities.",
          keyConcepts: "Functions as values, Higher-order functions, Callbacks, Decorators, Function composition",
          code: "# 1. First-class function: stored in variable\ndef shout(text):\n    return text.upper() + \"!\"\n\ngreet_fn = shout  # Assigned to variable\nprint(\"First-class assignment:\", greet_fn(\"welcome\"))\n\n# 2. Higher-order function: accepts another function as parameter\ndef process_items(items, transform_func):\n    return [transform_func(item) for item in items]\n\nresults = process_items([\"python\", \"javascript\", \"golang\"], shout)\nprint(\"Higher-order result:   \", results)",
          output: "First-class assignment: WELCOME!\nHigher-order result:    ['PYTHON!', 'JAVASCRIPT!', 'GOLANG!']"
        }
      ]
    }
  };
