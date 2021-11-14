# using crm search

https://developers.hubspot.com/docs/api/crm/search


```
curl https://api.hubapi.com/crm/v3/objects/tickets/search?hapikey=YOUR_HUBSPOT_API_KEY \
  --request POST \          
  --header "Content-Type: application/json" \
  --data '{
    "filters": [
      {
        "propertyName": "associations.contact",
        "operator": "EQ",
        "value": "123"
      }
    ]
  }'
```

