import {ionic} from "./ionic";
import {notification} from "./notification";
import {facebook} from "./facebook";

export const constant = Object.assign({}
  , ionic.constant
  , notification.constant
  , facebook.constant
);
