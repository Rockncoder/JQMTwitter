
var RocknCoder = RocknCoder || {};
RocknCoder.Pages = RocknCoder.Pages || {};

// handles all of the page events and dispatches them to a handler, if one exists
RocknCoder.Pages.Kernel = function (event) {
	var that = this,
		eventType = event.type,
		pageName = $(this).attr("data-rockncoder-jspage");

	if (RocknCoder && RocknCoder.Pages && pageName && RocknCoder.Pages[pageName] && RocknCoder.Pages[pageName][eventType]) {
		RocknCoder.Pages[pageName][eventType].call(that);
	}
};

// hooks all of the page events
// uses "live" so that the event will stay hooked even if new elements are added later
RocknCoder.App = function () {
	$("div[data-rockncoder-jspage]").on(
		'pagebeforecreate pagecreate pagebeforeload pagebeforeshow pageshow pagebeforechange pagechange pagebeforehide pagehide pageinit',
		RocknCoder.Pages.Kernel).on(
		"pageinit", RocknCoder.hideAddressBar);
}();

// this is the handler for all page events
RocknCoder.Pages.twitter = function() {
	var pageshow = function () {
		RocknCoder.Tweet.init();
		$("#goSearch").tap(function(event){
			var search = $("#searchText").val();
			event.preventDefault();
			if(search){
				RocknCoder.Tweet.load(search);
			}
			return false;
		});
	};
	return {
		pageshow: pageshow
	};
}();
