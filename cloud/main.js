Parse.Cloud.define('senderChannel', function(request, response) {
  var params = request.params;
  var senderId = params.senderId;
  var sharedValue = params.sharedValue;
  var recipientList = params.recipientList;
  var friendCount = params.friendCount;

var pushQuery = new Parse.Query(Parse.Installation);
pushQuery.equalTo("deviceType", "android");

if(friendCount > 1) {
   var friendList = recipientList.split(',');
   var friendListArray = [];

   for(var item in friendList) friendListArray.push(friendList[i]);

   pushQuery.containedIn("device_id", friendListArray);
   
} else pushQuery.equalTo("device_id", recipientList);

var payload = {"title": senderId, "alert": sharedValue};

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

