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
    this.results = results;
    const fragment = document.createDocumentFragment();
    results.forEach((result, index) => {
      const el = document.createElement('li');
      Object.assign(el, {
        className: 'result',
        textContent: result.text,
      });

      // Pass the value to the onSelect callback
      el.addEventListener('click', (event) => {
        this.selectItem(result);
      });

      el.addEventListener('mouseover', (event) => {
        this.hoverOnListItems(event.target, index);
      });

      fragment.appendChild(el);
    });
    return fragment;
  }

  selectItem(result) {
    const { onSelect } = this.options;
    if (typeof onSelect === 'function') onSelect(result.value);
    this.addSelectedItemToInput(result.text);
  }

  addSelectedItemToInput(text) {
    this.inputEl.value = text;
    this.listEl.innerHTML = '';
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
      this.handleKeyboardPress(event.which));

    return inputEl;
  }

  handleKeyboardPress(keyboardCode) {
    if(!this.results || this.results.length == 0) return;
    if (keyboardCode == 13) {
      // Enter pressed
      let selectedItemIndex = this.selectedItem % this.results.length;
      this.selectItem(this.results[selectedItemIndex]);
      return;
    } else if (keyboardCode == 38) {
      // Up arrow key pressed
      this.selectedItem --;
      if (this.selectedItem < 0)
        this.selectedItem += this.results.length;
    } else if (keyboardCode == 40) {
      // Down arrow key pressed
      this.selectedItem ++;
    }else{
      this.selectedItem = this.results.length;
    }
    this.changeSelectedOption();
  }

  changeSelectedOption() {
    for (let element of this.listEl.children) {
      element.classList.remove('result-hover');
    }
    let selectedItemIndex = this.selectedItem % this.results.length;
    this.listEl.children[selectedItemIndex].classList.add('result-hover');
  }

  // We need to reset selected option after mouse hover on list items.
  hoverOnListItems(eventTarget, index) {
    for (let element of this.listEl.children) {
      element.classList.remove('result-hover');
    }
    eventTarget.classList.add('result-hover');
    this.selectedItem = index;
  }

  init() {
    // Build query input
    this.inputEl = this.createQueryInputEl();
    this.rootEl.appendChild(this.inputEl)

    // Build results dropdown
    this.listEl = document.createElement('ul');
    Object.assign(this.listEl, { className: 'results' });
    this.rootEl.appendChild(this.listEl);
    this.selectedItem = 0;
  }
}
