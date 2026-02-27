import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook to detect user activity and manage idle state globally for Lab portal.
 */
export const useUserActivity = (
    onStatusChange: (status: 'online' | 'offline') => void,
    idleTimeoutMs: number = 120000 // 2 minutes default
) => {
    const statusRef = useRef<'online' | 'offline'>('online');
    const timeoutRef = useRef<any>(null);

    const setStatus = useCallback((newStatus: 'online' | 'offline') => {
        if (statusRef.current !== newStatus) {
            statusRef.current = newStatus;
            console.log(`[Activity] Status changed to ${newStatus}`);
            onStatusChange(newStatus);
        }
    }, [onStatusChange]);

    const resetTimer = useCallback(() => {
        if (statusRef.current === 'offline') {
            setStatus('online');
        }

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            setStatus('offline');
        }, idleTimeoutMs);
    }, [idleTimeoutMs, setStatus]);

    useEffect(() => {
        resetTimer();

        const events = [
            'mousemove',
            'mousedown',
            'keydown',
            'scroll',
            'touchstart',
            'click'
        ];

        const handleActivity = () => {
            resetTimer();
        };

        events.forEach(event => {
            window.addEventListener(event, handleActivity, { passive: true });
        });

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            events.forEach(event => {
                window.removeEventListener(event, handleActivity);
            });
        };
    }, [resetTimer]);

    return {
        currentStatus: statusRef.current,
    };
};
