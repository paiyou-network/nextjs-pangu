import internal from './internal'
// eslint-disable-next-line import/no-cycle
import Consumer from './Consumer'

const ActionCable = {
  createConsumer: (url, jwtToken = null) => {
    let _url
    if (url == null) {
      const configUrl = ActionCable.getConfig('url')
      if (configUrl === null) {
        _url = internal.default_mount_path
      } else {
        _url = configUrl
      }
    } else {
      _url = url
    }
    if (jwtToken) {
      internal.jwtToken = jwtToken
    }
    return new Consumer(ActionCable.createWebSocketURL(_url))
  },

  getConfig: name => {
    const element = document.head.querySelector(`meta[name='action-cable-${name}']`)
    return element != null ? element.getAttribute('content') : void 0
  },

  createWebSocketURL: url => {
    if (typeof url === 'function') {
      // eslint-disable-next-line no-param-reassign
      url = url()
    }
    if (url && !/^wss?:/i.test(url)) {
      const a = document.createElement('a')
      a.href = url
      // eslint-disable-next-line no-self-assign
      a.href = a.href
      a.protocol = a.protocol.replace('http', 'ws')
      return a.href
    }
    return url
  },
  startDebugging: () => {
    ActionCable.debugging = true
    return ActionCable.debugging
  },
  stopDebugging: () => {
    ActionCable.debugging = null
    return ActionCable.debugging
  },
  log: (...args) => {
    if (ActionCable.debugging) {
      const ref = console
      args.push(Date.now())
      return ref.log.apply(ref, ['[ActionCable]', ...args])
    }
    return null
  }
}

export default ActionCable
