import { logger } from '@leanylabs/logger';
import { secondsToMilliseconds } from 'date-fns';
import { MondayApiBase } from '~/services/monday/api/monday-api-base';
import { delay } from '~/utils/delay';


export class MondayApi extends MondayApiBase {
  async complexity() {
    const query = `query {
      complexity {
        before
        reset_in_x_seconds
      }
    }`;

    return await this.api(query, {});
  }

  async checkEnoughComplexity(neededComplexity: number) {
    const { complexity } = await this.complexity();
    // eslint-disable-next-line camelcase
    const { before, reset_in_x_seconds } = complexity;
    if (before < neededComplexity) {
      // eslint-disable-next-line camelcase
      logger.info(`wait for complexity ${reset_in_x_seconds} second`);
      await delay(secondsToMilliseconds(reset_in_x_seconds));
    }
  }

  async sendNotification(
    userId: number,
    targetId: number,
    text: string,
    targetType = 'Project'
  ) {
    const query = `
      mutation
        create_notification($userId: Int!, $targetId: Int!, $text: String!, $targetType: NotificationTargetType!  ) {
          create_notification (user_id: $userId, target_id: $targetId, text: $text, target_type: $targetType) {
              text
            }
          }
    `;

    const variables = { userId, targetId, text, targetType };

    return await this.api(query, variables);
  }

  async deleteItem(itemId: string | number) {
    const query = `
      mutation
        delete_item($itemId: Int!) {
          delete_item (item_id: $itemId) {
            id
          }
        }
    `;

    const variables = { itemId: Number(itemId) };

    const response = await this.api(query, variables);

    return response.delete_item?.id;
  }

  async createGroup(boardId: number, groupName: string) {
    const query = `
      mutation create_group($boardId: Int!, $groupName: String!) {
        create_group(board_id: $boardId, group_name: $groupName) {
          id
        }
      }
    `;
    const variables = { boardId, groupName };

    const response = await this.api(query, variables);
    return response.create_group;

  }

  async createItem(
    boardId: number,
    itemName: string,
    columnValues: string,
    groupId: string = ''
  ) {
    const columnValuesToUpdate = JSON.parse(columnValues);
    delete columnValuesToUpdate.__groupId__;
    columnValues = JSON.stringify(columnValuesToUpdate);

    const query = `
      mutation
        create_item ($boardId: Int!, $groupId: String!, $columnValues: JSON!, $itemName: String!) {
          create_item (board_id: $boardId, group_id: $groupId, item_name: $itemName, column_values: $columnValues, create_labels_if_missing: true ) {
            id
          }
        }`;

    const variables = { boardId, groupId, columnValues, itemName };

    const response = await this.api(query, variables);

    return response.create_item?.id;
  }

  async updateItem(
    boardId: number,
    itemId: string | number,
    columnValues: string
  ) {
    const columnValuesToUpdate = JSON.parse(columnValues);
    delete columnValuesToUpdate.__groupId__;
    columnValues = JSON.stringify(columnValuesToUpdate);

    const query = `
      mutation change_multiple_column_values ($boardId: Int!, $itemId: Int!, $columnValues: JSON!) {
        change_multiple_column_values (board_id: $boardId, item_id: $itemId, column_values: $columnValues, create_labels_if_missing: true) {
          id
        }
      }`;

    const variables = { boardId, itemId: Number(itemId), columnValues };

    return await this.api(query, variables);
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
    const response = await this.api(query, variables);

    return response.items[0].column_values[0].value;
  }

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
    const response = await this.api(query, variables);

    return response;
  }

  async changeColumnTitle(boardId: number, columnId: string, title: string) {
    const query = `
      mutation change_column_title($columnId: String!,  $boardId: Int!,  $title: String!) {
        change_column_title(column_id: $columnId, board_id: $boardId, title: $title) {
          id
          title
        }
      }
    `;
    const variables = { boardId, title, columnId };
    const response = await this.api(query, variables);

    return response;
  }

  async createColumn(boardId: number, title: string) {
    const query = `
      mutation create_column($boardId: Int!, $title: String!) {
        create_column(column_type: text, board_id: $boardId, title: $title) {
          id
          title
        }
      }
    `;
    const variables = { boardId, title };
    const response = await this.api(query, variables);

    return response.create_column;
  }

  async getColumns(boardId: number) {
    const query = `
      query {
        boards(ids: [${boardId}]) {
          columns {
            title
            id
            type
          }
        }
      }
    `;
    const variables = { boardId };
    const response = await this.api(query, variables);

    return response.boards[0].columns;
  }
}
