import { useMemo, useState } from 'react'
import { demoRelease, partnerTools } from './data/demoTrain'
import type { PartnerToolId, PillarId, RiskLevel, TicketKind } from './types/train'
import './App.css'

const pillarLabel: Record<PillarId, string> = {
  growth: 'Growth',
  engagement: 'Engage',
  core: 'Core',
  platform: 'Platform',
}

const riskClass: Record<RiskLevel, string> = {
  low: 'risk risk--low',
  medium: 'risk risk--medium',
  high: 'risk risk--high',
  critical: 'risk risk--critical',
}

const kindClass: Record<TicketKind, string> = {
  feature: 'kind kind--feature',
  bug: 'kind kind--bug',
}

const partnerName: Record<PartnerToolId, string> = {
  testmcp: 'TestMCP',
  forgeqa: 'ForgeQA',
  'release-gate': 'Release Gate',
  'war-room': 'War Room',
}

function App() {
  const release = demoRelease
  const [checks, setChecks] = useState(() =>
    Object.fromEntries(release.stakeholderItems.map((item) => [item.id, item.defaultChecked])),
  )

  const accepted = useMemo(
    () => release.stakeholderItems.every((item) => checks[item.id]),
    [checks, release.stakeholderItems],
  )

  const statusHeadline = accepted ? 'Residual risk accepted' : 'Elevated Regression Risk'

  const ticketTotal = release.tickets.length
  const featureCount = release.tickets.filter((t) => t.kind === 'feature').length
  const bugCount = release.tickets.filter((t) => t.kind === 'bug').length
  const checkedCount = release.stakeholderItems.filter((item) => checks[item.id]).length
  const packRatio = checkedCount / release.stakeholderItems.length

  const toggle = (id: string) => {
    setChecks((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="shell">
      <nav className="shell__nav" aria-label="Weekly Risk Radar">
        <div className="shell__nav-center">
          <p className="shell__logo">
            <span aria-hidden="true">📡</span>
            <span>Weekly Risk Radar</span>
            <span aria-hidden="true">👩‍💻</span>
          </p>
          <span className="shell__env-chip">{release.version}</span>
        </div>
      </nav>

      <div className="shell__content">
        <header className="pulse" data-verdict={accepted ? 'ready' : 'elevated'}>
          <div className="pulse__left">
            <p className="pulse__label">Release risk</p>
            <p className="pulse__emoji" aria-hidden="true">
              {accepted ? '✅' : '⚠️'}
            </p>
            <h1 className="pulse__headline">{statusHeadline}</h1>
            <p className="pulse__env">{release.product}</p>
            <p className="pulse__run">
              Score {release.riskScore}/100 · {ticketTotal} tickets ({featureCount} features /{' '}
              {bugCount} bugs) · {release.platforms.length} platforms · P0–P2 (manual)
            </p>
            <p className="pulse__example">
              <span>Example data used here</span>
              <span className="pulse__example-sub">Real solution plan shape</span>
            </p>
          </div>

          <div className="pulse__right">
            <p className="pulse__support">{release.summary}</p>
            <p className="pulse__problem">{release.problemNote}</p>
            <div className="pulse__rows" aria-label="Release signal bars">
              <div className="pulse__row">
                <div className="pulse__row-label">
                  <span>🎯 Risk dial</span>
                  <span>
                    {release.riskScore}/100 · {statusHeadline}
                  </span>
                </div>
                <div className="pulse__bar" aria-hidden="true">
                  <span
                    className="pulse__bar-fill pulse__bar-fill--hi-rose"
                    style={{ width: `${release.riskScore}%` }}
                  />
                </div>
              </div>
              <div className="pulse__row">
                <div className="pulse__row-label">
                  <span>📱 Platforms</span>
                  <span>{release.platforms.length} in matrix</span>
                </div>
                <div className="pulse__bar" aria-hidden="true">
                  <span
                    className="pulse__bar-fill pulse__bar-fill--hi-amber"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
              <div className="pulse__row">
                <div className="pulse__row-label">
                  <span>📋 Stakeholder pack</span>
                  <span>
                    {checkedCount}/{release.stakeholderItems.length} complete
                  </span>
                </div>
                <div className="pulse__bar" aria-hidden="true">
                  <span
                    className={`pulse__bar-fill ${accepted ? 'pulse__bar-fill--hi-teal' : 'pulse__bar-fill--hi-amber'}`}
                    style={{ width: `${Math.round(packRatio * 100)}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="pulse__chips">
              <span className="status-chip status-chip--amber">{release.shipWindow}</span>
              <span className="status-chip status-chip--rose">P0–P2 (manual)</span>
              <span className="status-chip status-chip--amber">
                {featureCount} features · {bugCount} bugs
              </span>
              <span className={`status-chip ${accepted ? 'status-chip--ready' : 'status-chip--rose'}`}>
                {statusHeadline}
              </span>
            </div>
          </div>
        </header>

        <section className="panel" aria-labelledby="platforms-title">
          <div className="panel__head">
            <h2 id="platforms-title">App platforms in scope</h2>
            <p>
              Manual checks multiply here. Shared codebases help shipping — they do not clear
              device risk or make a risky PR safe on every screen.
            </p>
          </div>
          <div className="platforms">
            {release.platforms.map((platform) => (
              <article key={platform.id} className="platform">
                <h3>{platform.name}</h3>
                <p className="platform__family">{platform.family}</p>
                <p>{platform.shareNote}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel" aria-labelledby="pillars-title">
          <div className="panel__head">
            <h2 id="pillars-title">Pillars in this release</h2>
            <p>Same fixed version. Different owners. One blast radius across platforms.</p>
          </div>
          <div className="pillars">
            {release.pillars.map((pillar) => (
              <article key={pillar.id} className="pillar">
                <div className="pillar__top">
                  <span className="pillar__short">{pillar.short}</span>
                  <span className="pillar__count">{pillar.ticketCount} tickets</span>
                </div>
                <h3>{pillar.name}</h3>
                <p>{pillar.focus}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="shell__board">
          <section className="panel" aria-labelledby="collision-title">
            <div className="panel__head">
              <h2 id="collision-title">Collision heat</h2>
              <p>Where pillars + platforms collide — including shared-code blind spots.</p>
            </div>
            <ul className="collisions">
              {release.collisions.map((item) => (
                <li key={item.id} className="collision">
                  <div className="collision__row">
                    <strong>{item.surface}</strong>
                    <span className={riskClass[item.severity]}>{item.severity}</span>
                  </div>
                  <div className="collision__pillars">
                    {item.pillars.map((id) => (
                      <span key={id} className="mini">
                        {pillarLabel[id]}
                      </span>
                    ))}
                  </div>
                  <p>{item.whyItMatters}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="panel panel--tickets" aria-labelledby="tickets-title">
            <div className="panel__head">
              <h2 id="tickets-title">Tagged tickets</h2>
              <p>
                Fixed-version scope (demo) — {featureCount} features, {bugCount} bugs. Fictional
                national news apps; no real brand.
              </p>
            </div>
            <ul className="tickets">
              {release.tickets.map((ticket) => (
                <li key={ticket.key} className="ticket">
                  <div className="ticket__row">
                    <code>{ticket.key}</code>
                    <span className={riskClass[ticket.risk]}>{ticket.risk}</span>
                  </div>
                  <p className="ticket__title">{ticket.title}</p>
                  <div className="ticket__meta">
                    <span className={kindClass[ticket.kind]}>{ticket.kind}</span>
                    <span className="mini">{pillarLabel[ticket.pillar]}</span>
                    {ticket.surfaces.map((surface) => (
                      <span key={surface} className="mini mini--soft">
                        {surface}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="panel" aria-labelledby="p0-title">
          <div className="panel__head">
            <h2 id="p0-title">Aimed P0–P2 (manual) slice</h2>
            <p>{release.fullLibraryNote}</p>
          </div>
          <div className="p0-grid">
            {release.p0p2Slice.map((item) => (
              <article key={item.id} className="p0">
                <h3>{item.title}</h3>
                <p className="p0__platform">{item.platform}</p>
                <p className="p0__reason">{item.reason}</p>
                <span className="partner-chip">via {partnerName[item.partner]}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="panel" aria-labelledby="stake-title">
          <div className="panel__head">
            <h2 id="stake-title">Stakeholder sign-off pack</h2>
            <p>
              QA publishes the risk picture across pillars and platforms. Product / DRI owns the
              go.
            </p>
          </div>
          <ul className="stake">
            {release.stakeholderItems.map((item) => (
              <li key={item.id}>
                <label className="stake__item">
                  <input
                    type="checkbox"
                    checked={!!checks[item.id]}
                    onChange={() => toggle(item.id)}
                  />
                  <span>
                    <strong>{item.label}</strong>
                    <em>{item.detail}</em>
                  </span>
                </label>
              </li>
            ))}
          </ul>
          <div className={`verdict ${accepted ? 'verdict--go' : 'verdict--hold'}`}>
            <strong>{accepted ? 'Residual risk accepted — clear to ship' : 'Hold — pack incomplete'}</strong>
            <p>{release.residualRisk}</p>
          </div>
        </section>

        <section className="panel" aria-labelledby="partners-title">
          <div className="panel__head">
            <h2 id="partners-title">How the toolkit fits</h2>
            <p>
              Radar aims the manual work. Partner tools help predict, generate, and evidence —
              they do not replace the P0–P2 (manual) picture on this board.
            </p>
          </div>
          <div className="partners">
            {partnerTools.map((tool) => (
              <a
                key={tool.id}
                className="partner"
                href={tool.url}
                target="_blank"
                rel="noreferrer"
              >
                <h3>{tool.name}</h3>
                <p>{tool.role}</p>
                <span>{tool.when}</span>
              </a>
            ))}
          </div>
        </section>

        <footer className="shell__footer">
          <p>
            Demo board for a fictional national news apps weekly release. No live Jira, production
            data, or real network branding. Automation coverage not counted in this problem frame.
          </p>
          <div className="shell__footer-credit">
            <span>Built by Ramona Bonitatis</span>
            <a href="https://github.com/ramonacraft" target="_blank" rel="noreferrer">
              github.com/ramonacraft
            </a>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App
