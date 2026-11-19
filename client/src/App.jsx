import React, { useState, useMemo, useEffect } from 'react';
import { allPhases } from './data/interviewData.js';

// Dedicated CodeBlock with line numbers, copy button, and output display
function CodeBlock({ code, output }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\n');

  return (
    <div className="space-y-2.5">
      <div className="rounded-xl overflow-hidden border border-stone-800 bg-[#0f141c] shadow-sm">
        {/* Code Header Bar */}
        <div className="px-3.5 py-2 bg-[#171f2c] border-b border-stone-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
            <span className="text-[11px] font-mono text-stone-400 font-medium ml-1">python</span>
          </div>

          <button
            onClick={handleCopy}
            className="text-[11px] text-stone-300 hover:text-white px-2 py-0.5 rounded bg-stone-800/80 hover:bg-stone-750 transition-colors cursor-pointer flex items-center gap-1"
          >
            {copied ? (
              <span className="text-emerald-400 font-semibold">✓ Copied</span>
            ) : (
              <span>Copy</span>
            )}
          </button>
        </div>

        {/* Code Content with Line Numbers */}
        <div className="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed flex">
          <div className="select-none text-stone-600 text-right pr-3.5 border-r border-stone-800/80 shrink-0 font-mono">
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <pre className="pl-4 text-amber-100/90 whitespace-pre font-mono">
            <code>{code}</code>
          </pre>
        </div>
      </div>

      {/* Terminal / Output block */}
      {output && (
        <div className="rounded-xl overflow-hidden border border-stone-800 bg-[#0a0e17] text-xs sm:text-sm font-mono">
          <div className="px-3.5 py-1.5 bg-[#121924] border-b border-stone-800 text-[11px] font-semibold text-emerald-400 tracking-wider uppercase flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Output
          </div>
          <div className="p-3.5 text-emerald-300 font-mono whitespace-pre overflow-x-auto leading-relaxed">
            {output}
          </div>
        </div>
      )}
    </div>
  );
}

// Render inline code backticks with distinct styling
// Formats inline markdown: code `code`, bold/highlight **keyword** or __keyword__, and italic *text*
function renderFormattedInline(text) {
  if (!text) return null;
  // Splits by inline code (`...`), bold/highlight (**...** or __...__), and italic (*...*)
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*)/g);
  return parts.map((part, index) => {
    // 1. Inline code: `code`
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code
          key={index}
          className="font-mono text-emerald-900 bg-emerald-100/90 border border-emerald-300/70 px-1.5 py-0.5 rounded text-[11px] sm:text-xs font-semibold mx-0.5 inline-block"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    // 2. Bold & Keyword Highlight: **keyword** or __keyword__ (Dark green without bg)
    if (
      ((part.startsWith('**') && part.endsWith('**')) ||
       (part.startsWith('__') && part.endsWith('__'))) &&
      part.length > 4
    ) {
      return (
        <strong
          key={index}
          className="font-bold text-emerald-800"
        >
          {part.slice(2, -2)}
        </strong>
      );
    }
    // 3. Italic: *italic*
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return (
        <em key={index} className="italic text-stone-900 font-medium">
          {part.slice(1, -1)}
        </em>
      );
    }
    return part;
  });
}

// Helper to check if a line is a Markdown table separator (|---|---| or :---|:---:)
function isTableSeparatorLine(line) {
  const trimmed = line.trim();
  return (
    trimmed.includes('|') &&
    trimmed.includes('-') &&
    /^[\s|:\-]+$/.test(trimmed)
  );
}

// Helper to split a table row into cells, handling optional leading/trailing pipes
function splitTableRow(line) {
  let trimmed = line.trim();
  if (trimmed.startsWith('|')) trimmed = trimmed.slice(1);
  if (trimmed.endsWith('|')) trimmed = trimmed.slice(0, -1);
  return trimmed.split('|').map((c) => c.trim());
}

// Parses Markdown tables out of answers
function parseAnswerWithTable(answerText) {
  if (!answerText) return { preText: '', table: null, postText: '' };

  const lines = answerText.split('\n');

  // Find table separator line index (which must be preceded by a header line with '|')
  const sepIdx = lines.findIndex(
    (line, i) => i > 0 && isTableSeparatorLine(line) && lines[i - 1].includes('|')
  );

  if (sepIdx === -1) {
    return { preText: answerText, table: null, postText: '' };
  }

  const headerIdx = sepIdx - 1;
  const headerCells = splitTableRow(lines[headerIdx]);

  if (headerCells.length === 0) {
    return { preText: answerText, table: null, postText: '' };
  }

  // Find table end: consecutive rows containing '|'
  let rowIdx = sepIdx + 1;
  const rows = [];
  while (rowIdx < lines.length && lines[rowIdx].trim().includes('|')) {
    const cells = splitTableRow(lines[rowIdx]);
    // Only add row if it contains at least one non-empty cell
    if (cells.some((c) => c.length > 0)) {
      // Pad cells if row has fewer columns than header, or slice if more
      while (cells.length < headerCells.length) {
        cells.push('');
      }
      rows.push(cells.slice(0, headerCells.length));
    }
    rowIdx++;
  }

  const preLines = lines.slice(0, headerIdx).join('\n').trim();
  const postLines = lines.slice(rowIdx).join('\n').trim();

  return {
    preText: preLines,
    table: {
      headers: headerCells,
      rows: rows,
    },
    postText: postLines,
  };
}

// Dedicated Answer Component with Inline Edit & Save, Comparison Table & Spoken Response
function AnswerSection({
  phaseId,
  question,
  currentAnswer: passedCurrent,
  originalAnswer: passedOriginal,
  customAnswer,
  isDifferenceQuestion,
  onSave,
  onReset,
}) {
  const originalAnswer = passedOriginal || question.answer;
  const currentAnswer = passedCurrent !== undefined ? passedCurrent : (customAnswer !== undefined ? customAnswer : originalAnswer);
  const isCustomized = currentAnswer !== originalAnswer;

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(currentAnswer);
  const [saveStatus, setSaveStatus] = useState(null); // null | 'saving' | 'saved'

  // Sync editText if currentAnswer changes from outside and not currently editing
  useEffect(() => {
    if (!isEditing) {
      setEditText(currentAnswer);
    }
  }, [currentAnswer, isEditing]);

  const handleStartEdit = (e) => {
    e?.stopPropagation?.();
    setEditText(currentAnswer);
    setIsEditing(true);
    setSaveStatus(null);
  };

  const handleCancel = (e) => {
    e?.stopPropagation?.();
    setEditText(currentAnswer);
    setIsEditing(false);
    setSaveStatus(null);
  };

  const handleSave = async (e) => {
    e?.stopPropagation?.();
    setSaveStatus('saving');
    await onSave(phaseId, question.id, editText);
    setSaveStatus('saved');
    setTimeout(() => {
      setIsEditing(false);
      setSaveStatus(null);
    }, 500);
  };

  const handleReset = async (e) => {
    e?.stopPropagation?.();
    if (window.confirm("Revert this answer back to the original default answer?")) {
      setSaveStatus('saving');
      await onReset(phaseId, question.id, originalAnswer);
      setEditText(originalAnswer);
      setIsEditing(false);
      setSaveStatus(null);
    }
  };

  const parsed = useMemo(() => parseAnswerWithTable(currentAnswer), [currentAnswer]);

  return (
    <div
      className={`rounded-2xl border transition-all p-4 sm:p-5 shadow-2xs ${
        isEditing
          ? 'bg-amber-50/50 border-amber-300 ring-2 ring-amber-400/30'
          : isCustomized
          ? 'bg-emerald-50/90 border-emerald-300'
          : 'bg-emerald-50/70 border-emerald-200/90'
      }`}
    >
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-emerald-200/60">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              isEditing ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
            }`}
          ></span>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
            {isEditing ? 'Edit Spoken Answer' : 'How to Speak in the Interview:'}
          </span>
          {isCustomized && !isEditing && (
            <span className="text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300/80 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
              <span>✏️</span> Customized
            </span>
          )}
          {parsed.table && !isEditing && (
            <span className="text-[10px] font-bold tracking-normal bg-emerald-100 text-emerald-800 border border-emerald-300/80 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span>⇄</span> Comparison Table
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <>
              {isCustomized && (
                <button
                  type="button"
                  onClick={handleReset}
                  title="Revert back to original answer across the site"
                  className="text-[11px] font-medium text-stone-600 hover:text-stone-900 bg-white/80 hover:bg-white px-2.5 py-1 rounded-lg border border-stone-200 transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  <svg className="w-3 h-3 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                  <span>Reset to Original</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleStartEdit}
                className="text-xs font-semibold text-emerald-900 hover:text-emerald-950 bg-emerald-100/90 hover:bg-emerald-200/90 px-3 py-1 rounded-lg border border-emerald-300 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs hover:scale-[1.02] active:scale-[0.98]"
              >
                <svg className="w-3.5 h-3.5 text-emerald-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Edit Answer</span>
              </button>
            </>
          ) : (
            <span className="text-[11px] text-stone-500 italic">
              Markdown tables &amp; `code` supported &bull; syncs to whole site
            </span>
          )}
        </div>
      </div>

      {/* Editing State vs Formatted Display */}
      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            rows={8}
            placeholder="Type your manipulated or customized answer here... You can use `backticks` for code or Markdown table syntax (| Col 1 | Col 2 |)."
            className="w-full p-3.5 text-xs sm:text-sm font-sans leading-relaxed text-stone-900 bg-white rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-inner resize-y transition-all"
            autoFocus
          />

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={saveStatus === 'saving'}
                className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] px-4 py-2 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-60"
              >
                {saveStatus === 'saving' ? (
                  <span>Saving...</span>
                ) : saveStatus === 'saved' ? (
                  <>
                    <svg className="w-4 h-4 text-emerald-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    <span>Save Answer</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                disabled={saveStatus === 'saving'}
                className="text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 active:scale-[0.98] px-3.5 py-2 rounded-xl transition-all cursor-pointer border border-stone-200"
              >
                Cancel
              </button>
            </div>

            {isCustomized && (
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-rose-700 hover:text-rose-800 hover:underline cursor-pointer flex items-center gap-1"
              >
                Revert to Original
              </button>
            )}
          </div>
        </div>
      ) : (
        <div>
          {/* Pre-table Spoken Response */}
          {parsed.preText && (
            <div className="text-stone-900 text-sm sm:text-base leading-relaxed space-y-3">
              {(parsed.preText.startsWith('"') && parsed.preText.endsWith('"')
                ? parsed.preText.slice(1, -1)
                : parsed.preText
              ).split('\n\n').map((paragraph, pIdx) => (
                <p key={pIdx} className="whitespace-pre-line leading-relaxed">
                  {renderFormattedInline(paragraph)}
                </p>
              ))}
            </div>
          )}

          {/* Structured Comparison Table */}
          {parsed.table && (
            <div className="mt-3.5 space-y-2">
              <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 mb-1">
                <span className="w-5 h-5 rounded-md bg-emerald-100/90 text-emerald-800 flex items-center justify-center text-[11px] font-bold">
                  ⇄
                </span>
                <span>Comparison Table:</span>
              </div>
              <div className="overflow-x-auto rounded-xl border border-emerald-200/90 bg-white shadow-xs">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-emerald-100/90 border-b border-emerald-200 text-emerald-950">
                      {parsed.table.headers.map((header, idx) => (
                        <th
                          key={idx}
                          className="py-2.5 px-3.5 font-bold tracking-tight border-r border-emerald-200/60 last:border-r-0 whitespace-nowrap"
                        >
                          {renderFormattedInline(header)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-100/70">
                    {parsed.table.rows.map((row, rIdx) => (
                      <tr
                        key={rIdx}
                        className="hover:bg-emerald-50/60 transition-colors even:bg-emerald-50/20"
                      >
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            className={`py-2.5 px-3.5 leading-relaxed text-stone-800 border-r border-emerald-100/60 last:border-r-0 ${
                              cIdx === 0 ? 'font-semibold text-emerald-950' : ''
                            }`}
                          >
                            {renderFormattedInline(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Post-table Notes / Details */}
          {parsed.postText && (
            <div className="mt-3.5 bg-emerald-50/90 border-l-4 border-emerald-500 px-3.5 py-2.5 rounded-r-xl text-xs sm:text-sm text-stone-900 leading-relaxed space-y-2">
              {parsed.postText.split('\n\n').map((paragraph, pIdx) => (
                <p key={pIdx} className="whitespace-pre-line leading-relaxed">
                  {renderFormattedInline(paragraph)}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Modal Dialog to Add a Question to a Topic
function AddQuestionModal({
  isOpen,
  onClose,
  phases,
  currentPhaseId,
  currentTopicId,
  onAdd,
}) {
  const [phaseId, setPhaseId] = useState(currentPhaseId);
  const [topicId, setTopicId] = useState(currentTopicId === 'all' ? 1 : currentTopicId);
  const [level, setLevel] = useState('SDE-1');
  const [title, setTitle] = useState('');
  const [answer, setAnswer] = useState('');
  const [keyConcepts, setKeyConcepts] = useState('');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPhaseId(currentPhaseId);
      const chosenPhase = phases.find((p) => p.id === currentPhaseId);
      const phaseTopics = chosenPhase?.data?.topics || [];
      if (currentTopicId !== 'all' && phaseTopics.some((t) => t.id === currentTopicId)) {
        setTopicId(currentTopicId);
      } else if (phaseTopics.length > 0) {
        setTopicId(phaseTopics[0].id);
      }
      setLevel('SDE-1');
      setTitle('');
      setAnswer('');
      setKeyConcepts('');
      setCode('');
      setOutput('');
      setError('');
    }
  }, [isOpen, currentPhaseId, currentTopicId, phases]);

  if (!isOpen) return null;

  const currentPhaseObj = phases.find((p) => p.id === Number(phaseId));
  const availableTopics = currentPhaseObj?.data?.topics || [];

  const handlePhaseChange = (newPId) => {
    const idNum = Number(newPId);
    setPhaseId(idNum);
    const pObj = phases.find((p) => p.id === idNum);
    if (pObj?.data?.topics?.length > 0) {
      setTopicId(pObj.data.topics[0].id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a Question Title.');
      return;
    }
    if (!answer.trim()) {
      setError('Please provide an Answer.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await onAdd({
        phaseId: Number(phaseId),
        topicId: Number(topicId),
        level,
        title: title.trim(),
        answer: answer.trim(),
        keyConcepts: keyConcepts.trim(),
        code: code.trim(),
        output: output.trim(),
      });
      onClose();
    } catch (err) {
      setError('Failed to save question. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-amber-50/60">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-lg shadow-xs">
              +
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 leading-none">
                Add Question to Topic
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Expand the mock interview question bank with your custom question
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 flex items-center justify-center text-lg font-semibold transition-colors cursor-pointer"
          >
            ×
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 text-xs rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-semibold">
              ⚠️ {error}
            </div>
          )}

          {/* Phase & Topic Selector Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Target Phase
              </label>
              <select
                value={phaseId}
                onChange={(e) => handlePhaseChange(e.target.value)}
                className="w-full text-xs sm:text-sm font-medium bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 cursor-pointer"
              >
                {phases.map((p) => (
                  <option key={p.id} value={p.id}>
                    Phase {p.id}: {p.title.includes(': ') ? p.title.split(': ')[1] : p.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Target Topic
              </label>
              <select
                value={topicId}
                onChange={(e) => setTopicId(Number(e.target.value))}
                className="w-full text-xs sm:text-sm font-medium bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 cursor-pointer"
              >
                {availableTopics.map((t) => (
                  <option key={t.id} value={t.id}>
                    Topic {t.id}: {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Difficulty Level Pills */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Difficulty / Level
            </label>
            <div className="flex items-center gap-2">
              {['Fresher', 'SDE-1', 'SDE-2'].map((lvl) => {
                const active = level === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setLevel(lvl)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      active
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
                    }`}
                  >
                    {lvl}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Title */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Question Title <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. What is memory fragmentation in Python and how does pymalloc minimize it?"
              className="w-full text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl p-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 font-medium"
              required
            />
          </div>

          {/* Answer */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                Interview-Ready Answer <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-stone-400">
                Markdown &amp; tables supported
              </span>
            </div>
            <textarea
              rows={5}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Explain clearly with core concepts, bullet points, or comparison tables..."
              className="w-full text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl p-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 leading-relaxed font-mono"
              required
            />
          </div>

          {/* Key Concepts */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Key Concepts / Keywords <span className="text-stone-400 text-[10px] font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={keyConcepts}
              onChange={(e) => setKeyConcepts(e.target.value)}
              placeholder="e.g. pymalloc, Arenas, Pools, RSS, glibc"
              className="w-full text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
            />
          </div>

          {/* Code Example & Output Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Code Snippet <span className="text-stone-400 text-[10px] font-normal">(optional)</span>
              </label>
              <textarea
                rows={3}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="import sys&#10;x = [1, 2, 3]&#10;print(sys.getsizeof(x))"
                className="w-full text-xs bg-stone-900 text-stone-100 font-mono rounded-xl p-3 placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Expected Output <span className="text-stone-400 text-[10px] font-normal">(optional)</span>
              </label>
              <textarea
                rows={3}
                value={output}
                onChange={(e) => setOutput(e.target.value)}
                placeholder="88"
                className="w-full text-xs bg-stone-900 text-emerald-400 font-mono rounded-xl p-3 placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              <span>{saving ? 'Saving...' : 'Add Question'}</span>
              <span>→</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

export default function App() {
  // Navigation views: 'home' | 'phases' | 'questions'
  const [view, setView] = useState('home');
  const [selectedPhaseId, setSelectedPhaseId] = useState(1);
  const [selectedTopicId, setSelectedTopicId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Set of opened question IDs for dropdown accordion
  const [openQuestionIds, setOpenQuestionIds] = useState(new Set([1]));

  // Server-synced questions by phase: { [phaseId]: Array<Question> } (Shared live across all devices)
  const [serverQuestionsByPhase, setServerQuestionsByPhase] = useState({});
  const [isSyncing, setIsSyncing] = useState(false);

  // Custom manipulated answers backup in localStorage: { [`${phaseId}_${questionId}`]: string }
  const [customAnswers, setCustomAnswers] = useState(() => {
    try {
      const saved = localStorage.getItem('mockprep_custom_answers');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.warn('Failed to parse custom answers from localStorage:', e);
      return {};
    }
  });

  // Custom newly added questions per phase: { [phaseId]: Array<Question> }
  const [addedQuestionsByPhase, setAddedQuestionsByPhase] = useState(() => {
    try {
      const saved = localStorage.getItem('mockprep_added_questions');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.warn('Failed to parse added questions from localStorage:', e);
      return {};
    }
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Fetch live questions for a phase from MongoDB backend so all devices stay in sync
  const fetchPhaseQuestions = async (phaseId) => {
    try {
      setIsSyncing(true);
      const res = await fetch(`${API_BASE}/api/questions?phase=${phaseId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.questions && Array.isArray(data.questions)) {
          setServerQuestionsByPhase((prev) => ({
            ...prev,
            [phaseId]: data.questions,
          }));
        }
      }
    } catch (err) {
      console.info('Server backend offline, using bundled data.', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Fetch phase questions whenever selectedPhaseId changes
  useEffect(() => {
    fetchPhaseQuestions(selectedPhaseId);
  }, [selectedPhaseId]);

  // Auto-sync when window is refocused (e.g., when a friend edits on another laptop)
  useEffect(() => {
    const handleFocus = () => {
      fetchPhaseQuestions(selectedPhaseId);
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [selectedPhaseId]);

  const handleSaveAnswer = async (phaseId, questionId, newAnswer) => {
    // 1. Immediately update in-memory state so user sees change with zero lag
    setServerQuestionsByPhase((prev) => {
      const existingList = prev[phaseId] || (allPhases.find((p) => p.id === phaseId)?.data?.questions || []);
      return {
        ...prev,
        [phaseId]: existingList.map((q) => (q.id === questionId ? { ...q, answer: newAnswer } : q)),
      };
    });

    setCustomAnswers((prev) => {
      const next = { ...prev, [`${phaseId}_${questionId}`]: newAnswer };
      try {
        localStorage.setItem('mockprep_custom_answers', JSON.stringify(next));
      } catch (e) {
        console.warn('Failed to save to localStorage:', e);
      }
      return next;
    });

    // 2. Persist to shared MongoDB database so whole site updates for all devices
    try {
      const res = await fetch(`${API_BASE}/api/questions/${phaseId}/${questionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer: newAnswer }),
      });
      if (res.ok) {
        showToast('Answer updated across the whole site!');
      } else {
        showToast('Saved locally; server sync failed.');
      }
    } catch (err) {
      console.info('Server backend offline, answer saved locally.', err);
      showToast('Saved locally (offline mode).');
    }
  };

  const handleResetAnswer = async (phaseId, questionId, originalAnswer) => {
    setServerQuestionsByPhase((prev) => {
      const existingList = prev[phaseId] || (allPhases.find((p) => p.id === phaseId)?.data?.questions || []);
      return {
        ...prev,
        [phaseId]: existingList.map((q) => (q.id === questionId ? { ...q, answer: originalAnswer } : q)),
      };
    });

    setCustomAnswers((prev) => {
      const next = { ...prev };
      delete next[`${phaseId}_${questionId}`];
      try {
        localStorage.setItem('mockprep_custom_answers', JSON.stringify(next));
      } catch (e) {
        console.warn('Failed to save to localStorage:', e);
      }
      return next;
    });

    try {
      const res = await fetch(`${API_BASE}/api/questions/${phaseId}/${questionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer: originalAnswer }),
      });
      if (res.ok) {
        showToast('Answer reset to original across the site!');
      }
    } catch (err) {
      console.info('Server backend offline, answer reset locally.', err);
    }
  };

  // Current active phase
  const currentPhase = useMemo(() => {
    return allPhases.find((p) => p.id === selectedPhaseId) || allPhases[0];
  }, [selectedPhaseId]);

  // Lookup of factory/bundled original answers for this phase
  const bundledOriginalAnswerMap = useMemo(() => {
    const bundled = currentPhase.data ? currentPhase.data.questions : [];
    return new Map(bundled.map((q) => [q.id, q.answer]));
  }, [currentPhase]);

  // Combined questions for current phase:
  // 1. Live database questions (synced across all devices)
  // 2. Bundled fallback questions (if offline)
  // 3. Locally added questions
  const allPhaseQuestions = useMemo(() => {
    const serverList = serverQuestionsByPhase[selectedPhaseId];
    const base = (serverList && serverList.length > 0)
      ? serverList
      : (currentPhase.data ? currentPhase.data.questions : []);

    const added = addedQuestionsByPhase[selectedPhaseId] || [];
    const baseIds = new Set(base.map((q) => q.id));
    const uniqueAdded = added.filter((q) => !baseIds.has(q.id));
    return [...base, ...uniqueAdded];
  }, [currentPhase, serverQuestionsByPhase, addedQuestionsByPhase, selectedPhaseId]);

  // Topics with dynamic question counts reflecting added questions
  const topics = useMemo(() => {
    if (!currentPhase.data) return [];
    const baseTopics = currentPhase.data.topics || [];
    return baseTopics.map((t) => {
      const count = allPhaseQuestions.filter((q) => q.topicId === t.id).length;
      return { ...t, count };
    });
  }, [currentPhase, allPhaseQuestions]);

  // Questions filtered by topic and search
  const filteredQuestions = useMemo(() => {
    let list = allPhaseQuestions;
    if (selectedTopicId !== 'all') {
      list = list.filter((q) => q.topicId === selectedTopicId);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((item) => {
        const effectiveAnswer = customAnswers[`${selectedPhaseId}_${item.id}`] ?? item.answer;
        return (
          item.title.toLowerCase().includes(q) ||
          effectiveAnswer.toLowerCase().includes(q) ||
          (item.keyConcepts && item.keyConcepts.toLowerCase().includes(q))
        );
      });
    }
    return list;
  }, [allPhaseQuestions, selectedTopicId, searchQuery, customAnswers, selectedPhaseId]);

  // Handler to add a new question to a topic
  const handleAddQuestion = async (formData) => {
    const { phaseId, topicId, level, title, answer, keyConcepts, code, output } = formData;
    const targetPhase = allPhases.find((p) => p.id === phaseId);
    const existing = (targetPhase?.data?.questions || []).concat(addedQuestionsByPhase[phaseId] || []);
    const nextId = existing.reduce((max, q) => (q.id > max ? q.id : max), 0) + 1;
    const targetTopic = (targetPhase?.data?.topics || []).find((t) => t.id === topicId);

    const newQuestion = {
      id: nextId,
      title,
      level,
      topicId,
      topicName: targetTopic ? targetTopic.name : `Topic ${topicId}`,
      answer,
      keyConcepts,
      code,
      output,
    };

    // 1. Update React state and local storage immediately
    setAddedQuestionsByPhase((prev) => {
      const list = prev[phaseId] || [];
      const next = { ...prev, [phaseId]: [...list, newQuestion] };
      try {
        localStorage.setItem('mockprep_added_questions', JSON.stringify(next));
      } catch (e) {
        console.warn('Failed to save to localStorage:', e);
      }
      return next;
    });

    // 2. Select phase and topic, and open the new question accordion
    setSelectedPhaseId(phaseId);
    setSelectedTopicId(topicId);
    setOpenQuestionIds((prev) => new Set(prev).add(nextId));

    // 3. Post to backend & MongoDB so it's saved across the whole site
    try {
      const res = await fetch(`${API_BASE}/api/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phaseId, topicId, title, level, answer, keyConcepts, code, output }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.question) {
          setServerQuestionsByPhase((prev) => {
            const list = prev[phaseId] || (allPhases.find((p) => p.id === phaseId)?.data?.questions || []);
            if (!list.some((item) => item.id === data.question.id)) {
              return { ...prev, [phaseId]: [...list, data.question] };
            }
            return prev;
          });
        }
      }
    } catch (err) {
      console.info('Server backend offline, question saved safely in browser storage.', err);
    }

    showToast(`Question successfully added to ${targetTopic ? targetTopic.name : 'Topic'}!`);
  };

  // Directly go to questions of the chosen Phase
  const handleSelectPhase = (phaseId) => {
    setSelectedPhaseId(phaseId);
    setSelectedTopicId('all');
    setOpenQuestionIds(new Set([1]));
    setSearchQuery('');
    setView('questions');
  };

  // Toggle question dropdown open/close
  const toggleQuestion = (id) => {
    setOpenQuestionIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    const allIds = new Set(filteredQuestions.map((q) => q.id));
    setOpenQuestionIds(allIds);
  };

  const handleCollapseAll = () => {
    setOpenQuestionIds(new Set());
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] text-stone-800 flex flex-col selection:bg-amber-200">
      
      {/* ============================================================== */}
      {/* 1. STEP 1: HOME SCREEN                                         */}
      {/* ============================================================== */}
      {view === 'home' && (
        <div className="flex-1 flex flex-col justify-between">
          <header className="border-b border-amber-200/60 bg-white/70 py-4 px-6">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img src="/interview.png" alt="Python Mock Interview Logo" className="w-8 h-8 rounded-lg object-contain shadow-xs" />
                <span className="font-bold text-lg text-stone-900 tracking-tight">
                  Mock<span className="text-amber-700">Prep</span>
                </span>
              </div>
              <span className="text-xs font-semibold text-amber-800 bg-amber-100/70 px-3 py-1 rounded-full border border-amber-200">
                Phases 1–8 &bull; 1,839 Questions
              </span>
            </div>
          </header>

          <main className="flex-1 flex items-center justify-center p-6">
            <div className="w-full max-w-lg text-center bg-white border border-amber-200/80 rounded-3xl p-10 sm:p-12 shadow-sm">
              <img src="/interview.png" alt="Python Mock Interview Logo" className="w-20 h-20 mx-auto mb-4 object-contain rounded-2xl drop-shadow-sm border border-amber-100 p-1 bg-amber-50/40" />
              <div className="inline-block text-xs uppercase font-bold tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-3.5 py-1 rounded-lg mb-4">
                Technical Interview Prep
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-4 tracking-tight">
                Python Mock Interview
              </h1>

              <p className="text-stone-600 text-sm sm:text-base mb-8 max-w-md mx-auto leading-relaxed">
                Master 1,839 real SDE mock interview questions across Fundamentals, Collections, Functions, OOP, Exceptions, File Handling, Advanced Python &amp; Memory Internals.
              </p>

              <button
                onClick={() => setView('phases')}
                className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 active:scale-[0.99] text-white font-semibold text-lg px-9 py-4 rounded-xl shadow-md shadow-amber-600/20 transition-all cursor-pointer"
              >
                Python Mock Interview →
              </button>
            </div>
          </main>

          <footer className="py-4 text-center text-xs text-stone-400">
            Python Mock Interview Prep
          </footer>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. STEP 2: PHASES SCREEN (Buttons for Phase 1, 2 & 3)          */}
      {/* ============================================================== */}
      {view === 'phases' && (
        <div className="flex-1 flex flex-col justify-between">
          <header className="bg-white/80 border-b border-amber-200/70 sticky top-0 z-20 backdrop-blur-md">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
              <button
                onClick={() => setView('home')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200 transition-colors cursor-pointer"
              >
                ← Home
              </button>

              <div className="flex items-center gap-2">
                <img src="/interview.png" alt="Python Mock Interview Logo" className="w-6 h-6 rounded-md object-contain" />
                <h2 className="text-base font-bold text-stone-900">
                  Select Interview Phase
                </h2>
              </div>

              <span className="text-xs text-amber-800 bg-amber-100/70 px-2.5 py-1 rounded-full font-medium">
                8 Phases Ready
              </span>
            </div>
          </header>

          <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            <div className="w-full text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100/70 border border-amber-200/80 px-3 py-1 rounded-full mb-2">
                <span>⚡</span>
                <span>Select Interview Phase</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                Choose a Phase to Practice
              </h2>
              <p className="text-stone-500 text-xs sm:text-sm mt-1.5 max-w-lg mx-auto">
                Comprehensive 1,839 questions with spoken responses, comparison tables, code examples &amp; custom edits.
              </p>
            </div>

            {/* Proper Grid Display of Phases (Max 5 cards per row, then stack below) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 w-full">
              {allPhases.map((p) => {
                const phaseStyles = {
                  1: {
                    accentBorder: 'border-t-amber-500',
                    borderHover: 'hover:border-amber-400',
                    badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
                    btnBg: 'bg-amber-600 hover:bg-amber-700 text-white',
                    iconBg: 'bg-amber-500',
                    highlight: 'from-amber-500/10 to-transparent',
                  },
                  2: {
                    accentBorder: 'border-t-emerald-600',
                    borderHover: 'hover:border-emerald-400',
                    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                    btnBg: 'bg-emerald-700 hover:bg-emerald-800 text-white',
                    iconBg: 'bg-emerald-600',
                    highlight: 'from-emerald-500/10 to-transparent',
                  },
                  3: {
                    accentBorder: 'border-t-orange-500',
                    borderHover: 'hover:border-orange-400',
                    badgeBg: 'bg-orange-100 text-orange-800 border-orange-200',
                    btnBg: 'bg-orange-600 hover:bg-orange-700 text-white',
                    iconBg: 'bg-orange-500',
                    highlight: 'from-orange-500/10 to-transparent',
                  },
                  4: {
                    accentBorder: 'border-t-indigo-600',
                    borderHover: 'hover:border-indigo-400',
                    badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
                    btnBg: 'bg-indigo-700 hover:bg-indigo-800 text-white',
                    iconBg: 'bg-indigo-600',
                    highlight: 'from-indigo-500/10 to-transparent',
                  },
                  5: {
                    accentBorder: 'border-t-rose-600',
                    borderHover: 'hover:border-rose-400',
                    badgeBg: 'bg-rose-100 text-rose-800 border-rose-200',
                    btnBg: 'bg-rose-700 hover:bg-rose-800 text-white',
                    iconBg: 'bg-rose-600',
                    highlight: 'from-rose-500/10 to-transparent',
                  },
                  6: {
                    accentBorder: 'border-t-teal-600',
                    borderHover: 'hover:border-teal-400',
                    badgeBg: 'bg-teal-100 text-teal-800 border-teal-200',
                    btnBg: 'bg-teal-700 hover:bg-teal-800 text-white',
                    iconBg: 'bg-teal-600',
                    highlight: 'from-teal-500/10 to-transparent',
                  },
                  7: {
                    accentBorder: 'border-t-purple-600',
                    borderHover: 'hover:border-purple-400',
                    badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
                    btnBg: 'bg-purple-700 hover:bg-purple-800 text-white',
                    iconBg: 'bg-purple-600',
                    highlight: 'from-purple-500/10 to-transparent',
                  },
                  8: {
                    accentBorder: 'border-t-cyan-600',
                    borderHover: 'hover:border-cyan-400',
                    badgeBg: 'bg-cyan-100 text-cyan-800 border-cyan-200',
                    btnBg: 'bg-cyan-700 hover:bg-cyan-800 text-white',
                    iconBg: 'bg-cyan-600',
                    highlight: 'from-cyan-500/10 to-transparent',
                  },
                };
                const s = phaseStyles[p.id] || phaseStyles[1];
                const phaseName = p.title.includes(': ') ? p.title.split(': ')[1] : p.title;

                return (
                  <div
                    key={p.id}
                    onClick={() => handleSelectPhase(p.id)}
                    className={`group bg-white rounded-2xl border border-stone-200/90 ${s.borderHover} border-t-4 ${s.accentBorder} p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer hover:-translate-y-1 relative overflow-hidden`}
                  >
                    <div className={`absolute top-0 inset-x-0 h-16 bg-gradient-to-b ${s.highlight} pointer-events-none opacity-60`} />

                    <div>
                      {/* Top Header Tag Row */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${s.badgeBg}`}>
                          Phase {p.id}
                        </span>
                        <span className="text-[11px] font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-full">
                          {p.questionCount} Qs
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold text-stone-900 group-hover:text-amber-900 transition-colors leading-snug line-clamp-2 mb-1.5">
                        {phaseName}
                      </h3>

                      {/* Topic Count */}
                      <div className="text-[11px] font-semibold text-amber-800/90 mb-2">
                        {p.topicCount} Topics Included
                      </div>

                      {/* Description Summary */}
                      <p className="text-xs text-stone-500 leading-relaxed line-clamp-3">
                        {p.description}
                      </p>
                    </div>

                    {/* Bottom CTA Button */}
                    <div className="mt-4 pt-3 border-t border-stone-100">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectPhase(p.id);
                        }}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs group-hover:shadow-xs cursor-pointer ${s.btnBg}`}
                      >
                        <span>Start Practice</span>
                        <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-stone-400 mt-6 sm:mt-8 text-center">
              Click any phase card to jump straight into its questions with instant dropdown answers
            </p>
          </main>

          <footer className="py-4 text-center text-xs text-stone-400">
            Python Mock Interview Prep
          </footer>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. STEP 3: QUESTIONS LIST WITH INLINE DROPDOWN ANSWERS         */}
      {/* ============================================================== */}
      {view === 'questions' && (
        <div className="flex-1 flex flex-col">
          <header className="bg-white/80 border-b border-amber-200/70 sticky top-0 z-20 backdrop-blur-md">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setView('home')}
                  className="inline-flex items-center gap-1.5 p-1 rounded-lg hover:bg-amber-100/60 transition-colors cursor-pointer"
                  title="Back to Home"
                >
                  <img src="/interview.png" alt="Python Mock Interview Logo" className="w-6 h-6 rounded-md object-contain" />
                </button>

                <button
                  onClick={() => setView('phases')}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200 transition-colors cursor-pointer"
                >
                  ← Phases
                </button>

                {/* Small Horizontal Phase Buttons */}
                <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                  {allPhases.map((p) => {
                    const isActive = p.id === selectedPhaseId;
                    return (
                      <button
                        key={p.id}
                        onClick={() => handleSelectPhase(p.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                          isActive
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-white hover:bg-amber-50 text-stone-700 border border-amber-200 hover:border-amber-300'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : 'bg-amber-500'}`}></span>
                        <span>{p.shortTitle}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-amber-700 text-amber-100' : 'bg-stone-100 text-stone-500'}`}>
                          {p.questionCount}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Search & Cloud Sync */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Search questions or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3.5 py-1.5 text-xs sm:text-sm rounded-xl border border-amber-200 bg-amber-50/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-stone-800 placeholder-stone-400"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => fetchPhaseQuestions(selectedPhaseId)}
                  disabled={isSyncing}
                  title="Sync with cloud database (pulls edits from other devices)"
                  className="p-2 rounded-xl border border-amber-200 bg-white hover:bg-amber-50 text-stone-600 hover:text-stone-900 transition-all cursor-pointer shrink-0 shadow-2xs flex items-center justify-center"
                >
                  <svg className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-amber-600' : 'text-stone-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>
          </header>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left Sidebar: Topics */}
            <aside className="md:col-span-4 lg:col-span-3">
              <div className="bg-white border border-amber-200/80 rounded-2xl p-3 shadow-xs sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
                <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span>Topics</span>
                    <span className="text-[11px] text-stone-500 font-normal">({topics.length})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 hover:text-amber-950 bg-amber-100/80 hover:bg-amber-200 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                    title="Add Question to a Topic"
                  >
                    <span>+</span>
                    <span>Add</span>
                  </button>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedTopicId('all')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-between cursor-pointer ${
                      selectedTopicId === 'all'
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'text-stone-700 hover:bg-amber-50'
                    }`}
                  >
                    <span>All Topics</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      selectedTopicId === 'all' ? 'bg-amber-700 text-amber-100' : 'bg-amber-100/70 text-amber-800'
                    }`}>
                      {allPhaseQuestions.length}
                    </span>
                  </button>

                  {topics.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTopicId(t.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-between cursor-pointer ${
                        selectedTopicId === t.id
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'text-stone-700 hover:bg-amber-50'
                      }`}
                    >
                      <span className="truncate">{t.id}. {t.name}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                        selectedTopicId === t.id ? 'bg-amber-700 text-amber-100' : 'bg-amber-100/70 text-amber-800'
                      }`}>
                        {t.count}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Quick phase switcher in sidebar */}
                <div className="pt-3 mt-3 border-t border-amber-100">
                  <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1.5 px-1">
                    Quick Phase Switch:
                  </div>
                  <div className="grid grid-cols-8 gap-1">
                    {allPhases.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleSelectPhase(p.id)}
                        title={p.title}
                        className={`py-1 text-center text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                          selectedPhaseId === p.id
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
                        }`}
                      >
                        P{p.id}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Right Main Area: Questions List with Dropdown Answers */}
            <main className="md:col-span-8 lg:col-span-9 space-y-4">
              
              {/* Top controls: Topic Title + Expand/Collapse Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-1">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-stone-900">
                    {selectedTopicId === 'all'
                      ? `All ${currentPhase.title} Questions`
                      : `${topics.find((t) => t.id === selectedTopicId)?.name}`}
                  </h2>
                  <p className="text-xs text-stone-500">
                    Click any question to toggle its answer dropdown
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleExpandAll}
                    className="text-xs font-semibold text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100/80 px-2.5 py-1 rounded-lg border border-amber-200 transition-colors cursor-pointer"
                  >
                    Expand All
                  </button>
                  <button
                    onClick={handleCollapseAll}
                    className="text-xs font-semibold text-stone-600 hover:text-stone-800 bg-white hover:bg-stone-50 px-2.5 py-1 rounded-lg border border-stone-200 transition-colors cursor-pointer"
                  >
                    Collapse All
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 px-3 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    <span>+</span>
                    <span>Add Question</span>
                  </button>
                  <span className="text-xs font-medium text-stone-400 ml-1">
                    ({filteredQuestions.length} Qs)
                  </span>
                </div>
              </div>

              {filteredQuestions.length === 0 ? (
                <div className="bg-white border border-amber-200/80 rounded-2xl p-10 text-center text-stone-500 text-sm">
                  <p className="mb-3 text-stone-600">No questions found matching your filter or search.</p>
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <span>+</span>
                    <span>Add First Question to this Topic</span>
                  </button>
                </div>
              ) : (
                /* ACCORDION DROPDOWN QUESTIONS LIST */
                <div className="space-y-3">
                  {filteredQuestions.map((q) => {
                    const isOpen = openQuestionIds.has(q.id);
                    const bundledAns = bundledOriginalAnswerMap.get(q.id) ?? q.answer;
                    const customAns = customAnswers[`${selectedPhaseId}_${q.id}`];
                    const currentAns = customAns !== undefined ? customAns : q.answer;
                    const isCustomized = currentAns !== bundledAns;
                    return (
                      <div
                        key={q.id}
                        className={`bg-white border transition-all rounded-2xl overflow-hidden shadow-2xs ${
                          isOpen ? 'border-amber-400 ring-1 ring-amber-300/50' : 'border-amber-200/80 hover:border-amber-300'
                        }`}
                      >
                        {/* Question Header (Click to toggle dropdown) */}
                        <button
                          onClick={() => toggleQuestion(q.id)}
                          className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-amber-50/30 transition-colors"
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            <span className="inline-block mt-0.5 text-xs font-bold text-amber-800 bg-amber-100/80 border border-amber-200 px-2 py-0.5 rounded-md shrink-0">
                              Q{q.id}
                            </span>
                            <div className="min-w-0">
                              <h3 className="text-base sm:text-lg font-bold text-stone-900 leading-snug">
                                {q.title}
                              </h3>
                              <div className="text-xs text-stone-500 mt-1 flex flex-wrap items-center gap-2">
                                <span>{q.topicName}</span>
                                {q.level && (
                                  <span className="text-[10px] font-semibold bg-stone-100 text-stone-700 border border-stone-200 px-1.5 py-0.2 rounded">
                                    {q.level}
                                  </span>
                                )}
                                {isCustomized && (
                                  <span className="text-[10px] font-semibold bg-amber-100 text-amber-900 border border-amber-300/80 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                                    ✏️ Edited
                                  </span>
                                )}
                                {q.title.toLowerCase().includes('difference') && (
                                  <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300/80 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                                    ⇄ Difference
                                  </span>
                                )}
                                {q.code && (
                                  <span className="text-[10px] bg-amber-50 border border-amber-200 text-amber-800 px-1.5 py-0.2 rounded font-mono">
                                    includes code
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Dropdown Chevron Indicator */}
                          <span
                            className={`text-amber-700 text-xs font-bold w-6 h-6 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                              isOpen ? 'rotate-180 bg-amber-200 text-amber-900' : ''
                            }`}
                          >
                            ▼
                          </span>
                        </button>

                        {/* Dropdown Body: Spoken Answer in Green, Key Concepts, Code */}
                        {isOpen && (
                          <div className="p-5 sm:p-6 border-t border-amber-100 bg-[#fffdf9] space-y-4 animate-in fade-in duration-150">
                            
                            {/* Spoken Answer Section with Inline Edit & Save */}
                            <AnswerSection
                              phaseId={selectedPhaseId}
                              question={q}
                              currentAnswer={currentAns}
                              originalAnswer={bundledAns}
                              customAnswer={isCustomized ? currentAns : undefined}
                              isDifferenceQuestion={q.title.toLowerCase().includes('difference')}
                              onSave={handleSaveAnswer}
                              onReset={handleResetAnswer}
                            />

                            {/* Key Concepts / Level */}
                            {q.keyConcepts && (
                              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5">
                                <div className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
                                  Key Concepts / Details:
                                </div>
                                <p className="text-xs sm:text-sm text-stone-700">
                                  {renderFormattedInline(q.keyConcepts)}
                                </p>
                              </div>
                            )}

                            {/* Code Example with Perfect Format */}
                            {q.code && (
                              <div>
                                <div className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                                  Code Example:
                                </div>
                                <CodeBlock code={q.code} output={q.output} />
                              </div>
                            )}

                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

            </main>
          </div>
        </div>
      )}

      {/* Add Question to Topic Modal */}
      <AddQuestionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        phases={allPhases}
        currentPhaseId={selectedPhaseId}
        currentTopicId={selectedTopicId}
        onAdd={handleAddQuestion}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold border border-stone-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="text-emerald-400 font-bold">✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
