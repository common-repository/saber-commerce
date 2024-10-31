<?php



?>

<h1>Login Form</h1>

<form id="sacom_login_form" method="post">

	<label>Username</label>
	<input type="text" id="field-username" name="username" data-parsley-minlength="6" data-parsley-maxlength="16" />

	<label>Password</label>
	<input type="text" id="field-password" name="password" />

	<input type="submit" value="Login" />

</form>
