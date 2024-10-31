<form id="workspace-edit-form" method="post">

	<h2>Add Workspace</h2>

	<!-- Need to make this autocomplete search of accounts -->
	<div>
		<label>Title</label>
		<input type="text" name="title" id="title" value="<?php print $title; ?>" />
	</div>

	<!-- Need to make this autocomplete search of accounts -->
	<div>
		<label>Account</label>
		<input type="text" name="account" id="account" value="<?php print $accountId; ?>" />
	</div>

	<div>
		<input type="submit" value="Save" />
	</div>

</form>
