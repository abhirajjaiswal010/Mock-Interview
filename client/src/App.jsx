import React, { useState, useMemo, useEffect, useRef } from 'react';
import { allPhases } from './data/interviewData.js';
import { allHrPhases } from './data/hrInterviewData.js';
import { allCorePhases } from './data/coreInterviewData.js';
import { ArrowRight, Users, X, ChevronDown, ChevronUp, Sparkles, Search } from 'lucide-react';

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
// Formats inline markdown: code `code`, bold/highlight **keyword** or __keyword__, italic *text*, strikethrough, and links
function renderFormattedInline(text, theme = 'emerald') {
  if (!text) return null;

  const isCore = theme === 'blue';
  const isHr = theme === 'purple';

  const codeCls = isCore
    ? 'font-mono text-blue-900 bg-blue-100/90 border border-blue-300/70 px-1.5 py-0.5 rounded text-[11px] sm:text-xs font-semibold mx-0.5 inline-block'
    : isHr
    ? 'font-mono text-purple-900 bg-purple-100/90 border border-purple-300/70 px-1.5 py-0.5 rounded text-[11px] sm:text-xs font-semibold mx-0.5 inline-block'
    : 'font-mono text-emerald-900 bg-emerald-100/90 border border-emerald-300/70 px-1.5 py-0.5 rounded text-[11px] sm:text-xs font-semibold mx-0.5 inline-block';

  const boldCls = isCore
    ? 'font-bold text-blue-950'
    : isHr
    ? 'font-bold text-purple-950'
    : 'font-bold text-emerald-900';

  // Splits by inline code (`...`), bold-italic (***...***), bold (**...** or __...__), italic (*...*), strikethrough (~~...~~), and markdown links ([text](url))
  const parts = text.split(/(`[^`]+`|\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|__[^_]+__|\*[^*\n]+\*|~~[^~\n]+~~|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, index) => {
    if (!part) return null;

    // 1. Inline code: `code`
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code key={index} className={codeCls}>
          {part.slice(1, -1)}
        </code>
      );
    }
    // 2. Bold-Italic: ***text***
    if (part.startsWith('***') && part.endsWith('***') && part.length >= 6) {
      return (
        <strong key={index} className={`${boldCls} italic`}>
          {part.slice(3, -3)}
        </strong>
      );
    }
    // 3. Bold & Keyword Highlight: **keyword** or __keyword__
    if (
      ((part.startsWith('**') && part.endsWith('**')) ||
       (part.startsWith('__') && part.endsWith('__'))) &&
      part.length >= 4
    ) {
      return (
        <strong key={index} className={boldCls}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    // 4. Italic: *italic*
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      return (
        <em key={index} className="italic text-stone-900 font-medium">
          {part.slice(1, -1)}
        </em>
      );
    }
    // 5. Strikethrough: ~~text~~
    if (part.startsWith('~~') && part.endsWith('~~') && part.length >= 4) {
      return (
        <del key={index} className="line-through text-stone-500">
          {part.slice(2, -2)}
        </del>
      );
    }
    // 6. Markdown link: [text](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={index}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline font-medium"
        >
          {linkMatch[1]}
        </a>
      );
    }

    return part;
  });
}

// Helper to strip outer quotes commonly wrapped around answer strings
function cleanMarkdownText(raw) {
  if (raw == null) return '';
  let str = String(raw).trim();
  if (
    (str.startsWith('"') && str.endsWith('"') && str.length >= 2) ||
    (str.startsWith("'") && str.endsWith("'") && str.length >= 2)
  ) {
    str = str.slice(1, -1).trim();
  }
  if (str.startsWith('\\"') && str.endsWith('\\"') && str.length >= 4) {
    str = str.slice(2, -2).trim();
  }
  return str;
}

function stripOuterQuotes(str) {
  if (!str) return '';
  let s = str.trim();
  if (
    (s.startsWith('"') && s.endsWith('"') && s.length >= 2) ||
    (s.startsWith("'") && s.endsWith("'") && s.length >= 2)
  ) {
    s = s.slice(1, -1).trim();
  }
  if (s.startsWith('\\"')) s = s.slice(2).trim();
  if (s.endsWith('\\"')) s = s.slice(0, -2).trim();
  if (s.startsWith('"') && !s.slice(1).includes('"')) s = s.slice(1).trim();
  if (s.endsWith('"') && !s.slice(0, -1).includes('"')) s = s.slice(0, -1).trim();
  return s;
}

// Helper to check if a line is a Markdown table separator (|---|---| or :---|:---:)
function isTableSeparatorLine(line) {
  if (!line) return false;
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

// Parses full Markdown into structural blocks: headings, tables, code blocks, lists, quotes, and paragraphs
function parseMarkdownBlocks(rawText) {
  const text = cleanMarkdownText(rawText);
  if (!text) return [];

  const lines = text.split(/\r?\n/);
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) {
      i++;
      continue;
    }

    // 1. Fenced Code Block: ```lang ... ```
    if (trimmed.startsWith('```')) {
      const lang = trimmed.slice(3).trim() || 'python';
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length && lines[i].trim().startsWith('```')) {
        i++; // skip closing ```
      }
      blocks.push({
        type: 'code',
        lang: lang,
        content: codeLines.join('\n'),
      });
      continue;
    }

    // 2. Markdown Table
    if (trimmed.includes('|') && i + 1 < lines.length && isTableSeparatorLine(lines[i + 1])) {
      const headers = splitTableRow(lines[i]);
      i += 2; // skip header and separator
      const rows = [];
      while (i < lines.length && lines[i].trim().includes('|')) {
        const cells = splitTableRow(lines[i]);
        if (cells.some((c) => c.length > 0)) {
          while (cells.length < headers.length) cells.push('');
          rows.push(cells.slice(0, headers.length));
        }
        i++;
      }
      blocks.push({
        type: 'table',
        headers,
        rows,
      });
      continue;
    }

    // 3. Headings: # H1, ## H2, ### H3, #### H4
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      blocks.push({
        type: 'heading',
        level: headingMatch[1].length,
        text: headingMatch[2],
      });
      i++;
      continue;
    }

    // 4. Horizontal Rule: ---, ***, ___
    if (/^(?:---+|\*\*\*+|___+)\s*$/.test(trimmed)) {
      blocks.push({ type: 'hr' });
      i++;
      continue;
    }

    // 5. Blockquote: > quote
    if (trimmed.startsWith('>')) {
      const quoteLines = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        let qLine = lines[i].trim().slice(1);
        if (qLine.startsWith(' ')) qLine = qLine.slice(1);
        quoteLines.push(qLine);
        i++;
      }
      blocks.push({
        type: 'quote',
        text: quoteLines.join('\n'),
      });
      continue;
    }

    // 6. Unordered List: - item, * item, + item, • item
    if (/^[-*+•]\s+(.+)$/.test(trimmed)) {
      const items = [];
      while (i < lines.length) {
        const curTrim = lines[i].trim();
        const itemMatch = curTrim.match(/^[-*+•]\s+(.+)$/);
        if (itemMatch) {
          items.push(itemMatch[1]);
          i++;
        } else if (
          items.length > 0 &&
          curTrim !== '' &&
          !curTrim.startsWith('#') &&
          !curTrim.startsWith('```') &&
          !curTrim.includes('|') &&
          !curTrim.startsWith('>') &&
          !/^\d+[\.\)]\s+/.test(curTrim)
        ) {
          items[items.length - 1] += ' ' + curTrim;
          i++;
        } else {
          break;
        }
      }
      blocks.push({
        type: 'ul',
        items,
      });
      continue;
    }

    // 7. Ordered List: 1. item, 2. item
    if (/^\d+[\.\)]\s+(.+)$/.test(trimmed)) {
      const items = [];
      while (i < lines.length) {
        const curTrim = lines[i].trim();
        const itemMatch = curTrim.match(/^\d+[\.\)]\s+(.+)$/);
        if (itemMatch) {
          items.push(itemMatch[1]);
          i++;
        } else if (
          items.length > 0 &&
          curTrim !== '' &&
          !curTrim.startsWith('#') &&
          !curTrim.startsWith('```') &&
          !curTrim.includes('|') &&
          !curTrim.startsWith('>') &&
          !/^[-*+•]\s+/.test(curTrim)
        ) {
          items[items.length - 1] += ' ' + curTrim;
          i++;
        } else {
          break;
        }
      }
      blocks.push({
        type: 'ol',
        items,
      });
      continue;
    }

    // 8. Regular Paragraph
    const pLines = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].trim().startsWith('```') &&
      !(lines[i].trim().includes('|') && i + 1 < lines.length && isTableSeparatorLine(lines[i + 1])) &&
      !lines[i].trim().match(/^#{1,6}\s+/) &&
      !/^(?:---+|\*\*\*+|___+)\s*$/.test(lines[i].trim()) &&
      !lines[i].trim().startsWith('>') &&
      !/^[-*+•]\s+/.test(lines[i].trim()) &&
      !/^\d+[\.\)]\s+/.test(lines[i].trim())
    ) {
      pLines.push(lines[i]);
      i++;
    }
    blocks.push({
      type: 'paragraph',
      text: stripOuterQuotes(pLines.join('\n')),
    });
  }

  return blocks;
}

// Styled Markdown Table Component
function MarkdownTable({ headers, rows, theme }) {
  const isCore = theme === 'blue';
  const isHr = theme === 'purple';

  return (
    <div className="my-3 space-y-1.5">
      <div className={`overflow-x-auto rounded-xl border bg-white shadow-xs ${
        isCore ? 'border-blue-200/90' : isHr ? 'border-purple-200/90' : 'border-emerald-200/90'
      }`}>
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className={
              isCore
                ? 'bg-blue-100/90 border-b border-blue-200 text-blue-950'
                : isHr
                ? 'bg-purple-100/90 border-b border-purple-200 text-purple-950'
                : 'bg-emerald-100/90 border-b border-emerald-200 text-emerald-950'
            }>
              {headers.map((header, idx) => (
                <th
                  key={idx}
                  className={`py-2.5 px-3.5 font-bold tracking-tight border-r last:border-r-0 whitespace-nowrap ${
                    isCore ? 'border-blue-200/60' : isHr ? 'border-purple-200/60' : 'border-emerald-200/60'
                  }`}
                >
                  {renderFormattedInline(header, theme)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={isCore ? 'divide-y divide-blue-100/70' : isHr ? 'divide-y divide-purple-100/70' : 'divide-y divide-emerald-100/70'}>
            {rows.map((row, rIdx) => (
              <tr
                key={rIdx}
                className={`transition-colors ${
                  isCore
                    ? 'hover:bg-blue-50/60 even:bg-blue-50/20'
                    : isHr
                    ? 'hover:bg-purple-50/60 even:bg-purple-50/20'
                    : 'hover:bg-emerald-50/60 even:bg-emerald-50/20'
                }`}
              >
                {row.map((cell, cIdx) => (
                  <td
                    key={cIdx}
                    className={`py-2.5 px-3.5 leading-relaxed text-stone-800 border-r last:border-r-0 ${
                      isCore ? 'border-blue-100/60' : isHr ? 'border-purple-100/60' : 'border-emerald-100/60'
                    } ${
                      cIdx === 0
                        ? (isCore ? 'font-semibold text-blue-950' : isHr ? 'font-semibold text-purple-950' : 'font-semibold text-emerald-950')
                        : ''
                    }`}
                  >
                    {renderFormattedInline(cell, theme)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Markdown Content Renderer that presents full markdown with headers, tables, code blocks, lists, quotes, and paragraphs
function MarkdownContent({ content, theme = 'emerald', className = '' }) {
  const blocks = useMemo(() => parseMarkdownBlocks(content), [content]);

  if (!blocks || blocks.length === 0) {
    return <span className="text-stone-400 italic text-xs">No answer content provided.</span>;
  }

  const isCore = theme === 'blue';
  const isHr = theme === 'purple';

  const headingCls = isCore ? 'text-blue-900' : isHr ? 'text-purple-900' : 'text-emerald-900';
  const bulletDotCls = isCore ? 'bg-blue-500' : isHr ? 'bg-purple-500' : 'bg-emerald-500';
  const numberBadgeCls = isCore ? 'bg-blue-100 text-blue-900' : isHr ? 'bg-purple-100 text-purple-900' : 'bg-emerald-100 text-emerald-900';
  const quoteCls = isCore
    ? 'border-blue-500 bg-blue-50/60 text-blue-950'
    : isHr
    ? 'border-purple-500 bg-purple-50/60 text-purple-950'
    : 'border-emerald-500 bg-emerald-50/60 text-emerald-950';

  return (
    <div className={`space-y-3 ${className}`}>
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'heading': {
            if (block.level === 1) {
              return (
                <h1 key={idx} className="text-base sm:text-lg font-bold text-stone-900 mt-4 mb-2 pb-1 border-b border-stone-200">
                  {renderFormattedInline(block.text, theme)}
                </h1>
              );
            }
            if (block.level === 2) {
              return (
                <h2 key={idx} className="text-sm sm:text-base font-bold text-stone-900 mt-3.5 mb-1.5">
                  {renderFormattedInline(block.text, theme)}
                </h2>
              );
            }
            if (block.level === 3) {
              return (
                <h3 key={idx} className={`text-xs sm:text-sm font-bold mt-3 mb-1 ${headingCls}`}>
                  {renderFormattedInline(block.text, theme)}
                </h3>
              );
            }
            return (
              <h4 key={idx} className="text-xs font-semibold uppercase tracking-wider text-stone-700 mt-2.5 mb-1">
                {renderFormattedInline(block.text, theme)}
              </h4>
            );
          }
          case 'table': {
            return (
              <MarkdownTable
                key={idx}
                headers={block.headers}
                rows={block.rows}
                theme={theme}
              />
            );
          }
          case 'code': {
            return (
              <div key={idx} className="my-2.5">
                <CodeBlock code={block.content} />
              </div>
            );
          }
          case 'quote': {
            return (
              <blockquote key={idx} className={`border-l-3.5 pl-3.5 py-2 my-2.5 rounded-r-xl text-xs sm:text-sm italic leading-relaxed ${quoteCls}`}>
                {renderFormattedInline(block.text, theme)}
              </blockquote>
            );
          }
          case 'ul': {
            return (
              <ul key={idx} className="space-y-1.5 my-2 pl-1 sm:pl-2">
                {block.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-2.5 text-stone-900 leading-relaxed text-xs sm:text-sm">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-2 ${bulletDotCls}`} />
                    <div className="flex-1 min-w-0">
                      {renderFormattedInline(item, theme)}
                    </div>
                  </li>
                ))}
              </ul>
            );
          }
          case 'ol': {
            return (
              <ol key={idx} className="space-y-1.5 my-2 pl-1 sm:pl-2">
                {block.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-2.5 text-stone-900 leading-relaxed text-xs sm:text-sm">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0 mt-0.5 font-mono ${numberBadgeCls}`}>
                      {itemIdx + 1}.
                    </span>
                    <div className="flex-1 min-w-0">
                      {renderFormattedInline(item, theme)}
                    </div>
                  </li>
                ))}
              </ol>
            );
          }
          case 'hr': {
            return <hr key={idx} className="my-3.5 border-t border-stone-200/90" />;
          }
          case 'paragraph':
          default: {
            return (
              <p key={idx} className="text-stone-900 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-sans">
                {renderFormattedInline(block.text, theme)}
              </p>
            );
          }
        }
      })}
    </div>
  );
}

// Reusable Markdown Editor with formatting toolbar & live preview tab
function MarkdownEditor({
  value,
  onChange,
  placeholder,
  rows = 8,
  theme = 'emerald',
  autoFocus = false,
}) {
  const [activeTab, setActiveTab] = useState('write'); // 'write' | 'preview'
  const textareaRef = useRef(null);
  const isCore = theme === 'blue';
  const isHr = theme === 'purple';

  const applyFormat = (prefix, suffix = '', defaultText = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);

    const textToInsert = selected || defaultText;
    const newText = text.substring(0, start) + prefix + textToInsert + suffix + text.substring(end);
    onChange(newText);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newCursorStart = start + prefix.length;
        const newCursorEnd = newCursorStart + textToInsert.length;
        textareaRef.current.setSelectionRange(newCursorStart, newCursorEnd);
      }
    }, 0);
  };

  const applyBulletList = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);

    if (selected) {
      const converted = selected
        .split('\n')
        .map((line) => (/^[-*+•]\s+/.test(line.trim()) ? line : `- ${line}`))
        .join('\n');
      const newText = text.substring(0, start) + converted + text.substring(end);
      onChange(newText);
    } else {
      applyFormat('\n- ', '\n', 'List item');
    }
  };

  const applyNumberedList = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);

    if (selected) {
      let count = 1;
      const converted = selected
        .split('\n')
        .map((line) => {
          if (/^\d+[\.\)]\s+/.test(line.trim())) return line;
          return `${count++}. ${line}`;
        })
        .join('\n');
      const newText = text.substring(0, start) + converted + text.substring(end);
      onChange(newText);
    } else {
      applyFormat('\n1. ', '\n', 'First item\n2. Second item');
    }
  };

  const insertTableTemplate = () => {
    const template = `\n| Concept | Option A | Option B |\n| --- | --- | --- |\n| Feature 1 | Details A | Details B |\n| Feature 2 | Details A | Details B |\n`;
    applyFormat('', '', template);
  };

  const activeFocusRing = isCore
    ? 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
    : isHr
    ? 'focus:ring-2 focus:ring-purple-500 focus:border-purple-500'
    : 'focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500';

  const tabActiveCls = isCore
    ? 'bg-blue-600 text-white shadow-2xs'
    : isHr
    ? 'bg-purple-600 text-white shadow-2xs'
    : 'bg-emerald-600 text-white shadow-2xs';

  return (
    <div className="space-y-2">
      {/* Markdown Toolbar & Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-1.5 bg-stone-100/90 rounded-xl border border-stone-200 text-xs">
        {/* Formatting Actions */}
        <div className="flex flex-wrap items-center gap-0.5">
          <button
            type="button"
            onClick={() => applyFormat('**', '**', 'bold text')}
            title="Bold (**text**)"
            className="px-2 py-1 font-bold text-stone-700 hover:text-stone-900 hover:bg-stone-200/80 rounded transition-colors cursor-pointer"
          >
            B
          </button>
          <button
            type="button"
            onClick={() => applyFormat('*', '*', 'italic text')}
            title="Italic (*text*)"
            className="px-2 py-1 italic font-serif text-stone-700 hover:text-stone-900 hover:bg-stone-200/80 rounded transition-colors cursor-pointer"
          >
            I
          </button>
          <button
            type="button"
            onClick={() => applyFormat('\n### ', '\n', 'Heading')}
            title="Heading (### Title)"
            className="px-2 py-1 font-semibold text-stone-700 hover:text-stone-900 hover:bg-stone-200/80 rounded transition-colors text-[11px] cursor-pointer"
          >
            H3
          </button>
          <div className="w-px h-3.5 bg-stone-300 mx-1" />
          <button
            type="button"
            onClick={() => applyFormat('`', '`', 'code')}
            title="Inline Code (`code`)"
            className="px-1.5 py-1 font-mono text-[11px] text-stone-700 hover:text-stone-900 hover:bg-stone-200/80 rounded transition-colors cursor-pointer"
          >
            {'`code`'}
          </button>
          <button
            type="button"
            onClick={() => applyFormat('\n```python\n', '\n```\n', '# python code here')}
            title="Code Block (```python ... ```)"
            className="px-1.5 py-1 font-mono text-[11px] text-stone-700 hover:text-stone-900 hover:bg-stone-200/80 rounded transition-colors cursor-pointer"
          >
            {'```block'}
          </button>
          <div className="w-px h-3.5 bg-stone-300 mx-1" />
          <button
            type="button"
            onClick={applyBulletList}
            title="Bullet List (- item)"
            className="px-2 py-1 font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-200/80 rounded transition-colors text-[11px] flex items-center gap-1 cursor-pointer"
          >
            <span>•</span> List
          </button>
          <button
            type="button"
            onClick={applyNumberedList}
            title="Numbered List (1. item)"
            className="px-2 py-1 font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-200/80 rounded transition-colors text-[11px] flex items-center gap-1 cursor-pointer"
          >
            <span>1.</span> List
          </button>
          <button
            type="button"
            onClick={insertTableTemplate}
            title="Insert Markdown Table"
            className="px-2 py-1 font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-200/80 rounded transition-colors text-[11px] flex items-center gap-1 cursor-pointer"
          >
            <span>⊞</span> Table
          </button>
          <button
            type="button"
            onClick={() => applyFormat('\n> ', '\n', 'Key interview takeaway')}
            title="Blockquote (> quote)"
            className="px-2 py-1 font-serif text-stone-700 hover:text-stone-900 hover:bg-stone-200/80 rounded transition-colors text-[11px] cursor-pointer"
          >
            “ Quote
          </button>
        </div>

        {/* Tab Switcher: Write vs Preview */}
        <div className="flex items-center gap-1 bg-stone-200/70 p-0.5 rounded-lg text-xs font-semibold shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              activeTab === 'write' ? tabActiveCls : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            ✏️ Write
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'preview' ? tabActiveCls : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>👁️ Preview</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              activeTab === 'preview' ? 'bg-white/20 text-white' : 'bg-stone-300 text-stone-700'
            }`}>
              MD
            </span>
          </button>
        </div>
      </div>

      {/* Editor Body: Write Textarea or Live Preview */}
      {activeTab === 'write' ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder || 'Type or paste your answer in Markdown format (supports **bold**, *italic*, `code`, ```blocks, - lists, 1. numbers, | tables |, > quotes)...'}
          className={`w-full p-3.5 text-xs sm:text-sm font-mono leading-relaxed text-stone-900 bg-white rounded-xl border border-stone-300 shadow-inner resize-y transition-all ${activeFocusRing}`}
          autoFocus={autoFocus}
        />
      ) : (
        <div className="p-4 bg-white rounded-xl border border-stone-200 min-h-[160px] max-h-[360px] overflow-y-auto shadow-inner">
          <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-stone-100 text-[11px] text-stone-400 font-medium">
            <span>Markdown Live Preview:</span>
            <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${
              isCore ? 'bg-blue-100 text-blue-900' : isHr ? 'bg-purple-100 text-purple-900' : 'bg-emerald-100 text-emerald-900'
            }`}>
              Formatted
            </span>
          </div>
          {value && value.trim() ? (
            <MarkdownContent content={value} theme={theme} />
          ) : (
            <div className="text-stone-400 italic text-xs py-4 text-center">
              Nothing to preview yet. Switch to "Write" tab to type or paste markdown.
            </div>
          )}
        </div>
      )}

      {/* Formatting Hint */}
      <div className="flex items-center justify-between text-[11px] text-stone-500 px-1">
        <span>Markdown formatted: headings, **bold**, *italic*, `code`, ```blocks, - lists, | tables |</span>
        {activeTab === 'write' && (
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`font-semibold underline cursor-pointer ${
              isCore ? 'text-blue-700 hover:text-blue-900' : isHr ? 'text-purple-700 hover:text-purple-900' : 'text-emerald-700 hover:text-emerald-900'
            }`}
          >
            Preview Formatted &rarr;
          </button>
        )}
      </div>
    </div>
  );
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
  const isCore = Number(phaseId) >= 200;
  const isHr = Number(phaseId) >= 100 && Number(phaseId) < 200;
  const theme = isCore ? 'blue' : isHr ? 'purple' : 'emerald';

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

  const hasTable = useMemo(() => {
    const text = currentAnswer || '';
    return text.includes('|') && text.split(/\r?\n/).some(isTableSeparatorLine);
  }, [currentAnswer]);

  return (
    <div
      className={`rounded-2xl border transition-all p-4 sm:p-5 shadow-2xs ${
        isEditing
          ? isCore ? 'bg-blue-50/50 border-blue-300 ring-2 ring-blue-400/30' : isHr ? 'bg-purple-50/50 border-purple-300 ring-2 ring-purple-400/30' : 'bg-amber-50/50 border-amber-300 ring-2 ring-amber-400/30'
          : isCustomized
          ? isCore ? 'bg-blue-50/90 border-blue-300' : isHr ? 'bg-purple-50/90 border-purple-300' : 'bg-emerald-50/90 border-emerald-300'
          : isCore ? 'bg-blue-50/70 border-blue-200/90' : isHr ? 'bg-purple-50/70 border-purple-200/90' : 'bg-emerald-50/70 border-emerald-200/90'
      }`}
    >
      {/* Top Header Bar */}
      <div className={`flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b ${isCore ? 'border-blue-200/60' : isHr ? 'border-purple-200/60' : 'border-emerald-200/60'}`}>
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              isEditing ? (isCore ? 'bg-blue-500 animate-pulse' : isHr ? 'bg-purple-500 animate-pulse' : 'bg-amber-500 animate-pulse') : (isCore ? 'bg-blue-500' : isHr ? 'bg-purple-500' : 'bg-emerald-500')
            }`}
          ></span>
          <span className={`text-xs font-bold uppercase tracking-wider ${isCore ? 'text-blue-900' : isHr ? 'text-purple-900' : 'text-emerald-900'}`}>
            {isEditing ? 'Edit Spoken Answer' : 'How to Speak in the Interview:'}
          </span>
          {isCustomized && !isEditing && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs ${
              isCore ? 'bg-blue-100 text-blue-900 border border-blue-300/80' : isHr ? 'bg-purple-100 text-purple-900 border border-purple-300/80' : 'bg-amber-100 text-amber-900 border border-amber-300/80'
            }`}>
              <span>✏️</span> Customized
            </span>
          )}
          {hasTable && !isEditing && (
            <span className={`text-[10px] font-bold tracking-normal px-2 py-0.5 rounded-full flex items-center gap-1 ${
              isCore ? 'bg-blue-100 text-blue-800 border border-blue-300/80' : isHr ? 'bg-purple-100 text-purple-800 border border-purple-300/80' : 'bg-emerald-100 text-emerald-800 border border-emerald-300/80'
            }`}>
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
                className={`text-xs font-semibold px-3 py-1 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs hover:scale-[1.02] active:scale-[0.98] ${
                  isCore
                    ? 'text-blue-900 hover:text-blue-950 bg-blue-100/90 hover:bg-blue-200/90 border-blue-300'
                    : isHr
                    ? 'text-purple-900 hover:text-purple-950 bg-purple-100/90 hover:bg-purple-200/90 border-purple-300'
                    : 'text-emerald-900 hover:text-emerald-950 bg-emerald-100/90 hover:bg-emerald-200/90 border-emerald-300'
                }`}
              >
                <svg className={`w-3.5 h-3.5 ${isCore ? 'text-blue-800' : isHr ? 'text-purple-800' : 'text-emerald-800'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Edit Answer</span>
              </button>
            </>
          ) : (
            <span className="text-[11px] text-stone-500 italic">
              Full Markdown supported (headings, lists, code, tables) &bull; syncs to whole site
            </span>
          )}
        </div>
      </div>

      {/* Editing State vs Formatted Display */}
      {isEditing ? (
        <div className="space-y-3">
          <MarkdownEditor
            value={editText}
            onChange={setEditText}
            placeholder="Type or paste your interview-ready answer here in Markdown format (supports headings, **bold**, lists, ```code```, and | tables |)..."
            rows={8}
            theme={theme}
            autoFocus
          />

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={saveStatus === 'saving'}
                className={`text-xs font-bold text-white active:scale-[0.98] px-4 py-2 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-60 ${
                  isCore ? 'bg-blue-600 hover:bg-blue-700' : isHr ? 'bg-purple-600 hover:bg-purple-700' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
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
          <MarkdownContent content={currentAnswer} theme={theme} />
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
        <div className={`flex items-center justify-between px-6 py-4 border-b border-stone-100 ${
          Number(phaseId) >= 100 ? 'bg-purple-50/70' : 'bg-amber-50/60'
        }`}>
          <div className="flex items-center gap-2.5">
            <span className={`w-8 h-8 rounded-xl text-white flex items-center justify-center font-bold text-lg shadow-xs ${
              Number(phaseId) >= 100 ? 'bg-purple-600' : 'bg-amber-600'
            }`}>
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
                {Number(phaseId) >= 200 ? 'Target Core Category' : Number(phaseId) >= 100 ? 'Target HR Category' : 'Target Phase'}
              </label>
              <select
                value={phaseId}
                onChange={(e) => handlePhaseChange(e.target.value)}
                className={`w-full text-xs sm:text-sm font-medium bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-2 ${
                  Number(phaseId) >= 100
                    ? 'focus:ring-purple-500/30 focus:border-purple-500'
                    : 'focus:ring-amber-500/30 focus:border-amber-500'
                } cursor-pointer`}
              >
                {phases.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.id >= 100 ? `Category ${p.id - 100}` : `Phase ${p.id}`}: {p.title.includes(': ') ? p.title.split(': ')[1] : p.title}
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
                className={`w-full text-xs sm:text-sm font-medium bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-2 ${
                  Number(phaseId) >= 100
                    ? 'focus:ring-purple-500/30 focus:border-purple-500'
                    : 'focus:ring-amber-500/30 focus:border-amber-500'
                } cursor-pointer`}
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
                        ? Number(phaseId) >= 100
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-amber-600 text-white shadow-xs'
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
              className={`w-full text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl p-3 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 ${
                Number(phaseId) >= 100
                  ? 'focus:ring-purple-500/30 focus:border-purple-500'
                  : 'focus:ring-amber-500/30 focus:border-amber-500'
              } font-medium`}
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
            <MarkdownEditor
              value={answer}
              onChange={setAnswer}
              placeholder="Explain clearly with headings, bullet points, code snippets, or comparison tables..."
              rows={5}
              theme={Number(phaseId) >= 200 ? 'blue' : Number(phaseId) >= 100 ? 'purple' : 'emerald'}
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
              placeholder="e.g. STAR Framework, Situation, Task, Action, Result"
              className={`w-full text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 ${
                Number(phaseId) >= 100
                  ? 'focus:ring-purple-500/30 focus:border-purple-500'
                  : 'focus:ring-amber-500/30 focus:border-amber-500'
              }`}
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
              className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm transition-all cursor-pointer disabled:opacity-50 ${
                Number(phaseId) >= 100
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : 'bg-amber-600 hover:bg-amber-700'
              }`}
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

const defaultHrQuestions = [
  {
    id: 'hr-1',
    category: 'Introduction',
    question: 'Tell me about yourself and your journey as a developer.',
    summary: 'Structure with Present -> Past -> Future. Keep it concise (60–90 seconds).',
    answer: "• Present: Start with your current role and primary technical strengths (e.g., Python backend development, API design, algorithms, or distributed systems).\n• Past: Mention your technical foundation, pivotal projects, and accomplishments that shaped your engineering mindset.\n• Future: Connect your ambitions directly to this role and company, explaining why you are excited to solve technical challenges with their team."
  },
  {
    id: 'hr-2',
    category: 'Behavioral / STAR',
    question: 'Tell me about a challenging technical problem or bug you solved.',
    summary: 'Use the STAR method: Situation -> Task -> Action -> Result.',
    answer: "• Situation: A production service or query pipeline was experiencing high latency or memory leaks under heavy load.\n• Task: I took ownership of diagnosing the root cause and implementing a robust, permanent fix.\n• Action: Profiled memory and queries, located the bottleneck (e.g., suboptimal indexing, blocking I/O, or thread contention), and refactored the logic.\n• Result: Reduced response latency by 45% and stabilized memory usage under peak traffic."
  },
  {
    id: 'hr-3',
    category: 'Teamwork & Conflict',
    question: 'How do you handle technical disagreements or architectural debates within your team?',
    summary: 'Focus on empathy, objective criteria, benchmarks, and alignment.',
    answer: "I approach technical disagreements with curiosity rather than ego. I actively listen to understand the tradeoffs they are prioritizing. I propose evaluating options objectively using benchmarks, small Proof-of-Concepts (PoCs), or measurable KPIs (latency, maintainability, scalability). Once a team decision is made, I commit fully."
  },
  {
    id: 'hr-4',
    category: 'Self-Awareness',
    question: 'What are your greatest strengths and areas for improvement?',
    summary: 'Provide genuine technical strengths alongside a real area you are actively improving.',
    answer: "• Strength: Tenacity in root-cause debugging, clean code practices, and designing reliable, maintainable systems.\n• Area for Improvement: In the past, I sometimes spent excessive time perfecting early prototypes before validating business velocity. I now focus on shipping working MVPs first and iterating rapidly based on telemetry and user feedback."
  },
  {
    id: 'hr-5',
    category: 'Company Fit',
    question: 'Why do you want to join our company specifically?',
    summary: 'Demonstrate research and genuine alignment with their engineering mission.',
    answer: "Reference specific engineering challenges, open-source work, tech stack choices, or product milestones from the company. Connect how your passion for clean engineering and Python problem-solving aligns directly with what their team is building."
  },
  {
    id: 'hr-6',
    category: 'Work Under Pressure',
    question: 'How do you handle tight deadlines or shifting project priorities?',
    summary: 'Highlight prioritization, proactive communication, and iterative delivery.',
    answer: "I communicate early and proactively with project stakeholders. I break complex requirements down into core MVP deliverables versus non-critical enhancements, ensuring the highest-impact components are thoroughly tested and shipped reliably without accumulating unexpected technical debt."
  },
  {
    id: 'hr-7',
    category: 'Reverse Interviewing',
    question: 'What high-signal questions should you ask the interviewer at the end?',
    summary: 'Show curiosity and interest in engineering culture and team dynamics.',
    answer: "High-value questions to ask:\n1. 'What does a successful first 90 days look like for someone stepping into this role?'\n2. 'How does your engineering team balance shipping new features with addressing technical debt and maintenance?'\n3. 'What is the team dynamic and code review culture like day-to-day?'"
  }
];

function HrQuestionsModal({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIds, setOpenIds] = useState(new Set(['hr-1']));

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = defaultHrQuestions.filter((q) =>
    q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggle = (id) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-100 bg-gradient-to-r from-purple-50/80 via-white to-purple-50/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600/10 border border-purple-200 text-purple-700 flex items-center justify-center shadow-xs shrink-0 p-1.5">
              <img src="/hr.png" alt="HR Icon" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-stone-900 leading-tight">
                  HR &amp; Behavioral Questions
                </h3>
                <span className="text-[11px] font-bold text-purple-700 bg-purple-100/80 px-2 py-0.5 rounded-full border border-purple-200">
                  {defaultHrQuestions.length} Questions
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Key behavioral, STAR method, and culture fit interview rounds
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-stone-100 bg-stone-50/50">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search HR questions (e.g. STAR, conflict, weakness, introduction)..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-stone-200 rounded-xl text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>
        </div>

        {/* Content list */}
        <div className="p-4 sm:p-6 space-y-3 overflow-y-auto flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-stone-400 text-xs sm:text-sm">
              No HR questions match "{searchTerm}".
            </div>
          ) : (
            filtered.map((item) => {
              const isOpen = openIds.has(item.id);
              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border transition-all ${
                    isOpen
                      ? 'border-purple-200 bg-purple-50/20 shadow-xs'
                      : 'border-stone-200/80 bg-white hover:border-stone-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggle(item.id)}
                    className="w-full text-left p-4 flex items-start justify-between gap-3 cursor-pointer"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100/70 border border-purple-200/70 px-2 py-0.5 rounded-md">
                          {item.category}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-stone-900 leading-snug">
                        {item.question}
                      </h4>
                      {item.summary && !isOpen && (
                        <p className="text-xs text-stone-500 mt-1 line-clamp-1">
                          {item.summary}
                        </p>
                      )}
                    </div>
                    <div className="shrink-0 text-stone-400 mt-1">
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-purple-600" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 border-t border-purple-100/60 text-xs sm:text-sm text-stone-700 space-y-2 leading-relaxed">
                      {item.summary && (
                        <div className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-100 text-purple-900 text-xs font-medium flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                          <span>{item.summary}</span>
                        </div>
                      )}
                      <div className="whitespace-pre-line text-stone-700 pt-1 font-sans">
                        {item.answer}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-100 bg-stone-50/60 flex items-center justify-between text-xs text-stone-500">
          <span>Tip: Use real metrics and the STAR method when answering.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

// Helper to parse persisted navigation state from URL hash or localStorage
function parseNavState() {
  const defaultNav = {
    view: 'home',
    track: 'python',
    phaseId: 1,
    topicId: 'all',
  };

  let fromHash = null;
  if (typeof window !== 'undefined') {
    try {
      const rawHash = (window.location.hash || '').replace(/^#\/?/, '').trim();
      if (rawHash) {
        const params = new URLSearchParams(rawHash);
        const v = params.get('view');
        const t = params.get('track');
        const p = params.get('phase');
        const top = params.get('topic');

        fromHash = {};
        if (v === 'home' || v === 'phases' || v === 'questions') {
          fromHash.view = v;
        }
        if (t === 'python' || t === 'hr' || t === 'core') {
          fromHash.track = t;
        }
        if (p) {
          const parsedP = parseInt(p, 10);
          if (!isNaN(parsedP)) fromHash.phaseId = parsedP;
        }
        if (top !== null && top !== undefined) {
          fromHash.topicId = top === 'all' ? 'all' : (!isNaN(Number(top)) ? Number(top) : top);
        }
      }
    } catch (e) {
      console.warn('Failed to parse URL hash:', e);
    }
  }

  let fromStorage = null;
  if (typeof localStorage !== 'undefined') {
    try {
      const saved = localStorage.getItem('mockprep_nav_state');
      if (saved) {
        fromStorage = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse localStorage nav state:', e);
    }
  }

  const merged = {
    ...defaultNav,
    ...(fromStorage && typeof fromStorage === 'object' ? fromStorage : {}),
    ...(fromHash && typeof fromHash === 'object' ? fromHash : {}),
  };

  // Keep track and phaseId consistent
  if (merged.phaseId >= 200) {
    merged.track = 'core';
  } else if (merged.phaseId >= 100) {
    merged.track = 'hr';
  } else if (merged.track === 'core' && merged.phaseId < 200) {
    merged.phaseId = 201;
  } else if (merged.track === 'hr' && (merged.phaseId < 100 || merged.phaseId >= 200)) {
    merged.phaseId = 101;
  } else if (merged.track === 'python' && merged.phaseId >= 100) {
    merged.phaseId = 1;
  }

  if (merged.topicId !== 'all' && !isNaN(Number(merged.topicId))) {
    merged.topicId = Number(merged.topicId);
  }

  return merged;
}

export default function App() {
  const initialNav = useMemo(() => parseNavState(), []);

  // Navigation views: 'home' | 'phases' | 'questions'
  const [view, setView] = useState(initialNav.view);
  // Track: 'python' | 'hr'
  const [currentTrack, setCurrentTrack] = useState(initialNav.track);
  const [selectedPhaseId, setSelectedPhaseId] = useState(initialNav.phaseId);
  const [selectedTopicId, setSelectedTopicId] = useState(initialNav.topicId);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Set of opened question IDs for dropdown accordion
  const [openQuestionIds, setOpenQuestionIds] = useState(new Set([1]));

  // Server-synced questions by phase: { [phaseId]: Array<Question> } (Shared live across all devices)
  const [serverQuestionsByPhase, setServerQuestionsByPhase] = useState({});
  const [isSyncing, setIsSyncing] = useState(false);

  // Available phases across all tracks (Python, HR, Common Core)
  const allAvailablePhases = useMemo(() => [...allPhases, ...allHrPhases, ...allCorePhases], []);
  const activePhases = useMemo(() => (currentTrack === 'hr' ? allHrPhases : currentTrack === 'core' ? allCorePhases : allPhases), [currentTrack]);
  const isHrTrack = currentTrack === 'hr';
  const isCoreTrack = currentTrack === 'core';

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
  const [isHrModalOpen, setIsHrModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Fetch live questions for a phase from MongoDB backend so all devices stay in sync
  const fetchPhaseQuestions = async (phaseId) => {
    if (phaseId >= 100) return; // HR track runs bundled + local storage
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

  // Synchronize navigation state with localStorage and URL hash
  useEffect(() => {
    const navState = {
      view,
      track: currentTrack,
      phaseId: selectedPhaseId,
      topicId: selectedTopicId,
    };

    try {
      localStorage.setItem('mockprep_nav_state', JSON.stringify(navState));
    } catch (e) {
      console.warn('Failed to save nav state to localStorage:', e);
    }

    try {
      if (view !== 'home') {
        const params = new URLSearchParams();
        params.set('view', view);
        params.set('track', currentTrack);
        if (view === 'questions') {
          params.set('phase', String(selectedPhaseId));
          if (selectedTopicId !== 'all') {
            params.set('topic', String(selectedTopicId));
          }
        }
        const newHash = `#${params.toString()}`;
        if (window.location.hash !== newHash) {
          window.history.replaceState(null, '', newHash);
        }
      } else {
        if (window.location.hash && window.location.hash !== '#') {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      }
    } catch (e) {
      console.warn('Failed to update URL hash:', e);
    }
  }, [view, currentTrack, selectedPhaseId, selectedTopicId]);

  // Support browser Back/Forward navigation
  useEffect(() => {
    const handleHashChange = () => {
      const nav = parseNavState();
      setView(nav.view);
      setCurrentTrack(nav.track);
      setSelectedPhaseId(nav.phaseId);
      setSelectedTopicId(nav.topicId);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSaveAnswer = async (phaseId, questionId, newAnswer) => {
    // 1. Immediately update in-memory state so user sees change with zero lag
    setServerQuestionsByPhase((prev) => {
      const existingList = prev[phaseId] || (allAvailablePhases.find((p) => p.id === phaseId)?.data?.questions || []);
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
      const existingList = prev[phaseId] || (allAvailablePhases.find((p) => p.id === phaseId)?.data?.questions || []);
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
    return allAvailablePhases.find((p) => p.id === selectedPhaseId) || activePhases[0];
  }, [selectedPhaseId, allAvailablePhases, activePhases]);

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
    const targetPhase = allAvailablePhases.find((p) => p.id === phaseId);
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
            const list = prev[phaseId] || (allAvailablePhases.find((p) => p.id === phaseId)?.data?.questions || []);
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
    const target = allAvailablePhases.find((p) => p.id === phaseId);
    const firstQId = target?.data?.questions?.[0]?.id || 1;
    setOpenQuestionIds(new Set([firstQId]));
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
    <div className={`min-h-screen ${
      isCoreTrack
        ? 'bg-[#f8faff] selection:bg-blue-200'
        : isHrTrack
        ? 'bg-[#faf8fd] selection:bg-purple-200'
        : 'bg-[#faf7f2] selection:bg-amber-200'
    } text-stone-800 flex flex-col`}>
      
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

          <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full my-auto">
            {/* Header intro */}
            <div className="text-center mb-8 sm:mb-10 max-w-xl mx-auto">
              <div className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-wider text-amber-800 bg-amber-100/70 border border-amber-200/80 px-3.5 py-1 rounded-full mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Interview Preparation Tracks</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
                Select Your Interview Track
              </h1>
              <p className="text-stone-600 text-xs sm:text-sm mt-2 leading-relaxed">
                Choose a track to practice with real interview questions, spoken answers, and structured frameworks.
              </p>
            </div>

            {/* Three Cards: Python, HR & Common Core */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 w-full max-w-6xl">
              {/* Card 1: Python Mock Interview */}
              <div className="bg-white rounded-3xl border border-amber-200/90 p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-amber-300 transition-all duration-300 group">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-200 p-2 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200 shadow-xs">
                      <img src="/python.png" alt="Python Logo" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-100/80 border border-amber-200 px-3 py-1 rounded-full">
                      8 Phases &bull; 1,839 Qs
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight mb-2">
                    Python Technical Prep
                  </h3>
                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-5">
                    Master technical SDE questions across Fundamentals, Collections, OOP, Exceptions, File Handling, Internals &amp; Memory.
                  </p>

                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6">
                    <span className="text-[11px] font-semibold text-amber-900 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-lg">
                      ⚡ Fundamentals to Internals
                    </span>
                    <span className="text-[11px] font-semibold text-amber-900 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-lg">
                      💻 Code &amp; Output
                    </span>
                    <span className="text-[11px] font-semibold text-amber-900 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-lg">
                      📊 Comparison Tables
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentTrack('python');
                    setSelectedPhaseId(1);
                    setSelectedTopicId('all');
                    setView('phases');
                  }}
                  className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-amber-600 via-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 active:scale-[0.98] shadow-md shadow-amber-600/25 hover:shadow-lg hover:shadow-amber-600/30 border border-amber-500/30 transition-all duration-200 cursor-pointer"
                >
                  <img src="/python.png" alt="Python Icon" className="w-5 h-5 object-contain shrink-0" />
                  <span>Start Python Track</span>
                  <ArrowRight className="w-4 h-4 text-amber-200 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Card 2: HR Questions */}
              <div className="bg-white rounded-3xl border border-purple-200/90 p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-purple-300 transition-all duration-300 group">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-200 p-2 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200 shadow-xs">
                      <img src="/hr.png" alt="HR Logo" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-[11px] font-bold text-purple-800 bg-purple-100/80 border border-purple-200 px-3 py-1 rounded-full">
                      {allHrPhases.length} Categories &bull; {allHrPhases.reduce((acc, p) => acc + p.questionCount, 0)} Qs
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight mb-2">
                    HR &amp; Behavioral Prep
                  </h3>
                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-5">
                    Ace HR and culture-fit rounds with proven STAR method responses, conflict resolution, work under pressure, and leadership.
                  </p>

                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6">
                    <span className="text-[11px] font-semibold text-purple-900 bg-purple-50 border border-purple-200/80 px-2.5 py-1 rounded-lg">
                      🎯 STAR Framework
                    </span>
                    <span className="text-[11px] font-semibold text-purple-900 bg-purple-50 border border-purple-200/80 px-2.5 py-1 rounded-lg">
                      🗣️ Spoken Responses
                    </span>
                    <span className="text-[11px] font-semibold text-purple-900 bg-purple-50 border border-purple-200/80 px-2.5 py-1 rounded-lg">
                      💼 High-Signal Q&amp;A
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentTrack('hr');
                    setSelectedPhaseId(101);
                    setSelectedTopicId('all');
                    setView('phases');
                  }}
                  className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 via-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 active:scale-[0.98] shadow-md shadow-purple-600/25 hover:shadow-lg hover:shadow-purple-600/30 border border-purple-500/30 transition-all duration-200 cursor-pointer"
                >
                  <img src="/hr.png" alt="HR Icon" className="w-5 h-5 object-contain shrink-0" />
                  <span>Start HR Track</span>
                  <ArrowRight className="w-4 h-4 text-purple-200 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Card 3: Common Core Questions */}
              <div className="bg-white rounded-3xl border border-blue-200/90 p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 group">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-200 p-2 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200 shadow-xs">
                      <img src="/core.svg" alt="Common Core Logo" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-[11px] font-bold text-blue-800 bg-blue-100/80 border border-blue-200 px-3 py-1 rounded-full">
                      {allCorePhases.length} {allCorePhases.length === 1 ? 'Category' : 'Categories'} &bull; {allCorePhases.reduce((acc, p) => acc + p.questionCount, 0)} Core Qs
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight mb-2">
                    Common Core Questions
                  </h3>
                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-5">
                    Master programming language fundamentals, runtime memory, Object-Oriented Programming (OOP), Java, and Python internals with in-depth comparison tables and code execution.
                  </p>

                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6">
                    <span className="text-[11px] font-semibold text-blue-900 bg-blue-50 border border-blue-200/80 px-2.5 py-1 rounded-lg">
                      ⚙️ Fundamentals &amp; Memory
                    </span>
                    <span className="text-[11px] font-semibold text-indigo-900 bg-indigo-50 border border-indigo-200/80 px-2.5 py-1 rounded-lg">
                      🏛️ OOP &amp; SOLID
                    </span>
                    <span className="text-[11px] font-semibold text-amber-900 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-lg">
                      ☕ Java Internals
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-900 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-lg">
                      🐍 Python Runtime
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentTrack('core');
                    setSelectedPhaseId(201);
                    setSelectedTopicId('all');
                    setView('phases');
                  }}
                  className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 via-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 active:scale-[0.98] shadow-md shadow-blue-600/25 hover:shadow-lg hover:shadow-blue-600/30 border border-blue-500/30 transition-all duration-200 cursor-pointer"
                >
                  <img src="/core.svg" alt="Common Core Icon" className="w-5 h-5 object-contain shrink-0" />
                  <span>Start Core Track</span>
                  <ArrowRight className="w-4 h-4 text-blue-200 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
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
          <header className={`bg-white/80 border-b sticky top-0 z-20 backdrop-blur-md ${
            isCoreTrack ? 'border-blue-200/70' : currentTrack === 'hr' ? 'border-purple-200/70' : 'border-amber-200/70'
          }`}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
              <button
                onClick={() => setView('home')}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                  isCoreTrack
                    ? 'text-stone-700 hover:text-stone-900 bg-blue-50 hover:bg-blue-100 border-blue-200'
                    : currentTrack === 'hr'
                    ? 'text-stone-700 hover:text-stone-900 bg-purple-50 hover:bg-purple-100 border-purple-200'
                    : 'text-stone-700 hover:text-stone-900 bg-amber-50 hover:bg-amber-100 border-amber-200'
                }`}
              >
                ← Home
              </button>

              <div className="flex items-center gap-2">
                <img
                  src={isCoreTrack ? '/core.svg' : currentTrack === 'hr' ? '/hr.png' : '/python.png'}
                  alt="Track Logo"
                  className="w-6 h-6 rounded-md object-contain"
                />
                <h2 className="text-base font-bold text-stone-900">
                  {isCoreTrack
                    ? 'Select Common Core Category'
                    : currentTrack === 'hr'
                    ? 'Select HR & Behavioral Category'
                    : 'Select Interview Phase'}
                </h2>
              </div>

              <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
                isCoreTrack
                  ? 'text-blue-800 bg-blue-100/70 border-blue-200'
                  : currentTrack === 'hr'
                  ? 'text-purple-800 bg-purple-100/70 border-purple-200'
                  : 'text-amber-800 bg-amber-100/70 border-amber-200'
              }`}>
                {activePhases.length} {isCoreTrack ? 'Category' : currentTrack === 'hr' ? 'Categories' : 'Phases'} Ready
              </span>
            </div>
          </header>

          <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            <div className="w-full text-center mb-6 sm:mb-8">
              <div className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2 border ${
                isCoreTrack
                  ? 'text-blue-800 bg-blue-100/70 border-blue-200/80'
                  : currentTrack === 'hr'
                  ? 'text-purple-800 bg-purple-100/70 border-purple-200/80'
                  : 'text-amber-800 bg-amber-100/70 border-amber-200/80'
              }`}>
                <span>{isCoreTrack ? '⚙️' : currentTrack === 'hr' ? '👔' : '⚡'}</span>
                <span>{isCoreTrack ? 'Common Core Interview Track' : currentTrack === 'hr' ? 'HR & Behavioral Interview Track' : 'Python Technical Interview Track'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                {isCoreTrack
                  ? 'Choose a Category to Practice'
                  : currentTrack === 'hr'
                  ? 'Choose an HR Category to Practice'
                  : 'Choose a Phase to Practice'}
              </h2>
              <p className="text-stone-500 text-xs sm:text-sm mt-1.5 max-w-lg mx-auto">
                {isCoreTrack
                  ? 'Deep dive into foundational programming language & CS concepts with in-depth comparison tables, spoken responses, and code examples.'
                  : currentTrack === 'hr'
                  ? 'Comprehensive behavioral, STAR method & culture-fit interview questions with spoken responses and custom edits.'
                  : 'Comprehensive 1,839 questions with spoken responses, comparison tables, code examples & custom edits.'}
              </p>
            </div>

            {/* Proper Grid Display of Phases (Max 5 cards per row, then stack below) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 w-full">
              {activePhases.map((p) => {
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
                  101: {
                    accentBorder: 'border-t-purple-600',
                    borderHover: 'hover:border-purple-400',
                    badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
                    btnBg: 'bg-purple-600 hover:bg-purple-700 text-white',
                    iconBg: 'bg-purple-600',
                    highlight: 'from-purple-500/10 to-transparent',
                  },
                  102: {
                    accentBorder: 'border-t-purple-700',
                    borderHover: 'hover:border-purple-400',
                    badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
                    btnBg: 'bg-purple-700 hover:bg-purple-800 text-white',
                    iconBg: 'bg-purple-700',
                    highlight: 'from-purple-500/10 to-transparent',
                  },
                  103: {
                    accentBorder: 'border-t-violet-600',
                    borderHover: 'hover:border-violet-400',
                    badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
                    btnBg: 'bg-violet-700 hover:bg-violet-800 text-white',
                    iconBg: 'bg-violet-600',
                    highlight: 'from-violet-500/10 to-transparent',
                  },
                  104: {
                    accentBorder: 'border-t-fuchsia-600',
                    borderHover: 'hover:border-fuchsia-400',
                    badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
                    btnBg: 'bg-fuchsia-700 hover:bg-fuchsia-800 text-white',
                    iconBg: 'bg-fuchsia-600',
                    highlight: 'from-fuchsia-500/10 to-transparent',
                  },
                  105: {
                    accentBorder: 'border-t-purple-600',
                    borderHover: 'hover:border-purple-400',
                    badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
                    btnBg: 'bg-purple-600 hover:bg-purple-700 text-white',
                    iconBg: 'bg-purple-600',
                    highlight: 'from-purple-500/10 to-transparent',
                  },
                  106: {
                    accentBorder: 'border-t-purple-800',
                    borderHover: 'hover:border-purple-400',
                    badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
                    btnBg: 'bg-purple-800 hover:bg-purple-900 text-white',
                    iconBg: 'bg-purple-800',
                    highlight: 'from-purple-500/10 to-transparent',
                  },
                  107: {
                    accentBorder: 'border-t-violet-700',
                    borderHover: 'hover:border-violet-400',
                    badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
                    btnBg: 'bg-violet-700 hover:bg-violet-800 text-white',
                    iconBg: 'bg-violet-700',
                    highlight: 'from-violet-500/10 to-transparent',
                  },
                  108: {
                    accentBorder: 'border-t-purple-700',
                    borderHover: 'hover:border-purple-400',
                    badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
                    btnBg: 'bg-purple-700 hover:bg-purple-800 text-white',
                    iconBg: 'bg-purple-700',
                    highlight: 'from-purple-500/10 to-transparent',
                  },
                  109: {
                    accentBorder: 'border-t-fuchsia-700',
                    borderHover: 'hover:border-fuchsia-400',
                    badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
                    btnBg: 'bg-fuchsia-700 hover:bg-fuchsia-800 text-white',
                    iconBg: 'bg-fuchsia-700',
                    highlight: 'from-fuchsia-500/10 to-transparent',
                  },
                  110: {
                    accentBorder: 'border-t-purple-600',
                    borderHover: 'hover:border-purple-400',
                    badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
                    btnBg: 'bg-purple-600 hover:bg-purple-700 text-white',
                    iconBg: 'bg-purple-600',
                    highlight: 'from-purple-500/10 to-transparent',
                  },
                  111: {
                    accentBorder: 'border-t-indigo-600',
                    borderHover: 'hover:border-indigo-400',
                    badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
                    btnBg: 'bg-indigo-600 hover:bg-indigo-700 text-white',
                    iconBg: 'bg-indigo-600',
                    highlight: 'from-indigo-500/10 to-transparent',
                  },
                  112: {
                    accentBorder: 'border-t-purple-700',
                    borderHover: 'hover:border-purple-400',
                    badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
                    btnBg: 'bg-purple-700 hover:bg-purple-800 text-white',
                    iconBg: 'bg-purple-700',
                    highlight: 'from-purple-500/10 to-transparent',
                  },
                  113: {
                    accentBorder: 'border-t-violet-600',
                    borderHover: 'hover:border-violet-400',
                    badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
                    btnBg: 'bg-violet-600 hover:bg-violet-700 text-white',
                    iconBg: 'bg-violet-600',
                    highlight: 'from-violet-500/10 to-transparent',
                  },
                  114: {
                    accentBorder: 'border-t-fuchsia-600',
                    borderHover: 'hover:border-fuchsia-400',
                    badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
                    btnBg: 'bg-fuchsia-600 hover:bg-fuchsia-700 text-white',
                    iconBg: 'bg-fuchsia-600',
                    highlight: 'from-fuchsia-500/10 to-transparent',
                  },
                  115: {
                    accentBorder: 'border-t-purple-600',
                    borderHover: 'hover:border-purple-400',
                    badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
                    btnBg: 'bg-purple-600 hover:bg-purple-700 text-white',
                    iconBg: 'bg-purple-600',
                    highlight: 'from-purple-500/10 to-transparent',
                  },
                  116: {
                    accentBorder: 'border-t-violet-700',
                    borderHover: 'hover:border-violet-400',
                    badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
                    btnBg: 'bg-violet-700 hover:bg-violet-800 text-white',
                    iconBg: 'bg-violet-700',
                    highlight: 'from-violet-500/10 to-transparent',
                  },
                  117: {
                    accentBorder: 'border-t-purple-600',
                    borderHover: 'hover:border-purple-400',
                    badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
                    btnBg: 'bg-purple-600 hover:bg-purple-700 text-white',
                    iconBg: 'bg-purple-600',
                    highlight: 'from-purple-500/10 to-transparent',
                  },
                  118: {
                    accentBorder: 'border-t-indigo-600',
                    borderHover: 'hover:border-indigo-400',
                    badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
                    btnBg: 'bg-indigo-600 hover:bg-indigo-700 text-white',
                    iconBg: 'bg-indigo-600',
                    highlight: 'from-indigo-500/10 to-transparent',
                  },
                  119: {
                    accentBorder: 'border-t-purple-600',
                    borderHover: 'hover:border-purple-400',
                    badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
                    btnBg: 'bg-purple-600 hover:bg-purple-700 text-white',
                    iconBg: 'bg-purple-600',
                    highlight: 'from-purple-500/10 to-transparent',
                  },
                  120: {
                    accentBorder: 'border-t-fuchsia-600',
                    borderHover: 'hover:border-fuchsia-400',
                    badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
                    btnBg: 'bg-fuchsia-600 hover:bg-fuchsia-700 text-white',
                    iconBg: 'bg-fuchsia-600',
                    highlight: 'from-fuchsia-500/10 to-transparent',
                  },
                  121: {
                    accentBorder: 'border-t-purple-700',
                    borderHover: 'hover:border-purple-400',
                    badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
                    btnBg: 'bg-purple-700 hover:bg-purple-800 text-white',
                    iconBg: 'bg-purple-700',
                    highlight: 'from-purple-500/10 to-transparent',
                  },
                  122: {
                    accentBorder: 'border-t-indigo-600',
                    borderHover: 'hover:border-indigo-400',
                    badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
                    btnBg: 'bg-indigo-600 hover:bg-indigo-700 text-white',
                    iconBg: 'bg-indigo-600',
                    highlight: 'from-indigo-500/10 to-transparent',
                  },
                  201: {
                    accentBorder: 'border-t-blue-600',
                    borderHover: 'hover:border-blue-400',
                    badgeBg: 'bg-blue-100 text-blue-800 border-blue-200',
                    btnBg: 'bg-blue-600 hover:bg-blue-700 text-white',
                    iconBg: 'bg-blue-600',
                    highlight: 'from-blue-500/10 to-transparent',
                  },
                  202: {
                    accentBorder: 'border-t-cyan-600',
                    borderHover: 'hover:border-cyan-400',
                    badgeBg: 'bg-cyan-100 text-cyan-800 border-cyan-200',
                    btnBg: 'bg-cyan-600 hover:bg-cyan-700 text-white',
                    iconBg: 'bg-cyan-600',
                    highlight: 'from-cyan-500/10 to-transparent',
                  },
                  203: {
                    accentBorder: 'border-t-indigo-600',
                    borderHover: 'hover:border-indigo-400',
                    badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
                    btnBg: 'bg-indigo-600 hover:bg-indigo-700 text-white',
                    iconBg: 'bg-indigo-600',
                    highlight: 'from-indigo-500/10 to-transparent',
                  },
                  204: {
                    accentBorder: 'border-t-amber-600',
                    borderHover: 'hover:border-amber-400',
                    badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
                    btnBg: 'bg-amber-600 hover:bg-amber-700 text-white',
                    iconBg: 'bg-amber-600',
                    highlight: 'from-amber-500/10 to-transparent',
                  },
                  205: {
                    accentBorder: 'border-t-emerald-600',
                    borderHover: 'hover:border-emerald-400',
                    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                    btnBg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
                    iconBg: 'bg-emerald-600',
                    highlight: 'from-emerald-500/10 to-transparent',
                  },
                };
                const s = phaseStyles[p.id] || (p.id >= 200 ? phaseStyles[201] : p.id >= 100 ? phaseStyles[101] : phaseStyles[1]);
                const phaseName = p.title.includes(': ') ? p.title.split(': ')[1] : p.title;
                const tagLabel = currentTrack === 'hr' ? `Category ${p.id - 100}` : currentTrack === 'core' ? `Core ${p.id - 200}` : `Phase ${p.id}`;
                const isSpecialCategory = p.id === 122;

                return (
                  <div
                    key={p.id}
                    onClick={() => handleSelectPhase(p.id)}
                    className={`group rounded-2xl transition-all duration-200 flex flex-col justify-between cursor-pointer hover:-translate-y-1 relative overflow-hidden p-4 sm:p-5 ${
                      isSpecialCategory
                        ? 'bg-gradient-to-b from-amber-50/90 via-purple-50/40 to-white border-2 border-amber-400 shadow-md hover:shadow-xl ring-2 ring-amber-300/60 hover:ring-amber-400'
                        : `bg-white border border-stone-200/90 ${s.borderHover} border-t-4 ${s.accentBorder} shadow-xs hover:shadow-md`
                    }`}
                  >
                    {/* Top gradient highlight banner */}
                    <div className={`absolute top-0 inset-x-0 h-16 pointer-events-none ${
                      isSpecialCategory
                        ? 'bg-gradient-to-b from-amber-400/25 via-purple-400/10 to-transparent opacity-90'
                        : `bg-gradient-to-b ${s.highlight} opacity-60`
                    }`} />

                    {/* Ribbon for Category 22: Most Important / Common Questions */}
                    {isSpecialCategory && (
                      <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 via-orange-500 to-amber-600 text-white text-[10px] font-extrabold px-3 py-0.5 rounded-bl-lg shadow-xs uppercase tracking-wider flex items-center gap-1 z-10">
                        <span>⭐</span> MOST COMMON
                      </div>
                    )}

                    <div>
                      {/* Top Header Tag Row */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                            isSpecialCategory
                              ? 'bg-amber-100 text-amber-900 border-amber-300 font-extrabold'
                              : s.badgeBg
                          }`}>
                            {tagLabel}
                          </span>
                          {isSpecialCategory && (
                            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-white shadow-xs flex items-center gap-0.5 animate-pulse">
                              <span>⭐</span> MUST PREPARE
                            </span>
                          )}
                        </div>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          isSpecialCategory
                            ? 'text-amber-950 bg-amber-200/80 border border-amber-300 font-extrabold'
                            : 'text-stone-600 bg-stone-100'
                        }`}>
                          {p.questionCount} Qs
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className={`text-base font-bold transition-colors leading-snug line-clamp-2 mb-1.5 ${
                        isSpecialCategory
                          ? 'text-stone-900 group-hover:text-amber-950 font-extrabold'
                          : currentTrack === 'core' ? 'group-hover:text-blue-900 text-stone-900' : currentTrack === 'hr' ? 'group-hover:text-purple-900 text-stone-900' : 'group-hover:text-amber-900 text-stone-900'
                      }`}>
                        {isSpecialCategory && <span className="text-amber-500 mr-1 text-sm">⭐</span>}
                        {phaseName}
                      </h3>

                      {/* Topic Count */}
                      <div className={`text-[11px] font-semibold mb-2 ${
                        isSpecialCategory
                          ? 'text-amber-900 font-bold flex items-center gap-1'
                          : currentTrack === 'core' ? 'text-blue-800/90' : currentTrack === 'hr' ? 'text-purple-800/90' : 'text-amber-800/90'
                      }`}>
                        {isSpecialCategory && <span>🔥</span>}
                        {p.topicCount} Topics Included {isSpecialCategory && '• 125 Core Qs'}
                      </div>

                      {/* Description Summary */}
                      <p className={`text-xs leading-relaxed line-clamp-3 ${
                        isSpecialCategory ? 'text-stone-600 font-medium' : 'text-stone-500'
                      }`}>
                        {p.description}
                      </p>
                    </div>

                    {/* Bottom CTA Button */}
                    <div className={`mt-4 pt-3 border-t ${isSpecialCategory ? 'border-amber-200/80' : 'border-stone-100'}`}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectPhase(p.id);
                        }}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs group-hover:shadow-xs cursor-pointer ${
                          isSpecialCategory
                            ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-purple-700 hover:from-amber-600 hover:to-purple-800 text-white shadow-md'
                            : s.btnBg
                        }`}
                      >
                        <span>{isSpecialCategory ? '⭐ Master Common Questions' : 'Start Practice'}</span>
                        <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-stone-400 mt-6 sm:mt-8 text-center">
              Click any module card to jump straight into its questions with instant dropdown answers
            </p>
          </main>

          <footer className="py-4 text-center text-xs text-stone-400">
            {isCoreTrack ? 'Common Core Interview Prep' : currentTrack === 'hr' ? 'HR & Behavioral Interview Prep' : 'Python Mock Interview Prep'}
          </footer>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. STEP 3: QUESTIONS LIST WITH INLINE DROPDOWN ANSWERS         */}
      {/* ============================================================== */}
      {view === 'questions' && (
        <div className="flex-1 flex flex-col">
          <header className={`bg-white/80 border-b ${isCoreTrack ? 'border-blue-200/70' : isHrTrack ? 'border-purple-200/70' : 'border-amber-200/70'} sticky top-0 z-20 backdrop-blur-md`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setView('home')}
                  className={`inline-flex items-center gap-1.5 p-1 rounded-lg ${isCoreTrack ? 'hover:bg-blue-100/60' : isHrTrack ? 'hover:bg-purple-100/60' : 'hover:bg-amber-100/60'} transition-colors cursor-pointer`}
                  title="Back to Home"
                >
                  <img
                    src={isCoreTrack ? '/core.svg' : currentTrack === 'hr' ? '/hr.png' : '/python.png'}
                    alt="Track Logo"
                    className="w-6 h-6 rounded-md object-contain"
                  />
                </button>

                <button
                  onClick={() => setView('phases')}
                  className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                    isCoreTrack
                      ? 'text-blue-900 bg-blue-50 hover:bg-blue-100 border-blue-200'
                      : isHrTrack
                      ? 'text-purple-900 bg-purple-50 hover:bg-purple-100 border-purple-200'
                      : 'text-stone-700 hover:text-stone-900 bg-amber-50 hover:bg-amber-100 border-amber-200'
                  }`}
                >
                  {isCoreTrack ? '← Core Categories' : currentTrack === 'hr' ? '← HR Categories' : '← Phases'}
                </button>

                {/* Small Horizontal Phase Buttons */}
                <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                  {activePhases.map((p) => {
                    const isActive = p.id === selectedPhaseId;
                    const isSpecial = p.id === 122;
                    return (
                      <button
                        key={p.id}
                        onClick={() => handleSelectPhase(p.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                          isActive
                            ? isSpecial
                              ? 'bg-gradient-to-r from-amber-500 to-purple-700 text-white shadow-xs ring-1 ring-amber-300'
                              : isCoreTrack
                              ? 'bg-blue-600 text-white shadow-xs'
                              : isHrTrack
                              ? 'bg-purple-600 text-white shadow-xs'
                              : 'bg-amber-600 text-white shadow-xs'
                            : isSpecial
                            ? 'bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 font-bold'
                            : isCoreTrack
                            ? 'bg-white hover:bg-blue-50 text-stone-700 border border-blue-200 hover:border-blue-300'
                            : isHrTrack
                            ? 'bg-white hover:bg-purple-50 text-stone-700 border border-purple-200 hover:border-purple-300'
                            : 'bg-white hover:bg-amber-50 text-stone-700 border border-amber-200 hover:border-amber-300'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : isSpecial ? 'bg-amber-500' : isCoreTrack ? 'bg-blue-500' : isHrTrack ? 'bg-purple-500' : 'bg-amber-500'}`}></span>
                        <span>{isSpecial ? `⭐ ${p.shortTitle}` : p.shortTitle}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          isActive 
                            ? (isSpecial ? 'bg-purple-900 text-amber-100' : isCoreTrack ? 'bg-blue-700 text-blue-100' : isHrTrack ? 'bg-purple-700 text-purple-100' : 'bg-amber-700 text-amber-100') 
                            : isSpecial ? 'bg-amber-200 text-amber-900 font-bold' : 'bg-stone-100 text-stone-500'
                        }`}>
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
                    className={`w-full px-3.5 py-1.5 text-xs sm:text-sm rounded-xl border ${
                      isCoreTrack
                        ? 'border-blue-200 bg-blue-50/40 focus:ring-blue-500/40'
                        : isHrTrack
                        ? 'border-purple-200 bg-purple-50/40 focus:ring-purple-500/40'
                        : 'border-amber-200 bg-amber-50/40 focus:ring-amber-500/40'
                    } focus:bg-white focus:outline-none focus:ring-2 text-stone-800 placeholder-stone-400`}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => fetchPhaseQuestions(selectedPhaseId)}
                  disabled={isSyncing}
                  title="Sync with cloud database (pulls edits from other devices)"
                  className={`p-2 rounded-xl border ${
                    isCoreTrack
                      ? 'border-blue-200 bg-white hover:bg-blue-50'
                      : isHrTrack
                      ? 'border-purple-200 bg-white hover:bg-purple-50'
                      : 'border-amber-200 bg-white hover:bg-amber-50'
                  } text-stone-600 hover:text-stone-900 transition-all cursor-pointer shrink-0 shadow-2xs flex items-center justify-center`}
                >
                  <svg className={`w-3.5 h-3.5 ${isSyncing ? (isCoreTrack ? 'animate-spin text-blue-600' : isHrTrack ? 'animate-spin text-purple-600' : 'animate-spin text-amber-600') : 'text-stone-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>
          </header>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left Sidebar: Topics */}
            <aside className="md:col-span-4 lg:col-span-3">
              <div className={`bg-white border ${isCoreTrack ? 'border-blue-200/80' : isHrTrack ? 'border-purple-200/80' : 'border-amber-200/80'} rounded-2xl p-3 shadow-xs sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto`}>
                <div className={`px-3 py-2 text-xs font-bold uppercase tracking-wider ${isCoreTrack ? 'text-blue-800' : isHrTrack ? 'text-purple-800' : 'text-amber-800'} flex items-center justify-between`}>
                  <div className="flex items-center gap-1.5">
                    <span>Topics</span>
                    <span className="text-[11px] text-stone-500 font-normal">({topics.length})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(true)}
                    className={`inline-flex items-center gap-1 text-[11px] font-bold ${
                      isCoreTrack
                        ? 'text-blue-800 hover:text-blue-950 bg-blue-100/80 hover:bg-blue-200'
                        : isHrTrack
                        ? 'text-purple-800 hover:text-purple-950 bg-purple-100/80 hover:bg-purple-200'
                        : 'text-amber-800 hover:text-amber-950 bg-amber-100/80 hover:bg-amber-200'
                    } px-2 py-0.5 rounded-md transition-colors cursor-pointer`}
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
                        ? isCoreTrack
                          ? 'bg-blue-600 text-white shadow-sm'
                          : isHrTrack
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'bg-amber-600 text-white shadow-sm'
                        : isCoreTrack
                        ? 'text-stone-700 hover:bg-blue-50'
                        : isHrTrack
                        ? 'text-stone-700 hover:bg-purple-50'
                        : 'text-stone-700 hover:bg-amber-50'
                    }`}
                  >
                    <span>All Topics</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      selectedTopicId === 'all'
                        ? isCoreTrack
                          ? 'bg-blue-700 text-blue-100'
                          : isHrTrack
                          ? 'bg-purple-700 text-purple-100'
                          : 'bg-amber-700 text-amber-100'
                        : isCoreTrack
                        ? 'bg-blue-100/70 text-blue-800'
                        : isHrTrack
                        ? 'bg-purple-100/70 text-purple-800'
                        : 'bg-amber-100/70 text-amber-800'
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
                          ? isCoreTrack
                            ? 'bg-blue-600 text-white shadow-sm'
                            : isHrTrack
                            ? 'bg-purple-600 text-white shadow-sm'
                            : 'bg-amber-600 text-white shadow-sm'
                          : isCoreTrack
                          ? 'text-stone-700 hover:bg-blue-50'
                          : isHrTrack
                          ? 'text-stone-700 hover:bg-purple-50'
                          : 'text-stone-700 hover:bg-amber-50'
                      }`}
                    >
                      <span className="truncate">{t.id}. {t.name}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                        selectedTopicId === t.id
                          ? isCoreTrack
                            ? 'bg-blue-700 text-blue-100'
                            : isHrTrack
                            ? 'bg-purple-700 text-purple-100'
                            : 'bg-amber-700 text-amber-100'
                          : isCoreTrack
                          ? 'bg-blue-100/70 text-blue-800'
                          : isHrTrack
                          ? 'bg-purple-100/70 text-purple-800'
                          : 'bg-amber-100/70 text-amber-800'
                      }`}>
                        {t.count}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Quick phase switcher in sidebar */}
                <div className={`pt-3 mt-3 border-t ${isCoreTrack ? 'border-blue-100' : isHrTrack ? 'border-purple-100' : 'border-amber-100'}`}>
                  <div className={`text-[11px] font-bold ${isCoreTrack ? 'text-blue-800' : isHrTrack ? 'text-purple-800' : 'text-amber-800'} uppercase tracking-wider mb-1.5 px-1`}>
                    {isCoreTrack ? 'Quick Category Switch:' : currentTrack === 'hr' ? 'Quick Category Switch:' : 'Quick Phase Switch:'}
                  </div>
                  <div className={`grid ${isCoreTrack ? 'grid-cols-4' : currentTrack === 'hr' ? (activePhases.length > 6 ? 'grid-cols-4 sm:grid-cols-6' : 'grid-cols-6') : 'grid-cols-8'} gap-1`}>
                    {activePhases.map((p) => {
                      const isSpecial = p.id === 122;
                      return (
                        <button
                          key={p.id}
                          onClick={() => handleSelectPhase(p.id)}
                          title={p.title}
                          className={`py-1 text-center text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                            selectedPhaseId === p.id
                              ? isSpecial
                                ? 'bg-gradient-to-r from-amber-500 to-purple-700 text-white shadow-xs ring-2 ring-amber-300'
                                : isCoreTrack
                                ? 'bg-blue-600 text-white shadow-xs'
                                : isHrTrack
                                ? 'bg-purple-600 text-white shadow-xs'
                                : 'bg-amber-600 text-white shadow-xs'
                              : isSpecial
                              ? 'bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 font-extrabold shadow-2xs'
                              : isCoreTrack
                              ? 'bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200'
                              : isHrTrack
                              ? 'bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200'
                              : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
                          }`}
                        >
                          {isSpecial ? '⭐H22' : isCoreTrack ? `C${p.id - 200}` : currentTrack === 'hr' ? `H${p.id - 100}` : `P${p.id}`}
                        </button>
                      );
                    })}
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
                    className={`text-xs font-semibold ${
                      isCoreTrack
                        ? 'text-blue-800 hover:text-blue-900 bg-blue-50 hover:bg-blue-100/80 border-blue-200'
                        : isHrTrack
                        ? 'text-purple-800 hover:text-purple-900 bg-purple-50 hover:bg-purple-100/80 border-purple-200'
                        : 'text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100/80 border-amber-200'
                    } px-2.5 py-1 rounded-lg border transition-colors cursor-pointer`}
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
                    className={`inline-flex items-center gap-1.5 text-xs font-bold text-white ${
                      isCoreTrack ? 'bg-blue-600 hover:bg-blue-700' : isHrTrack ? 'bg-purple-600 hover:bg-purple-700' : 'bg-amber-600 hover:bg-amber-700'
                    } px-3 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer`}
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
                <div className={`bg-white border ${isCoreTrack ? 'border-blue-200/80' : isHrTrack ? 'border-purple-200/80' : 'border-amber-200/80'} rounded-2xl p-10 text-center text-stone-500 text-sm`}>
                  <p className="mb-3 text-stone-600">No questions found matching your filter or search.</p>
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(true)}
                    className={`inline-flex items-center gap-1.5 text-xs font-bold text-white ${
                      isCoreTrack ? 'bg-blue-600 hover:bg-blue-700' : isHrTrack ? 'bg-purple-600 hover:bg-purple-700' : 'bg-amber-600 hover:bg-amber-700'
                    } px-4 py-2 rounded-xl shadow-xs transition-colors cursor-pointer`}
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
                          isOpen
                            ? isCoreTrack
                              ? 'border-blue-400 ring-1 ring-blue-300/50'
                              : isHrTrack
                              ? 'border-purple-400 ring-1 ring-purple-300/50'
                              : 'border-amber-400 ring-1 ring-amber-300/50'
                            : isCoreTrack
                            ? 'border-blue-200/80 hover:border-blue-300'
                            : isHrTrack
                            ? 'border-purple-200/80 hover:border-purple-300'
                            : 'border-amber-200/80 hover:border-amber-300'
                        }`}
                      >
                        {/* Question Header (Click to toggle dropdown) */}
                        <button
                          onClick={() => toggleQuestion(q.id)}
                          className={`w-full text-left p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer ${
                            isCoreTrack ? 'hover:bg-blue-50/30' : isHrTrack ? 'hover:bg-purple-50/30' : 'hover:bg-amber-50/30'
                          } transition-colors`}
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            <span className={`inline-block mt-0.5 text-xs font-bold ${
                              isCoreTrack
                                ? 'text-blue-800 bg-blue-100/80 border-blue-200'
                                : isHrTrack
                                ? 'text-purple-800 bg-purple-100/80 border-purple-200'
                                : 'text-amber-800 bg-amber-100/80 border-amber-200'
                            } border px-2 py-0.5 rounded-md shrink-0`}>
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
                                  <span className={`text-[10px] font-semibold ${
                                    isCoreTrack
                                      ? 'bg-blue-100 text-blue-900 border-blue-300/80'
                                      : isHrTrack
                                      ? 'bg-purple-100 text-purple-900 border-purple-300/80'
                                      : 'bg-amber-100 text-amber-900 border-amber-300/80'
                                  } border px-1.5 py-0.2 rounded flex items-center gap-0.5`}>
                                    ✏️ Edited
                                  </span>
                                )}
                                {(q.title.toLowerCase().includes('difference') || q.title.toLowerCase().includes('vs')) && (
                                  <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300/80 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                                    ⇄ Difference
                                  </span>
                                )}
                                {q.code && (
                                  <span className={`text-[10px] ${
                                    isCoreTrack
                                      ? 'bg-blue-50 border-blue-200 text-blue-800'
                                      : isHrTrack
                                      ? 'bg-purple-50 border-purple-200 text-purple-800'
                                      : 'bg-amber-50 border-amber-200 text-amber-800'
                                  } border px-1.5 py-0.2 rounded font-mono`}>
                                    includes code
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Dropdown Chevron Indicator */}
                          <span
                            className={`text-xs font-bold w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-transform duration-200 ${
                              isCoreTrack
                                ? isOpen
                                  ? 'rotate-180 bg-blue-200 text-blue-900 border-blue-300'
                                  : 'bg-blue-50 border-blue-200 text-blue-700'
                                : isHrTrack
                                ? isOpen
                                  ? 'rotate-180 bg-purple-200 text-purple-900 border-purple-300'
                                  : 'bg-purple-50 border-purple-200 text-purple-700'
                                : isOpen
                                ? 'rotate-180 bg-amber-200 text-amber-900 border-amber-300'
                                : 'bg-amber-50 border-amber-200 text-amber-700'
                            }`}
                          >
                            ▼
                          </span>
                        </button>

                        {/* Dropdown Body: Spoken Answer in Green, Key Concepts, Code */}
                        {isOpen && (
                          <div className={`p-5 sm:p-6 border-t ${
                            isCoreTrack ? 'border-blue-100 bg-[#f8faff]' : isHrTrack ? 'border-purple-100 bg-[#faf8ff]' : 'border-amber-100 bg-[#fffdf9]'
                          } space-y-4 animate-in fade-in duration-150`}>
                            
                            {/* Spoken Answer Section with Inline Edit & Save */}
                            <AnswerSection
                              phaseId={selectedPhaseId}
                              question={q}
                              currentAnswer={currentAns}
                              originalAnswer={bundledAns}
                              customAnswer={isCustomized ? currentAns : undefined}
                              isDifferenceQuestion={q.title.toLowerCase().includes('difference') || q.title.toLowerCase().includes('vs')}
                              onSave={handleSaveAnswer}
                              onReset={handleResetAnswer}
                            />

                            {/* Key Concepts / Level */}
                            {q.keyConcepts && (
                              <div className={`${
                                isCoreTrack ? 'bg-blue-50/70 border-blue-200/80' : isHrTrack ? 'bg-purple-50/70 border-purple-200/80' : 'bg-amber-50/70 border-amber-200/80'
                              } border rounded-xl p-3.5`}>
                                <div className={`text-xs font-bold uppercase tracking-wider ${
                                  isCoreTrack ? 'text-blue-800' : isHrTrack ? 'text-purple-800' : 'text-amber-800'
                                } mb-1`}>
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
        phases={activePhases}
        currentPhaseId={selectedPhaseId}
        currentTopicId={selectedTopicId}
        onAdd={handleAddQuestion}
      />

      {/* HR Questions Modal */}
      <HrQuestionsModal
        isOpen={isHrModalOpen}
        onClose={() => setIsHrModalOpen(false)}
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
