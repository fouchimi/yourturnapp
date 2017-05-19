
Parse.Cloud.define('pushChannel', function(req, res) {

  var title = req.title;
  var message = req.alert;
  var recipient = req.recipients;

  //var recipients[] = friendList.split(",");

  // Find devices associated with the recipient user
  var pushQuery = new Parse.Query(Parse.Installation);
  pushQuery.containedIn("username", recipient);

  // Send the push notification to results of the query
  Parse.Push.send({
    where: pushQuery,
    data: {
      alert: message
    }
  }).then(function() {
      response.success("Push was sent successfully.")
  }, function(error) {
      response.error("Push failed to send with error: " + error.message);
  });
});
