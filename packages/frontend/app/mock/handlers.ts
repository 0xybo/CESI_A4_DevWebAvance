import {
  USERS, DRIVERS, VEHICLES, CUSTOMERS, HUBS, MOCK,
  buildApiDelivery, buildApiDriver, buildApiUser,
  buildApiCustomer, buildApiHub, buildApiVehicle,
  buildApiParcel, buildApiInvoiceDetail, buildApiInvoice,
} from './data'

type MockResponse = { status: number; body: any; headers?: Record<string, string> }

export function handleRequest(method: string, pathname: string, body?: any, query?: Record<string, string>): MockResponse | null {
  const apiPath = pathname.replace(/^\/api/, '')

  // ── Auth ──────────────────────────────────────────────────────────────────

  if (apiPath === '/auth/login' && method === 'POST') {
    const { email, password } = body || {}
    const user = USERS.find(u => u.email === email)
    if (!user || password !== 'password') {
      return { status: 401, body: { message: 'Identifiants invalides' } }
    }
    const token = generateToken(user)
    return {
      status: 201,
      body: { access_token: token, refresh_token: token },
    }
  }

  if (apiPath === '/auth/me' && method === 'GET') {
    const user = getAuthUser()
    if (!user) return { status: 401, body: { message: 'Non authentifié' } }
    return { status: 200, body: authPayload(user) }
  }

  if (apiPath === '/auth/refresh' && method === 'POST') {
    const user = getAuthUser()
    if (!user) return { status: 401, body: { message: 'Token invalide' } }
    return { status: 200, body: { access_token: generateToken(user) } }
  }

  if (apiPath === '/auth/logout' && method === 'POST') {
    return { status: 200, body: { message: 'Déconnecté' } }
  }

  if (apiPath === '/auth/health' && method === 'GET') {
    return { status: 200, body: { status: 'ok', service: 'auth' } }
  }

  // ── Deliveries ────────────────────────────────────────────────────────────

  if (apiPath === '/deliveries' && method === 'GET') {
    let items = MOCK.deliveries.map(d => buildApiDelivery(d))
    if (query?.status) items = items.filter(d => d.status === query.status)
    const limit = parseInt(query?.limit || '200', 10)
    const page = parseInt(query?.page || '1', 10)
    const total = items.length
    const data = items.slice(0, limit)
    return { status: 200, body: { data, total, page, limit } }
  }

  const delPatchMatch = apiPath.match(/^\/deliveries\/(.+?)\/status$/)
  if (delPatchMatch && method === 'PATCH') {
    const delId = delPatchMatch[1]
    const delivery = MOCK.deliveries.find(d => d.id === delId)
    if (delivery) {
      delivery.status = body?.status ?? delivery.status
    }
    return { status: 200, body: { success: true } }
  }

  const deliveryById = apiPath.match(/^\/deliveries\/([^/]+)$/)
  if (deliveryById) {
    const delId = deliveryById[1]
    if (method === 'GET') {
      const delivery = MOCK.deliveries.find(d => d.id === delId)
      if (!delivery) return { status: 404, body: { message: 'Delivery not found' } }
      return { status: 200, body: buildApiDelivery(delivery) }
    }
    if (method === 'PATCH') {
      const delivery = MOCK.deliveries.find(d => d.id === delId)
      if (delivery && body?.driver_id) {
        delivery.driver_id = body.driver_id
      }
      return { status: 200, body: { success: true } }
    }
  }

  const delEventsMatch = apiPath.match(/^\/deliveries\/(.+?)\/events$/)
  if (delEventsMatch && method === 'POST') {
    return { status: 201, body: { id: `evt-${Date.now()}`, ...body, created_at: new Date().toISOString() } }
  }

  // ── Drivers ───────────────────────────────────────────────────────────────

  const driverDeliveries = apiPath.match(/^\/drivers\/([^/]+)\/deliveries$/)
  if (driverDeliveries && method === 'GET') {
    const userId = driverDeliveries[1]
    const driver = DRIVERS.find(d => d.user_id === userId)
    if (!driver) return { status: 200, body: { deliveries: [] } }
    const items = MOCK.deliveries
      .filter(d => d.driver_id === driver.id)
      .map(d => ({ id: d.id, reference: d.reference, status: d.status }))
    return { status: 200, body: { deliveries: items } }
  }

  // ── Users ─────────────────────────────────────────────────────────────────

  if (apiPath === '/users' && method === 'GET') {
    const role = query?.role || body?.role
    let items = USERS.map(u => buildApiUser(u))
    if (role) items = items.filter(u => u.role === role)
    const limit = parseInt(query?.limit || '100', 10)
    const page = parseInt(query?.page || '1', 10)
    const total = items.length
    const data = items.slice(0, limit)
    return { status: 200, body: { data, total, page, limit } }
  }

  const userDriver = apiPath.match(/^\/users\/([^/]+)\/driver$/)
  if (userDriver && method === 'GET') {
    const userId = userDriver[1]
    const driver = DRIVERS.find(d => d.user_id === userId)
    if (!driver) return { status: 404, body: { message: 'Driver not found' } }
    return { status: 200, body: buildApiDriver(driver) }
  }

  const userById = apiPath.match(/^\/users\/([^/]+)$/)
  if (userById && method === 'GET') {
    const userId = userById[1]
    const user = USERS.find(u => u.id === userId)
    if (!user) return { status: 404, body: { message: 'User not found' } }
    return { status: 200, body: buildApiUser(user) }
  }

  // ── Invoices ──────────────────────────────────────────────────────────────

  if (apiPath === '/invoices' && method === 'GET') {
    let items = MOCK.invoices.map(inv => buildApiInvoice(inv))
    if (query?.status) items = items.filter(i => i.status === query.status)
    const limit = parseInt(query?.limit || '100', 10)
    const page = parseInt(query?.page || '1', 10)
    const total = items.length
    const data = items.slice(0, limit)
    return { status: 200, body: { data, total, page, limit } }
  }

  const invoiceById = apiPath.match(/^\/invoices\/([^/]+)$/)
  if (invoiceById && method === 'GET') {
    const invId = invoiceById[1]
    const inv = MOCK.invoices.find(i => i.id === invId)
    if (!inv) return { status: 404, body: { message: 'Invoice not found' } }
    return { status: 200, body: buildApiInvoiceDetail(inv) }
  }

  // ── Customers ─────────────────────────────────────────────────────────────

  if (apiPath === '/customers' && method === 'GET') {
    return { status: 200, body: CUSTOMERS.map(c => buildApiCustomer(c)) }
  }

  // ── Hubs ──────────────────────────────────────────────────────────────────

  if (apiPath === '/hubs' && method === 'GET') {
    return { status: 200, body: HUBS.map(h => buildApiHub(h)) }
  }

  // ── Vehicles ──────────────────────────────────────────────────────────────

  if (apiPath === '/vehicles' && method === 'GET') {
    return { status: 200, body: VEHICLES.map(v => buildApiVehicle(v)) }
  }

  // ── Parcels ───────────────────────────────────────────────────────────────

  if (apiPath === '/parcels' && method === 'GET') {
    const items = MOCK.parcels.map(p => buildApiParcel(p))
    const limit = parseInt(query?.limit || '200', 10)
    const page = parseInt(query?.page || '1', 10)
    const total = items.length
    const data = items.slice(0, limit)
    return { status: 200, body: { data, total, page, limit } }
  }

  // ── AI ────────────────────────────────────────────────────────────────────

  if (apiPath === '/ai/notifications' && method === 'GET') {
    return {
      status: 200,
      body: {
        notifications: [
          {
            id: 'notif-001',
            delivery_id: 'del-001',
            summary: 'Retard signalé sur la livraison DEL-001',
            severity: 'HIGH',
            read: false,
            created_at: new Date().toISOString(),
          },
          {
            id: 'notif-002',
            delivery_id: 'del-005',
            summary: 'Incident : colis endommagé signalé par le chauffeur',
            severity: 'CRITICAL',
            read: false,
            created_at: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: 'notif-003',
            delivery_id: 'del-012',
            summary: 'Livraison DEL-012 marquée comme livrée',
            severity: 'INFO',
            read: true,
            created_at: new Date(Date.now() - 7200000).toISOString(),
          },
        ],
        unread_count: 2,
      },
    }
  }

  const notifRead = apiPath.match(/^\/ai\/notifications\/([^/]+)\/read$/)
  if (notifRead && method === 'POST') {
    return { status: 200, body: { success: true } }
  }

  if (apiPath === '/ai/process' && method === 'POST') {
    const text = body?.text || ''
    return {
      status: 200,
      body: {
        type: 'answer',
        answer: `J'ai bien noté votre message : "${text}". ${
          text.toLowerCase().includes('incident') || text.toLowerCase().includes('problème')
            ? "Un incident a été créé et sera traité par le dispatcher."
            : "Je reste à votre disposition pour toute question."
        }`,
        incident: text.toLowerCase().includes('incident') ? {
          id: `inc-${Date.now()}`,
          severity: 'HIGH',
          summary: text,
          notified: true,
        } : undefined,
      },
    }
  }

  // ── Events (SSE mock — used by polling fallback) ──────────────────────────

  if (apiPath.startsWith('/events') && method === 'GET') {
    return { status: 200, body: { type: 'connected', message: 'SSE mock connected' } }
  }

  // ── Gateway health ────────────────────────────────────────────────────────

  if (apiPath === '/gateway/health' && method === 'GET') {
    return { status: 200, body: { status: 'ok', service: 'gateway' } }
  }

  if (apiPath === '/billing/health' && method === 'GET') {
    return { status: 200, body: { status: 'ok', service: 'billing' } }
  }

  if (apiPath === '/stock/health' && method === 'GET') {
    return { status: 200, body: { status: 'ok', service: 'stock' } }
  }

  if (apiPath === '/delivery/health' && method === 'GET') {
    return { status: 200, body: { status: 'ok', service: 'delivery' } }
  }

  if (apiPath === '/users/health' && method === 'GET') {
    return { status: 200, body: { status: 'ok', service: 'users' } }
  }

  // ── Logs ──────────────────────────────────────────────────────────────────

  if (apiPath.startsWith('/logs/frontend') && method === 'POST') {
    return { status: 201, body: { success: true } }
  }

  if (apiPath === '/debug/logs/frontend' && method === 'GET') {
    return { status: 200, body: { logs: [], total: 0, page: 1, totalPages: 1 } }
  }

  if (apiPath === '/debug/logs/backend' && method === 'GET') {
    return { status: 200, body: { logs: [], total: 0, page: 1, totalPages: 1 } }
  }

  if ((apiPath === '/debug/logs/frontend' || apiPath === '/debug/logs/backend') && method === 'DELETE') {
    return { status: 200, body: { success: true } }
  }

  // ── Debug stores ──────────────────────────────────────────────────────────

  if (apiPath === '/debug/postgresql' && method === 'POST') {
    return { status: 200, body: { rows: [{ message: 'Requête PostgreSQL simulée' }], fields: [], rowCount: 0 } }
  }

  if (apiPath === '/debug/postgresql/tables' && method === 'GET') {
    return { status: 200, body: { tables: ['users', 'deliveries', 'invoices', 'customers', 'hubs', 'vehicles', 'parcels'] } }
  }

  const pgTableMatch = apiPath.match(/^\/debug\/postgresql\/tables\/([^/]+)\/data$/)
  if (pgTableMatch && method === 'POST') {
    return { status: 200, body: { rows: [], total: 0, page: 1 } }
  }

  if (apiPath === '/debug/redis' && method === 'POST') {
    return { status: 200, body: { result: 'OK', command: body?.command } }
  }

  if (apiPath === '/debug/rabbitmq/queues' && method === 'GET') {
    return { status: 200, body: { queues: [] } }
  }

  const rmqMatch = apiPath.match(/^\/debug\/rabbitmq\/queues\/([^/]+)\/messages$/)
  if (rmqMatch && method === 'POST') {
    return { status: 200, body: { messages: [] } }
  }

  if (apiPath === '/debug/mongodb' && method === 'POST') {
    return { status: 200, body: { result: [{ message: 'Requête MongoDB simulée' }] } }
  }

  if (apiPath === '/debug/mongodb/collections' && method === 'GET') {
    return { status: 200, body: { collections: ['users', 'deliveries', 'events'] } }
  }

  const mongoCollMatch = apiPath.match(/^\/debug\/mongodb\/collections\/([^/]+)\/data$/)
  if (mongoCollMatch && method === 'POST') {
    return { status: 200, body: { data: [], total: 0, page: 1 } }
  }

  return null
}

// ── Auth helpers ──────────────────────────────────────────────────────────────

function generateToken(user: typeof USERS[number]): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = btoa(JSON.stringify({
    sub: user.id,
    email: user.email,
    role: user.role,
    firstname: user.firstname,
    lastname: user.lastname,
    hub_id: user.hub_id,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400,
  }))
  return `${header}.${payload}.fake-signature`
}

function authPayload(user: typeof USERS[number]) {
  return { sub: user.id, email: user.email, role: user.role, firstname: user.firstname, lastname: user.lastname }
}

function getAuthUser() {
  if (typeof window === 'undefined') return null
  try {
    const token = localStorage.getItem('access_token')
    if (!token) return null
    const payload = JSON.parse(atob(token.split('.')[1]))
    const user = USERS.find(u => u.id === payload.sub)
    return user || null
  } catch {
    return null
  }
}
