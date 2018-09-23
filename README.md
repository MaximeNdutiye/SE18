# SE18
Shops API built with NodeJs, Express, and Mongo

### GCP Deployment Endpoint
I have a live version of the api deployed over at
[http://35.203.27.79:3000/shops](http://35.203.27.79:3000/shops)

### Example API Calls
Here is some [documention](https://www.getpostman.com/collections/073d6f2ca5e3c9c23d01)
created with Postman.

### Local Testing and Development
The application can also be run locally using

```
docker build -t maxime-shopify-image .

docker run --name maxime-shopify-api -p 3000:3000 maxime-shopify-image
```

### Implemented API methods
Here are the methods that are implemented for the API

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


# Instruction for Deploying to GCP

Set default project id

```
gcloud config set project {PROJECT_ID}
``` 

Create a cluster

```
gcloud container clusters create shopify-app-cluster --zone northamerica-northeast1-a --machine-type f1-micro
```

Build image from docker file

```
docker build -t gcr.io/{PROJECT_ID}/shopify-image:v1 .
``` 

Push the image to GCR
```
gcloud docker -- push gcr.io/{PROJECT_ID}/shopify-image:v1
```

Deploy app
```
kubectl create -f deployment.yml --save-config
```

Expose the app to the internet

```
kubectl expose deployment shopify-deployment --type="LoadBalance"
```

Get the external ip of the deployment

```
kubectl get services
```

Clean up deployment

```
$ kubectl delete service/kubernetes
$ kubectl delete deployment/shopify-deployment
$ gcloud container clusters delete shopify-app-cluster --zone northamerica-northeast1-a
```

### Access the mongo db from the command line

`mongo "mongodb+srv://<cluster-name>.mongodb.net/<dbname>" --username <user>`

Built with :purple_heart: by Maxime
