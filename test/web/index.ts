// this file should be loaded by `npx parcel serve test/web/index.html`
import { Stream } from 'stream'
import { setWindowProp } from '../../src/window'
import * as lib from '../../src/dom'

setWindowProp('lib', lib)

setWindowProp('Stream', Stream)
