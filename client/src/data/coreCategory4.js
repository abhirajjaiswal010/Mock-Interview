export const category4 = {
  "id": 204,
  "title": "4. Java-Specific Concepts",
  "shortTitle": "Category 4",
  "subtitle": "25 Core Concepts: JVM Internals, Collections, Concurrency & Memory Model",
  "description": "Master essential Java platform architecture: JDK/JRE/JVM, String Pool, HashCode/Equals contract, Collections concurrency, ClassLoaders, JVM GC algorithms, and Java Memory Model (JMM).",
  "questionCount": 25,
  "topicCount": 4,
  "status": "available",
  "data": {
    "phase": "4. Java-Specific Concepts",
    "totalQuestions": 25,
    "topics": [
      {
        "id": 1,
        "name": "JVM Architecture & Memory Internals",
        "range": [
          61,
          85
        ],
        "count": 6
      },
      {
        "id": 2,
        "name": "Java Core Types, Exceptions & Contracts",
        "range": [
          62,
          75
        ],
        "count": 8
      },
      {
        "id": 3,
        "name": "Collections Framework & Generics",
        "range": [
          66,
          82
        ],
        "count": 7
      },
      {
        "id": 4,
        "name": "Concurrency & Multithreading",
        "range": [
          78,
          81
        ],
        "count": 4
      }
    ],
    "questions": [
      {
        "id": 61,
        "title": "JDK vs JRE vs JVM",
        "topicId": 1,
        "topicName": "JVM Architecture & Memory Internals",
        "level": "Core Concept",
        "answer": "\"JVM (Java Virtual Machine) is the abstract execution engine that loads, verifies, and executes Java bytecode, providing memory management and garbage collection.\\n\\nJRE (Java Runtime Environment) bundles the JVM together with standard core class libraries (rt.jar, java.lang, etc.) and supporting files needed to run compiled Java applications.\\n\\nJDK (Java Development Kit) is the full developer superset containing the JRE plus development tools like the compiler (`javac`), debugger (`jdb`), archiver (`jar`), and monitoring tools (`jconsole`).\"\n\n| Component | Contains | Primary Audience | Key Tool / Responsibility |\n| --- | --- | --- | --- |\n| **JVM** | Execution engine, JIT compiler, GC | Runtime host | Translates `.class` bytecode to machine code |\n| **JRE** | JVM + Standard Class Libraries | End users / Production servers | Runs pre-compiled Java applications |\n| **JDK** | JRE + Dev Tools (`javac`, `jdb`, `javap`) | Java Developers | Compiles `.java` source code into `.class` files |",
        "keyConcepts": "JVM, JRE, JDK, Bytecode, JIT Compiler, javac, Platform Independence",
        "code": "// Java command line relationships:\n// 1. Compile source into bytecode: javac App.java -> App.class (Requires JDK)\n// 2. Execute bytecode:            java App (Requires JRE/JVM)\npublic class CheckRuntime {\n    public static void main(String[] args) {\n        System.out.println(\"Java Version: \" + System.getProperty(\"java.version\"));\n        System.out.println(\"JVM Name:     \" + System.getProperty(\"java.vm.name\"));\n    }\n}",
        "output": "Java Version: 21.0.2\nJVM Name:     OpenJDK 64-Bit Server VM"
      },
      {
        "id": 62,
        "title": "== vs equals()",
        "topicId": 2,
        "topicName": "Java Core Types, Exceptions & Contracts",
        "level": "Core Concept",
        "answer": "\"In Java, `==` is a binary reference equality operator that tests whether two object references point to the exact same memory address on the heap (or compares raw bit values for primitives).\\n\\n`.equals()` is a method inherited from `java.lang.Object` intended for logical/value equivalence. By default in `Object`, it behaves identical to `==`, but classes like `String`, `Integer`, and `Date` override it to compare meaningful inner values.\"\n\n| Feature | `==` Operator | `.equals()` Method |\n| --- | --- | --- |\n| **Nature** | Primitive / Binary Operator | Method on `java.lang.Object` |\n| **Primitives** | Compares primitive values (e.g., `5 == 5`) | Inapplicable (primitives are not objects) |\n| **Objects** | Checks memory reference address equality | Checks semantic / logical value equality |\n| **Customizable** | Cannot be overloaded in Java | Can be overridden in any custom class |\n| **Null Safety** | Safe against `null` (`a == null`) | Throws `NullPointerException` if caller `a` is null |",
        "keyConcepts": "Reference equality vs Value equality, Memory address, Null safety, Object.equals()",
        "code": "public class EqualityDemo {\n    public static void main(String[] args) {\n        String s1 = new String(\"interview\");\n        String s2 = new String(\"interview\");\n        System.out.println(\"s1 == s2:      \" + (s1 == s2));      // false: distinct heap addresses\n        System.out.println(\"s1.equals(s2): \" + s1.equals(s2));  // true: identical character values\n    }\n}",
        "output": "s1 == s2:      false\ns1.equals(s2): true"
      },
      {
        "id": 63,
        "title": "String vs StringBuilder vs StringBuffer",
        "topicId": 2,
        "topicName": "Java Core Types, Exceptions & Contracts",
        "level": "Core Concept",
        "answer": "\"String is an immutable character sequence. Every modification creates a new object on the heap, making repeated concatenation inside loops inefficient.\\n\\nStringBuilder is a mutable sequence of characters designed for single-threaded high-performance string manipulation; its methods are unsynchronized.\\n\\nStringBuffer is also mutable, but all of its public methods are `synchronized`, making it thread-safe for concurrent access at the cost of synchronization overhead.\"\n\n| Feature | String | StringBuilder | StringBuffer |\n| --- | --- | --- | --- |\n| **Mutability** | Immutable | Mutable | Mutable |\n| **Thread Safety** | Inherently thread-safe | Not thread-safe | Thread-safe (`synchronized`) |\n| **Performance** | Slow for modifications | Fastest for mutations | Slower due to lock overhead |\n| **Memory Storage** | String Pool / Heap | Heap buffer | Heap buffer |\n| **Best Used When** | Infrequent changes / Constants | Loops / String building (1 thread) | Multi-threaded shared builder |",
        "keyConcepts": "Immutability, Mutable buffer, Synchronization, Thread-safety, String concatenation overhead",
        "code": "public class StringPerfDemo {\n    public static void main(String[] args) {\n        StringBuilder sb = new StringBuilder(\"Hello\");\n        sb.append(\" \").append(\"World\");\n        System.out.println(\"Mutable StringBuilder: \" + sb.toString());\n    }\n}",
        "output": "Mutable StringBuilder: Hello World"
      },
      {
        "id": 64,
        "title": "final vs finally vs finalize()",
        "topicId": 2,
        "topicName": "Java Core Types, Exceptions & Contracts",
        "level": "Core Concept",
        "answer": "\"final is a modifier keyword applied to variables (making them constants), methods (preventing overriding), or classes (preventing inheritance).\\n\\nfinally is a block in exception handling (`try-catch-finally`) that is guaranteed to execute regardless of whether an exception is thrown or caught, ideal for resource cleanup.\\n\\nfinalize() is a deprecated method on `java.lang.Object` invoked by the Garbage Collector prior to object destruction. It is non-deterministic and replaced by `AutoCloseable`.\"\n\n| Keyword | Entity Type | Purpose | Guarantees |\n| --- | --- | --- | --- |\n| **final** | Modifier keyword | Immutability, prevent overriding/subclassing | Compile-time restriction |\n| **finally** | Code block | Cleanup code in exception handling | Executes even after `return` in try/catch |\n| **finalize()**| Protected method | Legacy destructor hook prior to GC | Non-deterministic; deprecated in Java 9+ |",
        "keyConcepts": "final modifier, Exception handling, Resource cleanup, Deprecated finalizer, try-with-resources",
        "code": "public class FinalDemo {\n    public static void main(String[] args) {\n        final int MAX = 100;\n        try {\n            System.out.println(\"Inside try block\");\n        } finally {\n            System.out.println(\"Finally block always executes!\");\n        }\n    }\n}",
        "output": "Inside try block\nFinally block always executes!"
      },
      {
        "id": 65,
        "title": "Checked vs Unchecked Exceptions",
        "topicId": 2,
        "topicName": "Java Core Types, Exceptions & Contracts",
        "level": "Core Concept",
        "answer": "\"Checked Exceptions are subclasses of `java.lang.Exception` (excluding `RuntimeException`) that the compiler forces you to handle via `try-catch` or declare via `throws` (e.g., `IOException`, `SQLException`).\\n\\nUnchecked Exceptions are subclasses of `java.lang.RuntimeException` and `Error`. They represent programming errors (e.g., `NullPointerException`, `ArrayIndexOutOfBoundsException`) and do not require mandatory compile-time handling.\"\n\n| Feature | Checked Exception | Unchecked Exception |\n| --- | --- | --- |\n| **Inherits From** | `java.lang.Exception` | `java.lang.RuntimeException` or `java.lang.Error` |\n| **Compiler Enforcement**| Mandatory (`try-catch` or `throws`) | Optional / Unchecked by compiler |\n| **Typical Cause** | External system failures (file missing, network down)| Logic bugs (null dereference, bad cast, divide by 0) |\n| **Recovery** | Application is expected to recover gracefully | Usually fatal bug; fix code rather than recover |\n| **Examples** | `IOException`, `ClassNotFoundException` | `NullPointerException`, `IllegalArgumentException` |",
        "keyConcepts": "Compile-time checked, RuntimeException, throws clause, Recoverable vs Unrecoverable errors",
        "code": "import java.io.*;\n\npublic class ExceptionDemo {\n    // Checked exception: must be declared in method signature\n    public static void readFile() throws IOException {\n        throw new IOException(\"File not found on disk\");\n    }\n\n    // Unchecked exception: runtime failure\n    public static void divide(int a, int b) {\n        int res = a / b; // ArithmeticException if b == 0\n    }\n}",
        "output": "[Compiled successfully - Checked requires declaration, Unchecked does not]"
      },
      {
        "id": 66,
        "title": "Array vs ArrayList",
        "topicId": 3,
        "topicName": "Collections Framework & Generics",
        "level": "Core Concept",
        "answer": "\"An Array is a core Java primitive-level fixed-size contiguous sequence of elements that can store both primitives and objects. Its size is fixed at allocation time.\\n\\nArrayList is a dynamic resizable collection class in `java.util` built on top of an internal array. It automatically resizes itself by 50% when full, supports rich Collection methods, but only stores object references (autoboxing primitives).\"\n\n| Feature | Array (`int[]` / `T[]`) | ArrayList (`ArrayList<T>`) |\n| --- | --- | --- |\n| **Size** | Fixed at instantiation | Dynamic / Resizable (grows by 1.5x) |\n| **Primitive Support** | Supports primitives (`int[]`) with zero boxing overhead | Only stores objects; requires Wrapper autoboxing |\n| **Performance** | Fastest (direct memory indexing) | Slightly slower due to method calls and resizing |\n| **Generics** | Covariant and reified at runtime | Invariant with compile-time type erasure |\n| **Utility Methods** | Limited (via `Arrays.sort()`, `.length`) | Rich (`.add()`, `.remove()`, `.contains()`, `.stream()`) |",
        "keyConcepts": "Fixed vs Dynamic sizing, Primitives vs Autoboxing, Growth factor 1.5x, Reified vs Erased types",
        "code": "import java.util.ArrayList;\n\npublic class ArrayVsArrayList {\n    public static void main(String[] args) {\n        int[] fixedArray = new int[3];\n        fixedArray[0] = 10;\n\n        ArrayList<Integer> dynamicList = new ArrayList<>();\n        dynamicList.add(10);\n        dynamicList.add(20);\n        dynamicList.add(30);\n        System.out.println(\"Dynamic List size: \" + dynamicList.size());\n    }\n}",
        "output": "Dynamic List size: 3"
      },
      {
        "id": 67,
        "title": "HashMap vs Hashtable",
        "topicId": 3,
        "topicName": "Collections Framework & Generics",
        "level": "Core Concept",
        "answer": "\"HashMap is a modern, unsynchronized hash-table-based map implementation in `java.util`. It permits one `null` key and multiple `null` values, is not thread-safe, and offers superior single-thread performance.\\n\\nHashtable is a legacy class from Java 1.0. All of its public methods are `synchronized`, making it thread-safe but slow. It strictly forbids `null` keys and `null` values. For concurrency, `ConcurrentHashMap` should always be used instead of `Hashtable`.\"\n\n| Feature | HashMap | Hashtable |\n| --- | --- | --- |\n| **Synchronization** | Unsynchronized (Not thread-safe) | Synchronized (Thread-safe) |\n| **Null Keys / Values**| Allows 1 null key and multiple null values | Throws `NullPointerException` on null key/value |\n| **Performance** | High (zero locking overhead) | Slow (coarse-grained method-level locking) |\n| **Introduction** | Java 1.2 (Collections Framework) | Java 1.0 (Legacy dictionary class) |\n| **Iteration Mechanism**| Fail-fast `Iterator` | `Enumerator` and Fail-fast `Iterator` |",
        "keyConcepts": "Thread safety, Synchronization overhead, Null key handling, ConcurrentHashMap replacement",
        "code": "import java.util.HashMap;\n\npublic class MapDemo {\n    public static void main(String[] args) {\n        HashMap<String, String> map = new HashMap<>();\n        map.put(null, \"AllowedNullValue\"); // Valid in HashMap\n        System.out.println(\"Null key in HashMap: \" + map.get(null));\n    }\n}",
        "output": "Null key in HashMap: AllowedNullValue"
      },
      {
        "id": 68,
        "title": "HashMap vs ConcurrentHashMap",
        "topicId": 3,
        "topicName": "Collections Framework & Generics",
        "level": "Core Concept",
        "answer": "\"HashMap is not thread-safe. Concurrent modifications can lead to race conditions, silent data corruption, or infinite loops in older Java versions.\\n\\nConcurrentHashMap provides high-concurrency thread safety without locking the entire map. In Java 8+, it uses fine-grained bucket-level locks (synchronizing only on the first node of the bucket) alongside lock-free atomic CAS (Compare-And-Swap) reads, permitting simultaneous non-blocking reads and concurrent writes.\"\n\n| Feature | HashMap | ConcurrentHashMap |\n| --- | --- | --- |\n| **Thread Safety** | None (unsafe for concurrent writes) | Fully thread-safe |\n| **Locking Strategy** | No locks | Bucket-level synchronized nodes + CAS reads |\n| **Null Support** | Allows 1 null key and null values | Forbids null keys and null values |\n| **Concurrent Reads** | Prone to reading corrupt state during resize | Lock-free, highly scalable reads |\n| **Iterator Behavior** | Fail-fast (throws `ConcurrentModificationException`) | Weakly consistent (never throws CME during iteration) |",
        "keyConcepts": "CAS (Compare-And-Swap), Bucket-level locking, Weakly consistent iterator, Lock striping",
        "code": "import java.util.concurrent.ConcurrentHashMap;\n\npublic class ConcurrentDemo {\n    public static void main(String[] args) {\n        ConcurrentHashMap<String, Integer> chm = new ConcurrentHashMap<>();\n        chm.put(\"A\", 1);\n        chm.computeIfPresent(\"A\", (k, v) -> v + 10);\n        System.out.println(\"Thread-safe atomic update: \" + chm.get(\"A\"));\n    }\n}",
        "output": "Thread-safe atomic update: 11"
      },
      {
        "id": 69,
        "title": "Comparable vs Comparator",
        "topicId": 3,
        "topicName": "Collections Framework & Generics",
        "level": "Core Concept",
        "answer": "\"Comparable is an interface (`java.lang.Comparable`) implemented inside the domain class itself to define its natural ordering via `compareTo(T o)`.\\n\\nComparator is an external functional interface (`java.util.Comparator`) implemented outside the domain class to define custom, multiple, or alternative sorting sequences via `compare(T o1, T o2)` without modifying the original class source code.\"\n\n| Feature | Comparable | Comparator |\n| --- | --- | --- |\n| **Package** | `java.lang` | `java.util` |\n| **Method** | `compareTo(T o)` (1 argument) | `compare(T o1, T o2)` (2 arguments) |\n| **Sorting Type** | Natural / Default sequence | Custom / Multiple sorting strategies |\n| **Class Modification**| Requires modifying the target class | Does not modify target class (open for extension) |\n| **Usage** | `Collections.sort(list)` | `Collections.sort(list, comparator)` or Lambdas |",
        "keyConcepts": "Natural ordering, Custom sorting, compareTo vs compare, Functional interface, Lambda sorting",
        "code": "import java.util.*;\n\nclass Student implements Comparable<Student> {\n    int age;\n    Student(int a) { this.age = a; }\n    public int compareTo(Student other) { return Integer.compare(this.age, other.age); }\n}\n\npublic class SortDemo {\n    public static void main(String[] args) {\n        List<Student> list = Arrays.asList(new Student(22), new Student(19));\n        Collections.sort(list); // Natural sort via Comparable\n        System.out.println(\"Youngest student age: \" + list.get(0).age);\n    }\n}",
        "output": "Youngest student age: 19"
      },
      {
        "id": 70,
        "title": "Interface Default vs Static Methods",
        "topicId": 2,
        "topicName": "Java Core Types, Exceptions & Contracts",
        "level": "Core Concept",
        "answer": "\"Introduced in Java 8 to enable backward compatibility with lambda expressions:\\n\\nDefault Methods (declared with `default`) have a method body and are inherited by implementing classes. Subclasses can either inherit them as-is or override them.\\n\\nStatic Methods in interfaces have a body and belong strictly to the interface itself. They cannot be overridden by implementing classes and must be invoked directly using the interface name (`InterfaceName.method()`).\"\n\n| Feature | Default Method | Static Method |\n| --- | --- | --- |\n| **Keyword** | `default` | `static` |\n| **Inherited by Class**| Yes, available on subclass instance | No, not inherited into implementing class |\n| **Can Be Overridden** | Yes, implementing classes can override | No, cannot be overridden |\n| **Invocation** | On class instance (`obj.defaultMethod()`) | On Interface type (`InterfaceName.staticMethod()`) |\n| **Purpose** | Backward-compatible API evolution | Utility helper methods scoped to interface |",
        "keyConcepts": "Java 8 interface evolution, Default method, Diamond resolution, Static utility method",
        "code": "interface Greeter {\n    default void sayHello() { System.out.println(\"Default hello!\"); }\n    static void info() { System.out.println(\"Static greeter utility\"); }\n}\n\nclass User implements Greeter {}\n\npublic class InterfaceDemo {\n    public static void main(String[] args) {\n        new User().sayHello();\n        Greeter.info();\n    }\n}",
        "output": "Default hello!\nStatic greeter utility"
      },
      {
        "id": 71,
        "title": "Primitive vs Wrapper Classes",
        "topicId": 2,
        "topicName": "Java Core Types, Exceptions & Contracts",
        "level": "Core Concept",
        "answer": "\"Primitive Types (`byte`, `short`, `int`, `long`, `float`, `double`, `boolean`, `char`) are basic raw values stored directly on the stack with minimal memory footprint and maximum computational speed.\\n\\nWrapper Classes (`Byte`, `Integer`, `Double`, etc.) are full-fledged objects in `java.lang` that encapsulate a primitive value in a heap object. They allow primitives to be used in generic collections, support `null` values, and provide utility methods.\"\n\n| Feature | Primitive Types | Wrapper Classes |\n| --- | --- | --- |\n| **Memory Allocation** | Stack memory (direct binary value) | Heap memory (object header + reference + payload) |\n| **Memory Size** | Compact (e.g. `int` is 4 bytes) | Expensive (e.g. `Integer` is 16-24 bytes on heap) |\n| **Null Support** | Cannot be null (default to 0/false) | Can hold `null` (represents missing value) |\n| **Collections & Generics**| Cannot be used as generic types (`List<int>` invalid) | Supported (`List<Integer>`) |\n| **Performance** | Blazing fast (direct CPU registers) | Slower due to heap dereferencing and GC pressure |",
        "keyConcepts": "Primitives, Wrapper classes, Heap overhead, Nullability, Generic type parameters",
        "code": "public class PrimitiveWrapperDemo {\n    public static void main(String[] args) {\n        int prim = 42;                 // Direct 4-byte stack allocation\n        Integer wrap = Integer.valueOf(42); // Heap object with utility methods\n        System.out.println(\"Binary string from wrapper: \" + Integer.toBinaryString(prim));\n    }\n}",
        "output": "Binary string from wrapper: 101010"
      },
      {
        "id": 72,
        "title": "Autoboxing vs Unboxing",
        "topicId": 2,
        "topicName": "Java Core Types, Exceptions & Contracts",
        "level": "Core Concept",
        "answer": "\"Autoboxing is the automatic conversion performed by the Java compiler from a primitive type to its corresponding wrapper class object (e.g., converting `int` to `Integer` via `Integer.valueOf()`).\\n\\nUnboxing is the reverse automatic conversion from a wrapper object to its corresponding primitive value (e.g., converting `Integer` to `int` via `.intValue()`). If an unboxed wrapper is `null`, it throws `NullPointerException`.\"\n\n| Feature | Autoboxing | Unboxing |\n| --- | --- | --- |\n| **Conversion** | Primitive $\\rightarrow$ Wrapper Object | Wrapper Object $\\rightarrow$ Primitive |\n| **Underlying Call** | `Integer.valueOf(val)` | `integerObj.intValue()` |\n| **Trigger Example** | Adding primitive to collection `list.add(10)` | Assigning wrapper to primitive `int x = list.get(0)` |\n| **Crash Hazard** | None | Throws `NullPointerException` if wrapper is `null` |\n| **Performance Risk** | Silent heap allocation in tight loops | Negligible overhead |",
        "keyConcepts": "Autoboxing, Unboxing, Integer.valueOf(), NullPointerException trap, Performance overhead",
        "code": "public class BoxingDemo {\n    public static void main(String[] args) {\n        Integer boxed = 100;     // Autoboxing: Integer.valueOf(100)\n        int unboxed = boxed;     // Unboxing: boxed.intValue()\n        System.out.println(\"Boxed & unboxed value: \" + unboxed);\n    }\n}",
        "output": "Boxed & unboxed value: 100"
      },
      {
        "id": 73,
        "title": "Stack vs Heap in Java",
        "topicId": 1,
        "topicName": "JVM Architecture & Memory Internals",
        "level": "Core Concept",
        "answer": "\"Stack Memory in Java is thread-private memory allocated per thread. It stores stack frames containing local primitives, method call parameters, and object reference variables in strict LIFO order. It is freed instantly upon method return.\\n\\nHeap Memory is shared across all threads in the JVM. It stores all object instances, arrays, and class member variables. Heap memory is managed by the Garbage Collector and throws `OutOfMemoryError` when full.\"\n\n| Feature | Java Stack | Java Heap |\n| --- | --- | --- |\n| **Thread Access** | Thread-isolated (one stack per thread) | Shared globally across all threads |\n| **Stores** | Local variables, method frames, references | All object instances, arrays, instance fields |\n| **Deallocation** | Instantaneous LIFO pop when method ends | Asynchronous Garbage Collection |\n| **Failure Error** | `java.lang.StackOverflowError` | `java.lang.OutOfMemoryError: Java heap space` |\n| **Sizing Flags** | `-Xss` (per thread stack size) | `-Xms` (initial heap), `-Xmx` (max heap) |",
        "keyConcepts": "Thread stack, Heap allocation, StackOverflowError, OutOfMemoryError, -Xmx, -Xss",
        "code": "public class MemoryModelDemo {\n    public void sampleMethod() {\n        int localPrimitive = 50;           // Resides on Thread Stack\n        String objRef = new String(\"Heap\"); // 'objRef' pointer on Stack, String object on Heap\n    }\n    public static void main(String[] args) {\n        new MemoryModelDemo().sampleMethod();\n        System.out.println(\"Execution completed cleanly.\");\n    }\n}",
        "output": "Execution completed cleanly."
      },
      {
        "id": 74,
        "title": "String Pool vs Heap",
        "topicId": 1,
        "topicName": "JVM Architecture & Memory Internals",
        "level": "Core Concept",
        "answer": "\"The String Constant Pool (String Intern Pool) is a specialized storage area located inside the JVM Heap that holds a single deduplicated copy of every unique string literal.\\n\\nWhen a string is declared as a literal (`String s = \\\"java\\\";`), the JVM checks the String Pool first and reuses the existing reference. When created with `new String(\\\"java\\\")`, a distinct object is explicitly allocated in regular heap memory, bypassing automatic pool deduplication unless `.intern()` is called.\"\n\n| Feature | String Constant Pool | Regular Heap Allocation |\n| --- | --- | --- |\n| **Creation Syntax** | String literal (`\"hello\"`) or `.intern()` | `new String(\"hello\")` |\n| **Deduplication** | Automatically deduplicated (shares references) | Distinct object created every time |\n| **Equality (`==`)** | Literals evaluate to `true` with `==` | Distinct objects evaluate to `false` with `==` |\n| **Memory Location** | Part of JVM Heap (since Java 7+) | Standard Young/Old Heap generations |\n| **Memory Impact** | Saves substantial memory for repetitive strings| Can cause redundant heap bloat |",
        "keyConcepts": "String Constant Pool, String.intern(), Literal deduplication, PermGen to Heap migration",
        "code": "public class StringPoolDemo {\n    public static void main(String[] args) {\n        String s1 = \"mock\";\n        String s2 = \"mock\";\n        String s3 = new String(\"mock\");\n        System.out.println(\"Pool check (s1 == s2): \" + (s1 == s2));      // true\n        System.out.println(\"Heap check (s1 == s3): \" + (s1 == s3));      // false\n        System.out.println(\"Interned check (s1 == s3.intern()): \" + (s1 == s3.intern())); // true\n    }\n}",
        "output": "Pool check (s1 == s2): true\nHeap check (s1 == s3): false\nInterned check (s1 == s3.intern()): true"
      },
      {
        "id": 75,
        "title": "HashCode vs Equals Contract",
        "topicId": 2,
        "topicName": "Java Core Types, Exceptions & Contracts",
        "level": "Core Concept",
        "answer": "\"The Java Object contract specifies that if two objects are equal according to `.equals()`, they MUST produce the exact same integer `.hashCode()`.\\n\\nIf you override `.equals()` without overriding `.hashCode()`, hash-based collections (`HashMap`, `HashSet`) will fail to find or retrieve elements, because they determine bucket indexes via `hashCode()` before calling `equals()`. Note that two unequal objects CAN have the same hash code (hash collision).\"\n\n| Rule | Condition | Requirement |\n| --- | --- | --- |\n| **Equal Objects** | If `a.equals(b) == true` | `a.hashCode() == b.hashCode()` MUST be true |\n| **Unequal Objects**| If `a.equals(b) == false` | Hash codes do NOT have to be distinct (collision) |\n| **Consistency** | State unchanged | Multiple invocations must return the same integer |\n| **Failure to Follow**| Overriding only `equals` | `HashMap.get(key)` returns `null` for equivalent keys! |",
        "keyConcepts": "Equals and HashCode contract, Hash collision, HashMap bucket resolution, Object identity",
        "code": "import java.util.Objects;\n\npublic class Person {\n    private final int id;\n    public Person(int id) { this.id = id; }\n\n    @Override\n    public boolean equals(Object o) {\n        if (this == o) return true;\n        if (!(o instanceof Person)) return false;\n        return id == ((Person) o).id;\n    }\n\n    @Override\n    public int hashCode() {\n        return Objects.hash(id); // Mandatory alongside equals()\n    }\n}",
        "output": "[Compiled cleanly - Both equals() and hashCode() overridden synchronously]"
      },
      {
        "id": 76,
        "title": "Fail-fast vs Fail-safe Iterators",
        "topicId": 3,
        "topicName": "Collections Framework & Generics",
        "level": "Core Concept",
        "answer": "\"Fail-fast Iterators operate directly on the collection's underlying data. If the collection is structurally modified (elements added or removed) during iteration by any means other than the iterator's own `remove()` method, the iterator immediately throws `ConcurrentModificationException` via internal `modCount` tracking.\\n\\nFail-safe (or Weakly Consistent) Iterators operate on a clone or snapshot of the collection (e.g. `CopyOnWriteArrayList`, `ConcurrentHashMap`). They never throw `ConcurrentModificationException`, but may not reflect concurrent modifications.\"\n\n| Feature | Fail-fast Iterator | Fail-safe / Weakly Consistent |\n| --- | --- | --- |\n| **Data Traversed** | Underlying original collection | Cloned snapshot or concurrent segment |\n| **Concurrent Modification**| Throws `ConcurrentModificationException` | Never throws CME during traversal |\n| **Internal Mechanism** | Checks `modCount != expectedModCount` | Cloned array / concurrent state traversal |\n| **Memory Overhead** | Zero extra memory | High memory overhead on writes (`CopyOnWrite`) |\n| **Examples** | `ArrayList`, `HashMap`, `HashSet` | `CopyOnWriteArrayList`, `ConcurrentHashMap` |",
        "keyConcepts": "ConcurrentModificationException, modCount, CopyOnWrite, Fail-safe snapshot, Iteration safety",
        "code": "import java.util.concurrent.CopyOnWriteArrayList;\nimport java.util.Iterator;\n\npublic class FailSafeDemo {\n    public static void main(String[] args) {\n        CopyOnWriteArrayList<String> list = new CopyOnWriteArrayList<>();\n        list.add(\"A\");\n        list.add(\"B\");\n        for (String s : list) {\n            list.add(\"C\"); // Safe! Does not throw ConcurrentModificationException\n        }\n        System.out.println(\"Safe List Size: \" + list.size());\n    }\n}",
        "output": "Safe List Size: 4"
      },
      {
        "id": 77,
        "title": "Iterator vs ListIterator",
        "topicId": 3,
        "topicName": "Collections Framework & Generics",
        "level": "Core Concept",
        "answer": "\"Iterator is a forward-only traversal interface that works across all Collection types (`List`, `Set`, `Queue`). It only supports forward traversal (`hasNext()`, `next()`) and element removal.\\n\\nListIterator is a specialized bidirectional iterator available only on `List` implementations. It supports forward and backward traversal (`hasPrevious()`, `previous()`), index tracking (`nextIndex()`), element replacement (`set()`), and element addition (`add()`).\"\n\n| Feature | Iterator | ListIterator |\n| --- | --- | --- |\n| **Applicability** | Any `Collection` (`List`, `Set`, `Queue`) | Exclusively `List` implementations |\n| **Direction** | Forward only | Bidirectional (Forward & Backward) |\n| **Modification Operations**| `remove()` only | `remove()`, `set()`, `add()` |\n| **Index Tracking** | No index awareness | Provides `nextIndex()` and `previousIndex()` |\n| **Factory Method** | `collection.iterator()` | `list.listIterator()` |",
        "keyConcepts": "Bidirectional traversal, ListIterator, previous(), Index retrieval, Collection modification",
        "code": "import java.util.*;\n\npublic class ListIteratorDemo {\n    public static void main(String[] args) {\n        List<String> list = new ArrayList<>(Arrays.asList(\"A\", \"B\", \"C\"));\n        ListIterator<String> it = list.listIterator();\n        while (it.hasNext()) { it.next(); }\n        System.out.print(\"Reverse traversal: \");\n        while (it.hasPrevious()) {\n            System.out.print(it.previous() + \" \");\n        }\n    }\n}",
        "output": "Reverse traversal: C B A "
      },
      {
        "id": 78,
        "title": "Synchronized vs Volatile",
        "topicId": 4,
        "topicName": "Concurrency & Multithreading",
        "level": "Core Concept",
        "answer": "\"volatile is a field-level variable modifier that guarantees visibility and ordering across threads. It instructs the CPU to read and write directly to main memory rather than caching variables in CPU registers, establishing a happens-before relationship. It does NOT guarantee atomicity for compound operations (e.g. `count++`).\\n\\nsynchronized is a method or block-level mutual exclusion lock that guarantees both atomicity and visibility. Only one thread can execute a synchronized block at a time, preventing race conditions.\"\n\n| Feature | `volatile` | `synchronized` |\n| --- | --- | --- |\n| **Scope** | Variable field modifier | Method or code block monitor lock |\n| **Visibility Guarantee** | Yes (flushes to/from main RAM) | Yes (flushes monitor state upon exit) |\n| **Atomicity Guarantee** | No (compound ops like `count++` are unsafe)| Yes (blocks concurrent execution) |\n| **Thread Blocking** | Non-blocking (lock-free) | Blocking (waiting threads are queued) |\n| **Performance Overhead**| Low (memory barrier instruction) | Higher (context switching & monitor acquisition) |",
        "keyConcepts": "Volatile visibility, Happens-before guarantee, Atomicity vs Visibility, Monitor locks, Memory barrier",
        "code": "public class ConcurrencyDemo {\n    private volatile boolean running = true; // Flushed directly to main memory\n    private int counter = 0;\n\n    public synchronized void increment() {    // Mutual exclusion ensures atomic updates\n        counter++;\n    }\n}",
        "output": "[Compiled cleanly - volatile ensures visibility, synchronized guarantees atomicity]"
      },
      {
        "id": 79,
        "title": "Thread vs Runnable vs Callable",
        "topicId": 4,
        "topicName": "Concurrency & Multithreading",
        "level": "Core Concept",
        "answer": "\"Thread is a concrete class (`java.lang.Thread`) representing an OS-level worker. Extending `Thread` limits class inheritance because Java does not support multiple class inheritance.\\n\\nRunnable is a functional interface representing a task (`run()`) with no return value (`void`) and no capability to throw checked exceptions.\\n\\nCallable is a generic functional interface (`call()`) introduced in Java 5 that returns a computed result (`V`) and is permitted to throw checked exceptions, managed via `Future`.\"\n\n| Feature | `Thread` Class | `Runnable` Interface | `Callable<V>` Interface |\n| --- | --- | --- | --- |\n| **Type** | Concrete class | Functional Interface | Functional Interface |\n| **Method** | `run()` | `run()` | `call()` |\n| **Return Value** | `void` | `void` | Returns generic type `V` |\n| **Checked Exceptions**| Cannot throw checked exceptions | Cannot throw checked exceptions | Permitted to throw checked `Exception` |\n| **Execution Model** | `thread.start()` | Passed to Thread/Executor | Executed via `ExecutorService.submit()` |",
        "keyConcepts": "Task separation, Callable vs Runnable, Future result, Checked exceptions, Single inheritance limit",
        "code": "import java.util.concurrent.*;\n\npublic class CallableDemo {\n    public static void main(String[] args) throws Exception {\n        ExecutorService executor = Executors.newSingleThreadExecutor();\n        Callable<Integer> task = () -> 42 * 2;\n        Future<Integer> future = executor.submit(task);\n        System.out.println(\"Callable Result: \" + future.get());\n        executor.shutdown();\n    }\n}",
        "output": "Callable Result: 84"
      },
      {
        "id": 80,
        "title": "ExecutorService vs Thread",
        "topicId": 4,
        "topicName": "Concurrency & Multithreading",
        "level": "Core Concept",
        "answer": "\"Creating raw `Thread` instances directly (`new Thread()`) has high operating system overhead: allocating kernel stack memory (~1MB) and high thread creation latency. Creating unbounded threads can quickly exhaust system memory.\\n\\nExecutorService provides a managed thread pool that recycles a fixed set of worker threads to execute asynchronous tasks from a work queue. It decouples task submission from thread execution, caps resource utilization, and provides lifecycle controls.\"\n\n| Feature | Raw `Thread` | `ExecutorService` (Thread Pool) |\n| --- | --- | --- |\n| **Resource Overhead** | High (creates new OS thread every task) | Low (reuses worker threads from pool) |\n| **Task Decoupling** | Task and thread are tightly coupled | Task (`Runnable`/`Callable`) is decoupled from execution |\n| **Resource Cap** | Unbounded (risks `OutOfMemoryError`) | Capped maximum concurrent workers |\n| **Lifecycle Control** | Difficult to manage manual termination | Clean `shutdown()`, `shutdownNow()`, `awaitTermination()` |\n| **Result Retrieval** | Manual synchronization needed | Returns `Future<T>` for asynchronous tracking |",
        "keyConcepts": "Thread pool recycling, Task decoupling, Resource bounding, WorkQueue, Thread creation overhead",
        "code": "import java.util.concurrent.*;\n\npublic class ExecutorDemo {\n    public static void main(String[] args) {\n        ExecutorService pool = Executors.newFixedThreadPool(2);\n        pool.submit(() -> System.out.println(\"Task 1 executed\"));\n        pool.submit(() -> System.out.println(\"Task 2 executed\"));\n        pool.shutdown();\n    }\n}",
        "output": "Task 1 executed\nTask 2 executed"
      },
      {
        "id": 81,
        "title": "Future vs CompletableFuture",
        "topicId": 4,
        "topicName": "Concurrency & Multithreading",
        "level": "Core Concept",
        "answer": "\"Future (Java 5) represents the pending result of an asynchronous computation, but its result retrieval (`future.get()`) is strictly blocking, and it lacks capabilities to chain dependent asynchronous tasks or handle errors asynchronously.\\n\\nCompletableFuture (Java 8) implements `Future` and `CompletionStage`, enabling non-blocking, event-driven reactive pipelines. Tasks can be chained (`thenApply`, `thenCompose`), combined (`allOf`, `anyOf`), manually completed, and handled with asynchronous exception handlers (`exceptionally`).\"\n\n| Feature | `Future` (Java 5) | `CompletableFuture` (Java 8) |\n| --- | --- | --- |\n| **Result Extraction** | Blocking call (`future.get()`) | Non-blocking callbacks (`thenAccept`, `join`) |\n| **Chaining & Composition**| Impossible without manual blocking | Native fluent chaining (`thenApply`, `thenCompose`) |\n| **Manual Completion** | Cannot be completed manually | `cf.complete(value)` completes future explicitly |\n| **Error Handling** | Requires standard `try-catch` on `.get()` | Fluent asynchronous handlers (`.exceptionally()`) |\n| **Combining Tasks** | Manual coordination | `allOf()`, `anyOf()` for multi-future synchronization |",
        "keyConcepts": "Reactive pipelines, CompletionStage, Non-blocking asynchronous programming, thenApply, thenCompose",
        "code": "import java.util.concurrent.CompletableFuture;\n\npublic class CFDemo {\n    public static void main(String[] args) {\n        CompletableFuture.supplyAsync(() -> \"Hello\")\n            .thenApply(s -> s + \" World\")\n            .thenAccept(result -> System.out.println(\"Chained Pipeline: \" + result))\n            .join();\n    }\n}",
        "output": "Chained Pipeline: Hello World"
      },
      {
        "id": 82,
        "title": "Java Generics and Type Erasure",
        "topicId": 3,
        "topicName": "Collections Framework & Generics",
        "level": "Core Concept",
        "answer": "\"Java Generics provide compile-time type safety by allowing classes and methods to operate on parameterized types without explicit casting.\\n\\nTo ensure backward binary compatibility with legacy pre-Java 5 bytecode, the compiler applies Type Erasure: during compilation, all generic type parameters are stripped away and replaced with their bound (or `Object` if unbound), and appropriate type casts are inserted. At runtime, a `List<String>` and `List<Integer>` are identical raw `List` bytecodes.\"\n\n| Feature | Compile Time | Runtime (Post-Type Erasure) |\n| --- | --- | --- |\n| **Type Representation** | `List<String>`, `Map<K, V>` | Raw `List`, raw `Map` |\n| **Type Checking** | Strict compile-time validation | No generic information exists at runtime |\n| **Casts** | Implicitly inserted by compiler | Explicit bytecode cast instructions (`checkcast`) |\n| **Instance Checks** | Valid | `if (list instanceof List<String>)` is illegal! |\n| **Primitive Generics** | Prohibited (`List<int>` cannot compile) | Cannot substitute primitives for `Object` bound |",
        "keyConcepts": "Type erasure, Compile-time type safety, Bridge methods, Raw types, Reification vs Erasure",
        "code": "import java.util.ArrayList;\n\npublic class ErasureDemo {\n    public static void main(String[] args) {\n        ArrayList<String> strings = new ArrayList<>();\n        ArrayList<Integer> ints = new ArrayList<>();\n        // At runtime, both share the exact same class definition due to type erasure:\n        System.out.println(\"Same runtime class: \" + (strings.getClass() == ints.getClass()));\n    }\n}",
        "output": "Same runtime class: true"
      },
      {
        "id": 83,
        "title": "ClassLoader Architecture",
        "topicId": 1,
        "topicName": "JVM Architecture & Memory Internals",
        "level": "Core Concept",
        "answer": "\"The JVM ClassLoader subsystem is responsible for dynamically loading `.class` bytecode files into memory during runtime. It follows a strict Delegation Hierarchy with three core class loaders:\\n\\n1. **Bootstrap ClassLoader:** Native C/C++ loader that loads core Java runtime classes (`java.lang.*` from JDK `lib/modules`).\\n2. **Platform / Extension ClassLoader:** Loads platform extension libraries.\\n3. **Application / System ClassLoader:** Loads application classpath files and dependencies.\\n\\nIt adheres to the Delegation Principle: a loader always delegates to its parent before attempting to load a class itself.\"\n\n| ClassLoader | Loads From | Implemented In |\n| --- | --- | --- |\n| **Bootstrap** | Core JDK runtime base modules (`java.base`) | Native C/C++ code (returns `null` in Java) |\n| **Platform / Extension**| Extension directories and platform modules | Java (`jdk.internal.loader.ClassLoaders$PlatformClassLoader`) |\n| **Application / System**| Application classpath (`-classpath`, `-cp`, JARs)| Java (`jdk.internal.loader.ClassLoaders$AppClassLoader`) |",
        "keyConcepts": "ClassLoader hierarchy, Delegation principle, Bootstrap ClassLoader, Classpath loading, Security boundary",
        "code": "public class ClassLoaderDemo {\n    public static void main(String[] args) {\n        System.out.println(\"App ClassLoader:       \" + ClassLoaderDemo.class.getClassLoader());\n        System.out.println(\"Bootstrap ClassLoader: \" + String.class.getClassLoader()); // null represents Bootstrap\n    }\n}",
        "output": "App ClassLoader:       jdk.internal.loader.ClassLoaders$AppClassLoader@...\nBootstrap ClassLoader: null"
      },
      {
        "id": 84,
        "title": "JVM Garbage Collection Algorithms",
        "topicId": 1,
        "topicName": "JVM Architecture & Memory Internals",
        "level": "Core Concept",
        "answer": "\"HotSpot JVM implements multiple production-grade Garbage Collection algorithms tailored for different latency and throughput requirements:\\n\\n1. **Serial GC (`-XX:+UseSerialGC`):** Single-threaded stop-the-world collector for simple CLI or small memory apps.\\n2. **Parallel GC (`-XX:+UseParallelGC`):** Multi-threaded throughput collector for compute-heavy batch processing.\\n3. **G1 GC (`-XX:+UseG1GC`):** Region-based generational collector designed for multi-gigabyte heaps with predictable pause times (default since Java 9).\\n4. **ZGC & Shenandoah:** Ultra-low latency concurrent collectors with sub-millisecond pause times regardless of heap size.\"\n\n| Collector | Target Goal | Heap Structure | Pause Times |\n| --- | --- | --- | --- |\n| **Serial GC** | Minimal footprint / single thread | Contiguous generations | Long stop-the-world pauses |\n| **Parallel GC** | Maximum batch throughput | Contiguous Young/Old | Moderate stop-the-world pauses |\n| **G1 GC** | Balanced throughput and latency | Partitioned equal-sized regions | Tunable predictable pause target (`-XX:MaxGCPauseMillis`) |\n| **ZGC / Shenandoah**| Ultra-low latency (< 1ms pauses) | Colored pointers / load barriers | Sub-millisecond concurrent collection |",
        "keyConcepts": "G1 GC, ZGC, Parallel GC, Stop-the-world pauses, Generational hypothesis, Garbage collection tuning",
        "code": "// HotSpot JVM GC selection flags:\n// java -XX:+UseG1GC -XX:MaxGCPauseMillis=200 -jar app.jar\n// java -XX:+UseZGC -Xmx16g -jar app.jar\npublic class GCInfo {\n    public static void main(String[] args) {\n        System.out.println(\"Available Processors: \" + Runtime.getRuntime().availableProcessors());\n        System.out.println(\"Max Heap (bytes):    \" + Runtime.getRuntime().maxMemory());\n    }\n}",
        "output": "Available Processors: 8\nMax Heap (bytes):    4294967296"
      },
      {
        "id": 85,
        "title": "Java Memory Model",
        "topicId": 1,
        "topicName": "JVM Architecture & Memory Internals",
        "level": "Core Concept",
        "answer": "\"The Java Memory Model (JMM, JSR-133) defines the formal rules governing how and when variables written by one thread become visible to other threads across modern multi-core CPU architectures with caching, stores, and instruction reordering.\\n\\nCentral to the JMM is the Happens-Before Relationship: if action A happens-before action B, the memory effects of A are guaranteed to be fully visible to B. Happens-before is established by thread start/join, monitor lock/unlock (`synchronized`), and volatile writes/reads.\"\n\n| Mechanism | Happens-Before Guarantee | Memory Effect |\n| --- | --- | --- |\n| **Volatile Write/Read** | Write to volatile happens-before subsequent read | Flushes cache to main memory; invalidates stale CPU caches |\n| **Monitor Lock/Unlock** | Unlock of monitor happens-before subsequent lock | Flushes all modified variables to main RAM upon release |\n| **Thread Start** | Thread initialization happens-before thread `start()` | Worker thread sees all state configured before launch |\n| **Instruction Reordering**| Prohibits illegal reorderings across barriers | CPU and JIT compiler preserve memory barrier constraints |",
        "keyConcepts": "JSR-133, Happens-Before, Memory barrier, CPU cache coherence, Instruction reordering",
        "code": "public class JMMExample {\n    private int data = 0;\n    private volatile boolean ready = false;\n\n    public void writer() {\n        data = 42;         // 1. Write data\n        ready = true;       // 2. Volatile write (acts as release barrier)\n    }\n\n    public void reader() {\n        if (ready) {        // 3. Volatile read (acts as acquire barrier)\n            // Guarantees data == 42; instruction reordering cannot move data write after ready\n            System.out.println(\"Observed consistent data: \" + data);\n        }\n    }\n}",
        "output": "[Compiled cleanly - Volatile establishes JMM happens-before relationship]"
      }
    ]
  }
};
