<form id="account-edit-form" method="post">


	<?php

	// var_dump( $userList );

	?>

	<h2>Add Account</h2>

	<!-- Need to make this autocomplete search of accounts -->
	<div>
		<label>Title</label>
		<input type="text" name="title" id="title" value="<?php print $title; ?>" />
	</div>

	<!-- Need to make this autocomplete search of accounts -->
	<div>
		<label>WP User</label>
		<select name="wp_user_id" id="wp_user_id">
			<?php foreach( $userList as $user ) { ?>
				<option value="<?php print $user->ID; ?>">
					<?php print $user->data->user_nicename; ?>
				</option>
			<?php } ?>
		</select>
	</div>

	<div>
		<input type="submit" value="Save" />
	</div>

</form>

<script>

jQuery(document).ready(function() {
	jQuery('#wp_user_id').select2();
});

</script>
