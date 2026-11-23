export const category2 =   {
    id: 202,
    title: "2. Memory Management & Runtime Internals",
    shortTitle: "Category 2",
    subtitle: "20 Core Concepts: Stack vs Heap, GC Algorithms, Leaks, Interning & JVM/Python Internals",
    description: "Deep dive into memory architectures: Stack vs Heap, Allocation models, Garbage Collection algorithms, Leaks & Fragmentation, Object lifecycle, and JVM & Python runtime memory internals.",
    questionCount: 20,
    topicCount: 6,
    status: "available",
    data: {
      phase: "2. Memory Management & Runtime Internals",
      totalQuestions: 20,
      topics: [
        {
          id: 1,
          name: "Memory Architecture & Allocation",
          range: [21, 23],
          count: 4
        },
        {
          id: 2,
          name: "Pointers, References & Copying",
          range: [24, 26],
          count: 3
        },
        {
          id: 3,
          name: "Garbage Collection & Lifecycle",
          range: [27, 29],
          count: 4
        },
        {
          id: 4,
          name: "Memory Hazards & Diagnostics",
          range: [30, 32],
          count: 3
        },
        {
          id: 5,
          name: "Runtime Optimization & Analysis",
          range: [34, 38],
          count: 3
        },
        {
          id: 6,
          name: "Virtual Machine Internals (JVM & Python)",
          range: [35, 40],
          count: 3
        }
      ],
      questions: [
        {
          id: 21,
          title: "Stack vs Heap Memory",
          topicId: 1,
          topicName: "Memory Architecture & Allocation",
          level: "Core Concept",
          answer: "\"Stack Memory is used for static and short-term memory allocation. It stores active stack frames containing local primitive variables, method arguments, and reference pointers in a strict Last-In-First-Out (LIFO) order. Allocation and deallocation are extremely fast because they simply adjust the CPU stack pointer register.\n\nHeap Memory is used for dynamic, long-term memory allocation where complex objects, collections, and class instances reside. It is globally accessible across threads, requires dynamic tracking, and is managed by automatic Garbage Collection or manual free/delete.\"\n\n| Feature | Stack Memory | Heap Memory |\n| --- | --- | --- |\n| **Allocation Order** | Strict LIFO (Last-In-First-Out) via stack frames | Arbitrary / Dynamic layout throughout heap space |\n| **Access Speed** | Blazing fast (contiguous CPU cache & stack pointer increment) | Slower (pointer indirection, non-contiguous memory, paging) |\n| **Allocation & Free** | Automatic upon function call and return | Managed by Garbage Collector (or manual `malloc`/`free`) |\n| **Variable Scope** | Local to current executing thread and function frame | Globally accessible across all threads holding references |\n| **Size Limitations** | Fixed and small (typically 1MB to 8MB); risks StackOverflow | Large (limited only by physical RAM and OS virtual memory) |\n| **Fragmentation** | Zero fragmentation (contiguous stack push/pop) | Prone to memory fragmentation over time |",
          keyConcepts: "LIFO call stack, Heap allocation, Pointer indirection, StackOverflowError, Cache locality",
          code: "# Local variables live in stack frame; object data lives in heap:\ndef create_user(user_id):\n    # 'user_id' & 'profile' variable references reside on Stack\n    # The dictionary {'id': ..., 'data': ...} is allocated in Heap\n    profile = {\"id\": user_id, \"data\": [1, 2, 3]}\n    return profile\n\nu = create_user(101)\nprint(\"User object allocated on heap:\", u)",
          output: "User object allocated on heap: {'id': 101, 'data': [1, 2, 3]}"
        },
        {
          id: 22,
          title: "Static vs Dynamic Memory Allocation",
          topicId: 1,
          topicName: "Memory Architecture & Allocation",
          level: "Core Concept",
          answer: "\"Static Memory Allocation occurs before runtime (during compile-time or program startup). Memory is reserved in fixed segments (Data Segment or BSS) for global variables, static fields, and code constants. The size and location remain constant for the entire execution duration.\n\nDynamic Memory Allocation occurs at runtime on the Heap as the program requests memory on demand (via operators like `new` or `malloc`). The size can grow or shrink dynamically, and memory is reclaimed when no longer needed.\"\n\n| Feature | Static Allocation | Dynamic Allocation |\n| --- | --- | --- |\n| **Allocation Timing** | Compile-time / Program load time | Runtime (on-demand during program execution) |\n| **Memory Location** | Data / BSS Segment (or Stack for fixed locals) | Heap Memory |\n| **Size Flexibility** | Fixed; cannot change after initialization | Flexible; can grow, shrink, or reallocate dynamically |\n| **Lifetime** | Persists throughout entire program process | Dynamic; exists until freed or garbage collected |\n| **Efficiency** | Zero runtime allocation overhead | Incurs runtime allocation and GC tracking overhead |",
          keyConcepts: "Compile-time sizing, Heap allocation, Data/BSS segment, Dynamic arrays, Realloc",
          code: "# Dynamic memory allocation: list grows dynamically on heap at runtime\ndynamic_storage = []\nfor i in range(5):\n    dynamic_storage.append(i * 10)\n\nprint(\"Dynamically allocated elements:\", dynamic_storage)",
          output: "Dynamically allocated elements: [0, 10, 20, 30, 40]"
        },
        {
          id: 23,
          title: "Memory Allocation vs Deallocation",
          topicId: 1,
          topicName: "Memory Architecture & Allocation",
          level: "Core Concept",
          answer: "\"Memory Allocation is the process of requesting and reserving an unused block of memory from the operating system or runtime memory manager to store program data or objects.\n\nMemory Deallocation is the process of releasing previously allocated memory back to the free memory pool so that it can be reused. Failing to deallocate leads to Memory Leaks, while prematurely deallocating causes Dangling Pointers or Use-After-Free vulnerabilities.\"\n\n| Feature | Memory Allocation | Memory Deallocation |\n| --- | --- | --- |\n| **Primary Goal** | Reserve memory space for new objects/data | Reclaim unused space to prevent memory exhaustion |\n| **Operation in C/C++** | `malloc()`, `calloc()`, `new` | `free()`, `delete`, `delete[]` |\n| **Managed Runtimes** | Object instantiation (`obj = MyClass()`) | Handled automatically by Garbage Collector / Ref Counting |\n| **Risk on Failure** | `OutOfMemoryError` / NULL pointer return | Memory Leak (forgotten free) or Dangling Pointer (premature free) |\n| **Performance Impact**| Searching free lists, pool allocation | Sweeping, coalescing free chunks, updating headers |",
          keyConcepts: "Resource Acquisition, Memory reclamation, Memory leaks, Use-after-free, Garbage collection",
          code: "import gc\n\nclass Resource:\n    def __init__(self, name):\n        self.name = name\n        print(f\"Allocated: {self.name}\")\n    def __del__(self):\n        print(f\"Deallocated: {self.name}\")\n\n# Allocation\nr = Resource(\"DatabaseBuffer\")\n# Explicit deallocation trigger by removing references\ndel r\ngc.collect()",
          output: "Allocated: DatabaseBuffer\nDeallocated: DatabaseBuffer"
        },
        {
          id: 24,
          title: "Reference vs Pointer",
          topicId: 2,
          topicName: "Pointers, References & Copying",
          level: "Core Concept",
          answer: "\"A Pointer is a variable that stores a raw memory address pointing directly to a byte in RAM. Pointers support pointer arithmetic (e.g., `ptr++`), can point to arbitrary memory addresses, can be null or uninitialized, and carry no safety guarantees.\n\nA Reference is an abstract, safe handle or alias to an existing object managed by the runtime or language compiler. References cannot undergo arithmetic, cannot be manipulated into pointing to arbitrary memory addresses, and provide memory safety guarantees.\"\n\n| Feature | Pointer | Reference |\n| --- | --- | --- |\n| **Value Held** | Raw physical / virtual memory address integer | Abstract object handle managed by runtime |\n| **Pointer Arithmetic** | Supported (`ptr + 1`, array traversal) | Strictly forbidden (prevents out-of-bounds corruption) |\n| **Nullability** | Can be `NULL`, `nullptr`, or uninitialized wildcard | Generally must refer to valid object (or explicit `None`/`null`) |\n| **Type Safety** | Weak (allows `void*` casting to arbitrary types) | Strong (enforces object type safety) |\n| **Languages** | C, C++, Assembly | Python, Java, C#, Go, JavaScript |",
          keyConcepts: "Raw memory addresses, Pointer arithmetic, Memory safety, Type safety, Object handles",
          code: "# In Python, variables hold references, not raw pointers:\na = [10, 20, 30]\nb = a  # 'b' references the identical object in memory\n\nprint(f\"Address of a: {hex(id(a))}\")\nprint(f\"Address of b: {hex(id(b))}\")\nprint(f\"Are they pointing to same object? {a is b}\")",
          output: "Address of a: 0x... (heap address)\nAddress of b: 0x... (same heap address)\nAre they pointing to same object? True"
        },
        {
          id: 25,
          title: "Strong vs Weak References",
          topicId: 2,
          topicName: "Pointers, References & Copying",
          level: "Core Concept",
          answer: "\"A Strong Reference is a default reference that protects the targeted object from garbage collection. As long as at least one strong reference to an object exists, the garbage collector will never deallocate it.\n\nA Weak Reference is a non-owning reference that allows referencing an object without increasing its reference count or preventing garbage collection. If all strong references are removed, the object is reclaimed immediately, and the weak reference automatically yields `None` (or becomes dead).\"\n\n| Feature | Strong Reference | Weak Reference |\n| --- | --- | --- |\n| **Prevents Garbage Collection?**| Yes; keeps object alive as long as reference exists | No; does not prevent garbage collection |\n| **Reference Count Impact** | Increments object reference counter | Does NOT increment object reference counter |\n| **Common Use Cases** | Standard variable assignments, object graphs | Caches, listeners, breaking circular reference cycles |\n| **Accessing Dead Object** | Never dead while strong ref exists | Safely returns `None` once object is collected |\n| **Standard Library** | Built-in by default (`x = obj`) | `import weakref` (Python), `WeakReference` (Java) |",
          keyConcepts: "Reference counting, Circular reference prevention, Memory leak avoidance, weakref module, Caches",
          code: "import weakref\n\nclass Node:\n    def __init__(self, val):\n        self.val = val\n\nobj = Node(\"Active Node\")\nweak_link = weakref.ref(obj)\n\nprint(\"Weak ref before deletion:\", weak_link())\n# Delete the only strong reference:\ndel obj\nprint(\"Weak ref after strong ref deleted:\", weak_link())",
          output: "Weak ref before deletion: <__main__.Node object at ...>\nWeak ref after strong ref deleted: None"
        },
        {
          id: 26,
          title: "Shallow vs Deep Memory Copy",
          topicId: 2,
          topicName: "Pointers, References & Copying",
          level: "Core Concept",
          answer: "\"At the memory architecture level:\n\nA Shallow Memory Copy allocates a new container block on the heap and performs a shallow bitwise or pointer copy of its elements, copying only the memory addresses of nested children. Modifying child objects in memory mutates the exact same memory cells accessed by the original.\n\nA Deep Memory Copy allocates a new container and recursively allocates new heap memory blocks for every child and grandchild node, duplicating all data cells into independent memory addresses.\"\n\n| Feature | Shallow Memory Copy | Deep Memory Copy |\n| --- | --- | --- |\n| **Outer Container Memory** | Brand new allocated heap memory address | Brand new allocated heap memory address |\n| **Child Pointers** | Pointers to original child heap addresses copied | New heap blocks allocated for each child node |\n| **Memory Footprint** | Extremely small (outer header + array of pointers) | Equal to entire size of recursive object graph |\n| **Pointer Equality (`child1 is child2`)** | `True` (same underlying memory address) | `False` (distinct memory addresses) |\n| **Execution Cost** | O(1) or O(N) top-level pointers | O(Total Nodes in graph) traversal |",
          keyConcepts: "Heap allocations, Pointer cloning, Memory address inspection hex(id()), Recursive memory layout",
          code: "import copy\n\nparent = [[10, 20]]\nshallow = copy.copy(parent)\ndeep = copy.deepcopy(parent)\n\nprint(f\"Parent child memory address:  {hex(id(parent[0]))}\")\nprint(f\"Shallow child memory address: {hex(id(shallow[0]))} (Shared!)\")\nprint(f\"Deep child memory address:    {hex(id(deep[0]))} (Independent!)\")",
          output: "Parent child memory address:  0x...10\nShallow child memory address: 0x...10 (Shared!)\nDeep child memory address:    0x...50 (Independent!)"
        },
        {
          id: 27,
          title: "Garbage Collection",
          topicId: 3,
          topicName: "Garbage Collection & Lifecycle",
          level: "Core Concept",
          answer: "\"Garbage Collection (GC) is an automated memory management subsystem that scans heap memory, identifies objects that are no longer accessible or referenced by any active part of the program (dead objects), and reclaims their memory space for future allocations.\n\nGC eliminates critical manual memory bugs such as double-free errors, memory leaks, and dangling pointer dereferences, at the cost of modest runtime CPU overhead and occasional collection pauses.\"\n\n| Feature | Automatic Garbage Collection | Manual Memory Management |\n| --- | --- | --- |\n| **Responsibility** | Language runtime / Virtual Machine | Programmer manually in code |\n| **Operations** | Tracing (Mark & Sweep), Reference Counting | Explicit `malloc`/`free`, `new`/`delete` |\n| **Safety Guarantees**| Eliminates dangling pointers & double frees | Prone to severe memory corruption bugs |\n| **CPU & Pause Overhead**| Periodic GC pauses / background threads | Zero GC pause overhead (deterministic deallocation) |\n| **Languages** | Python, Java, Go, C#, JavaScript, Ruby | C, C++, Rust (via ownership/RAII) |",
          keyConcepts: "Automatic memory reclamation, Heap traversal, Dead object identification, GC pause, Memory safety",
          code: "import gc\n\n# Manual GC control inspection in Python:\nprint(\"GC enabled:\", gc.isenabled())\nunreachable = gc.collect()\nprint(\"Unreachable objects collected:\", unreachable)\nprint(\"Current collection counts:\", gc.get_count())",
          output: "GC enabled: True\nUnreachable objects collected: 0\nCurrent collection counts: (..., ..., ...)"
        },
        {
          id: 28,
          title: "Reference Counting",
          topicId: 3,
          topicName: "Garbage Collection & Lifecycle",
          level: "Core Concept",
          answer: "\"Reference Counting is a deterministic memory management technique where every object's memory header maintains a counter (`ob_refcnt` in Python CPython) tracking how many active references currently point to it.\n\n• Increment: When an object is assigned to a variable, passed to a function, or added to a collection.\n• Decrement: When a variable goes out of scope, is reassigned, or deleted.\n• Immediate Deallocation: When the count reaches 0, the object is immediately deallocated without waiting for a GC cycle.\n• Major Flaw: Cannot detect or collect isolated circular reference cycles on its own.\"\n\n| Feature | Reference Counting | Tracing GC (Mark & Sweep) |\n| --- | --- | --- |\n| **Deallocation Timing** | Instantaneous (as soon as count hits 0) | Deferred (runs periodically during GC cycles) |\n| **Pause Times** | Smooth, continuous deallocation; no stop-the-world pauses | Periodic GC pauses while tracing live objects |\n| **Circular References** | Blind to cyclic graphs (causes leaks without helper) | Trivially handles and reclaims cyclic graphs |\n| **Header Overhead** | Every object header requires counter storage | Objects require mark bits or external bit maps |\n| **Primary Engine** | Python (CPython primary), Swift, PHP | JVM, Go, V8 (JavaScript), .NET CLR |",
          keyConcepts: "ob_refcnt, Instantaneous deallocation, Reference increment/decrement, Cyclic reference blindspot",
          code: "import sys\n\nx = [1, 2, 3]\nprint(\"Initial reference count:\", sys.getrefcount(x))  # Note: getrefcount adds 1 temporary ref\n\ny = x\nprint(\"After y = x:\", sys.getrefcount(x))\n\ndel y\nprint(\"After del y:\", sys.getrefcount(x))",
          output: "Initial reference count: 2\nAfter y = x: 3\nAfter del y: 2"
        },
        {
          id: 29,
          title: "Mark and Sweep Algorithm",
          topicId: 3,
          topicName: "Garbage Collection & Lifecycle",
          level: "Core Concept",
          answer: "\"The Mark and Sweep Algorithm is a foundational tracing garbage collection algorithm executed in two distinct phases:\n\n1. Mark Phase: The garbage collector begins at known 'GC Roots' (global variables, local stack frame references, active thread registers) and traverses the entire directed object graph, setting a 'visited/marked' bit on every reachable object.\n2. Sweep Phase: The collector sweeps across the entire heap memory linearly. Any memory block lacking the marked bit is recognized as unreachable garbage, deallocated, and returned to the allocator's free list.\"\n\n| Phase | Mark Phase | Sweep Phase |\n| --- | --- | --- |\n| **Goal** | Identify all living reachable objects | Reclaim all unmarked dead memory blocks |\n| **Traversal** | Graph traversal (DFS/BFS) starting from GC Roots | Linear memory scan of heap allocator boundaries |\n| **Heap Impact** | Sets mark bits on headers | Resets mark bits, clears objects, updates free-lists |\n| **Cycle Handling** | Naturally handles circular references | Reclaims cyclical garbage without issues |\n| **Compaction (Variant)**| Mark-Sweep leaves holes; Mark-Compact shifts live objects | Prevents external fragmentation |",
          keyConcepts: "GC Roots, Reachability graph, Tracing collector, Stop-the-world, Compaction",
          code: "# Demonstrating circular references that Mark-and-Sweep solves:\nclass Node:\n    def __init__(self, name):\n        self.name = name\n        self.partner = None\n\na = Node(\"A\")\nb = Node(\"B\")\na.partner = b\nb.partner = a  # Circular reference cycle!\n\n# Remove external references\ndel a\ndel b\n# Reference counting alone cannot free them, but Python's cyclic GC reclaims them:\nimport gc\ncollected = gc.collect()\nprint(\"Cyclic garbage collected:\", collected > 0)",
          output: "Cyclic garbage collected: True"
        },
        {
          id: 30,
          title: "Memory Leak",
          topicId: 4,
          topicName: "Memory Hazards & Diagnostics",
          level: "Core Concept",
          answer: "\"A Memory Leak occurs when memory allocated by a program is no longer needed for any functional purpose, but cannot be reclaimed by the garbage collector or operating system because unintended references still point to it.\n\nOver time, leaked memory accumulates, degrading system throughput, increasing swap space usage, and ultimately causing the process to crash with `OutOfMemoryError` (OOM).\"\n\n| Aspect | Managed Memory Leak (Java/Python) | Unmanaged Memory Leak (C/C++) |\n| --- | --- | --- |\n| **Root Cause** | Lingering strong references (unbounded caches, listeners) | Missing `free()` or `delete` for heap-allocated memory |\n| **GC Visibility** | Objects appear 'reachable' to GC, so GC cannot reclaim | OS marks memory allocated until process exits |\n| **Common Culprits** | Static collections, event listeners not unregistered | Lost pointer assignments without calling free |\n| **Symptoms** | Constantly rising JVM/Python heap usage and frequent GC | Constantly growing resident set size (RSS) |\n| **Remediation** | Use weak references, clear caches, profilers (tracemalloc)| Valgrind, AddressSanitizer, RAII smart pointers |",
          keyConcepts: "Unintended reference retention, OutOfMemoryError, Unbounded caches, Heap profiling, tracemalloc",
          code: "# Memory Leak simulation: Unbounded cache accumulating state indefinitely\ncache = []\n\ndef process_data(data):\n    cache.append(data)  # Leaking memory: cache never evicts old data!\n    return len(data)\n\nfor i in range(3):\n    process_data(f\"payload_{i}\")\n\nprint(\"Leaked cache size:\", len(cache))\n# Fix: use bounded lru_cache or weakref",
          output: "Leaked cache size: 3"
        },
        {
          id: 31,
          title: "Dangling Pointer",
          topicId: 4,
          topicName: "Memory Hazards & Diagnostics",
          level: "Core Concept",
          answer: "\"A Dangling Pointer is a pointer that continues referencing a memory address after the memory block it points to has been deallocated or freed.\n\nDereferencing a dangling pointer produces Undefined Behavior (UB), application crashes (Segmentation Fault), subtle data corruption (if another object was allocated in that reused memory), or security exploits (Use-After-Free).\"\n\n| Feature | Dangling Pointer | Memory Leak | Null Pointer |\n| --- | --- | --- | --- |\n| **Memory State** | Memory has been freed; pointer remains | Memory NOT freed; pointer was lost | Pointer explicitly equals 0x0 / NULL |\n| **Access Result**| Undefined behavior / data corruption | Wasted RAM (no crash on access) | Immediate deterministic Crash / NullPointerException |\n| **Prevention** | Set pointers to `NULL` after `free()`, use smart pointers | Free all allocations, use RAII / GC | Validate pointer before dereferencing |",
          keyConcepts: "Use-after-free, Deallocated memory address, Segmentation fault, Undefined behavior, Smart pointers",
          code: "# Safe reference handling in Python vs Dangling pointers:\nclass Connection:\n    def query(self):\n        return \"Executing query...\"\n\nconn = Connection()\nprint(\"Query result:\", conn.query())\n\n# Safe destruction: explicitly nullifying reference\nconn = None\ntry:\n    conn.query()\nexcept AttributeError as e:\n    print(f\"Safe failure caught: {e}\")",
          output: "Query result: Executing query...\nSafe failure caught: 'NoneType' object has no attribute 'query'"
        },
        {
          id: 32,
          title: "Memory Fragmentation",
          topicId: 4,
          topicName: "Memory Hazards & Diagnostics",
          level: "Core Concept",
          answer: "\"Memory Fragmentation is a condition where available system memory is broken into non-contiguous pieces, degrading memory utilization efficiency and potentially causing allocation failures even when total free memory is ample:\n\n• Internal Fragmentation: Occurs when fixed-size memory blocks allocated to an object are larger than the object's actual data payload, leaving wasted unused bytes inside the allocated block.\n• External Fragmentation: Occurs when free memory is scattered in small, discontinuous gaps across the heap between allocated objects, preventing allocation of a large contiguous object.\"\n\n| Feature | Internal Fragmentation | External Fragmentation |\n| --- | --- | --- |\n| **Location** | Inside the allocated memory block | Between allocated memory blocks on the heap |\n| **Cause** | Fixed block sizing / alignment boundaries (e.g. 64-byte chunks)| Repeated allocations and deallocations of varying sizes |\n| **Impact** | Space wasted within blocks | Total free memory exists, but contiguous block unavailable |\n| **Solution** | Dynamic block sizing, slab allocators | Memory compaction, copying garbage collectors, Pymalloc pools |",
          keyConcepts: "Internal vs External fragmentation, Compaction, Memory alignment, Free list coalescing, Slab allocator",
          code: "# Python pymalloc minimizes fragmentation by pooling small objects (<= 512 bytes)\nimport sys\n\nsmall_int = 42\nlarge_list = [i for i in range(1000)]\n\nprint(f\"Small object size: {sys.getsizeof(small_int)} bytes (handled by pymalloc pool)\")\nprint(f\"Large object size: {sys.getsizeof(large_list)} bytes (allocated via system malloc)\")",
          output: "Small object size: 28 bytes (handled by pymalloc pool)\nLarge object size: 8056 bytes (allocated via system malloc)"
        },
        {
          id: 33,
          title: "Object Lifecycle",
          topicId: 3,
          topicName: "Garbage Collection & Lifecycle",
          level: "Core Concept",
          answer: "\"The Object Lifecycle represents the sequence of states an object traverses from memory creation to reclamation:\n\n1. Creation & Allocation: Memory space is reserved on the heap by the allocator (e.g. `__new__` in Python).\n2. Initialization: Constructor runs and initializes internal fields/attributes (`__init__`).\n3. Active Use: Object is referenced by stack variables, collections, or fields and executes methods.\n4. Unreachability: All active references are dropped or leave scope.\n5. Finalization: Destructor/clean-up hooks run (`__del__`, `finalize`).\n6. Deallocation: Memory is returned to the allocator free-pool.\"\n\n| Stage | Mechanism | Trigger |\n| --- | --- | --- |\n| **Allocation** | `__new__` / `malloc` | Instantiation call `obj = MyClass()` |\n| **Initialization** | `__init__` / Constructor | Immediately following memory allocation |\n| **Live Operation** | Method calls, field access | Program execution holding reference |\n| **Reclamation** | `__del__` / GC Deallocation | Reference count drops to 0 or GC sweeps |\n| **Memory Freed** | Free list update / OS release | Allocator returns heap page |",
          keyConcepts: "__new__ vs __init__, Finalization, Destructors __del__, Deallocation, RAII pattern",
          code: "class ManagedEntity:\n    def __new__(cls, name):\n        print(f\"1. [Allocation] __new__ called for {name}\")\n        return super().__new__(cls)\n    def __init__(self, name):\n        self.name = name\n        print(f\"2. [Initialization] __init__ called for {name}\")\n    def do_work(self):\n        print(f\"3. [Active Use] {self.name} processing task\")\n    def __del__(self):\n        print(f\"4. [Finalization & Cleanup] __del__ called for {self.name}\")\n\ne = ManagedEntity(\"Worker-A\")\ne.do_work()\ndel e",
          output: "1. [Allocation] __new__ called for Worker-A\n2. [Initialization] __init__ called for Worker-A\n3. [Active Use] Worker-A processing task\n4. [Finalization & Cleanup] __del__ called for Worker-A"
        },
        {
          id: 34,
          title: "Escape Analysis",
          topicId: 5,
          topicName: "Runtime Optimization & Analysis",
          level: "Core Concept",
          answer: "\"Escape Analysis is a compiler optimization technique (prominent in modern JIT compilers like JVM C2, Go compiler, and V8) that determines whether an object's reference escapes beyond the boundary of the method or thread where it is instantiated.\n\nIf the compiler proves an object does NOT escape:\n• Stack Allocation: The object can be allocated on the call stack instead of the heap, eliminating GC overhead.\n• Synchronization Elimination (Lock Elision): Thread locks on the object can be removed safely.\n• Scalar Replacement: The object structure can be decomposed directly into CPU registers.\"\n\n| Analysis Result | Non-Escaping Object | Escaping Object |\n| --- | --- | --- |\n| **Reference Scope** | Confined strictly to creating function | Returned, stored in global, or passed to external thread |\n| **Allocation Target**| Call Stack or Registers (Scalar replacement) | Heap Memory |\n| **GC Pressure** | Zero GC overhead (cleared on frame return) | Tracked and collected by Garbage Collector |\n| **Lock Overhead** | Lock elision (synchronization stripped out) | Full thread synchronization enforced |",
          keyConcepts: "JIT optimization, Stack allocation, Scalar replacement, Lock elision, Method boundary",
          code: "# In JIT-compiled languages (JVM/Go), escape analysis optimizes local objects:\ndef calculate_total(a, b):\n    # 'point' does NOT escape this function scope!\n    # JIT compilers optimize this to stack registers with zero heap GC allocation.\n    point = (a * 2, b * 3)\n    return point[0] + point[1]\n\nresult = calculate_total(10, 20)\nprint(\"Result of non-escaping calculation:\", result)",
          output: "Result of non-escaping calculation: 80"
        },
        {
          id: 35,
          title: "Memory Management in JVM",
          topicId: 6,
          topicName: "Virtual Machine Internals (JVM & Python)",
          level: "Core Concept",
          answer: "\"The Java Virtual Machine (JVM) divides memory into distinct runtime data areas:\n\n1. Heap Memory (Shared across threads):\n   • Young Generation: Eden Space, Survivor 0 (S0), and Survivor 1 (S1). New objects start in Eden. Minor GC moves survivors.\n   • Old (Tenured) Generation: Holds long-lived objects promoted after surviving multiple GC rounds. Major/Full GC collects Old gen.\n2. Non-Heap Memory:\n   • Metaspace: Class metadata, method bytecodes, runtime constant pool (in native OS memory).\n   • Thread Stacks: Stack frames for each running thread.\n   • Program Counter (PC) Registers & Native Method Stacks.\"\n\n| Generation | Area | Typical Inhabitants | GC Collector Type |\n| --- | --- | --- | --- |\n| **Young Gen** | Eden + S0 + S1 | Newly allocated short-lived objects | Minor GC (Stop-the-world, very fast) |\n| **Old Gen** | Tenured Space | Long-lived survivors, singletons, caches | Major / Full GC (G1, ZGC, Parallel) |\n| **Metaspace** | Native Memory | Class definitions, static methods, metadata | Metaspace GC (rare, during class unloading) |",
          keyConcepts: "Eden space, Survivor spaces, Tenured generation, Minor vs Full GC, Metaspace",
          code: "# Python code illustrating generational promotion logic inspired by JVM:\ndef simulate_generations(object_name, age_threshold=3):\n    age = 0\n    generation = \"Eden (Young)\"\n    while age < age_threshold:\n        age += 1\n        print(f\"{object_name}: Age {age} in {generation}\")\n    generation = \"Tenured (Old)\"\n    print(f\"{object_name}: Promoted to {generation}!\")\n\nsimulate_generations(\"SessionCache\")",
          output: "SessionCache: Age 1 in Eden (Young)\nSessionCache: Age 2 in Eden (Young)\nSessionCache: Age 3 in Eden (Young)\nSessionCache: Promoted to Tenured (Old)!"
        },
        {
          id: 36,
          title: "Python Memory Management",
          topicId: 6,
          topicName: "Virtual Machine Internals (JVM & Python)",
          level: "Core Concept",
          answer: "\"CPython implements a multi-tiered memory hierarchy:\n\n1. Layer 3 (Object Allocator): Type-specific allocators for `int`, `str`, `dict`, and `list`.\n2. Layer 2 (Pymalloc): Specialized allocator for small objects (<= 512 bytes):\n   • Arenas: 256 KB memory chunks requested from OS.\n   • Pools: 4 KB slices of an arena dedicated to a single block size.\n   • Blocks: Fixed-size subdivisions (8 to 512 bytes in multiples of 8).\n3. Layer 1: Python Core Memory Allocator (wraps C `malloc`/`free` for large objects > 512 bytes).\n4. Garbage Collector: Primary deallocation via Reference Counting + Cyclic Garbage Collector with 3 generations (Gen 0, 1, 2).\"\n\n| Component | Size / Structure | Purpose |\n| --- | --- | --- |\n| **Arena** | 256 KB aligned chunk | High-level memory chunk allocated via `malloc` |\n| **Pool** | 4 KB partition | Divides an arena into uniform block sizes |\n| **Block** | 8 to 512 bytes | Stores individual Python object payloads |\n| **Cyclic GC** | Generations 0, 1, 2 | Detects and breaks unreachable circular reference loops |",
          keyConcepts: "Pymalloc, Arenas, Pools, Blocks, Reference counting, 3-generation cyclic GC",
          code: "import gc\n\n# Inspecting Python's 3-generation cyclic GC thresholds:\nprint(\"GC Generation Thresholds (Gen0, Gen1, Gen2):\", gc.get_threshold())\nprint(\"Current object counts in generations:        \", gc.get_count())\n\n# Trigger collection of Generation 0:\ngc.collect(0)\nprint(\"Post collection counts:                     \", gc.get_count())",
          output: "GC Generation Thresholds (Gen0, Gen1, Gen2): (700, 10, 10)\nCurrent object counts in generations:         (..., ..., ...)\nPost collection counts:                      (0, ..., ...)"
        },
        {
          id: 37,
          title: "Stack Frame and Function Call Stack",
          topicId: 1,
          topicName: "Memory Architecture & Allocation",
          level: "Core Concept",
          answer: "\"The Function Call Stack is a LIFO data structure that tracks active function calls across program execution.\n\nWhenever a function is invoked, a new Stack Frame (Activation Record) is pushed onto the call stack. The frame encapsulates:\n1. Incoming arguments and parameters passed to the function.\n2. Local variable declarations and primitives.\n3. Return memory address (where CPU execution resumes after return).\n4. Saved register states and frame pointers.\n\nWhen the function executes a `return`, its stack frame is instantly popped off the stack, and local variables are deallocated.\"\n\n| Feature | Call Stack | Stack Frame |\n| --- | --- | --- |\n| **Scope** | Program/Thread-wide data structure | Belongs to a single executing function call |\n| **Contents** | Sequence of all active stack frames | Parameters, local variables, return address |\n| **Push Action** | Triggered on function call | Allocated on top of stack |\n| **Pop Action** | Triggered on function `return` | Deallocated automatically by stack pointer decrement |\n| **Hazard** | StackOverflowError on infinite recursion | Corrupted frame pointer on buffer overflow |",
          keyConcepts: "Activation record, Return address, Stack pointer, Recursion depth, StackOverflowError",
          code: "import inspect\n\ndef inner_function(msg):\n    current_frame = inspect.currentframe()\n    print(\"Current function name:   \", current_frame.f_code.co_name)\n    print(\"Caller function name:    \", current_frame.f_back.f_code.co_name)\n    print(\"Local variables in frame:\", current_frame.f_locals)\n\ndef outer_function():\n    token = \"secret_xyz\"\n    inner_function(token)\n\nouter_function()",
          output: "Current function name:    inner_function\nCaller function name:     outer_function\nLocal variables in frame: {'msg': 'secret_xyz', 'current_frame': <frame at ...>}"
        },
        {
          id: 38,
          title: "Object Pooling",
          topicId: 5,
          topicName: "Runtime Optimization & Analysis",
          level: "Core Concept",
          answer: "\"Object Pooling is a creational and performance optimization pattern where a set of initialized objects is maintained in a reusable pool, rather than continuously allocating and deallocating objects on the heap.\n\nWhen a client requests an object, one is borrowed from the pool. Once finished, the client releases the object back to the pool for reuse. This drastically reduces heap fragmentation and GC pause overhead for expensive resources (e.g. Database Connections, Socket Channels, Thread Pools).\"\n\n| Feature | Object Pooling | Standard Heap Instantiation |\n| --- | --- | --- |\n| **Instantiation Frequency** | One-time upfront during pool warm-up | Every time a new object is needed |\n| **GC Pressure** | Near zero (objects are reused, not destroyed) | High (continuous object creation and destruction) |\n| **Acquisition Latency** | Instantaneous (borrows pre-initialized object) | Higher (allocating memory + running constructor) |\n| **Memory Footprint** | Statically retained even when idle | Floats dynamically with demand |\n| **Best Used For** | Heavy, expensive objects (DB connections, threads)| Lightweight, transient data classes |",
          keyConcepts: "Resource reuse, Connection pooling, Thread pooling, GC pressure reduction, Free list pattern",
          code: "class ConnectionPool:\n    def __init__(self, size=2):\n        self._pool = [f\"DB_Conn_{i+1}\" for i in range(size)]\n    def acquire(self):\n        if not self._pool:\n            raise RuntimeError(\"Pool exhausted!\")\n        return self._pool.pop()\n    def release(self, conn):\n        self._pool.append(conn)\n\npool = ConnectionPool(size=2)\nc1 = pool.acquire()\nprint(\"Acquired:\", c1)\npool.release(c1)\nprint(\"Re-acquired:\", pool.acquire())",
          output: "Acquired: DB_Conn_2\nRe-acquired: DB_Conn_2"
        },
        {
          id: 39,
          title: "String Pool / Interning",
          topicId: 5,
          topicName: "Runtime Optimization & Analysis",
          level: "Core Concept",
          answer: "\"String Pool (String Interning) is a memory optimization technique where the runtime stores only a single copy of each unique immutable string literal in a specialized lookup table (intern pool).\n\nWhen identical strings are created or interned, they point to the exact same memory address. This saves memory and speeds up string comparisons: instead of comparing character-by-character in O(N) time, the runtime compares pointer memory addresses in O(1) time using pointer equality (`is` in Python).\"\n\n| Feature | Interned Strings | Non-Interned Strings |\n| --- | --- | --- |\n| **Memory Duplication** | Stored once in String Pool (deduplicated) | Distinct heap allocation for each string |\n| **Equality Check (`==`)**| Evaluated via fast pointer equality (`is`) | Character-by-character string traversal O(N) |\n| **Memory Footprint** | Compact; shares same heap buffer | High duplicate string memory consumption |\n| **Python Implementation**| Identifiers & literals interned; `sys.intern()` | Dynamically computed strings with spaces/symbols |\n| **Java Implementation** | String Constant Pool (`String.intern()`) | Strings created with `new String(\"...\")` |",
          keyConcepts: "String deduplication, Pointer equality, sys.intern(), String Constant Pool, O(1) comparison",
          code: "import sys\n\n# Dynamic strings created at runtime are not interned by default:\ns1 = \"interview_\" + \"mock\"\ns2 = \"interview_\" + \"mock\"\nprint(\"Literal auto-interned: s1 is s2?\", s1 is s2)\n\n# Explicit interning via sys.intern:\nstr_a = sys.intern(\"dynamic string with spaces!\")\nstr_b = sys.intern(\"dynamic string with spaces!\")\nprint(\"Explicitly interned:   str_a is str_b?\", str_a is str_b)",
          output: "Literal auto-interned: s1 is s2? True\nExplicitly interned:   str_a is str_b? True"
        },
        {
          id: 40,
          title: "Heap vs Metaspace in JVM",
          topicId: 6,
          topicName: "Virtual Machine Internals (JVM & Python)",
          level: "Core Concept",
          answer: "\"In Java 8+, Metaspace replaced the legacy Permanent Generation (PermGen) for non-heap class metadata:\n\n• Heap Memory stores application runtime object instances, arrays, and data. It is bounded by `-Xms` (initial) and `-Xmx` (max) flags, and is managed entirely by the garbage collector.\n• Metaspace stores runtime class metadata, method bytecodes, annotations, and the constant pool. It is allocated from OS native memory (outside the JVM heap). It grows dynamically by default, preventing common `java.lang.OutOfMemoryError: PermGen space` crashes.\"\n\n| Feature | JVM Heap Memory | Metaspace |\n| --- | --- | --- |\n| **Memory Location** | Virtual Machine managed Heap | Native Host OS Memory |\n| **Stores** | Object instances, instance fields, arrays | Class definitions, method bytecode, annotations |\n| **Sizing Flags** | `-Xms` (min) and `-Xmx` (max) | `-XX:MetaspaceSize`, `-XX:MaxMetaspaceSize` |\n| **Out Of Memory Error** | `java.lang.OutOfMemoryError: Java heap space` | `java.lang.OutOfMemoryError: Metaspace` |\n| **GC Frequency** | Frequent (Minor GC, Major GC) | Infrequent (only when classes are unloaded) |",
          keyConcepts: "Metaspace, PermGen replacement, Native OS memory, Class metadata, JVM memory tuning flags",
          code: "# Conceptual architecture comparison in Python:\njvm_memory_model = {\n    \"Heap\": {\"Location\": \"JVM Managed\", \"Stores\": \"Object Instances & Arrays\", \"Flag\": \"-Xmx\"},\n    \"Metaspace\": {\"Location\": \"Native OS RAM\", \"Stores\": \"Class Bytecode & Metadata\", \"Flag\": \"-XX:MaxMetaspaceSize\"}\n}\nfor region, meta in jvm_memory_model.items():\n    print(f\"[{region}] Location: {meta['Location']} | Stores: {meta['Stores']}\")",
          output: "[Heap] Location: JVM Managed | Stores: Object Instances & Arrays\n[Metaspace] Location: Native OS RAM | Stores: Class Bytecode & Metadata"
        }
      ]
    }
  }
;
