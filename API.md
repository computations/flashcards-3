#API Documentation

A card is a json object that will contain either content of a card, or
references to content of a card. A request of the form

    <url>/cards/[number]

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


