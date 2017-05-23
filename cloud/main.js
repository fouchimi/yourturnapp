
Parse.Cloud.define('pushChannel', function(request, response) {
  var params = request.params;
  var senderId = params.senderId;
  var message = params.alert;
  var recipients = params.recipients;
  var count = params.friendCount;

  
  var pushQuery = new Parse.Query(Parse.Installation);
  var friendListArray = [];
  var friendList = recipients.split(",");
  for(var i in friendList) {
     friendListArray.push(friendList[i]);
  }
  pushQuery.equalTo("deviceType", "android");
  pushQuery.containedIn("device_id", friendListArray);

  var payload = {"title": senderId + " sent you a message", "alert": message};

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
