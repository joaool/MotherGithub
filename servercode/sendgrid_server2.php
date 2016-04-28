<?php
// require 'vendor/autoload.php';
// require("C:/src/MotherGithub/servercode/sendgrid-php/sendgrid-php.php");
require("C:\src\MotherGithub\servercode\sendgrid-php\sendgrid-php.php");
unlink('E:\xampp\php\logs\php_error_log');
// unlink('php_error_log');
error_log("-xx- Beginning src/MotherGithub basic_server2.php - with images! OK", 0);
function build_img_files($imagesArr) {
	error_log("--- Inside  build_img_files", 0);
	// $ret = array();
	foreach($imagesArr as $imageRow){//{name: name, type: "image/jpg", content: srcContent};
		error_log("------ name = ".$imageRow->name);
		error_log("------ content = ".$imageRow->content);
		$file = $imageRow->name.".png";
		$data = base64_decode($imageRow->content);//base64_decode($img64);
		file_put_contents($file, $data);
		//$ret[] = $imageRow->name; //to test
		// $ret[] =array('E:/xampp/htdocs/pdojo/php/'.$imageRow->name.'.png', $imageRow->name.'.png', $imageRow->name);
		$ret[] =array('C:/src/MotherGithub/servercode/'.$imageRow->name.'.png', $imageRow->name.'.png', $imageRow->name);
	    // $type=gettype($imageRow);
		// error_log("------ type = ".$type,0);
	}
	return $ret;
}
$mailHTML=$_POST['mailHTML'];
$senderObj = json_decode($_POST['senderObj'],true);//a associative array inside am associative array
$imagesArr=json_decode($_POST['imagesArr'],0);
error_log("name=".$imagesArr[0]->name, 0);
$attach = build_img_files($imagesArr);
$recipientsArr=json_decode($_POST['recipientsArray'],0);
error_log("subject=".$senderObj['subject'], 0);
// error_log("inputValue=".$imagesArr[0]['name'], 0);
$subject=$senderObj['subject'];
$from_email=$senderObj['from_email'];

//http://codebeautify.org/base64-to-image-converter
error_log("names[0] = ".$attach[0][2],0);//an array with each position containing an array with 3 positions
error_log("names[1] = ".$attach[1][2],0);

//-----------------  Sendgrid API
$sendgrid = new SendGrid("joaool56","joaool12345");
error_log("after password subject=".$subject,0);
$email    = new SendGrid\Email();
error_log("after creating new",0);
// $attach[] = array('E:/xampp/htdocs/pdojo/php/template0.png', 'template0.png', 'template0');
// $attach[] = array('E:/xampp/htdocs/pdojo/php/template2.png', 'template2.png', 'template2');
foreach($attach as $param){//{name: name, type: "image/jpg", content: srcContent};
	$email->addAttachment($param[0],$param[1],$param[2]);
}
error_log("after foreach",0);
$email->addTo($recipientsArr)
	  // ->addAttachment('E:/xampp/htdocs/pdojo/php/button.png', 'button.png', 'logo-cid') //IT WORKS !
	  // ->addAttachment('E:/xampp/htdocs/pdojo/php/template0.png', 'template0.png', 'template0') //IT WORKS !
	  // ->addAttachment('E:/xampp/htdocs/pdojo/php/template2.png', 'template2.png', 'template2') //IT WORKS !
	  // ->addAttachment('./pdojo/php/button.png', 'button.png', 'logo-cid') //error!
	  //->addAttachment('./button.png', 'button.png', 'logo-cid') //ERROR
	  // ->addAttachment('button.png', 'button.png', 'logo-cid') //ERROR
	  // ->addAttachment('button.png', 'button.png', 'logo-cid') //ERROR
      ->setFrom($from_email)
      ->setSubject($subject)
      ->setHtml($mailHTML);
try {
	error_log("before calling sendgrid",0);
    $sgResponse = $sendgrid->send($email);
   	error_log("after calling sendgrid",0);
} catch(\SendGrid\Exception $e) {
    error_log("send grid error:".$e->getCode(), 0);
    foreach($e->getErrors() as $er) {
    	error_log("send grid error:".$er, 0);
    }
}
// $sendgrid->send($email);
// $dump=var_dump($sgResponse);
$dump=http_build_query($sgResponse, '', ', ');
error_log("all dump:".$dump, 0);
$body=$sgResponse->getBody();
$dump=http_build_query($body, '', ', ');
error_log("body dump:".$dump, 0);
// $inputValue = $json['subject'];

$response = '{"response":"'.$dump.'"}';
$doc = new DOMDocument();
//$doc->loadHTML('<html><body>Hello world<br></body></html>');
$doc->loadHTML('<html><body>'.$response.'</body></html>');
echo $doc->saveHTML();
?>