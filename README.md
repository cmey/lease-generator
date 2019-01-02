# lease-generator
Generate all the paperwork to be signed for a lease agreement.

## local development
```
node index.js
```

## devops
http://lease-generator-staging.herokuapp.com auto-deploys `master`.

When happy with the result, promote to production http://lease-generator.herokuapp.com:

```
heroku pipelines:promote -r heroku --to lease-generator
```