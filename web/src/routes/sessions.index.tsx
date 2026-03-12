import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { SessionList } from '../components/sessions/SessionList'
import { useControlSurface } from '../hooks/use-control-surface'

export const Route = createFileRoute('/sessions/')({
  component: SessionsIndexPage,
})

function SessionsIndexPage() {
  const { apiClient } = useControlSurface()

  const sessionsQuery = useQuery({
    queryKey: ['sessions'],
    queryFn: () => apiClient.listSessions(),
    refetchInterval: 10_000,
  })

  if (sessionsQuery.isPending) {
    return <p className="muted">Loading sessions…</p>
  }

  if (sessionsQuery.isError) {
    return <p className="error-text">Failed to load sessions.</p>
  }

  return (
    <div className="stack gap-md">
      <SessionList
        description="Status, task, worktree context, and transcript locations for each Claude Code session."
        items={sessionsQuery.data.items}
        title="Claude Code sessions"
      />
    </div>
  )
}
