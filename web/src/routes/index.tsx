import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ChatPanel } from '../components/chat/ChatPanel'
import { WhatsAppControls } from '../components/runtime/WhatsAppControls'
import { SessionList } from '../components/sessions/SessionList'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { useControlSurface } from '../hooks/use-control-surface'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [{ title: 'Autonoma Dashboard' }],
  }),
  component: DashboardPage,
})

function DashboardPage() {
  const { apiClient } = useControlSurface()

  const statusQuery = useQuery({
    queryKey: ['status'],
    queryFn: () => apiClient.getStatus(),
    refetchInterval: 5_000,
  })

  const sessionsQuery = useQuery({
    queryKey: ['sessions'],
    queryFn: () => apiClient.listSessions(),
    refetchInterval: 10_000,
  })

  return (
    <div className="dashboard-grid">
      <div className="stack gap-md">
        <ChatPanel />
      </div>

      <div className="stack gap-md">
        <WhatsAppControls status={statusQuery.data} />

        <Card>
          <CardHeader>
            <div className="row row-between gap-sm wrap align-start">
              <div>
                <CardTitle>Session overview</CardTitle>
                <CardDescription>Lightly polled list from GET /api/sessions.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {sessionsQuery.data ? (
              <SessionList
                description=""
                items={sessionsQuery.data.items.slice(0, 5)}
                title="Latest sessions"
              />
            ) : (
              <p className="muted">Loading sessions…</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
