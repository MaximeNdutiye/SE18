var chai = require('chai')
  , chaiHttp = require('chai-http');

chai.use(chaiHttp);

chai.request('http://35.203.27.79:3000')
  .get('/shops')
  .end(function (err, res) {
    expect(err).to.be.null;
    expect(res).to.have.status(200);
  });