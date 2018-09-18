# SE18
Shops API built with NodeJs, Express, and Mongo

### Implemented API methods

| Resource                | GET                     | POST          | PUT                     | DELETE           |
|-------------------------|-------------------------|---------------|-------------------------|------------------|
| /shops                  | get all shops           | create a shop | add & update properties | -                |
| /shops/:id              | Get details for a shop  | -             | Update shop 1 details   | Delete a shop    |
| /shops/:id/products     | get products for a shop | -             | add a product to a shop | -                |
| /products/:id           | get a product           | -             | add a lineitem          | delete a product |
| /products/:id/lineitems | get product lineitems   | -             | -                       | -                |
| /orders/:id             | get a product           | -             | add a lineitem          | delete a product |
| /order/:id/lineitems    | get orderlineitems      | -             | -                       | -                |
| /lineitems/:id          | line item details       | -             | update properties       | delete item      |
|                         |                         |               |                         |                  |

### Example calls
Create a new store with products that have line items.
`POST` to `\shops` with

Request Body:

```
{
    "name": "Al Harrington's Wacky Waving Inflatable Arm-Flailing Tubeman Emporium and Warehouse",
    "owener": "Al Harrington",
    "products": [
    {
        "name": "Wacky Waving Inflatable Arm-Flailing Tubeman",
        "lineItems": [
        {
            "name": "A Blue One",
            "value": "100"
        }
        ]
    },
    {
        "name": "Intergalactic Proton-Powered Electrical Tentacled Advertising Droids",
    }
    ],
    "orders": []
}
```
access db
`mongo "mongodb+srv://cluster0-9peje.mongodb.net/test" --username dbuser`

Built with :purple_heart: by Maxime