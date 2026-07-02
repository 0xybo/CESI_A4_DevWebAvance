export const FRENCH_CITIES = [
  { name: 'Paris', postalCode: '75001' },
  { name: 'Paris', postalCode: '75011' },
  { name: 'Paris', postalCode: '75015' },
  { name: 'Lyon', postalCode: '69001' },
  { name: 'Lyon', postalCode: '69003' },
  { name: 'Lyon', postalCode: '69007' },
  { name: 'Marseille', postalCode: '13001' },
  { name: 'Marseille', postalCode: '13006' },
  { name: 'Lille', postalCode: '59000' },
  { name: 'Bordeaux', postalCode: '33000' },
  { name: 'Toulouse', postalCode: '31000' },
  { name: 'Nantes', postalCode: '44000' },
  { name: 'Strasbourg', postalCode: '67000' },
  { name: 'Montpellier', postalCode: '34000' },
  { name: 'Rennes', postalCode: '35000' },
  { name: 'Nice', postalCode: '06000' },
]

export const FRENCH_STREETS = [
  'Rue de la Paix', 'Avenue des Champs-Élysées', 'Boulevard Saint-Germain',
  'Rue du Faubourg Saint-Honoré', 'Place de la République', 'Cours Mirabeau',
  'Rue de la République', 'Avenue Jean Jaurès', 'Place Bellecour',
  'Boulevard Haussmann', 'Rue Victor Hugo', 'Avenue de la Libération',
  'Rue Gambetta', 'Boulevard Voltaire', 'Rue Nationale',
  'Rue de Rivoli', 'Place de la Bastille', 'Boulevard de Sébastopol',
]

export const FRENCH_COMPANIES = [
  'SARL Dupont Logistique', 'SuperMarché Express', 'Boulangerie Artisanale',
  'Clinique Saint-Joseph', 'Mairie de Lyon', 'Restaurant Le Gourmet',
  'Librairie du Centre', 'Garage Mécanique Moderne', 'École Primaire Saint-Exupéry',
  'Quincaillerie du Midi', 'Fromagerie Beaufort & Fils', 'Coiffure & Esthétique Laura',
  'Pharmacie de la Gare', 'CHU de Bordeaux', 'Pressing Minute',
  'Cave des Sommeliers', 'Hôtel de la Plage', 'Bureau de Tabac du Marché',
  'Fleuriste Artémis', 'SARL Martin Transport', 'Décathlon — Logistique Sud',
]

export const HUBS = [
  { id: 'hub-001', reference: 'HUB-001', name: 'Hub Paris-Nord', city: 'Paris', capacity: 2000, phone: '+33 1 42 00 11 22', status: 'active', address: '45 Boulevard Haussmann, 75009 Paris' },
  { id: 'hub-002', reference: 'HUB-002', name: 'Hub Lyon-Est', city: 'Lyon', capacity: 1200, phone: '+33 4 72 00 33 44', status: 'active', address: '12 Cours Mirabeau, 69001 Lyon' },
  { id: 'hub-003', reference: 'HUB-003', name: 'Hub Marseille-Sud', city: 'Marseille', capacity: 1000, phone: '+33 4 91 00 55 66', status: 'active', address: '8 Rue de la République, 13001 Marseille' },
  { id: 'hub-004', reference: 'HUB-004', name: 'Hub Lille-Nord', city: 'Lille', capacity: 800, phone: '+33 3 20 00 77 88', status: 'active', address: '3 Place de la République, 59000 Lille' },
  { id: 'hub-005', reference: 'HUB-005', name: 'Hub Bordeaux-Ouest', city: 'Bordeaux', capacity: 900, phone: '+33 5 56 00 99 00', status: 'active', address: '20 Rue Gambetta, 33000 Bordeaux' },
]

export const USERS = [
  { id: 'user-001', reference: 'USR-001', firstname: 'Admin', lastname: 'Transvirex', email: 'admin@transvirex.com', role: 'admin', hub_id: 'hub-001', phone: '+33 6 01 02 03 04', status: 'active' },
  { id: 'user-002', reference: 'USR-002', firstname: 'Jean', lastname: 'Dupont', email: 'dispatcher@transvirex.com', role: 'dispatcher', hub_id: 'hub-001', phone: '+33 6 11 22 33 44', status: 'active' },
  { id: 'user-003', reference: 'USR-003', firstname: 'Pierre', lastname: 'Martin', email: 'driver@transvirex.com', role: 'driver', hub_id: 'hub-002', phone: '+33 6 22 33 44 55', status: 'active' },
  { id: 'user-004', reference: 'USR-004', firstname: 'Sophie', lastname: 'Bernard', email: 'billing@transvirex.com', role: 'business_manager', hub_id: 'hub-001', phone: '+33 6 33 44 55 66', status: 'active' },
  { id: 'user-005', reference: 'USR-005', firstname: 'Michel', lastname: 'Lefebvre', email: 'michel.lefebvre@transvirex.com', role: 'driver', hub_id: 'hub-001', phone: '+33 6 44 55 66 77', status: 'active' },
  { id: 'user-006', reference: 'USR-006', firstname: 'Camille', lastname: 'Dubois', email: 'camille.dubois@transvirex.com', role: 'driver', hub_id: 'hub-002', phone: '+33 6 55 66 77 88', status: 'active' },
  { id: 'user-007', reference: 'USR-007', firstname: 'Lucas', lastname: 'Moreau', email: 'lucas.moreau@transvirex.com', role: 'driver', hub_id: 'hub-003', phone: '+33 6 66 77 88 99', status: 'active' },
  { id: 'user-008', reference: 'USR-008', firstname: 'Julie', lastname: 'Petit', email: 'julie.petit@transvirex.com', role: 'dispatcher', hub_id: 'hub-002', phone: '+33 6 77 88 99 00', status: 'active' },
  { id: 'user-009', reference: 'USR-009', firstname: 'Thomas', lastname: 'Robert', email: 'thomas.robert@transvirex.com', role: 'business_manager', hub_id: 'hub-003', phone: '+33 6 88 99 00 11', status: 'active' },
  { id: 'user-010', reference: 'USR-010', firstname: 'Nathalie', lastname: 'Richard', email: 'nathalie.richard@transvirex.com', role: 'driver', hub_id: 'hub-004', phone: '+33 6 99 00 11 22', status: 'active' },
]

export const VEHICLES = [
  { id: 'veh-001', reference: 'VEH-001', type: 'van', license_plate: 'AB-123-CD', status: 'available', hub_id: 'hub-001' },
  { id: 'veh-002', reference: 'VEH-002', type: 'truck', license_plate: 'EF-456-GH', status: 'assigned', hub_id: 'hub-001' },
  { id: 'veh-003', reference: 'VEH-003', type: 'refrigerated', license_plate: 'IJ-789-KL', status: 'available', hub_id: 'hub-002' },
  { id: 'veh-004', reference: 'VEH-004', type: 'van', license_plate: 'MN-012-OP', status: 'assigned', hub_id: 'hub-002' },
  { id: 'veh-005', reference: 'VEH-005', type: 'flatbed', license_plate: 'QR-345-ST', status: 'in_maintenance', hub_id: 'hub-003' },
  { id: 'veh-006', reference: 'VEH-006', type: 'box', license_plate: 'UV-678-WX', status: 'available', hub_id: 'hub-003' },
  { id: 'veh-007', reference: 'VEH-007', type: 'van', license_plate: 'YZ-901-AB', status: 'assigned', hub_id: 'hub-004' },
  { id: 'veh-008', reference: 'VEH-008', type: 'truck', license_plate: 'CD-234-EF', status: 'available', hub_id: 'hub-004' },
  { id: 'veh-009', reference: 'VEH-009', type: 'refrigerated', license_plate: 'GH-567-IJ', status: 'available', hub_id: 'hub-005' },
  { id: 'veh-010', reference: 'VEH-010', type: 'van', license_plate: 'KL-890-MN', status: 'in_maintenance', hub_id: 'hub-005' },
]

export const DRIVERS = [
  { id: 'drv-001', reference: 'DRV-001', user_id: 'user-003', vehicle_id: 'veh-002', rating: 4.5 },
  { id: 'drv-002', reference: 'DRV-002', user_id: 'user-005', vehicle_id: 'veh-004', rating: 3.8 },
  { id: 'drv-003', reference: 'DRV-003', user_id: 'user-006', vehicle_id: 'veh-007', rating: 4.2 },
  { id: 'drv-004', reference: 'DRV-004', user_id: 'user-007', vehicle_id: 'veh-006', rating: 4.9 },
  { id: 'drv-005', reference: 'DRV-005', user_id: 'user-010', vehicle_id: 'veh-009', rating: 3.5 },
]

export const CUSTOMERS = [
  { id: 'cus-001', reference: 'CUS-001', customer_name: 'SARL Dupont Logistique', customer_type: 'company', contact_firstname: 'Marie', contact_lastname: 'Dupont', phone: '+33 6 12 34 56 78', email: 'contact@dupont-logistique.fr', status: 'active', hub_id: 'hub-001', address: '15 Rue de la Paix, 75001 Paris', city: 'Paris' },
  { id: 'cus-002', reference: 'CUS-002', customer_name: 'SuperMarché Express', customer_type: 'company', contact_firstname: 'Paul', contact_lastname: 'Durand', phone: '+33 6 23 45 67 89', email: 'p.durand@supermarche-express.fr', status: 'active', hub_id: 'hub-001', address: '42 Avenue Jean Jaurès, 75011 Paris', city: 'Paris' },
  { id: 'cus-003', reference: 'CUS-003', customer_name: 'Clinique Saint-Joseph', customer_type: 'company', contact_firstname: 'Catherine', contact_lastname: 'Leroy', phone: '+33 7 34 56 78 90', email: 'c.leroy@clinique-stjoseph.fr', status: 'active', hub_id: 'hub-002', address: '8 Cours Mirabeau, 69001 Lyon', city: 'Lyon' },
  { id: 'cus-004', reference: 'CUS-004', customer_name: 'Restaurant Le Gourmet', customer_type: 'company', contact_firstname: 'Antoine', contact_lastname: 'Girard', phone: '+33 6 45 67 89 01', email: 'antoine@legourmet.fr', status: 'active', hub_id: 'hub-002', address: '23 Rue Victor Hugo, 69003 Lyon', city: 'Lyon' },
  { id: 'cus-005', reference: 'CUS-005', customer_name: 'CHU de Bordeaux', customer_type: 'association', contact_firstname: 'Isabelle', contact_lastname: 'Morel', phone: '+33 7 56 78 90 12', email: 'i.morel@chu-bordeaux.fr', status: 'active', hub_id: 'hub-005', address: '1 Place de la République, 33000 Bordeaux', city: 'Bordeaux' },
  { id: 'cus-006', reference: 'CUS-006', customer_name: 'Pharmacie de la Gare', customer_type: 'individual', contact_firstname: 'Franck', contact_lastname: 'Fournier', phone: '+33 6 67 89 01 23', email: 'franck.fournier@pharmacie-gare.fr', status: 'active', hub_id: 'hub-003', address: '56 Rue Nationale, 13001 Marseille', city: 'Marseille' },
  { id: 'cus-007', reference: 'CUS-007', customer_name: 'Décathlon — Logistique Sud', customer_type: 'company', contact_firstname: 'David', contact_lastname: 'Lambert', phone: '+33 6 78 90 12 34', email: 'd.lambert@decathlon-sud.fr', status: 'active', hub_id: 'hub-003', address: '100 Avenue de la Grande Armée, 13008 Marseille', city: 'Marseille' },
  { id: 'cus-008', reference: 'CUS-008', customer_name: 'Mairie de Lyon', customer_type: 'association', contact_firstname: 'Sophie', contact_lastname: 'Blanc', phone: '+33 7 89 01 23 45', email: 'sophie.blanc@mairie-lyon.fr', status: 'active', hub_id: 'hub-002', address: '1 Place Bellecour, 69001 Lyon', city: 'Lyon' },
  { id: 'cus-009', reference: 'CUS-009', customer_name: 'Boulangerie Artisanale', customer_type: 'individual', contact_firstname: 'Jérôme', contact_lastname: 'Menard', phone: '+33 6 90 12 34 56', email: 'jerome@boulangerie-artisanale.fr', status: 'active', hub_id: 'hub-004', address: '12 Rue du Bac, 59000 Lille', city: 'Lille' },
  { id: 'cus-010', reference: 'CUS-010', customer_name: 'La Poste — Centre de tri Lyon', customer_type: 'company', contact_firstname: 'Nicolas', contact_lastname: 'Roux', phone: '+33 6 01 23 45 67', email: 'nicolas.roux@laposte.fr', status: 'active', hub_id: 'hub-002', address: '34 Boulevard de Sébastopol, 69007 Lyon', city: 'Lyon' },
]

const now = new Date()

function subDays(d: Date, days: number) {
  const r = new Date(d)
  r.setDate(r.getDate() - days)
  return r
}

function rng(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

const STATUSES_BY_AGE = (ageDays: number) => {
  if (ageDays > 60) return pick(['delivered', 'delivered', 'delivered', 'delivered', 'delivered', 'delivered', 'delivered', 'delivered', 'cancelled'])
  if (ageDays > 30) return pick(['delivered', 'delivered', 'delivered', 'delayed', 'cancelled', 'delivered'])
  if (ageDays > 7) return pick(['delivered', 'delivering', 'delayed', 'blocked', 'planned'])
  return pick(['planned', 'planned', 'planned', 'delivering', 'delivering', 'blocked', 'delayed'])
}

const SERVICE_TYPES = ['express', 'standard', 'freight'] as const
const PRIORITIES = ['urgent', 'high', 'standard', 'low'] as const
const INVOICE_STATUSES = ['quotation', 'purchase_order', 'invoice'] as const

const invoices: Array<{
  id: string; reference: string; customer_id: string; hub_id: string;
  pickup_address_id: string; delivery_address_id: string;
  business_manager_id: string; service_type: string; priority: string;
  due_date: Date; payment_date: Date | null; amount: number; status: string;
}> = []

for (let i = 0; i < 30; i++) {
  const idx = String(i + 1).padStart(3, '0')
  const dueOffset = rng(5, 180)
  const dueDate = subDays(now, dueOffset)
  const isPaid = dueOffset > 60 ? Math.random() < 0.85 : dueOffset > 30 ? Math.random() < 0.6 : Math.random() < 0.2
  invoices.push({
    id: `inv-${idx}`,
    reference: `INV-${idx}`,
    customer_id: pick(CUSTOMERS).id,
    hub_id: pick(HUBS).id,
    pickup_address_id: `addr-${rng(1, 20)}`,
    delivery_address_id: `addr-${rng(1, 20)}`,
    business_manager_id: pick(USERS.filter(u => u.role === 'business_manager')).id,
    service_type: pick([...SERVICE_TYPES]),
    priority: pick([...PRIORITIES]),
    due_date: dueDate,
    payment_date: isPaid ? subDays(dueDate, rng(1, 14)) : null,
    amount: parseFloat((Math.random() * 4950 + 50).toFixed(2)),
    status: pick([...INVOICE_STATUSES]),
  })
}

const deliveries: Array<{
  id: string; invoices_id: string; driver_id: string | null;
  reference: string; status: string; notes: string | null;
  scheduled_at: Date | null; position_history: unknown;
}> = []

for (let i = 0; i < invoices.length; i++) {
  const inv = invoices[i]
  const idx = String(i + 1).padStart(3, '0')
  const ageDays = (now.getTime() - inv.due_date.getTime()) / (1000 * 60 * 60 * 24)
  const status = STATUSES_BY_AGE(ageDays)
  const hasPosition = status === 'delivering' || status === 'delayed'
  const scheduledAt = new Date(inv.due_date)
  scheduledAt.setHours(8 + rng(0, 10), rng(0, 59))

  deliveries.push({
    id: `del-${idx}`,
    reference: `DEL-${idx}`,
    invoices_id: inv.id,
    driver_id: pick(DRIVERS).id,
    status,
    scheduled_at: scheduledAt,
    notes: Math.random() < 0.3 ? 'Livraison à effectuer en urgence, appel client avant passage.' : null,
    position_history: hasPosition ? [
      { lat: 45 + Math.random() * 4, lng: -1 + Math.random() * 8, ts: new Date(Date.now() - rng(1000, 3600000)).toISOString() },
      { lat: 45 + Math.random() * 4, lng: -1 + Math.random() * 8, ts: new Date().toISOString() },
    ] : null,
  })
}

const parcels: Array<{ id: string; invoice_id: string; reference: string; weight: number }> = []
for (const inv of invoices) {
  const count = rng(1, 5)
  for (let j = 0; j < count; j++) {
    parcels.push({
      id: `par-${String(parcels.length + 1).padStart(3, '0')}`,
      invoice_id: inv.id,
      reference: `PAR-${String(parcels.length + 1).padStart(3, '0')}`,
      weight: parseFloat((Math.random() * 499.5 + 0.5).toFixed(2)),
    })
  }
}

const deliveryEvents: Array<{
  id: string; delivery_id: string; description: string | null;
  latitude: number | null; longitude: number | null;
  type: string; status: string; resolution_description: string | null;
  created_at: Date | null; resolution_date: Date | null;
}> = []

for (const del of deliveries.slice(0, 15)) {
  const eventCount = rng(1, 3)
  for (let j = 0; j < eventCount; j++) {
    const isResolved = Math.random() < 0.7
    deliveryEvents.push({
      id: `evt-${String(deliveryEvents.length + 1).padStart(3, '0')}`,
      delivery_id: del.id,
      description: pick(['Colis endommagé', 'Adresse introuvable', 'Destinataire absent', 'Livré avec succès', 'Retard signalé', 'Embouteillage']),
      latitude: 45 + Math.random() * 4,
      longitude: -1 + Math.random() * 8,
      type: pick(['note', 'info', 'warning', 'critical']),
      status: isResolved ? 'resolved' : 'waiting',
      resolution_description: isResolved ? 'Problème résolu' : null,
      created_at: subDays(now, rng(1, 30)),
      resolution_date: isResolved ? subDays(now, rng(0, 5)) : null,
    })
  }
}

export const MOCK = {
  invoices,
  deliveries,
  parcels,
  deliveryEvents,
  addresses: FRENCH_CITIES.map((c, i) => ({
    id: `addr-${i + 1}`,
    address: `${rng(1, 200)} ${pick(FRENCH_STREETS)}, ${c.postalCode} ${c.name}`,
    street: `${rng(1, 200)} ${pick(FRENCH_STREETS)}`,
    city: c.name,
    postal_code: c.postalCode,
  })),
}

function findUser(id: string) {
  return USERS.find(u => u.id === id)
}
function findDriver(id: string) {
  return DRIVERS.find(d => d.id === id)
}
function findVehicle(id: string) {
  return VEHICLES.find(v => v.id === id)
}
function findCustomer(id: string) {
  return CUSTOMERS.find(c => c.id === id)
}
function findHub(id: string) {
  return HUBS.find(h => h.id === id)
}

export function buildApiInvoice(inv: typeof invoices[number]) {
  const customer = findCustomer(inv.customer_id)
  const hub = findHub(inv.hub_id)
  const bm = findUser(inv.business_manager_id)
  const delAddr = MOCK.addresses.find(a => a.id === inv.delivery_address_id)
  return {
    id: inv.id,
    reference: inv.reference,
    service_type: inv.service_type,
    priority: inv.priority,
    due_date: inv.due_date.toISOString().split('T')[0],
    amount: inv.amount,
    status: inv.status,
    business_manager_id: inv.business_manager_id,
    customer_id: inv.customer_id,
    hub_id: inv.hub_id,
    pickup_address_id: inv.pickup_address_id,
    delivery_address_id: inv.delivery_address_id,
    payment_date: inv.payment_date?.toISOString().split('T')[0] ?? null,
    customer: customer ? {
      id: customer.id,
      reference: customer.reference,
      customer_name: customer.customer_name,
      customer_type: customer.customer_type,
      contact_firstname: customer.contact_firstname,
      contact_lastname: customer.contact_lastname,
      phone_number: customer.phone,
      email: customer.email,
      status: customer.status,
    } : null,
    hub: hub ? {
      id: hub.id,
      reference: hub.reference,
      name: hub.name,
      manager_id: null,
      address_id: null,
      phone_number: hub.phone,
      capacity_parcels_day: hub.capacity,
      status: hub.status,
    } : null,
    business_manager: bm ? {
      id: bm.id,
      reference: bm.reference,
      firstname: bm.firstname,
      lastname: bm.lastname,
      email: bm.email,
    } : null,
    delivery_address: delAddr ? {
      id: delAddr.id,
      address: delAddr.address,
      city: delAddr.city,
      postal_code: delAddr.postal_code,
    } : null,
  }
}

export function buildApiDriver(drv: typeof DRIVERS[number]) {
  const user = findUser(drv.user_id)
  const veh = findVehicle(drv.vehicle_id!)
  return {
    id: drv.id,
    reference: drv.reference,
    rating: drv.rating,
    vehicle_id: drv.vehicle_id,
    user: {
      id: user!.id,
      reference: user!.reference,
      firstname: user!.firstname,
      lastname: user!.lastname,
      email: user!.email,
    },
    vehicle: veh ? {
      id: veh.id,
      reference: veh.reference,
      type: veh.type,
      license_plate: veh.license_plate,
      status: veh.status,
    } : null,
  }
}

export function buildApiDelivery(del: typeof deliveries[number]) {
  const inv = invoices.find(i => i.id === del.invoices_id)
  const drv = del.driver_id ? findDriver(del.driver_id) : null
  const events = deliveryEvents.filter(e => e.delivery_id === del.id)
  return {
    id: del.id,
    invoices_id: del.invoices_id,
    driver_id: del.driver_id,
    reference: del.reference,
    status: del.status,
    notes: del.notes,
    scheduled_at: del.scheduled_at?.toISOString() ?? null,
    position_history: del.position_history,
    invoice: inv ? buildApiInvoice(inv) : null,
    driver: drv ? buildApiDriver(drv) : null,
    delivery_events: events.map(e => ({
      id: e.id,
      delivery_id: e.delivery_id,
      description: e.description,
      latitude: e.latitude,
      longitude: e.longitude,
      type: e.type,
      status: e.status,
      resolution_description: e.resolution_description,
      created_at: e.created_at?.toISOString() ?? null,
      resolution_date: e.resolution_date?.toISOString() ?? null,
    })),
  }
}

export function buildApiUser(user: typeof USERS[number]) {
  const hub = findHub(user.hub_id!)
  const drv = DRIVERS.find(d => d.user_id === user.id)
  const veh = drv ? findVehicle(drv.vehicle_id!) : null
  return {
    id: user.id,
    reference: user.reference,
    hub_id: user.hub_id,
    firstname: user.firstname,
    lastname: user.lastname,
    phone_number: user.phone,
    email: user.email,
    status: user.status,
    role: user.role,
    hub: hub ? { id: hub.id, reference: hub.reference, name: hub.name } : null,
    driver: drv ? {
      id: drv.id,
      reference: drv.reference,
      rating: drv.rating,
      vehicle_id: drv.vehicle_id,
      vehicle: veh ? {
        id: veh.id,
        reference: veh.reference,
        type: veh.type,
        license_plate: veh.license_plate,
        status: veh.status,
      } : null,
    } : null,
  }
}

export function buildApiCustomer(cus: typeof CUSTOMERS[number]) {
  const hub = findHub(cus.hub_id!)
  const activeInvoices = invoices.filter(i => i.customer_id === cus.id && i.status === 'invoice').length
  return {
    id: cus.id,
    reference: cus.reference,
    customer_name: cus.customer_name,
    customer_type: cus.customer_type,
    contact_firstname: cus.contact_firstname,
    contact_lastname: cus.contact_lastname,
    phone_number: cus.phone,
    email: cus.email,
    status: cus.status,
    hub: hub ? { id: hub.id, reference: hub.reference, name: hub.name } : null,
    active_invoices: activeInvoices,
  }
}

export function buildApiHub(hub: typeof HUBS[number]) {
  const addr = MOCK.addresses.find(a => a.city === hub.city)
  return {
    id: hub.id,
    reference: hub.reference,
    manager_id: null,
    address_id: addr?.id ?? null,
    name: hub.name,
    phone_number: hub.phone,
    capacity_parcels_day: hub.capacity,
    status: hub.status,
    address: addr ? {
      id: addr.id,
      address: addr.address,
      street: addr.street,
      city: addr.city,
      postal_code: addr.postal_code,
    } : null,
    _count: {
      users: USERS.filter(u => u.hub_id === hub.id).length,
      vehicles: VEHICLES.filter(v => v.hub_id === hub.id).length,
      customers: CUSTOMERS.filter(c => c.hub_id === hub.id).length,
      invoices: invoices.filter(i => i.hub_id === hub.id).length,
    },
  }
}

export function buildApiVehicle(veh: typeof VEHICLES[number]) {
  const hub = findHub(veh.hub_id!)
  const drvs = DRIVERS.filter(d => d.vehicle_id === veh.id)
  return {
    id: veh.id,
    hub_id: veh.hub_id,
    reference: veh.reference,
    type: veh.type,
    license_plate: veh.license_plate,
    status: veh.status,
    hub: hub ? {
      id: hub.id,
      reference: hub.reference,
      name: hub.name,
      phone_number: hub.phone,
      status: hub.status,
    } : null,
    drivers: drvs.map(d => {
      const u = findUser(d.user_id)
      return {
        id: d.id,
        reference: d.reference,
        user: {
          id: u!.id,
          firstname: u!.firstname,
          lastname: u!.lastname,
          email: u!.email,
        },
      }
    }),
  }
}

export function buildApiParcel(par: typeof parcels[number]) {
  const inv = invoices.find(i => i.id === par.invoice_id)
  const dels = deliveries.filter(d => d.invoices_id === par.invoice_id)
  return {
    id: par.id,
    invoice_id: par.invoice_id,
    reference: par.reference,
    weight: par.weight,
    invoice: inv ? {
      id: inv.id,
      reference: inv.reference,
      status: inv.status,
      customer: inv ? { customer_name: findCustomer(inv.customer_id)?.customer_name ?? null } : null,
      deliveries: dels.map(d => ({ id: d.id, reference: d.reference, status: d.status })),
    } : undefined,
  }
}

export function buildApiInvoiceDetail(inv: typeof invoices[number]) {
  const pars = parcels.filter(p => p.invoice_id === inv.id)
  const dels = deliveries.filter(d => d.invoices_id === inv.id)
  return {
    ...buildApiInvoice(inv),
    parcels: pars.map(p => buildApiParcel(p)),
    deliveries: dels.map(d => buildApiDelivery(d)),
  }
}
