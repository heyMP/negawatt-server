<?php

/**
 * @file
 * Contains NegawattSatecMeterResource.
 */
class NegawattEntityMeterBase extends \NegawattEntityBaseNode {
  /**
   * Overrides \NegawattEntityBaseNode::publicFieldsInfo().
   */

  // Allow reading 100 meters at a time
  protected $range = 100;

  public function publicFieldsInfo() {
    $public_fields = parent::publicFieldsInfo();

    $public_fields['type'] = array(
      'property' => 'type',
    );

    $public_fields['location'] = array(
      'property' => 'field_location',
    );

    $public_fields['place_description'] = array(
      'property' => 'field_place_description',
    );

    $public_fields['place_address'] = array(
      'property' => 'field_place_address',
    );

    $public_fields['place_locality'] = array(
      'property' => 'field_place_locality',
    );

    $public_fields['account'] = array(
      'property' => OG_AUDIENCE_FIELD,
      'resource' => array(
        'account' => array(
          'name' => 'accounts',
          'full_view' => FALSE,
        ),
      ),
    );

    $public_fields['max_frequency'] = array(
      'property' => 'field_max_frequency',
    );

    $public_fields['meter_categories'] = array(
      'property' => 'nid',
      'process_callbacks' => array(
        array($this, 'meterCategories'),
      ),
    );

    return $public_fields;
  }

  /**
   * Process callback, That look all the parent of the categories Id of the
   * meter.
   *
   * @param id $value
   *   The meter ID.
   *
   * @return array
   *   A categories id array.
   */
  protected function meterCategories($value) {
    $wrapper = entity_metadata_wrapper('node', $value);
    $meter_category = $wrapper->field_meter_category->value();
    $categories = taxonomy_get_parents_all($meter_category[0]->tid);
    foreach ($categories as $category) {
      $categories_ids[] = $category->tid;
    }

    return $categories_ids;
  }
}