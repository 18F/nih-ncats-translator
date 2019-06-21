import React from 'react';
import { shallow } from 'enzyme';
import Autocomplete from 'react-autocomplete';
import { promisify } from 'util';
import BioLinkEntity from './models/BioLinkEntity';
import BioLinkAutocomplete from './BioLinkAutocomplete';

const nextTick = promisify(process.nextTick);

let wrapper;
let instance;
let entity;
let response;
let renderItem;
let renderMenu;
let renderInput;
let onSelect;
let onDeselect;
let autocompleteProps;

jest.useFakeTimers();

beforeEach(() => {
  renderItem = jest.fn();
  renderMenu = jest.fn();
  renderInput = jest.fn();
  onSelect = jest.fn();
  onDeselect = jest.fn();

  wrapper = shallow(
    <BioLinkAutocomplete
      renderItem={renderItem}
      renderMenu={renderMenu}
      renderInput={renderInput}
      onSelect={onSelect}
      onDeselect={onDeselect}
    />,
  );

  instance = wrapper.instance();
  autocompleteProps = wrapper.find(Autocomplete).props();
  response = {
    docs: [
      {
        id: 'WIKIPEDIA:Teresa_Carreño',
        iri: 'https://en.wikipedia.org/wiki/Teresa_Carre%C3%B1o',
        label: ['María Teresa Gertrudis de Jesús Carreño García'],
      },
    ],
  };

  instance.fetchResults = jest.fn(() => Promise.resolve(response));

  entity = new BioLinkEntity({
    id: 'WIKIPEDIA:Teresa_Carreño',
    iri: 'https://en.wikipedia.org/wiki/Teresa_Carre%C3%B1o',
    labels: ['María Teresa Gertrudis de Jesús Carreño García'],
  });
});

it('triggers onSelect when the autocomplete selects an item', () => {
  autocompleteProps.onSelect('Maria', entity);
  expect(onSelect).toHaveBeenCalledWith(entity);
});

it('uses the entity’s label as its value (what will be shown in the text input)', () => {
  expect(autocompleteProps.getItemValue(entity)).toEqual(entity.label);
});

it('updates the value when it changes', () => {
  autocompleteProps.onChange({}, 'M');
  expect(wrapper.state('value')).toEqual('M');
});

it('triggers onDeselect when an item is selected and the value changes', () => {
  autocompleteProps.onSelect('Maria', entity);
  autocompleteProps.onChange({}, 'Q');
  expect(onDeselect).toHaveBeenCalledWith(entity);
});

it('fetches entities 250ms after changes stop', () => {
  instance.fetchResults = jest.fn(() => Promise.resolve({
    docs: [],
  }));

  autocompleteProps.onChange({}, 'Q');
  expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 250);
  expect(instance.fetchResults).not.toHaveBeenCalled();

  jest.advanceTimersByTime(200);
  autocompleteProps.onChange({}, 'Qu');
  expect(instance.fetchResults).not.toHaveBeenCalled();

  jest.advanceTimersByTime(200);
  expect(instance.fetchResults).not.toHaveBeenCalled();

  jest.advanceTimersByTime(200);
  expect(instance.fetchResults).toHaveBeenCalledWith('Qu');
});

it('maps fetched entities to BioLinkEntity objects', async () => {
  autocompleteProps.onChange({}, 'Teresa');
  jest.runAllTimers();
  await nextTick();
  expect(wrapper.state('entities')).toEqual([entity]);
});

it('uses cached entities if it has already fetched that value', async () => {
  autocompleteProps.onChange({}, 'Teresa');
  jest.runAllTimers();
  await nextTick();
  autocompleteProps.onChange({}, 'Teres');
  jest.runAllTimers();
  await nextTick();
  autocompleteProps.onChange({}, 'Teresa');
  jest.runAllTimers();
  await nextTick();
  expect(instance.fetchResults).toHaveBeenCalledTimes(2);
});

it('does not issue duplicate requests if one is already mid-flight', () => {
  const resolves = [];

  instance.fetchResults = jest.fn(() => new Promise((res, rej) => {
    resolves.push(res);
  }));

  autocompleteProps.onChange({}, 'Teresa');
  jest.runAllTimers();
  autocompleteProps.onChange({}, 'Teres');
  jest.runAllTimers();
  autocompleteProps.onChange({}, 'Teresa');
  jest.runAllTimers();

  expect(resolves).toHaveLength(2);
});

it('does not update results to be the response if the request is for an out-of-date value', () => {
  const resolves = [];

  instance.fetchResults = jest.fn(() => new Promise((res, rej) => {
    resolves.push(res);
  }));

  autocompleteProps.onChange({}, 'Teresa');
  jest.runAllTimers();
  autocompleteProps.onChange({}, 'Teres');
  jest.runAllTimers();

  expect(wrapper.state('entities')).toEqual([]);
  resolves[0](response);
  expect(wrapper.state('entities')).toEqual([]);
});
