<!DOCTYPE html>
<html  ng-app="logs">
	<head>	
		<title ng-bind="'Log tests &mdash; ' + title">Logtest</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
		<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.7/angular.min.js"></script>
		<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.7/angular-animate.js"></script>		
		<script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.7/angular-route.js"></script>
		
		<link type="text/css" href="logs.css" rel="stylesheet">
		
	</head>
	<body>
		<div id="wrapper">
			
			
			<wrapper-box></wrapper-box>	

		
		</div>
	<div id="spinner">Loading...</div>		
	<div id="overlay" onclick="$('#overlay, .modal').fadeOut(100);$('.blur').removeClass('blur')"></div>	
	<script src="js/app.js" ></script>	
	</body>
</html>