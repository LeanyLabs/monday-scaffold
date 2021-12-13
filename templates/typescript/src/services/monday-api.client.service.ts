import initMondayClient from 'monday-sdk-js';
import { logger } from '@leanylabs/logger';
import { MAX_MONDAY_API_RETRIES, MONDAY_QUERY_INTERVAL_IN_MS } from '../config';
import { delay, watchdog } from '../utils/delay';
import { callWithRetry } from '../utils/retry';

// copy-pasted and extended from 'monday-sdk-js'
// because it's not exported and seems outdated
interface MondayServerSdk {
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

export class MondayApiClient {
  private client: MondayServerSdk;
  //TODO: possible add 'expiresAt'

  constructor(token: string) {
    this.client = initMondayClient({ token });
  }

  //TODO: make safe _api method!
  async _api(query: string, variables: any) {
    const result = await watchdog(this.client.api(query, { variables }), 60_000);
    //TODO: throw error if has one
    return result.data;
  }

  async getBoardColumnData(boardId) {
    const query = `
      query($boardId: [Int]) {
        boards(ids: $boardId) {
          columns {
            title
            type
            settings_str
          }
        }
      }`;

    const variables = { boardId };

    const response = await this._api(query,  variables );

    return response.data.boards[0].columns;
  }

  async deleteAllItemsFromTheBoard(boardId) {
    const query = `
    query($boardId: [Int] ) {
      boards (ids: $boardId) {
        items {
          id
        }
      }
    }`;

    const variables: { boardId: string | number } = {
      boardId: Number(boardId),
    };
    const response = await this.client.api(query, { variables });
    const itemIds = response.data.boards[0].items;

    for (const item of itemIds) {
      await this.deleteItem(item.id);
      await delay(MONDAY_QUERY_INTERVAL_IN_MS);
    }
  }

  async deleteItem(itemId: string | number) {
    logger.silly(`deleting Item with id ${itemId}`);
    const query = `
      mutation
        delete_item($itemId: Int!) {
          delete_item (item_id: $itemId) {
            id
          }
        }
    `;

    const variables = { itemId: Number(itemId) };

    try {
      const response = await this.client.api(query, { variables });

      return response;
    } catch (error) {
      logger.error(`Failed to delete Item`, error, { itemId });
    }
  }

  async getColumnValue(itemId: string, columnId: string) {
    const query = `
      query($itemId: [Int], $columnId: [String]) {
        items (ids: $itemId) {
          column_values(ids:$columnId) {
            value
          }
        }
      }
    `;

    const variables = { columnId, itemId };
    const response = await this.client.api(query, { variables });

    return response.data.items[0].column_values[0].value;
  }

  async checkIfItemExistsById(itemId: string): Promise<boolean> {
    const query = `
      query($itemId: [Int]) {
        items (ids: $itemId) {
          id
        }
      }`;

    const variables = { itemId: Number(itemId) };
    const response = await this.client.api(query, { variables });

    return !!response?.data?.items?.length;
  }

  @retry()
  async createItem(boardId: number, columnValues: string, itemName: string) {
    const query = `
      mutation
        create_item ($boardId: Int!, $columnValues: JSON!, $itemName: String!) {
          create_item (board_id: $boardId, item_name: $itemName, column_values: $columnValues,  create_labels_if_missing: true ) {
            id
          }
        }`;

    const variables = { boardId, columnValues, itemName };
    const response = await this.client.api(query, { variables });

    return response;
  }

  @retry()
  async updateItem(boardId: number, columnValues: string, itemId: string) {
    const columnValuesToUpdate = JSON.parse(columnValues);

    delete columnValuesToUpdate.__groupId__;
    delete columnValuesToUpdate.name;

    columnValues = JSON.stringify(columnValuesToUpdate);

    const query = `
      mutation change_multiple_column_values ($boardId: Int!, $itemId: Int!, $columnValues: JSON!) {
        change_multiple_column_values (board_id: $boardId, item_id: $itemId, column_values: $columnValues) {
          id
        }
      }`;

    const variables = { boardId, itemId: Number(itemId), columnValues };
    const response = await this.client.api(query, { variables });

    return response;
  }

  @retry()
  async changeColumnValue(
    boardId: string,
    itemId: string,
    columnId: string,
    value: any
  ) {
    const query = `
      mutation change_column_value($boardId: Int!, $itemId: Int!, $columnId: String!, $value: JSON!) {
        change_column_value(board_id: $boardId, item_id: $itemId, column_id: $columnId, value: $value) {
          id
        }
      }
    `;

    const variables = { boardId, columnId, itemId, value };
    const response = await this.client.api(query, { variables });

    return response;
  }

  @retry()
  async createColumns(boardId: number) {
    const query = `
      mutation create_column($boardId: Int!, $title: String!, $column_type: ColumnType!, $defaults: JSON!) {
        create_column (board_id: $boardId, title: $title, column_type: $column_typem, defaults: $defaults) {
          id
        }
      }
    `;

    const variables = { boardId };
    const response = await this.client.api(query, { variables });

    return response;
  }
}

//TODO: remove it
function retry() {
  return function decorator(
    target: any,
    propName: string,
    descriptor: TypedPropertyDescriptor<(...params: any[]) => any>
  ) {
    const oldFunc = descriptor.value;

    descriptor.value = async function () {
      return await callWithRetry(
        async () => {
          // eslint-disable-next-line prefer-rest-params
          return await oldFunc.apply(this, arguments);
        },
        MAX_MONDAY_API_RETRIES,
        MONDAY_QUERY_INTERVAL_IN_MS
      );
    };
  };
}
