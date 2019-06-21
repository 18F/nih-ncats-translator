import React from 'react';
import Autocomplete from 'react-autocomplete';
import PropTypes from 'prop-types';
import debounce from 'debounce-promise';
import BioLinkEntity from './models/BioLinkEntity';

const endpoint = 'https://api.monarchinitiative.org/api/search/entity';

class BioLinkAutocomplete extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
      selectedItem: null,
      entities: [],
    };

    this.requests = {};
    this.responses = {};
    this.makeResultsRequestSoon = debounce(this.makeResultsRequest, 250);
  }

  componentDidMount() {
    this.updateResults();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.value !== this.state.value) {
      this.updateResults();
    }
  }

  render() {
    return (
      <Autocomplete
        getItemValue={item => item.label}
        items={this.state.entities}
        renderItem={this.props.renderItem}
        renderInput={this.props.renderInput}
        renderMenu={this.props.renderMenu}
        value={this.state.value}
        onChange={this.onChange}
        onSelect={this.onSelect}
      />
    );
  }

  onChange = (event, value) => {
    this.setState({ value });

    if (this.state.selectedItem) {
      this.props.onDeselect(this.state.selectedItem);
      this.setState({ selectedItem: null });
    }
  }

  onSelect = (value, item) => {
    this.setState({ value, selectedItem: item });
    this.props.onSelect(item);
  }

  updateResults() {
    const { value } = this.state;

    if (!value) {
      this.setState({ entities: [] });
      return;
    }

    const cache = this.responses[value];

    if (cache) {
      this.setState({ entities: cache });
    } else {
      this.makeResultsRequestSoon(value);
    }
  }

  async makeResultsRequest(value) {
    if (this.requests[value]) {
      return;
    }

    this.requests[value] = this.fetchResults(value);
    const data = await this.requests[value];
    const results = data.docs.map(doc => BioLinkEntity.fromSolrDoc(doc));

    this.responses[value] = results;

    if (this.state.value === value) {
      this.setState({ entities: this.responses[value] });
    }
  }

  // Expose as a class method so it can be mocked in test
  // eslint-disable-next-line class-methods-use-this
  async fetchResults(value) {
    const response = await fetch(`${endpoint}/${encodeURIComponent(value)}`);
    return response.json();
  }
}

BioLinkAutocomplete.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
  onSelect: PropTypes.func,
  onDeselect: PropTypes.func,
  renderItem: PropTypes.func.isRequired,
  renderMenu: PropTypes.func.isRequired,
  renderInput: PropTypes.func.isRequired,
};

BioLinkAutocomplete.defaultProps = {
  value: '',
  onChange: () => {},
  onSelect: () => {},
  onDeselect: () => {},
};

export default BioLinkAutocomplete;
