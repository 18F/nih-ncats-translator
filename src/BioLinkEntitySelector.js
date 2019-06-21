import React from 'react';
import BioLinkAutocomplete from './BioLinkAutocomplete';

class BioLinkEntitySelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedItem: null,
    };
  }

  render() {
    return (
      <React.Fragment>
        {this.state.selectedItem ? this.renderSelectedItem() : ''}
        <BioLinkAutocomplete
          renderInput={props => (
            <input className="usa-input width-mobile" {...props} />
          )}
          renderMenu={items => (
            <div children={items} />
          )}
          renderItem={(entity, isHighlighted) => (
            <div key={entity.id} className={isHighlighted ? 'text-bold' : ''}>{entity.label}</div>
          )}
          onSelect={item => this.setState({ selectedItem: item })}
          onDeselect={item => this.setState({ selectedItem: null })}
        />
      </React.Fragment>
    );
  }

  renderSelectedItem() {
    const item = this.state.selectedItem;
    return (
      <div className="margin-bottom-1">
        Selected: <a href={item.iri} target="_blank" rel="noopener noreferrer">{item.id}</a>
      </div>
    );
  }
}

export default BioLinkEntitySelector;
