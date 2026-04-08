import { useEffect } from 'react';
import socket from '../socket.ts';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EventMap = Record<string, (data: any) => void>;

export function useSocket(events: EventMap): void {
  useEffect(() => {
    for (const [event, handler] of Object.entries(events)) {
      socket.on(event, handler);
    }
    return () => {
      for (const [event, handler] of Object.entries(events)) {
        socket.off(event, handler);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
