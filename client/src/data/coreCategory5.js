export const category5 = {
  "id": 205,
  "title": "5. Python-Specific Concepts",
  "shortTitle": "Category 5",
  "subtitle": "29 Core Concepts: GIL, Metaclasses, Async/Await, MRO, Scopes & Dunder Methods",
  "description": "Master Python runtime internals and advanced idiomatic paradigms: GIL, Asyncio, Generators vs Iterators, Decorators, Closures, LEGB rule, Memory management, Metaclasses, and Dunder magic methods.",
  "questionCount": 29,
  "topicCount": 6,
  "status": "available",
  "data": {
    "phase": "5. Python-Specific Concepts",
    "totalQuestions": 29,
    "topics": [
      {
        "id": 1,
        "name": "Data Structures & Built-in Operations",
        "range": [
          86,
          92
        ],
        "count": 7
      },
      {
        "id": 2,
        "name": "Iteration, Generators & Comprehensions",
        "range": [
          93,
          95
        ],
        "count": 3
      },
      {
        "id": 3,
        "name": "Functions, Scopes & Closures",
        "range": [
          96,
          100
        ],
        "count": 5
      },
      {
        "id": 4,
        "name": "Concurrency, GIL & Async",
        "range": [
          101,
          104
        ],
        "count": 4
      },
      {
        "id": 5,
        "name": "Object Model & Metaprogramming",
        "range": [
          105,
          114
        ],
        "count": 8
      },
      {
        "id": 6,
        "name": "Memory, Hazards & Internals",
        "range": [
          111,
          112
        ],
        "count": 2
      }
    ],
    "questions": [
      {
        "id": 86,
        "title": "is vs ==",
        "topicId": 1,
        "topicName": "Data Structures & Built-in Operations",
        "level": "Core Concept",
        "answer": "\"In Python, `==` evaluates value equality by invoking the object's `__eq__()` method to determine if two objects share equivalent values.\\n\\n`is` evaluates identity equality by checking whether two reference variables point to the exact same memory address (`id(a) == id(b)`). Always use `is` when comparing against singleton values like `None`, `True`, or `False`.\"\n\n| Feature | `==` Operator | `is` Operator |\n| --- | --- | --- |\n| **Comparison Basis** | Semantic value / content equivalence | Heap identity / physical memory pointer |\n| **Underlying Hook** | Calls `a.__eq__(b)` | Compares `id(a) == id(b)` |\n| **Overridable** | Yes, customizable per class | No, cannot be overridden |\n| **Recommended Use** | Value comparisons (`[1, 2] == [1, 2]`) | Singleton checks (`val is None`, `flag is True`) |\n| **Speed** | Slightly slower (method call overhead) | Fastest (instant CPU register pointer check) |",
        "keyConcepts": "Value equality vs Identity equality, id(), Singleton comparison, __eq__()",
        "code": "a = [1, 2, 3]\nb = [1, 2, 3]\nc = a\n\nprint(\"Value equality (a == b):\", a == b)\nprint(\"Identity check (a is b):\", a is b)\nprint(\"Identity check (a is c):\", a is c)\nprint(\"Proper singleton check:\", a is not None)",
        "output": "Value equality (a == b): True\nIdentity check (a is b): False\nIdentity check (a is c): True\nProper singleton check: True"
      },
      {
        "id": 87,
        "title": "List vs Tuple",
        "topicId": 1,
        "topicName": "Data Structures & Built-in Operations",
        "level": "Core Concept",
        "answer": "\"Lists (`[]`) are mutable sequences that can be resized and modified in place. They have dynamic array over-allocation overhead to support efficient appends.\\n\\nTuples (`()`) are immutable sequences with fixed lengths and content. Because of their immutability, tuples consume less memory, support faster instantiation, can be cached by CPython, and can serve as dictionary keys or Set elements.\"\n\n| Feature | List (`list`) | Tuple (`tuple`) |\n| --- | --- | --- |\n| **Mutability** | Mutable (in-place modification) | Immutable (read-only after creation) |\n| **Syntax** | `[1, 2, 3]` | `(1, 2, 3)` |\n| **Memory Overhead** | Higher (over-allocates buffer for growth)| Compact (allocated to exact size) |\n| **Dict Key / Set Element**| Cannot be used as dict keys (unhashable)| Can be used as dict keys (if elements are hashable)|\n| **Performance** | Slightly slower iteration & allocation | Faster allocation and GC traversal |",
        "keyConcepts": "Mutability, Immutability, Memory footprint, Hashability, Over-allocation buffer",
        "code": "import sys\n\nlst = [1, 2, 3, 4, 5]\ntup = (1, 2, 3, 4, 5)\n\nprint(\"List memory bytes: \", sys.getsizeof(lst))\nprint(\"Tuple memory bytes:\", sys.getsizeof(tup))\n\n# Tuples as dict keys:\ncoord_map = {(12.5, 77.2): \"Bangalore\"}\nprint(\"Tuple as dict key:\", coord_map[(12.5, 77.2)])",
        "output": "List memory bytes:  104\nTuple memory bytes: 80\nTuple as dict key: Bangalore"
      },
      {
        "id": 88,
        "title": "List vs Set",
        "topicId": 1,
        "topicName": "Data Structures & Built-in Operations",
        "level": "Core Concept",
        "answer": "\"A List is an ordered, indexable sequence that allows duplicate elements. Searching for an item using `in` requires linear O(N) scanning.\\n\\nA Set is an unordered collection of unique, hashable elements implemented using an internal hash table. Membership testing (`x in my_set`) and item insertion execute in average O(1) constant time, making Sets vastly superior for deduplication and lookups.\"\n\n| Feature | List | Set |\n| --- | --- | --- |\n| **Element Uniqueness** | Allows duplicate items | Enforces strictly unique items |\n| **Ordering** | Insertion order preserved (indexed access)| Unordered (no index lookup `set[0]` is invalid) |\n| **Search Complexity (`in`)**| O(N) linear time | Average O(1) constant time |\n| **Element Requirement**| Any object type | Hashable types only (`__hash__` and `__eq__`) |\n| **Internal Structure** | Dynamic pointer array | Open-addressing hash table |",
        "keyConcepts": "O(1) lookup, Hash table, Uniqueness, Hashable elements, Linear scan",
        "code": "items = [1, 2, 2, 3, 4, 4, 4]\nunique_set = set(items)\nprint(\"Deduplicated set:\", unique_set)\nprint(\"O(1) membership check:\", 3 in unique_set)",
        "output": "Deduplicated set: {1, 2, 3, 4}\nO(1) membership check: True"
      },
      {
        "id": 89,
        "title": "append() vs extend()",
        "topicId": 1,
        "topicName": "Data Structures & Built-in Operations",
        "level": "Core Concept",
        "answer": "\"append() adds its single argument as a single element to the end of the list. If you pass an iterable (like another list), `append()` embeds the entire list as a nested sub-element.\\n\\nextend() iterates over the provided iterable argument and appends each element individually to the end of the list, unpacking and flattening the elements into the target list.\"\n\n| Feature | `append(x)` | `extend(iterable)` |\n| --- | --- | --- |\n| **Argument** | Any single item or object | Must be an iterable (`list`, `tuple`, `generator`) |\n| **Element Addition** | Appends argument as 1 single element | Appends each item from iterable individually |\n| **Nested Structure** | Creates nested list if argument is a list | Flattens/unpacks items into target list |\n| **List Length Impact** | Increments length by exactly +1 | Increments length by `len(iterable)` |\n| **Operator Equivalent**| `list += [x]` (with single item) | `list += iterable` |",
        "keyConcepts": "Single element vs Iterable unpacking, In-place mutation, Nested lists, List growth",
        "code": "l1 = [1, 2]\nl1.append([3, 4])\nprint(\"After append:\", l1)\n\nl2 = [1, 2]\nl2.extend([3, 4])\nprint(\"After extend:\", l2)",
        "output": "After append: [1, 2, [3, 4]]\nAfter extend: [1, 2, 3, 4]"
      },
      {
        "id": 90,
        "title": "sort() vs sorted()",
        "topicId": 1,
        "topicName": "Data Structures & Built-in Operations",
        "level": "Core Concept",
        "answer": "\"list.sort() is an in-place mutating method exclusive to lists. It rearranges the elements of the existing list in memory and returns `None` to prevent accidental loss of reference.\\n\\nsorted() is a built-in function that accepts any iterable (list, tuple, dict, set, generator) and constructs a brand new sorted list containing all elements, leaving the original source collection untouched.\"\n\n| Feature | `list.sort()` | `sorted(iterable)` |\n| --- | --- | --- |\n| **Applicability** | Exclusively `list` instances | Any iterable (`tuple`, `dict`, `set`, `strings`) |\n| **Return Value** | `None` (mutates in-place) | Returns a brand new sorted `list` |\n| **Original Data** | Modified directly in place | Left completely unmodified |\n| **Memory Overhead** | In-place (O(1) extra space) | Allocates new list buffer (O(N) memory) |\n| **Algorithm** | Timsort (O(N log N)) | Timsort (O(N log N)) |",
        "keyConcepts": "In-place mutation vs Pure function, Timsort, Iterable sorting, Return value None",
        "code": "nums = [5, 2, 8, 1]\nnew_sorted = sorted(nums)\nprint(\"Original nums:\", nums)\nprint(\"sorted() result:\", new_sorted)\n\nnums.sort()\nprint(\"nums after .sort():\", nums)",
        "output": "Original nums: [5, 2, 8, 1]\nsorted() result: [1, 2, 5, 8]\nnums after .sort(): [1, 2, 5, 8]"
      },
      {
        "id": 91,
        "title": "remove() vs pop() vs del",
        "topicId": 1,
        "topicName": "Data Structures & Built-in Operations",
        "level": "Core Concept",
        "answer": "\"remove(value) searches for the first occurrence of the specified value and removes it. It returns `None` and raises `ValueError` if the value is not found.\\n\\npop([index]) removes and returns the element at the specified index (defaulting to the last element `-1`). It raises `IndexError` if the index is out of bounds.\\n\\ndel is a Python keyword statement that deletes variables, slice ranges (`del lst[1:3]`), or specific dictionary keys without returning a value.\"\n\n| Feature | `list.remove(val)` | `list.pop([idx])` | `del target` |\n| --- | --- | --- | --- |\n| **Target Parameter** | Value to match | Index position (default `-1`) | Index, slice, or variable name |\n| **Return Value** | `None` | The removed element value | No return value (statement) |\n| **Error Raised** | `ValueError` if not found | `IndexError` if out of range | `IndexError` or `KeyError` |\n| **Slice Deletion** | No | No | Yes (`del lst[0:2]`) |",
        "keyConcepts": "Value deletion, Index pop, Python del statement, Slice removal, IndexError vs ValueError",
        "code": "items = [10, 20, 30, 40, 50]\nitems.remove(20)         # Removes value 20\npopped = items.pop(1)    # Removes and returns value at index 1 (30)\ndel items[0]             # Deletes index 0 (10)\n\nprint(\"Popped item:\", popped)\nprint(\"Remaining list:\", items)",
        "output": "Popped item: 30\nRemaining list: [40, 50]"
      },
      {
        "id": 92,
        "title": "*args vs **kwargs",
        "topicId": 1,
        "topicName": "Data Structures & Built-in Operations",
        "level": "Core Concept",
        "answer": "\"*args allows a function to accept an arbitrary number of positional arguments. Inside the function body, `args` is packed into a standard immutable tuple.\\n\\n**kwargs allows a function to accept an arbitrary number of keyword/named arguments. Inside the function body, `kwargs` is packed into a standard dictionary mapping parameter names to their values.\"\n\n| Feature | `*args` | `**kwargs` |\n| --- | --- | --- |\n| **Argument Type** | Positional arguments (`f(1, 2, 3)`) | Keyword / Named arguments (`f(a=1, b=2)`) |\n| **Internal Container**| Packed into a `tuple` | Packed into a `dict` |\n| **Prefix Operator** | Single asterisk `*` | Double asterisk `**` |\n| **Positioning** | Precedes `**kwargs` in signature | Must come last in function parameter list |\n| **Unpacking Call** | `func(*list_of_args)` | `func(**dict_of_kwargs)` |",
        "keyConcepts": "Positional variable arguments, Keyword arguments, Tuple packing, Dict unpacking",
        "code": "def flexible_func(*args, **kwargs):\n    print(\"Positional tuple args:\", args)\n    print(\"Keyword dict kwargs:   \", kwargs)\n\nflexible_func(1, \"test\", role=\"Admin\", verified=True)",
        "output": "Positional tuple args: (1, 'test')\nKeyword dict kwargs:    {'role': 'Admin', 'verified': True}"
      },
      {
        "id": 93,
        "title": "Iterable vs Iterator",
        "topicId": 2,
        "topicName": "Iteration, Generators & Comprehensions",
        "level": "Core Concept",
        "answer": "\"An Iterable is any Python object capable of returning its members one at a time. It implements the `__iter__()` method, which returns an iterator (e.g. lists, tuples, strings, dictionaries).\\n\\nAn Iterator is the active stateful cursor object that performs the traversal. It implements the Iterator Protocol: `__next__()` to return the next value, raising `StopIteration` when elements are exhausted, and `__iter__()` returning itself.\"\n\n| Feature | Iterable | Iterator |\n| --- | --- | --- |\n| **Protocol Methods** | `__iter__()` | `__iter__()` AND `__next__()` |\n| **Statefulness** | Stateless container of elements | Stateful cursor tracking current traversal position |\n| **Next Element** | Cannot call `next()` directly | Calling `next(it)` advances and returns value |\n| **Reusability** | Can be looped over repeatedly | Exhausted after a single traversal pass |\n| **Examples** | `[1, 2, 3]`, `(1, 2)`, `'hello'` | `iter([1, 2, 3])`, generator objects |",
        "keyConcepts": "Iterator protocol, __iter__, __next__, StopIteration, Stateful traversal",
        "code": "lst = [10, 20]\niterator = iter(lst)  # Create iterator from iterable\n\nprint(\"1st next:\", next(iterator))\nprint(\"2nd next:\", next(iterator))\ntry:\n    next(iterator)\nexcept StopIteration:\n    print(\"Iterator cleanly exhausted with StopIteration\")",
        "output": "1st next: 10\n2nd next: 20\nIterator cleanly exhausted with StopIteration"
      },
      {
        "id": 94,
        "title": "Generator vs Iterator",
        "topicId": 2,
        "topicName": "Iteration, Generators & Comprehensions",
        "level": "Core Concept",
        "answer": "\"Every Generator is an Iterator, but not every Iterator is a Generator.\\n\\nA standard Iterator is created by defining a custom class that manually implements `__iter__()`, `__next__()`, state tracking, and explicit `raise StopIteration`.\\n\\nA Generator is a syntactic shortcut implemented using a function containing `yield` statements or generator expressions. The Python runtime automatically creates the iterator state machine, saves local frame variables upon each yield, and handles `StopIteration`.\"\n\n| Feature | Custom Class Iterator | Generator Function (`yield`) |\n| --- | --- | --- |\n| **Creation Method** | Class with `__iter__` & `__next__` | Function containing `yield` or `(...)` expr |\n| **State Management** | Manually tracked in instance fields (`self.i`)| Automatically preserved in suspended stack frame |\n| **Code Verbosity** | Verbose boilerplate class structure | Terse, readable function syntax |\n| **Termination** | Explicitly `raise StopIteration` | Simply `return` or reach end of function |\n| **Memory Efficiency** | High | High (lazy on-demand evaluation) |",
        "keyConcepts": "yield keyword, Suspended execution, Frame state preservation, Lazy streaming",
        "code": "# Generator function:\ndef count_up(max_val):\n    n = 1\n    while n <= max_val:\n        yield n\n        n += 1\n\ngen = count_up(3)\nfor val in gen:\n    print(\"Streamed from generator:\", val)",
        "output": "Streamed from generator: 1\nStreamed from generator: 2\nStreamed from generator: 3"
      },
      {
        "id": 95,
        "title": "Generator vs List Comprehension",
        "topicId": 2,
        "topicName": "Iteration, Generators & Comprehensions",
        "level": "Core Concept",
        "answer": "\"A List Comprehension (`[x for x in data]`) executes eagerly in memory, computing and allocating all elements into a complete in-memory list all at once.\\n\\nA Generator Expression (`(x for x in data)`) executes lazily. It computes elements on-demand one at a time as requested during iteration. It consumes constant O(1) memory regardless of whether processing 10 items or 10 billion items.\"\n\n| Feature | List Comprehension | Generator Expression |\n| --- | --- | --- |\n| **Syntax** | Square brackets `[expr for x in seq]` | Parentheses `(expr for x in seq)` |\n| **Evaluation Timing** | Eager (computed immediately) | Lazy (computed on-demand per step) |\n| **Memory Footprint** | O(N) memory (scales with data size) | O(1) constant memory regardless of data volume |\n| **Iteration Speed** | Faster for repeated access / indexing | Slower iteration loop, but zero startup latency |\n| **Indexing & Length** | Supports `len()` and index `lst[i]` | Does not support `len()` or indexing |",
        "keyConcepts": "Eager vs Lazy evaluation, Memory scaling, Generator expression, Constant memory O(1)",
        "code": "import sys\n\nlst_comp = [x * 2 for x in range(10000)]\ngen_exp = (x * 2 for x in range(10000))\n\nprint(\"List Comp bytes:\", sys.getsizeof(lst_comp))\nprint(\"Gen Exp bytes:  \", sys.getsizeof(gen_exp))",
        "output": "List Comp bytes: 85176\nGen Exp bytes:   200"
      },
      {
        "id": 96,
        "title": "Decorators",
        "topicId": 3,
        "topicName": "Functions, Scopes & Closures",
        "level": "Core Concept",
        "answer": "\"A Decorator is a design pattern and syntactic feature (`@decorator`) that allows you to wrap and dynamically inject behavior into another function or class without permanently modifying its source code.\\n\\nUnder the hood, a decorator takes a target function as an argument, defines an inner wrapper function that adds pre/post-processing logic, and returns the wrapper. Using `functools.wraps` preserves the original function's docstrings and name metadata.\"\n\n| Feature | Manual Function Wrapper | Python `@decorator` Syntax |\n| --- | --- | --- |\n| **Mechanism** | `func = decorator(func)` | `@decorator` placed above function definition |\n| **Readability** | Cluttered call sites | Clean, declarative annotation |\n| **Chaining** | Nested calls: `d1(d2(func))` | Stacked syntax: `@d1` followed by `@d2` |\n| **Common Uses** | Logging, Authentication, Timing, Caching | `@property`, `@classmethod`, `@functools.lru_cache` |\n| **Metadata Safety** | Overwrites `__name__` unless wrapped | Use `@functools.wraps(func)` to preserve metadata |",
        "keyConcepts": "First-class functions, Higher-order functions, functools.wraps, Metadata preservation, Aspect-Oriented Programming",
        "code": "from functools import wraps\n\ndef logger(func):\n    @wraps(func)\n    def wrapper(*args, **kwargs):\n        print(f\"Calling {func.__name__}...\")\n        result = func(*args, **kwargs)\n        print(f\"{func.__name__} finished.\")\n        return result\n    return wrapper\n\n@logger\ndef greet(name):\n    return f\"Hello, {name}!\"\n\nprint(greet(\"Alice\"))",
        "output": "Calling greet...\ngreet finished.\nHello, Alice!"
      },
      {
        "id": 97,
        "title": "Closures",
        "topicId": 3,
        "topicName": "Functions, Scopes & Closures",
        "level": "Core Concept",
        "answer": "\"A Closure is an inner function that remembers and retains access to variables from its enclosing outer lexical scope (free variables), even after the outer enclosing function has completed execution and left the call stack.\\n\\nIn Python, a closure requires three conditions:\\n1. A nested inner function.\\n2. The inner function references variables defined in the enclosing outer function.\\n3. The outer function returns the inner function object. Captured variables are stored in the inner function's `__closure__` attribute cells.\"\n\n| Condition | Requirement | Purpose |\n| --- | --- | --- |\n| **Nested Structure** | Inner function defined within outer | Establishes lexical scope hierarchy |\n| **Free Variable** | References variable in outer scope | Variable persists in closure cell rather than stack frame |\n| **Return Reference**| Outer function returns inner function | Keeps closure alive after outer scope finishes |\n| **Inspection** | `inner_func.__closure__[0].cell_contents` | Inspects captured closure variable values |",
        "keyConcepts": "Lexical scoping, Free variables, __closure__, State retention, Factory functions",
        "code": "def make_multiplier(factor):\n    def multiply(number):\n        return number * factor  # 'factor' captured in closure\n    return multiply\n\ndouble = make_multiplier(2)\ntriple = make_multiplier(3)\nprint(\"Double 5:\", double(5))\nprint(\"Triple 5:\", triple(5))",
        "output": "Double 5: 10\nTriple 5: 15"
      },
      {
        "id": 98,
        "title": "LEGB Scope Rule",
        "topicId": 3,
        "topicName": "Functions, Scopes & Closures",
        "level": "Core Concept",
        "answer": "\"The LEGB Rule defines the exact hierarchical priority order Python uses to resolve variable names across namespaces:\\n\\n1. **L - Local:** Names assigned inside the currently executing function.\\n2. **E - Enclosing:** Names in outer enclosing functions from inner to outer (closures).\\n3. **G - Global:** Names defined at the top-level of the module file or declared `global`.\\n4. **B - Built-in:** Pre-assigned names in the `builtins` module (`len`, `range`, `print`).\\n\\nPython searches in this strict order (L $\\rightarrow$ E $\\rightarrow$ G $\\rightarrow$ B) and raises `NameError` if unresolved.\"\n\n| Scope | Description | Inspection Tool |\n| --- | --- | --- |\n| **L - Local** | Variables inside current function body | `locals()` |\n| **E - Enclosing** | Variables in enclosing outer parent functions | `__closure__` |\n| **G - Global** | Module-level variables | `globals()` |\n| **B - Built-in** | Core language functions and exceptions | `dir(__builtins__)` |",
        "keyConcepts": "LEGB, Lexical namespace resolution, locals(), globals(), NameError",
        "code": "x = \"Global\"\n\ndef outer():\n    x = \"Enclosing\"\n    def inner():\n        x = \"Local\"\n        return x\n    return inner()\n\nprint(\"Resolved scope:\", outer())\nprint(\"Global scope:  \", x)",
        "output": "Resolved scope: Local\nGlobal scope:   Global"
      },
      {
        "id": 99,
        "title": "Global vs Nonlocal",
        "topicId": 3,
        "topicName": "Functions, Scopes & Closures",
        "level": "Core Concept",
        "answer": "\"The `global` keyword declares that a variable inside a function refers to the module-level global namespace, allowing modification of module-level variables.\\n\\nThe `nonlocal` keyword (introduced in Python 3) declares that a variable refers to the nearest enclosing parent function's scope (excluding global/module scope), enabling inner functions in closures to reassign outer non-global variables.\"\n\n| Feature | `global` | `nonlocal` |\n| --- | --- | --- |\n| **Target Scope** | Top-level module / Global scope | Enclosing outer function scope (lexical closure) |\n| **Excludes** | Local and enclosing scopes | Global and local scopes |\n| **Variable Existence**| Creates global variable if it doesn't exist | Target variable MUST already exist in outer scope |\n| **Typical Use** | Modifying module configurations | Maintaining state across closure invocations |",
        "keyConcepts": "Rebinding variables, Lexical scope, Closure state mutation, UnboundLocalError",
        "code": "def make_counter():\n    count = 0\n    def increment():\n        nonlocal count  # Allows mutation of outer enclosing variable\n        count += 1\n        return count\n    return increment\n\ncounter = make_counter()\nprint(\"Count 1:\", counter())\nprint(\"Count 2:\", counter())",
        "output": "Count 1: 1\nCount 2: 2"
      },
      {
        "id": 100,
        "title": "Shallow Copy vs Deep Copy",
        "topicId": 3,
        "topicName": "Functions, Scopes & Closures",
        "level": "Core Concept",
        "answer": "\"In Python's `copy` module:\\n\\nShallow Copy (`copy.copy()`) creates a new container object, but populates it with references to the original child objects. Modifying nested mutable objects affects both original and copy.\\n\\nDeep Copy (`copy.deepcopy()`) creates a new container object and recursively clones all nested objects and collections contained within it. The copy is 100% detached and independent, tracking memoization dictionaries to prevent infinite recursion on circular graphs.\"\n\n| Feature | Assignment (`b = a`) | Shallow Copy (`copy.copy`) | Deep Copy (`copy.deepcopy`) |\n| --- | --- | --- | --- |\n| **Outer Container** | Same reference | Brand new container | Brand new container |\n| **Nested Elements** | Same references | Same references (shared) | Fully cloned new instances |\n| **Nested Mutation** | Mutates original | Mutates original! | Completely isolated from original |\n| **Performance** | O(1) instantaneous | Fast (copies top level) | Slower (recursive graph traversal) |",
        "keyConcepts": "copy.copy vs copy.deepcopy, Nested mutations, Circular reference memoization, Object cloning",
        "code": "import copy\n\norig = [[1, 2], [3, 4]]\nshallow = copy.copy(orig)\ndeep = copy.deepcopy(orig)\n\norig[0][0] = 99\nprint(\"Original:     \", orig)\nprint(\"Shallow Copy: \", shallow)  # Affected by nested change!\nprint(\"Deep Copy:    \", deep)     # Completely protected",
        "output": "Original:      [[99, 2], [3, 4]]\nShallow Copy:  [[99, 2], [3, 4]]\nDeep Copy:     [[1, 2], [3, 4]]"
      },
      {
        "id": 101,
        "title": "Python GIL",
        "topicId": 4,
        "topicName": "Concurrency, GIL & Async",
        "level": "Core Concept",
        "answer": "\"The Global Interpreter Lock (GIL) is a mutex lock used by the CPython interpreter to ensure that only one native OS thread executes Python bytecode at any given moment, even on multi-core CPUs.\\n\\nWhy it exists: CPython's memory management relies heavily on non-thread-safe reference counting. The GIL prevents race conditions during reference counter increments and decrements.\\n\\nImpact: Multi-threaded CPU-bound Python programs cannot run in true parallel on multiple cores. However, I/O-bound programs release the GIL during file and network calls, and `multiprocessing` sidesteps the GIL entirely by spawning separate processes.\"\n\n| Task Type | Multithreading with GIL | Multiprocessing (No GIL limit) |\n| --- | --- | --- |\n| **I/O Bound (Network, Disk)**| Highly effective; GIL is released during I/O | Works, but higher process memory overhead |\n| **CPU Bound (Math, ML)** | Ineffective; runs on only 1 CPU core | Scales linearly across multi-core CPUs |\n| **Memory Sharing** | Shared memory space | Separate memory spaces (requires IPC) |\n| **GIL Release** | Automatically released during C extensions | Each process has its own GIL instance |",
        "keyConcepts": "GIL mutex, Reference counting safety, CPU-bound vs I/O-bound, CPython internals, PEP 703 free-threaded",
        "code": "import threading\n\n# GIL restricts pure CPU operations to 1 core:\ndef cpu_task():\n    s = sum(i * i for i in range(1000000))\n\nt1 = threading.Thread(target=cpu_task)\nt2 = threading.Thread(target=cpu_task)\nt1.start(); t2.start()\nt1.join(); t2.join()\nprint(\"Threads finished (executed cooperatively under GIL)\")",
        "output": "Threads finished (executed cooperatively under GIL)"
      },
      {
        "id": 102,
        "title": "Multithreading vs Multiprocessing",
        "topicId": 4,
        "topicName": "Concurrency, GIL & Async",
        "level": "Core Concept",
        "answer": "\"Multithreading spawns multiple lightweight threads within a single operating system process sharing the same memory address space. In Python, due to the GIL, multithreading is primarily useful for concurrent I/O-bound operations (downloading web pages, database queries, file transfers).\\n\\nMultiprocessing spawns distinct OS processes, each with its own isolated Python interpreter, memory space, and independent GIL. It unlocks true multi-core parallel computing for CPU-heavy tasks at the expense of higher RAM usage and IPC serialization overhead.\"\n\n| Feature | Multithreading (`threading`) | Multiprocessing (`multiprocessing`) |\n| --- | --- | --- |\n| **Memory Space** | Shared memory within 1 process | Separate memory per process |\n| **Parallelism in Python**| Concurrent I/O only (limited by GIL) | True multi-core parallel execution |\n| **Creation Overhead** | Lightweight | Heavier (spawns new OS processes) |\n| **Data Sharing** | Fast direct access (requires locks) | Requires IPC (`Queue`, `Pipe`, SharedMemory) |\n| **Best For** | I/O-bound tasks | CPU-bound computation |",
        "keyConcepts": "Shared memory vs Isolated memory, IPC, CPU-bound vs I/O-bound, GIL bypass",
        "code": "from multiprocessing import Process\n\ndef worker(num):\n    pass\n\n# Spawning independent processes:\nif __name__ == '__main__':\n    p = Process(target=worker, args=(1,))\n    p.start()\n    p.join()\n    print(\"Process completed on isolated interpreter instance.\")",
        "output": "Process completed on isolated interpreter instance."
      },
      {
        "id": 103,
        "title": "Coroutine vs Generator",
        "topicId": 4,
        "topicName": "Concurrency, GIL & Async",
        "level": "Core Concept",
        "answer": "\"A Generator (`def` with `yield`) is a data producer that lazily generates a stream of values one at a time for consumption in iteration loops.\\n\\nA Coroutine (`async def` or enhanced generator using `(yield)`) is a cooperative multitasking unit that can both consume and produce data. It can pause execution (`await`), yield control back to an event loop, and resume when asynchronous I/O completes.\"\n\n| Feature | Generator | Coroutine (`async def`) |\n| --- | --- | --- |\n| **Primary Role** | Data producer / Streaming iterator | Cooperative multitasking concurrency |\n| **Syntax** | `def func(): yield val` | `async def func(): await future` |\n| **Driver** | Advanced via `next()` or for-loop | Scheduled and driven by an Event Loop |\n| **Yield Direction** | Emits values out to caller | Can yield and receive data via event loop |\n| **Execution Context** | Synchronous | Asynchronous / Non-blocking |",
        "keyConcepts": "Cooperative multitasking, Event loop, Asyncio, Suspension, yield vs await",
        "code": "import asyncio\n\n# Coroutine:\nasync def fetch_data():\n    await asyncio.sleep(0.01)  # Non-blocking cooperative yield\n    return {\"status\": \"ok\"}\n\nresult = asyncio.run(fetch_data())\nprint(\"Coroutine result:\", result)",
        "output": "Coroutine result: {'status': 'ok'}"
      },
      {
        "id": 104,
        "title": "Async vs Await",
        "topicId": 4,
        "topicName": "Concurrency, GIL & Async",
        "level": "Core Concept",
        "answer": "\"Introduced in Python 3.5:\\n\\n`async` is a keyword used to declare an asynchronous coroutine function (`async def func()`) or asynchronous context manager/iterator. Calling an `async def` function does not immediately run its body; it returns a coroutine object.\\n\\n`await` is an expression keyword used inside an `async` function to yield control back to the event loop until the awaited awaitable (coroutine, Task, or Future) finishes, returning its resolved result without blocking the OS thread.\"\n\n| Keyword | Role | Permitted Location |\n| --- | --- | --- |\n| **async** | Declares asynchronous functions / generators | Function definitions (`async def`, `async with`) |\n| **await** | Suspends execution and waits for awaitable | Strictly inside `async def` functions |\n| **Return of `async def`**| Coroutine object (requires scheduling) | Evaluates immediately to coroutine wrapper |\n| **Thread Impact** | Non-blocking (other tasks run on event loop)| Releases thread to execute concurrent tasks |",
        "keyConcepts": "async def, await expression, Awaitables, Event loop scheduling, Non-blocking I/O",
        "code": "import asyncio\n\nasync def compute():\n    return 42\n\nasync def main():\n    # await pauses 'main' without blocking thread until 'compute' finishes:\n    res = await compute()\n    print(\"Resolved async answer:\", res)\n\nasyncio.run(main())",
        "output": "Resolved async answer: 42"
      },
      {
        "id": 105,
        "title": "Context Manager",
        "topicId": 5,
        "topicName": "Object Model & Metaprogramming",
        "level": "Core Concept",
        "answer": "\"A Context Manager is a Python construct that simplifies resource management by guaranteeing setup and teardown actions around a code block using the `with` statement.\\n\\nIt implements the Context Management Protocol:\\n1. `__enter__()`: Prepares the resource (e.g. opening a file) and returns the bound target.\\n2. `__exit__(exc_type, exc_val, exc_tb)`: Always executes upon block completion or exception, handling resource release. It can suppress exceptions by returning `True`. Alternatively, `@contextlib.contextmanager` allows generator-based context managers.\"\n\n| Protocol Method | Execution Moment | Responsibilities |\n| --- | --- | --- |\n| **`__enter__()`** | Before entering `with` body | Acquire locks, open files, setup state; returns object |\n| **`__exit__()`** | After exiting `with` body | Close files, release locks; handles exceptions |\n| **Alternative** | `@contextlib.contextmanager` | Turns a generator containing `yield` into a context manager |",
        "keyConcepts": "__enter__, __exit__, Resource safety, contextlib, Exception suppression",
        "code": "class CustomResource:\n    def __enter__(self):\n        print(\"1. Resource acquired\")\n        return \"ResourceHandle\"\n    def __exit__(self, exc_type, exc_val, exc_tb):\n        print(\"2. Resource cleaned up safely\")\n        return False\n\nwith CustomResource() as res:\n    print(\"Using:\", res)",
        "output": "1. Resource acquired\nUsing: ResourceHandle\n2. Resource cleaned up safely"
      },
      {
        "id": 106,
        "title": "__new__() vs __init__()",
        "topicId": 5,
        "topicName": "Object Model & Metaprogramming",
        "level": "Core Concept",
        "answer": "\"__new__() is the actual object creator method. It is a static method that allocates and returns a brand new uninitialized instance of the class in heap memory.\\n\\n__init__() is the object initializer method. It receives the newly created instance (`self`) from `__new__()` and sets up instance attributes and state. When customizing immutable types (like inheriting from `int`, `str`, or `tuple`) or implementing Singletons, you must override `__new__()`.\"\n\n| Feature | `__new__(cls, *args, **kwargs)` | `__init__(self, *args, **kwargs)` |\n| --- | --- | --- |\n| **Responsibility** | Object creation (memory allocation) | Object initialization (attribute setup) |\n| **First Argument** | Class object (`cls`) | Newly instantiated instance (`self`) |\n| **Return Value** | MUST return a new instance of `cls` | MUST return `None` (returns nothing) |\n| **Execution Order**| Executes FIRST | Executes SECOND (only if `__new__` returns instance) |\n| **Use Cases** | Singletons, immutable subclasses, metaclasses | Standard instance initialization |",
        "keyConcepts": "__new__ allocator, __init__ initializer, Singleton pattern, Immutable subclassing",
        "code": "class Singleton:\n    _instance = None\n    def __new__(cls):\n        if cls._instance is None:\n            cls._instance = super().__new__(cls)\n        return cls._instance\n\ns1 = Singleton()\ns2 = Singleton()\nprint(\"s1 is s2?\", s1 is s2)",
        "output": "s1 is s2? True"
      },
      {
        "id": 107,
        "title": "@staticmethod vs @classmethod vs Instance Method",
        "topicId": 5,
        "topicName": "Object Model & Metaprogramming",
        "level": "Core Concept",
        "answer": "\"Instance Methods receive the instance (`self`) as their implicit first parameter and can read/mutate instance state.\\n\\n@classmethod methods receive the class object (`cls`) as their implicit first parameter. They can modify class state, access class variables, and are widely used as alternative factory constructors.\\n\\n@staticmethod methods do not receive an implicit first parameter (neither `self` nor `cls`). They are plain utility functions namespaced inside the class for logical organization.\"\n\n| Method Type | Decorator | First Implicit Parameter | Can Access |\n| --- | --- | --- | --- |\n| **Instance Method** | None (default) | `self` (instance) | Instance state AND Class state |\n| **Class Method** | `@classmethod` | `cls` (class type) | Class state only (no instance state) |\n| **Static Method** | `@staticmethod` | None | Only arguments explicitly passed to it |",
        "keyConcepts": "self vs cls, Factory constructors, Namespace encapsulation, Bound vs Unbound methods",
        "code": "class User:\n    species = \"Homo sapiens\"\n    def __init__(self, name):\n        self.name = name\n    \n    @classmethod\n    def from_dict(cls, data):\n        return cls(data[\"name\"])  # Factory constructor\n\n    @staticmethod\n    def validate_name(name):\n        return len(name) > 0\n\nu = User.from_dict({\"name\": \"Bob\"})\nprint(\"Created user:\", u.name, \"| Valid:\", User.validate_name(\"Bob\"))",
        "output": "Created user: Bob | Valid: True"
      },
      {
        "id": 108,
        "title": "MRO (Method Resolution Order)",
        "topicId": 5,
        "topicName": "Object Model & Metaprogramming",
        "level": "Core Concept",
        "answer": "\"Method Resolution Order (MRO) is the deterministic order in which Python searches for an attribute or method across complex inheritance graphs and multiple inheritance.\\n\\nPython uses the C3 Linearization algorithm to compute the MRO, guaranteeing three vital properties: monotonicity (subclasses precede base classes), preservation of local precedence order (declared order of base classes), and consistency across hierarchies. You can inspect a class's MRO using `Class.__mro__` or `Class.mro()`.\"\n\n| Feature | C3 Linearization / MRO |\n| --- | --- | --- |\n| **Algorithm** | C3 Linearization algorithm (standard since Python 2.3) |\n| **Properties** | Monotonic, local precedence preserved, consistent |\n| **Diamond Resolution**| Resolves diamond inheritance unambiguously |\n| **Inspection** | `ClassName.__mro__` (tuple) or `ClassName.mro()` (list) |\n| **Invalid Graphs** | Raises `TypeError: Cannot create a consistent method resolution order` |",
        "keyConcepts": "C3 linearization, Monotonicity, Local precedence, Diamond problem, __mro__",
        "code": "class A: pass\nclass B(A): pass\nclass C(A): pass\nclass D(B, C): pass\n\nprint(\"Computed MRO for D:\", [cls.__name__ for cls in D.__mro__])",
        "output": "Computed MRO for D: ['D', 'B', 'C', 'A', 'object']"
      },
      {
        "id": 109,
        "title": "Duck Typing",
        "topicId": 5,
        "topicName": "Object Model & Metaprogramming",
        "level": "Core Concept",
        "answer": "\"Duck Typing is a dynamic typing philosophy rooted in the phrase: \\\"If it walks like a duck and quacks like a duck, it's a duck.\\\"\\n\\nIn Python, an object's suitability is determined not by its explicit class inheritance hierarchy (`isinstance(x, ExpectedClass)`), but solely by whether it provides the required methods and attributes (behavioral contract). This enables seamless polymorphism without rigid interface inheritance.\"\n\n| Feature | Duck Typing (Pythonic) | Nominal Typing (Static OOP) |\n| --- | --- | --- |\n| **Validation** | Checks behaviors / methods at runtime | Checks explicit class inheritance at compile time |\n| **Philosophy** | EAFP (Easier to Ask for Forgiveness than Permission)| LBYL (Look Before You Leap) |\n| **Flexibility** | Any object implementing the method works | Requires implementing explicit interfaces |\n| **Coupling** | Zero inheritance coupling | Tight coupling to interface contracts |",
        "keyConcepts": "Duck typing, Behavioral polymorphism, EAFP vs LBYL, Dynamic typing flexibility",
        "code": "class Duck:\n    def quack(self): return \"Quack quack!\"\n\nclass Person:\n    def quack(self): return \"I am mimicking a duck!\"\n\ndef make_it_quack(entity):\n    # Depends only on behavior, not nominal type:\n    print(entity.quack())\n\nmake_it_quack(Duck())\nmake_it_quack(Person())",
        "output": "Quack quack!\nI am mimicking a duck!"
      },
      {
        "id": 110,
        "title": "Monkey Patching",
        "topicId": 5,
        "topicName": "Object Model & Metaprogramming",
        "level": "Core Concept",
        "answer": "\"Monkey Patching is the dynamic modification of a module, class, or method at runtime without altering the original source code on disk.\\n\\nBecause Python classes and modules are mutable dictionaries at runtime, functions can be swapped dynamically. While widely used in unit testing to mock network calls or patch third-party library bugs temporarily, overusing monkey patching in production makes code fragile and hard to debug.\"\n\n| Feature | Standard Code | Monkey Patching |\n| --- | --- | --- |\n| **Modification Point** | Source code files edited on disk | Swapped in-memory at runtime dynamically |\n| **Scope** | Permanent across all runs | Temporary during process execution |\n| **Best Used For** | Application architecture | Mocking in unit tests (`unittest.mock`), hotfixes |\n| **Risks** | None | Hard-to-trace bugs, race conditions, unexpected behavior |",
        "keyConcepts": "Runtime mutation, Mocking, Dynamic attribute replacement, Debugging risks",
        "code": "class Service:\n    def fetch(self):\n        return \"Production DB Data\"\n\ns = Service()\n# Monkey patch the method at runtime:\ndef mock_fetch(self):\n    return \"Mocked Test Data\"\n\nService.fetch = mock_fetch\nprint(\"After Monkey Patch:\", s.fetch())",
        "output": "After Monkey Patch: Mocked Test Data"
      },
      {
        "id": 111,
        "title": "Mutable Default Arguments",
        "topicId": 6,
        "topicName": "Memory, Hazards & Internals",
        "level": "Core Concept",
        "answer": "\"In Python, default parameter expressions are evaluated ONCE at function definition time when the module loads, NOT each time the function is called.\\n\\nIf you use a mutable object (like a list `[]` or dictionary `{}`) as a default argument, all subsequent calls that omit that parameter will mutate and share the exact same underlying object!\\n\\nThe Pythonic Fix: Default the parameter to `None`, and initialize a fresh mutable instance inside the function body.\"\n\n| Pattern | Buggy Mutable Default | Safe Idiomatic Pattern |\n| --- | --- | --- |\n| **Signature** | `def add(item, lst=[])` | `def add(item, lst=None)` |\n| **Object Creation** | Created ONCE at module import | Created FRESH on every invocation if `None` |\n| **State Retention** | Retains state across distinct calls! | Completely isolated per call |\n| **Safety** | High bug hazard | 100% bug-free standard idiom |",
        "keyConcepts": "Function definition time evaluation, Shared mutable state trap, Default to None idiom",
        "code": "# Safe Pythonic Pattern:\ndef append_to(item, target=None):\n    if target is None:\n        target = []\n    target.append(item)\n    return target\n\nprint(\"Call 1:\", append_to(10))\nprint(\"Call 2:\", append_to(20))  # Completely independent!",
        "output": "Call 1: [10]\nCall 2: [20]"
      },
      {
        "id": 112,
        "title": "Python Memory Management",
        "topicId": 6,
        "topicName": "Memory, Hazards & Internals",
        "level": "Core Concept",
        "answer": "\"CPython uses a multi-layered memory architecture:\\n\\n1. **Layer 0 & 1:** OS Allocator (`malloc`) and Python Core Allocator managing arenas (256KB chunks).\\n2. **Layer 2 (PyObject):** PyMalloc manages small object allocations (< 512 bytes) divided into 4KB pools and 8-byte to 512-byte blocks to prevent fragmentation.\\n3. **Deallocation:** Managed primarily by immediate Reference Counting. To resolve circular reference leaks, a generational cyclic Garbage Collector (Generations 0, 1, 2) runs periodically using pointer traversal.\"\n\n| Subsystem | Primary Function | Characteristics |\n| --- | --- | --- |\n| **Reference Counting** | Immediate deallocation upon count == 0 | Deterministic, zero-pause, handles 99% of objects |\n| **Cyclic GC** | Detects & frees circular reference graphs | Generational (Gen 0, 1, 2) threshold-triggered |\n| **PyMalloc** | Small object allocator (< 512 bytes) | Allocates 256KB arenas, 4KB pools, fast free-lists |\n| **GIL** | Mutex protecting memory subsystem | Prevents race conditions on reference counters |",
        "keyConcepts": "PyMalloc, Reference counting, Cyclic generational GC, Arenas and Pools, Small object allocator",
        "code": "import sys, gc\n\nx = [1, 2, 3]\nprint(\"Reference count of x:\", sys.getrefcount(x))  # Includes arg to getrefcount\n\n# Circular reference handled by cyclic GC:\na = []; b = []\na.append(b); b.append(a)\ndel a, b\nprint(\"Unreachable circular objects collected:\", gc.collect())",
        "output": "Reference count of x: 2\nUnreachable circular objects collected: 2"
      },
      {
        "id": 113,
        "title": "Metaclasses",
        "topicId": 5,
        "topicName": "Object Model & Metaprogramming",
        "level": "Core Concept",
        "answer": "\"A Metaclass is the 'class of a class'. Just as a regular class defines the rules, attributes, and behavior for object instances, a metaclass defines the rules, attributes, and instantiation behavior for class definitions themselves.\\n\\nIn Python, `type` is the default built-in metaclass that constructs all classes. By inheriting from `type` and overriding `__new__` or `__init__`, you can intercept, validate, register, or modify class definitions at the moment they are compiled (e.g. Django ORM models, Pydantic, ABCMeta).\"\n\n| Entity | Defined By | Instantiates |\n| --- | --- | --- |\n| **Instance** | Class blueprint | Concrete object at runtime |\n| **Class** | Metaclass (default `type`) | Class object in memory |\n| **Metaclass** | Inherits from `type` | Custom class definitions with validations |\n| **Famous Quote** | Tim Peters: \\\"Metaclasses are deeper magic than 99% of users should ever worry about.\\\" |",
        "keyConcepts": "Class of a class, type metaclass, Class creation interception, Tim Peters quote, Framework validation",
        "code": "class EnforceUpperMeta(type):\n    def __new__(cls, name, bases, dct):\n        # Enforce that all custom method names must be uppercase:\n        uppercase_attrs = {}\n        for k, v in dct.items():\n            if not k.startswith(\"__\") and callable(v):\n                uppercase_attrs[k.upper()] = v\n            else:\n                uppercase_attrs[k] = v\n        return super().__new__(cls, name, bases, uppercase_attrs)\n\nclass Sample(metaclass=EnforceUpperMeta):\n    def greet(self): return \"Hello from uppercase!\"\n\ns = Sample()\nprint(\"Enforced uppercase method:\", s.GREET())",
        "output": "Enforced uppercase method: Hello from uppercase!"
      },
      {
        "id": 114,
        "title": "Dunder / Magic Methods",
        "topicId": 5,
        "topicName": "Object Model & Metaprogramming",
        "level": "Core Concept",
        "answer": "\"Dunder (Double Underscore) or Magic Methods are special reserved methods in Python prefixed and suffixed with double underscores (e.g. `__init__`, `__str__`, `__len__`, `__getitem__`).\\n\\nThey allow custom classes to hook into Python's built-in operators and core language protocols: operator overloading (`+` $\\rightarrow$ `__add__`), string representations (`__repr__`, `__str__`), collection indexing (`__getitem__`), and context managers (`__enter__`, `__exit__`), enabling your classes to feel completely native to Python.\"\n\n| Protocol | Built-in Call | Dunder Hook |\n| --- | --- | --- |\n| **String Representation** | `str(obj)` / `print(obj)` | `__str__(self)` |\n| **Debugging Representation**| `repr(obj)` | `__repr__(self)` |\n| **Length** | `len(obj)` | `__len__(self)` |\n| **Index / Subscript** | `obj[key]` | `__getitem__(self, key)` |\n| **Arithmetic Addition** | `a + b` | `__add__(self, other)` |\n| **Equality** | `a == b` | `__eq__(self, other)` |",
        "keyConcepts": "Dunder methods, Operator overloading, Python data model protocols, __str__ vs __repr__",
        "code": "class Vector:\n    def __init__(self, x, y):\n        self.x, self.y = x, y\n    def __add__(self, other):\n        return Vector(self.x + other.x, self.y + other.y)\n    def __repr__(self):\n        return f\"Vector({self.x}, {self.y})\"\n\nv1 = Vector(2, 3)\nv2 = Vector(5, 7)\nprint(\"Overloaded operator +:\", v1 + v2)",
        "output": "Overloaded operator +: Vector(7, 10)"
      }
    ]
  }
};
