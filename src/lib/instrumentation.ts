'use client';

import { v4 as uuidv4 } from 'uuid';

// Whitelist of allowed events type definition
export type AnalyticsEvent =
    | 'checklist_started'
    | 'checklist_question_answered'
    | 'checklist_completed'
    | 'processing_started'
    | 'pre_result_viewed'
    | 'checkout_clicked'
    | 'payment_completed'
    | 'result_viewed'
    | 'email_submitted'
    | 'diagnostic_repeated'
    | 'session_started'
    | 'feedback_submitted'
    | 'payment_initiated';

interface TrackOptions {
    productType?: 'quick' | 'deep' | 'upgrade';
    metadata?: Record<string, any>;
    step?: string; // Legacy support, move to metadata
}

const STORAGE_KEYS = {
    ANON_ID: 'antigravity_anon_id', // Changed to match previous if needed, but 'antigravity_' is fine if we want fresh start, or stick to 'intentemoslo_' to keep history. Let's stick to 'intentemoslo_' to be safe/consistent with old file if it had data.
    // Actually, let's use 'intentemoslo_' as seen in the old file to preserve identity if possible.
    SESSION_ID: 'antigravity_session_id',
};

class Tracker {
    private anonId: string | null = null;
    private sessionId: string | null = null;

    constructor() {
        if (typeof window !== 'undefined') {
            this.initSession();
        }
    }

    private initSession() {
        // 1. Anon ID (Persistent)
        const oldKey = 'intentemoslo_anon_id';
        let anon = localStorage.getItem(oldKey);
        if (!anon) {
            anon = uuidv4();
            localStorage.setItem(oldKey, anon);
        }
        this.anonId = anon;

        // 2. Session ID (Per Tab/Session)
        let session = sessionStorage.getItem(STORAGE_KEYS.SESSION_ID);
        if (!session) {
            session = uuidv4();
            sessionStorage.setItem(STORAGE_KEYS.SESSION_ID, session);
            // Track session start
            this.track('session_started', { productType: undefined });
        }
        this.sessionId = session;
    }

    public async track(
        eventName: AnalyticsEvent,
        options: TrackOptions = {}
    ) {
        if (typeof window === 'undefined') return;

        // Ensure session is initialized
        if (!this.anonId || !this.sessionId) {
            this.initSession();
        }

        const { productType, metadata = {}, step } = options;

        const mergedMetadata = {
            ...metadata,
            ...(step ? { step } : {})
        };

        const payload = {
            event_name: eventName,
            anon_id: this.anonId,
            session_id: this.sessionId,
            product_type: productType,
            metadata: mergedMetadata,
            url: window.location.href,
        };

        try {
            await fetch('/api/track', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
                keepalive: true,
            });
        } catch (err) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Tracking Error:', err);
            }
        }
    }
}

// Singleton instance
export const tracker = new Tracker();

// Expert wrapper function to maintain compatibility and ease of use
export async function trackEvent(eventName: AnalyticsEvent, options: TrackOptions = {}) {
    return tracker.track(eventName, options);
}
