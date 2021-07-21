const json = { headers: { "Content-Type": "application/json" } }
const help = `
# dappinfo
Discord Application Information Finder

Endpoint:
/apps/{application_id}


Example:

---REQUEST---
GET /apps/763033945767280650


---RESPONSE---
200 OK
Content-Length: 629
Content-Type: application/json

{
  "success": true,
  "application": {
    "bot": {
      "id": "763033945767280650",
      "username": "lofi girl v2",
      "avatar": "69e2a6ad9703274d0f109a2b88f290af",
      "discriminator": "7039",
      "public_flags": 65536,
      "bot": true,
      "approximate_guild_count": 2080
    },
    "id": "763033945767280650",
    "name": "lofi girl",
    "icon": "69e2a6ad9703274d0f109a2b88f290af",
    "description": "",
    "summary": "",
    "hook": true,
    "bot_public": true,
    "bot_require_code_grant": false,
    "verify_key": "46b4ae375ca8d0abfd7770944219be15a3c5adfc8cca0d3d70566d93454101d7",
    "flags": 0
  }
}


Contact:

Park Min Hyeok <pmhstudio.pmh@gmail.com>


COPYING:

Copyright 2021. PMH. MIT Licensed.
`

addEventListener("fetch", (event) => {
  event.respondWith(
    handleRequest(event.request).catch(
      (err) => new Response(`{"success":false,"message":"${err.stack}"}`, { status: 500, ...json })
    )
  )
})

async function handleRequest(request) {
  const { pathname } = new URL(request.url)
  const [, , id] = pathname.split("/")
  
  if (pathname.startsWith("/apps/")) {
    if (Number.isNaN(Number(id)) || Number(id) < 0) return new Response(`{"success":false,"message":"${id} is not a valid snowflake string"}`, { status: 400, ...json })
    const res = await fetch(`https://discord.com/api/v9/oauth2/authorize?client_id=${encodeURIComponent(id)}&scope=bot`, { headers: { Authorization } }).then((res) => res.json())
    if (res.message) return new Response(`{"success":false,"message":"${res.message}"}`, { status: 404, ...json })
    return new Response(JSON.stringify({ success: true, application: { bot: res.bot, ...res.application } }, null, 2), json)
  }

  return new Response(help)
}
