// Small, dependency-free renderer for the light markdown-ish structure
// our assistants are prompted to use (headings, bullets, numbered lists, bold).
export function renderFormatted(text) {
  const lines = (text || '').split('\n');
  const blocks = [];
  let listBuffer = [];
  let listType = null;

  const flushList = () => {
    if (!listBuffer.length) return;
    const Tag = listType === 'ol' ? 'ol' : 'ul';
    blocks.push(
      <Tag key={`list-${blocks.length}`}>
        {listBuffer.map((item, i) => <li key={i}>{inline(item)}</li>)}
      </Tag>
    );
    listBuffer = [];
    listType = null;
  };

  lines.forEach((rawLine, idx) => {
    const line = rawLine.trim();

    if (!line) { flushList(); return; }

    if (line.startsWith('### ')) { flushList(); blocks.push(<h3 key={idx}>{inline(line.slice(4))}</h3>); return; }
    if (line.startsWith('## ')) { flushList(); blocks.push(<h3 key={idx}>{inline(line.slice(3))}</h3>); return; }
    if (line.startsWith('# ')) { flushList(); blocks.push(<h3 key={idx}>{inline(line.slice(2))}</h3>); return; }

    const bulletMatch = line.match(/^[-*]\s+(.*)/);
    if (bulletMatch) {
      if (listType !== 'ul') flushList();
      listType = 'ul';
      listBuffer.push(bulletMatch[1]);
      return;
    }

    const numMatch = line.match(/^\d+[.)]\s+(.*)/);
    if (numMatch) {
      if (listType !== 'ol') flushList();
      listType = 'ol';
      listBuffer.push(numMatch[1]);
      return;
    }

    flushList();
    blocks.push(<p key={idx}>{inline(line)}</p>);
  });
  flushList();

  return blocks;
}

function inline(str) {
  const parts = str.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}
