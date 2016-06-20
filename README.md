# alexa-datadog-sample

This is a simple example of integrating Datadog with an Amazon Echo. This is written on top of the [Serverless framework](http://serverless.com/) to simplify development and deployment, but that's not important to the implementation.

Currently the only supported query is to ask for CPU levels, which will list out the current CPU values for all hosts in your account. For example, saying:

> Alexa, ask Datadog to check the CPU

will result in a response along the lines of:

> Here are the current CPU loads. Gregs MacBook Pro is at 7%. Gregs iMac is at 4%

<iframe width="100%" height="80" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/269945578&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true"></iframe>

# Interaction Model

Here's an example of how to set up an interaction model for this skill. 

## Intent Schema

```language-json
{
  "intents": [
    {
      "intent": "QueryIntent",
      "slots": [
        {
          "name": "Query",
          "type": "QUERY_LIST"
        }
      ]
    }
  ]
}
```

## Custom Slot Types

Type       | Values	
---------- | ------
QUERY_LIST | cpu

## Sample Utterances

```
QueryIntent query {Query}
QueryIntent check {Query}
QueryIntent to query {Query}
QueryIntent to check {Query}
QueryIntent to query the {Query}
QueryIntent to check the {Query}
```

# Additional Configuration

You'll also need to supply your Datadog API and app keys in order for the queries to work properly. These should be add as Serverless variables, such as through the `_meta/variables/s-variables-dev.json` file. Here's the format you'll want to use in that file:

```language-json
{
  "datadogApiKey": "your-api-key-here",
  "datadogAppKey": "your-app-key-here"
}
```
