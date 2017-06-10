Parse.Cloud.define('senderChannel', function(request, response) {

  var params = request.params;
  var senderId = params.senderId;
  var sharedValue = params.sharedValueList;
  var recipientList = params.recipientList;
  var friendCount = params.friendCount;

  var pushQuery = new Parse.Query(Parse.Installation);
  pushQuery.equalTo("deviceType", "android");

  var payloadList = [];
  var promises = [];

  if(friendCount > 1) {

    var friendList = recipientList.split(',');
    var valueList = sharedValue.split(',');

    var friendListArray = [];

    for(var item in friendList) friendListArray.push(friendList[item]);

    for(var value in valueList) {
        var payload = {"title": senderId, "alert": valueList[value]};
        payloadList.push(payload);
    }

    pushQuery.containedIn("device_id", friendListArray);

    } else {

        pushQuery.equalTo("device_id", recipientList);

        var payload = {"title": senderId, "alert": sharedValue};
        payloadList.push(payload);
   }

   payloadList.forEach(function(payload, index){

      promises.push(sendPush(payload));

   });

  Parse.Promise.when(promises).then(function(){
      console.log("All pushes have completed !!!");
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

Parse.Cloud.define('groupChannel', function(request, response) {

    var params = request.params;
    var senderId = params.senderId;
    var targetIds = params.targetIds;
    var groupName = params.groupName;


    var targetList = targetIds.split(',');
    var targetListArray = [];

    for(var item in targetList) targetListArray.push(targetList[item]);

    var groupQuery = new Parse.Query(Parse.Installation);
    groupQuery.equalTo("deviceType", "android");
    groupQuery.containedIn("device_id", targetListArray);

    var payload = {"senderId": senderId, "groupName": groupName};

    Parse.Push.send({
        where: groupQuery,
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
  var groupId = params.groupId;
  var totalAmount = params.totalAmount;
  var sharedValueList = params.sharedValueList;
  var recipients = params.recipients;

  var targetList = sharedValueList.split(',');
  var targetListArray = [];

  for(var item in targetList) targetListArray.push(targetList[item]);

  var ledgerQuery = new Parse.Query(Parse.Installation);
  ledgerQuery.equalTo("deviceType", "android");
  ledgerQuery.containedIn("device_id", targetListArray);

  var payload = {"groupId":groupId, "sharedValue":sharedValueList, "recipients":recipients, "totalAmount":totalAmount};

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

