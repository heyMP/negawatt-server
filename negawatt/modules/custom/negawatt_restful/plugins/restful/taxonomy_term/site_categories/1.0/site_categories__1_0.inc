<?php

$plugin = array(
  'label' => t('Site categories'),
  'description' => t('The hierarchy of site categories.'),
  'resource' => 'site_categories',
  'bundle' => 'site_category',
  'class' => 'NegawattSiteCategoriesResource',
  'name' => 'site_categories__1_0',
  'entity_type' => 'taxonomy_term',
  'authentication_types' => TRUE,
  // Output the data in our own formatter.
//  'formatter' => 'electricity_hal_json',
);
//dpm($plugin);