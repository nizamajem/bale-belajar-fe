"use client";

type TrackingEvent = {
  name: string;
  path: string;
  payload?: Record<string, string | number | boolean>;
  createdAt: string;
};

const KEY = "bale_analytics_events";
const MAX_EVENTS = 80;

export function trackEvent(name: string, payload?: TrackingEvent["payload"]) {
  if (typeof window === "undefined") return;

  const event: TrackingEvent = {
    name,
    path: window.location.pathname,
    payload,
    createdAt: new Date().toISOString(),
  };

  try {
    const current = JSON.parse(window.localStorage.getItem(KEY) ?? "[]") as TrackingEvent[];
    window.localStorage.setItem(KEY, JSON.stringify([event, ...current].slice(0, MAX_EVENTS)));
  } catch {
    window.localStorage.setItem(KEY, JSON.stringify([event]));
  }
}

export function getTrackedEvents(): TrackingEvent[] {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "[]") as TrackingEvent[];
  } catch {
    return [];
  }
}
