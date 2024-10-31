<?php

$m = new \SaberCommerce\Component\Workspace\WorkspaceModel;
$accountId = 1;
$r = $m->fetch( $accountId );

?>

<div class="container">
	<div class="row">
		<div class="col-12">
			<h1>Workspaces</h1>
			<table class="table">

				<thead>
					<th>Title</th>
				</thead>

				<tbody>
					<?php foreach( $r as $t ): ?>
					<tr>
						<td><?php print $t->title; ?></td>
					</tr>
					<?php endforeach; ?>
				</tbody>
			</table>
		</div>
	</div>
</div>
