const test = require('node:test')
const assert = require('node:assert/strict')
const http = require('node:http')
const { URLSearchParams } = require('node:url')

const app = require('../index')

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer(app)
    server.listen(0, '127.0.0.1', () => resolve(server))
  })
}

function request(server, method, pathname, body) {
  const { port } = server.address()

  return new Promise((resolve, reject) => {
    const request = http.request(
      {
        hostname: '127.0.0.1',
        port,
        path: pathname,
        method,
        headers: body
          ? {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Content-Length': Buffer.byteLength(body),
            }
          : undefined,
      },
      (response) => {
        let responseBody = ''

        response.setEncoding('utf8')
        response.on('data', (chunk) => {
          responseBody += chunk
        })
        response.on('end', () => {
          resolve({ statusCode: response.statusCode, body: responseBody })
        })
      }
    )

    request.on('error', reject)

    if (body) {
      request.write(body)
    }

    request.end()
  })
}

test('serves the landing page and generates an information document', async (t) => {
  const server = await startServer()
  t.after(() => server.close())

  const landingPage = await request(server, 'GET', '/')
  assert.equal(landingPage.statusCode, 200)
  assert.match(landingPage.body, /Lease generator/)

  const form = new URLSearchParams({
    unit: 'appart_belvedere_strasbourg',
    rent_amount: '750',
    landlord_name: 'Alice Example',
    landlord_email: 'alice@example.com',
    landlord_phone: '0123456789',
  }).toString()

  const informationDocument = await request(server, 'POST', '/generate_information_document', form)
  assert.equal(informationDocument.statusCode, 200)
  assert.match(informationDocument.body, /FICHE DʼINFORMATION LOCATAIRE/)
  assert.match(informationDocument.body, /750 € \/ mois/)
  assert.match(informationDocument.body, /Alice Example - alice@example.com - 0123456789/)
})