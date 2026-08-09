import React from 'react'

const guideItems = [
  {
    title: 'How to Use AI-Mentor',
    content: (
      <div className="space-y-3">
        <p>AI-Mentor is designed to support your learning using the course materials available for this course.</p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Open AI-Mentor from the course page.</li>
          <li>Choose the mentor option that best matches what you need.</li>
          <li>Ask a clear question about your course, assignment, rubric, research, or learning topic.</li>
          <li>Provide enough context for AI-Mentor to understand your question.</li>
          <li>Ask follow-up questions if you need a simpler explanation or more detail.</li>
        </ol>
        <p>
          You can use options such as Explain Assignment, Explain Rubric, Explain a Topic, Review My Draft, and Ask
          Anything for general course questions.
        </p>
      </div>
    ),
  },
  {
    title: 'What AI-Mentor Can Do',
    content: (
      <div className="space-y-3">
        <ul className="list-disc pl-5 space-y-1">
          <li>Help you understand assignment requirements.</li>
          <li>Explain rubric criteria in simpler language.</li>
          <li>Explain difficult course, research, and project-related concepts.</li>
          <li>Answer questions using available course materials.</li>
          <li>Review sections of your draft and suggest areas to improve.</li>
          <li>Summarize or simplify difficult concepts.</li>
          <li>Provide examples to support understanding.</li>
          <li>Help you reflect on your research or project process.</li>
        </ul>
        <p>
          AI-Mentor is designed to support your learning and help you think through your work. It does not replace your
          mentor or your own critical thinking.
        </p>
      </div>
    ),
  },
  {
    title: 'What AI-Mentor Cannot Do',
    content: (
      <ul className="list-disc pl-5 space-y-1">
        <li>AI-Mentor may not always be 100% accurate.</li>
        <li>Its responses depend on the course materials and information available to it.</li>
        <li>It cannot guarantee a grade or assessment outcome.</li>
        <li>It should not complete assessed work on your behalf.</li>
        <li>It should not replace your own critical thinking.</li>
        <li>It should not be treated as the final authority on assessment decisions.</li>
        <li>Important assessment requirements should be confirmed with your mentor when necessary.</li>
        <li>It may not be able to answer questions outside the available course materials.</li>
      </ul>
    ),
  },
  {
    title: 'Example Questions',
    content: (
      <div className="space-y-4">
        <QuestionGroup
          title="Explain Assignment"
          questions={[
            'What are the main requirements of my CPL assignment?',
            'What should I include in my critical reflection?',
            'What should I discuss when evaluating my research process?',
            'How should I structure the research section of my assignment?',
          ]}
        />
        <QuestionGroup
          title="Explain Rubric"
          questions={[
            'What does the rubric mean by evaluating the research process?',
            'What do I need to demonstrate to meet this criterion?',
            'Can you explain this rubric criterion in simpler language?',
            'What is the difference between describing my research and critically evaluating it?',
          ]}
        />
        <QuestionGroup
          title="Explain a Topic"
          questions={[
            'What is a Gantt chart and why is it used in project planning?',
            'What is the difference between primary and secondary research?',
            'How does secondary research support a research project?',
            'What are common limitations in a research project?',
            'Why is research planning important?',
          ]}
        />
        <QuestionGroup
          title="Review My Draft"
          questions={[
            'My survey only has 20 participants. Is this an appropriate limitation to discuss?',
            'Can you review my explanation of the research process and tell me what I should improve?',
            'Does this paragraph critically evaluate my research, or does it only describe it?',
            'Have I explained the limitations of my research clearly enough?',
          ]}
        />
        <QuestionGroup
          title="General CPL Questions"
          questions={[
            'What are common limitations of a research project?',
            'How should I discuss changes between my initial project plan and what actually happened?',
            'How can I evaluate whether my research methods were effective?',
            'How can I explain what I learned from the research process?',
          ]}
        />
      </div>
    ),
  },
  {
    title: 'What Questions Cannot Be Asked',
    content: (
      <p>
        Of course, you can't ask questions like: Do you know Suga from South Korea global boy band BTS?
      </p>
    ),
  },
  {
    title: 'Tips for Best Results',
    content: (
      <div className="space-y-4">
        <p>You will usually get better responses when your questions are specific and include enough context.</p>
        <BeforeBetter before="Explain this" better="Can you explain the difference between primary and secondary research with a simple example?" />
        <BeforeBetter
          before="Check my assignment"
          better="Can you review this section of my assignment and tell me whether I have critically evaluated my research process?"
        />
        <BeforeBetter
          before="Is this good?"
          better="Does this paragraph clearly explain the limitations of my research method? What could I improve?"
        />
        <ul className="list-disc pl-5 space-y-1">
          <li>Ask one clear question at a time.</li>
          <li>Mention the topic you are working on.</li>
          <li>Provide relevant context.</li>
          <li>Ask follow-up questions.</li>
          <li>Ask for simpler explanations when needed.</li>
        </ul>
      </div>
    ),
  },
  {
    title: 'Future Expectations',
    content: (
      <div className="space-y-3">
        <p>Future versions of AI-Mentor may include:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Better personalization based on learner progress.</li>
          <li>Better understanding of individual learner strengths and weaknesses.</li>
          <li>More personalized learning recommendations.</li>
          <li>Support for additional courses and modules.</li>
          <li>Improved document and resource understanding.</li>
          <li>More accurate and context-aware responses.</li>
          <li>Better draft-review capabilities.</li>
          <li>Potential integration with additional LMS learning activities.</li>
          <li>More adaptive learning support based on learner progress.</li>
        </ul>
      </div>
    ),
  },
]

function QuestionGroup({ title, questions }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-[var(--text)]">{title}</h4>
      <ul className="mt-2 list-disc pl-5 space-y-1">
        {questions.map((question) => (
          <li key={question}>{question}</li>
        ))}
      </ul>
    </div>
  )
}

function BeforeBetter({ before, better }) {
  return (
    <div className="border border-[var(--border)] rounded bg-white p-3">
      <div className="text-xs font-semibold text-[var(--subdued)]">Instead of</div>
      <p className="mt-1">{before}</p>
      <div className="mt-3 text-xs font-semibold text-[var(--primary)]">Better</div>
      <p className="mt-1">{better}</p>
    </div>
  )
}

function GuideItem({ title, children, open, onToggle }) {
  return (
    <div className="border border-[var(--border)] rounded mb-3 overflow-hidden card">
      <button onClick={onToggle} className="w-full text-left px-4 py-3 bg-white flex items-center justify-between soft-transition">
        <div className="flex items-center gap-3 text-[var(--text)] min-w-0">
          <div className="w-3 h-3 rounded-full border flex-none" />
          <div className="font-medium break-words">{title}</div>
        </div>
        <div className="text-[var(--subdued)] flex-none ml-4">{open ? '-' : '+'}</div>
      </button>
      {open && <div className="p-4 bg-[var(--hover)] text-sm text-[var(--text)] leading-6">{children}</div>}
    </div>
  )
}

export default function AIMentorGuide() {
  const [openItem, setOpenItem] = React.useState(null)

  return (
    <section>
      <div className="mb-4">
        <h2 className="card-title text-[var(--text)]">AI-Mentor Guide</h2>
        <p className="desc-text mt-1">Learn how to get the most out of your AI learning companion.</p>
      </div>

      <div>
        {guideItems.map((item) => (
          <GuideItem
            key={item.title}
            title={item.title}
            open={openItem === item.title}
            onToggle={() => setOpenItem((current) => (current === item.title ? null : item.title))}
          >
            {item.content}
          </GuideItem>
        ))}
      </div>
    </section>
  )
}
