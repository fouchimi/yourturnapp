Parse.Cloud.define('senderChannel', function(request, response) {
  var params = request.params;
  var senderId = params.senderId;
  var sharedValue = params.msg;
  var recipients = params.recipients;
  var count = params.friendCount;

  if(count > 1) {
     var friendListArray = sharedListArray = [];
     var friendList = recipients.split(",");
     var sharedValueList = sharedValue.split(",");

     for(var i in friendList) {
       friendListArray.push(friendList[i]);
       sharedListArray.push(sharedValueList[i]);
     }

     for(var i=0; i < sharedListArray.length; i++) {
       var pushQuery = new Parse.Query(Parse.Installation);
       pushQuery.equalTo("device_id", friendListArray[i]);
       pushQuery.equalTo("deviceType", "android");
       pushQuery.count({
         success: function(number){
           if(number > 0){
             Parse.Push.send({
               where: pushQuery,
               data: {"title": senderId, "alert": sharedListArray[i], "senderId": senderId},
             }, { success: function() {
                console.log("#### PUSH OK");
             }, error: function(error) {
                console.log("#### PUSH ERROR" + error.message);
             }, useMasterKey: true});
             response.success('success');
           }
         },
         error: function(error){
          console.log("### ERROR" + error.message);
         }
       });
     }

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

