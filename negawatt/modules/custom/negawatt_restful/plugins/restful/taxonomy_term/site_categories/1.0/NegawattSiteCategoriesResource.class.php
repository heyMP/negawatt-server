<?php

/**
 * @file
 * Contains NegawattElectricityResource.
 */

class NegawattSiteCategoriesResource extends RestfulEntityBaseTaxonomyTerm {

  /**
   * Overrides \RestfulEntityBase::publicFieldsInfo().
   */
  public function publicFieldsInfo() {
    $public_fields = parent::publicFieldsInfo();

    // Remove not necessary fields.
    unset($public_fields['label']);

    $public_fields['id'] = array(
      'property' => 'id'
    );

    $public_fields['name'] = array(
      'property' => 'name'
    );

    $public_fields['description'] = array(
      'property' => 'description'
    );

    dpm($public_fields);
    return $public_fields;
  }
}
