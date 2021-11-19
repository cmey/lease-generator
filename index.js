// datadog integration
if (process.env.DYNO) { // only on heroku (not when run locally)
  var StatsD = require('hot-shots');
  var dogstatsd = new StatsD();
  // Increment a counter.
  dogstatsd.increment('page.views')
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
  .post('/generate_lease',
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
         console.log("route generate_lease:");
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
  .post('/generate_information_document',
       form(
         field("unit").required(),
         field("rent_amount").required(),
         field("landlord_name").required(),
         field("landlord_email").required(),
         field("landlord_phone").required()
       ),
       function(req, res) {
         console.log("route generate_information_document:");
         console.log("complete body response:", req.body);
         console.log("complete form:", req.form);
         if (!req.form.isValid) {
           console.log(req.form.errors);
         } else {
           console.log("unit:", req.form.tenant_name);
           req.form.rent_amount_written = writtenNumber(req.form.rent_amount);
           res.render('pages/information_document.ejs', req.form)
         }
       }
  )
  .listen(PORT, () => console.log(`Listening on http://localhost:${ PORT }`))
