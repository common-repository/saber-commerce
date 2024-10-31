<?php

print_r( $this->data, 1 );

?>

<div class="sacom-table-layout">

	<div class="sacom-table-row">

		<div class="label">
			<h3>User ID</h3>
		</div>

		<div class="data">
			<?php print $user->ID; ?>
		</div>

	</div>

	<div class="sacom-table-row">

		<div class="label">
			<h3>Username</h3>
		</div>

		<div class="data">
			<?php print $user->user_login; ?>
		</div>

	</div>

	<div class="sacom-table-row">

		<div class="label">
			<h3>Registration Date</h3>
		</div>

		<div class="data">
			<?php print $user->user_registered; ?>
		</div>

	</div>

</div>
