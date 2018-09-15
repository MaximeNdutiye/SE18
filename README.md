### MongoDB 
https://docs.atlas.mongodb.com/driver-connection/#node-js-driver-example
https://hackernoon.com/restful-api-design-with-node-js-26ccf66eab09
https://www.w3schools.com/nodejs/nodejs_mongodb_create_db.asp
https://mongoosejs.com/docs/subdocs.html

### Deploying to AWS EKS
https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html
https://aws.amazon.com/blogs/aws/amazon-eks-now-generally-available/

### APIS
https://docs.microsoft.com/en-us/azure/architecture/best-practices/api-design

Question 1: Please design a web API that models the following simple relationship: 

GET 

/shops => all shops
/shops/:id => specific shop details

/orders => ERR
/products => ERR

/orders/:id => get specific order details
/products/:id => get specific product details

/lineitems => ERR
/lineitems/:id => get specific line item


| Resource | GET                          | POST              | PUT                   | DELETE        |
|----------|------------------------------|-------------------|-----------------------|---------------|
| /shops   | get all shops                | create a new shop | Bulk create shops     | ERR           |
| /shops/1 | Get details for shop w/ id=1 | ERR               | Update shop 1 details | Delete shop 1 |
|          |                              |                   |                       |               |

Shops have many Products 
Shops have many Orders
Products have many Line Items
Orders have many Line Items

Line items refer to any service or product added to an order, along with any quantities, rates, and prices that pertain to them.


[{"name": "one", "value": "10", "lineItems": [{"name": "1", "value": "10"},{"name": "2", "value": "10"}]},
{"name": "two", "value": "10", "lineItems": [{"name": "3", "value": "10"},{"name": "4", "value": "10"}]}]
