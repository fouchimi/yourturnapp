Parse.Cloud.define('senderChannel', function(request, response) {
  var params = request.params;
  var senderId = params.senderId;
  var sharedValue = params.sharedValueList;
  var recipientList = params.recipientList;
  var friendCount = params.friendCount;

var pushQuery = new Parse.Query(Parse.Installation);
pushQuery.equalTo("deviceType", "android");

var payloadList = [];

if(friendCount > 1) {
   var friendList = recipientList.split(',');
   var valueList = sharedValue.split(',');
   var friendListArray = valueListArray =  [];

   for(var item in friendList) friendListArray.push(item);

   for(var item in valueList) valueListArray.push(item);

   for(int i= 0; i < valueListArray.length; i++) {
     var currentPayload = {"title": senderId, "alert": valueListArray[i]};
     payloadList.push(currentPayload);
   }

   pushQuery.containedIn("device_id", friendListArray);

   valueListArray.forEach(function(listItem, index){

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

} else {

  pushQuery.equalTo("device_id", recipientList);

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

