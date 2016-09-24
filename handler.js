import process from 'process';
import dogapi from 'dogapi';
import Promise from 'bluebird';
import { buildSpeechletResponse, buildResponse } from './lib/helpers';

const queryDatadog = Promise.promisify(dogapi.metric.query);

function queryCPU() {
  const now = parseInt(new Date().getTime() / 1000);
  const then = now - 300;
  const query = 'system.cpu.user{*}by{host}';
  
  return queryDatadog(then, now, query)
    .then(res => res.series.map(reading => ({
      name: reading.scope
                   .replace(/^host:/i, '')
                   .replace(/(\..*$)/i, '')
                   .replace(/\W/g, ' '),
      value: reading.pointlist[reading.pointlist.length - 1][1]
    })));
}

function processIntent(intentRequest, session) {
  const intent = intentRequest.intent;

  if (intent.name === 'QueryIntent') {
    const querySlot = intent.slots.Query;
    
    if (querySlot.value && querySlot.value.toLowerCase() === 'cpu') {
      return queryCPU().then(readings => {
        const hostSpeechFragments = readings.map(reading =>
          `${reading.name} is at ${Math.round(reading.value*100)/100}%`).join('. ');
        const speechOutput = `Here are the current CPU loads. ${hostSpeechFragments}`;
        
        return buildSpeechletResponse(
          'CPU Load', 
          speechOutput,
          null, 
          true);
      });
    }
  }
  
  return Promise.resolve(buildSpeechletResponse(
    'Datadog Query',
    'Sorry, I don\'t know that query',
    null,
    true
  ));
}

module.exports.queryDatadog = (event, context, callback) => {
  dogapi.initialize({
    api_key: 'TODO',
    app_key: 'TODO'
  });
  
  if (event.request.type === 'IntentRequest') {
    processIntent(event.request, event.session)
      .then(speechletResponse =>
        context.succeed(buildResponse({}, speechletResponse)));
  }
};