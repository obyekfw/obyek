const request = require("supertest");

function testRequest(route){
  return request(route.route.wrap())
}
module.exports=testRequest
