import { handleRequest } from '~/mock/handlers'

/**
 * Nuxt client plugin that intercepts all /api/* HTTP requests and
 * returns mock data instead of calling the real backend.
 *
 * This plugin also:
 *  - Syncs auth tokens between localStorage (mock) and cookies (legacy code)
 *  - Mocks EventSource to prevent SSE connection errors
 */
export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  // ── Sync token from localStorage → cookie on page load ────────────────────

  const savedToken = localStorage.getItem('access_token')
  if (savedToken) {
    document.cookie = `access_token=${savedToken}; path=/; max-age=86400; SameSite=Lax`
  }

  // ── Intercept fetch ───────────────────────────────────────────────────────

  const originalFetch = globalThis.fetch.bind(globalThis)

  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
    const method = (init?.method || (typeof input !== 'string' && 'method' in input ? (input as Request).method : undefined) || 'GET').toUpperCase()
    const pathname = new URL(url, window.location.origin).pathname

    // Only intercept /api/ calls
    if (!pathname.startsWith('/api/')) {
      return originalFetch(input, init)
    }

    const searchParams = new URL(url, window.location.origin).searchParams
    const query: Record<string, string> = {}
    searchParams.forEach((value, key) => { query[key] = value })

    let body: any = undefined
    if (init?.body) {
      try {
        body = JSON.parse(init.body as string)
      } catch {
        body = init.body
      }
    }

    const response = handleRequest(method, pathname, body, query)

    if (response) {
      // Handle auth token storage
      if (pathname === '/api/auth/login' && response.status === 201 && response.body?.access_token) {
        const token = response.body.access_token
        localStorage.setItem('access_token', token)
        document.cookie = `access_token=${token}; path=/; max-age=86400; SameSite=Lax`
      }
      if (pathname === '/api/auth/logout') {
        localStorage.removeItem('access_token')
        document.cookie = 'access_token=; path=/; max-age=0'
      }

      return new Response(JSON.stringify(response.body), {
        status: response.status,
        headers: {
          'content-type': 'application/json',
          ...response.headers,
        },
      })
    }

    // Fallback to real fetch for non-mocked routes
    return originalFetch(input, init)
  }

  // ── Mock EventSource (SSE) ────────────────────────────────────────────────

  const OriginalEventSource = globalThis.EventSource

  // @ts-expect-error - we mock the constructor
  globalThis.EventSource = class MockEventSource {
    url: string
    withCredentials: boolean
    readyState: number = 0
    onopen: ((event: Event) => void) | null = null
    onmessage: ((event: MessageEvent) => void) | null = null
    onerror: ((event: Event) => void) | null = null
    private listeners: Map<string, Set<EventListener>> = new Map()
    private timer: ReturnType<typeof setInterval> | null = null

    static CONNECTING = 0
    static OPEN = 1
    static CLOSED = 2

    constructor(url: string | URL, eventSourceInitDict?: EventSourceInit) {
      this.url = String(url)
      this.withCredentials = eventSourceInitDict?.withCredentials ?? false

      // Simulate immediate connection, then periodically emit mock events
      setTimeout(() => {
        this.readyState = 1
        this.onopen?.(new Event('open'))
        this.dispatchEvent(new MessageEvent('message', { data: JSON.stringify({ type: 'connected' }) }))
      }, 100)

      this.timer = setInterval(() => {
        if (this.readyState === 2) return
        const events = ['delivery:status', 'delivery:assigned', 'delivery:incident', 'delivery:overdue', 'position:update']
        const event = events[Math.floor(Math.random() * events.length)]
        const data = JSON.stringify({
          type: event,
          deliveryId: `del-${String(Math.floor(Math.random() * 30) + 1).padStart(3, '0')}`,
          timestamp: new Date().toISOString(),
        })
        this.dispatchEvent(new MessageEvent(event, { data }))
      }, 30000)
    }

    addEventListener(type: string, listener: EventListener) {
      if (!this.listeners.has(type)) this.listeners.set(type, new Set())
      this.listeners.get(type)!.add(listener)
    }

    removeEventListener(type: string, listener: EventListener) {
      this.listeners.get(type)?.delete(listener)
    }

    dispatchEvent(event: Event): boolean {
      const type = event.type
      this.listeners.get(type)?.forEach(l => l(event))
      if (type === 'message') this.onmessage?.(event as MessageEvent)
      if (type === 'error') this.onerror?.(event as Event)
      return true
    }

    close() {
      this.readyState = 2
      if (this.timer) clearInterval(this.timer)
    }
  }
})
