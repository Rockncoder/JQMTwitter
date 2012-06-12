
// create our namespace
var RocknCoder = RocknCoder || {};

// this is the object that takes care of all of our twitter business
RocknCoder.Tweet = function () {
	var searchTerm = "",
		$appendTo,
		tmpl = "",
		numTweets = 10,

	init = function() {
		$appendTo = $("#tweets");
		tmpl = $("#tweet-template").html();
	},
	// load data from twitter
	load = function(search) {
		searchTerm = search || searchTerm;
		$.ajax({
			url: 'http://search.twitter.com/search.json?q='+searchTerm,
			type: 'GET',
			dataType: 'jsonp',
			success: function(data, textStatus, xhr) {
				var i, tweet, compiled;
				// clear all old tweets but not the search row
				$appendTo.find(".tweet").remove();
				// then redraw
				for (i = 0; i < data.results.length; i++) {
					tweet = data.results[i];
					tweet.timeAgo = timeAgo(tweet.created_at);
					compiled = _.template(tmpl, tweet);
					$appendTo.append(compiled);
					$appendTo.listview("refresh");
				}
			},
			error: function(jqXHR, textStatus, errorThrown){
				alert("error: "+errorThrown);
			}
		});
		// check again in 3 minutes
		setTimeout(RocknCoder.Tweet.load, 3*60*1000);
	},
	// format the time returned by Twitter
	timeAgo = function(dateString) {
		var rightNow = new Date(),
			then = new Date(dateString),
			diff = rightNow - then,
			second = 1000,
			minute = second * 60,
			hour = minute * 60,
			day = hour * 24,
			week = day * 7;

		// return blank string if unknown
		if (isNaN(diff) || diff < 0) {
			return "";
		}

		// within 2 seconds
		if (diff < second * 2) {
			return "right now";
		}

		if (diff < minute) {
			return Math.floor(diff / second) + " seconds ago";
		}

		if (diff < minute * 2) {
			return "about 1 minute ago";
		}

		if (diff < hour) {
			return Math.floor(diff / minute) + " minutes ago";
		}

		if (diff < hour * 2) {
			return "about 1 hour ago";
		}

		if (diff < day) {
			return  Math.floor(diff / hour) + " hours ago";
		}

		if (diff > day && diff < day * 2) {
			return "yesterday";
		}

		if (diff < day * 365) {
			return Math.floor(diff / day) + " days ago";
		}
		else {
			return "over a year ago";
		}
	};
	// only one function is visible, the load function
	return {
		load: load,
		init: init
	};
}();
