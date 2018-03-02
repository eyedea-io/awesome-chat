import Syncano from '@syncano/core'
import {MODELS} from '../constants'

export default async ctx => {
  const {data, response, logger} = new Syncano(ctx)
  const {info, error, warn} = logger('api:message/list')

  if (!ctx.meta.user) {
    warn('Unauthorized request.')
    response.json({message: 'Unauthorized.'}, 401)
    return
  }

  try {
    const messages = await data
      .message
      .fields(MODELS.message)
      .with('author')
      .list()

    info(`Successfuly loaded messages`)
    response.success(messages)
  } catch (err) {
    error(err)
    response.fail({message: err.response}, 400)
  }
}
