import { Stream } from 'stream'
import { setWindowProp } from '../../src'
import * as lib from '../../src/index'

setWindowProp('lib', lib)

setWindowProp('Stream', Stream)
