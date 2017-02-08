<?php

	if(isset($_GET["id"])){
		$id = str_replace(' ', '',$_GET['id']);
		$shortRecordURL = "http://devel06:9220/searchservice-ws/items/" . $id . "/shortRecord"; 

		$fileContens = @file_get_contents($shortRecordURL);

		$json = json_decode($fileContens);
		
		if($json){
			$fileContens = @file_get_contents($shortRecordURL);
			$title = ($json->title);
		}else{
			$fileContens = $id;
		}
		
		echo $fileContens;
		
	}	
	
	if(isset($_GET["logtype"])){
		if (isset($_GET["date"])){
			$date = $_GET["date"];
		}else{
			$date = 'day1';
		}
		if($_GET["logtype"] == 'searchlog'){			
			$logArray = array();
			
			if($date == 'day2'){
				$logfile = fopen("logs/sessionslog2.txt","r");
			}else if($date == 'day3'){
				$logfile = fopen("logs/sessionslog3.txt","r");
			}else{
				$logfile = fopen("logs/sessionslog1.txt","r");
			}
			
			//while(! feof($logfile)){
			for($i = 0; $i<10000; $i++){ // just to keep iteration at a minimum
				$line = fgets($logfile);
				if (strpos($line, 'SEARCH') == true) {
					$advanced = false;
					$startSearch = strpos($line, 'SEARCH') + 9;
					$searchQuery = substr ( $line , $startSearch);
					$searchQuery = trim(preg_replace('/\s\s+/', ' ', $searchQuery)); // removing new lines characters from substring
					//$searchQuery = rtrim($searchQuery, '"'); // trimming last "
					$searchQuery = substr($searchQuery, 0, -1); // trimming last character
					$searchTime = substr ( $line , 20, 13);
					if(strpos($line, 'ADVANCED_SEARCH') == true){
						$advanced = true;
					}
					$tempObj = new stdClass();	// making new object
					$tempObj->search = $searchQuery; //populating object
					$tempObj->time = $searchTime; //populating object
					$tempObj->advanced = $advanced; //populating object
					$logArray[] = $tempObj; //Adding object to array			
				}				
			}
			fclose($logfile);			
			echo json_encode($logArray);					
		}
		
		if($_GET["logtype"] == 'fullpostlog'){	
			$logArray = array();
			
			if($date == 'day2'){
				$logfile = fopen("logs/sessionslog2.txt","r");
			}else if($date == 'day3'){
				$logfile = fopen("logs/sessionslog3.txt","r");
			}else{
				$logfile = fopen("logs/sessionslog1.txt","r");
			}
	
			//while(! feof($logfile)){
			for($i = 0; $i<10000; $i++){ // just to keep iteration at a minimum
				$line = fgets($logfile);
				if (strpos($line, 'SHOW_RECORD_INLINE') == true) {
					$advanced = false;
					$startRecord = strpos($line, 'SHOW_RECORD_INLINE') + 21;
					$recordId = substr ( $line , $startRecord);
					$recordId = trim(preg_replace('/\s\s+/', ' ', $recordId)); // removing new lines characters from substring
					//$searchQuery = rtrim($searchQuery, '"'); // trimming last "
					$recordId = substr($recordId, 0, -1); // trimming last character
					$searchTime = substr ( $line , 20, 13);
					$tempObj = new stdClass();	// making new object
					$tempObj->record = $recordId; //populating object
					$tempObj->time = $searchTime; //populating object
					$logArray[] = $tempObj; //Adding object to array			
				}				
			}
			fclose($logfile);			
			echo json_encode($logArray);					
		}
	}	
	
		
	
	/* This works 
	$testit = array();
	
	$object = new stdClass();
	$object->search = "søgestreng1";
	$testit[] = $object;
	$object = new stdClass();
	$object->search = "søgestreng2";
	$testit[] = $object;
	
	echo json_encode($testit);
	*/
	
	/* Making object with all
	$logfile = fopen("logs/sessionslog.txt","r");
	//while(! feof($logfile)){
	for($i = 0; $i<50; $i++){
		$line = fgets($logfile);
			//$searchQuery = $line;
			
			$tempObj = new stdClass();	// making new object
			$tempObj->obJline = $line; //populating object
			$logArray[] = $tempObj; //Adding object to array			
			
	}
	fclose($logfile);
	
	
	var_dump($logArray);
	*/

?>