#API Documentation

A card is a json object that will contain either content of a card, or
references to content of a card. A request of the form

    <url>/card/[number]

will return a json object.

    {
        "type": "card",
        "word": <card word>,
        "media":[{
            "type": <either "video", "audio" or "image">,
            "url": <url of the content>
        }],
        "definition": <definition of word>,
    }



##Making a card

Post a json object to `<url>/card` with the following object

```
{
    media: [{
        type: <STRING>
        url: <URL>
        text: <STRING>
    },...]
}
```

In angular this winds up being

```
    $http({
        method: 'POST',
        url: <SERVER>,
        data:{ 'media' : <LIST OF MEDIA> }
    });
```

and a media object is the following

```
    {
        type: <STRING> (REQUIRED),
        url: <URL> (OPTIONAL),
        text: <STRING> (OPTIONAL)
    }
```
