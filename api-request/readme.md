# Not wrapped endpoint(s)

It is possible to access the hubspot request method directly,
it could be handy if wrapper doesn't have implementation for some endpoint yet.
Using of exposed request method benefits by the bottleneck throttling, auth and request parsing and formatting already in place

```javascript
hubspot.apiRequest({
            method: 'PUT',
            path: '/some/api/not/wrapped/yet',
            body: { key: 'value' },
          })
```

Also it is possible to overlap hubspot base API URL using `overlapUrl` parameter

```javascript
hubspot.apiRequest({
            method: 'GET',
            overlapUrl: 'https://api.hubspot.com/some/alternative/api',
          })
```
