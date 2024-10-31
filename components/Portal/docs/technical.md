# Portal Routes

Routing is handled primarily by doRouting(). The function begins by calling parseRouteRequest(). The parseRouteRequest() function parses the route from the location.hash where the route is set using hash bang format (#/route/path/[id]).
