import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import type { Message, MulticastMessage } from 'firebase-admin/messaging';

@Injectable()
export class NotificationsService implements OnModuleInit {
  private readonly logger = new Logger(NotificationsService.name);
  private app: admin.app.App | null = null;

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    this.initFirebase();
  }

  private initFirebase() {
    const projectId = this.config.get<string>('firebase.projectId');
    const serviceAccountJson = this.config.get<string>('firebase.serviceAccountJson');

    if (!projectId || !serviceAccountJson) {
      this.logger.warn(
        'Firebase not configured — push notifications disabled. ' +
        'Set FIREBASE_PROJECT_ID and FIREBASE_SERVICE_ACCOUNT_JSON in .env',
      );
      return;
    }

    try {
      if (admin.apps.length > 0) {
        this.app = admin.apps[0] ?? null;
        return;
      }

      const serviceAccount = JSON.parse(serviceAccountJson) as admin.ServiceAccount;
      this.app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      this.logger.log('Firebase Admin initialized');
    } catch (err) {
      this.logger.error('Firebase Admin init failed:', err);
    }
  }

  /** Send a single notification to one device */
  async sendToDevice(
    fcmToken: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<boolean> {
    if (!this.app || !fcmToken) return false;

    const message: Message = {
      token: fcmToken,
      notification: { title, body },
      data,
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          channelId: 'dawwar_orders',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      },
    };

    try {
      await this.app.messaging().send(message);
      return true;
    } catch (err) {
      this.logger.warn(`FCM send failed for token ${fcmToken.slice(0, 20)}...:`, err);
      return false;
    }
  }

  /** Send to multiple devices at once (≤500 tokens per call) */
  async sendToMultiple(
    fcmTokens: string[],
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<void> {
    if (!this.app || fcmTokens.length === 0) return;

    const message: MulticastMessage = {
      tokens: fcmTokens,
      notification: { title, body },
      data,
      android: { priority: 'high' },
    };

    try {
      const response = await this.app.messaging().sendEachForMulticast(message);
      this.logger.debug(
        `Multicast: ${response.successCount} sent, ${response.failureCount} failed`,
      );
    } catch (err) {
      this.logger.error('Multicast send failed:', err);
    }
  }
}
