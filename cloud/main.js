Parse.Cloud.define('senderChannel', function(request, response) {

  var params = request.params;
  var senderId = params.senderId;
  var sharedValue = params.sharedValue;
  var targetIds = params.targetIds;

  var pushQuery = new Parse.Query(Parse.Installation);
  pushQuery.equalTo("deviceType", "android");

  var payloadList = [];
  var promises = [];

  if(targetIds.indexOf(",") > -1) {

    var targetList = targetIds.split(',');
    var valueList = sharedValue.split(',');

    var targetListArray = [];

    for(var item in targetList) targetListArray.push(targetList[item]);

    for(var value in valueList) {
        var payload = {"senderId": senderId, "amount": valueList[value]};
        payloadList.push(payload);
    }

    pushQuery.containedIn("device_id", targetListArray);

    } else {
        pushQuery.equalTo("device_id", targetIds);
        var payload = {"senderId": senderId, "amount": sharedValue};
        payloadList.push(payload);
   }

   payloadList.forEach(function(payload, index){

      promises.push(sendPush(payload));

   });

  Parse.Promise.when(promises).then(function(){
      console.log("sending pushes on target devices ...");
  });

   function sendPush(payloadMessage){

       Parse.Push.send({
           where: pushQuery,
           data: payloadMessage,
       }, { success: function() {
           console.log("#### PUSH OK");
       }, error: function(error) {
           console.log("#### PUSH ERROR" + error.message);
       }, useMasterKey: true});

       response.success('success');
   }

});


Parse.Cloud.define('receiverChannel', function(request, response) {

    var params = request.params;
    var targetId = params.targetId;
    var recipientId = params.recipientId;

    var replyQuery = new Parse.Query(Parse.Installation);
    replyQuery.equalTo("deviceType", "android");
    replyQuery.equalTo("device_id", targetId);

    var payload = {"rec_id": recipientId, "sender_id": targetId};

    Parse.Push.send({
        where: replyQuery,
        data : payload,
    }, { success: function(){
        console.log("### PUSH REPLY OK");
    }, error: function(error){
        console.log("### PUSH REPLY ERROR" + error.message);
    }, useMasterKey: true });

    response.success('success');

});

Parse.Cloud.define('eventChannel', function(request, response) {

    var params = request.params;
    var senderId = params.senderId;
    var targetIds = params.targetIds;
    var eventName = params.eventName;
    var eventId = params.eventId;
    var eventUrl = params.eventUrl;

    var eventQuery = new Parse.Query(Parse.Installation);
    eventQuery.equalTo("deviceType", "android");

    if(targetIds.indexOf(",") > -1){
      var targetList = targetIds.split(',');
      var targetListArray = [];

      for(var item in targetList) targetListArray.push(targetList[item]);
      eventQuery.containedIn("device_id", targetListArray);

    }else eventQuery.equalTo("device_id", targetIds);

    var payload = {"senderId":senderId, "eventName":eventName, "eventId":eventId, "targetIds":targetIds, "eventUrl":eventUrl};

    Parse.Push.send({
        where: eventQuery,
        data : payload,
    }, { success: function(){
        console.log("### PUSH REPLY OK");
    }, error: function(error){
        console.log("### PUSH REPLY ERROR" + error.message);
    }, useMasterKey: true });

    response.success('success');

});

Parse.Cloud.define('ledgerChannel', function(request, response) {

  var params = request.params;
  var senderId = params.senderId;
  var eventId = params.eventId;
  var requestValue = params.requestValue;
  var paidValue = params.paidValue;
  var targetIds = params.targetIds;
  var totalAmount = params.totalAmount;

  var ledgerQuery = new Parse.Query(Parse.Installation);
  ledgerQuery.equalTo("deviceType", "android");

  if(targetIds.indexOf(",") > -1) {

    var targetList = targetIds.split(',');
    var targetListArray = [];

    for(var item in targetList) targetListArray.push(targetList[item]);
    ledgerQuery.containedIn("device_id", targetListArray);
  } else {
    ledgerQuery.equalTo("device_id", targetIds);
  }

  var payload = {"senderId":senderId, "eventId":eventId, "requestValue":requestValue, "paidValue":paidValue, "targetIds":targetIds, "totalAmount":totalAmount};

  Parse.Push.send({
      where: ledgerQuery,
      data : payload,
  }, { success: function(){
      console.log("### PUSH REPLY OK");
  }, error: function(error){
      console.log("### PUSH REPLY ERROR" + error.message);
  }, useMasterKey: true });

  response.success('success');

});

Parse.Cloud.define('thumbnailChannel', function(request, response) {

  var params = request.params;
  var sender = params.senderId;
  var profileUrl = params.profileUrl;
  var targetIds = params.targetIds;

  var imageQuery = new Parse.Query(Parse.Installation);
  imageQuery.equalTo("deviceType", "android");

  if(targetIds.indexOf(",") > -1) {
    var targetList = targetIds.split(',');
    var targetListArray = [];

    for(var item in targetList) targetListArray.push(targetList[item]);
    imageQuery.containedIn("device_id", targetListArray);
  }else {
    imageQuery.equalTo("device_id", targetIds);
  }

  var payload = {"senderId":sender, "profileUrl": profileUrl};

  Parse.Push.send({
      where: imageQuery,
      data : payload,
  }, { success: function(){
      console.log("### PUSH REPLY OK");
  }, error: function(error){
      console.log("### PUSH REPLY ERROR" + error.message);
  }, useMasterKey: true });

  response.success('success');

});

Parse.Cloud.define('nameChannel', function(request, response) {

  var params = request.params;
  var senderId = params.senderId;
  var name = params.name;
  var friendIds = params.targetIds;

  var nameQuery = new Parse.Query(Parse.Installation);
  nameQuery.equalTo("deviceType", "android");

  if(friendIds.indexOf(",") > -1) {
    var targetList = friendIds.split(',');
    var targetListArray = [];

    for(var item in targetList) targetListArray.push(targetList[item]);
    nameQuery.containedIn("device_id", targetListArray);
  }else {
    nameQuery.equalTo("device_id", friendIds);
  }

  var payload = {"senderId":senderId, "name": name};

  Parse.Push.send({
      where: nameQuery,
      data : payload,
  }, { success: function(){
      console.log("### PUSH REPLY OK");
  }, error: function(error){
      console.log("### PUSH REPLY ERROR" + error.message);
  }, useMasterKey: true });

  response.success('success');

});
