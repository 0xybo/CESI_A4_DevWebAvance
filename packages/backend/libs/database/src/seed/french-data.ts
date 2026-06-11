export interface FrenchCity {
    name: string;
    postalCode: string;
}

export const FRENCH_CITIES: FrenchCity[] = [
    { name: 'Paris', postalCode: '75001' },
    { name: 'Paris', postalCode: '75002' },
    { name: 'Paris', postalCode: '75011' },
    { name: 'Paris', postalCode: '75015' },
    { name: 'Lyon', postalCode: '69001' },
    { name: 'Lyon', postalCode: '69003' },
    { name: 'Lyon', postalCode: '69007' },
    { name: 'Marseille', postalCode: '13001' },
    { name: 'Marseille', postalCode: '13006' },
    { name: 'Marseille', postalCode: '13008' },
    { name: 'Lille', postalCode: '59000' },
    { name: 'Bordeaux', postalCode: '33000' },
    { name: 'Toulouse', postalCode: '31000' },
    { name: 'Nantes', postalCode: '44000' },
    { name: 'Strasbourg', postalCode: '67000' },
    { name: 'Montpellier', postalCode: '34000' },
    { name: 'Rennes', postalCode: '35000' },
    { name: 'Nice', postalCode: '06000' },
    { name: 'Grenoble', postalCode: '38000' },
    { name: 'Rouen', postalCode: '76000' },
];

export const FRENCH_STREETS: string[] = [
    'Rue de la Paix',
    'Avenue des Champs-Élysées',
    'Boulevard Saint-Germain',
    'Rue du Faubourg Saint-Honoré',
    'Place de la République',
    'Cours Mirabeau',
    'Rue de la République',
    'Avenue Jean Jaurès',
    'Place Bellecour',
    'Boulevard Haussmann',
    'Rue Victor Hugo',
    'Avenue de la Libération',
    'Rue Gambetta',
    'Boulevard Voltaire',
    'Rue Nationale',
    'Avenue de la Grande Armée',
    'Rue de Rivoli',
    'Place de la Bastille',
    'Boulevard de Sébastopol',
    'Rue du Bac',
];

export interface FrenchHubDef {
    name: string;
    city: string;
    drivers: number;
    description: string;
    capacity: number;
}

export const FRENCH_HUBS: FrenchHubDef[] = [
    { name: 'Hub Paris-Nord', city: 'Paris', drivers: 5, description: 'Hub principal Île-de-France', capacity: 2000 },
    { name: 'Hub Lyon-Est', city: 'Lyon', drivers: 3, description: 'Auvergne-Rhône-Alpes', capacity: 1200 },
    { name: 'Hub Marseille-Sud', city: 'Marseille', drivers: 2, description: 'Provence-Alpes-Côte d\'Azur', capacity: 1000 },
    { name: 'Hub Lille-Nord', city: 'Lille', drivers: 2, description: 'Hauts-de-France', capacity: 800 },
    { name: 'Hub Bordeaux-Ouest', city: 'Bordeaux', drivers: 2, description: 'Nouvelle-Aquitaine', capacity: 900 },
];

export const FRENCH_COMPANIES: string[] = [
    'SARL Dupont Logistique',
    'SuperMarché Express',
    'Boulangerie Artisanale',
    'Clinique Saint-Joseph',
    'Mairie de Lyon',
    'Restaurant Le Gourmet',
    'Librairie du Centre',
    'Garage Mécanique Moderne',
    'École Primaire Saint-Exupéry',
    'Quincaillerie du Midi',
    'Fromagerie Beaufort & Fils',
    'Coiffure & Esthétique Laura',
    'Pharmacie de la Gare',
    'CHU de Bordeaux',
    'Pressing Minute',
    'Cave des Sommeliers',
    'Hôtel de la Plage',
    'Bureau de Tabac du Marché',
    'Fleuriste Artémis',
    'SARL Martin Transport',
    'La Poste — Centre de tri Lyon',
    'Décathlon — Logistique Sud',
];

export function randomCity(): FrenchCity {
    return FRENCH_CITIES[Math.floor(Math.random() * FRENCH_CITIES.length)];
}

export function randomStreet(): string {
    return FRENCH_STREETS[Math.floor(Math.random() * FRENCH_STREETS.length)];
}

export function randomCompany(): string {
    return FRENCH_COMPANIES[Math.floor(Math.random() * FRENCH_COMPANIES.length)];
}

export function randomAddress(): { address: string; street: string; city: string; postal_code: string } {
    const city = randomCity();
    const street = randomStreet();
    const number = Math.floor(Math.random() * 200) + 1;
    const suffix = ['', 'bis', 'ter'][Math.floor(Math.random() * 3)];
    return {
        address: `${number}${suffix ? ' ' + suffix : ''} ${street}, ${city.postalCode} ${city.name}`,
        street: `${number}${suffix ? ' ' + suffix : ''} ${street}`,
        city: city.name,
        postal_code: city.postalCode,
    };
}

export function generateFrenchPhone(): string {
    const prefix = Math.random() < 0.5 ? '06' : '07';
    const rest = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join('');
    return `+33 ${prefix.slice(1)} ${rest.slice(0, 2)} ${rest.slice(2, 4)} ${rest.slice(4, 6)} ${rest.slice(6, 8)}`;
}

export function generateFrenchPlate(): string {
    const letters = 'ABCDEFGHJKLMNPRSTUVWXYZ';
    const digits = '0123456789';
    const a1 = letters[Math.floor(Math.random() * letters.length)];
    const a2 = letters[Math.floor(Math.random() * letters.length)];
    const n1 = digits[Math.floor(Math.random() * digits.length)];
    const n2 = digits[Math.floor(Math.random() * digits.length)];
    const n3 = digits[Math.floor(Math.random() * digits.length)];
    const a3 = letters[Math.floor(Math.random() * letters.length)];
    const a4 = letters[Math.floor(Math.random() * letters.length)];
    return `${a1}${a2}-${n1}${n2}${n3}-${a3}${a4}`;
}
