import React from 'react'
import { recent } from '../../data/dummyData'

function renderInline(text) {
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g)

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>
    }
    return <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>
  })
}

function parseMarkdown(text) {
  const lines = String(text || '').replace(/\r\n/g, '\n').split('\n')
  const blocks = []
  let paragraph = []
  let list = []
  let listType = null

  function flushParagraph() {
    if (paragraph.length) {
      blocks.push({ type: 'paragraph', text: paragraph.join(' ') })
      paragraph = []
    }
  }

  function flushList() {
    if (list.length) {
      blocks.push({ type: listType, items: list })
      list = []
      listType = null
    }
  }

  lines.forEach((line) => {
    const trimmed = line.trim()
    const bulletMatch = trimmed.match(/^[-*]\s+(.+)/)
    const numberMatch = trimmed.match(/^\d+[.)]\s+(.+)/)

    if (!trimmed) {
      flushParagraph()
      flushList()
      return
    }

    const markdownHeadingMatch = trimmed.match(/^#{1,3}\s+(.+)/)
    if (markdownHeadingMatch) {
      flushParagraph()
      flushList()
      blocks.push({ type: 'heading', text: markdownHeadingMatch[1].replace(/\s+#+$/, '') })
      return
    }

    if (bulletMatch || numberMatch) {
      flushParagraph()
      const nextType = bulletMatch ? 'bullet' : 'number'
      if (listType && listType !== nextType) flushList()
      listType = nextType
      list.push((bulletMatch || numberMatch)[1])
      return
    }

    flushList()

    if (/^\*\*[^*]+\*\*$/.test(trimmed)) {
      flushParagraph()
      blocks.push({ type: 'heading', text: trimmed.slice(2, -2) })
      return
    }

    if (/^[A-Z][A-Za-z /-]{2,40}:?$/.test(trimmed) && !trimmed.endsWith('.')) {
      flushParagraph()
      blocks.push({ type: 'heading', text: trimmed.replace(/:$/, '') })
      return
    }

    paragraph.push(trimmed)
  })

  flushParagraph()
  flushList()
  return blocks
}

function MarkdownContent({ text }) {
  const blocks = parseMarkdown(text)

  return (
    <div className="ai-response-content">
      {blocks.map((block, index) => {
        if (block.type === 'heading') {
          return <h4 key={`${block.text}-${index}`}>{renderInline(block.text)}</h4>
        }

        if (block.type === 'bullet') {
          return (
            <ul key={`bullet-${index}`}>
              {block.items.map((item) => (
                <li key={item}>{renderInline(item)}</li>
              ))}
            </ul>
          )
        }

        if (block.type === 'number') {
          return (
            <ol key={`number-${index}`}>
              {block.items.map((item) => (
                <li key={item}>{renderInline(item)}</li>
              ))}
            </ol>
          )
        }

        return <p key={`${block.text}-${index}`}>{renderInline(block.text)}</p>
      })}
    </div>
  )
}

function Sources({ sources }) {
  if (!sources?.length) return null

  return (
    <div className="ai-sources">
      <div className="ai-sources-title">Sources</div>
      <ul>
        {sources.map((source, index) => (
          <li key={`${source.title}-${source.section}-${index}`}>
            {source.title}
            {source.section ? ` - ${source.section}` : ''}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function ConversationList({ messages, loading }) {
  const items = messages ?? recent.map((item) => ({ ...item, role: 'assistant' }))

  return (
    <div className="ai-message-list">
      <div className="space-y-5">
        {items.map((item) => (
          <div key={item.id} className={`ai-message-row ${item.role === 'user' ? 'user' : 'assistant'}`}>
            <div className={`ai-message ${item.role === 'user' ? 'ai-message-user' : 'ai-message-assistant'}`}>
              <div className="ai-message-label">{item.role === 'user' ? 'You' : 'AI-Mentor, Htoo Wutt Yi'}</div>
              {item.role === 'user' ? (
                <div className="ai-user-text">{item.text}</div>
              ) : (
                <>
                  <MarkdownContent text={item.text} />
                  <Sources sources={item.sources} />
                </>
              )}
            </div>
            {item.time && <div className="text-xs text-[var(--subdued)] mt-1">{item.time}</div>}
          </div>
        ))}
        {loading && (
          <div className="ai-message-row assistant">
            <div className="ai-message ai-message-assistant">
              <div className="ai-message-label">AI-Mentor, Htoo Wutt Yi</div>
              <p className="text-sm text-[var(--subdued)]">Preparing a response...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
