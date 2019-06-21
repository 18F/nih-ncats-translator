import React from 'react';
import BioLinkEntitySelector from './BioLinkEntitySelector';

function App() {
  return (
    <React.Fragment>
      <main id="main-content">
        <section className="usa-section grid-container">
          <h1>Hello world!</h1>
          <p><span role="img" aria-label="waving hello">👋</span></p>
          <BioLinkEntitySelector />
        </section>
      </main>
    </React.Fragment>
  );
}

export default App;
