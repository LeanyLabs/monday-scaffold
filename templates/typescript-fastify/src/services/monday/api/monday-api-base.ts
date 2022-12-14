import { logger } from '@leanylabs/logger';
import { secondsToMilliseconds } from 'date-fns';
import initMondayClient from 'monday-sdk-js';
import { watchdog } from '~/utils/delay';
import { TimeoutError } from '~/utils/timeout-error';


export interface MondayServerSdk {
  setToken(token: string): void;

  api(
    query: string,
    options?: Partial<{ token: string; variables: any }>
  ): Promise<any>;

  oauthToken(
    code: string,
    clientId: string,
    clientSecret: string
  ): Promise<any>;
}

export class MondayApiBase {
  protected expiresAt: number;
  protected client: MondayServerSdk;

  constructor(token: string, exp: number = Number.MAX_VALUE) {
    this.client = initMondayClient({ token });
    this.expiresAt = secondsToMilliseconds(exp);
  }

  async oauthToken(code: string, clientId: string, clientSecret: string) {
    return await this.client.oauthToken(code, clientId, clientSecret);
  }

  protected async api(query: string, variables: any = {}) {
    try {
      return this.unsafeApiCall(query, variables);
    } catch (error) {
      const details = {
        query,
        variables,
        error,
        message: error.message,
        response: error.response
      };
      if (error instanceof TimeoutError || error.isWarning) {
        logger.warn('Monday Api call failed', details);
      } else {
        logger.error('Monday Api call failed', details);
      }
      throw error;
    }
  }

  private async unsafeApiCall(query: string, variables: any = {}) {
    const response = await watchdog(
      this.client.api(query, { variables }),
      60_000
    );
    return this.checkApiError(response);
  }

  private checkApiError(response: any) {
    const errorMessage =
      response.errors?.[0] ||
      response.error_message ||
      response.data?.error_code;

    if (errorMessage) throw new MondayError(errorMessage);

    return response.data ? response.data : response;
  }
}

export class MondayError extends Error {
  response: any;

  constructor(message: string, response?: any) {
    super(message);
    this.response = response;
  }

  get isWarning() {
    return false;
  }
}
