const {wrap} = require('co');
const {join} = require('path');
const moment = require('moment');
const pdf = require('html-pdf');
const thunkify = require('thunkify');
const read = thunkify(require('fs').readFile);
const handlebars = require('handlebars');

const pdf_options = {format: 'A4', quality: 300};







const generatePDF = wrap(function * () {
	const data = {
		mycompany: {
			name: 'GeeX',
			address: 'Street 1',
			city: 'Amsterdam',
			zipcode: '1000 AA'
		},
		customer: {},
		invoice_no: generateInvoiceNo(),
		date_created: moment().format('DD/MM/YYYY'),
		date_due: moment().add(14, 'days').format('DD/MM/YYYY')
	};

	data.customer = {
		org: 'Your Org',
		name: 'Foo Bar',
		email: 'mail@domain.com'
	};

	const source = yield read(join(`${__dirname}/template.html`), 'utf-8');

	const template = handlebars.compile(source);
	const html = template(data);

	const p = pdf.create(html, pdf_options);
	p.toFile = thunkify(p.toFile);

	yield p.toFile(`${join(__dirname, 'invoice.pdf')}`);

});


function generateInvoiceNo() {
	return moment().format('YYYYMMDD');
}


generatePDF();
