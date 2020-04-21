import { constant } from '../dist/constant/all'
import { ionic } from '../dist/constant/ionic'
import { notification } from '../dist/constant/notification'

console.log({ ionic: ionic.constant })
console.log({ notification: notification.constant })
console.log({ all: constant })

console.log(ionic.constant.back)
console.log(constant.back)
// console.log(constant.not);
console.log(constant.denied)
