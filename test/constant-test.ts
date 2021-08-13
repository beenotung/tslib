import { constant } from '../src/constant/all'
import { ionic } from '../src/constant/ionic'
import { notification } from '../src/constant/notification'

console.log({ ionic: ionic.constant })
console.log({ notification: notification.constant })
console.log({ all: constant })

console.log(ionic.constant.back)
console.log(constant.back)
// console.log(constant.not);
console.log(constant.denied)
