import { TRANSFORMATION_TYPES } from '../constants';

export function getRemoteListOptions(req, res) {
  return res.status(200).send(TRANSFORMATION_TYPES);
}
