import { useCallback, useEffect, useRef, useState } from 'react';

export type UseWebSocketResult = {
  connected: boolean;
  messages: string[];
  start: () => void;
  disconnect: () => void;
  send: (msg: string) => void;
};

/**
 * Simple hook to manage a WebSocket connection.
 * - start() will create and open the socket
 * - send(msg) sends if connected
 * - disconnect() closes the socket
 */
export default function useWebSocket(
  url = 'ws://192.168.0.3:9000',
): UseWebSocketResult {
  const socketRef = useRef<WebSocket | null>(null); // holds the WebSocket instance
  const [connected, setConnected] = useState(false); // connection state
  const [messages, setMessages] = useState<string[]>([]); // received messages

  const start = useCallback(() => {
    if (socketRef.current) return; // already connected or connecting

    const socket = new WebSocket(url); // create socket

    socket.onopen = () => {
      setConnected(true); // update UI state
      // optional initial greeting
      try {
        socket.send('Hello Server!');
      } catch {}
    };

    socket.onmessage = event => {
      setMessages(prev => [...prev, String((event as any).data)]); // append message
    };

    socket.onerror = error => {
      // keep it minimal: update console only
      // errors don't necessarily close the socket
      // (native implementations may differ)
      // eslint-disable-next-line no-console
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      socketRef.current = null; // clear ref
      setConnected(false); // update UI state
    };

    socketRef.current = socket; // store instance
  }, [url]);

  const disconnect = useCallback(() => {
    const s = socketRef.current;
    if (!s) return;
    try {
      s.close(1000, 'Manual disconnect'); // normal closure
    } catch {}
    // onclose will clear ref and state
  }, []);

  const send = useCallback((msg: string) => {
    const s = socketRef.current;
    if (!s || s.readyState !== 1) {
      // eslint-disable-next-line no-console
      console.warn('WebSocket not connected — cannot send:', msg);
      return;
    }
    try {
      s.send(msg);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to send message:', e);
    }
  }, []);

  useEffect(() => {
    // cleanup on unmount
    return () => {
      const s = socketRef.current;
      if (s) {
        try {
          s.close();
        } catch {}
        socketRef.current = null;
      }
    };
  }, []);

  return { connected, messages, start, disconnect, send };
}
