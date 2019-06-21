import BioLinkEntity from './BioLinkEntity';

it('requires an id and iri to be supplied', () => {
  const id = 'GO:0018764';
  const iri = 'http://purl.obolibrary.org/obo/GO_0018764';

  expect(() => new BioLinkEntity()).toThrow();
  expect(() => new BioLinkEntity({ id })).toThrow();
  expect(() => new BioLinkEntity({ iri })).toThrow();
  expect(() => new BioLinkEntity({ id, iri })).not.toThrow();
});

it('defaults the entity’s categories and labels attributes to empty arrays if not specified', () => {
  const required = { id: 'GO:0018764', iri: 'http://purl.obolibrary.org/obo/GO_0018764' };
  const categories = ['molecular function'];
  const labels = ['N-isopropylammelide isopropylaminohydrolase activity'];

  const neither = new BioLinkEntity(required);
  const withCategories = new BioLinkEntity({ categories, ...required });
  const withLabels = new BioLinkEntity({ labels, ...required });
  const withBoth = new BioLinkEntity({ categories, labels, ...required });

  expect(neither.categories).toEqual([]);
  expect(neither.labels).toEqual([]);
  expect(withCategories.categories).toEqual(categories);
  expect(withCategories.labels).toEqual([]);
  expect(withLabels.categories).toEqual([]);
  expect(withLabels.labels).toEqual(labels);
  expect(withBoth.categories).toEqual(categories);
  expect(withBoth.labels).toEqual(labels);
});

it('joins categories and labels into category and label attributes', () => {
  const entity = new BioLinkEntity({
    id: 'GO:0018764',
    iri: 'http://purl.obolibrary.org/obo/GO_0018764',
    categories: ['molecular function', 'thing two'],
    labels: ['N-isopropylammelide isopropylaminohydrolase activity', 'something'],
  });

  expect(entity.label).toBe('N-isopropylammelide isopropylaminohydrolase activity, something');
  expect(entity.category).toBe('molecular function, thing two');
});

it('can be constructed from a solr document', () => {
  // as returned from https://api.monarchinitiative.org/api/search/entity
  const entity = BioLinkEntity.fromSolrDoc({
    iri: 'http://purl.obolibrary.org/obo/GO_0018764',
    iri_std: 'http://purl.obolibrary.org/obo/GO_0018764',
    iri_eng: 'http://purl.obolibrary.org/obo/GO_0018764',
    iri_kw: 'http://purl.obolibrary.org/obo/GO_0018764',
    id: 'GO:0018764',
    id_std: 'GO:0018764',
    id_eng: 'GO:0018764',
    id_kw: 'GO:0018764',
    prefix: 'GO',
    label: ['N-isopropylammelide isopropylaminohydrolase activity'],
    label_std: ['N-isopropylammelide isopropylaminohydrolase activity'],
    label_eng: ['N-isopropylammelide isopropylaminohydrolase activity'],
    label_kw: ['N-isopropylammelide isopropylaminohydrolase activity'],
    definition: ['Catalysis of the reaction: N-isopropylammelide + H2O = cyanuric acid + isopropylamine.'],
    definition_std: ['Catalysis of the reaction: N-isopropylammelide + H2O = cyanuric acid + isopropylamine.'],
    definition_eng: ['Catalysis of the reaction: N-isopropylammelide + H2O = cyanuric acid + isopropylamine.'],
    definition_kw: ['Catalysis of the reaction: N-isopropylammelide + H2O = cyanuric acid + isopropylamine.'],
    synonym: ['AtzC'],
    synonym_std: ['AtzC'],
    synonym_eng: ['AtzC'],
    synonym_kw: ['AtzC'],
    edges: 2,
    category: ['molecular function'],
    category_std: ['molecular function'],
    category_eng: ['molecular function'],
    category_kw: ['molecular function'],
    leaf: true,
    _version_: 1628510782487527400,
    score: 165.76224,
  });

  expect(entity.id).toBe('GO:0018764');
  expect(entity.iri).toBe('http://purl.obolibrary.org/obo/GO_0018764');
  expect(entity.label).toBe('N-isopropylammelide isopropylaminohydrolase activity');
  expect(entity.category).toBe('molecular function');
});
