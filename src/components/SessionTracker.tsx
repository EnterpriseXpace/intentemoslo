'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/instrumentation';

export function SessionTracker() {
    useEffect(() => {
        trackEvent('session_started');
    }, []);

    return null;
}
