import { renderFormatted } from '../utils/formatText.jsx';

export default function ChatBubble({ role, content, icon: Icon }) {
  const isUser = role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-accent px-4 py-3 text-sm text-white sm:max-w-[75%]">
          <p className="whitespace-pre-wrap">{content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
        {Icon && <Icon size={14} strokeWidth={2} />}
      </div>
      <div className="max-w-[85%] rounded-2xl rounded-tl-md border border-line bg-surface px-4 py-3 text-sm text-ink shadow-card sm:max-w-[75%]">
        <div className="prose-chat">{renderFormatted(content)}</div>
      </div>
    </div>
  );
}
