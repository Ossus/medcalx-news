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
function NewsController($scope, $http, $location) {
	$scope.newsitems = [];
	$scope.didLoad = false;
	
	// the last-time-read date can be passed as URL path component in epoch time (/index.html#/1234567890)
	var ref_date = 0;
	var path = ($location.path().length > 1) ? $location.path().substr(1) : null;
	if (path) {
		ref_date = (new Date(1000 * path)).getTime();
	}
	
	// this method starts loading the news
	$scope.fetchNews = function() {
		$http.get('./posts.json')
		.then(function(json) {
			
			// filter out @-replies
			if (json && json.data && json.data.data && json.data.data.length > 0) {
				items = [];
				for (var i = 0; i < json.data.data.length; i++) {
					item = json.data.data[i];
					
					// was this deleted?
					if (item.is_deleted) {
						continue;
					}
					
					// is this a new item?
					if (ref_date > 0) {
						var my_date = Date.parse(item.created_at);
						item.is_new = (my_date > ref_date);
					}
					else {
						item.is_new = false;
					}
					
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

