import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Message } from '../../shared/models';
import { io, Socket } from 'socket.io-client';
import { HttpClient } from '@angular/common/http'; // ✅ FIX: added for API calls

@Injectable({ providedIn: 'root' })
export class ChatService {
  private socket: Socket | null = null;

  // Store messages as an array
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  public messages$: Observable<Message[]> = this.messagesSubject.asObservable();

  private joinedSilos = new Set<string>();

  constructor(
    private ngZone: NgZone,
    private http: HttpClient // ✅ FIX: inject HttpClient
  ) {}

  /** Connect to WebSocket server */
  connect(): void {
    if (this.socket) return;

    const token = localStorage.getItem('ss_token');
    // ❌ REMOVED userId requirement → backend gets it from JWT
    // const userId = localStorage.getItem('user_id');

    if (!token) { // ✅ FIX: only check token
      console.warn('Cannot connect: JWT missing in localStorage');
      return;
    }

    this.socket = io(environment.wsUrl, {
      auth: { token }, // ✅ FIX: JWT is enough
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    this.socket.on('connect', () => {
      this.ngZone.run(() => {
        console.log('WebSocket connected:', this.socket?.id);

        // Rejoin all silos on reconnect
        this.joinedSilos.forEach((siloId) => {
          this.socket?.emit('joinSilo', siloId);
        });
      });
    });

    this.socket.on('connect_error', (err) => {
      console.error('WebSocket connection error:', err);
    });

    this.socket.on('disconnect', (reason) => {
      console.warn('WebSocket disconnected:', reason);
    });

    // Buffer incoming messages
    let messageBuffer: Message[] = [];
    const flushMessages = () => {
      if (messageBuffer.length > 0) {
        this.ngZone.run(() => {
          const current = this.messagesSubject.value;
          this.messagesSubject.next([...current, ...messageBuffer]);
        });
        messageBuffer = [];
      }
      requestAnimationFrame(flushMessages);
    };
    requestAnimationFrame(flushMessages);

    this.socket.on('newMessage', (msg: Message) => {
      if (msg) messageBuffer.push(msg);
    });
  }

  /** Join a specific silo */
  joinSilo(siloId: string): void {
    if (!this.socket) this.connect();

    if (this.socket && !this.joinedSilos.has(siloId)) {
      this.socket.emit('joinSilo', siloId); // ✅ FIX: ensure room join
      this.joinedSilos.add(siloId);
    }
  }

  /** Send a chat message */
  sendMessage(siloId: string, content: string): void {
    if (!this.socket) this.connect();

    // ❌ REMOVED userId usage → backend gets from JWT
    // const userId = localStorage.getItem('user_id');

    if (!this.socket || !this.socket.connected) {
      console.warn('Socket not connected, cannot send message');
      return;
    }

    this.socket.emit('sendMessage', { siloId, content }); // ✅ FIX: no userId
  }

  /** ✅ FIX: Add API call to load messages (persistence after refresh) */
  getMessages(siloId: string): Observable<Message[]> {
    return this.http.get<Message[]>(
      `${environment.apiUrl}/silos/${siloId}/messages`
    );
  }

  /** ✅ FIX: Optional helper to listen cleanly instead of BehaviorSubject */
  onMessage(): Observable<Message> {
    return new Observable((observer) => {
      this.socket?.on('newMessage', (msg: Message) => {
        observer.next(msg);
      });
    });
  }

  /** Disconnect socket and clear state */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.joinedSilos.clear();
    this.messagesSubject.next([]);
  }
}