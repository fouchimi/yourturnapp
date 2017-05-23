
Parse.Cloud.define('senderChannel', function(request, response) {
  var params = request.params;
  var senderId = params.senderId;
  var message = params.alert;
  var recipients = params.recipients;
  var count = params.friendCount;

  
  var pushQuery = new Parse.Query(Parse.Installation);
  if(count > 1) {
     var friendListArray = [];
     var friendList = recipients.split(",");
     for(var i in friendList) {
       friendListArray.push(friendList[i]);
     }
     pushQuery.containedIn("device_id", friendListArray);
  }else {
     pushQuery.equalTo("device_id", recipients);
  }
  pushQuery.equalTo("deviceType", "android");
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


Parse.Cloud.define('receiverChannel', function(request, response) {
  var params = request.params;
  var recipient = params.recipientId;
  var recipientName = params.recipientName;  

  var replyQuery = new Parse.Query(Parse.Installation);
  replyQuery.equalTo("deviceType", "android");
  replyQuery.equalTo("device_id", recipientId);

  var payload = {"rec_id": recipientId, "rec_name": recipientName};

  Parse.Push.send({
    where: replyQuery,
    data : payload,
    },{ success: function(){
       console.log("### PUSH REPLY OK");
    }, error: function(error){
       console.log("### PUSH REPLY ERROR" + error.message);
    }, useMasterKey, true });

    response.success('success');
 
});
