import { FastifyRequest } from 'fastify';
import { MondayApi } from '~/services/monday/api';


export type TriggerBody = {
  payload: {
    webhookUrl: string;
    subscriptionId: number;
    blockMetadata: any;
    inboundFieldValues: any;
    inputFields: any
    recipeId: number;
    integrationId: number;
  }
};

export type ActionBody = {
  payload: {
    blockKind: string;
    blockMetadata: any;
    inboundFieldValues: Record<string, any>;
    inputFields: Record<string, any>;
    recipeId: number;
    integrationId: number;
  }
};


interface SessionDetails {
  accountId: number;
  userId: number;
  backToUrl: string | undefined;
  shortLivedToken: string | undefined;
  apiClient: MondayApi;
}

export interface MondayRequest<B = any, Q = any> extends FastifyRequest {
  session: SessionDetails;
  body: B;
  query: Q;
}