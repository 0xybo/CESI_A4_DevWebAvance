import type { UserRole } from '~/composables/useAuth';

const PUBLIC_PATHS = ['/', '/debug'];

const ROLE_PREFIXES: Record<string, UserRole[]> = {
    '/admin':      ['admin'],
    '/dispatcher': ['dispatcher'],
    '/livreur':    ['driver'],
    '/business':   ['business_manager'],
};

export default defineNuxtRouteMiddleware(async (to) => {
    if (PUBLIC_PATHS.some((p) => to.path === p || to.path.startsWith(p + '/')))
        return;

    const { user, fetchMe } = useAuth();

    if (!user.value) {
        const ok = await fetchMe();
        if (!ok) return navigateTo('/');
    }

    const allowedRoles = Object.entries(ROLE_PREFIXES).find(([prefix]) =>
        to.path.startsWith(prefix),
    )?.[1];

    if (allowedRoles && user.value && !allowedRoles.includes(user.value.role)) {
        return navigateTo('/');
    }
});
