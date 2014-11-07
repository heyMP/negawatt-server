<?php

/**
 * @file
 * Contains \NegawattSatecMeterMigrate.
 */

class NegawattSatecMeterMigrate extends NegawattMigration {

  public $entityType = 'node';
  public $bundle = 'satec_meter';

  public $csvColumns = array(
    array('account', 'Account ref'),
    array('field_location', 'Location'),
    array('field_mac_address', 'MAC address'),
    array('field_place_locality', 'Locality'),
    array('field_place_address', 'Address'),
    array('field_place_description', 'Place Description'),
    array('field_meter_ip_address', 'Meter IP address'),
    array('field_meter_port', 'Meter port'),
    array('field_meter_id', 'Meter id'),
    array('country', 'Country'),
    array('field_last_processed', 'Last processed'),
    array('field_site_category', 'Site category'),
  );

  public $dependencies = array(
    'NegawattAccountMigrate',
    'NegawattSiteCategoryTermsMigrate',
  );

  public function __construct() {
    parent::__construct();

    // Map fields that don't need extra definitions.
    $field_names = array(
      'field_mac_address',
      'field_place_locality',
      'field_place_address',
      'field_place_description',
      'field_meter_ip_address',
      'field_meter_port',
      'field_meter_id',
      'field_last_processed',
    );
    $this->addSimpleMappings($field_names);

    $this
      ->addFieldMapping(OG_AUDIENCE_FIELD, 'account')
      ->sourceMigration('NegawattAccountMigrate');

    $this
      ->addFieldMapping(OG_ACCESS_FIELD)
      ->defaultValue(TRUE);

    $this
      ->addFieldMapping('uid')
      ->defaultValue('1');

    $this
      ->addFieldMapping('field_site_category', 'field_site_category')
      ->sourceMigration('NegawattSiteCategoryTermsMigrate')
      ->separator('|');
  }

  /**
   * Map field_location and field_address fields.
   */
  public function prepare($entity, $row) {
    $row->field_location = explode('|', $row->field_location);

    $wrapper = entity_metadata_wrapper('node', $entity);
    $wrapper->field_location->set(array(
      'lat' => $row->field_location[0],
      'lng' => $row->field_location[1],
    ));

    $wrapper->field_address->set(array(
      'country' => $row->country,
      'locality' => $row->field_place_locality,
    ));

  }
}
