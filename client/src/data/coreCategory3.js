export const category3 = {
  "id": 203,
  "title": "3. Object-Oriented Programming (OOP)",
  "shortTitle": "Category 3",
  "subtitle": "20 Core Concepts: Polymorphism, Abstraction, SOLID, Composition & Design",
  "description": "Master core object-oriented design and architecture: Classes vs Objects, Abstraction vs Encapsulation, Dynamic Dispatch, Constructor Chaining, Diamond Problem, Coupling vs Cohesion, and SOLID Principles.",
  "questionCount": 20,
  "topicCount": 5,
  "status": "available",
  "data": {
    "phase": "3. Object-Oriented Programming (OOP)",
    "totalQuestions": 20,
    "topics": [
      {
        "id": 1,
        "name": "Core OOP Paradigms",
        "range": [
          41,
          48
        ],
        "count": 4
      },
      {
        "id": 2,
        "name": "Polymorphism & Dispatching",
        "range": [
          44,
          52
        ],
        "count": 5
      },
      {
        "id": 3,
        "name": "Lifecycle & Inheritance Semantics",
        "range": [
          47,
          55
        ],
        "count": 4
      },
      {
        "id": 4,
        "name": "Relationships & Structural Modeling",
        "range": [
          49,
          50
        ],
        "count": 2
      },
      {
        "id": 5,
        "name": "Software Design & Architecture",
        "range": [
          56,
          60
        ],
        "count": 5
      }
    ],
    "questions": [
      {
        "id": 41,
        "title": "Class vs Object",
        "topicId": 1,
        "topicName": "Core OOP Paradigms",
        "level": "Core Concept",
        "answer": "\"A Class is a compile-time syntactic blueprint, user-defined type, or prototype that specifies the attributes (state) and methods (behavior) that entities of that type will possess. It consumes no heap memory for instance fields until instantiated.\n\nAn Object is a concrete runtime instance of a class allocated on the heap with its own distinct state and identity in memory. Multiple independent objects can be instantiated from a single class blueprint.\"\n\n| Feature | Class | Object |\n| --- | --- | --- |\n| **Definition** | Blueprint, specification, or type definition | Runtime physical instance residing in heap memory |\n| **Memory Allocation**| Stored in Metaspace/Method Area (metadata only) | Allocated in Heap memory during instantiation (`new`) |\n| **Existence** | Exists statically at compile time and runtime | Created dynamically at runtime during execution |\n| **Multiplicity** | Declared once per source definition | Countless distinct instances can be created |\n| **Mutability** | Structural definition is fixed/immutable | State (instance attributes) changes dynamically |",
        "keyConcepts": "Blueprint, Instance, Heap allocation, Metaspace, Object identity, State and Behavior",
        "code": "class Car:\n    def __init__(self, model, color):\n        self.model = model\n        self.color = color\n\n# Instances (objects) allocated in memory:\ncar1 = Car(\"Tesla Model 3\", \"Red\")\ncar2 = Car(\"BMW M3\", \"Blue\")\nprint(f\"car1: {car1.model} ({car1.color}) at {hex(id(car1))}\")\nprint(f\"car2: {car2.model} ({car2.color}) at {hex(id(car2))}\")",
        "output": "car1: Tesla Model 3 (Red) at 0x7f8a100\ncar2: BMW M3 (Blue) at 0x7f8a140"
      },
      {
        "id": 42,
        "title": "Abstraction vs Encapsulation",
        "topicId": 1,
        "topicName": "Core OOP Paradigms",
        "level": "Core Concept",
        "answer": "\"Abstraction is the design-level practice of hiding background implementation complexity and showing only the essential external feature interface to the consumer (answering WHAT the system does).\n\nEncapsulation is the implementation-level bundling of data fields and the methods that operate on them into a single protective unit, while restricting direct external access to internal state using access modifiers (answering HOW data is protected).\"\n\n| Feature | Abstraction | Encapsulation |\n| --- | --- | --- |\n| **Primary Goal** | Hiding implementation complexity (WHAT it does) | Hiding internal state & bundling data (HOW it works) |\n| **Focus Level** | Outer design level (interface boundaries) | Internal implementation level (class internals) |\n| **Implementation**| Abstract classes, interfaces, API contracts | Access modifiers (`private`, `protected`), getters/setters |\n| **Benefit** | Reduces cognitive load & decouples subsystems | Prevents unauthorized mutation & enforces validation |\n| **Real-world Analogy**| Pressing the accelerator pedal without knowing fuel injection mechanics | Medicine capsule enclosing active ingredients |",
        "keyConcepts": "Information hiding, Data bundling, Public API, Private fields, Access modifiers, Loose coupling",
        "code": "from abc import ABC, abstractmethod\n\n# Abstraction: Interface specifies WHAT to do\nclass PaymentGateway(ABC):\n    @abstractmethod\n    def pay(self, amount):\n        pass\n\n# Encapsulation: Bundles internal state and enforces validation\nclass BankAccount:\n    def __init__(self, initial_balance):\n        self.__balance = initial_balance  # Private data member\n\n    def deposit(self, amount):\n        if amount > 0:\n            self.__balance += amount\n\n    def get_balance(self):\n        return self.__balance\n\nacc = BankAccount(1000)\nacc.deposit(250)\nprint(\"Secure Encapsulated Balance:\", acc.get_balance())",
        "output": "Secure Encapsulated Balance: 1250"
      },
      {
        "id": 43,
        "title": "Inheritance vs Composition",
        "topicId": 1,
        "topicName": "Core OOP Paradigms",
        "level": "Core Concept",
        "answer": "\"Inheritance is an IS-A relationship where a derived child class absorbs and extends the attributes and behaviors of a parent base class. It creates tight coupling (white-box reuse) and a rigid class hierarchy.\n\nComposition is a HAS-A relationship where a class contains instances of other classes as member components to delegate responsibilities. The GoF design principle recommends: \\\"Favor object composition over class inheritance\\\" to achieve loose coupling, flexibility, and runtime interchangeability.\"\n\n| Feature | Inheritance (IS-A) | Composition (HAS-A) |\n| --- | --- | --- |\n| **Relationship** | Class hierarchy extension (Child is a Parent) | Component aggregation (Container has a Component) |\n| **Coupling** | Tight coupling; changes in base break subclasses | Loose coupling; interacts via interfaces |\n| **Binding Time** | Static (fixed at compile time) | Dynamic (components can be swapped at runtime) |\n| **Reuse Type** | White-box reuse (subclass sees base internals) | Black-box reuse (only exposed API is accessed) |\n| **Polymorphism** | Subtyping polymorphism | Delegation polymorphism via strategy pattern |",
        "keyConcepts": "IS-A vs HAS-A, Favor composition over inheritance, White-box vs Black-box reuse, Delegation, Tight vs Loose coupling",
        "code": "# Inheritance (Rigid):\nclass Animal:\n    def breathe(self):\n        return \"Breathing oxygen\"\nclass Dog(Animal):\n    pass\n\n# Composition (Flexible):\nclass Engine:\n    def start(self):\n        return \"Engine running V8\"\n\nclass Car:\n    def __init__(self, engine):\n        self.engine = engine  # Injected component\n    def drive(self):\n        return f\"Car moving: {self.engine.start()}\"\n\ncar = Car(Engine())\nprint(car.drive())",
        "output": "Car moving: Engine running V8"
      },
      {
        "id": 44,
        "title": "Method Overloading vs Overriding",
        "topicId": 2,
        "topicName": "Polymorphism & Dispatching",
        "level": "Core Concept",
        "answer": "\"Method Overloading occurs when multiple methods in the same class share the exact same method name but possess distinct parameter lists (different parameter count, order, or types). It is resolved statically at compile time (Static Polymorphism).\n\nMethod Overriding occurs when a subclass provides a specific implementation for a method that is already defined in its superclass, with the exact same method signature and return type. It is resolved dynamically at runtime via virtual table lookup (Dynamic Polymorphism).\"\n\n| Feature | Method Overloading | Method Overriding |\n| --- | --- | --- |\n| **Scope** | Within the same class | Between Superclass and Subclass |\n| **Method Signature**| Same name, DIFFERENT parameter types/counts | EXACT SAME name, parameters, and return type |\n| **Binding Resolution**| Compile-time (Static binding / early binding) | Runtime (Dynamic dispatch / late binding / vtable) |\n| **Private/Static Methods**| Can overload private and static methods | Cannot override private or static methods |\n| **Performance** | Zero runtime penalty (direct compiler call) | Minor pointer indirection through virtual table |",
        "keyConcepts": "Compile-time vs Runtime resolution, Method signature, Virtual method table (vtable), Early binding, Late binding",
        "code": "# In Python, overloading is simulated via default parameters/dispatch:\nclass MathUtils:\n    def multiply(self, a, b, c=1):\n        return a * b * c\n\n# Overriding:\nclass Parent:\n    def speak(self):\n        return \"Parent speaking\"\n\nclass Child(Parent):\n    def speak(self):\n        return \"Child overriding parent speech\"\n\nc = Child()\nprint(\"Simulated Overload:\", MathUtils().multiply(4, 5))\nprint(\"Simulated Overload 3 args:\", MathUtils().multiply(4, 5, 2))\nprint(\"Override:\", c.speak())",
        "output": "Simulated Overload: 20\nSimulated Overload 3 args: 40\nOverride: Child overriding parent speech"
      },
      {
        "id": 45,
        "title": "Compile-time vs Runtime Polymorphism",
        "topicId": 2,
        "topicName": "Polymorphism & Dispatching",
        "level": "Core Concept",
        "answer": "\"Compile-time Polymorphism (Static Polymorphism) is achieved through method overloading, operator overloading, and templates/generics. The compiler evaluates the parameter types and binds the exact target function address directly into bytecode before execution.\n\nRuntime Polymorphism (Dynamic Polymorphism) is achieved through method overriding and virtual methods. The actual method executed is determined at runtime based on the dynamic type of the object instance, rather than the static reference type.\"\n\n| Feature | Compile-time Polymorphism | Runtime Polymorphism |\n| --- | --- | --- |\n| **Mechanisms** | Method Overloading, Operator Overloading, Templates | Method Overriding, Interfaces, Abstract Classes |\n| **Resolution Point**| Compile time (by compiler) | Runtime (by JVM / Python interpreter) |\n| **Dispatch Mechanism**| Direct function call or static dispatch | Virtual method table (vtable) / Dynamic dispatch |\n| **Execution Speed**| Faster (no indirect lookup at runtime) | Slight overhead due to vtable pointer resolution |\n| **Flexibility** | Rigid at runtime | Highly flexible; enables plug-and-play architectures |",
        "keyConcepts": "Static vs Dynamic polymorphism, Vtable pointer, Method dispatch, Type erasure, Late binding",
        "code": "class Shape:\n    def draw(self):\n        return \"Generic shape\"\n\nclass Circle(Shape):\n    def draw(self):\n        return \"Drawing a circle\"\n\nclass Square(Shape):\n    def draw(self):\n        return \"Drawing a square\"\n\n# Runtime Polymorphism: target decided dynamically by instance type\nshapes = [Circle(), Square()]\nfor s in shapes:\n    print(s.draw())",
        "output": "Drawing a circle\nDrawing a square"
      },
      {
        "id": 46,
        "title": "Static vs Dynamic Dispatch",
        "topicId": 2,
        "topicName": "Polymorphism & Dispatching",
        "level": "Core Concept",
        "answer": "\"Static Dispatch occurs when the compiler determines the concrete function implementation to call at compile time. The call is emitted as a direct memory jump or direct instruction offset, resulting in optimal runtime performance and enabling compiler inlining.\n\nDynamic Dispatch occurs when the target method cannot be determined until runtime because the variable points to a polymorphic object. The runtime resolves the call by inspecting the object's virtual method table (vtable) or class dictionary.\"\n\n| Feature | Static Dispatch | Dynamic Dispatch |\n| --- | --- | --- |\n| **Decision Time** | Compile time | Runtime during program execution |\n| **Underlying Mechanism**| Direct address branching (`invokestatic`, `invokespecial`) | Virtual table lookup (`invokevirtual`, `invokeinterface`) |\n| **Optimization** | Inlining enabled; zero runtime lookup penalty | Cache misses possible; prevents aggressive inlining |\n| **Applicability** | `static`, `private`, `final` methods | Overridden instance methods on polymorphic hierarchies |\n| **Cost** | 0 CPU cycles of indirection | 1-2 memory dereferences per virtual invocation |",
        "keyConcepts": "Static dispatch, Dynamic dispatch, Vtable, Inline optimization, invokestatic, invokevirtual",
        "code": "# In Java: static methods use static dispatch; instance methods use dynamic dispatch.\n# In Python, all method calls are dynamically dispatched via __dict__ / MRO:\nclass Base:\n    @staticmethod\n    def static_greet():\n        return \"Static call: direct resolution\"\n\n    def dynamic_greet(self):\n        return \"Dynamic call: resolved at runtime\"\n\nprint(Base.static_greet())\nprint(Base().dynamic_greet())",
        "output": "Static call: direct resolution\nDynamic call: resolved at runtime"
      },
      {
        "id": 47,
        "title": "Constructor vs Destructor",
        "topicId": 3,
        "topicName": "Lifecycle & Inheritance Semantics",
        "level": "Core Concept",
        "answer": "\"A Constructor is a special initialization method automatically invoked immediately when a new object instance is allocated in memory. It sets up initial state, allocates resources, and enforces invariants.\n\nA Destructor (or finalizer/cleanup hook like `__del__` or C++ `~ClassName`) is invoked when an object reaches the end of its lifecycle, immediately before its memory is reclaimed. In managed languages (Java/Python), destructors are non-deterministic, so context managers (`try-with-resources` / `with`) are preferred.\"\n\n| Feature | Constructor | Destructor |\n| --- | --- | --- |\n| **Purpose** | Object initialization and resource acquisition | Object teardown and resource reclamation |\n| **Invocation Point**| Triggered explicitly upon `new` or `ClassName()` | Invoked when object is destroyed or garbage collected |\n| **Overloading** | Yes, constructors can be overloaded | No, classes possess at most one destructor |\n| **Determinism** | Deterministic (executes synchronously at allocation) | Non-deterministic in GC languages (Java, Python, C#) |\n| **Best Practice** | Initialize all essential fields cleanly | Use `AutoCloseable` or `with` blocks rather than finalizers |",
        "keyConcepts": "Object lifecycle, RAII, Non-deterministic destruction, AutoCloseable, Context managers",
        "code": "class ResourceHolder:\n    def __init__(self, name):\n        self.name = name\n        print(f\"[Constructor] Allocated: {self.name}\")\n\n    def __del__(self):\n        print(f\"[Destructor] Released: {self.name}\")\n\nobj = ResourceHolder(\"DatabaseConnection\")\ndel obj",
        "output": "[Constructor] Allocated: DatabaseConnection\n[Destructor] Released: DatabaseConnection"
      },
      {
        "id": 48,
        "title": "Abstract Class vs Interface",
        "topicId": 1,
        "topicName": "Core OOP Paradigms",
        "level": "Core Concept",
        "answer": "\"An Abstract Class is an incomplete base class designed for inheritance that can contain both abstract methods (without body) and fully implemented concrete methods, as well as instance variables and state.\n\nAn Interface is a pure contract specification defining what capabilities a class must provide. In modern Java, interfaces can have `default` and `static` methods, but they cannot maintain instance state (fields are implicitly `public static final`). A class can inherit only one abstract class, but can implement multiple interfaces.\"\n\n| Feature | Abstract Class | Interface |\n| --- | --- | --- |\n| **Inheritance Model** | Single inheritance (`extends`) | Multiple implementation (`implements`) |\n| **State & Fields** | Can have instance variables, mutable state, constructors | Only `public static final` constants; NO instance fields |\n| **Method Types** | Abstract and concrete methods with any access modifier | Abstract, default, and static methods (all public) |\n| **Constructors** | Yes, invoked during subclass constructor chaining | No constructors allowed |\n| **Architectural Role**| Core identity (IS-A skeleton for related classes) | Peripheral capability / contract (CAN-DO across unrelated classes) |",
        "keyConcepts": "Abstract class, Interface contract, Multiple inheritance of type, Default methods, CAN-DO relationship",
        "code": "from abc import ABC, abstractmethod\n\n# Interface (Pure Contract):\nclass Serializable(ABC):\n    @abstractmethod\n    def serialize(self) -> str:\n        pass\n\n# Abstract Class (Shares state and partial logic):\nclass Vehicle(ABC):\n    def __init__(self, vin):\n        self.vin = vin  # Concrete instance state\n\n    @abstractmethod\n    def start_engine(self):\n        pass\n\nprint(\"Abstract Class provides base state; Interface enforces pure capabilities.\")",
        "output": "Abstract Class provides base state; Interface enforces pure capabilities."
      },
      {
        "id": 49,
        "title": "IS-A vs HAS-A Relationship",
        "topicId": 4,
        "topicName": "Relationships & Structural Modeling",
        "level": "Core Concept",
        "answer": "\"An IS-A Relationship is established through class inheritance or interface implementation. It indicates that the specialized derived class is a subtype of the generalized base type (e.g., A `Sedan` IS-A `Car`).\n\nA HAS-A Relationship is established through object composition or aggregation. It indicates that a class contains or owns a reference to another object as part of its internal state (e.g., A `Car` HAS-A `Engine`).\"\n\n| Feature | IS-A Relationship | HAS-A Relationship |\n| --- | --- | --- |\n| **OOP Mechanism** | Class Inheritance (`extends`) / Implementation (`implements`)| Composition / Aggregation (instance variable reference) |\n| **Coupling Level** | Tight coupling; fragile base class vulnerability | Loose coupling; component details are encapsulated |\n| **Flexibility** | Static; cannot change superclass at runtime | Dynamic; component instances can be swapped dynamically |\n| **Reusability** | Subclass reuses superclass code directly | Class delegates execution to component |\n| **Design Rule** | Use only for true subtyping (Liskov Substitution) | Preferred default design choice for code reuse |",
        "keyConcepts": "Subtyping, Composition, Delegation, Liskov Substitution Principle, Fragile base class problem",
        "code": "# IS-A:\nclass Bird:\n    pass\nclass Eagle(Bird):  # Eagle IS-A Bird\n    pass\n\n# HAS-A:\nclass Battery:\n    def charge(self):\n        return \"100% charged\"\n\nclass Smartphone:\n    def __init__(self):\n        self.battery = Battery()  # Smartphone HAS-A Battery\n\nphone = Smartphone()\nprint(\"HAS-A Component Delegation:\", phone.battery.charge())",
        "output": "HAS-A Component Delegation: 100% charged"
      },
      {
        "id": 50,
        "title": "Association vs Aggregation vs Composition",
        "topicId": 4,
        "topicName": "Relationships & Structural Modeling",
        "level": "Core Concept",
        "answer": "\"Association is the most generic structural relationship where two independent classes know about each other and communicate via method arguments or references without owning one another (peer-to-peer).\n\nAggregation is a specialized \\\"weak\\\" HAS-A relationship where the child object can exist independently of the parent container (shared reference; e.g., A Department and Professors).\n\nComposition is a \\\"strong\\\" HAS-A relationship with strict lifecycle ownership: the child cannot exist without the parent container; if the parent is destroyed, the child is destroyed too (e.g., A House and its Rooms).\"\n\n| Relationship | Ownership Type | Child Lifecycle | Real-World Example |\n| --- | --- | --- | --- |\n| **Association** | None (Peer-to-peer) | Completely independent | Teacher teaches Student |\n| **Aggregation** | Weak ownership | Independent (Survives parent deletion) | University has Professors |\n| **Composition** | Strong ownership | Dependent (Destroyed with parent) | House contains Rooms |",
        "keyConcepts": "Association, Aggregation, Composition, Lifecycle coupling, Whole-part relationship, UML modeling",
        "code": "# Aggregation (Independent lifecycles):\nclass Professor:\n    def __init__(self, name):\n        self.name = name\nclass Department:\n    def __init__(self, prof):\n        self.prof = prof  # If Department dies, Professor still exists\n\n# Composition (Co-dependent lifecycles):\nclass Room:\n    def __init__(self, room_no):\n        self.room_no = room_no\nclass House:\n    def __init__(self):\n        self.room = Room(101)  # Room is created and destroyed with House\n\nprint(\"Aggregation: child outlives parent. Composition: child dies with parent.\")",
        "output": "Aggregation: child outlives parent. Composition: child dies with parent."
      },
      {
        "id": 51,
        "title": "Upcasting vs Downcasting",
        "topicId": 2,
        "topicName": "Polymorphism & Dispatching",
        "level": "Core Concept",
        "answer": "\"Upcasting is casting a subclass reference up the inheritance hierarchy to a superclass reference. It is always type-safe, implicit, and automatically handled by the compiler because any subclass instance IS-A superclass instance.\n\nDowncasting is casting a superclass reference down the hierarchy to a specific subclass reference. It is inherently dangerous, requires explicit casting syntax, and must be guarded with `instanceof` checks to prevent `ClassCastException` crashes at runtime.\"\n\n| Feature | Upcasting | Downcasting |\n| --- | --- | --- |\n| **Direction** | Subclass $\\rightarrow$ Superclass (Up hierarchy) | Superclass $\\rightarrow$ Subclass (Down hierarchy) |\n| **Syntax** | Implicit / Automatic | Explicit typecast required |\n| **Type Safety** | 100% safe at compile time | Risky; can throw `ClassCastException` at runtime |\n| **Purpose** | Generalization & Polymorphic method handling | Specialization & accessing subclass-specific methods |\n| **Guard Requirement**| Never requires type checks | Must be validated using `isinstance` / `instanceof` |",
        "keyConcepts": "Type widening, Narrowing, ClassCastException, instanceof check, Implicit vs Explicit casting",
        "code": "class Animal:\n    def speak(self):\n        return \"Animal sound\"\nclass Dog(Animal):\n    def fetch(self):\n        return \"Dog fetching stick\"\n\n# Upcasting:\nmy_dog = Dog()\nanimal_ref: Animal = my_dog  # Upcast: treated as Animal\nprint(\"Upcasted call:\", animal_ref.speak())\n\n# Downcasting with guard:\nif isinstance(animal_ref, Dog):\n    recovered_dog = animal_ref  # Downcast\n    print(\"Downcasted call:\", recovered_dog.fetch())",
        "output": "Upcasted call: Animal sound\nDowncasted call: Dog fetching stick"
      },
      {
        "id": 52,
        "title": "Method Hiding vs Method Overriding",
        "topicId": 2,
        "topicName": "Polymorphism & Dispatching",
        "level": "Core Concept",
        "answer": "\"Method Overriding applies to non-static instance methods: the subclass replaces the superclass method, and invocation is resolved at runtime based on the actual object type via dynamic dispatch.\n\nMethod Hiding applies to static (class-level) methods: when a subclass defines a static method with the same signature as a static method in the superclass, it shadows (hides) the parent method. The method called is determined at compile time based strictly on the reference type, NOT the runtime instance.\"\n\n| Feature | Method Overriding | Method Hiding |\n| --- | --- | --- |\n| **Method Type** | Instance methods (non-static) | Static methods (`static` in Java) |\n| **Resolution Point**| Runtime (Dynamic Polymorphism via vtable) | Compile time (Static binding via Reference Type) |\n| **Annotation** | Marked with `@Override` | Cannot use `@Override` |\n| **Polymorphic Dispatch**| Works through polymorphic base references | Polymorphism is suppressed; invokes reference class method |\n| **Memory Pointer** | Virtual table lookup | Direct instruction pointer branch |",
        "keyConcepts": "Static method shadowing, Dynamic dispatch vs static binding, invokestatic vs invokevirtual",
        "code": "# In Python: class methods/attributes can be shadowed in derived namespace:\nclass Base:\n    @classmethod\n    def identify(cls):\n        return f\"Base class method\"\n\nclass Derived(Base):\n    @classmethod\n    def identify(cls):\n        return f\"Derived method hiding base\"\n\nprint(Base.identify())\nprint(Derived.identify())",
        "output": "Base class method\nDerived method hiding base"
      },
      {
        "id": 53,
        "title": "Constructor Chaining",
        "topicId": 3,
        "topicName": "Lifecycle & Inheritance Semantics",
        "level": "Core Concept",
        "answer": "\"Constructor Chaining is the sequence of invoking one constructor from another, either within the same class (using `this()`) or across an inheritance hierarchy from child to parent (using `super()`).\n\nWhen a derived class object is instantiated, constructor chaining ensures that the topmost ancestor object constructor executes first, progressively initializing each layer of the hierarchy down to the derived class before the object is made accessible.\"\n\n| Type | Intra-Class Chaining (`this()`) | Inter-Class Chaining (`super()`) |\n| --- | --- | --- |\n| **Scope** | Within the same class | Between subclass and immediate superclass |\n| **Purpose** | Reusing parameter validation and default setups | Ensuring base class state is properly initialized |\n| **Execution Order** | Forwarded to overloaded target constructor | Top-down: `Object` $\\rightarrow$ Superclass $\\rightarrow$ Subclass |\n| **Positioning** | Must be the very first statement in constructor | Must be the very first statement in constructor |\n| **Default Rule** | Does not execute unless explicitly written | Implicitly calls `super()` if no call is specified |",
        "keyConcepts": "super(), this(), Constructor delegation, Top-down initialization, Object initialization safety",
        "code": "class Parent:\n    def __init__(self, name):\n        self.name = name\n        print(\"1. Parent constructor executed for:\", self.name)\n\nclass Child(Parent):\n    def __init__(self, name, age):\n        super().__init__(name)  # Inter-class constructor chaining\n        self.age = age\n        print(f\"2. Child constructor executed. Age: {self.age}\")\n\nc = Child(\"Alice\", 25)",
        "output": "1. Parent constructor executed for: Alice\n2. Child constructor executed. Age: 25"
      },
      {
        "id": 54,
        "title": "Multiple Inheritance",
        "topicId": 3,
        "topicName": "Lifecycle & Inheritance Semantics",
        "level": "Core Concept",
        "answer": "\"Multiple Inheritance is a feature in object-oriented programming where a single class can inherit state and behavior directly from more than one superclass.\n\nWhile languages like C++ and Python natively support multiple class inheritance (resolving ambiguities via C3 Linearization / MRO), languages like Java and C# intentionally disallow multiple class inheritance of state to prevent complexity and the Diamond Problem. Instead, Java supports multiple inheritance of type through interfaces.\"\n\n| Feature | Python & C++ | Java & C# |\n| --- | --- | --- |\n| **Class Multiple Inheritance**| Supported directly (`class C(A, B):`) | Prohibited (a class can extend only ONE superclass) |\n| **Ambiguity Resolution** | C3 Linearization / Method Resolution Order | Solved by allowing multiple interface implementation |\n| **State Inheritance** | Inherits fields from multiple classes | Can only inherit instance state from a single parent |\n| **Diamond Problem** | Solved natively via deterministic MRO | Avoided entirely for class state |\n| **Interface Implementation**| Supported | Can implement arbitrarily many interfaces (`implements A, B`) |",
        "keyConcepts": "Multiple inheritance, C3 linearization, Method Resolution Order, Interface implementation, Multiple subtyping",
        "code": "class Swimmer:\n    def swim(self):\n        return \"Swimming in water\"\n\nclass Flyer:\n    def fly(self):\n        return \"Flying in air\"\n\nclass Duck(Swimmer, Flyer):\n    pass\n\nd = Duck()\nprint(\"Duck abilities:\", d.swim(), \"|\", d.fly())",
        "output": "Duck abilities: Swimming in water | Flying in air"
      },
      {
        "id": 55,
        "title": "Diamond Problem",
        "topicId": 3,
        "topicName": "Lifecycle & Inheritance Semantics",
        "level": "Core Concept",
        "answer": "\"The Diamond Problem is an ambiguity that arises in multiple inheritance when a class (D) inherits from two superclasses (B and C), both of which inherit from a common base class (A).\n\nIf class A defines a method that both B and C override, class D does not know which version to inherit. Python resolves this deterministically using the C3 Linearization algorithm (Method Resolution Order, or `__mro__`). Java prevents it for class hierarchies by disallowing multiple class inheritance, and requires explicit disambiguation if default methods collide across interfaces.\"\n\n| Feature | Diamond Problem in C++ | Python Solution | Java Solution |\n| --- | --- | --- |\n| **Problem Root** | Duplicate base sub-objects | Ambiguous method path | Interface default method collisions |\n| **Resolution** | `virtual` base classes | C3 MRO (`ClassName.__mro__`) | Compiler forces developer to override and disambiguate |\n| **Execution Order** | Non-trivial pointer adjustment | Deterministic monotonic sequence | Explicit `InterfaceName.super.method()` call |\n| **State Duplication** | Base sub-object duplicated unless virtual | Base initialized once via `super()` | Interfaces do not contain instance state |",
        "keyConcepts": "Diamond problem, C3 linearization, MRO, Virtual base class, Ambiguity disambiguation",
        "code": "class A:\n    def action(self):\n        return \"Action from A\"\n\nclass B(A):\n    def action(self):\n        return \"Action from B\"\n\nclass C(A):\n    def action(self):\n        return \"Action from C\"\n\nclass D(B, C):\n    pass\n\nd = D()\nprint(\"Resolved Method Call:\", d.action())\nprint(\"Deterministic MRO:\", [cls.__name__ for cls in D.__mro__])",
        "output": "Resolved Method Call: Action from B\nDeterministic MRO: ['D', 'B', 'C', 'A', 'object']"
      },
      {
        "id": 56,
        "title": "Coupling vs Cohesion",
        "topicId": 5,
        "topicName": "Software Design & Architecture",
        "level": "Core Concept",
        "answer": "\"Coupling measures the degree of interdependence and connectivity between different software modules or classes. High coupling means classes are tightly bound together; changing one breaks others. Low coupling is desired.\n\nCohesion measures how focused, related, and united the internal responsibilities of a single module or class are. High cohesion means a class does one clear job and does it well. The cardinal software engineering goal is: High Cohesion and Low Coupling.\"\n\n| Feature | Coupling | Cohesion |\n| --- | --- | --- |\n| **Definition** | Inter-module relationship (interdependence) | Intra-module relationship (internal focus) |\n| **Ideal State** | Low / Loose coupling | High / Strong cohesion |\n| **Impact of Change**| High coupling causes ripple effects across modules | High cohesion isolates modifications to a single module |\n| **Testability** | Low coupling allows easy mocking and unit testing | High cohesion makes classes simple to unit test |\n| **Achieved Via** | Dependency Injection, Interfaces, Event buses | Single Responsibility Principle, modular design |",
        "keyConcepts": "High cohesion, Low coupling, Interdependence, Ripple effect, Modular architecture",
        "code": "# High Cohesion & Low Coupling:\nclass EmailNotifier:\n    def send_email(self, recipient, message):\n        return f\"Email sent to {recipient}: {message}\"\n\nclass OrderProcessor:\n    def __init__(self, notifier):\n        self.notifier = notifier  # Loosely coupled dependency\n\n    def process_order(self, order_id, customer_email):\n        # Single responsibility: processes order, delegates notification\n        return self.notifier.send_email(customer_email, f\"Order #{order_id} confirmed!\")\n\nop = OrderProcessor(EmailNotifier())\nprint(op.process_order(101, \"user@example.com\"))",
        "output": "Email sent to user@example.com: Order #101 confirmed!"
      },
      {
        "id": 57,
        "title": "Object Identity vs Object Equality",
        "topicId": 5,
        "topicName": "Software Design & Architecture",
        "level": "Core Concept",
        "answer": "\"Object Identity checks whether two reference variables point to the exact same physical memory address in the heap (referential equality, checked with `==` in Java or `is` in Python).\n\nObject Equality checks whether two distinct objects hold equivalent internal states or values (structural/semantic equality, checked with `.equals()` in Java or `==` in Python). Two distinct objects can have identical values (equality) while possessing distinct identities.\"\n\n| Feature | Object Identity | Object Equality |\n| --- | --- | --- |\n| **What It Checks** | Memory address / pointer comparison | Value / state comparison of attributes |\n| **Python Operator**| `a is b` (tests `id(a) == id(b)`) | `a == b` (invokes `a.__eq__(b)`) |\n| **Java Operator** | `a == b` (reference equality) | `a.equals(b)` (overridden value check) |\n| **Memory Relevance**| True only if both variables reference 1 heap object | True even if objects occupy 2 separate heap regions |\n| **Customization** | Cannot be overridden (tied to heap memory pointer) | Can be customized via `.equals()` / `__eq__()` |",
        "keyConcepts": "Identity vs Equality, Memory address, is vs ==, equals() contract, Reference comparison",
        "code": "list_a = [1, 2, 3]\nlist_b = [1, 2, 3]\nlist_c = list_a\n\nprint(\"Value Equality (list_a == list_b):\", list_a == list_b)\nprint(\"Identity Equality (list_a is list_b):\", list_a is list_b)\nprint(\"Identity Equality (list_a is list_c):\", list_a is list_c)",
        "output": "Value Equality (list_a == list_b): True\nIdentity Equality (list_a is list_b): False\nIdentity Equality (list_a is list_c): True"
      },
      {
        "id": 58,
        "title": "Immutable Objects",
        "topicId": 5,
        "topicName": "Software Design & Architecture",
        "level": "Core Concept",
        "answer": "\"An Immutable Object is an object whose internal state cannot be modified after it is instantiated and constructed. Any operation that appears to modify an immutable object actually returns a brand new object with the modified state.\n\nImmutable objects provide inherent thread-safety without synchronization locks, can be cached safely, eliminate side effects, and make ideal keys for hash-based data structures (like HashMaps and Sets). Common examples include Java Strings, Python tuples/frozensets, and Numbers.\"\n\n| Feature | Immutable Objects | Mutable Objects |\n| --- | --- | --- |\n| **State Modification**| Impossible after constructor completes | Freely modified in-place |\n| **Thread Safety** | Inherent; completely safe across concurrent threads | Requires synchronization / lock mechanisms |\n| **Hash Consistency** | Hash code remains constant (safe HashMap keys) | Mutating object corrupts hash table lookup |\n| **Memory Impact** | May create extra garbage allocations | In-place modifications avoid extra allocations |\n| **Examples** | `String`, `Integer`, `tuple`, `frozenset` | `ArrayList`, `HashMap`, `list`, `dict` |",
        "keyConcepts": "Immutability, Thread safety, Side-effect free, Hash key stability, Defensive copying",
        "code": "from dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Point:\n    x: int\n    y: int\n\np = Point(10, 20)\nprint(\"Created Immutable Point:\", p)\ntry:\n    p.x = 99  # Attempting mutation\nexcept Exception as e:\n    print(\"Mutation blocked:\", type(e).__name__)",
        "output": "Created Immutable Point: Point(x=10, y=20)\nMutation blocked: FrozenInstanceError"
      },
      {
        "id": 59,
        "title": "SOLID Principles",
        "topicId": 5,
        "topicName": "Software Design & Architecture",
        "level": "Core Concept",
        "answer": "\"The SOLID Principles are five core design guidelines formulated by Robert C. Martin (Uncle Bob) to build maintainable, understandable, and scalable object-oriented software:\n\n1. **S - Single Responsibility Principle (SRP):** A class should have one, and only one, reason to change.\n2. **O - Open/Closed Principle (OCP):** Software entities should be open for extension, but closed for modification.\n3. **L - Liskov Substitution Principle (LSP):** Subtypes must be substitutable for their base types without altering program correctness.\n4. **I - Interface Segregation Principle (ISP):** Clients should not be forced to depend upon interfaces they do not use.\n5. **D - Dependency Inversion Principle (DIP):** High-level modules should not depend on low-level modules; both should depend on abstractions.\"\n\n| Principle | Core Meaning | Violation Symptom |\n| --- | --- | --- |\n| **S - Single Responsibility**| One clear purpose per class | Massive \\\"God\\\" classes handling business logic & I/O |\n| **O - Open/Closed** | Extend via polymorphism without editing base code | Fragile `switch-case` blocks edited for each new feature |\n| **L - Liskov Substitution** | Derived class must honor base contracts | Subclass throws `UnsupportedOperationException` |\n| **I - Interface Segregation**| Small, focused client-tailored interfaces | Fat interfaces forcing classes to implement dummy methods |\n| **D - Dependency Inversion** | Depend on interfaces, not concrete implementations| Hardcoded `new ConcreteService()` instantiations |",
        "keyConcepts": "SOLID, SRP, OCP, LSP, ISP, DIP, Uncle Bob, Architecture quality",
        "code": "# Dependency Inversion Principle:\nfrom abc import ABC, abstractmethod\n\nclass MessageSender(ABC):\n    @abstractmethod\n    def send(self, msg):\n        pass\n\nclass SMS(MessageSender):\n    def send(self, msg): return f\"SMS: {msg}\"\n\nclass NotificationService:\n    def __init__(self, sender: MessageSender):  # Depends on abstraction\n        self.sender = sender\n    def notify(self, msg): return self.sender.send(msg)\n\nprint(NotificationService(SMS()).notify(\"Your OTP is 4920\"))",
        "output": "SMS: Your OTP is 4920"
      },
      {
        "id": 60,
        "title": "Dependency Injection",
        "topicId": 5,
        "topicName": "Software Design & Architecture",
        "level": "Core Concept",
        "answer": "\"Dependency Injection (DI) is a software design pattern implementing Inversion of Control (IoC), where an object receives its dependencies from an external source (assembler or IoC container) rather than instantiating them internally with `new`.\n\nThere are three primary forms of DI: Constructor Injection (preferred for required dependencies), Setter Injection (for optional dependencies), and Field/Interface Injection. DI drastically decouples components, facilitates unit testing with mocks, and allows configuration swapping without code changes.\"\n\n| Feature | Dependency Injection | Hardcoded Instantiation (`new`) |\n| --- | --- | --- |\n| **Control** | Inverted: caller or container supplies dependency | Direct: class controls its own dependencies |\n| **Coupling** | Loosely coupled to interface | Tightly coupled to concrete implementation |\n| **Testability** | High; mock dependencies can be effortlessly injected | Low; difficult or impossible to isolate during tests |\n| **Configurability** | Dependencies can be swapped via configuration/framework| Requires modifying and recompiling source code |\n| **Industry Standards**| Spring Framework, Guice, Angular, FastAPI | Legacy procedural and tightly coupled scripts |",
        "keyConcepts": "Inversion of Control (IoC), Constructor injection, Setter injection, Mock testing, Spring IoC",
        "code": "class Database:\n    def query(self): return \"Live Production Data\"\n\nclass MockDatabase:\n    def query(self): return \"Simulated Test Data\"\n\nclass UserService:\n    # Constructor Dependency Injection:\n    def __init__(self, db):\n        self.db = db\n    def get_users(self):\n        return f\"Retrieved: {self.db.query()}\"\n\n# Test with mock:\ntest_service = UserService(MockDatabase())\nprint(test_service.get_users())",
        "output": "Retrieved: Simulated Test Data"
      }
    ]
  }
};
