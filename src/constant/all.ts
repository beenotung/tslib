import {facebook} from './facebook';
import {ionic} from './ionic';
import {notification} from './notification';

export const constant = Object.assign({}
  , ionic.constant
  , notification.constant
  , facebook.constant,
);
