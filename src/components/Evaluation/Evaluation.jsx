import React from 'react'
import { CheckCircle2 } from 'lucide-react'

const configuration = [
  ['Retrieval method', 'Semantic Search'],
  ['Vector database', 'ChromaDB'],
  ['Knowledge base', '94 structured CPL chunks'],
  ['Top-K', '5'],
  ['Maximum Chroma distance', '<= 1.4'],
  ['System Prompt', 'V3'],
  ['LLM', 'GPT-5.4 mini'],
]

const retrievalMetrics = [
  {
    value: '5 / 5',
    label: 'Out-of-scope queries rejected',
    text: 'All clearly unrelated test queries produced NO_CONTEXT after threshold filtering.',
  },
  {
    value: '5 / 5',
    label: 'Borderline CPL queries retained context',
    text: 'All tested borderline course-related queries retained usable CPL context.',
  },
  {
    value: '5 / 5',
    label: 'Mentor-mode filter cases passed',
    text: 'Assignment, rubric, topic, draft-review, and general retrieval modes complied with their intended document filters after the fallback fix.',
  },
  {
    value: '13 / 15',
    label: 'Retrieval regression cases unchanged',
    text: 'Thirteen baseline retrieval cases remained unchanged after threshold implementation. T14 intentionally changed to NO_CONTEXT; T01 was inspected after supporting chunks were removed.',
  },
]

const behaviours = [
  'Grounded course responses',
  'Insufficient-evidence handling',
  'NO_CONTEXT handling',
  'Assessed-work boundaries',
  'Clarification behaviour',
  'Learner guidance',
  'Clear and supportive explanations',
]

const processSteps = [
  'Baseline',
  'Retrieval experiments',
  'Threshold & Top-K testing',
  'Regression testing',
  'Prompt V1/V2/V3',
  'Model comparison',
  'Final regression',
]

function MetricCard({ value, label, text }) {
  return (
    <div className="card p-5">
      <div className="text-3xl font-semibold text-[var(--primary)]">{value}</div>
      <div className="mt-2 font-semibold text-[var(--text)]">{label}</div>
      <p className="mt-2 text-sm leading-6 text-[var(--subdued)]">{text}</p>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section className="mt-6">
      <h2 className="card-title text-[var(--text)]">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

export default function Evaluation() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="course-title text-[var(--text)]">AI Mentor Evaluation</h1>
        <p className="mt-2 max-w-3xl text-[var(--subdued)]">
          Development evaluation of retrieval quality, grounding, and mentor behaviour for the CPL prototype.
        </p>
      </div>

      <Section title="Final Tested Configuration">
        <div className="card overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {configuration.map(([label, value]) => (
              <div key={label} className="border-b border-r border-[var(--border)] p-4 last:border-r-0">
                <div className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">{label}</div>
                <div className="mt-2 text-base font-semibold text-[var(--text)]">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Retrieval Evaluation">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {retrievalMetrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>
      </Section>

      <Section title="AI Mentor Behaviour Evaluation">
        <div className="card p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="text-4xl font-semibold text-[var(--primary)]">12 / 12</div>
              <div className="mt-2 text-lg font-semibold text-[var(--text)]">Final development behaviour cases acceptable</div>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--subdued)]">
                The final GPT-5.4 mini + System Prompt V3 configuration met the expected behaviour across the controlled P01-P12 development test set.
              </p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {behaviours.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-2 rounded border border-[var(--border)] bg-[#F8FAFC] px-3 py-2 text-sm text-[var(--text)]"
              >
                <CheckCircle2 size={16} className="text-[var(--primary)]" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Evaluation Process">
        <div className="card p-5">
          <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--subdued)]">
            {processSteps.map((step, index) => (
              <React.Fragment key={step}>
                <span className="rounded border border-[var(--border)] bg-white px-3 py-2 font-medium text-[var(--text)]">
                  {step}
                </span>
                {index < processSteps.length - 1 && <span className="text-[var(--muted)]">-&gt;</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </Section>

      <section className="mt-6 rounded border border-[#C9D5E8] bg-[#F8FAFC] p-5">
        <div className="font-semibold text-[var(--text)]">Development Evaluation</div>
        <p className="mt-2 max-w-5xl text-sm leading-6 text-[var(--subdued)]">
          These results are based on controlled CPL prototype test cases used during system development. They demonstrate behaviour under the tested conditions and do not represent guaranteed accuracy or performance for all unseen learner queries.
        </p>
      </section>
    </div>
  )
}
