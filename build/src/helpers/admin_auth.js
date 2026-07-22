export function useAdminSessionGuard(auth, guard) {
    return auth.use(guard);
}
