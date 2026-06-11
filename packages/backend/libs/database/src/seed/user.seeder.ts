import { faker } from '@faker-js/faker';
import type { PrismaClient } from '@generated/prisma';
import { generateFrenchPhone } from './french-data';
import { hashPassword, nextUserRef } from './helpers';

interface StaticUser {
    firstname: string;
    lastname: string;
    email: string;
    role: 'admin' | 'dispatcher' | 'driver' | 'business_manager';
    password: string;
}

const STATIC_USERS: StaticUser[] = [
    { firstname: 'Admin', lastname: 'Transvirex', email: 'admin@transvirex.com', role: 'admin', password: 'password' },
    {
        firstname: 'Jean',
        lastname: 'Dupont',
        email: 'dispatcher@transvirex.com',
        role: 'dispatcher',
        password: 'password',
    },
    { firstname: 'Pierre', lastname: 'Martin', email: 'driver@transvirex.com', role: 'driver', password: 'password' },
    {
        firstname: 'Sophie',
        lastname: 'Bernard',
        email: 'billing@transvirex.com',
        role: 'business_manager',
        password: 'password',
    },
];

interface UserResult {
    id: string;
    role: string;
    email: string | null;
}

const ROLE_WEIGHTS: { role: 'dispatcher' | 'driver' | 'business_manager' | 'admin'; weight: number }[] = [
    { role: 'driver', weight: 50 },
    { role: 'driver', weight: 50 },
    { role: 'driver', weight: 50 },
    { role: 'dispatcher', weight: 20 },
    { role: 'dispatcher', weight: 20 },
    { role: 'business_manager', weight: 20 },
    { role: 'admin', weight: 10 },
];

export async function seedUsers(prisma: PrismaClient, hubIds: string[], extraCount: number) {
    const users: UserResult[] = [];

    for (const su of STATIC_USERS) {
        const user = await prisma.user.create({
            data: {
                reference: nextUserRef(),
                firstname: su.firstname,
                lastname: su.lastname,
                email: su.email,
                phone_number: generateFrenchPhone(),
                hash_password: await hashPassword(su.password),
                role: su.role,
                status: 'active',
                hub_id: faker.helpers.arrayElement(hubIds),
            },
        });
        users.push({ id: user.id, role: su.role, email: su.email });
    }

    for (let i = 0; i < extraCount; i++) {
        const role = ROLE_WEIGHTS[i % ROLE_WEIGHTS.length].role;
        const firstname = faker.person.firstName();
        const lastname = faker.person.lastName();
        const email = faker.internet.email({ firstName: firstname, lastName: lastname }).toLowerCase();

        const user = await prisma.user.create({
            data: {
                reference: nextUserRef(),
                firstname,
                lastname,
                phone_number: generateFrenchPhone(),
                work_phone_number: generateFrenchPhone(),
                email,
                work_email: `work.${email}`,
                hash_password: await hashPassword('password'),
                role,
                status: faker.helpers.arrayElement(['active', 'active', 'active', 'inactive']),
                hub_id: faker.helpers.arrayElement(hubIds),
            },
        });
        users.push({ id: user.id, role: user.role as string, email: user.email });
    }

    return users;
}

