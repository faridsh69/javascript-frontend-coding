export default class Autocomplete {
  constructor(rootEl, options = {}) {
    options = Object.assign({ numOfResults: 10, data: [], url: '' }, options);
    Object.assign(this, { rootEl, options });

    this.init();
  }

  onQueryChange(query) {
    if(this.options.url){
      let url = this.options.url.replace('{query}', query)
        .replace('{numOfResults}', this.options.numOfResults);
      this.getUrlResponse(url);
    }else{
      let results = this.getResults(query, this.options.data);
      results = results.slice(0, this.options.numOfResults);
      this.updateDropdown(results);
    }
  }

  // Get response of ajax and render it to an array
  getUrlResponse(url) {
    fetch(url, { headers: { "Content-Type": "application/json; charset=utf-8" }})
      .then(res => res.json())
      .then(response => {
        let results = response.items.map(user => ({
          text: user.login,
          value: user.id
        }));
        this.updateDropdown(results);
      })
      .catch(err => {
        // handle ajax error
      });
  }

  /**
   * Given an array and a query, return a filtered array based on the query.
   */
  getResults(query, data) {
    if (!query) return [];

    // Filter for matching strings
    let results = data.filter((item) => {
      return item.text.toLowerCase().includes(query.toLowerCase());
    });

    return results;
  }

  updateDropdown(results) {
    this.listEl.innerHTML = '';
    this.listEl.appendChild(this.createResultsEl(results));
  }

  createResultsEl(results) {
    const fragment = document.createDocumentFragment();
    results.forEach((result) => {
      const el = document.createElement('li');
      Object.assign(el, {
        className: 'result',
        textContent: result.text,
      });

      // Pass the value to the onSelect callback
      el.addEventListener('click', (event) => {
        const { onSelect } = this.options;
        if (typeof onSelect === 'function') onSelect(result.value);
        this.addSelectedItemToInput(result.text);
      });

      fragment.appendChild(el);
    });
    return fragment;
  }

  addSelectedItemToInput(text) {
    this.inputEl.value = text;
    let event = document.createEvent('Event');
    event.initEvent('input', true, true);
    this.inputEl.dispatchEvent(event);
  }

  createQueryInputEl() {
    const inputEl = document.createElement('input');
    Object.assign(inputEl, {
      type: 'search',
      name: 'query',
      autocomplete: 'off',
    });

    inputEl.addEventListener('input', event =>
      this.onQueryChange(event.target.value));

    inputEl.addEventListener('keyup', event =>
      this.handleKeys(event.which));

    return inputEl;
  }

  handleKeys(keyboardCode) {
    // Up arrow key pressed
    if (keyboardCode == 38) {
      console.log('Up');
    }
    // Down arrow key pressed
    if (keyboardCode == 40) {
      console.log('Down');
    }
  }

  init() {
    // Build query input
    this.inputEl = this.createQueryInputEl();
    this.rootEl.appendChild(this.inputEl)

    // Build results dropdown
    this.listEl = document.createElement('ul');
    Object.assign(this.listEl, { className: 'results' });
    this.rootEl.appendChild(this.listEl);
  }
}
