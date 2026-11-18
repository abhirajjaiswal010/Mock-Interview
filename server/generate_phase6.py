# -*- coding: utf-8 -*-
import json
import os

data = {
    "phase": "Phase 6: File Handling and Modules",
    "totalQuestions": 240,
    "topics": [
        {"id": 1, "name": "File Handling Fundamentals", "range": [1, 25], "count": 25},
        {"id": 2, "name": "File Modes & Permissions", "range": [26, 45], "count": 20},
        {"id": 3, "name": "Context Managers", "range": [46, 60], "count": 15},
        {"id": 4, "name": "File Operations & Seeking", "range": [61, 80], "count": 20},
        {"id": 5, "name": "Serialization (JSON & Pickle)", "range": [81, 110], "count": 30},
        {"id": 6, "name": "Modules & Namespaces", "range": [111, 135], "count": 25},
        {"id": 7, "name": "Packages & Distribution", "range": [136, 155], "count": 20},
        {"id": 8, "name": "Python Import System Internals", "range": [156, 175], "count": 20},
        {"id": 9, "name": "Virtual Environments & Isolation", "range": [176, 195], "count": 20},
        {"id": 10, "name": "Dependencies & Packaging", "range": [196, 220], "count": 25},
        {"id": 11, "name": "SDE-2 Scenarios & Production Challenges", "range": [221, 240], "count": 20}
    ],
    "questions": []
}

raw_q = [
    # Topic 1: File Handling Fundamentals (1-25)
    {
        "id": 1,
        "title": "What is file handling in Python?",
        "level": "SDE-1",
        "topicId": 1,
        "topicName": "File Handling Fundamentals",
        "answer": "File handling is the process of creating, opening, reading, writing, appending, and managing files using Python. It allows applications to store data permanently on persistent storage instead of keeping it volatile in memory.",
        "keyConcepts": "Persistent storage, I/O operations, file object, data management",
        "code": "# Basic file handling syntax\nwith open('example.txt', 'w') as f:\n    f.write('Hello, Python Persistent Storage!')",
        "output": ""
    },
    {
        "id": 2,
        "title": "How do you open a file in Python?",
        "level": "SDE-1",
        "topicId": 1,
        "topicName": "File Handling Fundamentals",
        "answer": "Python provides the built-in `open()` function to open files. It accepts a file path and an access mode ('r', 'w', 'a', etc.) and returns a file object that provides methods to perform file operations.",
        "keyConcepts": "open(), file descriptor, file object, mode",
        "code": "file = open('data.txt', 'r')\ncontent = file.read()\nfile.close()",
        "output": ""
    },
    {
        "id": 3,
        "title": "What is the difference between a file and a file object?",
        "level": "SDE-1",
        "topicId": 1,
        "topicName": "File Handling Fundamentals",
        "answer": "A file is a physical persistent resource stored on the filesystem (disk), whereas a file object is a Python in-memory wrapper object representing an opened file handle with methods (`read()`, `write()`, `close()`) to interact with that file stream.\n\n| Attribute | File (Filesystem Resource) | File Object (Python Abstraction) |\n| --- | --- | --- |\n| Location | Stored on disk / SSD | Allocated in RAM as a Python object |\n| Lifetime | Persistent across reboots | Exists only while process is running |\n| Interaction | Managed by OS kernel & filesystem | Controlled via Python methods (`read`, `seek`) |",
        "keyConcepts": "Filesystem, file object, abstraction, file descriptor",
        "code": "f = open('data.txt', 'w')\nprint(type(f))  # <class '_io.TextIOWrapper'>\nf.close()",
        "output": "<class '_io.TextIOWrapper'>"
    },
    {
        "id": 4,
        "title": "What does the open() function return?",
        "level": "SDE-1",
        "topicId": 1,
        "topicName": "File Handling Fundamentals",
        "answer": "The `open()` function returns a file stream object. In text mode, it returns an instance of `_io.TextIOWrapper`. In binary read mode, it returns `_io.BufferedReader`. In binary write mode, it returns `_io.BufferedWriter`.",
        "keyConcepts": "TextIOWrapper, BufferedReader, BufferedWriter, I/O interface",
        "code": "with open('text.txt', 'w') as t, open('bin.bin', 'wb') as b:\n    print(type(t))\n    print(type(b))",
        "output": "<class '_io.TextIOWrapper'>\n<class '_io.BufferedWriter'>"
    },
    {
        "id": 5,
        "title": "What is the purpose of close()?",
        "level": "SDE-1",
        "topicId": 1,
        "topicName": "File Handling Fundamentals",
        "answer": "The `close()` method closes an opened file stream and releases the associated operating system file descriptor. It also flushes any remaining buffered data to the operating system before deallocating resources.",
        "keyConcepts": "Resource management, buffer flushing, file closure, OS file handles",
        "code": "file = open('data.txt', 'w')\nfile.write('Hello World')\nfile.close()\nprint(file.closed)  # True",
        "output": "True"
    },
    {
        "id": 6,
        "title": "What happens if you forget to close a file?",
        "level": "SDE-1",
        "topicId": 1,
        "topicName": "File Handling Fundamentals",
        "answer": "If a file is not closed:\n1. It consumes OS file descriptors (causing 'Too many open files' `OSError` under heavy traffic).\n2. Buffered write data may remain in memory and be lost if the process terminates abnormally.\n3. On operating systems like Windows, the open file is locked and cannot be renamed or deleted by other processes.",
        "keyConcepts": "Resource leak, file handles exhaustion, buffering data loss, OS locks",
        "code": "# Anti-pattern: Missing close\n# Correct pattern: Always use 'with' statement\nwith open('safe.txt', 'w') as f:\n    f.write('Guaranteed to close even if error occurs')",
        "output": ""
    },
    {
        "id": 7,
        "title": "What is the difference between read(), readline(), and readlines()?",
        "level": "SDE-1",
        "topicId": 1,
        "topicName": "File Handling Fundamentals",
        "answer": "These three methods read file contents at different granularities:\n\n| Method | Return Type | Memory Impact | Usage |\n| --- | --- | --- | --- |\n| `read(size=-1)` | `str` (or `bytes`) | High (loads entire file into RAM if no size) | When full text is needed at once |\n| `readline(size=-1)` | `str` (single line) | Very Low (reads 1 line at a time) | Sequential line processing |\n| `readlines(hint=-1)` | `list[str]` | High (loads all lines into a Python list) | Small files where indexed lines are needed |",
        "keyConcepts": "File reading, memory consumption, iteration, buffering",
        "code": "with open('sample.txt', 'w') as f:\n    f.write('Line 1\\nLine 2\\nLine 3')\n\nwith open('sample.txt', 'r') as f:\n    print(repr(f.readline()))  # 'Line 1\\n'\n    print(f.readlines())       # ['Line 2\\n', 'Line 3']",
        "output": "'Line 1\\n'\n['Line 2\\n', 'Line 3']"
    },
    {
        "id": 8,
        "title": "What does write() return in Python?",
        "level": "SDE-1",
        "topicId": 1,
        "topicName": "File Handling Fundamentals",
        "answer": "In text mode, `write()` returns the exact number of characters (`int`) written to the stream. In binary mode, it returns the number of bytes written.",
        "keyConcepts": "Return value, character count, byte count",
        "code": "with open('data.txt', 'w') as f:\n    chars_written = f.write('Python 3.13')\nprint(f'Characters written: {chars_written}')",
        "output": "Characters written: 11"
    },
    {
        "id": 9,
        "title": "Does write() automatically add a newline?",
        "level": "SDE-1",
        "topicId": 1,
        "topicName": "File Handling Fundamentals",
        "answer": "No. The `write()` method does not append a newline character (`\\n`). To write multiple lines, you must explicitly include `\\n` at the end of strings or use `writelines()` with pre-formatted strings.",
        "keyConcepts": "Newline character (\\n), string formatting, writelines",
        "code": "with open('lines.txt', 'w') as f:\n    f.write('First Line\\n')\n    f.write('Second Line\\n')",
        "output": ""
    },
    {
        "id": 10,
        "title": "What is the difference between read() and iteration over a file?",
        "level": "SDE-1",
        "topicId": 1,
        "topicName": "File Handling Fundamentals",
        "answer": "`read()` loads the entire file into memory at once as a single string, which causes high memory spikes or Out-Of-Memory (OOM) crashes on large files. In contrast, iterating directly over the file object (`for line in f:`) uses Python's internal generator buffer to stream the file line by line, maintaining O(1) constant memory usage.",
        "keyConcepts": "Lazy reading, memory efficiency, iterator protocol, O(1) memory",
        "code": "# Memory Efficient Production Pattern:\nwith open('large_dataset.log') as f:\n    for line in f:\n        if 'ERROR' in line:\n            print(line.strip())",
        "output": ""
    },
    {
        "id": 11,
        "title": "What happens when you read a file multiple times without seeking?",
        "level": "SDE-1",
        "topicId": 1,
        "topicName": "File Handling Fundamentals",
        "answer": "The file cursor (pointer) advances with each read operation. Once the cursor reaches the End-Of-File (EOF), any subsequent calls to `read()`, `readline()`, or `readlines()` will return an empty string (`''`) or empty list (`[]`) until the cursor is explicitly reset using `f.seek(0)`.",
        "keyConcepts": "File cursor, EOF (End-Of-File), file pointer, seek(0)",
        "code": "with open('demo.txt', 'w+') as f:\n    f.write('Sample')\n    f.seek(0)\n    print(f.read())   # 'Sample'\n    print(repr(f.read()))  # '' (EOF reached)",
        "output": "Sample\n''"
    },
    {
        "id": 12,
        "title": "What is EOF (End Of File) in Python?",
        "level": "SDE-1",
        "topicId": 1,
        "topicName": "File Handling Fundamentals",
        "answer": "EOF (End Of File) is the condition where no more data can be read from a stream because the file pointer has reached the end of the file. In Python, file reading methods signal EOF by returning an empty string `''` in text mode or empty bytes `b''` in binary mode, rather than raising an exception.",
        "keyConcepts": "EOF, sentinel value, empty string, empty bytes",
        "code": "with open('demo.txt', 'r') as f:\n    while True:\n        chunk = f.read(1024)\n        if chunk == '':  # EOF sentinel check\n            break\n        # process chunk",
        "output": ""
    },
    {
        "id": 13,
        "title": "What is the difference between text mode and binary mode?",
        "level": "SDE-1",
        "topicId": 1,
        "topicName": "File Handling Fundamentals",
        "answer": "Text mode ('t', default) operates on Unicode strings (`str`), automatically encoding text when writing and decoding bytes when reading using a specified encoding (like UTF-8), and translates platform newlines (`\\r\\n` to `\\n` on Windows). Binary mode ('b') works directly with raw `bytes` without any encoding or newline translation.\n\n| Feature | Text Mode (`'r'`, `'w'`) | Binary Mode (`'rb'`, `'wb'`) |\n| --- | --- | --- |\n| Data Type | `str` (Unicode) | `bytes` (raw binary) |\n| Encoding / Decoding | Automatic (e.g. UTF-8) | None (exact bytes preserved) |\n| Line Endings | Translated (CRLF -> LF) | Preserved exactly as on disk |\n| Typical Use | CSV, JSON, TXT, code files | Images, PDFs, audio, executables |",
        "keyConcepts": "Unicode, encoding, bytes, decoding, newline translation",
        "code": "with open('test.bin', 'wb') as f:\n    f.write(b'\\x00\\xFF\\x41\\x42')\n\nwith open('test.bin', 'rb') as f:\n    data = f.read()\n    print(data)  # b'\\x00\\xffAB'",
        "output": "b'\\x00\\xffAB'"
    },
    {
        "id": 14,
        "title": "What is file buffering in Python?",
        "level": "SDE-1",
        "topicId": 1,
        "topicName": "File Handling Fundamentals",
        "answer": "Buffering is an I/O optimization technique where data is accumulated in a temporary RAM buffer before issuing expensive low-level system calls (`read()` / `write()`) to disk. Python supports:\n- `buffering=0`: Unbuffered (binary mode only)\n- `buffering=1`: Line buffered (text mode only, flushes on `\\n`)\n- `buffering>1`: Fixed buffer size in bytes (e.g. 8192 bytes)\n- `buffering=-1`: Default system buffer size (typically 4KB or 8KB).",
        "keyConcepts": "Buffer, I/O optimization, system calls, flushing, buffer size",
        "code": "# Specifying an 8KB buffer for high throughput\nwith open('large.csv', 'r', buffering=8192) as f:\n    header = f.readline()",
        "output": ""
    },
    {
        "id": 15,
        "title": "What is encoding in Python file handling and why should you always specify it?",
        "level": "SDE-1",
        "topicId": 1,
        "topicName": "File Handling Fundamentals",
        "answer": "Encoding is the rule set used to convert human-readable Unicode text (`str`) into raw disk bytes (`bytes`). If you do not specify `encoding='utf-8'`, Python falls back to `locale.getpreferredencoding()`, which differs across systems (Windows often defaults to `cp1252`, Linux to `utf-8`), causing `UnicodeDecodeError` across environments.",
        "keyConcepts": "Unicode, UTF-8, cross-platform reproducibility, UnicodeDecodeError",
        "code": "# Production Best Practice: Always specify encoding='utf-8'\nwith open('i18n.txt', 'w', encoding='utf-8') as f:\n    f.write('नमस्ते, Python! 🐍')",
        "output": ""
    },
    {
        "id": 16,
        "title": "What is the difference between flush() and close()?",
        "level": "SDE-1",
        "topicId": 1,
        "topicName": "File Handling Fundamentals",
        "answer": "`flush()` forces any unwritten data in the user-space Python buffer to be sent to the operating system's kernel buffer without closing the file handle (allowing continued writing). `close()` flushes the buffer AND terminates the file stream, releasing the OS file descriptor.",
        "keyConcepts": "flush(), close(), user-space buffer, OS kernel buffer, descriptor release",
        "code": "f = open('log.txt', 'w')\nf.write('Important log entry')\nf.flush()  # Written to OS buffer immediately, file remains open!\nf.write('Another entry')\nf.close()  # Flushed and closed",
        "output": ""
    },
    {
        "id": 17,
        "title": "Can multiple processes open the same file simultaneously?",
        "level": "SDE-1",
        "topicId": 1,
        "topicName": "File Handling Fundamentals",
        "answer": "Yes. Multiple processes can open the same file simultaneously for reading without conflict. However, concurrent writes or simultaneous read-write operations will lead to race conditions and data corruption unless coordinated using inter-process synchronization or file locking (e.g. `fcntl.flock` on Unix or `msvcrt.locking` on Windows).",
        "keyConcepts": "Concurrency, race conditions, file locking, fcntl, atomicity",
        "code": "# Tip: For inter-process file locking, use the 'filelock' library:\n# from filelock import FileLock\n# with FileLock('app.lock'):\n#     with open('shared.txt', 'a') as f: ...",
        "output": ""
    },
    {
        "id": 18,
        "title": "What is a file descriptor in Python?",
        "level": "SDE-1",
        "topicId": 1,
        "topicName": "File Handling Fundamentals",
        "answer": "A file descriptor is a non-negative integer assigned by the operating system kernel that serves as an index in the process's open file table. You can retrieve it from any Python file object via `f.fileno()`. Standard descriptors: 0 for `stdin`, 1 for `stdout`, 2 for `stderr`.",
        "keyConcepts": "OS kernel handle, fileno(), stdin (0), stdout (1), stderr (2)",
        "code": "import sys\nwith open('sample.txt', 'w') as f:\n    print(f'File descriptor: {f.fileno()}')\nprint(f'Stdout descriptor: {sys.stdout.fileno()}')",
        "output": "Stdout descriptor: 1"
    },
    {
        "id": 19,
        "title": "What is the difference between relative path and absolute path?",
        "level": "SDE-1",
        "topicId": 1,
        "topicName": "File Handling Fundamentals",
        "answer": "An absolute path defines the full filesystem path from the root directory (`/` on Linux/macOS or `C:\\` on Windows), independent of the current working directory. A relative path defines the path relative to the process's current working directory (`os.getcwd()`).",
        "keyConcepts": "Absolute path, relative path, pathlib, CWD (os.getcwd())",
        "code": "from pathlib import Path\nrel_p = Path('data/config.json')\nabs_p = rel_p.resolve()\nprint(abs_p)",
        "output": ""
    },
    {
        "id": 20,
        "title": "How can you check whether a file exists in Python?",
        "level": "SDE-1",
        "topicId": 1,
        "topicName": "File Handling Fundamentals",
        "answer": "Modern Python recommends `pathlib.Path.is_file()` or `pathlib.Path.exists()`. Alternatively, the legacy `os.path.isfile()` or `os.path.exists()` can be used.\n\n`is_file()` is safer because it returns `False` if the target is a directory rather than a file.",
        "keyConcepts": "pathlib.Path.is_file(), os.path.exists, filesystem validation",
        "code": "from pathlib import Path\np = Path('settings.json')\nif p.is_file():\n    print('File exists and is a regular file!')\nelse:\n    print('Not found or is a directory')",
        "output": ""
    },
    {
        "id": 21,
        "title": "How would you read a 10 GB file efficiently in Python?",
        "level": "SDE-1",
        "topicId": 1,
        "topicName": "File Handling Fundamentals",
        "answer": "Never use `f.read()` or `f.readlines()`, which cause an immediate Out-Of-Memory crash. Instead:\n1. If line-based: Use file iteration `for line in f:`, which streams line by line with O(1) memory.\n2. If binary or un-delimited: Read in fixed-size binary chunks using `iter(lambda: f.read(65536), b'')`.",
        "keyConcepts": "Streaming, chunk processing, memory optimization, iter() sentinel pattern",
        "code": "# Production chunked streaming pattern:\ndef stream_large_file(filepath, chunk_size=65536):\n    with open(filepath, 'rb') as f:\n        while chunk := f.read(chunk_size):\n            yield chunk",
        "output": ""
    },
    {
        "id": 22,
        "title": "How would you handle errors when opening a file?",
        "level": "SDE-1",
        "topicId": 1,
        "topicName": "File Handling Fundamentals",
        "answer": "Wrap the operation in a `try-except` block catching specific `OSError` subclasses:\n- `FileNotFoundError`: File path doesn't exist.\n- `PermissionError`: Insufficient OS read/write privileges.\n- `IsADirectoryError`: Path points to a folder instead of a file.\n- `UnicodeDecodeError`: File text doesn't match the specified encoding.",
        "keyConcepts": "FileNotFoundError, PermissionError, IsADirectoryError, OSError hierarchy",
        "code": "try:\n    with open('protected.txt', 'r', encoding='utf-8') as f:\n        data = f.read()\nexcept FileNotFoundError:\n    print('File does not exist.')\nexcept PermissionError:\n    print('Access denied.')\nexcept UnicodeDecodeError:\n    print('Encoding mismatch.')",
        "output": ""
    },
    {
        "id": 23,
        "title": "Why should we avoid repeatedly opening and closing a file inside a loop?",
        "level": "SDE-1",
        "topicId": 1,
        "topicName": "File Handling Fundamentals",
        "answer": "Opening and closing files triggers OS kernel context switches, permission checks, and disk inode lookups. Repeating this inside a loop degrades performance by thousands of times. Open the file once outside the loop and keep the handle open for the duration of the batch write.",
        "keyConcepts": "System call overhead, kernel context switch, disk I/O performance",
        "code": "# Anti-pattern: 10,000 open/close syscalls\n# for item in items: open('out.txt', 'a').write(item)\n\n# Optimized Production Pattern: 1 open/close syscall\nwith open('out.txt', 'w') as f:\n    for item in items:\n        f.write(f'{item}\\n')",
        "output": ""
    },
    {
        "id": 24,
        "title": "What is the difference between flushing data and guaranteeing persistence?",
        "level": "SDE-1",
        "topicId": 1,
        "topicName": "File Handling Fundamentals",
        "answer": "`f.flush()` only moves data from Python's internal buffer into the Operating System kernel's page cache. If power is lost immediately after, data in the OS page cache can still be lost! To guarantee physical disk persistence, you must follow `f.flush()` with `os.fsync(f.fileno())`.",
        "keyConcepts": "Durability, flush(), os.fsync(), OS page cache, ACID persistence",
        "code": "import os\nwith open('critical_ledger.dat', 'wb') as f:\n    f.write(b'CRITICAL TRANSACTION DATA')\n    f.flush()               # From Python to OS cache\n    os.fsync(f.fileno())    # From OS cache to physical disk hardware!",
        "output": ""
    },
    {
        "id": 25,
        "title": "How would you safely write a critical configuration file without risking partial updates?",
        "level": "SDE-1",
        "topicId": 1,
        "topicName": "File Handling Fundamentals",
        "answer": "Use the **Atomic File Write Pattern**:\n1. Write the new data to a temporary file in the same directory (`tempfile.NamedTemporaryFile`).\n2. Call `flush()` and `os.fsync()` to ensure the temp file is written to physical disk.\n3. Atomically replace the destination file using `os.replace(temp_path, dest_path)`.\nBecause POSIX `rename()` / `os.replace()` is an atomic filesystem metadata pointer swap, readers never observe a corrupted or half-written file.",
        "keyConcepts": "Atomic replacement, os.replace(), tempfile, data integrity",
        "code": "import os, tempfile\ndef atomic_write(filepath, content):\n    dirname = os.path.dirname(filepath) or '.'\n    with tempfile.NamedTemporaryFile('w', dir=dirname, delete=False) as tf:\n        tf.write(content)\n        tf.flush()\n        os.fsync(tf.fileno())\n        temp_name = tf.name\n    os.replace(temp_name, filepath)",
        "output": ""
    }
]

print(f"Loaded {len(raw_q)} initial questions.")
