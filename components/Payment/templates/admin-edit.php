<form id="invoice-edit-form" method="post">

	<h2>Add Invoice</h2>

	<div>
		<label>Memo</label>
		<input type="text" name="memo" id="memo" value="<?php print $memo; ?>" />
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
