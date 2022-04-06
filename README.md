# lease-generator
Generate all the paperwork to be signed for a lease agreement.

## local development
```
npm install  # install dependencies
node index.js  # run a local server
```

## devops
http://lease-generator-staging.herokuapp.com auto-deploys GitHub `master`.

When happy with the result, promote to production http://lease-generator.herokuapp.com:

```
heroku pipelines:promote -r heroku --to lease-generator
```
