// sentry.io
if (process.env.DYNO) { // only on heroku (not when run locally)
  var Raven = require('raven');
  Raven.config('https://1dc065125aa542f4a77ecc56feb511b3@sentry.io/1231792').install();
}
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const bodyParser = require('body-parser')
const form = require('express-form')
const field = form.field;

var writtenNumber = require('written-number');
writtenNumber.defaults.lang = 'fr';

express()
  .use(bodyParser())
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .post('/generate',
       form(
         field("unit").required(),
         field("start_date").required(),
         field("rent_amount").required(),
         field("tenant_name").required(),
         field("tenant_address").required(),
         field("cotenant_name"),
         field("cotenant_address"),
         field("caution_name"),
         field("caution_address"),
         field("landlord_name").required(),
         field("landlord_address").required()
       ),
       function(req, res) {
         console.log("complete body response:", req.body);
         console.log("complete form:", req.form);
         if (!req.form.isValid) {
           console.log(req.form.errors);
         } else {
           console.log("tenant_name:", req.form.tenant_name);
           console.log("tenant_address:", req.form.tenant_address);
           req.form.rent_amount_written = writtenNumber(req.form.rent_amount);
           res.render('pages/lease.ejs', req.form)
         }
       }
  )
  .listen(PORT, () => console.log(`Listening on http://localhost:${ PORT }`))
