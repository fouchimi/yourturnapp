
Parse.Cloud.define('pushChannel', function(request, response) {
  var params = request.params;
  var receiver = params.receiver;
  var receiverId = params.receiverId;

  
  var pushQuery = new Parse.Query(Parse.Installation);
  pushQuery.equalTo("username", receiver);
  pushQuery.equalTo("deviceType", "android");
  pushQuery.equalTo("installationId", receiverId);

  Parse.Push.send({
  where: pushQuery,
  // Parse.Push requires a dictionary, not a string.
  data: {"alert": "The Giants scored!"},
  }, { success: function() {
     console.log("#### PUSH OK");
  }, error: function(error) {
     console.log("#### PUSH ERROR" + error.message);
  }, useMasterKey: true});

  response.success('success');
});
