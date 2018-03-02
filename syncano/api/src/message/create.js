import Syncano from '@syncano/core'
import {MODELS} from '../constants'

export default async ctx => {
  const {data, channel, response, logger} = new Syncano(ctx)
  const {info, error, warn} = logger('api:message/create')

  if (!ctx.meta.user) {
    warn('Unauthorized request.')
    response.json({message: 'Unauthorized.'}, 401)
    return
  }

  if (!ctx.args.content) {
    warn('Content is required.')
    response.json({message: 'Content is required.'}, 400)
    return
  }

  try {
    const message = await data
      .message
      .fields(MODELS.message)
      .with('author')
      .create({
        author: ctx.meta.user.id,
        content: ctx.args.content
      })

    channel.publish(`messages`, message)

    info(`Successfuly created message`)
    response.success(message)
  } catch (err) {
    console.log(err)
    error(err)
    response.fail({message: err.response}, 400)
  }
}
