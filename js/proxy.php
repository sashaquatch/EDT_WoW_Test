<?php
	//part A
	//if the key exists in the service, we will look for it
	if(array_key_exists('filename',$_REQUEST)){
		$filename = $_REQUEST['filename'];
	}
	//if not we will not
	else{
		echo "<strong>Need a <em>Filename</em> to fetch!</strong>";
		exit();
	}

	//PART B
	if(array_key_exists('format',$_REQUEST)){
		$format = $_REQUEST['format'];
	} else {
		$format = "text/json";
	}

	//PART C send the request to the server
	$fileData = file_get_contents($filename);
	
	//Part D format the content in it's type then display it
	header("content-type: $format");
	echo $fileData;
?>