Parse.Cloud.define('senderChannel', function(request, response) {
  var params = request.params;
  var senderId = params.senderId;
  var sharedValue = params.msg;
  var recipients = params.recipients;
  var count = params.friendCount;

  if(count > 1) {
     var friendListArray = sharedList = [];
     var friendList = recipients.split(",");
     var sharedValueList = sharedValue.split(",");

     for(var i in friendList) {
       friendListArray.push(friendList[i]);
       sharedList.push(sharedValueList[i]);
     }

     sharedList.forEach(function(listItem, index){
       var pushQuery = new Parse.Query(Parse.Installation);
       pushQuery.equalTo("device_id", friendListArray[index]);
       pushQuery.equalTo("deviceType", "android");
       Parse.Push.send({
         where: pushQuery,
         data: {"title": senderId, "alert": listItem, "senderId": senderId},
       }, { success: function() {
          console.log("#### PUSH OK");
       }, error: function(error) {
          console.log("#### PUSH ERROR" + error.message);
       }, useMasterKey: true});
       response.success('success');
     });
  } else {
     var pushQuery = new Parse.Query(Parse.Installation);
     pushQuery.equalTo("device_id", recipients);
     pushQuery.equalTo("deviceType", "android");
     Parse.Push.send({
     where: pushQuery,
     data: {"title": senderId, "alert": sharedValue, "senderId": senderId},
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

