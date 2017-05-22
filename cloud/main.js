
Parse.Cloud.define('pushChannel', function(request, response) {
  var params = request.params;
  var senderName = params.senderName;
  var senderId = params.senderId;
  var message = params.message;
  var recipients = params.recipients;
  var friendsNumber = params.count;

  
  var pushQuery = new Parse.Query(Parse.Installation);
  pushQuery.equalTo("deviceType", "android");
  //containedIn
  if(friendsNumber > 1) {
     var[] friendList = recipients.split(",");
     pushQuery.containedIn("device_id", friendList);
  }else {
     pushQuery.equalTo("device_id", recipients);

  }
  var payload = {"data": {"alert": message, "title": senderName + " send you a message" } };

  Parse.Push.send({
  where: pushQuery,
  data: payload,
  }, { success: function() {
     console.log("#### PUSH OK");
  }, error: function(error) {
     console.log("#### PUSH ERROR" + error.message);
  }, useMasterKey: true});

  response.success('success');
});
