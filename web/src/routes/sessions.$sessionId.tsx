import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { SessionDetail } from '../components/sessions/SessionDetail'
import { SessionList } from '../components/sessions/SessionList'
import { TranscriptViewer } from '../components/sessions/TranscriptViewer'
import { useControlSurface } from '../hooks/use-control-surface'

export const Route = createFileRoute('/sessions/$sessionId')({
  component: SessionDetailPage,
})

function SessionDetailPage() {
  const { sessionId } = Route.useParams()
  const { apiClient } = useControlSurface()

  const sessionsQuery = useQuery({
    queryKey: ['sessions'],
    queryFn: () => apiClient.listSessions(),
    refetchInterval: 10_000,
  })

  const detailQuery = useQuery({
    queryKey: ['session', sessionId],
    queryFn: () => apiClient.getSessionDetail(sessionId),
    refetchInterval: 10_000,
  })

  return (
    <div className="detail-layout">
      <aside className="stack gap-md">
        {sessionsQuery.data ? (
          <SessionList
            description="Select a session to inspect transcript chunks and send direct messages."
            items={sessionsQuery.data.items}
            selectedSessionId={sessionId}
            title="All sessions"
          />
        ) : (
          <p className="muted">Loading session list…</p>
        )}
      </aside>
      <section className="stack gap-md">
        {detailQuery.isPending ? <p className="muted">Loading session detail…</p> : null}
        {detailQuery.isError ? <p className="error-text">Failed to load session detail.</p> : null}
        {detailQuery.data ? <SessionDetail session={detailQuery.data.session} tmux={detailQuery.data.tmux} /> : null}
        <TranscriptViewer sessionId={sessionId} />
      </section>
    </div>
  )
}
