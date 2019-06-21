import React from 'react';
import { shallow } from 'enzyme';
import BioLinkEntity from './models/BioLinkEntity';
import BioLinkEntitySelector from './BioLinkEntitySelector';
import BioLinkAutocomplete from './BioLinkAutocomplete';

let wrapper;
let autocompleteProps;
let entity;

beforeEach(() => {
  wrapper = shallow(<BioLinkEntitySelector />);
  autocompleteProps = wrapper.find(BioLinkAutocomplete).props();
  entity = new BioLinkEntity({
    id: 'WIKIPEDIA:Teresa_Carreño',
    iri: 'https://en.wikipedia.org/wiki/Teresa_Carre%C3%B1o',
    labels: ['María Teresa Gertrudis de Jesús Carreño García'],
  });
});

it('renders the selected item when one is selected, and removes it when deselected', () => {
  expect(wrapper.text()).not.toContain('Selected');

  autocompleteProps.onSelect({});
  expect(wrapper.text()).toContain('Selected');

  autocompleteProps.onDeselect({});
  expect(wrapper.text()).not.toContain('Selected');
});

it('passes a renderMenu function to the autocomplete which renders items', () => {
  const item = <div>{entity.label}</div>;

  expect(shallow(autocompleteProps.renderMenu([item])).contains(item)).toBe(true);
});

it('passes a renderItem function to the autocomplete which renders an entity', () => {
  expect(shallow(autocompleteProps.renderItem(entity)).text()).toContain(entity.label);
});

it('renders selected items differently', () => {
  const deselected = shallow(autocompleteProps.renderItem(entity, false));
  const selected = shallow(autocompleteProps.renderItem(entity, true));

  expect(deselected.html()).not.toEqual(selected);
});
