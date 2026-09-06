import { FormEvent, useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

type Item = {
  code: string
  order: string
  description: string
}

type EventResult = 'accepted' | 'duplicate' | 'foreign' | 'invalid' | 'not_found' | 'synced'

type ScanEvent = {
  id: string
  code: string
  result: EventResult
  message: string
  at: string
  offline?: boolean
}

const MANIFEST_NUMBER = 'ROM-2026-001'
const STORAGE_KEY = 'portfolio-loading-demo-v1'

const ITEMS: Item[] = Array.from({ length: 10 }, (_, index) => ({
  code: `P000001-${String(index + 1).padStart(3, '0')}`,
  order: index < 5 ? 'PED-DEMO-001' : 'PED-DEMO-002',
  description: index % 3 === 0 ? 'Peça temperada 8 mm' : index % 3 === 1 ? 'Peça temperada 10 mm' : 'Peça temperada 6 mm',
}))

const FOREIGN_CODES = new Set(['P000002-001', 'P000002-002'])

function normalizeCode(value: string) {
  return value.trim().toUpperCase().replaceAll(' ', '')
}

function now() {
  return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function loadState(): { accepted: string[]; events: ScanEvent[]; queue: string[] } {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
    return {
      accepted: Array.isArray(parsed.accepted) ? parsed.accepted : [],
      events: Array.isArray(parsed.events) ? parsed.events : [],
      queue: Array.isArray(parsed.queue) ? parsed.queue : [],
    }
  } catch {
    return { accepted: [], events: [], queue: [] }
  }
}

function App() {
  const initial = useMemo(loadState, [])
  const [accepted, setAccepted] = useState<string[]>(initial.accepted)
  const [events, setEvents] = useState<ScanEvent[]>(initial.events)
  const [queue, setQueue] = useState<string[]>(initial.queue)
  const [scan, setScan] = useState('')
  const [tab, setTab] = useState<'pending' | 'read' | 'all'>('pending')
  const [offline, setOffline] = useState(false)
  const [finished, setFinished] = useState(false)
  const [notice, setNotice] = useState<{ type: 'success' | 'warning' | 'error' | 'info'; text: string }>({
    type: 'info',
    text: 'Demo pronta. Leia ou digite uma etiqueta fictícia.',
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ accepted, events, queue }))
  }, [accepted, events, queue])

  const acceptedSet = useMemo(() => new Set(accepted), [accepted])
  const pending = ITEMS.filter((item) => !acceptedSet.has(item.code))
  const read = ITEMS.filter((item) => acceptedSet.has(item.code))
  const visible = tab === 'pending' ? pending : tab === 'read' ? read : ITEMS
  const progress = Math.round((accepted.length / ITEMS.length) * 100)

  function addEvent(code: string, result: EventResult, message: string, wasOffline = false) {
    setEvents((current) => [
      { id: crypto.randomUUID(), code, result, message, at: now(), offline: wasOffline },
      ...current,
    ].slice(0, 30))
  }

  function applyScan(raw: string) {
    const code = normalizeCode(raw)

    if (!/^P\d{6}-\d{3}$/.test(code)) {
      setNotice({ type: 'warning', text: 'Etiqueta inválida. Use o formato P000000-000.' })
      addEvent(code || '—', 'invalid', 'Formato de etiqueta inválido')
      return
    }

    if (FOREIGN_CODES.has(code)) {
      setNotice({ type: 'error', text: 'Esta peça pertence a outro romaneio.' })
      addEvent(code, 'foreign', 'Peça de outro romaneio')
      return
    }

    const item = ITEMS.find((candidate) => candidate.code === code)
    if (!item) {
      setNotice({ type: 'error', text: 'Peça não encontrada neste romaneio.' })
      addEvent(code, 'not_found', 'Peça não encontrada')
      return
    }

    if (acceptedSet.has(code)) {
      setNotice({ type: 'warning', text: 'Esta peça já foi conferida.' })
      addEvent(code, 'duplicate', 'Leitura duplicada')
      return
    }

    setAccepted((current) => [...current, code])
    setNotice({
      type: offline ? 'warning' : 'success',
      text: offline ? 'Sem conexão simulada: leitura salva localmente para sincronização.' : 'Peça conferida com sucesso.',
    })
    addEvent(code, 'accepted', offline ? 'Aceita localmente; aguardando sincronização' : 'Peça conferida', offline)

    if (offline) setQueue((current) => [...current, code])
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    if (!scan.trim()) return
    applyScan(scan)
    setScan('')
  }

  function toggleConnection() {
    if (offline) {
      const queued = [...queue]
      setOffline(false)
      setQueue([])
      if (queued.length) {
        queued.forEach((code) => addEvent(code, 'synced', 'Leitura offline sincronizada'))
        setNotice({ type: 'success', text: `${queued.length} leitura(s) offline sincronizada(s).` })
      } else {
        setNotice({ type: 'info', text: 'Conexão restaurada.' })
      }
    } else {
      setOffline(true)
      setNotice({ type: 'warning', text: 'Modo offline simulado ativado.' })
    }
  }

  function resetDemo() {
    setAccepted([])
    setEvents([])
    setQueue([])
    setFinished(false)
    setOffline(false)
    setTab('pending')
    setNotice({ type: 'info', text: 'Demonstração reiniciada.' })
    localStorage.removeItem(STORAGE_KEY)
  }

  function finishLoading() {
    if (pending.length) {
      setNotice({ type: 'warning', text: `Ainda existem ${pending.length} peça(s) pendente(s).` })
      return
    }
    setFinished(true)
    setNotice({ type: 'success', text: 'Carregamento finalizado com todas as peças conferidas.' })
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">MC</div>
          <div>
            <strong>Conferência de Carregamento</strong>
            <span>Projeto demonstrativo de portfólio</span>
          </div>
        </div>
        <div className="top-actions">
          <span className={`connection ${offline ? 'offline' : 'online'}`}>{offline ? '● Offline simulado' : '● Online'}</span>
          <button className="button ghost" onClick={toggleConnection}>{offline ? 'Restaurar conexão' : 'Simular offline'}</button>
        </div>
      </header>

      <main className="container">
        <section className="hero-card">
          <div>
            <p className="eyebrow">ROMANEIO ATIVO</p>
            <h1>{MANIFEST_NUMBER}</h1>
            <p className="muted">Rota demonstrativa • Dados 100% fictícios • 10 peças previstas</p>
          </div>
          <div className="status-chip">{finished ? 'Finalizado' : 'Em conferência'}</div>
        </section>

        <section className="metrics">
          <article><span>Progresso</span><strong>{progress}%</strong><div className="progress"><i style={{ width: `${progress}%` }} /></div></article>
          <article><span>Pendentes</span><strong>{pending.length}</strong><small>de {ITEMS.length}</small></article>
          <article><span>Conferidas</span><strong>{read.length}</strong><small>peças</small></article>
          <article><span>Fila offline</span><strong>{queue.length}</strong><small>aguardando sync</small></article>
        </section>

        <section className="grid-main">
          <div className="panel scanner-panel">
            <div className="panel-heading">
              <div><p className="eyebrow">LEITURA</p><h2>Conferir etiqueta</h2></div>
              <span className="format">P000000-000</span>
            </div>

            <form onSubmit={submit} className="scan-form">
              <input autoFocus value={scan} onChange={(event) => setScan(event.target.value)} placeholder="Digite uma etiqueta fictícia" aria-label="Código da etiqueta" />
              <button className="button primary">Conferir</button>
            </form>

            <div className={`notice ${notice.type}`}>{notice.text}</div>

            <div className="test-codes">
              <span>Códigos rápidos para testar:</span>
              <button onClick={() => applyScan('P000001-001')}>Correta</button>
              <button onClick={() => applyScan('P000001-001')}>Duplicada</button>
              <button onClick={() => applyScan('P000002-001')}>Outro romaneio</button>
              <button onClick={() => applyScan('ABC-123')}>Inválida</button>
            </div>
          </div>

          <aside className="panel architecture">
            <p className="eyebrow">ARQUITETURA DA DEMO</p>
            <h2>Fluxo simplificado</h2>
            <div className="flow">
              <span>Operador</span><b>↓</b><span>React + TypeScript</span><b>↓</b><span>Mock API / LocalStorage</span><b>↓</b><span>Dados fictícios</span>
            </div>
            <p className="muted small">A versão pública não se conecta a sistemas, redes ou bancos internos da empresa.</p>
          </aside>
        </section>

        <section className="panel items-panel">
          <div className="panel-heading responsive-heading">
            <div><p className="eyebrow">PEÇAS DO ROMANEIO</p><h2>Acompanhamento da carga</h2></div>
            <div className="tabs">
              <button className={tab === 'pending' ? 'active' : ''} onClick={() => setTab('pending')}>Pendentes ({pending.length})</button>
              <button className={tab === 'read' ? 'active' : ''} onClick={() => setTab('read')}>Lidas ({read.length})</button>
              <button className={tab === 'all' ? 'active' : ''} onClick={() => setTab('all')}>Todas ({ITEMS.length})</button>
            </div>
          </div>

          <div className="table-wrap">
            <table>
              <thead><tr><th>Etiqueta</th><th>Pedido</th><th>Descrição</th><th>Status</th></tr></thead>
              <tbody>
                {visible.map((item) => {
                  const isRead = acceptedSet.has(item.code)
                  return <tr key={item.code}>
                    <td><code>{item.code}</code></td>
                    <td>{item.order}</td>
                    <td>{item.description}</td>
                    <td><span className={`item-status ${isRead ? 'read' : 'pending'}`}>{isRead ? '✓ Conferida' : '• Pendente'}</span></td>
                  </tr>
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid-bottom">
          <div className="panel history">
            <div className="panel-heading"><div><p className="eyebrow">AUDITORIA</p><h2>Últimas leituras</h2></div></div>
            {events.length === 0 ? <p className="empty">Nenhuma leitura registrada ainda.</p> : (
              <div className="events">
                {events.slice(0, 8).map((event) => <div className="event" key={event.id}>
                  <div><strong>{event.code}</strong><span>{event.message}{event.offline ? ' • offline' : ''}</span></div>
                  <time>{event.at}</time>
                </div>)}
              </div>
            )}
          </div>

          <div className="panel final-panel">
            <p className="eyebrow">CONTROLE DE CARGA</p>
            <h2>{finished ? 'Carga finalizada' : 'Pronto para finalizar?'}</h2>
            <p className="muted">A regra de negócio impede a finalização enquanto existirem peças pendentes.</p>
            <button className="button primary full" disabled={pending.length > 0 || finished} onClick={finishLoading}>
              {finished ? 'Carregamento finalizado' : pending.length ? `Faltam ${pending.length} peça(s)` : 'Finalizar carregamento'}
            </button>
            <button className="button ghost full" onClick={resetDemo}>Reiniciar demonstração</button>
          </div>
        </section>

        <footer>
          <strong>Marcel Lourenço</strong> • Projeto de estudo e portfólio • Nenhum dado real é utilizado nesta demonstração.
        </footer>
      </main>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
