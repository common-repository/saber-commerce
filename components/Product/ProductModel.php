<?php

namespace SaberCommerce\Component\Product;

use \SaberCommerce\Template;

class ProductModel extends \SaberCommerce\Model {

	public $productId;
	public $wpPostId;
	public $title;
	public $price;
	public $sku;
	public $mainImage;
	public $table = 'product';

	public function fetch( $productId ) {

		global $wpdb;
		$where = '1=1';
		$where .= " AND id_product = $productId";
		$tss = $wpdb->get_results(
			"SELECT * FROM " .
			$this->tableName() .
			" WHERE $where"
		);

		foreach( $tss as $index => $product ) {

			$tss[ $index ] = $this->load( $product );

		}

		return $tss;

	}

	public function fetchAll() {

		global $wpdb;
		$where = '1=1';
		$results = $wpdb->get_results(
			"SELECT * FROM " .
			$this->tableName() .
			" WHERE $where" .
			" ORDER BY id_product DESC"
		);

		foreach( $results as $index => $row ) {

			$results[ $index ] = $this->load( $row );

		}

		return $results;

	}

	public function fetchLatest() {

		global $wpdb;
		$where = '1=1';
		$results = $wpdb->get_results(
			"SELECT * FROM " .
			$this->tableName() .
			" WHERE $where" .
			" ORDER BY id_product DESC" .
			" LIMIT 5"
		);

		foreach( $results as $index => $row ) {

			$results[ $index ] = $this->load( $row );

		}

		return $results;

	}

	public function fetchCount() {

		global $wpdb;
		$results = $wpdb->get_var(
			"SELECT COUNT(*) FROM " .
			$this->tableName()
		);

		return $results;

	}

	/*
	 * Fetch one product from database
	 */
	public function fetchOne( $productId ) {

		$this->productId = $productId;

		global $wpdb;
		$where = '1=1';
		$where .= " AND id_product = $productId";
		$result = $wpdb->get_results(
			"SELECT * FROM " .
			$this->tableName() .
			" WHERE $where" .
			" LIMIT 1"
		);

		if( empty( $result )) {
			return false;
		}

		$row = $result[0];
		$obj = $this->load( $row );
		return $obj;

	}

	function fetchByPostId( $postId ) {

		global $wpdb;
		$where = '1=1';
		$where .= " AND wp_post_id = $postId";
		$result = $wpdb->get_results(
			"SELECT * FROM " .
			$this->tableName() .
			" WHERE $where" .
			" LIMIT 1"
		);

		if( empty( $result )) {
			return false;
		}

		$row = $result[0];
		$obj = $this->load( $row );
		return $obj;

	}

	/*
	 * Loading function for single products
	 */
	public function load( $row ) {

		$product = new ProductModel();
		$product->productId   = $row->id_product;
		$product->wpPostId    = $row->wp_post_id;
		$product->title       = $row->title;
		$product->price       = $row->price;
		$product->sku         = $row->sku;
		$product->description = $row->description;

		if( $row->main_image > 0 ) {

			$product->mainImage = new \stdClass;
			$product->mainImage->id = $row->main_image;
			$product->mainImage->meta = wp_get_attachment_metadata( $product->mainImage->id );
			$product->mainImage->url = wp_get_attachment_url( $product->mainImage->id );

		}

		$product->permalink = get_permalink( $product->wpPostId );

		return $product;

	}

	public function save() {

		global $wpdb;
		$tableName = $wpdb->prefix . 'sacom_' . $this->table;

		$data = [
			'wp_post_id'  => $this->wpPostId,
			'title'       => $this->title,
			'sku'         => $this->sku,
			'description' => $this->description
		];

		if( $this->price ) {

			$data['price'] = $this->price;

		}

		if( $this->mainImage > 0 ) {

			$data['main_image'] = $this->mainImage;

		} else {

			$data['main_image'] = NULL;

		}

		if( !$this->productId ) {

			$result = $wpdb->insert( $tableName, $data );
			$this->productId = $wpdb->insert_id;

		} else {

			$result = $wpdb->update( $tableName, $data,
				[ 'id_product' => $this->productId ]
			);

		}

		return $result;

	}

	public function delete() {

		if( !$this->productId ) {
			return;
		}

		global $wpdb;
		$wpdb->delete( $this->tableName(), [
				'id_product' => $this->productId
			]
		);

	}

}
