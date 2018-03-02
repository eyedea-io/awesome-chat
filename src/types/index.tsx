import {types} from 'mobx-state-tree'
import {syncano} from '../utils'
import {FormStore, Form} from './form'
import {UserStore} from './user'
import {ChatStore} from './chat'
import {Modal} from './modal'

export const Store = types
  .model('Store', {
    modal: types.optional(Modal, {}),
    chatStore: types.optional(ChatStore, {}),
    userStore: types.optional(UserStore, {}),
    formStore: types.optional(FormStore, {})
  })

export type IStore = typeof Store.Type
export {IMessage, IChatStore} from './chat'
export {IUser, IUserStore} from './user'
export {IForm, IFormStore} from './form'
export {IModal} from './modal'
