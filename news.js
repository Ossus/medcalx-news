/*************************************************
 *      The scripts for MedCalc's newsfeed.      *
 *    Created by Pascal Pfiffner, 2012-11-09     *
 *	Copyright 2012 MedCalc, all rights reserved  *
 *************************************************/


/**
 *	Our main module.
 */
var _main = angular.module('MedCalcNews', []);


/**
 *	The news controller.
 */
function NewsController($scope, $http) {
	$scope.newsitems = [];
	$scope.didLoad = false;
	
	// this method starts loading the news
	$scope.fetchNews = function() {
		$http.get('https://alpha-api.app.net/stream/0/users/@medcalc/posts')
		.then(function(json) {
			
			// filter out @-replies
			if (json && json.data && json.data.data && json.data.data.length > 0) {
				items = [];
				for (var i = 0; i < json.data.data.length; i++) {
					item = json.data.data[i];
					
					// do we have mentions?
					if ('entities' in item && 'mentions' in item.entities && item.entities.mentions.length > 0) {
						var allowed = true;
						
						// we have mentions, check that none is at the beginning of the post
						for (var m = 0; m < item.entities.mentions.length; m++) {
							var mention = item.entities.mentions[m];
							if (0 == mention.pos) {
								allowed = false;
								break;
							}
						}
						
						if (allowed) {
							items.push(item);
						}
					}
					else {
						items.push(item);
					}
				}
				
				$scope.newsitems = items;
			}
			$scope.didLoad = true;
		});
	}
	
	$scope.fetchNews();
}



