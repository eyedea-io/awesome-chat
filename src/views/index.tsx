import * as React from 'react'
import * as Router from 'react-router-dom'
import {Head, Page, List, Wrapper, Spinner, Input} from '../components'
import {IStore} from '../types'
import {APP_TITLE, CSS} from '../constants'
import {inject, observer} from 'mobx-react'

interface Props extends Router.RouteComponentProps<{}> {
  store: IStore
}

@inject('store')
@observer
class IndexView extends React.Component<Props> {
  private readonly title = APP_TITLE
  private readonly formName = 'Chat'
  private readonly formFields = {
    message: {}
  }

  private get isFetchingMessages() {
    return this.props.store.chatStore.pending.has('message.list')
  }

  private get messages() {
    return this.props.store.chatStore.messages
  }

  private get form() {
    return this.props.store.formStore.get(this.formName)
  }

  async componentDidMount() {
    await this.props.store.chatStore.fetchMessages()
    this.props.store.chatStore.pollMessages()
  }

  componentWillMount() {
    this.props.store.formStore.add(this.formName, this.formFields)
  }

  renderMessages = () => {
    return (
      <List>
        {this.messages.map(message => (
          <div key={message.id}>
            <b>{message.author.displayName}</b>: {message.content}
          </div>
        ))}
      </List>
    )
  }

  handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      await this.props.store.chatStore.createMessage(this.form.data.message)
      this.form.handleChange('message', '')
    } catch (err) {
      //
    }
  }

  render() {
    return (
      <Page>
        <Head>
          <title>{this.title}</title>
        </Head>

        <Wrapper>
          <div className="View">
            <h1 className="u-mb">Webmaster Kit</h1>

            <List horizontal spacing="sm">
              {this.props.store.userStore.isLoggedIn ? this.renderUserNav() : this.renderGuestNav()}
            </List>

            <div className="u-mt">
              {this.isFetchingMessages ? <Spinner /> : this.renderMessages()}
            </div>

            <div className="u-mt">
              <form onSubmit={this.handleSubmit}>
                <Input value={this.form.fields.message.value} {...this.form.editable('message')} />
              </form>
            </div>
          </div>
        </Wrapper>

        <style jsx>{`
          .View {
            margin-left: auto;
            margin-right: auto;
            max-width: 480px;
            padding: ${CSS.spacing} 0;
          }
        `}</style>
      </Page>
    )
  }

  renderUserNav = () => (
    <React.Fragment>
      <Router.Link to="/auth/logout">Sign out</Router.Link>

      <a onClick={() => this.props.store.modal.open('profile')}>
        My profile
      </a>
    </React.Fragment>
  )

  renderGuestNav = () => (
    <React.Fragment>
      <Router.Link to="/auth/login">Sign in</Router.Link>
      <Router.Link to="/auth/register">Create account</Router.Link>
    </React.Fragment>
  )
}

export {IndexView}
