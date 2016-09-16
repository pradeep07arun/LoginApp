$('#regSection').hide();
function toggleLogin(){
	$('#loginSection').toggle();
	$('#regSection').toggle();	
}


$("#loginForm").submit(function(e){
	e.preventDefault();
	var email = $("#username").val();
	var pwd = MD5($("#password").val());
	$.post( "/loginUser", { "email": email, "password": pwd })
  	.done(function( data ) {
    	if(data.error){
    		alert("Invalid User");
    	} else {
    		console.log(data.token);
			//$(location).attr('href','/welcome');
    	}
  	});

});

if(localStorage.getItem("token")){
	console.log(localStorage.getItem("token"));
	$.get( "/", { "token": localStorage.getItem("token")})
		.done(function( data ) {
		if(data.error){
			
		} else {
			//$(location).attr('href','/welcome');
		}
		});
}


$('#regForm').submit(function(e){
	e.preventDefault();


	var fname = $("#firstname").val(); 
	var lname = $("#lastname").val();
	var email = $("#rusername").val();
	var pwd = MD5($("#rpassword").val());

	console.log("user"+fname+" "+lname);

	$.post( "/registerUser", { "firstname": fname, "lastname": lname, "email": email, "password": pwd })
  	.done(function( data ) {
    	if(data.error){
    		alert("Registration Failed");
    	} else {
    		console.log(data.token);
    		localStorage.setItem("token",data.token);

			// $(location).attr('href','/welcome');
    	}
  	});


});