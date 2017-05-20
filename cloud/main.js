
Parse.Cloud.define('pushChannel', function(request, response) {
  var params = request.params;
  var message = params.alert;
  var title = params.title;
  var receiverId = params.receiverId;

  
  var pushQuery = new Parse.Query(Parse.Installation);
  pushQuery.equalTo("deviceType", "android");

  var payload = {"alert": message, "title": title};

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
