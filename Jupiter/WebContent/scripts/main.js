(function() {
  /**
   * variables
   */
  var user_id = '1111';
  var user_fullname = 'John';
  var lng = -122.08;
  var lat = 37.38;

  /**
   * Initialize
   */
  function init() {
    // Register event listeners
    $('nearby-btn').addEventListener('click', laodNearbyItems);
    $('fav-btn').addEventListener('click', laodFavoriteItems);
    $('recommend-btn').addEventListener('click', laodRecommendedItems);

    var welcomeMsg = $('welcome-msg');
    welcomeMsg.innerHTML = 'welcome, ' + user_fullname;
    initGeoLocation();
  }

  //TODO:
  function initGeoLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(onPositionUpdated,
        onLoadPositionFailed, {
          maximumAge: 60000
        });
      showLoadingMsg('Retriving your location...');
    } else {
      onLoadPositionFailed();
    }
  }

  //Todo:
  function onPositionUpdated(position) {
    lat = position.coords.latitude;
    lng = position.coords.longitude;
    
    laodNearbyItems();a
  }

  //TODO:
  function onLoadPositionFailed() {
    console.warn('navigator.geolocation is not available');
    getGeoLocationFromIP();
  }

  //TODO:
  function getGeoLocationFromIP() {
    // Get location from http://ipinfo.io/json
    var url = 'http://ipinfo.io/json';
    var req = null;
    ajax('GET', url, req, 
      function(res) {
        var restul = JSON.parse(res);
        if ('loc' in result) {
          var loc = result.loc.split(',');
          lat = loc[0];
          lng = loc[1];
        } else {
          console.warn('Getting location by IP failed');
        }
        laodNearbyItems;
      }
    );
  }

  // ------------------
  // Helper Functions
  // ------------------

  /**
   * A helper function that makes a navigation button active
   * @param btnId -
   *          ID of the navigation button
   */
  function activateBtn(btnId) {
    var btns = document.getElementsByClassName('main-nav-btn');

    // deactivate all nav buttons 
    for (var i = 0; i < btns.length; i++) {
      btns[i].className = btns[i].className.replace(/\bactivate\b/, '');
    }

    // activate the button with btnId
    var btn = $(btnId);
    btn.className += ' activate';

  }

  //TODO
  function showLoadingMsg(msg) {
    var itemList = $('item-list');
    itemList.innerHTML = '<p class="notice"><i class="fa fa-spinner fa-spin"></i>' +
                          msg + 
                          '</p>';
  }

  //TODO
  function showWarningMsg(msg) {
    var itemList = $('item-list');
    itemList.innerHTML = '<p class="notcie"><i class="fa fa-exclamation-traingle"></i>' +
                          msg +
                          '</p>';
  }

  //TODO
  function showErrorMsg(msg) {
    var itemList = $('item-list');
    itemList.innerHTML = '<p class="notice"><i class="fa fa-exclamation-circle"></i>' +
                          msg +
                          '</p>';
  }

  /**
   * Helper function that creates a DOM element <tag, options...>
   * 
   * @param tag
   * @param options
   * @returns
   */
  function $(tag, options) {
    if (!options) {
      return document.getElementById(tag);
    }

    var element = document.createElement(tag);

    for (var option in options) {
      if (options.hasOwnProperty(option)) {
        element[option] = options[option];
      }
    }

    return element;
  }

  function hideElement(element) {
    element.style.display = 'none'; 
  }

  function showElement(element, style) {
    var displayStyle = style ? style : 'block';
    element.style.display = displayStyle;
  }

  /**
   * AJAX Helper
   * 
   * @param method - 
   *          GET|POST|PUT|DELETE
   * @param url -
   *          API endpoint
   * @param data
   * 
   * @param callback - 
   *          Successful callback
   * @param errorHandler - 
   *          Failed callback
   */
  function ajax(method, url, data, callback, errorHander) {
    var xhr = new XMLHttpRequest();
    
    xhr.open(method, url, true);

    //TDODO: onload
    xhr.onload = function() {
      if (xhr.status == 200) { //Successful
        callback(xhr.responseText);
      } else { //Failed
        errorHandler();
      }
    }

    //TODO: onerror
    xhr.onerror = function() {
      console.error("The request could not be completed!");
      errorHandler();
    }

    if (data == null) {
      xhr.send();
    } else {
      xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
      xhr.send(data);
    }

    // -------------------------------------
    // AJAX call server-side APIs
    // -------------------------------------

    /**
     * API #1
     * Load the nearby items
     * API endpoint: [GET] /search?user_id=1111&lat=37.38&lon=-122.08
     */
    function laodNearbyItems() {
      console.log('loadNearbyItems');
      activateBtn('nearby-btn');
      
      // Request parameters
      var url = './search';
      var params = 'user_id=' + user_id + 'lat' + lat + 'lon' + lng;
      var req = JSON.stringify({});

      // Display loading message
      showLoadingMsg("Loading nearby items...");

      // Make AJAX call
      ajax('GET', url + '?' + params, req, 
        // Successful callback
        function(res) {
          var items = JSON.parse(res);
          if (!items || items.length === 0) {
            showWarningMsg("No nearby item.");
          } else {
            itemList(items);
          }
        }, 
        // Failed callback
        function() {
          showErrorMsg("Cannot load nearby items.");
        }
      );
    }

    /**
     * API #2
     * Load favorite (or visited) items 
     * API endpoint: [GET] /history?user_id=1111
     */
    function laodFavoriteItems() {
      activateBtn('fav-btn');

      // Request parameters
      var url = './history';
      var params = 'user_id=' + user_id;
      var req = JSON.stringify({});

      // Display loading message
      showLoadingMsg("Loading favorite items...");

      // Make AJAX call
      ajax('GET', url + '?' + params, req,
        // Successful callback
        function(res) {
          var items = JSON.parse(res);
          if (!items || items.length === 0) {
            showWarningMsg("No favorite item.");
          } else {
          itemList(items);
          }
        }, 
        // Failed callback
        function() {
          showErrorMsg("Cannot load favorite items.");
        }
      );
    }
  }

  /**
   * API #3
   * Load recommended items
   * API endpoint: [GET] /recomendation?user_id=1111
   */
  function laodRecommendedItems() {
    activateBtn('recommend-btn');

    // Request parameters
    var url = './recommendation';
    var params = 'user_id' + user_id;
    var req = JSON.stringify({});

    // Display loading message
    showLoadingMsg("Loading favorite items...");

    // Make AJAX call
    ajax('GET', url + '?' + params, req, 
      // Successful callback
      function(res) {
        var items = JSON.parse(res)
        if (!items || items.length === 0) {
          showWarningMsg("No recommended item. Favorite some items to get recommendations!");
        } else {
          itemList(items);
        }
      }, 
      // Failed callback
      function() {
        showErrorMsg("Cannot load favorite items.");
      }
    );
  }

/**
 * API #4 
 * Toggle favorite (or visited) items
 * 
 * @param item_id -
 *          item business id
 * 
 * API endpoint: [POST]/[DELETE] /history/
 * request JSON data:
 * {user_id: 1111,
 *  visited: [list_of_business_ids]}
 */
function changeFavoriteItem(item_id) {
  // Check whether or not this item has been visited
  var li = $('item-' + item_id);
  var favIcon = $('fav-icon-' + item_id);
  var favorite = li.dataset.favorite !== 'true';

  // Request parameters
  var url = './history';
  var req = JSON.stringify(
    {
      user_id: user_id,
      favorite: [item_id]
    }
  );
  var method = favorite ? 'POST' : 'DELETE';

  ajax(method, url, req, function(res){
    var result = JSON.parse(res);
    if (result.result === 'SUCCESS') {
      li.dataset.favorite = favorite;
      favIcon.className = favorite ? 'fa fa-heart' : 'fa fa-heart-o';
    }
  });

  //TODO:
  // -------------------------------------
  // Create item list
  // -------------------------------------
  /**
   * List items
   * 
   * @param items -
   *          An array of item JSON objects
   */
  
  function listItems(items) {
    // Clear the current results
    var itemList = $('item-list');
    itemList.innerHTML = '';

    for (var i = 0; i < items.length; i++) {
      addItem(itemList, items[i]);
    }
  }

  /**
   * Add item to item list
   * 
   * @param itemList - 
   *          the 
   *          <ul id="item-list">
   *          tag
   * @param item - 
   *          item data JSON object
   */
  function addItem(itemList, item) {
    var item_id = item.item_id;

    // create the <li> tag and specify the id and class attributes
    var li = $('li', {
      id: "item-" + item_id,
      className: item
    });

    // set the data attributes
    li.dataset.item_id = item_id;
    li.dataset.favorite = item.favorite;

    // item image
    if (item.image_url) {
      li.appendChild($('img', {
        src: item.image_url
      }))
    } else {
      li.appendChild($('img', {
        src: 'https://assets-cdn.github.com/images/modules/logos_page/GitHub-Mark.png'
      }))
    }

    // section
    var section = $('div', {});

    // title
    var title = $('a', {
      href: item.url,
      target: '_blank',
      className: 'item-name'
    });
    title.innerHTML = item.name;
    section.appendChild(title);

    // category
    var category = $('p', {
      className: 'item-category'
    })
    category.innerHTML = 'Categories: ' + item.categories.joint(', ');
    section.appendChild(category);

    //TODO: might have a problem with showing 3.5 stars
    // stars
    var stars = $('div', {
      className: 'stars'
    });

    for (var i = 0; i < item.rating; i++) {
      var star = $('i', {
        className: 'fa fa-star'
      })
      stars.appendChild(star);
    }

    if (('' + item.rating).match(/\.5$/)) {
      stars.appendChild($('i', {
        className: 'fa fa-star-half-o'
      }));
    }

    // append stars to section
    section.appendChild(stars);
    // append section to <li> tag
    li.appendChild(section);

    // address
    var address = $('p', {
      className: 'item-address'
    });

    address.innerHTML = item.address.replace(/,/g, '<br/>').replace(/\"/g, '');
    li.appendChild(address);

    // favorite link
    var favLink = $('p', {
      className: 'fav-link'
    });

    favLink.onclick = function() {
      changeFavoriteItem(item_id);
    }

    favLink.appendChild($('i', {
      id: 'fav-icon-' + item_id,
      className: item.favorite ? 'fa fa-heart' : 'fa fa-heart-o'
    }));

    // append favLink to <li>
    li.appendChild(favLink);
    // append <li> to itemList
    itemList.appendChild(li);

  }



}




})()