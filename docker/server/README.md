

## SSL Setup

1. Go to https://dash.cloudflare.com/profile/api-tokens
2. Create Token
3. Click use template for "Zone DNS"
4. Click the edit button next to "Token Name" and give it a proper name
5. Choose a zone, or just choose "All Zones"
6. Click "continue to summary"
7. Copy the token
8. Paste it in bellow as `THE_TOKEN`
9. Get Account ID and Zone ID. Google how to do this, its super simple.

Run `curl https://get.acme.sh | sh -s email=hacksu@cs.kent.edu` to install acme.sh

Add this to `/root/.acme.sh/account.conf`
```bash
CF_Token=THE_TOKEN
CF_Email="hacksu@cs.kent.edu"
CF_Account_ID="ACCOUNT_ID"
CF_Zone_ID="ZONE_ID"
```
Be sure to replace those constants with the right data.


Now, you can run acme.sh commands with cloudflare as the dns verification method.
```bash
# Register dev.khe.io and *.dev.khe.io
acme.sh  --issue -d dev.khe.io -d '*.dev.khe.io' --dns dns_cf
```
