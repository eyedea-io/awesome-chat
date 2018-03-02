import {types, getRoot, flow} from 'mobx-state-tree'
import {IStore} from '.'
import {syncano} from '../utils'
import {User} from './user'
import { subscribe } from '../utils/syncano';

export const Message = types
  .model('Message', {
    id: types.identifier(types.number),
    author: User,
    content: types.string
  })

export const ChatStore = types
  .model('ChatStore', {
    messages: types.optional(types.array(Message), []),
    pending: types.optional(
      types.map(types.maybe(types.string)),
      types.map(types.string).create()
    )
  })
  .actions(self => ({
    handlePolledMessage: (message: IMessage) => {
      self.messages.push(message)
    }
  }))
  .actions(self => ({
    fetchMessages: flow(function * () {
      try {
        self.pending.set('message.list')
        self.messages = yield syncano('api/message/list')
      } catch (err) {
        // TODO: Handle error
        console.warn(err)
      } finally {
        self.pending.delete('message.list')
      }
    }),
    pollMessages() {
      subscribe(
        'api/message/poll',
        ({payload}) => self.handlePolledMessage(payload)
      )
    },
    createMessage: flow(function * (content: string) {
      try {
        self.pending.set('message.create')
        yield syncano('api/message/create', {content})
      } catch (err) {
        // TODO: Handle error
        console.warn(err)
      } finally {
        self.pending.delete('message.create')
      }
    })
  }))

export type IMessage = typeof Message.Type
export type IChatStore = typeof ChatStore.Type
