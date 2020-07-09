import Autocomplete from './Autocomplete';
import usStates from './us-states';
import './main.css';


// US States
const data = usStates.map(state => ({
  text: state.name,
  value: state.abbreviation
}));
new Autocomplete(document.getElementById('state'), {
  data,
  onSelect: (stateCode) => {
    console.log('selected state:', stateCode);
  },
});

// Github Url
const url = 'https://api.github.com/search/users?q={query}&per_page={numOfResults}';

// Github Users
new Autocomplete(document.getElementById('gh-user'), {
  url,
  onSelect: (ghUserId) => {
    console.log('selected github user id:', ghUserId);
  },
});
