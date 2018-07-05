import { createServer } from 'http'
import * as querystring from 'querystring'
import * as url from 'url'

import destroyer from 'server-destroy'
import open from 'open'
import { google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'

interface Options {
  scopes: string[]
}

export default class GoogleAuth {
  private options: Options
  private authorizeUrl!: string
  private oAuth2Client: OAuth2Client

  constructor(options: Options = { scopes: [] }) {
    this.options = options
    this.oAuth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URI
    )
  }

  async authenticate(scopes: string[]): Promise<OAuth2Client> {
    return new Promise((resolve: (client: OAuth2Client) => void, reject: (message: string) => void) => {
      this.authorizeUrl = this.oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes.concat(this.options.scopes).join(' ')
      })

      const server = createServer(async (req, res) => {
        try {
          if (req && req.url && req.url.indexOf('/callback') > -1) {
            const qs = querystring.parse(url.parse(req.url).query || '')
            res.end('Authentication successful!')
            server.destroy()
            const { tokens } = await this.oAuth2Client.getToken(String(qs.code))
            this.oAuth2Client.credentials = tokens
            resolve(this.oAuth2Client)
          }
        } catch(e) {
          reject(e.message)
        }
      }).listen(3000, () => {
        open(this.authorizeUrl)
      })
      destroyer(server)
    })
  }
}