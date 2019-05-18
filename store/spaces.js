import moment from 'moment';
import ical from "cal-parser";

const fetchDirectory = () => dispatch => fetch('https://directory.spaceapi.io/v2')
  .then(response => response.json())
  .then(json => dispatch(directoryFetched(json)));

const fetchSpaces = () => (dispatch, getState) => {
  dispatch(fetchDirectory()).then(() => {
    const spaces = Object.values(getState().spaces.directory);
    spaces.forEach(space => {
      dispatch(fetchSpace(space.url));
    })
  });
};

const fetchSpace = (url, forceFetch = false) => (dispatch, getState) => {
  const space = getState().spaces.directory[url];

  if(space
    && !space.data
    || moment(space.dataFetched).add(30, 'minutes') < Date.now()
    || forceFetch) {
    return fetch(url)
      .then(response => response.json())
      .then(json => dispatch(spaceFetched(url, json)));
  }
};

const fetchCalendar = (url, forceFetch = false) => (dispatch, getState) => {
  const calendarUrl = getCalendarUrl(getState().spaces.directory[url].data);
  if (calendarUrl
    || moment(getState().spaces.directory[url].eventsFetched).add(30, 'minutes') < Date.now()
    || forceFetch) {
    return fetch(calendarUrl)
      .then(response => response.text())
      .then(data => {
        if (data) {
          try {
            return ical.parseString(data);
          } catch (ex) {
            console.log("parsing calendar failed");
          }
        }
        return null;
      })
      .then(events => events ? dispatch(calendarFetched(url, events)) : null);
  }
};

const changeFavorite = url => (dispatch, getState) => {
  dispatch(
    favoriteChanged(
      url,
      getState().spaces.directory[url].favorite,
    )
  );
};

const getCalendarUrl = (space) => {
  if (space !== undefined
    && space.feeds
    && space.feeds.calendar
    && space.feeds.calendar.url) {
    return space.feeds.calendar.url;
  }
};

const favoriteChanged = (url, favorite) => ({
  type: 'FAVORITE_CHANGED',
  url,
  favorite: !favorite,
});

const calendarFetched = (url, events) => ({
  type: 'CALENDAR_FETCHED',
  url,
  events,
});

const directoryFetched = (directory) => ({
  type: 'DIRECTORY_FETCHED',
  directory,
});

const spaceFetched = (url, space) => ({
  type: 'SPACE_FETCHED',
  url,
  space,
});

export const actions = {
  fetchDirectory,
  fetchCalendar,
  fetchSpaces,
  fetchSpace,
  changeFavorite,
};

const initialState = {
  directory: {},
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'DIRECTORY_FETCHED':
      return {...state, directory: action.directory.reduce((dirObj, entry) => {
          dirObj[entry.url] = { ...state.directory[entry.url], ...entry };

          return dirObj;
        }, {})};
    case 'SPACE_FETCHED': {
      const directory = { ...state.directory };
      directory[action.url].data = action.space;
      directory[action.url].dataFetched = Date.now();

      return {...state, directory };
    }
    case 'CALENDAR_FETCHED': {
      const directory = { ...state.directory };
      directory[action.url].events = action.events.events;
      directory[action.url].eventsFetched = Date.now();

      return {
        ...state,
        directory,
      };
    }
    case 'FAVORITE_CHANGED': {
      const directory = { ...state.directory };
      directory[action.url].favorite = action.favorite;

      return {...state, directory };
    }
  }
  return state;
};
