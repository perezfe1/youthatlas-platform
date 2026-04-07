'use client';

import { useState, useEffect } from 'react';

// ── Helpers ───────────────────────────────────────────────────────────────────

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

type PushState = 'idle' | 'subscribed' | 'denied' | 'unsupported';

// ── Component ─────────────────────────────────────────────────────────────────

export function PushOptIn() {
  const [state, setState] = useState<PushState>('idle');
  const [loading, setLoading] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check support
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setState('unsupported');
      return;
    }

    // Check if already subscribed or denied
    if (Notification.permission === 'denied') {
      setState('denied');
      return;
    }

    // Check existing subscription
    navigator.serviceWorker.ready.then((reg) => {
      reg.pushManager.getSubscription().then((sub) => {
        if (sub) setState('subscribed');
      });
    });

    // Check if user already dismissed
    if (localStorage.getItem('push-opt-in-dismissed')) {
      setDismissed(true);
    }
  }, []);

  async function handleSubscribe() {
    setLoading(true);
    try {
      // Get VAPID key
      const vapidRes = await fetch('/api/push/vapid');
      const { publicKey } = await vapidRes.json();
      if (!publicKey) throw new Error('No VAPID key');

      // Request notification permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setState('denied');
        return;
      }

      // Subscribe via Push API
      const reg = await navigator.serviceWorker.ready;
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      const subJson = subscription.toJSON();

      // Save to server
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: subJson.endpoint,
          keys: subJson.keys,
        }),
      });

      setState('subscribed');
    } catch (err) {
      console.error('Push subscription failed:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleDismiss() {
    setDismissed(true);
    localStorage.setItem('push-opt-in-dismissed', '1');
  }

  // Don't show if: unsupported, already subscribed, denied, or dismissed
  if (state !== 'idle' || dismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-xl border border-blue-200 bg-white p-4 shadow-lg sm:left-auto sm:right-4">
      <div className="flex items-start gap-3">
        <span className="text-2xl" aria-hidden="true">🔔</span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-900">
            Get notified about new opportunities
          </p>
          <p className="mt-1 text-xs text-slate-500">
            We&apos;ll send you a push notification when new opportunities matching your interests are added.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={handleSubscribe}
              disabled={loading}
              type="button"
              className="rounded-lg bg-blue-500 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Enabling...' : 'Enable notifications'}
            </button>
            <button
              onClick={handleDismiss}
              type="button"
              className="rounded-lg px-3 py-2 text-xs text-slate-500 transition-colors hover:text-slate-700"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
