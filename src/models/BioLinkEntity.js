const id = 'id';
const iri = 'iri';
const categories = 'categories';
const labels = 'labels';

class BioLinkEntity {
  constructor(attrs) {
    [id, iri, categories, labels].forEach((prop) => {
      this[prop] = attrs[prop];
    });

    [id, iri].forEach((prop) => {
      if (!this[prop]) {
        throw new Error(`Attribute '${prop}' is required.`);
      }
    });

    [categories, labels].forEach((prop) => {
      this[prop] = this[prop] || [];
    });
  }

  get label() {
    return this.labels.join(', ');
  }

  get category() {
    return this.categories.join(', ');
  }

  static fromSolrDoc(doc) {
    return new BioLinkEntity({
      id: doc.id,
      iri: doc.iri,
      categories: doc.category,
      labels: doc.label,
    });
  }
}

export default BioLinkEntity;
